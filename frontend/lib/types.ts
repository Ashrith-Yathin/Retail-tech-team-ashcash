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
  category: string;
  original_price: number;
  discount: number;
  final_price: number;
  expiry_time: string;
  quantity: number;
  image_url?: string | null;
}

export interface Product {
  id: number;
  retailer_id: number;
  name: string;
  category: string;
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

