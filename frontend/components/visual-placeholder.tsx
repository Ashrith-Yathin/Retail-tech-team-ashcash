type VisualPlaceholderProps = {
  title: string;
  subtitle?: string;
  accent?: "clay" | "moss" | "ink";
  className?: string;
};

const accentStyles = {
  clay: "from-[#f1dcc9] via-[#ead0b8] to-[#d79063] text-[#6b3d2d]",
  moss: "from-[#dce4d4] via-[#c7d5b8] to-[#83966d] text-[#304230]",
  ink: "from-[#e5dfd7] via-[#ccc3b7] to-[#7b736b] text-[#2d2926]"
};

export function VisualPlaceholder({
  title,
  subtitle,
  accent = "clay",
  className = ""
}: VisualPlaceholderProps) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${accentStyles[accent]} ${className}`}>
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-[8%] top-[14%] h-24 w-24 rounded-full border border-current/30" />
        <div className="absolute right-[12%] top-[18%] h-16 w-16 rounded-full bg-current/10" />
        <div className="absolute bottom-[16%] left-[14%] h-20 w-20 rotate-12 border border-current/25" />
        <div className="absolute bottom-[12%] right-[10%] h-28 w-28 rounded-[28px] border border-current/20" />
      </div>
      <div className="relative flex h-full min-h-[220px] flex-col justify-between p-6">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-current/70">
          <span>hyperlocal</span>
          <span>deal discovery</span>
        </div>
        <div>
          <p className="font-display text-4xl leading-[0.9] tracking-[-0.03em] sm:text-5xl">{title}</p>
          {subtitle ? <p className="mt-3 max-w-[18rem] text-sm text-current/75">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
}
