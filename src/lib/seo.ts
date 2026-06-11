import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Path without domain, e.g. `/organization/teachers` */
  path: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Διδακτήριον",
      locale: "el_GR",
      type: "website",
      images: [{ url: `${siteUrl}/logo-main-v2.png` }],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
