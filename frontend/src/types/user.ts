export enum UserRole {
  Customer = "customer",
  Admin = "admin",
  Manager = "manager",
}

export interface User {
  id: string; // uuid
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  role: UserRole;
}