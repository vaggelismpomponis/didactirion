export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { GalleryListClient } from "./GalleryListClient";

async function getPopups() {
  return await prisma.popup.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function GalleryBannersPage() {
  const popups = await getPopups();

  return <GalleryListClient initialPopups={popups} />;
}

