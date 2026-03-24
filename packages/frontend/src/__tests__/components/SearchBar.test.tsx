import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/SearchBar";

describe("SearchBar Component", () => {
  it("should render search input", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText("Search products...");
    expect(input).toBeInTheDocument();
  });

  it("should call onSearch when user types", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(
      "Search products...",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "tiles" } });

    expect(mockOnSearch).toHaveBeenCalledWith("tiles");
  });

  it("should clear search when clear button is clicked", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(
      "Search products...",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "tiles" } });

    const clearButton = screen.getByText("✕");
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith("");
    expect(input.value).toBe("");
  });

  it("should use custom placeholder", () => {
    const mockOnSearch = jest.fn();
    render(
      <SearchBar onSearch={mockOnSearch} placeholder="Find materials..." />,
    );

    expect(
      screen.getByPlaceholderText("Find materials..."),
    ).toBeInTheDocument();
  });
});
