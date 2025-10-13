export interface ProductVariant {
  id: string; // uuid.UUID is a string
  sku?: string;
  price: number; // decimal.Decimal can be represented as a number
  compare_at_price?: number;
  stock: number;
  attributes: { [key: string]: any }; // Dict[str, Any]
}

export interface Product {
  id: string; // uuid.UUID is a string
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  category_id: string; // uuid.UUID is a string
  is_published: boolean;
  variants: ProductVariant[];
}
