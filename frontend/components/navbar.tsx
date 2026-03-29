"use client";

import Link from "next/link";
import { Menu, MoonStar, ShoppingBag, SunMedium, User, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useAppPreferences } from "@/lib/app-preferences";

const navLinks = [
  { label: "DEALS", href: "/deals" },
  { label: "NEARBY", href: "/deals" },
  { label: "CATEGORIES", href: "/#categories" },
  { label: "HOW IT WORKS", href: "/#how-it-works" },
  { label: "FOR RETAILERS", href: "/dashboard/retailer" }
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dietAnimating, setDietAnimating] = useState(false);
  const { theme, toggleTheme, dietMode, toggleDietMode } = useAppPreferences();

  useEffect(() => {
    if (!dietAnimating) {
      return;
    }
    const timer = window.setTimeout(() => setDietAnimating(false), 700);
    return () => window.clearTimeout(timer);
  }, [dietAnimating]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <nav className="border-b border-border bg-background">
        <div className="flex h-[60px] items-center md:h-[70px]">
          <Link href="/" className="flex h-full items-center justify-center border-r border-border px-6 md:px-8">
            <span className="font-display text-[22px] font-semibold tracking-tight text-foreground md:text-[26px]">
              DealDrop
            </span>
          </Link>

          <div className="hidden h-full flex-1 items-center lg:flex">
            <Link
              href={navLinks[0].href}
              className="text-nav flex h-full items-center border-r border-border px-6 text-foreground transition-colors duration-200 hover:bg-muted"
            >
              {navLinks[0].label}
            </Link>
          </div>

          <div className="ml-auto hidden h-full items-center lg:flex">
            <div className="mode-switch-shell flex h-full items-center border-l border-border px-3" data-active={dietAnimating ? "true" : "false"}>
              <button
                onClick={() => {
                  setDietAnimating(true);
                  toggleDietMode();
                }}
                className={`relative inline-flex h-11 w-[170px] items-center rounded-full border border-border px-1 text-[11px] uppercase tracking-[0.18em] transition-all duration-500 ${
                  dietMode === "all"
                    ? "bg-[linear-gradient(90deg,rgba(143,43,30,0.95),rgba(62,101,67,0.95))] text-white shadow-[0_12px_35px_rgba(143,43,30,0.28)]"
                    : "bg-[linear-gradient(90deg,rgba(116,151,87,0.16),rgba(197,214,170,0.22))] text-foreground"
                }`}
              >
                <span
                  className={`absolute top-1 h-9 w-[78px] rounded-full bg-white/90 shadow-md transition-all duration-500 ${
                    dietMode === "all" ? "left-[88px] bg-black/20" : "left-1"
                  }`}
                />
                <span
                  className={`relative z-10 flex w-1/2 items-center justify-center transition-colors duration-500 ${
                    dietMode === "veg" ? "font-semibold text-stone-900" : "text-white/72"
                  }`}
                >
                  Veg
                </span>
                <span
                  className={`relative z-10 flex w-1/2 items-center justify-center transition-colors duration-500 ${
                    dietMode === "all" ? "font-semibold text-white" : "text-stone-700/70"
                  }`}
                >
                  Veg + Non-Veg
                </span>
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className="flex h-full items-center border-l border-border px-5 text-foreground transition-colors duration-200 hover:bg-muted"
            >
              {theme === "dark" ? <SunMedium className="h-[16px] w-[16px] stroke-[1.8]" /> : <MoonStar className="h-[16px] w-[16px] stroke-[1.8]" />}
            </button>
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-nav flex h-full items-center border-l border-border px-5 text-foreground transition-colors duration-200 hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="flex h-full items-center border-l border-border px-5 text-foreground transition-colors duration-200 hover:bg-muted"
            >
              <User className="h-[16px] w-[16px] stroke-[1.5]" />
            </Link>
            <Link
              href="/dashboard/retailer"
              className="relative flex h-full items-center border-l border-border px-5 text-foreground transition-colors duration-200 hover:bg-muted"
            >
              <ShoppingBag className="h-[16px] w-[16px] stroke-[1.5]" />
              <span className="absolute right-3 top-3 flex h-[14px] w-[14px] items-center justify-center bg-foreground text-[8px] font-medium text-background">
                0
              </span>
            </Link>
          </div>

          <div className="ml-auto flex h-full items-center lg:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-full items-center border-l border-border px-4 text-foreground"
            >
              {theme === "dark" ? <SunMedium className="h-[16px] w-[16px] stroke-[1.8]" /> : <MoonStar className="h-[16px] w-[16px] stroke-[1.8]" />}
            </button>
            <Link href="/login" className="flex h-full items-center border-l border-border px-4 text-foreground">
              <User className="h-[16px] w-[16px] stroke-[1.5]" />
            </Link>
            <button
              className="flex h-full items-center border-l border-border px-4 text-foreground"
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X className="h-[18px] w-[18px] stroke-[1.5]" /> : <Menu className="h-[18px] w-[18px] stroke-[1.5]" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="overflow-hidden border-b border-border bg-background lg:hidden">
          <div className="flex flex-col">
            <div className="border-b border-border px-6 py-4">
              <button
                onClick={() => {
                  setDietAnimating(true);
                  toggleDietMode();
                }}
                className={`mode-switch-shell flex w-full items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm transition-all duration-500 ${
                  dietMode === "all"
                    ? "bg-[linear-gradient(90deg,rgba(143,43,30,0.95),rgba(62,101,67,0.95))] text-white"
                    : "bg-[linear-gradient(90deg,rgba(116,151,87,0.14),rgba(197,214,170,0.2))] text-foreground"
                }`}
                data-active={dietAnimating ? "true" : "false"}
              >
                <span>Food mode</span>
                <span>{dietMode === "veg" ? "Veg" : "Veg + Non-Veg"}</span>
              </button>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-nav border-b border-border px-6 py-4 text-foreground transition-colors hover:bg-muted last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
