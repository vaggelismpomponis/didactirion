import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { prisma } from "@/lib/prisma";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/organization/history", changeFrequency: "monthly", priority: 0.8 },
  { path: "/organization/teachers", changeFrequency: "weekly", priority: 0.85 },
  {
    path: "/organization/success-stories",
    changeFrequency: "weekly",
    priority: 0.85,
  },
  { path: "/organization/gallery", changeFrequency: "monthly", priority: 0.7 },
  { path: "/curricula/junior-high", changeFrequency: "monthly", priority: 0.8 },
  { path: "/curricula/high-school", changeFrequency: "monthly", priority: 0.85 },
  { path: "/curricula/epal", changeFrequency: "monthly", priority: 0.75 },
  { path: "/curricula/alumni", changeFrequency: "monthly", priority: 0.75 },
  {
    path: "/curricula/model-schools",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  { path: "/exams/new-high-school", changeFrequency: "monthly", priority: 0.8 },
  { path: "/exams/panhellenic", changeFrequency: "monthly", priority: 0.85 },
  { path: "/exams/question-bank", changeFrequency: "monthly", priority: 0.75 },
  { path: "/exams/oefe", changeFrequency: "monthly", priority: 0.75 },
  { path: "/points-calculator", changeFrequency: "monthly", priority: 0.9 },
  { path: "/announcements", changeFrequency: "daily", priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  let posts: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // Build-time or missing DB: static routes only
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${siteUrl}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/announcements/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
