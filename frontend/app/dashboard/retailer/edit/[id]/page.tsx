"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "retailer") {
      window.location.href = "/login";
      return;
    }

    api
      .getMyProducts(session)
      .then((data) => {
        const allProducts = [...(data.active_deals as Product[]), ...(data.expired_deals as Product[])];
        const matchedProduct = allProducts.find((item) => item.id === Number(params.id)) || null;
        setProduct(matchedProduct);
        setImageUrl(matchedProduct?.image_url || "");
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load product"));
  }, [params.id]);

  function handleFileUpload(file: File | null) {
    if (!file) {
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
      return;
    }

    const formData = new FormData(event.currentTarget);
    try {
      await api.editProduct(
        Number(params.id),
        {
          name: formData.get("name"),
          category: formData.get("category"),
          original_price: Number(formData.get("original_price")),
          discount: Number(formData.get("discount")),
          expiry_time: formData.get("expiry_time"),
          quantity: Number(formData.get("quantity")),
          image_url: imageUrl || formData.get("image_url")
        },
        session
      );
      window.location.href = "/dashboard/retailer";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to update product");
    }
  }

  if (!product && !error) {
    return <main className="mx-auto max-w-3xl px-4 py-10 text-stone-500">Loading product...</main>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <section className="panel p-8">
        <h1 className="text-3xl font-semibold">Edit Product</h1>
        <p className="mt-2 text-sm text-stone-600">Update pricing, discount, quantity, or expiry to keep the deal fresh.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" defaultValue={product?.name} placeholder="Product name" required />
            <input name="category" defaultValue={product?.category} placeholder="Category" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="original_price"
              type="number"
              step="0.01"
              defaultValue={product?.original_price}
              placeholder="Original price"
              required
            />
            <input name="discount" type="number" step="0.01" defaultValue={product?.discount} placeholder="Discount %" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="expiry_time"
              type="datetime-local"
              defaultValue={product?.expiry_time ? new Date(product.expiry_time).toISOString().slice(0, 16) : ""}
              required
            />
            <input name="quantity" type="number" defaultValue={product?.quantity} placeholder="Quantity available" required />
          </div>
          <input name="image_url" type="url" defaultValue={product?.image_url || ""} placeholder="Product image URL" />
          <input type="file" accept="image/*" onChange={(event) => handleFileUpload(event.target.files?.[0] || null)} />
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <button className="w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white hover:bg-stone-800">Update product</button>
        </form>
      </section>
    </main>
  );
}
