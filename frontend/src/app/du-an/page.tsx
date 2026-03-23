"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Maximize,
  HardHat,
  Truck,
  Layers,
  CheckCircle2,
  Calculator,
} from "lucide-react";

// ─── Dữ liệu Dự án (Mock Data) ──────────────────────────────────────────────
const CATEGORIES = [
  "Tất cả",
  "Resort & Khách sạn",
  "Villa & Penthouse",
  "Thương mại & Dịch vụ",
];

const PROJECTS = [
  {
    id: 1,
    title: "The Emerald Bay Resort",
    category: "Resort & Khách sạn",
    location: "Phú Quốc, Kiên Giang",
    year: "2023",
    supplied:
      "Cấp 12.000m² Gạch Big Slab vân đá Marble, Hệ thống TBVS Inverter thông minh.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    span: "md:col-span-2 md:row-span-2", // Ảnh to nhất
  },
  {
    id: 2,
    title: "Eco Green Penthouse",
    category: "Villa & Penthouse",
    location: "Quận 2, TP.HCM",
    year: "2024",
    supplied: "Gạch vân gỗ ngoài trời, Gạch khổ lớn 1200x2400mm ốp vách tivi.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "Aura Premium Clinic",
    category: "Thương mại & Dịch vụ",
    location: "Quận 1, TP.HCM",
    year: "2023",
    supplied: "Giải pháp Gạch kháng khuẩn công nghệ cao, tiêu chuẩn y tế.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    title: "Zenith Ocean Villa",
    category: "Villa & Penthouse",
    location: "Cam Ranh, Khánh Hòa",
    year: "2024",
    supplied:
      "Cấp trọn gói vật liệu ốp lát hồ bơi (Mosaic) và TBVS mạ PVD cao cấp.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    span: "md:col-span-2 md:row-span-1", // Ảnh ngang dài
  },
  {
    id: 5,
    title: "Diamond Plaza Renovation",
    category: "Thương mại & Dịch vụ",
    location: "Quận 1, TP.HCM",
    year: "2022",
    supplied:
      "Gạch ốp mặt tiền chống bám bẩn, keo dán gạch chuyên dụng khổ lớn.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    span: "md:col-span-1 md:row-span-2", // Ảnh dọc cao
  },
  {
    id: 6,
    title: "Riverside Mansion",
    category: "Villa & Penthouse",
    location: "Thủ Đức, TP.HCM",
    year: "2023",
    supplied:
      "Mặt bàn bếp gia công CNC từ Slab tấm lớn, Gạch sân vườn chống trượt R11.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
];

// ─── 1. Hero Section ─────────────────────────────────────────────────────────
function ProjectsHero() {
  return (
    <section className="relative pt-32 pb-20 px-4 bg-[#0a192f] overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-emerald-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block py-1 px-3 rounded-full bg-white/10 text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-6 border border-white/10"
        >
          Dấu Ấn Kiến Trúc
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8 tracking-tight"
        >
          Hơn Cả Vật Liệu, Chúng Tôi <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            Cung Cấp Giải Pháp Không Gian
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          Hơn 500+ dự án lớn nhỏ trên toàn quốc đã tin chọn Phúc Cường Thịnh.
          Khám phá những công trình mang tính biểu tượng được kiến tạo từ Gạch
          Khổ Lớn và Vật liệu Kiến Trúc Xanh.
        </motion.p>

        {/* Thống kê nhanh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mt-16 pt-12 border-t border-white/10"
        >
          {[
            { label: "Dự Án Hoàn Thiện", value: "500+" },
            { label: "Triệu m² Đã Cấp", value: "2.5M" },
            { label: "Đối Tác KTS & Thầu", value: "300+" },
            { label: "Tỉnh Thành Phủ Sóng", value: "63" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-white mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── 2. Portfolio Showcase (Bento/Masonry Grid) ─────────────────────────────
function ProjectGallery() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filteredProjects = PROJECTS.filter(
    (p) => activeFilter === "Tất cả" || p.category === activeFilter,
  );

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Bộ lọc */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                activeFilter === cat
                  ? "bg-[#0a192f] text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lưới Dự Án Bất Đối Xứng */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-4 md:gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={project.id}
                className={`group relative rounded-2xl overflow-hidden bg-gray-100 cursor-pointer ${project.span}`}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Lớp phủ mặc định */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                {/* Thông tin hiển thị mặc định */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-500 group-hover:-translate-y-4">
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
                    {project.category}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-300 text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {project.location}
                    </span>
                    <span>• {project.year}</span>
                  </div>
                </div>

                {/* Nội dung Hover (Mảnh ghép ăn tiền B2B) */}
                <div className="absolute inset-0 bg-emerald-900/95 p-6 md:p-8 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <Layers className="text-emerald-400 mb-4" size={32} />
                    <h4 className="text-white text-lg font-bold mb-2">
                      Hạng mục cung ứng:
                    </h4>
                    <p className="text-emerald-50 text-base md:text-lg leading-relaxed mb-6">
                      {project.supplied}
                    </p>
                    <button className="inline-flex items-center gap-2 text-white font-semibold uppercase text-sm tracking-wider hover:text-emerald-300 transition-colors">
                      Xem chi tiết <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 3. Logistics & Supply Power (Năng lực cung ứng B2B) ────────────────────
function SupplyPowerSection() {
  const steps = [
    {
      icon: HardHat,
      title: "Bóc tách BOQ & Tư vấn",
      desc: "Kỹ sư vật liệu đọc bản vẽ, bóc tách khối lượng và đề xuất giải pháp tối ưu ngân sách trong 24h.",
    },
    {
      icon: Maximize,
      title: "Gia công CNC Big Slab",
      desc: "Sở hữu xưởng cắt CNC công nghệ cao, xử lý bo vát cạnh, soi chỉ, cắt theo mọi biên dạng thiết kế.",
    },
    {
      icon: Truck,
      title: "Vận tải & Bốc xếp chuyên nghiệp",
      desc: "Đội xe tải cẩu chuyên dụng cho gạch khổ lớn. Cam kết an toàn, không nứt vỡ, đúng tiến độ công trường.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Tại Sao Các Đại Dự Án <br />
              Chọn Phúc Cường Thịnh?
            </h2>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Chúng tôi hiểu rằng với dự án, giá cả chỉ là một phần.{" "}
              <strong className="text-gray-900">
                Tiến độ, Hậu cần và Khả năng xử lý rủi ro
              </strong>{" "}
              mới là chìa khóa. Hệ sinh thái cung ứng của chúng tôi được thiết
              kế để giải quyết mọi "nỗi đau" của nhà thầu.
            </p>

            <div className="space-y-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex gap-5">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Icon size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1541888087425-ce81df846c27?w=800&q=80"
                alt="Năng lực kho bãi"
                fill
                className="object-cover"
              />
            </div>
            {/* Box chèn lên ảnh */}
            <div className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-12 bg-[#0a192f] p-6 md:p-8 rounded-2xl shadow-2xl max-w-xs">
              <CheckCircle2 size={32} className="text-emerald-400 mb-4" />
              <p className="text-white font-bold text-xl mb-2">
                Hàng Sẵn Kho 10.000m²
              </p>
              <p className="text-gray-400 text-sm">
                Xuất hàng linh hoạt ngay trong đêm cho kịp tiến độ đổ bê tông,
                ốp lát.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. CTA B2B (Mạnh mẽ, đánh vào hành động) ───────────────────────────────
function ProjectCTA() {
  return (
    <section className="py-24 px-4 bg-emerald-600 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Đưa Bản Vẽ Của Bạn Trở Thành Hiện Thực
        </h2>
        <p className="text-emerald-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Gửi BOQ hoặc bản vẽ thiết kế, đội ngũ kỹ sư của chúng tôi sẽ phản hồi
          kèm mức chiết khấu đại lý tốt nhất thị trường miền Nam trong 30 phút.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/contact?type=quote"
            className="inline-flex items-center justify-center gap-2 bg-[#0a192f] text-white font-bold px-8 py-5 rounded-xl hover:bg-gray-900 transition-transform hover:-translate-y-1 shadow-xl"
          >
            <Calculator size={22} />
            Yêu Cầu Báo Giá Dự Án
          </Link>
          <a
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-bold px-8 py-5 rounded-xl hover:bg-white hover:text-emerald-600 transition-transform hover:-translate-y-1"
          >
            Chat Zalo Gửi Bản Vẽ
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Lắp ráp Trang ──────────────────────────────────────────────────────────
export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white">
      <ProjectsHero />
      <ProjectGallery />
      <SupplyPowerSection />
      <ProjectCTA />
    </main>
  );
}
