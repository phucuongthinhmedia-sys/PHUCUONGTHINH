/**
 * Media DTOs for API requests
 * Shared between backend and frontend
 */

import { MediaType } from "../domain/media.types";

export interface CreateMediaDto {
  product_id: string;
  file_url: string;
  file_type: string;
  media_type: MediaType;
  is_cover?: boolean;
  sort_order?: number;
  alt_text?: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  public_url: string;
}
