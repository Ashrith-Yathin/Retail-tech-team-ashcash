import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingBag, Menu, X } from "lucide-react";

const navLinks = [
  { label: "DEALS", href: "#deals" },
  { label: "NEARBY", href: "#nearby" },
  { label: "CATEGORIES", href: "#categories" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "FOR RETAILERS", href: "#retailers" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-background border-b border-border">
        <div className="flex items-center h-[60px] md:h-[70px]">
          {/* Logo */}
          <a href="/" className="flex items-center justify-center px-6 md:px-8 border-r border-border h-full">
            <span className="font-display text-[22px] md:text-[26px] font-semibold tracking-tight text-foreground">
              localé
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0 h-full flex-1">
            {navLinks.slice(0, 1).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-nav text-foreground h-full flex items-center px-6 border-r border-border hover:bg-muted transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side links */}
          <div className="hidden lg:flex items-center gap-0 h-full ml-auto">
            {navLinks.slice(1).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-nav text-foreground h-full flex items-center px-5 border-l border-border hover:bg-muted transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <button className="h-full flex items-center px-5 border-l border-border text-foreground hover:bg-muted transition-colors duration-200">
              <User className="w-[16px] h-[16px] stroke-[1.5]" />
            </button>
            <button className="h-full flex items-center px-5 border-l border-border text-foreground hover:bg-muted transition-colors duration-200 relative">
              <ShoppingBag className="w-[16px] h-[16px] stroke-[1.5]" />
              <span className="absolute top-3 right-3 w-[14px] h-[14px] bg-foreground text-background text-[8px] flex items-center justify-center font-medium">
                0
              </span>
            </button>
          </div>

          {/* Mobile right */}
          <div className="flex lg:hidden items-center h-full ml-auto">
            <button className="h-full flex items-center px-4 border-l border-border text-foreground">
              <User className="w-[16px] h-[16px] stroke-[1.5]" />
            </button>
            <button
              className="h-full flex items-center px-4 border-l border-border text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-[18px] h-[18px] stroke-[1.5]" /> : <Menu className="w-[18px] h-[18px] stroke-[1.5]" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-nav text-foreground py-4 px-6 border-b border-border last:border-b-0 hover:bg-muted transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
