import { productService } from "@/lib/product-service";
import { apiClient } from "@/lib/api-client";

jest.mock("@/lib/api-client");

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch products with filters", async () => {
    const mockResponse = {
      products: [
        {
          id: "1",
          name: "Tile 1",
          sku: "TILE-001",
          category_id: "cat-1",
          technical_specs: {},
          is_published: true,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        total_pages: 1,
      },
      filters: {
        available_styles: [],
        available_spaces: [],
        available_categories: [],
      },
    };

    (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await productService.getProducts({
      page: 1,
      limit: 20,
    });

    expect(result).toEqual(mockResponse);
    expect(apiClient.get).toHaveBeenCalled();
  });

  it("should fetch product by ID", async () => {
    const mockProduct = {
      id: "1",
      name: "Tile 1",
      sku: "TILE-001",
      category_id: "cat-1",
      technical_specs: {},
      is_published: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    (apiClient.get as jest.Mock).mockResolvedValue(mockProduct);

    const result = await productService.getProductById("1");

    expect(result).toEqual(mockProduct);
    expect(apiClient.get).toHaveBeenCalledWith("/products/1");
  });

  it("should search products", async () => {
    const mockResponse = {
      products: [
        {
          id: "1",
          name: "Tile 1",
          sku: "TILE-001",
          category_id: "cat-1",
          technical_specs: {},
          is_published: true,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        total_pages: 1,
      },
      filters: {
        available_styles: [],
        available_spaces: [],
        available_categories: [],
      },
    };

    (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await productService.searchProducts("tile", 1, 20);

    expect(result).toEqual(mockResponse);
    expect(apiClient.get).toHaveBeenCalled();
  });

  it("should include style filters in request", async () => {
    const mockResponse = {
      products: [],
      pagination: { page: 1, limit: 20, total: 0, total_pages: 0 },
      filters: {
        available_styles: [],
        available_spaces: [],
        available_categories: [],
      },
    };

    (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

    await productService.getProducts({
      styles: ["style-1", "style-2"],
      page: 1,
      limit: 20,
    });

    const callUrl = (apiClient.get as jest.Mock).mock.calls[0][0];
    expect(callUrl).toContain("styles=style-1%2Cstyle-2");
  });

  it("should include space filters in request", async () => {
    const mockResponse = {
      products: [],
      pagination: { page: 1, limit: 20, total: 0, total_pages: 0 },
      filters: {
        available_styles: [],
        available_spaces: [],
        available_categories: [],
      },
    };

    (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

    await productService.getProducts({
      spaces: ["space-1"],
      page: 1,
      limit: 20,
    });

    const callUrl = (apiClient.get as jest.Mock).mock.calls[0][0];
    expect(callUrl).toContain("spaces=space-1");
  });
});
