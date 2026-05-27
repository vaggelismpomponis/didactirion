export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { TeacherForm } from "@/components/admin/TeacherForm";
import { notFound } from "next/navigation";
import { slugifyName } from "@/lib/teacher-slug";

export default async function EditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  
  // 1. Try finding by raw slug first (in case it's a direct ID)
  let teacher = await prisma.teacher.findUnique({
    where: { id: slug },
  });

  // 2. Try extracting the ID if the URL is in the "name--id" format
  if (!teacher) {
    const parts = slug.split("--");
    const extractedId = parts.length > 1 ? parts[parts.length - 1] : slug;
    teacher = await prisma.teacher.findUnique({
      where: { id: extractedId },
    });
  }

  // 3. Try finding by pure slugified name (in case the ID is absent)
  if (!teacher) {
    const pureSlug = slug.split("--")[0];
    const teachers = await prisma.teacher.findMany();
    teacher = teachers.find((t) => slugifyName(t.name) === pureSlug) || null;
  }

  if (!teacher) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Επεξεργασία Καθηγητή</h1>
        <p className="text-sm text-slate-500">Ενημερώστε τα στοιχεία του καθηγητή {teacher.name}.</p>
      </div>
      <TeacherForm initialData={teacher} />
    </div>
  );
}

