"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AppointmentForm } from "@/components/AppointmentForm";
import { QuoteForm } from "@/components/QuoteForm";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";

function ContactContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const formType = searchParams.get("type") || "quote";

  const [activeTab, setActiveTab] = useState<"quote" | "appointment">(
    formType === "appointment" ? "appointment" : "quote",
  );

  return (
    <main className="min-h-screen bg-[#F8F9FA] selection:bg-emerald-200 selection:text-gray-900 pb-20">
      {/* ── HERO SECTION: Tinh tế & Kiến trúc ── */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 pb-10">
            <div className="max-w-3xl">
              <span className="text-emerald-600 font-bold tracking-[0.2em] uppercase text-xs mb-4 block flex items-center gap-2">
                <span className="w-8 h-[2px] bg-emerald-600 inline-block"></span>
                Kết nối với chúng tôi
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-[#0a192f] tracking-tight leading-[1.1]">
                Sẵn Sàng Cùng Bạn <br />
                <span className="text-gray-400 font-light">
                  Kiến Tạo Di Sản.
                </span>
              </h1>
            </div>
            <div className="max-w-sm">
              <p className="text-gray-600 text-base leading-relaxed">
                Dù bạn là Kiến trúc sư, Nhà thầu hay Chủ đầu tư, Phú Cường Thịnh
                luôn có giải pháp vật liệu tối ưu nhất cho không gian của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT: Bố cục Grid hiện đại ── */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── CỘT TRÁI: THÔNG TIN (5 Cột) ── */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Ảnh Showroom tạo cảm giác thực tế */}
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Showroom Phúc Cường Thịnh"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 to-transparent flex items-end p-8">
                <div>
                  <p className="text-emerald-400 text-sm font-bold tracking-wider mb-1">
                    TRỤ SỞ & SHOWROOM
                  </p>
                  <p className="text-white font-medium">
                    Trải nghiệm trực tiếp hàng ngàn mẫu gạch Big Slab & Thiết bị
                    vệ sinh.
                  </p>
                </div>
              </div>
            </div>

            {/* Các khối thông tin liên hệ */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
              {/* Địa chỉ */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#0a192f]" />
                </div>
                <div>
                  <h3 className="text-[#0a192f] font-bold text-lg mb-2">
                    Hệ thống của chúng tôi
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Showroom Trung Tâm:
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        123 Đường Lê Lợi, P. Phú Cường, TP. Thủ Dầu Một, Bình
                        Dương
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Tổng Kho B2B (10.000m²):
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Khu Công Nghiệp Sóng Thần 2, Dĩ An, Bình Dương
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100"></div>

              {/* Liên lạc */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-[#0a192f]" />
                </div>
                <div>
                  <h3 className="text-[#0a192f] font-bold text-lg mb-2">
                    Thông tin liên lạc
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="tel:0901234567"
                      className="group flex items-center gap-2 text-2xl font-black text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      0901 234 567
                      <ArrowUpRight
                        size={20}
                        className="text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </a>
                    <a
                      href="mailto:info@phucuongthinh.vn"
                      className="block text-gray-500 hover:text-[#0a192f] transition-colors text-sm font-medium"
                    >
                      info@phucuongthinh.vn
                    </a>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100"></div>

              {/* Giờ làm việc */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-[#0a192f]" />
                </div>
                <div className="w-full">
                  <h3 className="text-[#0a192f] font-bold text-lg mb-2">
                    Giờ mở cửa
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Thứ 2 - Thứ 7</span>
                      <span className="font-semibold text-gray-900">
                        07:30 - 17:30
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Chủ Nhật</span>
                      <span className="font-semibold text-gray-900">
                        08:00 - 12:00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CỘT PHẢI: FORM TƯƠNG TÁC (7 Cột) ── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-full flex flex-col">
              {/* Pill Tabs hiện đại */}
              <div className="relative flex bg-gray-50 p-1.5 rounded-2xl mb-10 w-full sm:w-max mx-auto sm:mx-0">
                <button
                  onClick={() => setActiveTab("quote")}
                  className={`relative z-10 flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-colors w-1/2 sm:w-auto justify-center ${
                    activeTab === "quote"
                      ? "text-white"
                      : "text-gray-500 hover:text-[#0a192f]"
                  }`}
                >
                  <MessageSquare size={16} /> Nhận Báo Giá
                </button>
                <button
                  onClick={() => setActiveTab("appointment")}
                  className={`relative z-10 flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-colors w-1/2 sm:w-auto justify-center ${
                    activeTab === "appointment"
                      ? "text-white"
                      : "text-gray-500 hover:text-[#0a192f]"
                  }`}
                >
                  <MapPin size={16} /> Xem Mẫu Showroom
                </button>

                {/* Background animation cho Tab */}
                <div
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] sm:w-[160px] bg-[#0a192f] rounded-xl transition-all duration-300 ease-out shadow-sm ${
                    activeTab === "appointment"
                      ? "left-[calc(50%+3px)] sm:left-[168px]"
                      : "left-1.5"
                  }`}
                />
              </div>

              {/* Form Render */}
              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  {activeTab === "quote" ? (
                    <motion.div
                      key="quote"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <h2 className="text-2xl font-bold text-[#0a192f] mb-2">
                        Đăng ký nhận báo giá (BOQ)
                      </h2>
                      <p className="text-gray-500 mb-8 text-sm md:text-base">
                        Gửi thông tin dự án hoặc mã sản phẩm, đội ngũ Kỹ sư của
                        chúng tôi sẽ bóc tách và gửi lại báo giá với chiết khấu
                        tốt nhất trong 30 phút.
                      </p>
                      <QuoteForm productId={productId || undefined} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="appointment"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <h2 className="text-2xl font-bold text-[#0a192f] mb-2">
                        Đặt lịch hẹn tham quan
                      </h2>
                      <p className="text-gray-500 mb-8 text-sm md:text-base">
                        Chuyên viên của chúng tôi sẽ chuẩn bị sẵn các mẫu vật
                        liệu (Sample) theo đúng yêu cầu và phong cách dự án của
                        bạn trước khi bạn đến.
                      </p>
                      <AppointmentForm productId={productId || undefined} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
