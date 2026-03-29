import { useState } from "react";
import { motion } from "framer-motion";
import categoryFresh from "@/assets/category-fresh.jpg";
import categoryBakery from "@/assets/category-bakery.jpg";
import categoryDairy from "@/assets/category-dairy.jpg";
import categoryMeat from "@/assets/category-meat.jpg";
import categoryGrocery from "@/assets/category-grocery.jpg";

const categories = [
  { name: "Fresh Produce", image: categoryFresh },
  { name: "Bakery", image: categoryBakery },
  { name: "Dairy", image: categoryDairy },
  { name: "Deli & Meats", image: categoryMeat },
  { name: "Grocery", image: categoryGrocery },
];

const CategoriesSection = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="categories" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <span className="text-section-title text-muted-foreground block mb-10">
          Our categories
        </span>

        <div className="border-t border-border">
          {categories.map((cat, i) => (
            <motion.a
              key={i}
              href={`#${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center justify-between py-5 md:py-6 border-b border-border group cursor-pointer relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <h3 className="text-category-item text-foreground group-hover:text-accent transition-colors duration-300">
                {cat.name},
              </h3>

              {/* Hover image */}
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden md:block absolute right-32 top-1/2 -translate-y-1/2 w-[200px] h-[140px] overflow-hidden pointer-events-none z-10"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    width={200}
                    height={140}
                  />
                </motion.div>
              )}

              <span className="text-nav text-muted-foreground group-hover:text-foreground transition-colors duration-200 hidden md:block">
                View deals →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
