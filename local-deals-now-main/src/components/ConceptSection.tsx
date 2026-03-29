import { motion } from "framer-motion";

const ConceptSection = () => {
  return (
    <section className="py-28 md:py-40 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-statement text-foreground"
        >
          Localé, hyperlocal deal discovery connecting you to nearby savings on fresh produce, bakery goods, and daily essentials — before they expire.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <a
            href="#how-it-works"
            className="inline-block text-nav border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Our concept
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ConceptSection;
