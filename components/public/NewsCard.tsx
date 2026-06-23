import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { MockNewsPost } from "@/lib/mock-data";

const typeLabel: Record<MockNewsPost["type"], string> = {
  spotlight: "Alumni Spotlight",
  newsletter: "Newsletter",
  general: "General",
};

export function NewsCard({ post }: { post: MockNewsPost }) {
  return (
    <Link href={`/news/${post.slug}`}>
      <Card variant="dark" className="h-full transition-colors hover:border-scarlet">
        <div className="mb-4 h-32 rounded-lg bg-elevated" />
        <Badge variant="active-dark">{typeLabel[post.type]}</Badge>
        <p className="mt-3 text-sm font-medium text-white">{post.title}</p>
        <p className="mt-1 text-xs text-muted">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-body mt-3 text-silver">{post.excerpt}</p>
      </Card>
    </Link>
  );
}
