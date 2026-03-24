/**
 * API response types
 * Shared between backend and frontend
 */

import { Product } from "../domain/product.types";
import { Lead } from "../domain/lead.types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
