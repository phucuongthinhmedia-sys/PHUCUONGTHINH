import { apiClient } from "./api-client";
import { Lead } from "@/types";

export interface CreateLeadRequest {
  name: string;
  email?: string;
  phone?: string;
  inquiry_type: "appointment" | "quote";
  project_details?: string;
  preferred_date?: string;
  product_ids?: string[];
}

export const leadService = {
  async createLead(data: CreateLeadRequest): Promise<Lead> {
    return apiClient.post<Lead>("/leads", data);
  },
};
