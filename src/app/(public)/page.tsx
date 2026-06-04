export const revalidate = 60;

import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Φροντιστήριο Μέσης Εκπαίδευσης Διδακτήριον",
  description:
    "Απαίτησε την κορυφή! Φροντιστήριο Μέσης Εκπαίδευσης στις Αχαρνές. Προγράμματα Γυμνασίου & Λυκείου, Πανελλαδικές, υπολογισμός μορίων.",
  path: "/",
});
import Image from "next/image";
import { ArrowRight, BookOpen, GraduationCap, Users, Calendar, CheckCircle, Star, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { AnnouncementPopupLoader } from "@/components/layout/AnnouncementPopupLoader";
import { HeroFallback } from "@/components/layout/HeroFallback";
import { ScrollReveal } from "@/components/providers/ScrollReveal";
import { HeroSlider } from "@/components/layout/HeroSlider";

async function getData() {
  try {
    const [banners, activePopup, latestPosts] = await Promise.all([
      prisma.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      prisma.popup.findFirst({ where: { active: true } }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    return { banners, activePopup, latestPosts };
  } catch (error) {
    console.error("Database connection error in getData:", error);
    return { banners: [], activePopup: null, latestPosts: [] };
  }
}

export default async function Home() {
  const { banners, activePopup, latestPosts } = await getData();

  return (
    <div className="flex flex-col">
      <AnnouncementPopupLoader popup={activePopup} />

      {/* ── Hero ── */}
      {banners.length > 0 ? <HeroSlider banners={banners} /> : <HeroFallback />}

      {/* ── Feature Cards (overlapping hero) ── */}
      <section className="container mx-auto px-4 -mt-8 sm:-mt-14 md:-mt-20 relative z-30 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Σύστημα Επιτυχίας",
              description: "Η μεθοδολογία μας που οδηγεί τους μαθητές μας στην κορυφή.",
              icon: GraduationCap,
              gradient: "from-blue-600 to-blue-800",
              href: "/organization/history",
            },
            {
              title: "Ανακοινώσεις",
              description: "Μείνετε ενημερωμένοι για νέα, εγγραφές και προγράμματα.",
              icon: BookOpen,
              gradient: "from-blue-600 to-blue-800",
              href: "/announcements",
            },
            {
              title: "Επικοινωνία",
              description: "Κλείστε ραντεβού για ενημέρωση και εγγραφή.",
              icon: Users,
              gradient: "from-blue-600 to-blue-800",
              href: "/contact",
            },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1} className="h-full">
              <Link href={item.href} className="group block h-full">
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100/50 overflow-hidden h-full">
                  <div className={`h-1.5 bg-gradient-to-r ${item.gradient}`} />
                  <div className="p-5 md:p-7 flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm flex-grow leading-relaxed">{item.description}</p>
                    <div className="flex items-center gap-1.5 text-primary font-bold text-sm mt-5 group-hover:gap-3 transition-all">
                      Περισσότερα <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="bg-slate-50 border-y py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "17+", label: "Χρόνια Εμπειρίας", icon: TrendingUp },
              { value: "2.000+", label: "Απόφοιτοι Μαθητές", icon: GraduationCap },
              { value: "98%", label: "Ποσοστό Επιτυχίας", icon: Award },
              { value: "4-5", label: "Μαθητές ανά Τμήμα", icon: Star },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Announcements ── */}
      {latestPosts.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center md:flex-row md:items-end md:text-left justify-between gap-4 mb-12">
              <div className="space-y-3">

                <h2 className="text-3xl md:text-4xl font-black text-slate-900">Τελευταία Νέα</h2>
                <p className="text-slate-500">Μείνετε ενημερωμένοι για όλες τις εξελίξεις.</p>
              </div>
              <Button asChild variant="outline" className="border-primary/30 text-primary font-bold hover:bg-primary/5 shrink-0">
                <Link href="/announcements" className="flex items-center gap-2">
                  Όλες οι ανακοινώσεις <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.1} className="h-full">
                <Link href={`/announcements/${post.slug}`} className="group block h-full">
                  <article className="card-premium overflow-hidden h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                      <Image
                        src={post.image || "/announcement-placeholder.png"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6 space-y-3 flex-grow flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.createdAt).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 text-base leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 flex-grow">
                        {post.content?.substring(0, 120)}...
                      </p>
                      <div className="flex items-center gap-1.5 text-primary font-bold text-sm pt-1 group-hover:gap-2.5 transition-all">
                        Διαβάστε περισσότερα <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Why Didactirion ── */}
      <section className="bg-slate-900 py-24 overflow-hidden relative">
        {/* Background blob */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image side */}
            <ScrollReveal direction="right" className="relative">
              <div className="relative aspect-[4/3] lg:aspect-square max-w-lg mx-auto">
                <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 opacity-30 blur-2xl" />
                <div className="relative h-full w-full rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                  <Image
                    src="/why-us.png"
                    alt="Students studying at Didactirion"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 90vw, 512px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                </div>
                {/* Badge overlay */}
                <div className="absolute top-2 left-2 sm:-top-4 sm:-left-4 bg-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-100 flex items-center gap-2">
                  <div>
                    <div className="text-xs font-black text-slate-900">2.000+</div>
                    <div className="text-[11px] text-slate-500">Απόφοιτοι</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Text side */}
            <ScrollReveal direction="left" className="space-y-8 text-white">
              <div>

                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight">
                  Γιατί να επιλέξετε το{" "}
                  <span className="text-gradient">Διδακτήριον</span>;
                </h2>
              </div>

              <p className="text-lg text-slate-400 leading-relaxed">
                Στο Διδακτήριον, πιστεύουμε ότι κάθε μαθητής έχει τις δυνατότητες να πετύχει.
                Με έμπειρο διδακτικό προσωπικό, σύγχρονες εγκαταστάσεις και εξατομικευμένη προσέγγιση,
                δημιουργούμε το ιδανικό περιβάλλον για μάθηση.
              </p>

              <ul className="space-y-4">
                {[
                  "Ολιγομελή τμήματα (4-5 μαθητές) για ουσιαστική επαφή",
                  "Συνεχής αξιολόγηση και διαγωνίσματα",
                  "Σύγχρονα εκπαιδευτικά εργαλεία (E-class, StudyBot)",
                  "Εξειδικευμένοι καθηγητές με πολυετή εμπειρία",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-slate-300 leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-12 shadow-xl w-full sm:w-auto">
                  <Link href="/organization/history">Μάθετε για εμάς</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/60 text-white hover:text-white bg-white/10 hover:bg-white/20 font-bold px-8 h-12 w-full sm:w-auto">
                  <Link href="/organization/teachers">Η ομάδα μας</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Programs Preview ── */}
      <section className="container mx-auto px-4 py-20">
        <ScrollReveal className="text-center space-y-3 mb-14">

          <h2 className="text-3xl md:text-4xl font-black text-slate-900">Προγράμματα Σπουδών</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Από το Γυμνάσιο έως τις Πανελλαδικές — ένα ολοκληρωμένο εκπαιδευτικό πρόγραμμα.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {[
            { title: "Γυμνάσιο", sub: "Α΄, Β΄, Γ΄", href: "/curricula/junior-high" },
            { title: "Λύκειο", sub: "Α΄, Β΄, Γ΄ Λυκείου", href: "/curricula/high-school" },
            { title: "ΕΠΑΛ", sub: "Επαγγελματικό Λύκειο", href: "/curricula/epal" },
            { title: "Πρότυπα", sub: "Πρότυπα Σχολεία", href: "/curricula/model-schools" },
          ].map((prog, i) => (
            <ScrollReveal key={i} delay={i * 0.08} className="h-full">
              <Link href={prog.href} className="group block h-full">
                <div className="rounded-2xl bg-slate-50 p-5 sm:p-6 h-full flex flex-col justify-between min-h-[140px] sm:min-h-[160px] shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:bg-white hover:-translate-y-1.5 transition-all duration-300 border border-slate-100">
                  <div>
                    <h3 className="font-black text-lg sm:text-xl mb-1 text-slate-900 group-hover:text-primary transition-colors">{prog.title}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm">{prog.sub}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 mt-4 text-primary opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff opacity=.03%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />
        <div className="container mx-auto px-4 text-center text-white relative z-10 space-y-8">
          <ScrollReveal>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mt-6 leading-tight">
              Έτοιμοι να ξεκινήσετε<br />το ταξίδι σας;
            </h2>
            <p className="text-base sm:text-xl text-blue-100/80 max-w-2xl mx-auto mt-4">
              Οι εγγραφές για τα νέα τμήματα έχουν ξεκινήσει.
              Επικοινωνήστε μαζί μας για να βρούμε το κατάλληλο πρόγραμμα για εσάς.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 font-bold px-12 h-14 text-lg shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all">
                <Link href="/contact">Εγγραφή Τώρα</Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-white/60 text-white hover:text-white bg-white/10 hover:bg-white/20 font-bold px-8 h-14 text-lg">
                <Link href="/points-calculator">Υπολογισμός Μορίων</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
