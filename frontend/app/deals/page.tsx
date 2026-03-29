"use client";

import { useEffect, useState } from "react";

import { DealCard } from "@/components/deal-card";
import { api } from "@/lib/api";
import { Deal } from "@/lib/types";

type Filters = {
  category: string;
  distance: string;
  discount: string;
  expiry: string;
  sortBy: string;
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<Deal[]>([]);
  const [locationLabel, setLocationLabel] = useState("Fetching your location");
  const [filters, setFilters] = useState<Filters>({
    category: "",
    distance: "5",
    discount: "",
    expiry: "",
    sortBy: "smart"
  });
  const [coords, setCoords] = useState({ latitude: 12.9716, longitude: 77.5946 });
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationLabel("Using your current location");
      },
      () => setLocationLabel("Using Bengaluru city center fallback")
    );
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      latitude: String(coords.latitude),
      longitude: String(coords.longitude),
      radius_km: filters.distance,
      sort_by: filters.sortBy
    });

    if (filters.category) params.set("category", filters.category);
    if (filters.discount) params.set("min_discount", filters.discount);
    if (filters.expiry) params.set("expires_before_hours", filters.expiry);

    api
      .nearbyDeals(params)
      .then((data) => {
        setDeals(data);
        setFeaturedDeals([...data].sort((a, b) => b.score - a.score).slice(0, 3));
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load deals"));
  }, [coords, filters]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Nearby Deals</h1>
          <p className="mt-2 text-sm text-stone-600">Guest browsing is enabled. Find deals within 5 km and sort them by proximity, discount, urgency, or smart ranking.</p>
          <p className="mt-2 text-sm font-medium text-moss">{locationLabel}</p>
        </div>
        <div className="panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            placeholder="Category"
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
          />
          <input
            type="number"
            placeholder="Distance km"
            value={filters.distance}
            onChange={(event) => setFilters((prev) => ({ ...prev, distance: event.target.value }))}
          />
          <input
            type="number"
            placeholder="Min discount"
            value={filters.discount}
            onChange={(event) => setFilters((prev) => ({ ...prev, discount: event.target.value }))}
          />
          <input
            type="number"
            placeholder="Expiry in hours"
            value={filters.expiry}
            onChange={(event) => setFilters((prev) => ({ ...prev, expiry: event.target.value }))}
          />
          <select value={filters.sortBy} onChange={(event) => setFilters((prev) => ({ ...prev, sortBy: event.target.value }))}>
            <option value="smart">Smart ranking</option>
            <option value="nearest">Nearest first</option>
            <option value="highest_discount">Highest discount</option>
            <option value="expiring_soon">Expiring soon</option>
          </select>
        </div>
      </section>

      {featuredDeals.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Deals</h2>
            <span className="text-sm text-stone-500">Top ranked right now</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredDeals.map((deal) => (
              <DealCard key={`featured-${deal.id}`} deal={deal} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">All Deals</h2>
          <span className="text-sm text-stone-500">{deals.length} results</span>
        </div>
        {error ? <p className="text-sm text-coral">{error}</p> : null}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
        {deals.length === 0 && !error ? <p className="text-sm text-stone-500">No deals matched the selected filters.</p> : null}
      </section>
    </main>
  );
}

