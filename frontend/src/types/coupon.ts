export enum DiscountType {
  Percent = "percent",
  Fixed = "fixed",
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  amount: number;
  valid_from: string;
  valid_to: string | null;
  usage_limit: number;
  used_count: number;
  created_at: string;
  updated_at: string;
}