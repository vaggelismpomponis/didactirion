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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "Το Φροντιστήριο",
    children: [
      { title: "Ιστορία & Φιλοσοφία", href: "/organization/history", desc: "Η αποστολή και το όραμά μας" },
      { title: "Οι Καθηγητές μας", href: "/organization/teachers", desc: "Η έμπειρη εκπαιδευτική μας ομάδα" },
      { title: "Επιτυχόντες", href: "/organization/success-stories", desc: "Οι ιστορίες επιτυχίας μαθητών μας" },
      { title: "Φωτογραφικό Υλικό", href: "/organization/gallery", desc: "Στιγμές από τη ζωή μας" },
    ],
  },
  {
    title: "Προγράμματα Σπουδών",
    children: [
      { title: "Γυμνάσιο (Α, Β, Γ)", href: "/curricula/junior-high", desc: "Α', Β', Γ' Γυμνασίου" },
      { title: "Λύκειο (Α, Β, Γ)", href: "/curricula/high-school", desc: "Πλήρης προετοιμασία για Πανελλαδικές" },
      { title: "ΕΠΑΛ", href: "/curricula/epal", desc: "Εκπαίδευση για Επαγγελματικό Λύκειο" },
      { title: "Απόφοιτοι", href: "/curricula/alumni", desc: "Επανάληψη για αποφοίτους" },
      { title: "Πρότυπα Σχολεία", href: "/curricula/model-schools", desc: "Προετοιμασία για πρότυπα & πειραματικά" },
    ],
  },
  {
    title: "Εξετάσεις",
    children: [
      { title: "Το Νέο Λύκειο", href: "/exams/new-high-school", desc: "Νέο σύστημα Λυκείου 2024" },
      { title: "Πανελλαδικές", href: "/exams/panhellenic", desc: "Πληροφορίες & Στρατηγικές" },
      { title: "Τράπεζα Θεμάτων", href: "/exams/question-bank", desc: "Επίλυση θεμάτων" },
      { title: "Θέματα ΟΕΦΕ", href: "/exams/oefe", desc: "Θέματα πανελλαδικών εξετάσεων" },
    ],
  },
  { title: "Υπολογισμός Μορίων", href: "/points-calculator" },
  { title: "Ανακοινώσεις", href: "/announcements" },
  { title: "Επικοινωνία", href: "/contact" },
];

export function Header() {
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
        <div className="container mx-auto flex justify-between items-center text-xs font-heading font-medium">
          <div className="flex items-center gap-5">
            <a href="tel:2102448542" className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
              <Phone className="w-3 h-3" /> 210 2448542
            </a>
            <span className="flex items-center gap-1.5 text-blue-200/80">
              <MapPin className="w-3 h-3" /> Θρακομακεδόνων 97, Αχαρναί
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
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image 
              src="/logo-main.png" 
              alt="Διδακτήριον Logo" 
              width={200} 
              height={80} 
              className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            "text-sm font-heading font-semibold text-slate-700 hover:text-primary transition-colors bg-transparent hover:bg-primary/5",
                          )}
                        >
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[420px] gap-2 p-4 md:w-[520px] md:grid-cols-2">
                            {item.children.map((child) => (
                              <li key={child.title}>
                                <NavigationMenuLink
                                  render={
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        "group flex flex-col select-none rounded-xl p-3 no-underline outline-none transition-all",
                                        "text-slate-700 hover:bg-primary/5 hover:text-primary"
                                      )}
                                    >
                                      <div className="text-sm font-heading font-semibold leading-none mb-1">
                                        {child.title}
                                      </div>
                                      {child.desc && (
                                        <p className="text-xs text-slate-400 group-hover:text-primary/70 leading-relaxed transition-colors">
                                          {child.desc}
                                        </p>
                                      )}
                                    </Link>
                                  }
                                />
                              </li>
                            ))}
                          </ul>
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
                              "text-slate-700 hover:text-primary hover:bg-primary/5"
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
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="text-slate-700 hover:text-primary hover:bg-primary/5">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Άνοιγμα μενού</span>
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0 flex flex-col bg-white shadow-2xl border-l border-slate-100">
                <SheetHeader className="px-6 py-6 bg-[#fbfaf9] border-b border-slate-100 relative">
                  <SheetTitle className="flex justify-center">
                    <Image 
                      src="/logo-main.png" 
                      alt="Διδακτήριον Logo" 
                      width={220} 
                      height={90} 
                      className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm"
                    />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8">
                  {navigation.map((item) => (
                    <div key={item.title}>
                      {item.children ? (
                        <div className="space-y-4">
                          <h4 className="text-xs font-heading font-black text-primary uppercase tracking-widest flex items-center gap-3">
                            <span className="w-5 h-[2px] bg-primary/40 rounded-full"></span>
                            {item.title}
                          </h4>
                          <div className="flex flex-col gap-2 pl-5 border-l-2 border-slate-100">
                            {item.children.map((child) => (
                              <Link
                                key={child.title}
                                href={child.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "text-[15px] font-heading font-semibold py-1.5 transition-all flex items-center group",
                                  "text-slate-600 hover:text-primary hover:translate-x-1"
                                )}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href || "#"}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center justify-between text-[17px] font-heading font-black transition-all",
                            "text-slate-800 hover:text-primary group"
                          )}
                        >
                          {item.title}
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  ))}

                  <div className="mt-6 pt-8 border-t border-slate-100">
                    <a 
                      href="tel:2102448542" 
                      className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-primary hover:bg-primary/10 transition-all duration-300 group shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Καλεστε μας</span>
                        <span className="text-lg font-black font-heading leading-none">210 2448542</span>
                      </div>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
