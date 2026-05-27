export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { BannerForm } from "@/components/admin/BannerForm";
import { notFound } from "next/navigation";

import { slugifyName } from "@/lib/teacher-slug";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  
  // Try finding by raw ID first
  let banner = await prisma.banner.findUnique({
    where: { id: slug },
  });

  // If not found by raw ID, search by slugified title or fallback
  if (!banner) {
    const banners = await prisma.banner.findMany();
    banner = banners.find((b) => {
      const bSlug = b.title ? slugifyName(b.title) : `banner-${b.order || b.id.slice(-6)}`;
      return bSlug === slug;
    }) || null;
  }

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
