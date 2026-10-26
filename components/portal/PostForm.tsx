import { ActionForm, inputClass, labelClass } from "@/components/portal/ActionForm";
import { savePost } from "@/lib/portal/news-actions";
import { NEWS_TYPE_LABELS, type NewsPost, type NewsType } from "@/lib/news";

// New post when `post` is omitted, otherwise edits it.
export function PostForm({ post, defaultAuthor }: { post?: NewsPost; defaultAuthor?: string }) {
  const date = (post?.published_at ?? new Date().toISOString()).slice(0, 10);

  return (
    <ActionForm action={savePost} submitLabel={post ? "Save changes" : "Create post"}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <label className={labelClass}>Title</label>
      <input name="title" required defaultValue={post?.title} className={inputClass} />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Category</label>
          <select name="type" defaultValue={post?.type ?? "general"} className={inputClass}>
            {(Object.keys(NEWS_TYPE_LABELS) as NewsType[]).map((t) => (
              <option key={t} value={t}>{NEWS_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Author</label>
          <input name="author" defaultValue={post?.author ?? defaultAuthor} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Date</label>
          <input name="date" type="date" required defaultValue={date} className={inputClass} />
        </div>
      </div>

      <label className={labelClass}>Post</label>
      <textarea
        name="content"
        required
        rows={10}
        defaultValue={post?.content}
        className={`${inputClass} h-auto py-2 leading-relaxed`}
      />
      <p className="text-xs text-muted-light">Leave a blank line between paragraphs.</p>

      <label className={labelClass}>Summary (optional)</label>
      <textarea
        name="excerpt"
        rows={2}
        defaultValue={post?.excerpt}
        className={`${inputClass} h-auto py-2`}
      />
      <p className="text-xs text-muted-light">Shown on the news cards. Defaults to the first paragraph.</p>

      <label className={labelClass}>Photo (optional, under 4 MB)</label>
      <input name="image" type="file" accept="image/*" className="text-sm" />
      {post?.image_url && (
        <label className="flex items-center gap-2 text-sm text-muted-light">
          <input type="checkbox" name="remove_image" />
          Remove the current photo (
          <a href={post.image_url} target="_blank" rel="noreferrer" className="text-scarlet hover:underline">view</a>)
        </label>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? true} />
        Published (visible on the public site)
      </label>
    </ActionForm>
  );
}
