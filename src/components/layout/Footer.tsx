"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, ExternalLink, ChevronUp } from "lucide-react";
import { defaultContactContent } from "@/app/(public)/contact/contact-content";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const quickLinks = [
  { label: "Ιστορία & Φιλοσοφία", href: "/organization/history" },
  { label: "Οι Καθηγητές μας", href: "/organization/teachers" },
  { label: "Προγράμματα Λυκείου", href: "/curricula/high-school" },
  { label: "Προγράμματα Γυμνασίου", href: "/curricula/junior-high" },
  { label: "Επιτυχόντες", href: "/organization/success-stories" },
  { label: "Ανακοινώσεις", href: "/announcements" },
  { label: "Υπολογισμός Μορίων", href: "/points-calculator" },
  { label: "Επικοινωνία", href: "/contact" },
];

const tools = [
  { label: "E-class Platform", href: "http://www.eclass.didactirion.gr/" },
  { label: "StudyBot AI", href: "https://studybot.employ.edu.gr/login" },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer({ contactContent = defaultContactContent }: { contactContent?: typeof defaultContactContent }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  const schedule = [
    { day: "Δευτέρα – Παρασκευή", hours: contactContent.hours_monday_friday, active: contactContent.hours_monday_friday !== "Κλειστά" },
    { day: "Σάββατο", hours: contactContent.hours_saturday, active: contactContent.hours_saturday !== "Κλειστά" },
    { day: "Κυριακή", hours: contactContent.hours_sunday, active: contactContent.hours_sunday !== "Κλειστά" },
  ];

  const contactDetails = [
    {
      icon: MapPin,
      label: "Διεύθυνση",
      content: `${contactContent.address_content}, ${contactContent.address_subContent}`,
      href: `https://www.google.com/maps/search/?api=1&query=Φροντιστήριο+Διδακτήριον+${encodeURIComponent(contactContent.address_content)}+Αχαρναί`,
    },
    {
      icon: Phone,
      label: "Τηλέφωνο",
      content: contactContent.phone_content,
      href: `tel:${contactContent.phone_content.replace(/\s+/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      content: contactContent.email_content,
      href: `mailto:${contactContent.email_content}`,
    },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        setScrollProgress((scrolled / scrollHeight) * 100);
      }

      if (scrolled > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="relative overflow-hidden" aria-label="Υποσέλιδο">
      {/* ── Gradient top border ── */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-primary to-blue-800" />

      {/* ── Main footer body ── */}
      <div className="relative bg-slate-900 text-slate-200">
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Gradient accent blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-800/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 sm:px-12 lg:px-16 max-w-7xl pt-14 pb-10 md:pt-16 md:pb-14 relative z-10">
          {/* ── Top tier: Brand + Links + Platforms ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-3 space-y-6">
              <Link href="/" className="inline-block transition-transform hover:scale-105">
                <Image
                  src="/logo-main.png"
                  alt="Διδακτήριον Logo"
                  width={280}
                  height={112}
                  sizes="280px"
                  className="h-16 w-auto object-contain"
                />
              </Link>

              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Από το 2009, ο εκπαιδευτικός οργανισμός που οδηγεί τους μαθητές στην κορυφή
                με σύγχρονη μεθοδολογία και ολιγομελή τμήματα.
              </p>

              {/* Social */}
              <div className="flex items-center gap-3">
                {[
                  { href: "https://www.facebook.com/didactirion", icon: Facebook, label: "Facebook" },
                  { href: "https://www.instagram.com/didactirion.gr/", icon: Instagram, label: "Instagram" },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 space-y-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
                Γρήγοροι Σύνδεσμοι
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white flex items-center gap-2.5 group transition-colors duration-200"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/60 group-hover:bg-primary group-hover:scale-150 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact column */}
            <div className="lg:col-span-4 space-y-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
                Επικοινωνία
              </h3>
              <div className="space-y-4">
                {contactDetails.map(({ icon: Icon, label, content, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={label === "Διεύθυνση" ? "_blank" : undefined}
                    rel={label === "Διεύθυνση" ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center text-slate-400 shrink-0 mt-0.5 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-200">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] mb-0.5">
                        {label}
                      </p>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">
                        {content}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Hours + Platforms column */}
            <div className="lg:col-span-3 space-y-6">
              {/* Hours */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
                  Ωράριο
                </h3>
                <div className="space-y-2.5">
                  {schedule.map((item) => (
                    <div key={item.day} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500 shrink-0 whitespace-nowrap">{item.day}</span>
                      <span
                        className={`text-xs font-bold whitespace-nowrap ${item.active ? "text-white" : "text-slate-600"
                          }`}
                      >
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Platforms */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                  Πλατφόρμες
                </p>
                <div className="flex flex-col gap-2">
                  {tools.map((t) => (
                    <a
                      key={t.label}
                      href={t.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 group"
                    >
                      {t.label}
                      <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA row ── */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Κλείστε ραντεβού ενημέρωσης
              </h4>
              <p className="text-sm text-slate-400">
                Ανακαλύψτε πώς μπορούμε να βοηθήσουμε τον μαθητή σας.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow-lg shadow-white/5 shrink-0"
            >
              Επικοινωνία
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/[0.06] relative z-10">
          <div className="container mx-auto px-6 sm:px-12 lg:px-16 max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} Διδακτήριον. Με επιφύλαξη παντός δικαιώματος.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <Link href="/privacy-policy" className="hover:text-slate-400 transition-colors">
                Πολιτική Απορρήτου
              </Link>
              <span className="text-slate-700">·</span>
              <Link href="/contact" className="hover:text-slate-400 transition-colors">
                Επικοινωνία
              </Link>
              <span className="text-slate-700">·</span>
              <Link href="/admin" className="hover:text-slate-400 transition-colors">
                Διαχείριση
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Back to top ── */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-12 h-12 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-all duration-300 backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95 ${isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        aria-label="Επιστροφή στην κορυφή"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="21"
            className="stroke-white/5 fill-none"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="24"
            r="21"
            className="stroke-primary fill-none transition-all duration-100"
            strokeWidth="2.5"
            strokeDasharray={2 * Math.PI * 21}
            strokeDashoffset={2 * Math.PI * 21 - (scrollProgress / 100) * 2 * Math.PI * 21}
            strokeLinecap="round"
          />
        </svg>
        <ChevronUp className="w-5 h-5 relative z-10" />
      </button>
    </footer>
  );
}
