import { ScarletRule } from "@/components/ui/ScarletRule";
import { NewsList } from "@/components/public/NewsList";
import { getPublishedPosts } from "@/lib/news";

// Edits revalidate on save; this is a backstop if a fetch failed at build time.
export const revalidate = 3600;

export const metadata = {
  title: "News | Chi Chapter",
};

export default async function NewsPage() {
  const posts = await getPublishedPosts();
  return (
    <div className="bg-page-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <p className="text-eyebrow">News</p>
        <h1 className="text-display mt-2 text-ink">
          Chapter News &amp; Spotlights
        </h1>
        <div className="mt-8">
          <ScarletRule />
        </div>
        <NewsList posts={posts} />
      </div>
    </div>
  );
}
