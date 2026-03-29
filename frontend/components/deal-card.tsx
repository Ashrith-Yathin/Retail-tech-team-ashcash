import Image from "next/image";
import Link from "next/link";

import { CountdownTimer } from "@/components/countdown-timer";
import { Deal } from "@/lib/types";

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="panel overflow-hidden">
      <div className="relative h-48 bg-stone-100">
        <Image
          src={deal.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"}
          alt={deal.product_name}
          fill
          className="object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">
          {deal.discount}% off
        </span>
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

        <div className="flex items-center justify-between text-sm text-stone-600">
          <span>{deal.category}</span>
          <span>Score {deal.score.toFixed(1)}</span>
        </div>

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

