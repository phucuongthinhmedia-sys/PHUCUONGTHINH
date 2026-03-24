/**
 * Lead domain types
 * Shared between backend and frontend
 */

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  inquiry_type: "appointment" | "quote";
  project_details?: string;
  status: "new" | "contacted" | "converted";
  preferred_date?: string;
  created_at: string;
  updated_at: string;
}
