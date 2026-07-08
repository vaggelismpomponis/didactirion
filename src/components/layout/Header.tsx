"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Phone, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { defaultContactContent } from "@/app/(public)/contact/contact-content";

const MobileMenu = dynamic(
  () => import("./MobileMenu").then((m) => m.MobileMenu),
  { ssr: false }
);

const navigation = [
  {
    title: "Το Φροντιστήριο",
    children: [
      { title: "Ιστορία & Φιλοσοφία", href: "/organization/history", desc: "Η αποστολή και το όραμά μας" },
      // { title: "Οι Καθηγητές μας", href: "/organization/teachers", desc: "Η έμπειρη εκπαιδευτική μας ομάδα" },
      { title: "Επιτυχόντες", href: "/organization/success-stories", desc: "Οι ιστορίες επιτυχίας μαθητών μας" },
      { title: "Φωτογραφικό Υλικό", href: "/organization/gallery", desc: "Στιγμές από τη ζωή μας" },
    ],
  },
  {
    title: "Προγράμματα Σπουδών",
    children: [
      {
        groupTitle: "Γυμνάσιο",
        items: [
          { title: "Α' Γυμνασίου", href: "/curricula/junior-high-a", desc: "Βασικά μαθήματα" },
          { title: "Β' Γυμνασίου", href: "/curricula/junior-high-b", desc: "Βασικά μαθήματα + Φυσική" },
          { title: "Γ' Γυμνασίου", href: "/curricula/junior-high-c", desc: "Βασικά μαθήματα + Φυσική & Χημεία" },
        ],
      },
      {
        groupTitle: "Λύκειο",
        items: [
          { title: "Α' Λυκείου", href: "/curricula/high-school-a", desc: "Χειμερινό πρόγραμμα Α' τάξης" },
          { title: "Β' Λυκείου", href: "/curricula/high-school-b", desc: "Πρόγραμμα B' PLUS" },
          { title: "Γ' Λυκείου", href: "/curricula/high-school-c", desc: "Προετοιμασία Πανελλαδικών" },
        ],
      },
      { title: "ΕΠΑΛ", href: "/curricula/epal", desc: "Εκπαίδευση για Επαγγελματικό Λύκειο" },
      { title: "Απόφοιτοι", href: "/curricula/alumni", desc: "Επανάληψη για αποφοίτους" },
      { title: "Πρότυπα & Ωνάσεια Σχολεία", href: "/curricula/model-schools", desc: "Προετοιμασία για πρότυπα & πειραματικά" },
    ],
  },
  {
    title: "Εξετάσεις",
    children: [
      // { title: "Το Νέο Λύκειο", href: "/exams/new-high-school", desc: "Νέο σύστημα Λυκείου 2024" },
      { title: "Πανελλαδικές", href: "/exams/panhellenic", desc: "Πληροφορίες & Στρατηγικές" },
      { title: "Τράπεζα Θεμάτων", href: "/exams/question-bank", desc: "Επίλυση θεμάτων" },
      { title: "Θέματα ΟΕΦΕ", href: "/exams/oefe", desc: "Θέματα πανελλαδικών εξετάσεων" },
    ],
  },
  { title: "Υπολογισμός Μορίων", href: "/points-calculator" },
  { title: "Ανακοινώσεις", href: "/announcements" },
  { title: "Επικοινωνία", href: "/contact" },
];

export function Header({ contactContent = defaultContactContent }: { contactContent?: typeof defaultContactContent }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Top Contact Bar ── */}
      <div className="hero-gradient text-white py-1.5 px-4 hidden sm:block">
        <div className="container mx-auto px-6 sm:px-12 lg:px-16 max-w-7xl flex justify-between items-center text-xs font-heading font-medium">
          <div className="flex items-center gap-5">
            <a href={`tel:${contactContent.phone_content.replace(/\s+/g, "")}`} className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
              <Phone className="w-3 h-3" /> {contactContent.phone_content}
            </a>
            <span className="flex items-center gap-1.5 text-blue-200/80">
              <MapPin className="w-3 h-3" /> {contactContent.address_content}, {contactContent.address_subContent}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="http://www.eclass.didactirion.gr/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors flex items-center gap-1">
              E-class <ChevronRight className="w-3 h-3" />
            </a>
            <a href="https://studybot.employ.edu.gr/login" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors flex items-center gap-1">
              StudyBot <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div
        className={cn(
          "w-full border-b transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-md border-slate-200/60"
            : "bg-white border-slate-100"
        )}
      >
        <div className="container mx-auto px-6 sm:px-12 lg:px-16 max-w-7xl flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo-main-v2.png"
              alt="Διδακτήριον Logo"
              width={348}
              height={400}
              sizes="(max-width: 640px) 140px, 200px"
              priority
              className="h-14 sm:h-16 py-1.5 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu aria-label="Κύριο μενού">
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            "text-sm font-heading font-semibold text-slate-700 hover:text-slate-600 transition-colors bg-transparent hover:bg-slate-50 data-[state=open]:bg-slate-50 data-[state=open]:text-slate-600",
                          )}
                        >
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[420px] p-4 md:w-[560px] space-y-1">
                            {item.children.map((child: any, ci: number) =>
                              child.groupTitle ? (
                                /* ── Subgroup with label ── */
                                <div key={child.groupTitle}>
                                  {ci > 0 && <div className="border-t border-slate-100 my-2" />}
                                  <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                    {child.groupTitle}
                                  </p>
                                  <ul className="grid md:grid-cols-3 gap-1">
                                    {child.items.map((sub: any) => (
                                      <li key={sub.title}>
                                        <NavigationMenuLink
                                          render={
                                            <Link
                                              href={sub.href}
                                              className={cn(
                                                "group flex flex-col items-center text-center select-none rounded-xl p-3 no-underline outline-none transition-all",
                                                "text-slate-700 hover:bg-slate-50 hover:text-slate-600"
                                              )}
                                            >
                                              <div className="text-sm font-heading font-semibold leading-none mb-1">
                                                {sub.title}
                                              </div>
                                              {sub.desc && (
                                                <p className="text-xs text-slate-400 group-hover:text-slate-600/70 leading-relaxed transition-colors">
                                                  {sub.desc}
                                                </p>
                                              )}
                                            </Link>
                                          }
                                        />
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                /* ── Regular item ── */
                                <div key={child.title}>
                                  {ci > 0 && item.children[ci - 1]?.groupTitle && (
                                    <div className="border-t border-slate-100 my-2" />
                                  )}
                                  <NavigationMenuLink
                                    render={
                                      <Link
                                        href={child.href}
                                        className={cn(
                                          "group flex flex-col items-center text-center select-none rounded-xl p-3 no-underline outline-none transition-all",
                                          "text-slate-700 hover:bg-slate-50 hover:text-slate-600"
                                        )}
                                      >
                                        <div className="text-sm font-heading font-semibold leading-none mb-1">
                                          {child.title}
                                        </div>
                                        {child.desc && (
                                          <p className="text-xs text-slate-400 group-hover:text-slate-600/70 leading-relaxed transition-colors">
                                            {child.desc}
                                          </p>
                                        )}
                                      </Link>
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        render={
                          <Link
                            href={item.href || "#"}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "text-sm font-heading font-semibold bg-transparent",
                              "text-slate-700 hover:text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {item.title}
                          </Link>
                        }
                      />
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>


          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden">
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} navigation={navigation} contactContent={contactContent} />
          </div>
        </div>
      </div>
    </header>
  );
}
