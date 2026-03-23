import { leadService } from "@/lib/lead-service";
import { apiClient } from "@/lib/api-client";

jest.mock("@/lib/api-client");

describe("Lead Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a lead", async () => {
    const mockLead = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      inquiry_type: "appointment" as const,
      status: "new",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockLead);

    const result = await leadService.createLead({
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      inquiry_type: "appointment",
    });

    expect(result).toEqual(mockLead);
    expect(apiClient.post).toHaveBeenCalledWith(
      "/leads",
      expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        inquiry_type: "appointment",
      }),
    );
  });

  it("should create a quote lead", async () => {
    const mockLead = {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      inquiry_type: "quote" as const,
      project_details: "Need tiles for kitchen",
      status: "new",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockLead);

    const result = await leadService.createLead({
      name: "Jane Smith",
      email: "jane@example.com",
      inquiry_type: "quote",
      project_details: "Need tiles for kitchen",
    });

    expect(result).toEqual(mockLead);
    expect(apiClient.post).toHaveBeenCalledWith(
      "/leads",
      expect.objectContaining({
        name: "Jane Smith",
        inquiry_type: "quote",
        project_details: "Need tiles for kitchen",
      }),
    );
  });

  it("should include product IDs in lead creation", async () => {
    const mockLead = {
      id: "3",
      name: "John Doe",
      email: "john@example.com",
      inquiry_type: "quote" as const,
      status: "new",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockLead);

    await leadService.createLead({
      name: "John Doe",
      email: "john@example.com",
      inquiry_type: "quote",
      product_ids: ["prod-1", "prod-2"],
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/leads",
      expect.objectContaining({
        product_ids: ["prod-1", "prod-2"],
      }),
    );
  });
});
