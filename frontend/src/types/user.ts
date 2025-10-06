export type UserRole = "customer" | "admin" | "manager";

export const UserRole = {
  Customer: "customer" as const,
  Admin: "admin" as const,
  Manager: "manager" as const,
};

export interface User {
  id: string; // uuid
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  role: UserRole;
}