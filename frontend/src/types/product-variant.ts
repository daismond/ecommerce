export type ProductVariant = {
  id: string; // uuid
  sku: string | null;
  price: number; // decimal
  compare_at_price: number | null;
  stock: number;
  attributes: Record<string, any>; // json
}