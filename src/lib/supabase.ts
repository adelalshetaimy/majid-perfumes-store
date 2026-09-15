import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const WHATSAPP_NUMBER = '967730700888';

export type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  currency: string;
  category: string;
  category_id: string | null;
  description: string;
  image_url: string;
  availability: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type Review = {
  id: string;
  customer_name: string;
  review_text: string;
  rating: number;
  created_at: string;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  location: string;
  address: string;
  notes: string;
  marketing_consent: boolean;
  items: OrderItem[];
  total: number;
  currency: string;
  status: string;
  created_at: string;
};

export async function fetchActiveCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error || !data) return [];
  return data as Category[];
}

export function formatPrice(price: number, currency: string): string {
  const formatted = Number(price).toLocaleString('ar-EG', { maximumFractionDigits: 0 });
  return `${formatted} ${currency}`;
}
