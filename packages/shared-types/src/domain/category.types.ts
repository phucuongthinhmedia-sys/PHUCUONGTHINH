/**
 * Category domain types
 * Shared between backend and frontend
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}
