"use client";

import { FormEvent, useState } from "react";

import { api } from "@/lib/api";
import { setSession } from "@/lib/session";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const session = await api.login({
        email: formData.get("email"),
        password: formData.get("password")
      });
      setSession(session);
      window.location.href = session.role === "retailer" ? "/dashboard/retailer" : "/deals";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <section className="panel p-8">
        <h1 className="text-3xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-stone-600">Retailers can manage deals, while customers can optionally sign in and browse as guests.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email address" required />
          <input name="password" type="password" placeholder="Password" required />
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white hover:bg-stone-800">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

