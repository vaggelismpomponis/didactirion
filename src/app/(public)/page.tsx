export const revalidate = 60;

import { Suspense } from "react";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Φροντιστήριο Μέσης Εκπαίδευσης Διδακτήριον",
  description:
    "Απαίτησε την κορυφή! Φροντιστήριο Μέσης Εκπαίδευσης στις Αχαρνές. Προγράμματα Γυμνασίου & Λυκείου, Πανελλαδικές, υπολογισμός μορίων.",
  path: "/",
});
import Image from "next/image";
import { ArrowRight, BookOpen, GraduationCap, Users, Calendar, CheckCircle, Star, TrendingUp, Award, Clock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { AnnouncementPopupLoader } from "@/components/layout/AnnouncementPopupLoader";
import { HeroFallback } from "@/components/layout/HeroFallback";
import { ScrollReveal } from "@/components/providers/ScrollReveal";
import { HeroSlider } from "@/components/layout/HeroSlider";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { defaultHomeContent } from "@/lib/home-content";
import { Editable } from "@/components/admin/Editable";

export { defaultHomeContent };

async function getData() {
  try {
    const [banners, activePopup, latestPosts, dbContent] = await Promise.all([
      prisma.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      prisma.popup.findFirst({ where: { active: true } }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      getPageContent("home"),
    ]);

    const content = mergeContent(defaultHomeContent, dbContent);
    return { banners, activePopup, latestPosts, content };
  } catch (error) {
    console.error("Database connection error in getData:", error);
    return { banners: [], activePopup: null, latestPosts: [], content: defaultHomeContent };
  }
}

export default async function Home() {
  const { banners, activePopup, latestPosts, content } = await getData();

  return (
    <Suspense fallback={null}>
      <div className="flex flex-col">
        <AnnouncementPopupLoader popup={activePopup} />

        {/* ── Hero ── */}
        {banners.length > 0 ? <HeroSlider banners={banners} /> : <HeroFallback />}

        {/* ── Feature Cards (overlapping hero) ── */}
        <section className="container mx-auto px-4 -mt-8 sm:-mt-14 md:-mt-20 relative z-30 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                titleId: "feature1_title" as const, descId: "feature1_desc" as const,
                title: content.feature1_title, description: content.feature1_desc,
                icon: GraduationCap, gradient: "from-blue-600 to-blue-800", href: "/organization/history",
              },
              {
                titleId: "feature2_title" as const, descId: "feature2_desc" as const,
                title: content.feature2_title, description: content.feature2_desc,
                icon: BookOpen, gradient: "from-blue-600 to-blue-800", href: "/announcements",
              },
              {
                titleId: "feature3_title" as const, descId: "feature3_desc" as const,
                title: content.feature3_title, description: content.feature3_desc,
                icon: Users, gradient: "from-blue-600 to-blue-800", href: "/contact",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="h-full">
                <Link href={item.href} className="group block h-full">
                  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100/50 overflow-hidden h-full">
                    <div className="p-5 md:p-7 flex flex-col h-full">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-slate-900"><Editable id={item.titleId}>{item.title}</Editable></h3>
                      <p className="text-slate-500 text-sm flex-grow leading-relaxed"><Editable id={item.descId}>{item.description}</Editable></p>
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

        {/* ── App.edu Promotion ── */}
        <section className="container mx-auto px-4 py-10">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-2xl">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-5 left-5 w-48 h-48 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-5 right-5 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 px-6 py-8 md:px-10 md:py-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                  {/* Text side */}
                  <div className="text-white space-y-4 order-2 lg:order-1 flex-1">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-blue-100">
                      <Smartphone className="w-3.5 h-3.5" />
                      Διαθέσιμο σε iOS & Android
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black leading-tight">
                      app.edu
                    </h2>
                    <p className="text-sm md:text-base text-blue-100/90 leading-relaxed max-w-md">
                      Εφαρμογή για Φροντιστήρια Μ.Ε. — Ενημερώσου για τα τελευταία νέα, τα προγράμματα σπουδών και πολλά ακόμη, απευθείας από το κινητό σου.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      {/* App Store Button */}
                      <a
                        href="https://apps.apple.com/us/app/app-edu/id1600713072"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 bg-black hover:bg-black/80 text-white rounded-lg px-4 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl shadow-lg"
                      >
                        <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current">
                          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                        </svg>
                        <div className="text-left">
                          <div className="text-[9px] uppercase tracking-wider opacity-80">Κατέβασε από το</div>
                          <div className="text-sm font-semibold -mt-0.5">App Store</div>
                        </div>
                      </a>

                      {/* Google Play Button */}
                      <a
                        href="https://play.google.com/store/apps/details?id=com.extend.appedugr&hl=el"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 bg-black hover:bg-black/80 text-white rounded-lg px-4 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl shadow-lg"
                      >
                        <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current">
                          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                        </svg>
                        <div className="text-left">
                          <div className="text-[9px] uppercase tracking-wider opacity-80">Διαθέσιμο στο</div>
                          <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Phone mockup side */}
                  <div className="order-1 lg:order-2 flex justify-center shrink-0">
                    <div className="relative w-36 md:w-44">
                      {/* Glow behind phone */}
                      <div className="absolute inset-0 bg-white/20 rounded-[2rem] blur-2xl scale-90" />
                      <Image
                        src="/app-edu-promo-white.png"
                        alt="app.edu mobile application"
                        width={176}
                        height={352}
                        className="relative z-10 drop-shadow-2xl mx-auto"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ── Stats Strip ── */}
        <section className="bg-slate-50 border-y py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { valueId: "stats_years" as const, labelId: "stats_years_label" as const, value: content.stats_years, label: content.stats_years_label, icon: TrendingUp },
                { valueId: "stats_students" as const, labelId: "stats_students_label" as const, value: content.stats_students, label: content.stats_students_label, icon: Clock },
                { valueId: "stats_success" as const, labelId: "stats_success_label" as const, value: content.stats_success, label: content.stats_success_label, icon: Award },
                { valueId: "stats_class_size" as const, labelId: "stats_class_size_label" as const, value: content.stats_class_size, label: content.stats_class_size_label, icon: Star },
              ].map((stat, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-4xl font-black text-slate-900"><Editable id={stat.valueId}>{stat.value}</Editable></div>
                    <div className="text-sm font-medium text-slate-500"><Editable id={stat.labelId}>{stat.label}</Editable></div>
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

                  <h2 className="text-3xl md:text-4xl font-black text-slate-900"><Editable id="news_title">{content.news_title}</Editable></h2>
                  <p className="text-slate-500"><Editable id="news_subtitle">{content.news_subtitle}</Editable></p>
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

                </div>
              </ScrollReveal>

              {/* Text side */}
              <ScrollReveal direction="left" className="space-y-8 text-white">
                <div>

                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight">
                    <Editable id="why_title">{content.why_title}</Editable>{" "}
                    <span className="text-gradient"><Editable id="why_title_highlight">{content.why_title_highlight}</Editable></span>;
                  </h2>
                </div>

                <p className="text-lg text-slate-400 leading-relaxed">
                  <Editable id="why_description" multiline>{content.why_description}</Editable>
                </p>

                <ul className="space-y-4">
                  {[
                    { id: "why_bullet1", text: content.why_bullet1 },
                    { id: "why_bullet2", text: content.why_bullet2 },
                    { id: "why_bullet3", text: content.why_bullet3 },
                    { id: "why_bullet4", text: content.why_bullet4 },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="text-slate-300 leading-relaxed"><Editable id={item.id}>{item.text}</Editable></span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-12 shadow-xl w-full sm:w-auto">
                    <Link href="/organization/history">Μάθετε για εμάς</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/60 text-white hover:text-white bg-white/10 hover:bg-white/20 font-bold px-8 h-12 w-full sm:w-auto">
                    <Link href="#">Η ομάδα μας</Link>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Programs Preview ── */}
        <section className="container mx-auto px-4 py-20">
          <ScrollReveal className="text-center space-y-3 mb-14">

            <h2 className="text-3xl md:text-4xl font-black text-slate-900"><Editable id="programs_title">{content.programs_title}</Editable></h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              <Editable id="programs_subtitle">{content.programs_subtitle}</Editable>
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[
              { title: "Γυμνάσιο", sub: "Α΄, Β΄, Γ΄", href: "/curricula/junior-high-a" },
              { title: "Λύκειο", sub: "Α΄, Β΄, Γ΄ Λυκείου", href: "/curricula/high-school-a" },
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
                <Editable id="cta_title" multiline>{content.cta_title.replace(/\n/g, " ")}</Editable>
              </h2>
              <p className="text-base sm:text-xl text-blue-100/80 max-w-2xl mx-auto mt-4">
                <Editable id="cta_subtitle" multiline>{content.cta_subtitle}</Editable>
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 font-bold px-12 h-14 text-lg shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all">
                  <Link href="/contact"><Editable id="cta_button1">{content.cta_button1}</Editable></Link>
                </Button>
                <Button size="lg" asChild variant="outline" className="border-white/60 text-white hover:text-white bg-white/10 hover:bg-white/20 font-bold px-8 h-14 text-lg">
                  <Link href="/points-calculator"><Editable id="cta_button2">{content.cta_button2}</Editable></Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </Suspense>
  );
}
