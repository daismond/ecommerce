import type { Product } from './product';
import type { ProductVariant } from './product-variant';

export interface SalesSummary {
  total_revenue: number;
  total_orders: number;
}

export interface TopSellingProduct {
  product: Product;
  total_quantity_sold: number;
}

export interface CriticalStockProduct {
  variant: ProductVariant;
}