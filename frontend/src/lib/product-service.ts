import { apiClient } from "./api-client";
import { Product, ProductFiltersResponse, FilterState } from "@/types";

export const productService = {
  async getProducts(filters: FilterState): Promise<ProductFiltersResponse> {
    const params = new URLSearchParams();

    if (filters.categories?.length) {
      params.append("categories", filters.categories.join(","));
    }
    if (filters.styles?.length) {
      params.append("styles", filters.styles.join(","));
    }
    if (filters.spaces?.length) {
      params.append("spaces", filters.spaces.join(","));
    }
    if (filters.search) {
      params.append("search", filters.search);
    }
    if (filters.page) {
      params.append("page", filters.page.toString());
    }
    if (filters.limit) {
      params.append("limit", filters.limit.toString());
    }
    if (filters.technical_specs) {
      params.append("technical_specs", JSON.stringify(filters.technical_specs));
    }

    const queryString = params.toString();
    const url = `/products/filters${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<ProductFiltersResponse>(url);
  },

  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async searchProducts(
    query: string,
    page = 1,
    limit = 20,
  ): Promise<ProductFiltersResponse> {
    return this.getProducts({
      search: query,
      page,
      limit,
    });
  },
};
