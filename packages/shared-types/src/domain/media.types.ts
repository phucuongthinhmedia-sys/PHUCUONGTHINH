/**
 * Media domain types
 * Shared between backend and frontend
 */

export type MediaType =
  | "lifestyle"
  | "cutout"
  | "video"
  | "3d_file"
  | "pdf"
  | "social_link";

export interface Media {
  id: string;
  product_id: string;
  file_url: string;
  media_type: MediaType;
  is_cover: boolean;
  sort_order: number;
  alt_text?: string;
  created_at: string;
}
