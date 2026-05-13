import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";

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

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
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

export function Footer() {
  return (
    <footer className="relative overflow-hidden">

      {/* ── Main footer body ── */}
      <div className="bg-slate-900 text-slate-200">
        <div className="container mx-auto px-4 pt-4 pb-12 md:pt-8 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

            {/* ── Brand Column ── */}
            <div className="space-y-6">
              <Link href="/" className="inline-block transition-transform hover:scale-105">
                <Image
                  src="/logo-main.png"
                  alt="Διδακτήριον Logo"
                  width={280}
                  height={112}
                  className="h-16 w-auto object-contain"
                />
              </Link>

              <p className="text-sm text-slate-400 leading-relaxed">
                Από το 2009, ο εκπαιδευτικός οργανισμός που οδηγεί τους μαθητές στην κορυφή με σύγχρονη μεθοδολογία και ολιγομελή τμήματα.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {[
                  { href: "https://www.facebook.com/didactirion", icon: Facebook, label: "Facebook", target: "_blank", rel: "noopener noreferrer" },
                  { href: "https://www.instagram.com/didactirion.gr/", icon: Instagram, label: "Instagram", target: "_blank", rel: "noopener noreferrer" },
                ].map(({ href, icon: Icon, label, target, rel }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    target={target}
                    rel={rel}
                    className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>

              {/* Tools */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Εργαλεία</p>
                {tools.map((t) => (
                  <Link
                    key={t.label}
                    href={t.href}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                  >
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div className="space-y-5">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-widest">Γρήγοροι Σύνδεσμοι</h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white flex items-center gap-2 group transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Contact ── */}
            <div className="space-y-5">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-widest">Επικοινωνία</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Φροντιστήριο+Διδακτήριον+Θρακομακεδόνων+97+Αχαρναί"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-all">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Διεύθυνση</p>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        Θρακομακεδόνων 97, Αχαρναί, 13672
                      </span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="tel:2102448542" className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Τηλέφωνο</p>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        210 2448542
                      </span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@didactirion.gr" className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Email</p>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        info@didactirion.gr
                      </span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            {/* ── Hours ── */}
            <div className="space-y-5">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-widest">Ωράριο</h3>
              <div className="space-y-3">
                {[
                  { day: "Δευτέρα – Παρασκευή", hours: "15:00 – 22:00" },
                  { day: "Σάββατο", hours: "09:00 – 16:00" },
                  { day: "Κυριακή", hours: "Κλειστά" },
                ].map((item) => (
                  <div key={item.day} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">{item.day}</p>
                      <p className={`text-sm font-bold ${item.hours === "Κλειστά" ? "text-slate-600" : "text-white"}`}>{item.hours}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 border border-white text-slate-900 rounded-xl px-5 py-3 text-sm font-bold transition-all shadow-lg shadow-white/5"
                >
                  Κλείστε ραντεβού
                  <span className="text-lg leading-none">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} Διδακτήριον. Με επιφύλαξη παντός δικαιώματος.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-slate-400 transition-colors">Πολιτική Απορρήτου</Link>
              <span>·</span>
              <Link href="/contact" className="hover:text-slate-400 transition-colors">Επικοινωνία</Link>
              <span>·</span>
              <Link href="/admin" className="hover:text-slate-400 transition-colors">Διαχείριση</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
