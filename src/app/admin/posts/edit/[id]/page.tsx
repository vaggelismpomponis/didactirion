export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try finding by raw ID first
  let post = await prisma.post.findUnique({
    where: { id },
  });

  // If not found by raw ID, search by slug
  if (!post) {
    post = await prisma.post.findUnique({
      where: { slug: id },
    });
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Επεξεργασία Ανακοίνωσης</h1>
        <p className="text-sm text-slate-500">Ενημερώστε το περιεχόμενο της ανακοίνωσης.</p>
      </div>
      <PostForm initialData={post} />
    </div>
  );
}
