"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Ruler,
  Layers,
  Settings,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HardHat,
  PenTool,
  Wrench,
  Calculator,
} from "lucide-react";

// ─── 1. Hero Section ─────────────────────────────────────────────────────────
function ExecutionHero() {
  return (
    <section className="relative pt-32 pb-24 px-4 bg-[#0a192f] overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
          alt="Thi công ốp lát"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-6 border border-emerald-500/30"
        >
          <HardHat size={16} /> Thi Công & Gia Công CNC
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8 tracking-tight"
        >
          Chuẩn Mực Kỹ Thuật. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            Tuyệt Mỹ Từng Đường Ron.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10"
        >
          Ốp lát Gạch Khổ Lớn (Big Slab) không chỉ là xây dựng, đó là nghệ thuật
          của sự chính xác. Phúc Cường Thịnh mang đến giải pháp thi công và gia
          công cắt CNC trọn gói, bảo chứng cho sự hoàn hảo của mọi công trình.
        </motion.p>
      </div>
    </section>
  );
}

// ─── 2. Dịch vụ Thi công & Gia công (Bento Grid) ─────────────────────────────
const services = [
  {
    icon: Layers,
    title: "Thi Công Ốp Lát Big Slab",
    desc: "Sử dụng hít kính chân không chuyên dụng, keo dán gạch epoxy cao cấp và hệ thống ke cân bằng nêm chốt. Đảm bảo độ phẳng tuyệt đối cho các tấm gạch khổ lớn 1200x2400mm trở lên.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    span: "md:col-span-2",
  },
  {
    icon: Settings,
    title: "Gia Công Cắt Gạch CNC",
    desc: "Cắt thủy lực, soi chỉ, bo vát cạnh 45 độ, đục lỗ lavabo với độ chính xác phần nghìn milimet.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    span: "md:col-span-1",
  },
  {
    icon: PenTool,
    title: "Chà Ron Sứ Epoxy",
    desc: "Sử dụng keo chà ron 2 thành phần chống thấm, chống bám bẩn, đồng màu hoàn hảo với vân gạch.",
    image:
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80",
    span: "md:col-span-1",
  },
  {
    icon: Ruler,
    title: "Khảo Sát & Bóc Tách Bản Vẽ",
    desc: "Kỹ sư trực tiếp đo đạc tại công trình, lên bản vẽ shop drawing chia ron gạch tối ưu hao hụt vật tư.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", // Thay bằng ảnh bản vẽ kiến trúc
    span: "md:col-span-2",
  },
];

function ServicesSection() {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Năng Lực Triển Khai
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col ${srv.span}`}
              >
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center z-10 shadow-sm text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Icon size={24} />
                </div>

                <div className="aspect-[16/9] md:aspect-auto md:h-64 relative overflow-hidden">
                  <Image
                    src={srv.image}
                    alt={srv.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-8 flex-1 flex flex-col bg-white">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {srv.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{srv.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 3. Tiêu chuẩn Kỹ thuật & Vật tư phụ ─────────────────────────────────────
function StandardsSection() {
  const standards = [
    "Sử dụng keo dán gạch tiêu chuẩn C2TE S1/S2 chống trượt.",
    "Hệ thống hít kính chân không điện chịu tải 200kg.",
    "Ke cân bằng nêm chốt 1mm - 1.5mm tạo độ phẳng tuyệt đối.",
    "Máy cắt gạch tia nước không gây mẻ cạnh.",
    "Bảo hành kỹ thuật thi công bong tróc lên đến 5 năm.",
    "Đội ngũ thợ ốp lát trên 10 năm kinh nghiệm xử lý ngàm âm dương.",
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80"
              alt="Tiêu chuẩn thi công"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply" />
          </div>

          <div>
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4 block">
              Bảo Chứng Chất Lượng
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Đỉnh Cao Của Sự Hoàn Mỹ Nằm Ở Vật Tư Phụ
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Một viên gạch trăm triệu có thể bị phá hỏng bởi một đường cắt lỗi
              hoặc loại keo dán kém chất lượng. Phúc Cường Thịnh trang bị hệ
              sinh thái vật tư phụ và máy móc tiêu chuẩn Châu Âu để bảo vệ giá
              trị công trình của bạn.
            </p>

            <div className="space-y-4">
              {standards.map((std, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2
                    size={24}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />
                  <span className="text-gray-700 font-medium">{std}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. Quy trình làm việc (Process) ────────────────────────────────────────
function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Khảo Sát & Nhận Bản Vẽ",
      desc: "Tiếp nhận bản vẽ 3D/CAD, khảo sát mặt bằng thực tế để đánh giá điều kiện thi công (thang máy, cẩu tời).",
    },
    {
      num: "02",
      title: "Lập Shop Drawing & BOQ",
      desc: "Chạy lại bản vẽ chia ron gạch, bóc tách khối lượng vật tư chính xác, gửi báo giá trọn gói.",
    },
    {
      num: "03",
      title: "Gia Công CNC Tại Xưởng",
      desc: "Tiến hành cắt, bo vát, soi chỉ gạch tại xưởng CNC theo đúng bản vẽ để giảm thiểu rác thải tại công trình.",
    },
    {
      num: "04",
      title: "Thi Công & Nghiệm Thu",
      desc: "Vận chuyển vật tư, tiến hành ốp lát bằng dụng cụ chuyên biệt và chà ron sứ. Bàn giao và nghiệm thu.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-[#0a192f] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quy Trình Triển Khai
          </h2>
          <p className="text-gray-400 text-lg">
            Minh bạch, chuyên nghiệp và đúng tiến độ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Connector line for large screens */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-emerald-500/50 to-transparent z-0" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#112240] border border-emerald-500/30 flex items-center justify-center text-3xl font-black text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. CTA ──────────────────────────────────────────────────────────────────
function ExecutionCTA() {
  return (
    <section className="py-24 px-4 bg-emerald-600 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <ShieldCheck size={48} className="mx-auto mb-6 opacity-80" />
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Giải Pháp Trọn Gói Cho Dự Án Của Bạn
        </h2>
        <p className="text-emerald-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Đừng để rủi ro thi công làm hỏng những vật liệu đắt tiền. Lựa chọn
          Phúc Cường Thịnh để nhận cam kết cung ứng và thi công chuẩn mực nhất.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/contact?type=quote"
            className="inline-flex items-center justify-center gap-2 bg-[#0a192f] text-white font-bold px-8 py-5 rounded-xl hover:bg-gray-900 transition-transform hover:-translate-y-1 shadow-xl"
          >
            <Calculator size={22} />
            Nhận Báo Giá Trọn Gói
          </Link>
          <a
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-bold px-8 py-5 rounded-xl hover:bg-white hover:text-emerald-600 transition-transform hover:-translate-y-1"
          >
            Tư Vấn Kỹ Thuật Zalo
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Lắp ráp Trang ──────────────────────────────────────────────────────────
export default function ExecutionPage() {
  return (
    <main className="min-h-screen bg-white">
      <ExecutionHero />
      <ServicesSection />
      <StandardsSection />
      <ProcessSection />
      <ExecutionCTA />
    </main>
  );
}
