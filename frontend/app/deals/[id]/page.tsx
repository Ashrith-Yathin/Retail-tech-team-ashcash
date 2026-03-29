"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CountdownTimer } from "@/components/countdown-timer";
import { MapEmbed } from "@/components/map-embed";
import { api } from "@/lib/api";
import { Deal } from "@/lib/types";

export default function DealDetailsPage() {
  const params = useParams<{ id: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .dealDetails(Number(params.id))
      .then((data) => setDeal(data))
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load deal"));
  }, [params.id]);

  async function openDirections() {
    if (!deal) return;
    await api.trackClick(deal.id);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${deal.latitude},${deal.longitude}`, "_blank");
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
            <Image
              src={deal.image_url || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80"}
              alt={deal.product_name}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-coral px-3 py-1 text-sm font-semibold text-white">{deal.discount}% off</span>
              <span className="rounded-full bg-moss/10 px-3 py-1 text-sm font-medium text-moss">{deal.category}</span>
              <CountdownTimer expiryTime={deal.expiry_time} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">{deal.product_name}</h1>
              <p className="mt-2 text-stone-600">
                Rs. <span className="text-3xl font-semibold text-ink">{deal.final_price.toFixed(2)}</span>
                <span className="ml-3 text-base text-stone-400 line-through">Rs. {deal.original_price.toFixed(2)}</span>
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4 text-sm">Distance: {deal.distance_km.toFixed(1)} km</div>
              <div className="rounded-2xl bg-stone-50 p-4 text-sm">Quantity: {deal.quantity}</div>
              <div className="rounded-2xl bg-stone-50 p-4 text-sm">Score: {deal.score.toFixed(1)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="panel p-6">
            <h2 className="text-xl font-semibold">Store Information</h2>
            <div className="mt-4 space-y-3 text-sm text-stone-700">
              <p className="font-medium">{deal.store_name}</p>
              <p>{deal.store_address}</p>
              <p>Views: {deal.views} · Clicks: {deal.clicks} · Conversion: {deal.conversion_rate}%</p>
            </div>
            <button onClick={openDirections} className="mt-6 w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white hover:bg-stone-800">
              Directions
            </button>
          </section>

          <section className="panel p-4">
            <MapEmbed latitude={deal.latitude} longitude={deal.longitude} />
          </section>
        </div>
      </section>
    </main>
  );
}
