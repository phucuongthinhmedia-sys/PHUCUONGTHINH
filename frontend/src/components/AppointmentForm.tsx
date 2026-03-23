"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { leadService } from "@/lib/lead-service";

interface AppointmentFormProps {
  productId?: string;
  onSuccess?: () => void;
}

export function AppointmentForm({
  productId,
  onSuccess,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_date: "",
    project_code: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (!formData.name.trim()) throw new Error("Vui lòng nhập họ tên");
      if (!formData.email.trim() && !formData.phone.trim())
        throw new Error("Vui lòng nhập email hoặc số điện thoại");

      await leadService.createLead({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        inquiry_type: "appointment",
        preferred_date: formData.preferred_date || undefined,
        project_details: formData.project_code || undefined,
        product_ids: productId ? [productId] : undefined,
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferred_date: "",
        project_code: "",
      });
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gửi thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm để xác nhận lịch hẹn.
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Họ và tên *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nguyễn Văn A"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-yellow-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-yellow-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Số điện thoại
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="0901 234 567"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-yellow-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ngày hẹn mong muốn
        </label>
        <input
          type="date"
          name="preferred_date"
          value={formData.preferred_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-yellow-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mã dự án (tùy chọn)
        </label>
        <input
          type="text"
          name="project_code"
          value={formData.project_code}
          onChange={handleChange}
          placeholder="VD: DA-2024-001"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-yellow-100"
        />
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? "Đang gửi..." : "Đặt lịch hẹn"}
      </motion.button>
    </form>
  );
}
