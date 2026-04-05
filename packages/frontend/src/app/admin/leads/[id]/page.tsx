"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { leadService, Lead } from "@/lib/lead-service-admin";
import {
  ChevronLeft,
  Phone,
  Mail,
  Clock,
  Calendar,
  CheckCircle2,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  new: { label: "Mới", color: "text-[#007AFF]", bg: "bg-[#007AFF]/10" },
  contacted: {
    label: "Đang xử lý",
    color: "text-[#FF9500]",
    bg: "bg-[#FF9500]/10",
  },
  converted: {
    label: "Hoàn thành",
    color: "text-[#34C759]",
    bg: "bg-[#34C759]/10",
  },
};

const INQUIRY_LABELS: Record<string, string> = {
  appointment: "Đặt lịch hẹn",
  quote: "Yêu cầu báo giá",
};

export default function AdminLeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [projectDetails, setProjectDetails] = useState("");

  useEffect(() => {
    leadService
      .getLeadById(leadId)
      .then((data) => {
        setLead(data);
        setProjectDetails(data.project_details || "");
      })
      .catch(() => setError("Không thể tải thông tin"))
      .finally(() => setIsLoading(false));
  }, [leadId]);

  const handleStatusChange = async (status: string) => {
    if (!lead) return;
    setIsUpdating(true);
    try {
      const updated = await leadService.updateLeadStatus(leadId, status as any);
      setLead(updated);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Lỗi cập nhật");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!lead) return;
    setIsUpdating(true);
    try {
      const updated = await leadService.updateLead(leadId, {
        project_details: projectDetails,
      });
      setLead(updated);
    } catch (err: any) {
      setError("Không thể lưu chi tiết");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#007AFF]/20 border-t-[#007AFF] rounded-full animate-spin" />
      </div>
    );
  if (!lead)
    return (
      <div className="p-8 text-center text-[#FF3B30]">
        {error || "Không tìm thấy khách hàng"}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 md:p-8 font-sans pb-24">
      <div className="max-w-[1000px] mx-auto">
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link
            href="/admin/leads"
            className="inline-flex items-center text-[17px] font-medium text-[#007AFF] hover:opacity-80 transition-opacity mb-2 -ml-2"
          >
            <ChevronLeft size={24} /> Khách hàng
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
            <div>
              <h1 className="text-[34px] font-bold text-black tracking-tight leading-none">
                {lead.name}
              </h1>
              <span
                className={`inline-block mt-3 px-3 py-1 rounded-[8px] text-[14px] font-semibold ${STATUS_CONFIG[lead.status]?.bg} ${STATUS_CONFIG[lead.status]?.color}`}
              >
                {STATUS_CONFIG[lead.status]?.label}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#FF3B30]/10 text-[#FF3B30] rounded-[16px] text-[15px] font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Apple Inset Grouped Info Box */}
            <div className="bg-white rounded-[24px] shadow-[0_1px_5px_rgba(0,0,0,0.02)] border border-[#E5E5EA] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E5EA] bg-[#F9F9F9]">
                <h2 className="text-[17px] font-semibold text-black tracking-tight">
                  Thông tin liên hệ
                </h2>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-4 p-4 border-b border-[#E5E5EA]">
                  <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#007AFF]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#8E8E93]">
                      Số điện thoại
                    </p>
                    <p className="text-[17px] text-black">
                      {lead.phone || "Không có"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border-b border-[#E5E5EA]">
                  <div className="w-10 h-10 rounded-full bg-[#AF52DE]/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#AF52DE]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#8E8E93]">
                      Email
                    </p>
                    <p className="text-[17px] text-[#007AFF]">
                      {lead.email || "Không có"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-full bg-[#FF9500]/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-[#FF9500]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#8E8E93]">
                      Loại yêu cầu
                    </p>
                    <p className="text-[17px] text-black font-medium">
                      {INQUIRY_LABELS[lead.inquiry_type]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note/Details Area (Textarea) */}
            <div className="bg-white rounded-[24px] shadow-[0_1px_5px_rgba(0,0,0,0.02)] border border-[#E5E5EA] p-5">
              <h2 className="text-[17px] font-semibold text-black mb-3">
                Chi tiết / Ghi chú dự án
              </h2>
              <textarea
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                rows={6}
                className="w-full bg-[#F2F2F7] border-2 border-transparent rounded-[16px] p-4 text-[17px] text-black outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all resize-none"
                placeholder="Thêm thông tin trao đổi, yêu cầu thiết kế..."
              />
              <button
                onClick={handleSaveDetails}
                disabled={isUpdating}
                className="mt-4 px-6 py-3 bg-[#007AFF] text-white rounded-[14px] font-semibold text-[15px] active:scale-[0.97] transition-transform disabled:opacity-50"
              >
                {isUpdating ? "Đang lưu..." : "Lưu chi tiết"}
              </button>
            </div>
          </div>

          {/* Right Sidebar - Status & Timeline */}
          <div className="space-y-6">
            {/* Status Switcher */}
            <div className="bg-white rounded-[24px] shadow-[0_1px_5px_rgba(0,0,0,0.02)] border border-[#E5E5EA] p-5">
              <h2 className="text-[17px] font-semibold text-black mb-4">
                Trạng thái xử lý
              </h2>
              <div className="flex flex-col gap-2">
                {["new", "contacted", "converted"].map((status) => {
                  const isActive = lead.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={isUpdating}
                      className={`relative px-4 py-3 rounded-[14px] text-[15px] font-semibold text-left transition-all overflow-hidden ${
                        isActive
                          ? `bg-white border-2 border-[${STATUS_CONFIG[status].color.replace("text-", "")}] shadow-sm`
                          : "bg-[#F2F2F7] border-2 border-transparent text-[#8E8E93] hover:text-black"
                      }`}
                      style={
                        isActive
                          ? {
                              borderColor: STATUS_CONFIG[status].color
                                .replace("text-[", "")
                                .replace("]", ""),
                            }
                          : {}
                      }
                    >
                      {isActive && (
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 ${STATUS_CONFIG[status].bg.replace("/10", "")}`}
                          style={{
                            backgroundColor: STATUS_CONFIG[status].color
                              .replace("text-[", "")
                              .replace("]", ""),
                          }}
                        />
                      )}
                      <span
                        className={isActive ? STATUS_CONFIG[status].color : ""}
                      >
                        {STATUS_CONFIG[status].label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[24px] shadow-[0_1px_5px_rgba(0,0,0,0.02)] border border-[#E5E5EA] p-5">
              <h2 className="text-[17px] font-semibold text-black mb-4">
                Thời gian
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar
                    size={20}
                    className="text-[#8E8E93] shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-[13px] font-medium text-[#8E8E93]">
                      Tạo ngày
                    </p>
                    <p className="text-[15px] text-black font-medium">
                      {new Date(lead.created_at).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-[13px] text-[#C7C7CC] mt-0.5">
                      (
                      {Math.floor(
                        (Date.now() - new Date(lead.created_at).getTime()) /
                          86400000,
                      )}{" "}
                      ngày trước)
                    </p>
                  </div>
                </div>
                <div className="w-[1px] h-4 bg-[#E5E5EA] ml-[9px] -my-2" />
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-[#8E8E93] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-medium text-[#8E8E93]">
                      Cập nhật cuối
                    </p>
                    <p className="text-[15px] text-black font-medium">
                      {new Date(lead.updated_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
