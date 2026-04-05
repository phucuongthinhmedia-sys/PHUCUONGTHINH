import {
  Warehouse,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Leaf,
  Star,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BOQLeadMagnet } from "@/components/BOQLeadMagnet";
import { HomeClient } from "./HomeClient";

// Bảng màu đồng bộ thương hiệu
const palette = {
  be: "#FDF5E6",
  beDarker: "#F5EAD6",
  brown: "#804000",
  lightBrown: "#D2B48C",
};

// ─── PUBLIC SECTIONS (TRANG CHỦ KHÁCH HÀNG) ──────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-laying-ceramic-tiles-on-a-floor-42954-large.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#804000]/30" />

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-[#FDF5E6] animate-pulse" />
            <span className="text-xs font-bold text-[#FDF5E6] uppercase tracking-widest">
              Phú Cường Thịnh
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Nghệ Thuật Của <br />
            <span style={{ color: palette.lightBrown }}>Không Gian Sống</span>
          </h1>
          <p className="text-[#FDF5E6]/80 text-base md:text-xl mb-8 max-w-xl leading-relaxed font-medium">
            Đơn vị dẫn đầu chuỗi cung ứng vật liệu kiến trúc cao cấp, gạch khổ
            lớn và thiết bị vệ sinh cho các đại dự án.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: palette.brown }}
              className="inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-full transition-transform hover:-translate-y-1 shadow-lg text-sm"
            >
              <PhoneCall size={18} /> Tư Vấn Miễn Phí
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white font-bold px-8 py-4 rounded-full transition-all text-sm"
            >
              <ShoppingBag size={18} /> Khám Phá Sản Phẩm
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#FDF5E6]/60 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: palette.lightBrown }} />{" "}
              Tổng kho 10.000m²
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: palette.lightBrown }} />{" "}
              Tiêu chuẩn Châu Âu
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: palette.lightBrown }} />{" "}
              Giao hàng toàn quốc
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

const PUBLIC_CATEGORIES = [
  {
    name: "Gạch Khổ Lớn (Big Slab)",
    desc: "Xóa nhòa ranh giới thiết kế với kích thước vượt trội.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    link: "/products?category=gach-kho-lon",
  },
  {
    name: "Gạch Trang Trí Cao Cấp",
    desc: "Tạo điểm nhấn nghệ thuật cho mọi không gian.",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    link: "/products?category=gach-trang-tri",
  },
  {
    name: "Thiết Bị Vệ Sinh",
    desc: "Tinh hoa công nghệ nước và thẩm mỹ đương đại.",
    img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
    link: "/products?category=thiet-bi-ve-sinh",
  },
  {
    name: "Phụ Kiện Hoàn Thiện",
    desc: "Giải pháp thi công đồng bộ và bền vững.",
    img: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d",
    link: "/products?category=phu-kien",
  },
];

function CategoryFunnel() {
  return (
    <section
      style={{ backgroundColor: palette.be }}
      className="py-24 px-6 lg:px-12"
    >
      <div className="max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2
              style={{ color: palette.brown }}
              className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
            >
              Hệ Sinh Thái <br />
              Vật Liệu
            </h2>
            <p
              style={{ color: palette.brown }}
              className="text-lg font-medium opacity-70 leading-relaxed"
            >
              Đáp ứng khắt khe nhất các tiêu chuẩn của dự án thương mại & Villa
              cao cấp.
            </p>
          </div>
          <Link
            href="/products"
            style={{ color: palette.brown }}
            className="group flex items-center gap-2 font-bold hover:opacity-70 transition-opacity mt-6 md:mt-0 px-6 py-3 border-2 border-[#804000] rounded-full"
          >
            Xem toàn bộ{" "}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PUBLIC_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="group block relative rounded-[32px] overflow-hidden bg-white shadow-sm hover:shadow-[0_20px_40px_rgba(128,64,0,0.08)] transition-all duration-500"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={idx < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[#FDF5E6]/80 text-sm font-medium mb-6 line-clamp-2">
                  {cat.desc}
                </p>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-white group-hover:text-[#804000] transition-colors">
                  <ArrowRight
                    size={20}
                    className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const USPS_DATA = [
  {
    icon: Star,
    title: "Tiên Phong Big Slab",
    desc: "Đơn vị đầu tiên phân phối chính thức các dòng gạch khổ lớn thượng lưu.",
  },
  {
    icon: ShieldCheck,
    title: "Công Nghệ Châu Âu",
    desc: "Bề mặt kháng khuẩn, chống trầy xước, độ bền vượt thời gian.",
  },
  {
    icon: Leaf,
    title: "Kiến Trúc Xanh",
    desc: "Vật liệu sinh thái, an toàn cho sức khỏe và môi trường sống.",
  },
  {
    icon: Warehouse,
    title: "Năng Lực Cung Ứng",
    desc: "Hệ thống kho bãi quy mô lớn, sẵn sàng đáp ứng mọi tiến độ.",
  },
];

function USPSection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-[1920px] mx-auto">
        <div className="text-center mb-20">
          <h2
            style={{ color: palette.brown }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
          >
            Giá Trị Cốt Lõi
          </h2>
          <p
            style={{ color: palette.brown }}
            className="text-lg font-medium opacity-70 max-w-2xl mx-auto"
          >
            Không chỉ phân phối vật liệu, chúng tôi mang đến sự an tâm tuyệt đối
            cho chủ đầu tư và giới tinh hoa kiến trúc.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {USPS_DATA.map((usp, idx) => {
            const Icon = usp.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-[40px] bg-[#FDF5E6]/30 border border-[#804000]/5 hover:bg-[#FDF5E6] hover:border-[#804000]/20 transition-all duration-300 group text-center flex flex-col items-center"
              >
                <div
                  style={{ backgroundColor: palette.brown }}
                  className="w-20 h-20 rounded-[24px] shadow-lg flex items-center justify-center mb-8 group-hover:-translate-y-2 transition-transform duration-300"
                >
                  <Icon size={32} className="text-[#FDF5E6]" />
                </div>
                <h3
                  style={{ color: palette.brown }}
                  className="text-xl font-black mb-4"
                >
                  {usp.title}
                </h3>
                <p
                  style={{ color: palette.brown }}
                  className="opacity-70 font-medium leading-relaxed"
                >
                  {usp.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── ROOT PAGE COMPONENT (SERVER COMPONENT) ───────────────────────────────────
export default function Home() {
  // Server Component với Client wrapper để xử lý authentication
  return (
    <HomeClient>
      <main className="min-h-screen bg-white selection:bg-[#804000]/20 selection:text-[#804000]">
        <HeroSection />
        <CategoryFunnel />
        <USPSection />
        <BOQLeadMagnet />
      </main>
    </HomeClient>
  );
}
