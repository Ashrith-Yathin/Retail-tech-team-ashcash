import { AuthSession, DashboardSummary, Deal, ImpactSummary, SearchSuggestion } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(data.detail || "Request failed");
  }

  return response.json();
}

export function authHeaders(session: AuthSession | null): HeadersInit {
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export const api = {
  register: (payload: Record<string, unknown>) =>
    request<AuthSession>("/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: Record<string, unknown>) =>
    request<AuthSession>("/login", { method: "POST", body: JSON.stringify(payload) }),
  addProduct: (payload: Record<string, unknown>, session: AuthSession | null) =>
    request("/add-product", {
      method: "POST",
      headers: authHeaders(session),
      body: JSON.stringify(payload)
    }),
  getMyProducts: (session: AuthSession | null) =>
    request<{ active_deals: unknown[]; expired_deals: unknown[]; analytics: unknown[]; summary: DashboardSummary }>("/my-products", {
      headers: authHeaders(session)
    }),
  editProduct: (id: number, payload: Record<string, unknown>, session: AuthSession | null) =>
    request(`/edit-product/${id}`, {
      method: "PUT",
      headers: authHeaders(session),
      body: JSON.stringify(payload)
    }),
  deleteProduct: (id: number, session: AuthSession | null) =>
    request(`/delete-product/${id}`, { method: "DELETE", headers: authHeaders(session) }),
  impactSummary: () => request<ImpactSummary>("/impact-summary"),
  nearbyDeals: (params: URLSearchParams) => request<Deal[]>(`/nearby-deals?${params.toString()}`),
  featuredDeals: (params: URLSearchParams) => request<Deal[]>(`/featured-deals?${params.toString()}`),
  searchSuggestions: (query: string) => request<SearchSuggestion[]>(`/search-suggestions?q=${encodeURIComponent(query)}`),
  dealDetails: (id: number) => request<Deal>(`/deal/${id}`),
  trackClick: (id: number) => request<{ message: string }>(`/deal/${id}/click`, { method: "POST" }),
  reserveDeal: (id: number, quantity: number) =>
    request<{ message: string }>(`/deal/${id}/reserve`, { method: "POST", body: JSON.stringify({ quantity }) })
};
