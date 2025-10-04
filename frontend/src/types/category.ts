export interface Category {
  id: string; // uuid
  name: string;
  slug: string;
  parent_id: string | null;
  children: Category[];
}