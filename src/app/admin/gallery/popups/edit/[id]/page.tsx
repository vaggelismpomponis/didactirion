export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { PopupForm } from "@/components/admin/PopupForm";
import { notFound } from "next/navigation";

import { slugifyName } from "@/lib/teacher-slug";

export default async function EditPopupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  
  // Try finding by raw ID first
  let popup = await prisma.popup.findUnique({
    where: { id: slug },
  });

  // If not found by raw ID, search by slugified title
  if (!popup) {
    const popups = await prisma.popup.findMany();
    popup = popups.find((p) => slugifyName(p.title) === slug) || null;
  }

  if (!popup) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Επεξεργασία Popup</h1>
        <p className="text-sm text-slate-500">Ενημερώστε τα στοιχεία του αναδυόμενου παραθύρου.</p>
      </div>
      <PopupForm initialData={popup} />
    </div>
  );
}
