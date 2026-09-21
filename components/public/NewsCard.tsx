import Link from "next/link";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import type { MockNewsPost } from "@/lib/mock-data";

const typeLabel: Record<MockNewsPost["type"], string> = {
  spotlight: "Alumni Spotlight",
  newsletter: "Newsletter",
  general: "General",
};

export function NewsCard({ post }: { post: MockNewsPost }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex h-full flex-col border-t-[3px] border-scarlet bg-card-bg text-ink"
    >
      <PhotoFrame
        src={null}
        alt={post.title}
        label="Photo"
        className="h-44 w-full"
        sizes="(min-width: 768px) 33vw, 100vw"
      />
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="text-label text-scarlet">{typeLabel[post.type]}</p>
        <p className="font-serif text-[22px] leading-tight transition-colors group-hover:text-scarlet">
          {post.title}
        </p>
        <p className="text-xs text-muted-light">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
