export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

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
