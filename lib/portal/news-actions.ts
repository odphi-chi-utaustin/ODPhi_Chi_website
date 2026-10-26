"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireExec } from "@/lib/portal/auth";
import { paragraphs, NEWS_TYPE_LABELS, type NewsType } from "@/lib/news";
import type { ActionState } from "@/lib/portal/actions";

const BUCKET = "news-images";
// Vercel rejects request bodies over 4.5MB, so stay under it.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "post"
  );
}

// First of `base`, `base-2`, `base-3`, … not already taken.
async function uniqueSlug(base: string) {
  const { data } = await createSupabaseAdminClient()
    .from("news_posts")
    .select("slug")
    .like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r) => r.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

function excerptFrom(content: string) {
  const first = paragraphs(content)[0] ?? "";
  return first.length > 180 ? `${first.slice(0, 177).trimEnd()}…` : first;
}

// Storage path from a public URL we issued, so replaced photos can be cleaned up.
function storagePath(url: string | null) {
  const marker = `/${BUCKET}/`;
  const i = url?.indexOf(marker) ?? -1;
  return url && i >= 0 ? url.slice(i + marker.length) : null;
}

async function removeImage(url: string | null) {
  const path = storagePath(url);
  if (path) await createSupabaseAdminClient().storage.from(BUCKET).remove([path]);
}

// Uploads the form's photo, if any. Returns its public URL, null for no file, or an error.
async function uploadImage(file: FormDataEntryValue | null): Promise<string | null | { error: string }> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith("image/")) return { error: "The photo must be an image file." };
  if (file.size > MAX_IMAGE_BYTES) return { error: "Keep the photo under 4 MB." };

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const storage = createSupabaseAdminClient().storage.from(BUCKET);
  const { error } = await storage.upload(path, file, { contentType: file.type });
  if (error) return { error: `Photo upload failed: ${error.message}` };
  return storage.getPublicUrl(path).data.publicUrl;
}

function revalidateNews() {
  // Home, /news, and every /news/[slug]. The site is small; refresh it all.
  revalidatePath("/", "layout");
}

// Creates a post, or updates one when the form carries an `id`.
export async function savePost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireExec();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const content = str(formData, "content");
  const type = str(formData, "type") as NewsType;
  const date = str(formData, "date");
  if (!title) return { error: "Add a title." };
  if (!content) return { error: "Write the post." };
  if (!Object.hasOwn(NEWS_TYPE_LABELS, type)) return { error: "Pick a category." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Pick a date." };

  const fields = {
    title,
    content,
    type,
    excerpt: str(formData, "excerpt") || excerptFrom(content),
    author: str(formData, "author"),
    published: formData.get("published") === "on",
    // Noon UTC so the date reads the same in every US timezone.
    published_at: `${date}T12:00:00Z`,
    updated_at: new Date().toISOString(),
  };

  const admin = createSupabaseAdminClient();
  const existing = id
    ? (await admin.from("news_posts").select("image_url").eq("id", id).maybeSingle()).data
    : null;
  if (id && !existing) return { error: "That post no longer exists." };

  const uploaded = await uploadImage(formData.get("image"));
  if (uploaded && typeof uploaded === "object") return uploaded;

  let image_url: string | null = existing?.image_url ?? null;
  if (uploaded || formData.get("remove_image") === "on") {
    await removeImage(image_url);
    image_url = uploaded;
  }

  if (id) {
    const { error } = await admin.from("news_posts").update({ ...fields, image_url }).eq("id", id);
    if (error) return { error: error.message };
    revalidateNews();
    redirect("/portal/news");
  }

  const slug = await uniqueSlug(slugify(title));
  const { error } = await admin.from("news_posts").insert({ ...fields, image_url, slug });
  if (error) {
    await removeImage(image_url);
    return { error: error.message };
  }
  revalidateNews();
  return {
    success: fields.published ? `Posted. It's live at /news/${slug}.` : "Saved as a draft.",
  };
}

export async function setPostPublished(formData: FormData) {
  await requireExec();
  await createSupabaseAdminClient()
    .from("news_posts")
    .update({ published: str(formData, "published") === "true" })
    .eq("id", str(formData, "id"));
  revalidateNews();
}

export async function deletePost(formData: FormData) {
  await requireExec();
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("news_posts")
    .delete()
    .eq("id", str(formData, "id"))
    .select("image_url")
    .maybeSingle();
  await removeImage(data?.image_url ?? null);
  revalidateNews();
}
