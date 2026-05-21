export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) {
    return { title: "Ανακοίνωση" };
  }
  const description =
    post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160) ||
    post.title;
  return createPageMetadata({
    title: post.title,
    description,
    path: `/announcements/${slug}`,
  });
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug: slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="pb-20">
      {/* Article Header */}
      <header className="bg-slate-50 border-b py-10 sm:py-16 mb-8 sm:mb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            <Link 
              href="/announcements" 
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#004a99] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Πίσω στις Ανακοινώσεις
            </Link>
            
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-[#004a99] hover:bg-[#004a99] uppercase text-[10px] px-3 py-0.5">
                {post.category || "Ανακοίνωση"}
              </Badge>
              <div className="flex items-center text-sm text-slate-500 gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString("el-GR", { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          {post.image && (
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-slate prose-lg max-w-none">
            {/* Split content by newlines to render paragraphs */}
            {post.content.split('\n').map((paragraph, i) => (
              paragraph.trim() && <p key={i} className="text-slate-600 leading-relaxed mb-6">{paragraph}</p>
            ))}
          </div>

          <div className="pt-12 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Μοιραστείτε το:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button asChild variant="ghost" className="text-[#004a99] font-bold">
              <Link href="/announcements">Δείτε όλες τις ανακοινώσεις</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
