"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Phone, ChevronDown, ChevronRight, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultContactContent } from "@/app/(public)/contact/contact-content";

interface NavigationChild {
  title: string;
  href: string;
  desc?: string;
}

interface NavigationItem {
  title: string;
  href?: string;
  children?: NavigationChild[];
}

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  navigation: NavigationItem[];
  contactContent?: typeof defaultContactContent;
}

export function MobileMenu({ isOpen, setIsOpen, navigation, contactContent = defaultContactContent }: MobileMenuProps) {
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset expanded sections when closing
      setExpandedSection(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSection = (title: string) => {
    setExpandedSection((prev) => (prev === title ? null : title));
  };

  return (
    <>
      {/* Hamburger Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:text-slate-600 hover:bg-slate-50 transition-all duration-200"
        aria-label="Άνοιγμα μενού"
      >
        <div className="flex flex-col gap-[5px]">
          <span className="block w-5 h-[2px] bg-current rounded-full transition-all" />
          <span className="block w-3.5 h-[2px] bg-current rounded-full transition-all" />
          <span className="block w-5 h-[2px] bg-current rounded-full transition-all" />
        </div>
      </button>

      {mounted && createPortal(
        <>
          {/* Backdrop */}
          <div
            className={cn(
              "fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div
            className={cn(
              "fixed inset-y-0 right-0 z-[100] w-[min(340px,88vw)] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
              isOpen ? "translate-x-0" : "translate-x-full"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Μενού πλοήγησης"
          >
            {/* ── Header ── */}
            <div className="relative shrink-0 px-5 pt-5 pb-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <Image
                  src="/logo-main-v2.png"
                  alt="Διδακτήριον Logo"
                  width={180}
                  height={70}
                  className="h-12 w-auto object-contain"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200"
                  aria-label="Κλείσιμο μενού"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
              <ul className="space-y-1">
                {navigation.map((item, index) => (
                  <li
                    key={item.title}
                    className={cn(
                      "transition-all duration-300",
                      isOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-4"
                    )}
                    style={{
                      transitionDelay: isOpen ? `${80 + index * 50}ms` : "0ms",
                    }}
                  >
                    {item.children ? (
                      /* ── Expandable Section ── */
                      <div>
                        <button
                          onClick={() => toggleSection(item.title)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-3 rounded-xl text-[15px] font-bold transition-all duration-200",
                            expandedSection === item.title
                              ? "bg-slate-50 text-slate-600"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-600"
                          )}
                        >
                          <span>{item.title}</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform duration-300 ease-out",
                              expandedSection === item.title ? "rotate-180" : ""
                            )}
                          />
                        </button>

                        {/* Expandable children */}
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-300 ease-out",
                            expandedSection === item.title
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          )}
                        >
                          <div className="ml-3 pl-3 border-l-2 border-slate-200 mt-1 mb-2 space-y-0.5">
                            {item.children.map((child) => (
                              <Link
                                key={child.title}
                                href={child.href}
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400 group-hover:scale-125 transition-all duration-200 shrink-0" />
                                <div className="min-w-0">
                                  <div className="truncate">{child.title}</div>
                                  {child.desc && (
                                    <div className="text-[11px] text-slate-400 group-hover:text-slate-500 truncate mt-0.5 transition-colors">
                                      {child.desc}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ── Simple Link ── */
                      <Link
                        href={item.href || "#"}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-3 py-3 rounded-xl text-[15px] font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-600 group transition-all duration-200"
                      >
                        <span>{item.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-200" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* ── Quick Links ── */}
              <div
                className={cn(
                  "mt-6 pt-5 border-t border-slate-100 transition-all duration-300",
                  isOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: isOpen ? "350ms" : "0ms" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 px-3 mb-2">
                  Πλατφόρμες
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="http://www.eclass.didactirion.gr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 text-[13px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200"
                  >
                    E-class
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                  <a
                    href="https://studybot.employ.edu.gr/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 text-[13px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200"
                  >
                    StudyBot
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </div>
              </div>
            </nav>

            {/* ── Footer CTA ── */}
            <div
              className={cn(
                "shrink-0 px-4 py-4 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50 transition-all duration-300",
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: isOpen ? "400ms" : "0ms" }}
            >
              <a
                href={`tel:${contactContent.phone_content.replace(/\s+/g, "")}`}
                className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-slate-300 hover:bg-slate-100 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm shrink-0 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                  <Phone className="w-[18px] h-[18px]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-0.5">
                    Καλέστε μας
                  </span>
                  <span className="text-base font-black text-slate-600 leading-none">
                    {contactContent.phone_content}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all duration-200" />
              </a>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
