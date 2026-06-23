import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
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
    <div className="bg-black min-h-screen">
      <div className="mx-auto max-w-3xl px-6 pt-16 pb-20">
        <div className="h-64 rounded-xl bg-elevated" />
        <Badge variant="active-dark" className="mt-6">
          {typeLabel[post.type]}
        </Badge>
        <h1 className="text-display mt-4 text-white">{post.title}</h1>
        <p className="text-label mt-3 text-muted">
          {post.author} ·{" "}
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-body mt-8 text-silver">{post.content}</p>
      </div>
    </div>
  );
}
