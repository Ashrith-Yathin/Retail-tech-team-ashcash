import Link from "next/link";

const footerLinks = {
  Platform: ["How it works", "Browse deals", "For retailers", "Pricing"],
  Company: ["About us", "Careers", "Blog", "Press"],
  Support: ["Help center", "Contact", "Privacy policy", "Terms"]
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground px-6 py-16 text-background md:px-12 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-16 grid gap-12 md:grid-cols-4">
          <div>
            <span className="mb-4 block font-display text-[28px] font-semibold tracking-tight">localé</span>
            <p className="max-w-[260px] text-body-sm text-background/50">
              Hyperlocal deal discovery. Save money, reduce waste, support local.
            </p>
            <p className="mt-5 text-[11px] tracking-wide text-background/35">
              Team Ash Cash built for Vashist Hackathon 3.0
            </p>
            <p className="mt-2 text-[11px] tracking-wide text-background/35">cs23b2006@iiitdm.ac.in</p>
            <p className="mt-1 text-[11px] tracking-wide text-background/35">cs23b1012@iiitdm.ac.in</p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <span className="text-label mb-5 block text-background/30">{title.toUpperCase()}</span>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="/" className="text-body-sm text-background/60 transition-colors duration-200 hover:text-background">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
          <span className="text-[11px] tracking-wide text-background/30">© {year} localé. All rights reserved.</span>
          <div className="flex gap-6">
            {["Instagram", "Twitter", "LinkedIn"].map((social) => (
              <Link key={social} href="/" className="text-[11px] tracking-wide text-background/30 transition-colors hover:text-background/60">
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
