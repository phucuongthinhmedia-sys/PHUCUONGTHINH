/**
 * Import job DTOs for catalogue bulk import
 * Shared between backend and frontend
 */

export type ImportStatus = "pending" | "processing" | "completed" | "failed";

export interface ImportJob {
  id: string;
  file_name: string;
  status: ImportStatus;
  progress: number;
  current_page: number;
  total_pages: number;
  failed_pages: number[];
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface ExtractedProduct {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  category?: string;
  category_id?: string;
  technical_specs: Record<string, any>;
  price_retail?: number;
  price_dealer?: number;
  unit?: string;
  images: string[];
  validation_status: "valid" | "warning" | "error";
  validation_errors: string[];
  user_edited: boolean;
  page_number: number;
}

export interface BulkCreateResult {
  success: string[];
  failed: Array<{ id: string; error: string }>;
}
