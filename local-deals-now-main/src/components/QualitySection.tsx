import { motion } from "framer-motion";
import heroProduce from "@/assets/hero-produce.jpg";

const QualitySection = () => {
  return (
    <section className="py-0">
      <div className="grid md:grid-cols-2 min-h-[70vh]">
        {/* Image */}
        <div className="relative overflow-hidden">
          <motion.img
            src={heroProduce}
            alt="Fresh local produce"
            className="w-full h-full object-cover min-h-[400px]"
            loading="lazy"
            width={960}
            height={720}
            initial={{ scale: 1.05 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-section-title text-muted-foreground mb-6 block">
              HIGH SAVINGS AND ZERO WASTE
            </span>
            <p className="text-body-sm text-muted-foreground max-w-[420px] leading-relaxed">
              Enhance your daily shopping with savings of up to 70% on quality products approaching their best-before date. Designed to connect conscious consumers with local retailers, our platform ensures great food never goes to waste.
            </p>
            <div className="mt-10">
              <p className="font-display text-[28px] md:text-[36px] font-light text-foreground leading-[1.2] italic">
                Save more,<br />waste less.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
