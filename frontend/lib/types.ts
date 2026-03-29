export type Role = "retailer" | "customer";

export interface AuthSession {
  access_token: string;
  role: Role;
  user_id: number;
  name: string;
}

export interface Deal {
  id: number;
  product_id: number;
  score: number;
  views: number;
  clicks: number;
  conversion_rate: number;
  distance_km: number;
  store_name: string;
  store_address: string;
  latitude: number;
  longitude: number;
  product_name: string;
  brand?: string | null;
  category: string;
  description?: string | null;
  tags: string[];
  is_featured?: boolean;
  original_price: number;
  discount: number;
  final_price: number;
  savings_amount: number;
  expiry_time: string;
  quantity: number;
  image_url?: string | null;
  urgency_label: string;
  popularity_label: string;
  availability_label: string;
  waste_prevented_kg: number;
  ranking_reasons: string[];
}

export interface Product {
  id: number;
  retailer_id: number;
  name: string;
  brand?: string | null;
  category: string;
  description?: string | null;
  tags?: string[] | null;
  is_featured?: boolean;
  original_price: number;
  discount: number;
  final_price: number;
  expiry_time: string;
  quantity: number;
  image_url?: string | null;
  created_at: string;
}

export interface ProductAnalytics {
  product_id: number;
  product_name: string;
  views: number;
  clicks: number;
  conversion_rate: number;
  status: "active" | "expired";
}

export interface DashboardSummary {
  active_count: number;
  expired_count: number;
  total_views: number;
  total_clicks: number;
  average_conversion_rate: number;
  expiring_soon_count: number;
  low_stock_count: number;
  top_performing_product?: string | null;
}

export interface SearchSuggestion {
  label: string;
  type: "product" | "category" | "store" | "brand";
}

export interface ImpactSummary {
  total_active_deals: number;
  total_retailers: number;
  total_estimated_savings: number;
  total_waste_prevented_kg: number;
}
