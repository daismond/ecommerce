import type { ProductVariant } from './product-variant';

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