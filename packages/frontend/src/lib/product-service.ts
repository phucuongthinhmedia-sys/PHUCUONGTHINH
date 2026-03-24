import { apiClient, rawApiClient } from "./admin-api-client";

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category_id: string;
  technical_specs: Record<string, any>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string;
  category_id: string;
  technical_specs: Record<string, any>;
  style_ids?: string[];
  space_ids?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  description?: string;
  category_id?: string;
  technical_specs?: Record<string, any>;
  is_published?: boolean;
  style_ids?: string[];
  space_ids?: string[];
}

export interface ProductFiltersResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

interface BackendProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

class ProductService {
  async getProducts(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ProductFiltersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      published: "all",
    });

    if (search) params.append("search", search);

    const raw = await rawApiClient.getRaw<BackendProductsResponse>(
      `/products?${params.toString()}`,
    );

    return {
      products: raw.data ?? [],
      pagination: raw.pagination,
    };
  }

  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    return apiClient.post<Product>("/products", data);
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest,
  ): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, data);
  }

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }

  async publishProduct(id: string): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, { is_published: true });
  }

  async unpublishProduct(id: string): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, { is_published: false });
  }

  async cloneProduct(id: string): Promise<Product> {
    const source = await this.getProductById(id);
    const cloned = await this.createProduct({
      name: `${source.name} (Bản sao)`,
      sku: `${source.sku}-COPY-${Date.now().toString(36).toUpperCase()}`,
      description: source.description,
      category_id: source.category_id,
      technical_specs: source.technical_specs,
    });
    return cloned;
  }
}

export const productService = new ProductService();
