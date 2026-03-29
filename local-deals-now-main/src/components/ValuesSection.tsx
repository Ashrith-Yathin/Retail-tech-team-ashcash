import { motion } from "framer-motion";

const values = [
  {
    keyword: "Sustainable",
    description:
      "Localé is committed to reducing food waste. Every deal claimed is food saved from landfill. We connect expiring goods with conscious consumers, creating a meaningful impact on both wallet and planet.",
  },
  {
    keyword: "Hyperlocal",
    description:
      "Discover deals within walking distance. We prioritize proximity so you can grab savings on your daily route — no detours, no hassle. Our location-first approach means convenience is built in.",
  },
  {
    keyword: "Real-Time",
    description:
      "Far from static listings, Localé deals update in real time as retailers add new markdowns. Smart ranking ensures you always see the most relevant, freshest discounts first — powered by intelligent algorithms.",
  },
];

const ValuesSection = () => {
  return (
    <section className="bg-card py-24 md:py-32">
      {/* Marquee */}
      <div className="overflow-hidden mb-16">
        <div className="marquee-track">
          {[...Array(3)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center">
              {values.map((v, i) => (
                <span
                  key={`${setIdx}-${i}`}
                  className="font-display text-[60px] md:text-[100px] lg:text-[130px] font-light text-foreground/[0.06] whitespace-nowrap mx-6"
                >
                  {v.keyword}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-16 md:gap-10">
        {values.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
          >
            <h3 className="font-display text-[32px] md:text-[40px] font-light text-foreground mb-5 italic">
              {v.keyword}
            </h3>
            <p className="text-body-sm text-muted-foreground">{v.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-14">
        <a
          href="#how-it-works"
          className="inline-block text-nav border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
        >
          About us
        </a>
      </div>
    </section>
  );
};

export default ValuesSection;
