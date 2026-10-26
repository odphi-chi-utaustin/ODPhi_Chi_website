import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConfirmForm } from "@/components/portal/ConfirmForm";
import { PostForm } from "@/components/portal/PostForm";
import { requireExec } from "@/lib/portal/auth";
import { getAllPosts, NEWS_TYPE_LABELS } from "@/lib/news";
import { formatDate } from "@/lib/portal/format";
import { setPostPublished, deletePost } from "@/lib/portal/news-actions";

export const metadata = { title: "News | Chi Chapter" };

export default async function PortalNewsPage() {
  const me = await requireExec();
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-3 text-lg font-medium">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-muted-light">No posts yet. Write the first one below.</p>
        ) : (
          <Card className="divide-y divide-border-light p-0">
            {posts.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-muted-light">
                      {NEWS_TYPE_LABELS[p.type]} · {formatDate(p.published_at)}
                      {p.author && ` · ${p.author}`}
                    </p>
                  </div>
                  {!p.published && <Badge variant="alumni">Draft</Badge>}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {p.published && (
                    <Link href={`/news/${p.slug}`} className="text-muted-light hover:text-scarlet">
                      View
                    </Link>
                  )}
                  <Link href={`/portal/news/${p.id}`} className="text-scarlet hover:underline">
                    Edit
                  </Link>
                  <form action={setPostPublished}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="published" value={p.published ? "false" : "true"} />
                    <button type="submit" className="text-muted-light hover:text-scarlet">
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <ConfirmForm action={deletePost} message={`Delete "${p.title}"? This can't be undone.`}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-muted-light hover:text-scarlet">Delete</button>
                  </ConfirmForm>
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>

      <Card>
        <h2 className="mb-4 text-lg font-medium">New post</h2>
        <PostForm defaultAuthor={me.name} />
      </Card>
    </div>
  );
}
