import { apiClient } from "./api-client";

export interface Tag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name?: string;
}

class TagService {
  async getStyles(): Promise<Tag[]> {
    return apiClient.get<Tag[]>("/styles");
  }

  async getSpaces(): Promise<Tag[]> {
    return apiClient.get<Tag[]>("/spaces");
  }

  async createStyle(data: CreateTagRequest): Promise<Tag> {
    return apiClient.post<Tag>("/styles", data);
  }

  async createSpace(data: CreateTagRequest): Promise<Tag> {
    return apiClient.post<Tag>("/spaces", data);
  }

  async updateStyle(id: string, data: UpdateTagRequest): Promise<Tag> {
    return apiClient.put<Tag>(`/styles/${id}`, data);
  }

  async updateSpace(id: string, data: UpdateTagRequest): Promise<Tag> {
    return apiClient.put<Tag>(`/spaces/${id}`, data);
  }

  async deleteStyle(id: string): Promise<void> {
    await apiClient.delete(`/styles/${id}`);
  }

  async deleteSpace(id: string): Promise<void> {
    await apiClient.delete(`/spaces/${id}`);
  }
}

export const tagService = new TagService();
