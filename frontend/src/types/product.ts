export interface Product {
  id: string; // uuid
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category_id: string; // uuid
  is_published: boolean;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string; // uuid
  sku: string | null;
  price: number; // decimal
  compare_at_price: number | null;
  stock: number;
  attributes: Record<string, any>; // json
  product: Product; // The parent product, now included in the API response for cart items
}