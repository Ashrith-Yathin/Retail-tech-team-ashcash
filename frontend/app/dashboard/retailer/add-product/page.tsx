"use client";

import { FormEvent, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { getSession } from "@/lib/session";

export default function AddProductPage() {
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const finalPrice = useMemo(() => originalPrice * (1 - discount / 100), [discount, originalPrice]);

  function handleFileUpload(file: File | null) {
    if (!file) {
      setImageUrl("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }

    const formData = new FormData(event.currentTarget);
    try {
      await api.addProduct(
        {
          name: formData.get("name"),
          category: formData.get("category"),
          original_price: Number(formData.get("original_price")),
          discount: Number(formData.get("discount")),
          expiry_time: formData.get("expiry_time"),
          quantity: Number(formData.get("quantity")),
          image_url: imageUrl || formData.get("image_url"),
          store_name: formData.get("store_name"),
          store_address: formData.get("store_address"),
          latitude: Number(formData.get("latitude")),
          longitude: Number(formData.get("longitude"))
        },
        session
      );
      window.location.href = "/dashboard/retailer";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to add product");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <section className="panel p-8">
        <h1 className="text-3xl font-semibold">Add Product</h1>
        <p className="mt-2 text-sm text-stone-600">Upload overstocked or near-expiry inventory with pricing, quantity, and precise store location.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" placeholder="Product name" required />
            <input name="category" placeholder="Category" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              name="original_price"
              type="number"
              step="0.01"
              placeholder="Original price"
              required
              onChange={(event) => setOriginalPrice(Number(event.target.value))}
            />
            <input
              name="discount"
              type="number"
              step="0.01"
              placeholder="Discount %"
              required
              onChange={(event) => setDiscount(Number(event.target.value))}
            />
            <input value={Number.isFinite(finalPrice) ? finalPrice.toFixed(2) : "0.00"} readOnly aria-label="Final price" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="expiry_time" type="datetime-local" required />
            <input name="quantity" type="number" placeholder="Quantity available" required />
          </div>
          <input name="image_url" type="url" placeholder="Product image URL" />
          <input type="file" accept="image/*" onChange={(event) => handleFileUpload(event.target.files?.[0] || null)} />
          <input name="store_name" placeholder="Store name" required />
          <input name="store_address" placeholder="Store address" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="latitude" type="number" step="any" placeholder="Latitude" required />
            <input name="longitude" type="number" step="any" placeholder="Longitude" required />
          </div>
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <button className="w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white hover:bg-stone-800">Save product</button>
        </form>
      </section>
    </main>
  );
}
