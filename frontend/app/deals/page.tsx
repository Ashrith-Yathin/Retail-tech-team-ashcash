"use client";

import { useEffect, useState } from "react";

import { DealCard } from "@/components/deal-card";
import { api } from "@/lib/api";
import { useAppPreferences } from "@/lib/app-preferences";
import {
  addSearchHistory,
  getFavoriteDealIds,
  getSavedFilters,
  getSavedLocations,
  getSearchHistory,
  saveLocation,
  saveFilterPreset,
  type SavedLocation,
  toggleFavoriteDeal
} from "@/lib/preferences";
import { Deal, SearchSuggestion } from "@/lib/types";

type Filters = {
  query: string;
  category: string;
  distance: string;
  discount: string;
  expiry: string;
  sortBy: string;
};

type SavedPreset = {
  label: string;
  filters: Filters;
};

const nonVegKeywords = ["meat", "fish", "chicken", "mutton", "seafood", "poultry", "egg", "beef", "prawn"];

function isNonVegDeal(deal: Deal) {
  const haystack = [
    deal.product_name,
    deal.category,
    deal.brand,
    deal.description,
    ...(deal.tags ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return nonVegKeywords.some((keyword) => haystack.includes(keyword));
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<Deal[]>([]);
  const [locationLabel, setLocationLabel] = useState("Fetching your location");
  const [filters, setFilters] = useState<Filters>({
    query: "",
    category: "",
    distance: "5",
    discount: "",
    expiry: "",
    sortBy: "smart"
  });
  const [coords, setCoords] = useState({ latitude: 12.9716, longitude: 77.5946 });
  const [error, setError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const { dietMode } = useAppPreferences();

  useEffect(() => {
    setFavoriteIds(getFavoriteDealIds());
    setSavedPresets(getSavedFilters<SavedPreset>());
    setSearchHistory(getSearchHistory());
    setSavedLocations(getSavedLocations());
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

    if (filters.query) params.set("q", filters.query);
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

  useEffect(() => {
    if (filters.query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    api.searchSuggestions(filters.query).then(setSuggestions).catch(() => setSuggestions([]));
  }, [filters.query]);

  function handleFavorite(dealId: number) {
    setFavoriteIds(toggleFavoriteDeal(dealId));
  }

  function saveCurrentFilters() {
    const label = filters.query ? `Search: ${filters.query}` : `Deals within ${filters.distance} km`;
    setSavedPresets(saveFilterPreset({ label, filters }));
    if (filters.query) {
      setSearchHistory(addSearchHistory(filters.query));
    }
  }

  function saveCurrentLocation(label: string) {
    setSavedLocations(saveLocation({ label, latitude: coords.latitude, longitude: coords.longitude }));
  }

  const visibleDeals = dietMode === "veg" ? deals.filter((deal) => !isNonVegDeal(deal)) : deals;
  const visibleFeaturedDeals = dietMode === "veg" ? featuredDeals.filter((deal) => !isNonVegDeal(deal)) : featuredDeals;
  const hiddenNonVegCount = deals.length - visibleDeals.length;

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Nearby Deals</h1>
          <p className="mt-2 text-sm text-stone-600">Guest browsing is enabled. Find deals within 5 km and sort them by proximity, discount, urgency, or smart ranking.</p>
          <p className="mt-2 text-sm font-medium text-moss">{locationLabel}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {dietMode === "veg" ? "Veg mode active: vegetarian-friendly grocery deals only" : "Veg + Non-Veg mode active"}
          </p>
        </div>
        <div className="panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
          <input
            placeholder="Search deals or stores"
            value={filters.query}
            onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
          />
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
            <option value="newest">Newest first</option>
          </select>
          <button onClick={saveCurrentFilters} className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-stone-800">
            Save filters
          </button>
        </div>
      </section>

      {suggestions.length > 0 ? (
        <section className="panel p-4">
          <p className="mb-3 text-sm font-medium text-stone-700">Search suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.type}-${suggestion.label}`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    query: suggestion.type === "category" ? prev.query : suggestion.label,
                    category: suggestion.type === "category" ? suggestion.label : prev.category
                  }))
                }
                className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700 hover:border-clay hover:text-clay"
              >
                {suggestion.label} · {suggestion.type}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {(savedPresets.length > 0 || searchHistory.length > 0) ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="panel p-4">
            <p className="mb-3 text-sm font-medium text-stone-700">Saved filters</p>
            <div className="flex flex-wrap gap-2">
              {savedPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setFilters(preset.filters)}
                  className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700 hover:border-clay hover:text-clay"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="panel p-4">
            <p className="mb-3 text-sm font-medium text-stone-700">Recent searches</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilters((prev) => ({ ...prev, query: item }))}
                  className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700 hover:border-clay hover:text-clay"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-stone-700">Saved locations</p>
            <p className="text-xs text-stone-500">Switch quickly between places like home, hostel, or campus.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => saveCurrentLocation("Home")} className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700 hover:border-clay hover:text-clay">
              Save as Home
            </button>
            <button onClick={() => saveCurrentLocation("Campus")} className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700 hover:border-clay hover:text-clay">
              Save as Campus
            </button>
          </div>
        </div>
        {savedLocations.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {savedLocations.map((location) => (
              <button
                key={location.label}
                onClick={() => {
                  setCoords({ latitude: location.latitude, longitude: location.longitude });
                  setLocationLabel(`Using saved location: ${location.label}`);
                }}
                className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-200"
              >
                {location.label}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section
        className={`rounded-[28px] border px-5 py-4 transition-all duration-500 ${
          dietMode === "veg"
            ? "border-moss/30 bg-[linear-gradient(135deg,rgba(116,151,87,0.12),rgba(197,214,170,0.18))]"
            : "border-clay/30 bg-[linear-gradient(135deg,rgba(143,43,30,0.12),rgba(62,101,67,0.16))]"
        }`}
      >
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Discovery mode</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-foreground">
            {dietMode === "veg"
              ? `Showing only vegetarian-friendly deals${hiddenNonVegCount > 0 ? ` and hiding ${hiddenNonVegCount} non-veg item${hiddenNonVegCount === 1 ? "" : "s"}` : ""}.`
              : "Showing the full inventory mix including vegetarian and non-vegetarian deals."}
          </p>
          <span className="rounded-full border border-current/10 px-3 py-1 text-xs font-medium text-foreground/75">
            {dietMode === "veg" ? "Veg only" : "All items"}
          </span>
        </div>
      </section>

      {visibleFeaturedDeals.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Deals</h2>
            <span className="text-sm text-stone-500">Top ranked right now</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {visibleFeaturedDeals.map((deal) => (
              <DealCard key={`featured-${deal.id}`} deal={deal} isFavorite={favoriteIds.includes(deal.id)} onToggleFavorite={handleFavorite} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">All Deals</h2>
          <span className="text-sm text-stone-500">{visibleDeals.length} results</span>
        </div>
        {error ? <p className="text-sm text-coral">{error}</p> : null}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} isFavorite={favoriteIds.includes(deal.id)} onToggleFavorite={handleFavorite} />
          ))}
        </div>
        {visibleDeals.length === 0 && !error ? <p className="text-sm text-stone-500">No deals matched the selected filters.</p> : null}
      </section>

      {visibleDeals.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Trending Right Now</h2>
              <span className="text-sm text-stone-500">Popularity driven</span>
            </div>
            <div className="mt-4 space-y-3">
              {[...visibleDeals].sort((a, b) => b.clicks - a.clicks).slice(0, 3).map((deal) => (
                <div key={`trending-${deal.id}`} className="rounded-2xl bg-stone-50 p-3 text-sm text-stone-700">
                  {deal.product_name} · {deal.popularity_label}
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recently Added</h2>
              <span className="text-sm text-stone-500">Newly surfaced</span>
            </div>
            <div className="mt-4 space-y-3">
              {[...visibleDeals].sort((a, b) => new Date(b.expiry_time).getTime() - new Date(a.expiry_time).getTime()).slice(0, 3).map((deal) => (
                <div key={`recent-${deal.id}`} className="rounded-2xl bg-stone-50 p-3 text-sm text-stone-700">
                  {deal.product_name} · {deal.urgency_label}
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Best Value Nearby</h2>
              <span className="text-sm text-stone-500">Highest savings</span>
            </div>
            <div className="mt-4 space-y-3">
              {[...visibleDeals].sort((a, b) => b.savings_amount - a.savings_amount).slice(0, 3).map((deal) => (
                <div key={`value-${deal.id}`} className="rounded-2xl bg-stone-50 p-3 text-sm text-stone-700">
                  {deal.product_name} · Save Rs. {deal.savings_amount.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
