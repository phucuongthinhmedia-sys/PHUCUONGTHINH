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

// Bảng màu đồng bộ tuyệt đối với Header
const palette = {
  be: "#FDF5E6",
  beDarker: "#F5EAD6",
  brown: "#804000",
  lightBrown: "#D2B48C",
};

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: palette.be,
        borderColor: "rgba(210, 180, 140, 0.3)",
      }}
      className="relative overflow-hidden font-sans mt-20 pt-16 md:pt-24 pb-8 rounded-t-[40px] md:rounded-t-[60px] border-t shadow-[0_-20px_60px_rgba(128,64,0,0.03)]"
    >
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 relative z-10">
        {/* ─── Grid Nội Dung Chính ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* CỘT 1: Thương Hiệu (Chiếm 4 cột) */}
          <div className="xl:col-span-4 lg:pr-10">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity ml-8"
            >
              <img
                src="/dacuon.png"
                alt="Phú Cường Thịnh Logo"
                className="h-28 object-contain"
              />
            </Link>

            <p
              style={{ color: palette.brown }}
              className="leading-relaxed text-[15px] mb-8 opacity-80 font-medium"
            >
              Tiên phong phân phối gạch khổ lớn & thiết bị vệ sinh cao cấp. Dẫn
              lối kiến trúc bền vững cho các đại dự án tại Việt Nam.
            </p>

            <a
              href="/ho-so-nang-luc.pdf"
              target="_blank"
              style={{ color: palette.brown, borderColor: palette.brown }}
              className="inline-flex items-center gap-2 text-[14px] font-bold px-6 py-3.5 rounded-full border-2 transition-all hover:bg-[#804000] hover:text-white group"
            >
              <Download size={16} />
              Tải Profile B2B
              <ArrowRight
                size={16}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>

          {/* CỘT 2: Khám Phá (Chiếm 2 cột) */}
          <div className="xl:col-span-2">
            <h3
              style={{ color: palette.brown }}
              className="font-black text-sm tracking-widest uppercase mb-6 opacity-60"
            >
              Khám Phá
            </h3>
            <ul className="space-y-2 text-[15px] font-semibold">
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
                    style={{ color: palette.brown }}
                    className="inline-flex py-2 px-3 -ml-3 rounded-xl hover:bg-[#804000]/5 transition-colors opacity-80 hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 3: Bento Box Liên Hệ (Chiếm 3 cột) */}
          <div className="xl:col-span-3">
            <h3
              style={{ color: palette.brown }}
              className="font-black text-sm tracking-widest uppercase mb-6 opacity-60"
            >
              Thông Tin Liên Hệ
            </h3>
            <div
              style={{ backgroundColor: palette.beDarker }}
              className="rounded-3xl p-6 shadow-sm flex flex-col gap-6"
            >
              <div className="flex items-start gap-4">
                <div
                  style={{ color: palette.brown }}
                  className="mt-0.5 bg-white/50 p-2 rounded-full"
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <span
                    style={{ color: palette.brown }}
                    className="block font-bold mb-1"
                  >
                    Showroom trưng bày tại
                  </span>
                  <span
                    style={{ color: palette.brown }}
                    className="text-sm opacity-80 font-medium"
                  >
                    603 Đại Lộ Bình Dương, Hiệp Thành, Thủ Dầu Một, TP. HCM
                  </span>
                </div>
              </div>

              <div
                style={{ backgroundColor: palette.lightBrown }}
                className="h-px w-full opacity-30"
              />

              <div className="flex items-start gap-4">
                <div
                  style={{ color: palette.brown }}
                  className="mt-0.5 bg-white/50 p-2 rounded-full"
                >
                  <Phone size={18} />
                </div>
                <div>
                  <span
                    style={{ color: palette.brown }}
                    className="block font-bold mb-1"
                  >
                    Hotline Dự Án
                  </span>
                  <a
                    href="tel:0862530979"
                    style={{ color: palette.brown }}
                    className="text-xl font-black hover:opacity-70 transition-opacity"
                  >
                    0862.530.979
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 4: Mạng Xã Hội & Giờ làm việc (Chiếm 3 cột) */}
          <div className="xl:col-span-3">
            <h3
              style={{ color: palette.brown }}
              className="font-black text-sm tracking-widest uppercase mb-6 opacity-60"
            >
              Kết Nối
            </h3>

            {/* Social Circular Buttons */}
            <div className="flex items-center gap-3 mb-8">
              {/* Facebook */}
              <a
                href={FB_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: palette.brown,
                  borderColor: palette.lightBrown,
                }}
                className="size-12 rounded-full border bg-transparent flex items-center justify-center transition-all hover:-translate-y-1 hover:bg-[#1877F2] hover:text-white hover:border-transparent hover:shadow-lg"
              >
                <Facebook size={18} />
              </a>
              {/* Zalo (Custom styled) */}
              <a
                href={ZALO_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: palette.brown,
                  borderColor: palette.lightBrown,
                }}
                className="size-12 rounded-full border bg-transparent flex items-center justify-center transition-all hover:-translate-y-1 hover:bg-[#0068FF] hover:text-white hover:border-transparent hover:shadow-lg"
              >
                <span className="font-black text-[13px] tracking-tighter">
                  Zalo
                </span>
              </a>
              {/* TikTok (SVG Icon) */}
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: palette.brown,
                  borderColor: palette.lightBrown,
                }}
                className="size-12 rounded-full border bg-transparent flex items-center justify-center transition-all hover:-translate-y-1 hover:bg-[#000000] hover:text-white hover:border-transparent hover:shadow-lg"
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
              {/* YouTube */}
              <a
                href={YT_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: palette.brown,
                  borderColor: palette.lightBrown,
                }}
                className="size-12 rounded-full border bg-transparent flex items-center justify-center transition-all hover:-translate-y-1 hover:bg-[#FF0000] hover:text-white hover:border-transparent hover:shadow-lg"
              >
                <Youtube size={18} />
              </a>
            </div>

            <div
              className="flex items-center gap-3 text-sm font-semibold"
              style={{ color: palette.brown }}
            >
              <Clock size={16} className="opacity-70" />
              <span>Thứ 2 - Thứ 7 (07:30 - 17:30)</span>
            </div>
          </div>
        </div>

        {/* ─── Bottom Footer: Legal & Copyright ─── */}
        <div
          style={{ borderColor: "rgba(210, 180, 140, 0.3)" }}
          className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] font-medium z-10 relative"
        >
          <p
            style={{ color: palette.brown }}
            className="text-center md:text-left opacity-70"
          >
            © {new Date().getFullYear()} Công ty TNHH MTV TM Phú Cường Thịnh.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/privacy"
              style={{ color: palette.brown }}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/terms"
              style={{ color: palette.brown }}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              Điều khoản
            </Link>
            <Link
              href="/admin/login"
              style={{ color: palette.brown }}
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Architectural Watermark Typography (Background chìm) ─── */}
      <div className="absolute bottom-[-5%] left-0 right-0 overflow-hidden pointer-events-none select-none flex justify-center opacity-[0.03]">
        <span
          style={{ color: palette.brown }}
          className="text-[14vw] font-black whitespace-nowrap leading-none tracking-tighter"
        >
          PHUCUONGTHINH
        </span>
      </div>
    </footer>
  );
}
