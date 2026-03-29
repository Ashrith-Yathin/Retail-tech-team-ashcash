"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { CountdownTimer } from "@/components/countdown-timer";
import { VisualPlaceholder } from "@/components/visual-placeholder";
import { Deal } from "@/lib/types";

export function DealCard({
  deal,
  isFavorite = false,
  onToggleFavorite
}: {
  deal: Deal;
  isFavorite?: boolean;
  onToggleFavorite?: (dealId: number) => void;
}) {
  return (
    <article className="panel overflow-hidden">
      <div className="relative h-48 bg-stone-100">
        <VisualPlaceholder
          title={deal.product_name}
          subtitle={deal.store_name}
          accent={deal.category.toLowerCase().includes("dairy") ? "moss" : deal.category.toLowerCase().includes("bakery") ? "ink" : "clay"}
          className="h-full"
        />
        <span className="absolute left-4 top-4 rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">
          {deal.discount}% off
        </span>
        <button
          type="button"
          onClick={() => onToggleFavorite?.(deal.id)}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-stone-700 shadow-sm"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-coral text-coral" : ""}`} />
        </button>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold">{deal.product_name}</h3>
            <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-medium text-moss">
              {deal.distance_km.toFixed(1)} km
            </span>
          </div>
          <p className="text-sm text-stone-600">{deal.store_name}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-stone-500 line-through">Rs. {deal.original_price.toFixed(2)}</p>
            <p className="text-2xl font-semibold text-ink">Rs. {deal.final_price.toFixed(2)}</p>
          </div>
          <CountdownTimer expiryTime={deal.expiry_time} />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-700">{deal.category}</span>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">{deal.urgency_label}</span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">{deal.availability_label}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-stone-600">
          <span>{deal.popularity_label}</span>
          <span>Score {deal.score.toFixed(1)}</span>
        </div>

        <p className="text-xs text-stone-500">
          Save Rs. {deal.savings_amount.toFixed(2)} and help prevent about {deal.waste_prevented_kg.toFixed(2)} kg of waste.
        </p>

        <Link
          href={`/deals/${deal.id}`}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white hover:bg-stone-800"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
