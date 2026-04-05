import Link from "next/link";
import {
  MapPin,
  Phone,
  Facebook,
  Youtube,
  Download,
  ArrowRight,
  Clock,
} from "lucide-react";

const ZALO_URL = "https://zalo.me/0901234567";
const TIKTOK_URL = "https://tiktok.com";
const FB_URL = "https://facebook.com";
const YT_URL = "https://youtube.com";

export function Footer() {
  return (
    <footer className="relative overflow-hidden font-sans mt-20 pt-16 md:pt-24 pb-8 bg-[#F5F5F7] rounded-t-[40px] md:rounded-t-[60px]">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 relative z-10">
        {/* ─── Grid Nội Dung Chính ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* CỘT 1: Thương Hiệu (Chiếm 4 cột) */}
          <div className="xl:col-span-4 lg:pr-10">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity ml-4 sm:ml-8 active:scale-95"
            >
              <img
                src="/chuacuon.png"
                alt="Phú Cường Thịnh Logo"
                className="h-20 sm:h-24 object-contain filter grayscale invert opacity-90" // Giả lập logo đen trắng nếu cần, hoặc để nguyên
              />
            </Link>

            <p className="leading-relaxed text-[15px] mb-8 text-gray-500 font-medium">
              Tiên phong phân phối gạch khổ lớn & thiết bị vệ sinh cao cấp. Dẫn
              lối kiến trúc bền vững cho các đại dự án tại Việt Nam.
            </p>

            <a
              href="/ho-so-nang-luc.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 text-[14px] font-bold px-6 py-3.5 rounded-full bg-gray-900 text-white transition-all hover:bg-black hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95 group"
            >
              <Download size={16} strokeWidth={2.5} />
              Tải Profile B2B
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>

          {/* CỘT 2: Khám Phá (Chiếm 2 cột) */}
          <div className="xl:col-span-2">
            <h3 className="font-bold text-xs tracking-[0.2em] uppercase mb-6 text-gray-400">
              Khám Phá
            </h3>
            <ul className="space-y-1.5 text-[15px] font-semibold">
              {[
                { label: "Sản phẩm", href: "/products" },
                { label: "Về Chúng Tôi", href: "/ve-chung-toi" },
                { label: "Thi Công Lắp Đặt", href: "/thi-cong" },
                { label: "Dự Án Tiêu Biểu", href: "/du-an" },
                { label: "Tin Tức & Kiến Thức", href: "/tin-tuc" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex py-2 px-3 -ml-3 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-black/5 transition-colors active:scale-95"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 3: Bento Box Liên Hệ (Chiếm 3 cột) */}
          <div className="xl:col-span-3">
            <h3 className="font-bold text-xs tracking-[0.2em] uppercase mb-6 text-gray-400">
              Thông Tin Liên Hệ
            </h3>
            {/* Bento Box Apple Style */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 bg-gray-50 p-2.5 rounded-full text-gray-900 border border-gray-100">
                  <MapPin size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="block font-bold text-gray-900 mb-1">
                    Showroom & Trụ Sở
                  </span>
                  <span className="text-sm text-gray-500 font-medium leading-relaxed">
                    123 Đường Lê Lợi, P. Phú Cường, TP. Thủ Dầu Một, Bình Dương
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100" />

              <div className="flex items-start gap-4">
                <div className="mt-0.5 bg-gray-50 p-2.5 rounded-full text-gray-900 border border-gray-100">
                  <Phone size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="block font-bold text-gray-900 mb-1">
                    Hotline Dự Án
                  </span>
                  <a
                    href="tel:0901234567"
                    className="text-xl font-black text-gray-900 hover:text-gray-500 transition-colors"
                  >
                    0901.234.567
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 4: Mạng Xã Hội & Giờ làm việc (Chiếm 3 cột) */}
          <div className="xl:col-span-3">
            <h3 className="font-bold text-xs tracking-[0.2em] uppercase mb-6 text-gray-400">
              Kết Nối
            </h3>

            {/* Social Circular Buttons - MONOCHROME */}
            <div className="flex items-center gap-3 mb-8">
              <a
                href={FB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="size-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 transition-all hover:scale-105 hover:border-gray-900 hover:text-gray-900 hover:shadow-md active:scale-95"
              >
                <Facebook size={18} strokeWidth={2.5} />
              </a>
              <a
                href={ZALO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="size-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 transition-all hover:scale-105 hover:border-gray-900 hover:text-gray-900 hover:shadow-md active:scale-95"
              >
                <span className="font-black text-[13px] tracking-tighter">
                  Zalo
                </span>
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="size-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 transition-all hover:scale-105 hover:border-gray-900 hover:text-gray-900 hover:shadow-md active:scale-95"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
              <a
                href={YT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="size-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 transition-all hover:scale-105 hover:border-gray-900 hover:text-gray-900 hover:shadow-md active:scale-95"
              >
                <Youtube size={18} strokeWidth={2.5} />
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 bg-white py-3 px-4 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] inline-flex">
              <Clock size={16} strokeWidth={2.5} className="text-gray-400" />
              <span>Thứ 2 - Thứ 7 (07:30 - 17:30)</span>
            </div>
          </div>
        </div>

        {/* ─── Bottom Footer: Legal & Copyright ─── */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] font-medium z-10 relative">
          <p className="text-center md:text-left text-gray-500">
            © {new Date().getFullYear()} Công ty TNHH MTV TM Phú Cường Thịnh.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Điều khoản
            </Link>
            <Link
              href="/admin/login"
              className="text-gray-300 hover:text-gray-900 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Architectural Watermark Typography ─── */}
      <div className="absolute bottom-[-2%] left-0 right-0 overflow-hidden pointer-events-none select-none flex justify-center opacity-[0.02]">
        <span className="text-[14vw] font-black whitespace-nowrap leading-none tracking-tighter text-gray-900">
          PHUCUONGTHINH
        </span>
      </div>
    </footer>
  );
}
