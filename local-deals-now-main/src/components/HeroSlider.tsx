import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroMarket from "@/assets/hero-market.jpg";
import heroProduce from "@/assets/hero-produce.jpg";
import heroBakery from "@/assets/hero-bakery.jpg";

const slides = [
  {
    image: heroMarket,
    category: "NEARBY DEALS",
    name: "DISCOVER",
  },
  {
    image: heroProduce,
    category: "FRESH PRODUCE",
    name: "SAVINGS",
  },
  {
    image: heroBakery,
    category: "LOCAL STORES",
    name: "EXPLORE",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen overflow-hidden mt-[60px] md:mt-[70px]">
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.name}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-foreground/10" />
        </motion.div>
      </AnimatePresence>

      {/* Watermark text — large, semi-transparent, centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={slide.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 0.12, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-hero-watermark text-background select-none"
          >
            {slide.name}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Top left label */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <span className="text-label text-background/70">ALL OUR DEALS</span>
      </div>

      {/* Slide indicators — dots on right side */}
      <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-[6px] h-[6px] transition-all duration-300 ${
              i === current ? "bg-background" : "bg-background/40"
            }`}
          />
        ))}
      </div>

      {/* Bottom left — category + name */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-label text-background/60 mb-2 block">
              {slide.category}
            </span>
            <h1 className="text-hero-title text-background">
              {slide.name}
            </h1>
          </motion.div>
        </AnimatePresence>

        {/* Thumbnails — bottom right */}
        <div className="hidden md:flex absolute bottom-8 right-8 gap-2">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-[120px] h-[68px] overflow-hidden transition-all duration-300 ${
                i === current
                  ? "opacity-100 outline outline-1 outline-background"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={s.image}
                alt={s.category}
                className="w-full h-full object-cover"
                loading="lazy"
                width={120}
                height={68}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
