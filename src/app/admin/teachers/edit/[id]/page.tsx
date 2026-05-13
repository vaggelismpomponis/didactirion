import { prisma } from "@/lib/prisma";
import { TeacherForm } from "@/components/admin/TeacherForm";
import { notFound } from "next/navigation";

export default async function EditTeacherPage({
  params,
}: {
  params: { id: string };
}) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: params.id },
  });

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
