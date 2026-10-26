import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { getPublishedPost, getPublishedPosts, paragraphs, NEWS_TYPE_LABELS } from "@/lib/news";

// Edits revalidate on save; this is a backstop if a fetch failed at build time.
export const revalidate = 3600;

// Prebuilds posts that exist at deploy time; newer ones render on first visit.
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPublishedPost((await params).slug);
  return { title: post ? `${post.title} | Chi Chapter` : "News | Chi Chapter" };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-page-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-6 pt-16 pb-20">
        <PhotoFrame src={post.image_url} alt={post.title} label="Photo" className="h-72 w-full" sizes="(min-width: 768px) 48rem, 100vw" />
        <Badge variant="active-light" className="mt-6">
          {NEWS_TYPE_LABELS[post.type]}
        </Badge>
        <h1 className="text-display mt-4 text-ink">{post.title}</h1>
        <p className="text-label mt-3 text-muted-light">
          {post.author && <>{post.author} ·{" "}</>}
          {new Date(post.published_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="mt-8 flex flex-col gap-5">
          {paragraphs(post.content).map((p, i) => (
            <p key={i} className="text-body whitespace-pre-line text-ink-soft">{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
