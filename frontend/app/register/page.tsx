"use client";

import { FormEvent, useState } from "react";

import { api } from "@/lib/api";
import { setSession } from "@/lib/session";

export default function RegisterPage() {
  const [role, setRole] = useState<"retailer" | "customer">("retailer");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role,
      store_name: role === "retailer" ? formData.get("store_name") : undefined,
      store_address: role === "retailer" ? formData.get("store_address") : undefined,
      latitude: role === "retailer" ? Number(formData.get("latitude")) : undefined,
      longitude: role === "retailer" ? Number(formData.get("longitude")) : undefined
    };

    try {
      const session = await api.register(payload);
      setSession(session);
      window.location.href = role === "retailer" ? "/dashboard/retailer" : "/deals";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to register");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <section className="panel p-8">
        <h1 className="text-3xl font-semibold">Register</h1>
        <p className="mt-2 text-sm text-stone-600">Create a retailer account to publish deals, or join as a customer and browse nearby offers.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" placeholder="Full name" required />
            <input name="email" type="email" placeholder="Email address" required />
          </div>
          <input name="password" type="password" placeholder="Password" required />
          <select value={role} onChange={(event) => setRole(event.target.value as "retailer" | "customer")}>
            <option value="retailer">Retailer</option>
            <option value="customer">Customer</option>
          </select>
          {role === "retailer" ? (
            <div className="grid gap-4">
              <input name="store_name" placeholder="Store name" required />
              <input name="store_address" placeholder="Store address" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="latitude" type="number" step="any" placeholder="Latitude" required />
                <input name="longitude" type="number" step="any" placeholder="Longitude" required />
              </div>
            </div>
          ) : null}
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <button className="w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white hover:bg-stone-800">Create account</button>
        </form>
      </section>
    </main>
  );
}

