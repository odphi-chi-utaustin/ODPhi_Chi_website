import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { emailFrom } from "@/lib/portal/config";
import { paragraphs } from "@/lib/news";
import type { Message } from "@/lib/portal/email";

export type Subscriber = {
  id: string;
  email: string;
  name: string;
  token: string;
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
};

export type Issue = {
  id: string;
  subject: string;
  body: string;
  sent_by: string;
  recipient_count: number;
  news_slug: string | null;
  sent_at: string;
};

// Portal only; callers gate with requireExec().
export async function getSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });
  if (error) throw error;
  return data as Subscriber[];
}

export async function getIssues(): Promise<Issue[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("newsletter_issues")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data as Issue[];
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Escaped paragraph with bare URLs turned into links and single newlines into <br>.
function paragraphHtml(p: string) {
  return escapeHtml(p)
    .replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)]/g, (url) => `<a href="${url}" style="color:#a30f26">${url}</a>`)
    .replace(/\n/g, "<br>");
}

const font = "Georgia, 'Times New Roman', serif";
const sans = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

// One subscriber's copy of an issue. Each gets their own unsubscribe link, plus the
// List-Unsubscribe headers Gmail and Yahoo use for their one-click unsubscribe button.
export function newsletterEmail(
  to: { email: string; token: string },
  issue: { subject: string; body: string; webUrl?: string | null },
  siteUrl: string,
): Message {
  const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${to.token}`;
  const oneClickUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${to.token}`;
  const paras = paragraphs(issue.body);

  const text = [
    issue.subject,
    "",
    paras.join("\n\n"),
    "",
    "— Chi Chapter of Omega Delta Phi",
    issue.webUrl ? `Read online: ${issue.webUrl}` : "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f3ec">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;font-family:${sans};color:#1b1917">
  <p style="margin:0;font-family:${font};font-size:24px;letter-spacing:1px">ΩΔΦ <span style="font-family:${sans};font-size:12px;letter-spacing:2px;color:#6b655a;text-transform:uppercase">Chi Chapter · Austin</span></p>
  <div style="height:2px;width:48px;background:#a30f26;margin:20px 0"></div>
  <h1 style="margin:0 0 20px;font-family:${font};font-weight:500;font-size:30px;line-height:1.2">${escapeHtml(issue.subject)}</h1>
  ${paras.map((p) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6">${paragraphHtml(p)}</p>`).join("\n  ")}
  <p style="margin:28px 0 0;font-size:15px">— Chi Chapter of Omega Delta Phi</p>
  <div style="border-top:1px solid #d9d2c3;margin-top:32px;padding-top:16px;font-size:12px;line-height:1.6;color:#6b655a">
    ${issue.webUrl ? `<a href="${issue.webUrl}" style="color:#6b655a">Read online</a> · ` : ""}You're getting this because you subscribed on our website.
    <a href="${unsubscribeUrl}" style="color:#6b655a">Unsubscribe</a>
  </div>
</div>
</body></html>`;

  return {
    from: emailFrom,
    to: to.email,
    subject: issue.subject,
    text,
    html,
    headers: {
      "List-Unsubscribe": `<${oneClickUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
