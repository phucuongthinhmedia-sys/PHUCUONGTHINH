"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Award,
  Globe2,
  Leaf,
  Target,
  Diamond,
  ChevronRight,
  Download,
} from "lucide-react";

// ─── 1. Hero Section ─────────────────────────────────────────────────────────
function AboutHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-20 overflow-hidden bg-[#0a192f]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
            Câu Chuyện Thương Hiệu
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Kiến Tạo Đẳng Cấp. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Dẫn Lối Kiến Trúc Xanh.
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Hơn một thập kỷ gắn bó với ngành vật liệu xây dựng, Phúc Cường Thịnh
            không chỉ cung cấp gạch ốp lát, chúng tôi mang đến những giải pháp
            không gian vượt thời gian cho các đại dự án.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 2. Lịch Sử & Nền Tảng (Lấy từ GPKD) ────────────────────────────────────
function FoundationSection() {
  return (
    <section className="py-24 px-4 bg-[#0a192f] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Nền Tảng Vững Chắc <br />
              <span className="text-emerald-400">Từ Năm 2011</span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Được thành lập từ ngày 29/04/2011, Công ty TNHH MTV Thương mại
              Phúc Cường Thịnh đã trải qua một hành trình dài khẳng định vị thế
              trong chuỗi cung ứng vật liệu B2B tại Việt Nam.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg">
              Dưới sự dẫn dắt của Chủ tịch kiêm Giám đốc - Ông Bùi Đức Thịnh,
              cùng nguồn vốn điều lệ vững mạnh 9.9 tỷ đồng, chúng tôi tự hào là
              đối tác chiến lược của hàng trăm tổng thầu và chủ đầu tư trên toàn
              quốc.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="border-l-2 border-emerald-500 pl-4">
                <p className="text-3xl font-black text-white mb-1">10+</p>
                <p className="text-sm text-gray-500 font-medium">
                  Năm Kinh Nghiệm
                </p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-4">
                <p className="text-3xl font-black text-white mb-1">500+</p>
                <p className="text-sm text-gray-500 font-medium">
                  Dự Án Hoàn Thiện
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80"
                alt="Trụ sở Phúc Cường Thịnh"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
            </div>
            {/* Box địa chỉ nổi */}
            <div className="absolute -bottom-8 -left-8 bg-white text-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm hidden md:block">
              <Building2 size={32} className="text-emerald-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Trụ Sở Chính</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Số 603 Đại lộ Bình Dương, Phường Hiệp Thành, TP. Thủ Dầu Một,
                Bình Dương.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Tầm Nhìn & Sứ Mệnh ──────────────────────────────────────────────────
const philosophies = [
  {
    icon: Globe2,
    title: "Tầm Nhìn",
    desc: "Trở thành biểu tượng phân phối vật liệu xây dựng cao cấp hàng đầu miền Nam. Đưa tinh hoa gạch Big Slab quốc tế đến với mọi công trình tinh hoa tại Việt Nam.",
  },
  {
    icon: Target,
    title: "Sứ Mệnh",
    desc: "Cung cấp giải pháp vật liệu trọn gói, tối ưu ngân sách cho nhà thầu. Giải phóng ranh giới sáng tạo cho giới Kiến trúc sư qua những vật liệu đột phá.",
  },
  {
    icon: Leaf,
    title: "Triết Lý",
    desc: "Phát triển bền vững song hành cùng Kiến Trúc Xanh. Ưu tiên phân phối các dòng gạch kháng khuẩn, an toàn cho sức khỏe và thân thiện với môi trường.",
  },
];

function PhilosophySection() {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kim Chỉ Nam Hoạt Động
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {philosophies.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  <Icon size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Lời Lãnh Đạo (Chủ Tịch) ─────────────────────────────────────────────
function LeadershipSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto bg-[#0a192f] rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
        {/* Abstract Background element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80" // Có thể thay bằng ảnh thật của sếp
                alt="Chủ tịch Bùi Đức Thịnh"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-7 text-white">
            <Diamond className="text-emerald-400 mb-6" size={40} />
            <blockquote className="text-xl md:text-2xl font-light leading-relaxed mb-8 italic">
              "Chúng tôi không chạy theo số lượng, Phúc Cường Thịnh theo đuổi sự
              hoàn mỹ. Đưa Big Slab và Gạch công nghệ cao về Việt Nam không chỉ
              là bài toán kinh doanh, mà là khát vọng nâng tầm đẳng cấp không
              gian sống cho người Việt."
            </blockquote>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                Ông Bùi Đức Thịnh
              </p>
              <p className="text-emerald-400 font-medium">
                Chủ tịch kiêm Giám đốc Phúc Cường Thịnh
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. CTA Cuối Trang ──────────────────────────────────────────────────────
function AboutCTA() {
  return (
    <section className="py-24 px-4 bg-emerald-600 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Sẵn Sàng Đồng Hành Cùng Dự Án Của Bạn
        </h2>
        <p className="text-emerald-100 text-lg mb-10">
          Tổng kho 10.000m² tại Dĩ An luôn sẵn sàng cung ứng hỏa tốc. Tải hồ sơ
          năng lực để hiểu chi tiết về hệ sinh thái sản phẩm của chúng tôi.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#0a192f] text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-900 transition-colors"
          >
            Liên Hệ Báo Giá B2B
            <ChevronRight size={20} />
          </Link>
          <button className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-emerald-600 transition-colors">
            <Download size={20} />
            Tải Hồ Sơ Năng Lực (PDF)
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page Export ───────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      <FoundationSection />
      <PhilosophySection />
      <LeadershipSection />
      <AboutCTA />
    </main>
  );
}
