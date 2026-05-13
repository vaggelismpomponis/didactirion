export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { SuccessStoryForm } from "@/components/admin/SuccessStoryForm";
import { notFound } from "next/navigation";

export default async function EditSuccessStoryPage({
  params,
}: {
  params: { id: string };
}) {
  const story = await prisma.successStory.findUnique({
    where: { id: params.id },
  });

  if (!story) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Επεξεργασία Επιτυχόντα</h1>
        <p className="text-sm text-slate-500">Ενημερώστε τα στοιχεία του μαθητή {story.name}.</p>
      </div>
      <SuccessStoryForm initialData={story} />
    </div>
  );
}
