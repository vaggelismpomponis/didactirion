export const revalidate = 3600;

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { Calendar, ArrowLeft, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parseMarkdownToHtml } from "@/lib/markdown";

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
    <article className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <Link 
            href="/announcements" 
            className="inline-flex items-center text-sm font-medium text-blue-200/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Πίσω στις Ανακοινώσεις
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur uppercase text-[10px] px-3 py-0.5 font-bold tracking-wider">
              {post.category || "Ανακοίνωση"}
            </Badge>
            <div className="flex items-center text-sm text-blue-100/70 gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString("el-GR", { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 max-w-4xl py-10 sm:py-14">
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

          <div 
            className="prose prose-slate prose-lg max-w-none text-slate-600"
            dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(post.content) }}
          />

          {/* ── Share & Navigation ── */}
          <div className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Μοιραστείτε το:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button asChild variant="ghost" className="text-primary font-bold hover:bg-primary/5">
              <Link href="/announcements">Δείτε όλες τις ανακοινώσεις</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── CTA Section ── */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="relative p-6 sm:p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black">Ενδιαφέρεστε για εγγραφή;</h2>
              <p className="text-blue-100/80 max-w-xl leading-relaxed">
                Επικοινωνήστε μαζί μας για να βρούμε το κατάλληλο πρόγραμμα για εσάς.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-xl shadow-black/20 shrink-0"
              style={{ height: "3.25rem" }}
            >
              <Link href="/contact" className="flex items-center gap-2">
                Επικοινωνία <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
