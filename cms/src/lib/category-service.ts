import { apiClient } from "./api-client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  parent_id?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  parent_id?: string;
}

class CategoryService {
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories");
  }

  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    return apiClient.post<Category>("/categories", data);
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<Category> {
    return apiClient.put<Category>(`/categories/${id}`, data);
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();
