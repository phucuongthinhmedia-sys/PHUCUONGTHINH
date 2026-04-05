"use client";

import { useEffect, useState, useMemo } from "react";
import {
  documentService,
  Document,
  DocumentCategory,
} from "@/lib/document-service";
import DocumentUploadModal from "@/components/admin/document-upload-modal";
import DocumentPreviewModal from "@/components/admin/document-preview-modal";
import {
  FileText,
  Search,
  Trash2,
  Eye,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Image as ImageIcon,
  FileOutput,
  FileSpreadsheet,
  FolderOpen,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // UI State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docs, cats] = await Promise.all([
        documentService.getDocuments(),
        documentService.getCategories(),
      ]);
      setDocuments(docs);
      setCategories(cats);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchCategory =
        !selectedCategory || doc.category_id === selectedCategory;
      const matchSearch =
        !searchQuery ||
        doc.original_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  const handleDelete = async (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa chứng từ này vĩnh viễn?")) return;
    setDeleting(docId);
    try {
      await documentService.deleteDocument(docId);
      setDocuments(documents.filter((d) => d.id !== docId));
    } catch (error) {
      alert("Xóa thất bại. Vui lòng thử lại.");
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (mimeType?: string, className: string = "w-8 h-8") => {
    if (!mimeType)
      return (
        <FileText className={`${className} text-[#007AFF]`} strokeWidth={1.5} />
      );
    if (mimeType.includes("pdf"))
      return (
        <FileOutput
          className={`${className} text-[#FF3B30]`}
          strokeWidth={1.5}
        />
      );
    if (mimeType.includes("sheet") || mimeType.includes("excel"))
      return (
        <FileSpreadsheet
          className={`${className} text-[#34C759]`}
          strokeWidth={1.5}
        />
      );
    if (mimeType.includes("image"))
      return (
        <ImageIcon
          className={`${className} text-[#AF52DE]`}
          strokeWidth={1.5}
        />
      );
    return (
      <FileText className={`${className} text-[#007AFF]`} strokeWidth={1.5} />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#007AFF]/20 border-t-[#007AFF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 md:p-8 font-sans pb-24">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-[34px] font-bold text-black tracking-tight leading-none">
              Tài liệu
            </h1>
            <p className="text-[15px] font-medium text-[#8E8E93] mt-2">
              {documents.length} mục trong {categories.length} thư mục
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#007AFF] text-white rounded-[14px] font-semibold text-[15px] active:scale-95 transition-transform shadow-[0_2px_10px_rgba(0,122,255,0.3)]"
          >
            <Plus size={18} strokeWidth={2} /> Tải lên
          </button>
        </div>

        {/* Toolbar: Search, Filter & View Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto flex-1 max-w-[600px]">
            {/* Apple Search */}
            <div className="relative w-full">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8E8E93]"
                strokeWidth={2}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#E5E5EA]/60 border-2 border-transparent rounded-[12px] text-[17px] focus:outline-none focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all text-black placeholder:text-[#8E8E93]"
              />
            </div>
            {/* Apple Filter Dropdown */}
            <div className="relative w-full md:w-[220px] shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#E5E5EA]/60 border-2 border-transparent rounded-[12px] text-[15px] font-medium appearance-none focus:outline-none focus:bg-white focus:border-[#007AFF] transition-all text-black cursor-pointer"
              >
                <option value="">Tất cả thư mục</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#8E8E93] rotate-90 pointer-events-none" />
            </div>
          </div>

          {/* Apple Segmented Control for View Mode */}
          <div className="bg-[#E5E5EA]/60 p-1 rounded-[10px] flex items-center shrink-0 w-full md:w-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-[8px] flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-white text-black shadow-[0_1px_4px_rgba(0,0,0,0.1)]" : "text-[#8E8E93]"}`}
            >
              <LayoutGrid size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-[8px] flex items-center justify-center transition-all ${viewMode === "list" ? "bg-white text-black shadow-[0_1px_4px_rgba(0,0,0,0.1)]" : "text-[#8E8E93]"}`}
            >
              <ListIcon size={18} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredDocuments.length === 0 ? (
          <div className="py-20 text-center">
            <FolderOpen
              size={48}
              className="mx-auto mb-3 text-[#C7C7CC]"
              strokeWidth={1.5}
            />
            <p className="text-[17px] font-medium text-black">Thư mục trống</p>
            <p className="text-[15px] text-[#8E8E93] mt-1">
              Chưa có tài liệu nào ở đây.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW (Kiểu ứng dụng Files) */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setPreviewDocument(doc);
                  setIsPreviewOpen(true);
                }}
                className="group relative bg-white rounded-[20px] p-4 shadow-[0_1px_5px_rgba(0,0,0,0.02)] active:scale-[0.96] transition-transform cursor-pointer border border-[#E5E5EA] flex flex-col h-[160px]"
              >
                <div className="flex justify-between items-start mb-auto">
                  <div className="w-12 h-12 rounded-[12px] bg-[#F2F2F7] flex items-center justify-center">
                    {getFileIcon(doc.mime_type, "w-6 h-6")}
                  </div>
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="p-1.5 text-[#C7C7CC] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
                <div className="mt-3">
                  <p className="font-medium text-[15px] text-black line-clamp-2 leading-tight mb-1">
                    {doc.original_name}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] text-[#8E8E93] font-medium">
                    <span className="truncate max-w-[80px]">
                      {doc.category.name}
                    </span>
                    <span>•</span>
                    <span>{formatFileSize(doc.file_size)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW (Kiểu Inset Grouped) */
          <div className="bg-white rounded-[24px] shadow-[0_1px_5px_rgba(0,0,0,0.02)] border border-[#E5E5EA] overflow-hidden">
            <div className="flex flex-col">
              {filteredDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setPreviewDocument(doc);
                    setIsPreviewOpen(true);
                  }}
                  className="flex items-center gap-4 p-3 pl-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-[10px] bg-[#F2F2F7] flex items-center justify-center shrink-0">
                    {getFileIcon(doc.mime_type, "w-5 h-5")}
                  </div>

                  <div
                    className={`flex-1 flex items-center justify-between py-2 ${index !== filteredDocuments.length - 1 ? "border-b border-[#E5E5EA] -mb-5 pb-5" : ""}`}
                  >
                    <div className="pr-4">
                      <p className="text-[17px] font-medium text-black line-clamp-1">
                        {doc.original_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[14px] text-[#8E8E93]">
                        <span>{doc.category.name}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>
                          {new Date(doc.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewDocument(doc);
                          setIsPreviewOpen(true);
                        }}
                        className="p-2 text-[#007AFF] bg-[#007AFF]/10 rounded-full hover:bg-[#007AFF]/20 transition-colors"
                      >
                        <Eye size={16} strokeWidth={2} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(doc.id, e)}
                        className="p-2 text-[#FF3B30] bg-[#FF3B30]/10 rounded-full hover:bg-[#FF3B30]/20 transition-colors"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        <DocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={async () => {
            setSelectedCategory("");
            await new Promise((resolve) => setTimeout(resolve, 500));
            await loadData();
          }}
          categories={categories}
        />
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          document={previewDocument}
          onClose={() => setIsPreviewOpen(false)}
        />
      </div>
    </div>
  );
}
