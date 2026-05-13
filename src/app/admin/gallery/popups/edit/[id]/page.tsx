export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { PopupForm } from "@/components/admin/PopupForm";
import { notFound } from "next/navigation";

export default async function EditPopupPage({
  params,
}: {
  params: { id: string };
}) {
  const popup = await prisma.popup.findUnique({
    where: { id: params.id },
  });

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
