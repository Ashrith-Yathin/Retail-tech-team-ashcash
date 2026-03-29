"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { Product, ProductAnalytics } from "@/lib/types";

export default function RetailerDashboardPage() {
  const [activeDeals, setActiveDeals] = useState<Product[]>([]);
  const [expiredDeals, setExpiredDeals] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<ProductAnalytics[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "retailer") {
      window.location.href = "/login";
      return;
    }

    api
      .getMyProducts(session)
      .then((data) => {
        setActiveDeals(data.active_deals as Product[]);
        setExpiredDeals(data.expired_deals as Product[]);
        setAnalytics(data.analytics as ProductAnalytics[]);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard"));
  }, []);

  async function deleteProduct(productId: number) {
    const session = getSession();
    if (!session) {
      return;
    }
    await api.deleteProduct(productId, session);
    window.location.reload();
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Retailer Dashboard</h1>
          <p className="mt-2 text-sm text-stone-600">Manage active and expired deals, then track demand through views, clicks, and conversion rate.</p>
        </div>
        <Link href="/dashboard/retailer/add-product" className="rounded-2xl bg-ink px-5 py-3 text-center font-medium text-white hover:bg-stone-800">
          Add Product
        </Link>
      </section>

      {error ? <p className="text-sm text-coral">{error}</p> : null}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Deals</h2>
              <span className="text-sm text-stone-500">{activeDeals.length} live</span>
            </div>
            <div className="space-y-4">
              {activeDeals.map((product) => (
                <div key={product.id} className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-stone-600">
                        {product.category} · Rs. {product.final_price.toFixed(2)} · {product.discount}% off
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/retailer/edit/${product.id}`}
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm hover:border-clay hover:text-clay"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="rounded-full border border-coral/30 px-4 py-2 text-sm text-coral hover:bg-coral/5"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {activeDeals.length === 0 ? <p className="text-sm text-stone-500">No active deals yet.</p> : null}
            </div>
          </div>

          <div className="panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Expired Deals</h2>
              <span className="text-sm text-stone-500">{expiredDeals.length} archived</span>
            </div>
            <div className="space-y-4">
              {expiredDeals.map((product) => (
                <div key={product.id} className="rounded-2xl border border-stone-200 p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-stone-600">
                    {product.category} · expired on {new Date(product.expiry_time).toLocaleString()}
                  </p>
                </div>
              ))}
              {expiredDeals.length === 0 ? <p className="text-sm text-stone-500">No expired deals yet.</p> : null}
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-xl font-semibold">Retailer Analytics</h2>
          <div className="mt-5 space-y-4">
            {analytics.map((item) => (
              <div key={item.product_id} className="rounded-2xl border border-stone-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{item.product_name}</h3>
                    <p className="text-sm capitalize text-stone-500">{item.status}</p>
                  </div>
                  <span className="rounded-full bg-clay/10 px-3 py-1 text-xs font-medium text-clay">
                    {item.conversion_rate}% conversion
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-stone-700">
                  <div className="rounded-2xl bg-stone-50 p-3">Views: {item.views}</div>
                  <div className="rounded-2xl bg-stone-50 p-3">Clicks: {item.clicks}</div>
                </div>
              </div>
            ))}
            {analytics.length === 0 ? <p className="text-sm text-stone-500">Analytics will appear once products are added.</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
