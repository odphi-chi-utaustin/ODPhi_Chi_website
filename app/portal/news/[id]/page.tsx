import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { PostForm } from "@/components/portal/PostForm";
import { requireExec } from "@/lib/portal/auth";
import { getPost } from "@/lib/news";

export const metadata = { title: "Edit post | Chi Chapter" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireExec();
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link href="/portal/news" className="text-sm text-muted-light hover:text-scarlet">
        ← All posts
      </Link>
      <Card>
        <h2 className="mb-4 text-lg font-medium">Edit post</h2>
        <PostForm post={post} />
      </Card>
    </div>
  );
}
