import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { mockNewsPosts, type MockNewsPost } from "@/lib/mock-data";

const typeLabel: Record<MockNewsPost["type"], string> = {
  spotlight: "Alumni Spotlight",
  newsletter: "Newsletter",
  general: "General",
};

export function generateStaticParams() {
  return mockNewsPosts.map((post) => ({ slug: post.slug }));
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = mockNewsPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-page-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-6 pt-16 pb-20">
        <PhotoFrame src={null} alt={post.title} label="Photo" className="h-72 w-full" sizes="(min-width: 768px) 48rem, 100vw" />
        <Badge variant="active-light" className="mt-6">
          {typeLabel[post.type]}
        </Badge>
        <h1 className="text-display mt-4 text-ink">{post.title}</h1>
        <p className="text-label mt-3 text-muted-light">
          {post.author} ·{" "}
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-body mt-8 text-ink-soft">{post.content}</p>
      </div>
    </div>
  );
}
