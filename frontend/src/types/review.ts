export interface UserInReview {
  first_name: string | null;
  last_name: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string; // ISO date string
  user: UserInReview;
}