import { motion } from "framer-motion";
import categoryFresh from "@/assets/category-fresh.jpg";
import categoryBakery from "@/assets/category-bakery.jpg";
import categoryDairy from "@/assets/category-dairy.jpg";
import categoryMeat from "@/assets/category-meat.jpg";
import categoryGrocery from "@/assets/category-grocery.jpg";
import heroBakery from "@/assets/hero-bakery.jpg";

const deals = [
  { category: "Fresh Produce", name: "Organic Tomatoes", price: "₹40", original: "₹120", image: categoryFresh },
  { category: "Bakery", name: "Sourdough Loaf", price: "₹60", original: "₹150", image: categoryBakery },
  { category: "Dairy", name: "Artisan Cheese", price: "₹90", original: "₹250", image: categoryDairy },
  { category: "Deli & Meats", name: "Smoked Chicken", price: "₹150", original: "₹400", image: categoryMeat },
  { category: "Grocery", name: "Organic Granola", price: "₹80", original: "₹200", image: categoryGrocery },
  { category: "Bakery", name: "Croissants", price: "₹45", original: "₹120", image: heroBakery },
];

const FeaturedDeals = () => {
  return (
    <section id="deals" className="py-20 md:py-28">
      <div className="px-6 md:px-12 mb-10">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-section-title text-muted-foreground block mb-3">
            DISCOVER OUR BEST DEALS NEAR YOU
          </span>
        </div>
      </div>

      {/* Horizontal scrolling product row */}
      <div className="px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
            {deals.map((deal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex-shrink-0 w-[240px] md:w-[260px] snap-start cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    loading="lazy"
                    width={520}
                    height={693}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-500 flex items-center justify-center">
                    <span className="text-nav text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-background px-5 py-2.5">
                      Discover
                    </span>
                  </div>
                </div>
                <span className="text-label text-muted-foreground block mb-1.5">
                  {deal.category}
                </span>
                <h3 className="text-product-name text-foreground mb-1.5">
                  {deal.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-display text-[18px] text-foreground">{deal.price}</span>
                  <span className="text-[12px] text-muted-foreground line-through">{deal.original}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#deals"
              className="inline-block text-nav border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
            >
              All deals
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
