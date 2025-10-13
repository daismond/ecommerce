import type { ProductVariant } from './product';

export interface OrderItem {
    id: string;
    product_variant_id: string;
    quantity: number;
    unit_price: number;
    product_variant: ProductVariant;
}

export interface Order {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    shipping_address: { [key: string]: any };
    items: OrderItem[];
    created_at: string; // Assuming this field exists from the database model
}
