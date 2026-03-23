import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductForm } from "@/components/product-form";
import { initFormData } from "@/components/product-form";
import { Category } from "@/lib/category-service";
import { Tag } from "@/lib/tag-service";

const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Gạch Tấm Lớn",
    slug: "gach-tam-lon",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "cat-2",
    name: "Ốp vách Sảnh",
    slug: "op-vach-sanh",
    parent_id: "cat-1",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
];

const mockStyles: Tag[] = [
  {
    id: "style-1",
    name: "Minimalist",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
];

const mockSpaces: Tag[] = [
  {
    id: "space-1",
    name: "Phòng khách",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
];

describe("ProductForm Component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all 5 section headings", () => {
    render(
      <ProductForm
        categories={mockCategories}
        styles={mockStyles}
        spaces={mockSpaces}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText(/1\. Thông tin cơ bản/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Media & Hình ảnh/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Giá cả/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Thông số kỹ thuật/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Tags & Phân loại/i)).toBeInTheDocument();
  });

  it("renders basic info fields", () => {
    render(
      <ProductForm
        categories={mockCategories}
        styles={mockStyles}
        spaces={mockSpaces}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByPlaceholderText(/GCH-600/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mô tả ngắn/i)).toBeInTheDocument();
  });

  it("validates required fields and shows errors", async () => {
    render(
      <ProductForm
        categories={mockCategories}
        styles={mockStyles}
        spaces={mockSpaces}
        onSubmit={mockOnSubmit}
      />,
    );

    fireEvent.click(screen.getByText(/Lưu sản phẩm/i));

    await waitFor(() => {
      expect(screen.getByText(/Tên sản phẩm là bắt buộc/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits with valid data", async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ProductForm
        categories={mockCategories}
        styles={mockStyles}
        spaces={mockSpaces}
        onSubmit={mockOnSubmit}
      />,
    );

    // Fill name
    const nameInput = screen.getByPlaceholderText(/VD: Gạch Ốp Lát/i);
    fireEvent.change(nameInput, { target: { value: "Test Product" } });

    // Fill SKU
    const skuInput = screen.getByPlaceholderText(/GCH-600/i);
    fireEvent.change(skuInput, { target: { value: "TEST-001" } });

    // Select category via CategoryPicker — click parent to expand, then child
    fireEvent.click(screen.getByText("Gạch Tấm Lớn"));
    await waitFor(() =>
      expect(screen.getByText("Ốp vách Sảnh")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText("Ốp vách Sảnh"));

    fireEvent.click(screen.getByText(/Lưu sản phẩm/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Product",
          sku: "TEST-001",
          category_id: "cat-2",
        }),
      );
    });
  });

  it("handles style/space tag selection", async () => {
    render(
      <ProductForm
        categories={mockCategories}
        styles={mockStyles}
        spaces={mockSpaces}
        onSubmit={mockOnSubmit}
      />,
    );

    const styleCheckbox = screen.getByRole("checkbox", { name: /Minimalist/i });
    fireEvent.click(styleCheckbox);

    await waitFor(() => {
      expect(styleCheckbox).toBeChecked();
    });

    const spaceCheckbox = screen.getByRole("checkbox", {
      name: /Phòng khách/i,
    });
    fireEvent.click(spaceCheckbox);
    expect(spaceCheckbox).toBeChecked();
  });
});

// ─── initFormData unit tests ──────────────────────────────────────────────────

describe("initFormData", () => {
  it("returns empty state when no product", () => {
    const state = initFormData(undefined);
    expect(state.name).toBe("");
    expect(state.sku).toBe("");
    expect(state.category_id).toBe("");
    expect(state.technical_specs).toEqual({});
    expect(state.pendingMedia).toEqual([]);
  });

  it("maps product fields correctly", () => {
    const product = {
      id: "p1",
      name: "Gạch Test",
      sku: "SKU-001",
      description: "Mô tả",
      category_id: "cat-1",
      technical_specs: { kich_thuoc: "600x1200" },
      is_published: false,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    const state = initFormData(product);
    expect(state.name).toBe("Gạch Test");
    expect(state.sku).toBe("SKU-001");
    expect(state.category_id).toBe("cat-1");
    expect(state.technical_specs).toEqual({ kich_thuoc: "600x1200" });
  });

  it("maps existing media to pendingMedia with status done", () => {
    const product = {
      id: "p1",
      name: "Test",
      sku: "SKU",
      category_id: "cat-1",
      technical_specs: {},
      is_published: false,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      media: [
        {
          id: "m1",
          product_id: "p1",
          file_url: "https://example.com/img.jpg",
          media_type: "lifestyle" as const,
          is_cover: true,
          sort_order: 0,
          created_at: "2024-01-01",
        },
      ],
    };

    const state = initFormData(product);
    expect(state.pendingMedia).toHaveLength(1);
    expect(state.pendingMedia[0].status).toBe("done");
    expect(state.pendingMedia[0].is_cover).toBe(true);
    expect(state.pendingMedia[0].url).toBe("https://example.com/img.jpg");
  });
});
