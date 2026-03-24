/**
 * Category DTOs for API requests
 * Shared between backend and frontend
 */

export interface CreateCategoryDto {
  name: string;
  slug: string;
  parent_id?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  parent_id?: string;
}
