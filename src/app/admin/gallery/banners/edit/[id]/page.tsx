import { prisma } from "@/lib/prisma";
import { BannerForm } from "@/components/admin/BannerForm";
import { notFound } from "next/navigation";

export default async function EditBannerPage({
  params,
}: {
  params: { id: string };
}) {
  const banner = await prisma.banner.findUnique({
    where: { id: params.id },
  });

  if (!banner) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Επεξεργασία Banner</h1>
        <p className="text-sm text-slate-500">Ενημερώστε τα στοιχεία του banner.</p>
      </div>
      <BannerForm initialData={banner} />
    </div>
  );
}
