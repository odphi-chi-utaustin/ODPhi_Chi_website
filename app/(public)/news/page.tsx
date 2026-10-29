import { ScarletRule } from "@/components/ui/ScarletRule";
import { NewsList } from "@/components/public/NewsList";
import { NewsletterSignup } from "@/components/public/NewsletterSignup";
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

        <div className="mt-20 grid gap-8 border-t border-border-light pt-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-eyebrow">Newsletter</p>
            <h2 className="text-subheading mt-2 text-ink">Get the news in your inbox</h2>
            <p className="text-body mt-3 text-ink-soft">
              Brother spotlights, chapter updates, and event invitations, sent
              straight to you.
            </p>
          </div>
          <NewsletterSignup source="news" />
        </div>
      </div>
    </div>
  );
}
