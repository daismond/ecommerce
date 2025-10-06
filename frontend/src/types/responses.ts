import type { Product } from './product';
import type { ProductVariant } from './product-variant';

export interface ProductVariantWithProduct extends ProductVariant {
  product: Omit<Product, 'variants'>;
}
