/** Production site URL (canonical domain). Override in Vercel env. */
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "https://www.didactirion.gr";
  return url.replace(/\/$/, "");
}
