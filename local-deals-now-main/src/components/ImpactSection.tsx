import { motion } from "framer-motion";

const stats = [
  { value: "12,400 kg", label: "Food waste prevented" },
  { value: "₹8.2L+", label: "Total customer savings" },
  { value: "340+", label: "Local retailers onboard" },
];

const ImpactSection = () => {
  return (
    <section className="bg-primary text-primary-foreground py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <span className="text-label text-primary-foreground/50 block mb-14">
          OUR IMPACT SO FAR
        </span>

        <div className="grid md:grid-cols-3 gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <span className="font-display text-[56px] md:text-[72px] font-light text-primary-foreground leading-none block mb-3">
                {stat.value}
              </span>
              <span className="text-body-sm text-primary-foreground/60">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
