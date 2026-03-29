"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/design-assets/hero-market.jpg",
    category: "NEARBY DEALS",
    name: "DISCOVER"
  },
  {
    image: "/design-assets/hero-produce.jpg",
    category: "FRESH PRODUCE",
    name: "SAVINGS"
  },
  {
    image: "/design-assets/hero-bakery.jpg",
    category: "LOCAL STORES",
    name: "EXPLORE"
  }
];

const deals = [
  { category: "Fresh Produce", name: "Organic Tomatoes", price: "Rs. 40", original: "Rs. 120", image: "/design-assets/category-fresh.jpg" },
  { category: "Bakery", name: "Sourdough Loaf", price: "Rs. 60", original: "Rs. 150", image: "/design-assets/category-bakery.jpg" },
  { category: "Dairy", name: "Artisan Cheese", price: "Rs. 90", original: "Rs. 250", image: "/design-assets/category-dairy.jpg" },
  { category: "Deli & Meats", name: "Smoked Chicken", price: "Rs. 150", original: "Rs. 400", image: "/design-assets/category-meat.jpg" },
  { category: "Grocery", name: "Organic Granola", price: "Rs. 80", original: "Rs. 200", image: "/design-assets/category-grocery.jpg" },
  { category: "Bakery", name: "Croissants", price: "Rs. 45", original: "Rs. 120", image: "/design-assets/hero-bakery.jpg" }
];

const categories = [
  { name: "Fresh Produce", image: "/design-assets/category-fresh.jpg" },
  { name: "Bakery", image: "/design-assets/category-bakery.jpg" },
  { name: "Dairy", image: "/design-assets/category-dairy.jpg" },
  { name: "Deli & Meats", image: "/design-assets/category-meat.jpg" },
  { name: "Grocery", image: "/design-assets/category-grocery.jpg" }
];

const values = [
  {
    keyword: "Sustainable",
    description:
      "Locale is committed to reducing food waste. Every deal claimed is food saved from landfill. We connect expiring goods with conscious consumers, creating a meaningful impact on both wallet and planet."
  },
  {
    keyword: "Hyperlocal",
    description:
      "Discover deals within walking distance. We prioritize proximity so you can grab savings on your daily route. Our location-first approach means convenience is built in."
  },
  {
    keyword: "Real-Time",
    description:
      "Deals update as retailers add new markdowns. Smart ranking ensures the most relevant, freshest discounts surface first for each shopper."
  }
];

const steps = [
  {
    title: "What is it?",
    description:
      "Locale is a hyperlocal deal discovery platform. We surface real-time discounts from nearby stores on products approaching their best-before date so you save money while reducing food waste."
  },
  {
    title: "How to use",
    description:
      "Enable location or enter your area. Browse smart-ranked deals sorted by discount depth, distance, and urgency. Head to the store and pick up your items at a fraction of the cost."
  },
  {
    title: "Why it matters",
    description:
      "Retailers move stock that would otherwise be discarded, and shoppers get premium products at better prices. That means more savings and less waste."
  }
];

const stats = [
  { value: "12,400 kg", label: "Food waste prevented" },
  { value: "Rs. 8.2L+", label: "Total customer savings" },
  { value: "340+", label: "Local retailers onboard" }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((value) => (value + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
        <div className="absolute inset-0 bg-foreground/10" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="text-hero-watermark select-none text-background/10">{slide.name}</span>
        </div>

        <div className="absolute left-6 top-6 md:left-8 md:top-8">
          <span className="text-label text-background/70">ALL OUR DEALS</span>
        </div>

        <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3 md:right-8">
          {slides.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setCurrentSlide(index)}
              className={`h-[6px] w-[6px] transition-all duration-300 ${index === currentSlide ? "bg-background" : "bg-background/40"}`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="text-label mb-2 block text-background/60">{slide.category}</span>
          <h1 className="text-hero-title text-background">{slide.name}</h1>

          <div className="absolute bottom-8 right-8 hidden gap-2 md:flex">
            {slides.map((item, index) => (
              <button
                key={item.name}
                onClick={() => setCurrentSlide(index)}
                className={`relative h-[68px] w-[120px] overflow-hidden transition-all duration-300 ${
                  index === currentSlide ? "opacity-100 outline outline-1 outline-background" : "opacity-50 hover:opacity-80"
                }`}
              >
                <img src={item.image} alt={item.category} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-28 md:px-12 md:py-40">
        <div className="mx-auto max-w-[1000px] text-center">
          <h2 className="text-statement text-foreground">
            Locale, hyperlocal deal discovery connecting you to nearby savings on fresh produce, bakery goods, and daily
            essentials before they expire.
          </h2>
          <div className="mt-12">
            <Link
              href="/deals"
              className="text-nav inline-block border border-foreground px-8 py-3 transition-all duration-300 hover:bg-foreground hover:text-background"
            >
              Our concept
            </Link>
          </div>
        </div>
      </section>

      <section className="py-0">
        <div className="grid min-h-[70vh] md:grid-cols-2">
          <div className="relative overflow-hidden">
            <img src="/design-assets/hero-produce.jpg" alt="Fresh local produce" className="min-h-[400px] h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center px-8 py-16 md:px-16 md:py-0 lg:px-24">
            <span className="text-section-title mb-6 block text-muted-foreground">HIGH SAVINGS AND ZERO WASTE</span>
            <p className="text-body-sm max-w-[420px] leading-relaxed text-muted-foreground">
              Enhance your daily shopping with savings of up to 70% on quality products approaching their best-before
              date. Designed to connect conscious consumers with local retailers, our platform ensures great food never
              goes to waste.
            </p>
            <div className="mt-10">
              <p className="font-display text-[28px] italic leading-[1.2] text-foreground md:text-[36px]">
                Save more,
                <br />
                waste less.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="deals" className="py-20 md:py-28">
        <div className="mb-10 px-6 md:px-12">
          <div className="mx-auto max-w-[1400px]">
            <span className="text-section-title mb-3 block text-muted-foreground">DISCOVER OUR BEST DEALS NEAR YOU</span>
          </div>
        </div>

        <div className="px-6 md:px-12">
          <div className="mx-auto max-w-[1400px]">
            <div className="scrollbar-hide -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:px-0">
              {deals.map((deal) => (
                <div key={deal.name} className="group w-[240px] flex-shrink-0 cursor-pointer snap-start md:w-[260px]">
                  <div className="relative mb-4 aspect-[3/4] overflow-hidden">
                    <img src={deal.image} alt={deal.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-500 group-hover:bg-foreground/30">
                      <span className="text-nav border border-background px-5 py-2.5 text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Discover
                      </span>
                    </div>
                  </div>
                  <span className="text-label mb-1.5 block text-muted-foreground">{deal.category}</span>
                  <h3 className="text-product-name mb-1.5 text-foreground">{deal.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[18px] text-foreground">{deal.price}</span>
                    <span className="text-[12px] text-muted-foreground line-through">{deal.original}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/deals"
                className="text-nav inline-block border border-foreground px-8 py-3 transition-all duration-300 hover:bg-foreground hover:text-background"
              >
                All deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-24 md:py-32">
        <div className="mb-16 overflow-hidden">
          <div className="marquee-track">
            {[0, 1, 2].map((setIndex) => (
              <div key={setIndex} className="flex items-center">
                {values.map((value) => (
                  <span
                    key={`${setIndex}-${value.keyword}`}
                    className="mx-6 whitespace-nowrap font-display text-[60px] font-light text-foreground/[0.06] md:text-[100px] lg:text-[130px]"
                  >
                    {value.keyword}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-[1200px] gap-16 px-6 md:grid-cols-3 md:gap-10 md:px-12">
          {values.map((value) => (
            <div key={value.keyword}>
              <h3 className="mb-5 font-display text-[32px] font-light italic text-foreground md:text-[40px]">{value.keyword}</h3>
              <p className="text-body-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/deals"
            className="text-nav inline-block border border-foreground px-8 py-3 transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            About us
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="py-24 md:py-36">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-2 md:gap-20 md:px-12">
          <div>
            <h2 className="mb-8 font-display text-[48px] font-light leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[64px] md:text-[72px] lg:text-[88px]">
              <span className="italic">The</span> story
              <br />
              <span className="italic">of</span> your
              <br />
              savings
            </h2>
            <p className="max-w-[380px] font-display text-[18px] font-light leading-relaxed text-muted-foreground md:text-[20px]">
              We connect you to the story behind every deal. Discover how much you save and how much waste you prevent.
            </p>
            <div className="mt-8 hidden aspect-[4/3] overflow-hidden md:block">
              <img src="/design-assets/hero-market.jpg" alt="Local market" className="h-full w-full object-cover" />
            </div>
            <div className="mt-8">
              <Link
                href="/deals"
                className="text-nav inline-block border border-foreground px-8 py-3 transition-all duration-300 hover:bg-foreground hover:text-background"
              >
                More questions
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            {steps.map((step, index) => (
              <div key={step.title} className="border-b border-border">
                <button
                  onClick={() => setActiveStep(activeStep === index ? -1 : index)}
                  className="flex w-full items-center justify-between py-6 text-left md:py-8"
                >
                  <span className="font-display text-[22px] font-light text-foreground md:text-[28px]">{step.title}</span>
                  <span className="text-[20px] font-light text-muted-foreground">{activeStep === index ? "-" : "+"}</span>
                </button>
                {activeStep === index ? (
                  <p className="max-w-[400px] pb-6 text-body-sm text-muted-foreground md:pb-8">{step.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <span className="text-section-title mb-10 block text-muted-foreground">Our categories</span>

          <div className="border-t border-border">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="group relative flex cursor-pointer items-center justify-between border-b border-border py-5 md:py-6"
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <h3 className="text-category-item text-foreground transition-colors duration-300 group-hover:text-accent">
                  {category.name},
                </h3>

                {hoveredCategory === index ? (
                  <div className="absolute right-32 top-1/2 hidden h-[140px] w-[200px] -translate-y-1/2 overflow-hidden md:block">
                    <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                  </div>
                ) : null}

                <span className="text-nav hidden text-muted-foreground transition-colors duration-200 group-hover:text-foreground md:block">
                  View deals →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-6 py-24 text-white md:px-12 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <span className="text-label mb-14 block text-white/50">OUR IMPACT SO FAR</span>
          <div className="grid gap-12 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="mb-3 block font-display text-[56px] font-light leading-none md:text-[72px]">{stat.value}</span>
                <span className="text-body-sm text-white/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="retailers" className="relative overflow-hidden">
        <div className="grid min-h-[60vh] md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-6 py-20 md:order-1 md:px-16 md:py-0 lg:px-24">
            <span className="text-section-title mb-6 block text-muted-foreground">FOR LOCAL RETAILERS</span>
            <h2 className="mb-6 font-display text-[36px] font-light leading-[1.1] text-foreground md:text-[48px] lg:text-[56px]">
              Turn expiring stock into revenue
            </h2>
            <p className="text-body-sm mb-10 max-w-[420px] text-muted-foreground">
              List discounted products in seconds. Reach nearby customers actively looking for deals. Reduce waste,
              increase footfall, and build local loyalty.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="text-nav bg-foreground px-8 py-3 text-center text-background transition-colors duration-300 hover:bg-foreground/90"
              >
                Join as retailer
              </Link>
              <Link
                href="/dashboard/retailer"
                className="text-nav border border-foreground px-8 py-3 text-center text-foreground transition-all duration-300 hover:bg-foreground hover:text-background"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="order-1 relative overflow-hidden md:order-2">
            <img src="/design-assets/hero-bakery.jpg" alt="Local bakery store" className="min-h-[400px] h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </main>
  );
}
