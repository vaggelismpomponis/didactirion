"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
}

export function MobileMenu({ isOpen, setIsOpen, navigation }: MobileMenuProps) {
  return (
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
  );
}
