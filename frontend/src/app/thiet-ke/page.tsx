"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Download,
  Aperture,
  Box,
  ArrowRight,
  Layers,
  Wand2,
  Maximize,
} from "lucide-react";

// ─── Dữ liệu Lookbook ────────────────────────────────────────────────────────
const LOOKBOOKS = [
  {
    id: "modern-luxury",
    name: "Modern Luxury",
    desc: "Sự xa hoa tĩnh lặng từ những phiến đá Marble khổ lớn, kết hợp kim loại mạ PVD và ánh sáng gián tiếp.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    tags: ["Big Slab Marble", "Nẹp Inox Vàng", "Đá Xuyên Sáng"],
  },
  {
    id: "wabi-sabi",
    name: "Wabi Sabi & Zen",
    desc: "Tôn vinh vẻ đẹp nguyên bản với gạch hiệu ứng xi măng, gạch vân gỗ và các gam màu trung tính tự nhiên.",
    image:
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1200&q=80",
    tags: ["Gạch Xi Măng", "Gạch Giả Gỗ", "Màu Be/Xám"],
  },
  {
    id: "indochine",
    name: "Indochine Heritage",
    desc: "Bản giao hưởng giữa nét hoài cổ Á Đông và sự lãng mạn nước Pháp qua gạch bông nghệ thuật và gạch thẻ.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    tags: ["Gạch Bông Chống Trượt", "Gạch Thẻ", "Gốm Sứ"],
  },
  {
    id: "minimalist",
    name: "Minimalist",
    desc: "Không gian tinh gọn, tối giản chi tiết thừa với những mảng tường gạch khổ lớn không ron liền mạch.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    tags: ["Big Slab Monochrome", "Thiết Bị Âm Tường"],
  },
];

// ─── Dữ liệu Ứng dụng Không gian ──────────────────────────────────────────────
const APPLICATIONS = [
  {
    title: "Mặt Tiền & Ngoại Thất",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Đại Sảnh & Phòng Khách",
    img: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Đảo Bếp & Mặt Bàn",
    img: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Phòng Tắm Master Spa",
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    span: "md:col-span-2 md:row-span-1",
  },
];

// ─── 1. Hero Section (Vibe Tạp chí Kiến trúc) ────────────────────────────────
function DesignHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#0a192f]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
          alt="Kiến trúc không gian"
          fill
          className="object-cover opacity-50 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/80 via-[#0a192f]/40 to-[#0a192f]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <Aperture
            size={48}
            className="text-emerald-400 mb-6 animate-[spin_10s_linear_infinite]"
          />
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
            Nơi Cảm Hứng <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white italic font-serif font-light">
              Hóa Hiện Thực
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-light">
            Khám phá ranh giới mới của nghệ thuật sắp đặt không gian. Từ những
            phiến Big Slab hùng vĩ đến thiết bị vệ sinh tinh xảo — Phúc Cường
            Thịnh mang đến chất liệu để bạn kiến tạo di sản.
          </p>
          <div className="w-px h-24 bg-gradient-to-b from-emerald-400 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── 2. Style Lookbook (Dành cho Chủ nhà & Chủ đầu tư) ──────────────────────
function LookbookSection() {
  const [activeTab, setActiveTab] = useState(LOOKBOOKS[0].id);
  const activeData = LOOKBOOKS.find((l) => l.id === activeTab)!;

  return (
    <section className="py-24 px-4 bg-[#0a192f]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 block">
              <Sparkles size={16} className="inline mr-2" />
              Xu Hướng 2026
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Moodboard Không Gian
            </h2>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0 overflow-x-auto no-scrollbar w-full md:w-auto">
            {LOOKBOOKS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gray-900 aspect-square md:aspect-[21/9]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeData.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={activeData.image}
                alt={activeData.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl">
                <h3 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif italic">
                  {activeData.name}
                </h3>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {activeData.desc}
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {activeData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                >
                  Xem vật liệu cho phong cách này <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Tính Ứng Dụng (Mặt tiền, Cảnh quan, Nội thất) ───────────────────────
function ApplicationSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vượt Ra Khỏi Không Gian Phẳng
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Gạch khổ lớn (Big Slab) không chỉ dành cho nền nhà. Độ mỏng ưu việt
            và kích thước khổng lồ giúp nó bọc trọn mọi thiết kế kiến trúc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4 md:gap-6">
          {APPLICATIONS.map((app, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${app.span}`}
            >
              <Image
                src={app.img}
                alt={app.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Maximize size={18} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {app.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Khu vực độc quyền cho KTS (Thư viện Số) - B2B Hook ──────────────────
function DigitalLibrarySection() {
  return (
    <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0a192f] rounded-[3rem] p-8 md:p-16 overflow-hidden relative shadow-2xl">
          {/* Abstract geometric background */}
          <div className="absolute -top-24 -right-24 w-96 h-96 border-[40px] border-emerald-500/10 rounded-full" />
          <div className="absolute bottom-10 -left-10 w-48 h-48 border-[20px] border-blue-500/10 rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-6">
                <Box size={16} /> Dành Riêng Cho Kiến Trúc Sư
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Thư Viện Vật Liệu Số <br /> (Digital Material)
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Render 3D không còn là trở ngại. Phúc Cường Thịnh cung cấp kho
                dữ liệu khổng lồ bao gồm:{" "}
                <strong className="text-white">
                  Texture Map Seamless (8K), Mô hình 3D (SketchUp, 3ds Max)
                </strong>{" "}
                cho toàn bộ mã gạch và thiết bị vệ sinh.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Texture Map độ phân giải cao (Base color, Normal, Roughness)",
                  "Hơn 1,000+ File 3D Thiết bị vệ sinh chuẩn tỷ lệ",
                  "Cập nhật tự động mã gạch mới nhất 2026",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Download size={20} />
                Tải Bộ Thư Viện (Google Drive)
              </button>
            </div>

            <div className="relative">
              {/* Mockup Thư viện 3D */}
              <div className="aspect-square relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
                  alt="3D Render Room"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <p className="text-emerald-400 text-xs font-bold mb-1">
                    FILE: PCT_MARBLE_CALACATTA_8K.ZIP
                  </p>
                  <p className="text-white text-sm">
                    Sẵn sàng để đưa vào V-Ray / Corona
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. CTA - Biến Ý Tưởng Thành Hiện Thực ──────────────────────────────────
function DesignCTA() {
  return (
    <section className="py-24 px-4 bg-white text-center">
      <div className="max-w-4xl mx-auto">
        <Wand2 size={48} className="mx-auto mb-6 text-emerald-600" />
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
          Đã Tìm Thấy Nguồn Cảm Hứng?
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Đừng để ý tưởng chỉ nằm trên bản vẽ. Hãy để các chuyên gia vật liệu
          của chúng tôi giúp bạn chọn đúng loại gạch, chuẩn thiết bị với ngân
          sách tối ưu nhất.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/contact?type=appointment"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold px-8 py-5 rounded-xl hover:bg-emerald-700 transition-transform hover:-translate-y-1 shadow-xl"
          >
            <Layers size={22} />
            Đăng Ký Trải Nghiệm Showroom
          </Link>
          <button className="inline-flex items-center justify-center gap-2 bg-gray-100 border-2 border-transparent text-gray-900 font-bold px-8 py-5 rounded-xl hover:bg-gray-200 transition-transform hover:-translate-y-1">
            Yêu Cầu Gửi Mẫu (Sample) Tận Nơi
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-6">
          * Cung cấp Box Sample thực tế hoàn toàn miễn phí cho văn phòng KTS và
          Chủ đầu tư.
        </p>
      </div>
    </section>
  );
}

// ─── Lắp ráp Trang ──────────────────────────────────────────────────────────
export default function DesignInspirationPage() {
  return (
    <main className="min-h-screen bg-white">
      <DesignHero />
      <LookbookSection />
      <ApplicationSection />
      <DigitalLibrarySection />
      <DesignCTA />
    </main>
  );
}
