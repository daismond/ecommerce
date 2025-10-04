import { ProductVariant } from './product';

export interface CartItem {
  id: string; // uuid
  product_variant_id: string; // uuid
  quantity: number;
  product_variant: ProductVariant; // Nested object with variant details
}

export interface Cart {
  id: string; // uuid
  user_id: string | null;
  items: CartItem[];
}