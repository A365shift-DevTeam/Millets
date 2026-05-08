import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { id: string; name: string; quantity: number; price: number }[];
  subtotal: number;
  delivery_fee: number;
  grand_total: number;
  payment_method: 'upi' | 'card' | 'cod';
  payment_note: string | null;
  is_new: boolean;
  created_at: string;
}
