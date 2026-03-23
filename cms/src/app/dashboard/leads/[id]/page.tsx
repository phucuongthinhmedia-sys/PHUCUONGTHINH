"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { leadService, Lead } from "@/lib/lead-service";

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [projectDetails, setProjectDetails] = useState("");

  useEffect(() => {
    loadLead();
  }, [leadId]);

  const loadLead = async () => {
    try {
      const data = await leadService.getLeadById(leadId);
      setLead(data);
      setProjectDetails(data.project_details || "");
    } catch (err: any) {
      setError("Không thể tải thông tin khách hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return;

    setIsUpdating(true);
    setError("");

    try {
      const updated = await leadService.updateLeadStatus(
        leadId,
        newStatus as "new" | "contacted" | "converted",
      );
      setLead(updated);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Không thể cập nhật trạng thái",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProjectDetails = async () => {
    if (!lead) return;

    setIsUpdating(true);
    setError("");

    try {
      const updated = await leadService.updateLead(leadId, {
        project_details: projectDetails,
      });
      setLead(updated);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          "Không thể cập nhật chi tiết dự án",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!lead) {
    return (
      <div className="text-center py-8 text-red-600">
        Không tìm thấy khách hàng
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    converted: "bg-green-100 text-green-800",
  };

  const inquiryTypeLabels: Record<string, string> = {
    appointment: "Đặt lịch hẹn",
    quote: "Yêu cầu báo giá",
  };

  const statusLabels: Record<string, string> = {
    new: "Mới",
    contacted: "Đã liên hệ",
    converted: "Đã chuyển đổi",
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/leads"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Quay lại Khách hàng
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">{lead.name}</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thông tin khách hàng
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loại yêu cầu
                </label>
                <p className="mt-1 text-gray-900">
                  {inquiryTypeLabels[lead.inquiry_type]}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-gray-900">{lead.email || "Không có"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <p className="mt-1 text-gray-900">{lead.phone || "Không có"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày ưu tiên
                </label>
                <p className="mt-1 text-gray-900">
                  {lead.preferred_date
                    ? new Date(lead.preferred_date).toLocaleDateString()
                    : "Chưa xác định"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày tạo
                </label>
                <p className="mt-1 text-gray-900">
                  {new Date(lead.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Chi tiết dự án
            </h2>

            <textarea
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Thêm hoặc chỉnh sửa chi tiết dự án..."
            />

            <button
              onClick={handleUpdateProjectDetails}
              disabled={isUpdating}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdating ? "Đang lưu..." : "Lưu chi tiết"}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Trạng thái</h2>

            <div className="space-y-2">
              {["new", "contacted", "converted"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                  className={`w-full px-4 py-2 rounded text-sm font-medium transition ${
                    lead.status === status
                      ? `${statusColors[status]} border-2 border-current`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50`}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Phân tích</h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <p className="text-lg font-semibold text-gray-900">
                  {statusLabels[lead.status] ?? lead.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Số ngày kể từ khi tạo</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.floor(
                    (Date.now() - new Date(lead.created_at).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                <p className="text-sm text-gray-900">
                  {new Date(lead.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
