"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireExec } from "@/lib/portal/auth";
import { sendEmails } from "@/lib/portal/email";
import { excerptFrom, slugify, uniqueSlug } from "@/lib/news";
import { isEmail, newsletterEmail, type Subscriber } from "@/lib/newsletter";
import type { ActionState } from "@/lib/portal/actions";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function siteUrl() {
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
}

// Adds or re-activates an address. Existing tokens are kept so old unsubscribe links still work.
async function upsertSubscriber(email: string, name: string, source: string) {
  return createSupabaseAdminClient()
    .from("newsletter_subscribers")
    .upsert({ email, name, source, unsubscribed_at: null }, { onConflict: "email" });
}

// ---- public ----

export async function subscribe(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const success = "You're subscribed. Look for the next issue in your inbox.";
  if (str(formData, "website")) return { success }; // honeypot
  const email = str(formData, "email").toLowerCase().slice(0, 320);
  if (!isEmail(email)) return { error: "Enter a valid email address." };

  const { error } = await upsertSubscriber(email, str(formData, "name").slice(0, 200), str(formData, "source").slice(0, 50));
  if (error) {
    console.error("[newsletter] subscribe failed:", error.message);
    return { error: "Couldn't subscribe you right now. Please try again in a minute." };
  }
  revalidatePath("/portal/newsletter");
  return { success };
}

// From the confirm button on /newsletter/unsubscribe. A button, not the link itself,
// so mail scanners that prefetch links don't unsubscribe people.
export async function unsubscribe(formData: FormData) {
  const token = str(formData, "token");
  if (/^[0-9a-f-]{36}$/i.test(token)) {
    await createSupabaseAdminClient()
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("token", token)
      .is("unsubscribed_at", null);
    revalidatePath("/portal/newsletter");
  }
  redirect("/newsletter/unsubscribe?done=1");
}

// ---- portal (exec only) ----

// Two buttons share this form: intent=test emails only the sender; intent=send emails everyone.
// `sentAt` is set after a real send so the composer can clear itself.
export type SendState = (NonNullable<ActionState> & { sentAt?: number }) | undefined;

export async function sendNewsletter(_prev: SendState, formData: FormData): Promise<SendState> {
  const me = await requireExec();
  if (!process.env.RESEND_API_KEY) return { error: "Email isn't set up yet: RESEND_API_KEY is missing." };

  const subject = str(formData, "subject");
  const body = str(formData, "body");
  if (!subject) return { error: "Add a subject." };
  if (!body) return { error: "Write the newsletter." };
  const url = await siteUrl();

  if (str(formData, "intent") === "test") {
    const sent = await sendEmails([
      newsletterEmail(
        { email: me.email, token: "00000000-0000-0000-0000-000000000000" },
        { subject: `[Test] ${subject}`, body },
        url,
      ),
    ]);
    return sent
      ? { success: `Test sent to ${me.email}. Nothing went to subscribers.` }
      : { error: "The test didn't send. Check the Resend dashboard for details." };
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("newsletter_subscribers")
    .select("email, token")
    .is("unsubscribed_at", null);
  if (error) return { error: error.message };
  const subscribers = data as Pick<Subscriber, "email" | "token">[];
  if (subscribers.length === 0) return { error: "There's no one on the list yet." };

  // Optional public copy on /news, which doubles as the newsletter archive.
  let newsSlug: string | null = null;
  if (formData.get("post_to_news") === "on") {
    newsSlug = await uniqueSlug(slugify(subject));
    const { error: postError } = await admin.from("news_posts").insert({
      slug: newsSlug,
      type: "newsletter",
      title: subject,
      content: body,
      excerpt: excerptFrom(body),
      author: me.name,
      published: true,
    });
    if (postError) return { error: `Couldn't post it to News: ${postError.message}. Nothing was sent.` };
    revalidatePath("/", "layout");
  }

  const webUrl = newsSlug ? `${url}/news/${newsSlug}` : null;
  const sent = await sendEmails(
    subscribers.map((s) => newsletterEmail(s, { subject, body, webUrl }, url)),
  );

  await admin.from("newsletter_issues").insert({
    subject,
    body,
    sent_by: me.name,
    recipient_count: sent,
    news_slug: newsSlug,
  });
  revalidatePath("/portal/newsletter");

  if (sent < subscribers.length) {
    return {
      error: `Only ${sent} of ${subscribers.length} emails went out. Check the Resend dashboard (the free plan caps sends at 100 a day) before resending.`,
    };
  }
  return { success: `Sent to ${sent} subscriber${sent === 1 ? "" : "s"}.`, sentAt: Date.now() };
}

// Paste a list (one per line, or comma-separated) to import existing addresses. Addresses
// already on the list are left alone, so exec can't re-add someone who unsubscribed.
export async function addSubscribers(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireExec();
  const emails = [...new Set(str(formData, "emails").toLowerCase().split(/[\s,;]+/).filter(Boolean))];
  const valid = emails.filter(isEmail);
  if (valid.length === 0) return { error: "Paste at least one email address." };

  const { error } = await createSupabaseAdminClient()
    .from("newsletter_subscribers")
    .upsert(
      valid.map((email) => ({ email, source: "added by exec" })),
      { onConflict: "email", ignoreDuplicates: true },
    );
  if (error) return { error: error.message };
  revalidatePath("/portal/newsletter");
  const skipped = emails.length - valid.length;
  return {
    success: `Added ${valid.length} address${valid.length === 1 ? "" : "es"}.${skipped ? ` Skipped ${skipped} that didn't look like emails.` : ""}`,
  };
}

// Marks them unsubscribed rather than deleting, so the opt-out sticks through later imports.
export async function removeSubscriber(formData: FormData) {
  await requireExec();
  await createSupabaseAdminClient()
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", str(formData, "id"));
  revalidatePath("/portal/newsletter");
}
