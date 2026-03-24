import React from "react";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props: any) {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

describe("ProductCard Component", () => {
  const mockProduct: Product = {
    id: "1",
    name: "Premium Tile",
    sku: "TILE-001",
    description: "High-quality porcelain tile",
    category_id: "cat-1",
    technical_specs: { thickness: 10, material: "Porcelain" },
    is_published: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    media: [
      {
        id: "media-1",
        product_id: "1",
        file_url: "https://example.com/image.jpg",
        file_type: "image/jpeg",
        media_type: "lifestyle",
        sort_order: 0,
        is_cover: true,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
    ],
    style_tags: [
      {
        id: "style-1",
        name: "Minimalist",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
    ],
    space_tags: [
      {
        id: "space-1",
        name: "Kitchen",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
    ],
  };

  it("should render product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Premium Tile")).toBeInTheDocument();
  });

  it("should render product SKU", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/SKU: TILE-001/)).toBeInTheDocument();
  });

  it("should render product description", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("High-quality porcelain tile")).toBeInTheDocument();
  });

  it("should render style tags", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Minimalist")).toBeInTheDocument();
  });

  it("should render space tags", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Kitchen")).toBeInTheDocument();
  });

  it("should link to product detail page", () => {
    render(<ProductCard product={mockProduct} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/products/1");
  });
});
