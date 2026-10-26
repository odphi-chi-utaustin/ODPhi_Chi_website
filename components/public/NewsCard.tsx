import Link from "next/link";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { NEWS_TYPE_LABELS, type NewsPost } from "@/lib/news";

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex h-full flex-col border-t-[3px] border-scarlet bg-card-bg text-ink"
    >
      <PhotoFrame
        src={post.image_url}
        alt={post.title}
        label="Photo"
        className="h-44 w-full"
        sizes="(min-width: 768px) 33vw, 100vw"
      />
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="text-label text-scarlet">{NEWS_TYPE_LABELS[post.type]}</p>
        <p className="font-serif text-[22px] leading-tight transition-colors group-hover:text-scarlet">
          {post.title}
        </p>
        <p className="text-xs text-muted-light">
          {new Date(post.published_at).toLocaleDateString("en-US", {
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
