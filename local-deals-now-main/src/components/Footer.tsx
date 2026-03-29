const footerLinks = {
  Platform: ["How it works", "Browse deals", "For retailers", "Pricing"],
  Company: ["About us", "Careers", "Blog", "Press"],
  Support: ["Help center", "Contact", "Privacy policy", "Terms"],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="font-display text-[28px] font-semibold tracking-tight block mb-4">
              localé
            </span>
            <p className="text-body-sm text-background/50 max-w-[260px]">
              Hyperlocal deal discovery. Save money, reduce waste, support local.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <span className="text-label text-background/30 mb-5 block">
                {title.toUpperCase()}
              </span>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-body-sm text-background/60 hover:text-background transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[11px] text-background/30 tracking-wide">
            © 2026 Localé. All rights reserved.
          </span>
          <div className="flex gap-6">
            {["Instagram", "Twitter", "LinkedIn"].map((social) => (
              <a key={social} href="#" className="text-[11px] text-background/30 hover:text-background/60 tracking-wide transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
