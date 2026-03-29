"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";

import { CountdownTimer } from "@/components/countdown-timer";
import { DealCard } from "@/components/deal-card";
import { MapEmbed } from "@/components/map-embed";
import { VisualPlaceholder } from "@/components/visual-placeholder";
import { api } from "@/lib/api";
import { addRecentView, getFavoriteDealIds, getFavoriteStores, toggleFavoriteDeal, toggleFavoriteStore } from "@/lib/preferences";
import { Deal } from "@/lib/types";

export default function DealDetailsPage() {
  const params = useParams<{ id: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [error, setError] = useState("");
  const [similarDeals, setSimilarDeals] = useState<Deal[]>([]);
  const [recentViews, setRecentViews] = useState<Deal[]>([]);
  const [favoriteDeals, setFavoriteDeals] = useState<number[]>([]);
  const [favoriteStores, setFavoriteStores] = useState<string[]>([]);
  const [reserveQuantity, setReserveQuantity] = useState(1);
  const [reserveMessage, setReserveMessage] = useState("");

  useEffect(() => {
    api
      .dealDetails(Number(params.id))
      .then((data) => {
        setDeal(data);
        setRecentViews(addRecentView(data));
        setFavoriteDeals(getFavoriteDealIds());
        setFavoriteStores(getFavoriteStores());
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load deal"));
  }, [params.id]);

  useEffect(() => {
    if (!deal) {
      return;
    }
    const query = new URLSearchParams({
      latitude: String(deal.latitude),
      longitude: String(deal.longitude),
      category: deal.category,
      sort_by: "smart",
      radius_km: "8"
    });
    api.nearbyDeals(query).then((data) => setSimilarDeals(data.filter((item) => item.id !== deal.id).slice(0, 3))).catch(() => setSimilarDeals([]));
  }, [deal]);

  async function openDirections() {
    if (!deal) return;
    await api.trackClick(deal.id);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${deal.latitude},${deal.longitude}`, "_blank");
  }

  function shareDeal() {
    if (!deal) {
      return;
    }
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({ title: deal.product_name, text: `Save Rs. ${deal.savings_amount.toFixed(2)} on ${deal.product_name}`, url })
        .catch(() => undefined);
      return;
    }
    navigator.clipboard.writeText(url).catch(() => undefined);
  }

  async function reserveDeal() {
    if (!deal) {
      return;
    }
    try {
      const response = await api.reserveDeal(deal.id, reserveQuantity);
      setReserveMessage(response.message);
      setDeal({ ...deal, quantity: Math.max(0, deal.quantity - reserveQuantity) });
    } catch (reserveError) {
      setReserveMessage(reserveError instanceof Error ? reserveError.message : "Unable to reserve deal");
    }
  }

  if (error) {
    return <main className="mx-auto max-w-4xl px-4 py-10 text-coral">{error}</main>;
  }

  if (!deal) {
    return <main className="mx-auto max-w-4xl px-4 py-10 text-stone-500">Loading deal details...</main>;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="panel overflow-hidden">
          <div className="relative h-80 bg-stone-100">
            <VisualPlaceholder
              title={deal.product_name}
              subtitle={deal.brand || deal.store_name}
              accent={deal.category.toLowerCase().includes("dairy") ? "moss" : deal.category.toLowerCase().includes("bakery") ? "ink" : "clay"}
              className="h-full"
            />
          </div>
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-coral px-3 py-1 text-sm font-semibold text-white">{deal.discount}% off</span>
              <span className="rounded-full bg-moss/10 px-3 py-1 text-sm font-medium text-moss">{deal.category}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">{deal.urgency_label}</span>
              <CountdownTimer expiryTime={deal.expiry_time} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">{deal.product_name}</h1>
              {deal.brand ? <p className="mt-1 text-sm uppercase tracking-[0.16em] text-stone-500">{deal.brand}</p> : null}
              <p className="mt-2 text-stone-600">
                Rs. <span className="text-3xl font-semibold text-ink">{deal.final_price.toFixed(2)}</span>
                <span className="ml-3 text-base text-stone-400 line-through">Rs. {deal.original_price.toFixed(2)}</span>
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 text-sm">Distance: {deal.distance_km.toFixed(1)} km</div>
              <div className="rounded-2xl bg-stone-50 p-4 text-sm">{deal.availability_label} · {deal.quantity} left</div>
              <div className="rounded-2xl bg-stone-50 p-4 text-sm">Score: {deal.score.toFixed(1)}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-stone-50 p-4 text-sm">Save Rs. {deal.savings_amount.toFixed(2)} with this deal.</div>
              <div className="rounded-2xl bg-stone-50 p-4 text-sm">Helps prevent about {deal.waste_prevented_kg.toFixed(2)} kg of waste.</div>
            </div>
            {deal.description ? <p className="text-sm leading-7 text-stone-600">{deal.description}</p> : null}
            {deal.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {deal.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="space-y-2">
              <p className="text-sm font-medium text-stone-800">Why this deal is ranked highly</p>
              <div className="flex flex-wrap gap-2">
                {deal.ranking_reasons.map((reason) => (
                  <span key={reason} className="rounded-full bg-clay/10 px-3 py-1 text-xs text-clay">
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="panel p-6">
            <h2 className="text-xl font-semibold">Store Information</h2>
            <div className="mt-4 space-y-3 text-sm text-stone-700">
              <p className="font-medium">{deal.store_name}</p>
              <p>{deal.store_address}</p>
              <p>{deal.popularity_label}</p>
              <p>Views: {deal.views} · Clicks: {deal.clicks} · Conversion: {deal.conversion_rate}%</p>
            </div>
            <div className="mt-6 grid gap-3">
              <button onClick={openDirections} className="w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white hover:bg-stone-800">
                Directions
              </button>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, deal.quantity)}
                  value={reserveQuantity}
                  onChange={(event) => setReserveQuantity(Number(event.target.value))}
                />
                <button onClick={reserveDeal} className="rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white hover:bg-moss/90">
                  Reserve
                </button>
              </div>
              {reserveMessage ? <p className="text-sm text-stone-600">{reserveMessage}</p> : null}
              <button
                onClick={() => setFavoriteStores(toggleFavoriteStore(deal.store_name))}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:border-clay hover:text-clay"
              >
                {favoriteStores.includes(deal.store_name) ? "Following store" : "Follow store"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFavoriteDeals(toggleFavoriteDeal(deal.id))}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:border-clay hover:text-clay"
                >
                  <Heart className={`h-4 w-4 ${favoriteDeals.includes(deal.id) ? "fill-coral text-coral" : ""}`} />
                  Save
                </button>
                <button
                  onClick={shareDeal}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:border-clay hover:text-clay"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </section>

          <section className="panel p-4">
            <MapEmbed latitude={deal.latitude} longitude={deal.longitude} />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${deal.latitude}&mlon=${deal.longitude}#map=18/${deal.latitude}/${deal.longitude}`, "_blank")}
                className="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:border-clay hover:text-clay"
              >
                Open in OpenStreetMap
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(`${deal.latitude}, ${deal.longitude}`).catch(() => undefined)}
                className="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:border-clay hover:text-clay"
              >
                Copy coordinates
              </button>
            </div>
          </section>
        </div>
      </section>

      {similarDeals.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Similar Nearby Deals</h2>
            <span className="text-sm text-stone-500">Same category, smart ranked</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similarDeals.map((item) => (
              <DealCard key={item.id} deal={item} isFavorite={favoriteDeals.includes(item.id)} onToggleFavorite={(id) => setFavoriteDeals(toggleFavoriteDeal(id))} />
            ))}
          </div>
        </section>
      ) : null}

      {recentViews.length > 1 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recently Viewed</h2>
            <span className="text-sm text-stone-500">Quick return to recent discoveries</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recentViews.filter((item) => item.id !== deal.id).slice(0, 3).map((item) => (
              <DealCard key={item.id} deal={item} isFavorite={favoriteDeals.includes(item.id)} onToggleFavorite={(id) => setFavoriteDeals(toggleFavoriteDeal(id))} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
