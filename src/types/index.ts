export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  materials: string;
  care_instructions: string;
  featured: boolean;
  new_arrival: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  size: string;
  color: string;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  session_id: string;
  email: string;
  total: number;
  status: string;
  shipping_info: ShippingInfo;
  payment_intent_id?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  created_at: string;
}

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}
