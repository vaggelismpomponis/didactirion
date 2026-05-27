export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { SuccessStoryForm } from "@/components/admin/SuccessStoryForm";
import { notFound } from "next/navigation";

import { slugifyName } from "@/lib/teacher-slug";

export default async function EditSuccessStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try finding by raw ID first
  let story = await prisma.successStory.findUnique({
    where: { id },
  });

  // If not found by raw ID, search by slugified name
  if (!story) {
    const stories = await prisma.successStory.findMany();
    story = stories.find((s) => slugifyName(s.name) === id) || null;
  }

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
