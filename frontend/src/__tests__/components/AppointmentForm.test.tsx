import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppointmentForm } from "@/components/AppointmentForm";
import * as leadService from "@/lib/lead-service";

jest.mock("@/lib/lead-service");

describe("AppointmentForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form fields", () => {
    render(<AppointmentForm />);

    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("john@example.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("+1 (555) 000-0000"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toBeInTheDocument(); // date input
  });

  it("should show error when name is empty", async () => {
    render(<AppointmentForm />);

    const submitButton = screen.getByText("Book Appointment");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("should show error when neither email nor phone is provided", async () => {
    render(<AppointmentForm />);

    const nameInput = screen.getByPlaceholderText("John Doe");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    const submitButton = screen.getByText("Book Appointment");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Email or phone number is required"),
      ).toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    (leadService.leadService.createLead as jest.Mock).mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "",
      inquiry_type: "appointment",
      status: "new",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    });

    render(<AppointmentForm />);

    const nameInput = screen.getByPlaceholderText("John Doe");
    const emailInput = screen.getByPlaceholderText("john@example.com");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    const submitButton = screen.getByText("Book Appointment");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(leadService.leadService.createLead).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          inquiry_type: "appointment",
        }),
      );
    });
  });

  it("should show success message after submission", async () => {
    (leadService.leadService.createLead as jest.Mock).mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      inquiry_type: "appointment",
      status: "new",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    });

    render(<AppointmentForm />);

    const nameInput = screen.getByPlaceholderText("John Doe");
    const emailInput = screen.getByPlaceholderText("john@example.com");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    const submitButton = screen.getByText("Book Appointment");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Thank you! We'll contact you soon to confirm your appointment.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("should clear form after successful submission", async () => {
    (leadService.leadService.createLead as jest.Mock).mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      inquiry_type: "appointment",
      status: "new",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    });

    render(<AppointmentForm />);

    const nameInput = screen.getByPlaceholderText(
      "John Doe",
    ) as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText(
      "john@example.com",
    ) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    const submitButton = screen.getByText("Book Appointment");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
    });
  });
});
