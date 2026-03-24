/**
 * Tag DTOs for API requests
 * Shared between backend and frontend
 */

export interface CreateTagDto {
  name: string;
}

export interface UpdateTagDto {
  name?: string;
}
