export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { PostsListClient } from "./PostsListClient";

async function getPosts() {
  return await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function PostsPage() {
  const posts = await getPosts();

  // Convert Date types to match client expectations if Next serialization complains, 
  // though Next.js handles Date objects in Server Actions/Props beautifully here.
  return <PostsListClient initialPosts={posts} />;
}
