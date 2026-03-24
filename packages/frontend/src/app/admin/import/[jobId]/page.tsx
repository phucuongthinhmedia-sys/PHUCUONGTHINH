"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { importService } from "@/lib/import-service";

export default function AdminImportJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const { data: job, isLoading } = useQuery({
    queryKey: ["import-job", jobId],
    queryFn: () => importService.getJob(jobId),
    refetchInterval: (data: any) => {
      if (data?.status === "completed" || data?.status === "failed")
        return false;
      return 2000;
    },
  });

  useEffect(() => {
    if (job?.status === "completed") {
      router.push(`/admin/import/${jobId}/preview`);
    }
  }, [job?.status, jobId, router]);

  if (isLoading || !job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const STATUS_TEXT: Record<string, string> = {
    pending: "Đang chờ xử lý...",
    processing: "Đang xử lý...",
    completed: "Hoàn thành!",
    failed: "Thất bại",
  };

  const STATUS_COLOR: Record<string, string> = {
    pending: "text-gray-600",
    processing: "text-blue-600",
    completed: "text-green-600",
    failed: "text-red-600",
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đang xử lý Catalogue
          </h1>
          <p className="text-gray-600">{job.file_name}</p>
        </div>

        <div className="text-center mb-8">
          <p
            className={`text-lg font-semibold ${STATUS_COLOR[job.status] || "text-gray-600"}`}
          >
            {STATUS_TEXT[job.status] || job.status}
          </p>
        </div>

        {job.status === "processing" && (
          <>
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Trang {job.current_page} / {job.total_pages}
                </span>
                <span>{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>
            <div className="flex justify-center mb-8">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        )}

        {job.status === "failed" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
            <p className="font-medium mb-2">Xử lý thất bại</p>
            <p className="text-sm">
              Vui lòng thử lại hoặc liên hệ quản trị viên.
            </p>
          </div>
        )}

        {job.failed_pages?.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 mb-6">
            <p className="font-medium mb-1">Một số trang không thể xử lý</p>
            <p className="text-sm">Trang: {job.failed_pages.join(", ")}</p>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>Quá trình này có thể mất vài phút</p>
        </div>

        {job.status === "failed" && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/admin/import")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
