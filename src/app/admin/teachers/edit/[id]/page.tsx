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
  
  // Try finding by raw ID first (in case of old bookmarks/direct DB links)
  let teacher = await prisma.teacher.findUnique({
    where: { id: slug },
  });

  // If not found by raw ID, search by slugified name
  if (!teacher) {
    const teachers = await prisma.teacher.findMany();
    teacher = teachers.find((t) => slugifyName(t.name) === slug) || null;
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

