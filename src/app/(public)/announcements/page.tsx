export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ArrowRight, Calendar, Search, Tag, Megaphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

const CATEGORIES = ["Όλα", "Ανακοινώσεις", "Εξετάσεις", "Νέα", "Άρθρα"];

export default async function AnnouncementsPage() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-white">

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight max-w-3xl">
            Ανακοινώσεις & Νέα
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed">
            Ενημερωθείτε για νέα του φροντιστηρίου, εγγραφές, εξετάσεις και εκπαιδευτικά άρθρα.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-8 order-1">
            {/* Category pills (display only — could be wired up) */}
            <div className="flex flex-wrap gap-2 pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${cat === "Όλα"
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "border-slate-200 text-slate-500 hover:border-primary/40 hover:text-primary bg-white"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {posts.length === 0 ? (
              <div className="bg-white py-20 rounded-3xl border border-slate-100 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Δεν βρέθηκαν ανακοινώσεις</h3>
                <p className="text-slate-400 text-sm">Προς το παρόν δεν υπάρχουν δημοσιευμένες ανακοινώσεις.</p>
              </div>
            ) : (
              <>
                {/* Featured first post */}
                {posts[0] && (
                  <Link href={`/announcements/${posts[0].slug}`} className="group block">
                    <article className="card-premium overflow-hidden">
                      <div className="aspect-[16/7] relative overflow-hidden bg-slate-100">
                        <img
                          src={posts[0].image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070"}
                          alt={posts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary text-white border-none font-bold uppercase text-[10px] tracking-wider">
                            Τελευταία
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <div className="flex items-center gap-2 text-xs text-white/60 mb-2 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(posts[0].createdAt).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })}
                          </div>
                          <h2 className="text-xl md:text-2xl font-black leading-snug mb-2 group-hover:text-blue-200 transition-colors">
                            {posts[0].title}
                          </h2>
                          <p className="text-white/70 text-sm line-clamp-2">{posts[0].content?.substring(0, 150)}...</p>
                        </div>
                      </div>
                    </article>
                  </Link>
                )}

                {/* Rest of posts */}
                {posts.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.slice(1).map((post) => (
                      <Link key={post.id} href={`/announcements/${post.slug}`} className="group block">
                        <article className="card-premium overflow-hidden h-full flex flex-col">
                          <div className="aspect-video relative overflow-hidden bg-slate-100">
                            <img
                              src={post.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070"}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-white/90 text-primary hover:bg-white border-none font-bold uppercase text-[10px] tracking-wider backdrop-blur">
                                {post.category || "Ανακοίνωση"}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-5 flex-grow flex flex-col gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.createdAt).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })}
                            </div>
                            <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 flex-grow">
                              {post.content?.substring(0, 120)}...
                            </p>
                            <div className="flex items-center gap-1.5 text-sm font-bold text-primary pt-1 group-hover:gap-2.5 transition-all">
                              Διαβάστε <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start order-2">
            {/* Search */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Αναζήτηση</h4>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Αναζητήστε νέα..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Κατηγορίες
              </h4>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(1).map((cat) => (
                  <button
                    key={cat}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary hover:bg-primary/5 bg-slate-50 transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 hero-gradient" />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative p-7 text-white space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-black">Εγγραφές</h4>
                <p className="text-blue-100/80 text-sm leading-relaxed">
                  Οι εγγραφές για το νέο σχολικό έτος είναι ανοικτές. Ελάτε να σχεδιάσουμε μαζί το μέλλον σας.
                </p>
                <Button asChild className="w-full bg-white text-primary hover:bg-white/90 font-bold">
                  <Link href="/contact">Επικοινωνία →</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
