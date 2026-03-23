"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { importService } from "@/lib/import-service";

export default function JobStatusPage({
  params,
}: {
  params: { jobId: string };
}) {
  const router = useRouter();

  const { data: job, isLoading } = useQuery({
    queryKey: ["import-job", params.jobId],
    queryFn: () => importService.getJob(params.jobId),
    refetchInterval: (data) => {
      // Stop polling when completed or failed
      if (data?.status === "completed" || data?.status === "failed") {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });

  // Redirect to preview when completed
  useEffect(() => {
    if (job?.status === "completed") {
      router.push(`/dashboard/import/${params.jobId}/preview`);
    }
  }, [job?.status, params.jobId, router]);

  if (isLoading || !job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (job.status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "processing":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = () => {
    switch (job.status) {
      case "pending":
        return "Đang chờ xử lý...";
      case "processing":
        return "Đang xử lý...";
      case "completed":
        return "Hoàn thành!";
      case "failed":
        return "Thất bại";
      default:
        return job.status;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đang xử lý Catalogue
          </h1>
          <p className="text-gray-600">{job.file_name}</p>
        </div>

        {/* Status */}
        <div className="text-center mb-8">
          <p className={`text-lg font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>

        {/* Progress bar */}
        {job.status === "processing" && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Trang {job.current_page} / {job.total_pages}
              </span>
              <span>{job.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Spinner for processing */}
        {job.status === "processing" && (
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Failed status */}
        {job.status === "failed" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
            <p className="font-medium mb-2">Xử lý thất bại</p>
            <p className="text-sm">
              Vui lòng thử lại hoặc liên hệ quản trị viên nếu vấn đề vẫn tiếp
              diễn.
            </p>
          </div>
        )}

        {/* Failed pages info */}
        {job.failed_pages && job.failed_pages.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 mb-6">
            <p className="font-medium mb-1">Một số trang không thể xử lý</p>
            <p className="text-sm">Trang: {job.failed_pages.join(", ")}</p>
          </div>
        )}

        {/* Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Quá trình này có thể mất vài phút</p>
          <p>Bạn có thể đóng trang này, hệ thống sẽ tiếp tục xử lý</p>
        </div>

        {/* Retry button for failed jobs */}
        {job.status === "failed" && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/dashboard/import")}
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
