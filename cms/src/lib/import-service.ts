import { apiClient } from "./api-client";

export interface ImportJob {
  id: string;
  file_name: string;
  status: "pending" | "processing" | "completed" | "failed";
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

class ImportService {
  /**
   * Upload catalogue PDF and create import job
   */
  async uploadCatalogue(
    file: File,
  ): Promise<{ job_id: string; status: string; total_pages: number }> {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post("/import/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Get import job status
   */
  async getJob(jobId: string): Promise<ImportJob> {
    return apiClient.get(`/import/jobs/${jobId}`);
  }

  /**
   * Get extracted products for a job
   */
  async getExtractedProducts(jobId: string): Promise<ExtractedProduct[]> {
    return apiClient.get(`/import/jobs/${jobId}/products`);
  }

  /**
   * Bulk create products from extracted data
   */
  async bulkCreate(
    jobId: string,
    productIds: string[],
  ): Promise<BulkCreateResult> {
    return apiClient.post(`/import/jobs/${jobId}/bulk-create`, {
      product_ids: productIds,
    });
  }

  /**
   * Update extracted product (when user edits)
   */
  async updateExtractedProduct(
    productId: string,
    data: Partial<ExtractedProduct>,
  ): Promise<ExtractedProduct> {
    return apiClient.post(`/import/products/${productId}`, data);
  }
}

export const importService = new ImportService();
