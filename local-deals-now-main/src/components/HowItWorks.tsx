import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroMarket from "@/assets/hero-market.jpg";

const steps = [
  {
    title: "What is it?",
    description:
      "Localé is a hyperlocal deal discovery platform. We surface real-time discounts from nearby stores on products approaching their best-before date — so you save money while reducing food waste.",
  },
  {
    title: "How to use",
    description:
      "Enable location or enter your area. Browse smart-ranked deals sorted by discount depth, distance, and urgency. Head to the store and pick up your items at a fraction of the cost.",
  },
  {
    title: "Why it matters",
    description:
      "Every year, billions of kg of food goes to waste. With Localé, local retailers move stock that would otherwise be discarded, and shoppers get premium products at unbeatable prices.",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 md:py-36">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Left — large display text + image */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-[48px] sm:text-[64px] md:text-[72px] lg:text-[88px] font-light text-foreground leading-[1.05] tracking-[-0.02em] mb-8">
                <span className="italic">The</span> story<br />
                <span className="italic">of</span> your<br />
                savings
              </h2>
              <p className="font-display text-[18px] md:text-[20px] font-light text-muted-foreground leading-relaxed max-w-[380px]">
                We connect you to the history of every deal. Discover how much you save and how much waste you prevent.
              </p>
            </motion.div>

            <div className="mt-8 overflow-hidden aspect-[4/3] hidden md:block">
              <img
                src={heroMarket}
                alt="Local market"
                className="w-full h-full object-cover"
                loading="lazy"
                width={600}
                height={450}
              />
            </div>

            <div className="mt-8">
              <a
                href="#"
                className="inline-block text-nav border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
              >
                More questions
              </a>
            </div>
          </div>

          {/* Right — accordion steps */}
          <div className="flex flex-col justify-center">
            {steps.map((step, i) => (
              <div
                key={i}
                className="border-b border-border"
              >
                <button
                  onClick={() => setActiveStep(activeStep === i ? -1 : i)}
                  className="w-full text-left py-6 md:py-8 flex items-center justify-between"
                >
                  <span className="font-display text-[22px] md:text-[28px] font-light text-foreground">
                    {step.title}
                  </span>
                  <span className="text-muted-foreground text-[20px] font-light">
                    {activeStep === i ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {activeStep === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-body-sm text-muted-foreground pb-6 md:pb-8 max-w-[400px]">
                        {step.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
