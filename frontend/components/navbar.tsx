"use client";

import Link from "next/link";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "DEALS", href: "/deals" },
  { label: "NEARBY", href: "/deals" },
  { label: "CATEGORIES", href: "/#categories" },
  { label: "HOW IT WORKS", href: "/#how-it-works" },
  { label: "FOR RETAILERS", href: "/dashboard/retailer" }
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <nav className="border-b border-border bg-background">
        <div className="flex h-[60px] items-center md:h-[70px]">
          <Link href="/" className="flex h-full items-center justify-center border-r border-border px-6 md:px-8">
            <span className="font-display text-[22px] font-semibold tracking-tight text-foreground md:text-[26px]">
              localé
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
