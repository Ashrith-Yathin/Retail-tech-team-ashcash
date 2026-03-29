"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { VisualPlaceholder } from "@/components/visual-placeholder";
import { useAppPreferences } from "@/lib/app-preferences";
import { ImpactSummary } from "@/lib/types";

const slides = [
  {
    category: "HYPERLOCAL FLASH SALES",
    name: "DEALDROP",
    accent: "clay" as const
  },
  {
    category: "SOUTH INDIAN GROCERIES",
    name: "SAVINGS",
    accent: "moss" as const
  },
  {
    category: "NEARBY KIRANAS",
    name: "DISCOVER",
    accent: "ink" as const
  }
];

const vegDeals = [
  { category: "Rice & Grains", name: "Ponni Boiled Rice", price: "Rs. 49", original: "Rs. 92", accent: "moss" as const },
  { category: "Breakfast Staples", name: "Idli Dosa Batter", price: "Rs. 34", original: "Rs. 68", accent: "ink" as const },
  { category: "Spices & Masalas", name: "Sambar Powder", price: "Rs. 39", original: "Rs. 85", accent: "clay" as const },
  { category: "Dals & Pulses", name: "Toor Dal Value Pack", price: "Rs. 71", original: "Rs. 128", accent: "moss" as const },
  { category: "Dairy & Paneer", name: "Fresh Paneer", price: "Rs. 58", original: "Rs. 104", accent: "clay" as const },
  { category: "Snacks", name: "Murukku Combo", price: "Rs. 29", original: "Rs. 55", accent: "ink" as const }
];

const mixedDeals = [
  ...vegDeals,
  { category: "Seafood", name: "Vanjaram Fish Steaks", price: "Rs. 149", original: "Rs. 278", accent: "ink" as const },
  { category: "Poultry", name: "Pepper Chicken Cuts", price: "Rs. 129", original: "Rs. 235", accent: "clay" as const }
];

const vegCategories = [
  { name: "Rice & Grains", accent: "moss" as const },
  { name: "Spices & Masalas", accent: "clay" as const },
  { name: "Dals & Pulses", accent: "ink" as const },
  { name: "Fresh Vegetables", accent: "moss" as const },
  { name: "Breakfast Staples", accent: "clay" as const },
  { name: "Dairy & Paneer", accent: "ink" as const },
  { name: "Snacks", accent: "moss" as const },
  { name: "Puja Essentials", accent: "clay" as const }
];

const mixedCategories = [
  ...vegCategories,
  { name: "Seafood", accent: "ink" as const },
  { name: "Poultry", accent: "clay" as const }
];

const values = [
  {
    keyword: "Visible",
    description:
      "Local retailers often struggle to clear overstocked or near-expiry inventory because they do not have the digital reach to surface fast-moving flash sales to nearby shoppers."
  },
  {
    keyword: "Hyperlocal",
    description:
      "DealDrop closes that gap by matching shoppers to nearby stores in real time. Distance, urgency, and value come together so the best deals show up at the right moment."
  },
  {
    keyword: "Timely",
    description:
      "That means fewer products wasted, better savings for households, and more revenue opportunities for kiranas, bakeries, and neighborhood grocery retailers."
  }
];

const steps = [
  {
    title: "What is DealDrop?",
    description:
      "DealDrop is a hyperlocal flash sale platform that helps local retailers upload overstocked or near-expiry products and instantly surface them to nearby customers."
  },
  {
    title: "How it works",
    description:
      "Retailers post time-sensitive inventory with discounts, expiry windows, and location. Customers browse smart-ranked deals by distance, discount, and urgency, then head to the store before the timer runs out."
  },
  {
    title: "Why it matters",
    description:
      "The platform bridges the hyperlocal supply-demand gap. Retailers recover revenue that would otherwise be lost, and shoppers gain access to affordable groceries close to home."
  }
];

const stats = [
  { value: "12,400 kg", label: "Groceries diverted from waste" },
  { value: "Rs. 8.2L+", label: "Flash-sale savings unlocked" },
  { value: "340+", label: "Neighborhood retailers onboard" }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [impactSummary, setImpactSummary] = useState<ImpactSummary | null>(null);
  const { dietMode } = useAppPreferences();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((value) => (value + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    api.impactSummary().then(setImpactSummary).catch(() => setImpactSummary(null));
  }, []);

  const slide = slides[currentSlide];
  const displayDeals = dietMode === "veg" ? vegDeals : mixedDeals;
  const displayCategories = dietMode === "veg" ? vegCategories : mixedCategories;
  const foodModeLabel = dietMode === "veg" ? "Veg mode" : "Veg + Non-Veg mode";

  return (
    <main className="min-h-screen bg-background">
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/perish.webp"
          alt="DealDrop landing visual"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,14,0.18),rgba(20,16,14,0.48))]" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="text-hero-watermark select-none text-background/10">{slide.name}</span>
        </div>

        <div className="absolute left-6 top-6 md:left-8 md:top-8">
          <span className="text-label text-background/70">REAL-TIME HYPERLOCAL DISCOVERY</span>
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
          <p className="mt-4 max-w-[620px] text-sm leading-relaxed text-background/75 md:text-base">
            Nearby retailers upload overstocked and near-expiry groceries. Shoppers discover flash sales ranked by value,
            urgency, and walking distance.
          </p>
          <div className="mt-5 inline-flex rounded-full border border-background/20 bg-background/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-background/85 backdrop-blur">
            {foodModeLabel}
          </div>

          <div className="absolute bottom-8 right-8 hidden gap-2 md:flex">
            {slides.map((item, index) => (
              <button
                key={item.name}
                onClick={() => setCurrentSlide(index)}
                className={`relative h-[68px] w-[120px] overflow-hidden transition-all duration-300 ${
                  index === currentSlide ? "opacity-100 outline outline-1 outline-background" : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src="/perish.webp"
                  alt={`${item.name} preview`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/35" />
                <div className="absolute inset-x-0 bottom-0 p-2 text-left text-white">
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-white/70">{item.category}</span>
                  <span className="font-display text-lg leading-none">{item.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-28 md:px-12 md:py-40">
        <div className="mx-auto max-w-[1000px] text-center">
          <h2 className="text-statement text-foreground">
            DealDrop connects local retailers struggling to clear overstocked or near-expiry inventory with nearby shoppers
            looking for timely savings on daily essentials.
          </h2>
          {impactSummary ? (
            <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
              <div className="rounded-[24px] border border-border bg-card p-5">
                <p className="text-label text-muted-foreground">Live deals</p>
                <p className="mt-2 font-display text-4xl text-foreground">{impactSummary.total_active_deals}</p>
              </div>
              <div className="rounded-[24px] border border-border bg-card p-5">
                <p className="text-label text-muted-foreground">Estimated savings</p>
                <p className="mt-2 font-display text-4xl text-foreground">Rs. {impactSummary.total_estimated_savings.toFixed(0)}</p>
              </div>
              <div className="rounded-[24px] border border-border bg-card p-5">
                <p className="text-label text-muted-foreground">Waste prevented</p>
                <p className="mt-2 font-display text-4xl text-foreground">{impactSummary.total_waste_prevented_kg.toFixed(0)} kg</p>
              </div>
            </div>
          ) : null}
          <div className="mt-12">
            <Link
              href="/deals"
              className="text-nav inline-block border border-foreground px-8 py-3 transition-all duration-300 hover:bg-foreground hover:text-background"
            >
              Explore live deals
            </Link>
          </div>
        </div>
      </section>

      <section className="py-0">
        <div className="grid min-h-[70vh] md:grid-cols-2">
          <div className="relative overflow-hidden">
            <VisualPlaceholder
              title={dietMode === "veg" ? "South Indian Staples" : "Expanded Grocery Basket"}
              subtitle={dietMode === "veg" ? "Vegetarian-first flash sales across neighborhood stores" : "Broader flash sales including non-veg inventory when enabled"}
              accent={dietMode === "veg" ? "moss" : "clay"}
              className="min-h-[400px] h-full"
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-16 md:px-16 md:py-0 lg:px-24">
            <span className="text-section-title mb-6 block text-muted-foreground">LOWER WASTE. FASTER SELL-THROUGH.</span>
            <p className="text-body-sm max-w-[420px] leading-relaxed text-muted-foreground">
              Built for kiranas, mini-marts, bakeries, and local grocery sellers, DealDrop helps move surplus inventory
              before it turns into waste. Customers get real savings on staples they already buy every week.
            </p>
            <div className="mt-10">
              <p className="font-display text-[28px] italic leading-[1.2] text-foreground md:text-[36px]">
                Clear stock faster,
                <br />
                save closer to home.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="deals" className="py-20 md:py-28">
        <div className="mb-10 px-6 md:px-12">
          <div className="mx-auto max-w-[1400px]">
            <span className="text-section-title mb-3 block text-muted-foreground">SOUTH INDIAN GROCERY FLASH SALES NEAR YOU</span>
          </div>
        </div>

        <div className="px-6 md:px-12">
          <div className="mx-auto max-w-[1400px]">
            <div className="scrollbar-hide -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:px-0">
              {displayDeals.map((deal) => (
                <div key={deal.name} className="group w-[240px] flex-shrink-0 cursor-pointer snap-start md:w-[260px]">
                  <div className="relative mb-4 aspect-[3/4] overflow-hidden">
                    <VisualPlaceholder
                      title={deal.name}
                      subtitle={deal.category}
                      accent={deal.accent}
                      className="h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
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
                See all nearby deals
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
            Why DealDrop works
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="py-24 md:py-36">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-2 md:gap-20 md:px-12">
          <div>
            <h2 className="mb-8 font-display text-[48px] font-light leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[64px] md:text-[72px] lg:text-[88px]">
              <span className="italic">The</span> story
              <br />
              <span className="italic">of</span> every
              <br />
              flash sale
            </h2>
            <p className="max-w-[380px] font-display text-[18px] font-light leading-relaxed text-muted-foreground md:text-[20px]">
              Real-time markdowns, location-aware ranking, and rapid discovery turn neighborhood inventory into a living
              local marketplace.
            </p>
            <div className="mt-8 hidden aspect-[4/3] overflow-hidden md:block">
              <VisualPlaceholder title="Local Routes" subtitle="Deal discovery by proximity, urgency, and savings" accent="ink" className="h-full" />
            </div>
            <div className="mt-8">
              <Link
                href="/deals"
                className="text-nav inline-block border border-foreground px-8 py-3 transition-all duration-300 hover:bg-foreground hover:text-background"
              >
                Browse ranked deals
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
          <span className="text-section-title mb-10 block text-muted-foreground">SHOP BY CATEGORY</span>

          <div className="border-t border-border">
            {displayCategories.map((category, index) => (
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
                    <VisualPlaceholder title={category.name} accent={category.accent} className="h-full min-h-0" />
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
              Turn expiring inventory into hyperlocal demand
            </h2>
            <p className="text-body-sm mb-10 max-w-[420px] text-muted-foreground">
              Upload deals in seconds, auto-calculate discounts, and instantly reach nearby shoppers searching for urgent
              savings. DealDrop helps retailers recover revenue, increase footfall, and stay visible in their own
              neighborhood.
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
            <VisualPlaceholder
              title="Retailer Growth"
              subtitle="Flash-sale visibility for kiranas, mini marts, and neighborhood grocery stores"
              accent="clay"
              className="min-h-[400px] h-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
