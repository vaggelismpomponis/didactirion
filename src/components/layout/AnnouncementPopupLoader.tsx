"use client";

import dynamic from "next/dynamic";

const AnnouncementPopup = dynamic(
  () =>
    import("@/components/layout/AnnouncementPopup").then((m) => ({
      default: m.AnnouncementPopup,
    })),
  { ssr: false }
);

interface Popup {
  id: string;
  title: string;
  content: string | null;
  image: string | null;
  delay: number;
  duration: number;
}

export function AnnouncementPopupLoader({ popup }: { popup: Popup | null }) {
  return <AnnouncementPopup popup={popup} />;
}
