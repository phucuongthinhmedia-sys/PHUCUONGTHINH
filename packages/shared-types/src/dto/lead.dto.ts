/**
 * Lead DTOs for API requests
 * Shared between backend and frontend
 */

export interface UpdateLeadDto {
  status?: "new" | "contacted" | "converted";
  project_details?: string;
}
