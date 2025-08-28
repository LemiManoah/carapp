export interface Advertisment {
  id: number;
  car_id: number;
  user_id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  allows_bidding: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  // Eager-loaded relations
  car?: {
    id: number;
    brand: string;
    model: string;
    thumb_url?: string | null;
  } | null;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
  [key: string]: unknown;
}
