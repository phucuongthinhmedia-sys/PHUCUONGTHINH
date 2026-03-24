import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QuoteForm } from "@/components/QuoteForm";
import * as leadService from "@/lib/lead-service";

jest.mock("@/lib/lead-service");

describe("QuoteForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form fields", () => {
    render(<QuoteForm />);

    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("john@example.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("+1 (555) 000-0000"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Describe your project, requirements, and any specific materials you're interested in...",
      ),
    ).toBeInTheDocument();
  });

  it("should show error when name is empty", async () => {
    render(<QuoteForm />);

    const submitButton = screen.getByText("Request Quote");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("should show error when project details are empty", async () => {
    render(<QuoteForm />);

    const nameInput = screen.getByPlaceholderText("John Doe");
    const emailInput = screen.getByPlaceholderText("john@example.com");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    const submitButton = screen.getByText("Request Quote");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Project details are required"),
      ).toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    (leadService.leadService.createLead as jest.Mock).mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      inquiry_type: "quote",
      project_details: "Need tiles for kitchen",
      status: "new",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    });

    render(<QuoteForm />);

    const nameInput = screen.getByPlaceholderText("John Doe");
    const emailInput = screen.getByPlaceholderText("john@example.com");
    const projectInput = screen.getByPlaceholderText(
      "Describe your project, requirements, and any specific materials you're interested in...",
    );

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(projectInput, {
      target: { value: "Need tiles for kitchen" },
    });

    const submitButton = screen.getByText("Request Quote");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(leadService.leadService.createLead).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          inquiry_type: "quote",
          project_details: "Need tiles for kitchen",
        }),
      );
    });
  });

  it("should show success message after submission", async () => {
    (leadService.leadService.createLead as jest.Mock).mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      inquiry_type: "quote",
      project_details: "Need tiles for kitchen",
      status: "new",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    });

    render(<QuoteForm />);

    const nameInput = screen.getByPlaceholderText("John Doe");
    const emailInput = screen.getByPlaceholderText("john@example.com");
    const projectInput = screen.getByPlaceholderText(
      "Describe your project, requirements, and any specific materials you're interested in...",
    );

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(projectInput, {
      target: { value: "Need tiles for kitchen" },
    });

    const submitButton = screen.getByText("Request Quote");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Thank you! We'll review your request and send you a quote soon.",
        ),
      ).toBeInTheDocument();
    });
  });
});
