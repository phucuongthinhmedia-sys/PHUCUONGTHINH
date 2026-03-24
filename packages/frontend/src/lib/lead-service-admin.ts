import { apiClient } from "./admin-api-client";

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

export interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface UpdateLeadRequest {
  status?: "new" | "contacted" | "converted";
  project_details?: string;
}

class LeadAdminService {
  async getLeads(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<LeadsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    return apiClient.get<LeadsResponse>(`/leads?${params.toString()}`);
  }

  async getLeadById(id: string): Promise<Lead> {
    return apiClient.get<Lead>(`/leads/${id}`);
  }

  async updateLead(id: string, data: UpdateLeadRequest): Promise<Lead> {
    return apiClient.put<Lead>(`/leads/${id}`, data);
  }

  async updateLeadStatus(
    id: string,
    status: "new" | "contacted" | "converted",
  ): Promise<Lead> {
    return apiClient.put<Lead>(`/leads/${id}`, { status });
  }
}

export const leadService = new LeadAdminService();
