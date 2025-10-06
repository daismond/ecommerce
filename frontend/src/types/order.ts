import type { ProductVariantWithProduct } from './responses';

export interface OrderItem {
  id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: number;
  product_variant: ProductVariantWithProduct;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_address: {
    name?: string;
    street?: string;
    city?: string;
    zip?: string;
  };
  items: OrderItem[];
  created_at: string; // ISO date string
}