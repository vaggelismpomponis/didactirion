export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { GalleryListClient } from "./GalleryListClient";

async function getBanners() {
  return await prisma.banner.findMany({ orderBy: { order: "asc" } });
}

async function getPopups() {
  return await prisma.popup.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function GalleryBannersPage() {
  const banners = await getBanners();
  const popups = await getPopups();

  return <GalleryListClient initialBanners={banners} initialPopups={popups} />;
}

