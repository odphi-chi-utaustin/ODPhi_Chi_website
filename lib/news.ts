import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type NewsType = "spotlight" | "newsletter" | "general";

export const NEWS_TYPE_LABELS: Record<NewsType, string> = {
  spotlight: "Alumni Spotlight",
  newsletter: "Newsletter",
  general: "General",
};

export type NewsPost = {
  id: string;
  slug: string;
  type: NewsType;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image_url: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
};

// Public pages. A news outage (or a missing table before 006_news.sql is run)
// shows "No posts yet" instead of taking down the homepage.
export async function getPublishedPosts(limit?: number): Promise<NewsPost[]> {
  try {
    let query = createSupabaseAdminClient()
      .from("news_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data as NewsPost[];
  } catch (err) {
    console.error("Couldn't load news posts", err);
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<NewsPost | null> {
  const { data } = await createSupabaseAdminClient()
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as NewsPost | null) ?? null;
}

// Portal: drafts included. Callers gate with requireExec().
export async function getAllPosts(): Promise<NewsPost[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("news_posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data as NewsPost[];
}

export async function getPost(id: string): Promise<NewsPost | null> {
  const { data } = await createSupabaseAdminClient()
    .from("news_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as NewsPost | null) ?? null;
}

// Blank-line-separated paragraphs, for rendering post bodies.
export function paragraphs(content: string) {
  return content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export function slugify(title: string) {
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
export async function uniqueSlug(base: string) {
  const { data } = await createSupabaseAdminClient()
    .from("news_posts")
    .select("slug")
    .like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r) => r.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

export function excerptFrom(content: string) {
  const first = paragraphs(content)[0] ?? "";
  return first.length > 180 ? `${first.slice(0, 177).trimEnd()}…` : first;
}
