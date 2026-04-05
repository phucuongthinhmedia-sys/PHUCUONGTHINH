"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { leadService, Lead } from "@/lib/lead-service-admin";
import { ChevronRight, Search, Users } from "lucide-react";

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
  appointment: "Lịch hẹn",
  quote: "Báo giá",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [total, setTotal] = useState(0);
  const limit = 15;

  useEffect(() => {
    loadLeads();
  }, [page, statusFilter]);

  const loadLeads = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await leadService.getLeads(
        page,
        limit,
        statusFilter || undefined,
      );
      setLeads(res.leads || []);
      setTotal(res.pagination?.total || 0);
    } catch (err: any) {
      setError(
        err.message ||
          err.response?.data?.error?.message ||
          "Không thể tải leads",
      );
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      // Optimistic Update
      setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
      await leadService.updateLeadStatus(
        id,
        status as "new" | "contacted" | "converted",
      );
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Không thể cập nhật");
      loadLeads(); // revert
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 md:p-8 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-6">
          <h1 className="text-[34px] font-bold text-black tracking-tight">
            Khách hàng
          </h1>
          <p className="text-[15px] text-[#8E8E93] font-medium mt-1">
            Tổng cộng {total} yêu cầu
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#FF3B30]/10 text-[#FF3B30] rounded-[16px] text-[15px] font-medium">
            {error}
          </div>
        )}

        {/* Apple Segmented Control for Filters */}
        <div className="bg-[#E5E5EA]/60 p-1 rounded-[12px] inline-flex w-full md:w-auto mb-6">
          {[
            { id: "", label: "Tất cả" },
            { id: "new", label: "Mới" },
            { id: "contacted", label: "Đang xử lý" },
            { id: "converted", label: "Hoàn thành" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`flex-1 md:flex-none px-6 py-2 text-[15px] font-medium rounded-[10px] transition-all ${
                statusFilter === tab.id
                  ? "bg-white text-black shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
                  : "text-[#8E8E93] hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table / List */}
        <div className="bg-white rounded-[24px] shadow-[0_1px_5px_rgba(0,0,0,0.02)] border border-[#E5E5EA] overflow-hidden">
          {isLoading ? (
            <div className="p-10 flex justify-center">
              <div className="w-8 h-8 border-4 border-[#007AFF]/20 border-t-[#007AFF] rounded-full animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center">
              <Users
                size={40}
                className="mx-auto mb-3 text-[#E5E5EA]"
                strokeWidth={1.5}
              />
              <p className="text-[17px] font-medium text-black">
                Không có khách hàng nào
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#E5E5EA] bg-[#F9F9F9]">
                    <th className="px-5 py-3 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                      Yêu cầu
                    </th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-5 py-3 text-right text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                      Chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5EA]">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#F2F2F7]/50 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <p className="text-[16px] font-semibold text-black">
                          {lead.name}
                        </p>
                        <p className="text-[13px] text-[#8E8E93] mt-0.5">
                          {new Date(lead.created_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-[15px] text-black">
                          {lead.phone || "—"}
                        </div>
                        <div className="text-[14px] text-[#007AFF] mt-0.5">
                          {lead.email || "—"}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[14px] font-medium bg-[#F2F2F7] px-2.5 py-1 rounded-[8px] text-[#8E8E93]">
                          {INQUIRY_LABELS[lead.inquiry_type] ||
                            lead.inquiry_type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value)
                          }
                          className={`appearance-none px-3 py-1.5 rounded-[10px] text-[14px] font-semibold border-0 outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-black/5 
                            ${STATUS_CONFIG[lead.status]?.bg || "bg-gray-100"} ${STATUS_CONFIG[lead.status]?.color || "text-gray-800"}`}
                        >
                          <option value="new">Mới</option>
                          <option value="contacted">Đang xử lý</option>
                          <option value="converted">Hoàn thành</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/20 px-3 py-1.5 rounded-[10px] transition-colors"
                        >
                          Xem <ChevronRight size={14} strokeWidth={2.5} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Apple Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[14px] text-[#8E8E93] font-medium">
              {(page - 1) * limit + 1} – {Math.min(page * limit, total)} /{" "}
              {total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white rounded-[10px] text-[14px] font-semibold text-black disabled:opacity-40 shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-95"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white rounded-[10px] text-[14px] font-semibold text-black disabled:opacity-40 shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-95"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
