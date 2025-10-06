import type { ProductVariantWithProduct } from './responses';

export interface CartItem {
  id: string; // uuid
  product_variant_id: string; // uuid
  quantity: number;
  product_variant: ProductVariantWithProduct; // Nested object with variant details
}

export interface Cart {
  id: string; // uuid
  user_id: string | null;
  items: CartItem[];
}