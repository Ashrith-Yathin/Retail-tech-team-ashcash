import { motion } from "framer-motion";
import heroBakery from "@/assets/hero-bakery.jpg";

const RetailerCTA = () => {
  return (
    <section id="retailers" className="relative overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[60vh]">
        {/* Text */}
        <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 md:py-0 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-section-title text-muted-foreground mb-6 block">
              FOR LOCAL RETAILERS
            </span>
            <h2 className="font-display text-[36px] md:text-[48px] lg:text-[56px] font-light text-foreground leading-[1.1] mb-6">
              Turn expiring stock into revenue
            </h2>
            <p className="text-body-sm text-muted-foreground max-w-[420px] mb-10">
              List your discounted products in seconds. Reach nearby customers actively looking for deals.
              Reduce waste, increase footfall, and build loyalty with the community around you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#"
                className="text-nav bg-foreground text-background px-8 py-3 hover:bg-foreground/90 transition-colors duration-300 text-center"
              >
                Join as retailer
              </a>
              <a
                href="#"
                className="text-nav border border-foreground text-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300 text-center"
              >
                Learn more
              </a>
            </div>
          </motion.div>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden order-1 md:order-2">
          <motion.img
            src={heroBakery}
            alt="Local bakery store"
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
      </div>
    </section>
  );
};

export default RetailerCTA;
