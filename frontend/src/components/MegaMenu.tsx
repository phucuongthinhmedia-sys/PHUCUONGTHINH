"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Sparkles } from "lucide-react";

// ─── Data với Hình ảnh Trực quan ──────────────────────────────────────────────
const menuData = [
  {
    id: "big-slab",
    title: "Gạch Khổ Lớn (Big Slab)",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
    links: [
      { href: "/products/op-vach", label: "Ốp vách Sảnh & Tivi", hot: true },
      {
        href: "/products/lat-nen-villa",
        label: "Lát nền Villa & Không gian mở",
      },
      { href: "/products/gach-mat-tien", label: "Gạch mặt tiền & Ngoại thất" },
      { href: "/products/mat-ban-dao-bep", label: "Mặt bàn & Đảo bếp CNC" },
    ],
  },
  {
    id: "gach-op-lat",
    title: "Gạch Ốp Lát & Trang Trí",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
    links: [
      {
        href: "/products/gach-lat-nen",
        label: "Gạch nền (60x60, 80x80, 100x100)",
      },
      { href: "/products/gach-gia-go", label: "Gạch giả gỗ & Sân vườn" },
      {
        href: "/products/gach-trang-tri",
        label: "Gạch trang trí (Mosaic, Thẻ)",
      },
      { href: "/products/ngoi-lop", label: "Ngói lợp & Vật liệu mái" },
    ],
  },
  {
    id: "thiet-bi-ve-sinh",
    title: "Thiết Bị Vệ Sinh & Bếp",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
    links: [
      { href: "/products/thiet-bi-ve-sinh", label: "Bồn cầu, Lavabo, Sen tắm" },
      {
        href: "/products/am-tuong",
        label: "Hệ thống Âm tường thông minh",
        hot: true,
      },
      { href: "/products/bon-tam", label: "Bồn tắm nghệ thuật Villa" },
      { href: "/products/chau-rua-bep", label: "Thiết bị & Chậu rửa Bếp" },
    ],
  },
  {
    id: "phu-tro",
    title: "Gia Công & Phụ Trợ",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80", // Có thể thay bằng ảnh máy cắt CNC hoặc keo chà ron
    links: [
      { href: "/products/keo-dan-ron", label: "Keo dán gạch & Ron sứ Epoxy" },
      { href: "/products/nep-trang-tri", label: "Nẹp trang trí Inox / Đồng" },
      {
        href: "/products/cat-gach-cnc",
        label: "Dịch vụ gia công cắt gạch CNC",
      },
      {
        href: "/products/vat-tu-thi-cong",
        label: "Dụng cụ ốp lát chuyên dụng",
      },
    ],
  },
];

export function MegaMenu() {
  return (
    <div
      className="
        absolute top-full left-1/2 -translate-x-1/2
        w-[1100px] max-w-[calc(100vw-2rem)] z-50
        opacity-0 translate-y-3 pointer-events-none
        group-hover/products:opacity-100 group-hover/products:translate-y-0 group-hover/products:pointer-events-auto
        transition-all duration-300 ease-out mt-1
      "
    >
      {/* Cầu nối vô hình (Invisible hover bridge) giúp chuột không bị trượt khỏi menu */}
      <div className="h-4 w-full absolute -top-4 left-0" />

      {/* Card MegaMenu */}
      <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">
        {/* Phần lưới chính */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-4 gap-8">
            {menuData.map((col) => (
              <div key={col.id} className="group/col flex flex-col">
                {/* Header Cột: Hình ảnh + Tiêu đề */}
                <Link
                  href={`/products/${col.id}`}
                  className="block relative rounded-xl overflow-hidden aspect-[4/3] mb-5"
                >
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/col:scale-110"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  {/* Lớp phủ Gradient để chữ nổi bật */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/col:opacity-90 transition-opacity" />
                  <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold text-sm tracking-wide leading-tight group-hover/col:text-emerald-400 transition-colors">
                    {col.title}
                  </h3>
                </Link>

                {/* Danh sách Links */}
                <ul className="flex flex-col gap-1 flex-1">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="group/link flex items-center justify-between py-2 px-3 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-600 group-hover/link:text-emerald-700 transition-colors">
                          {link.label}
                        </span>
                        {/* Biểu tượng HOT hoặc Mũi tên */}
                        {link.hot ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            <Zap size={10} className="fill-rose-500" /> Hot
                          </span>
                        ) : (
                          <ArrowRight
                            size={14}
                            className="text-emerald-500 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bar của Mega Menu (Tạo sự tin tưởng và kêu gọi hành động) */}
        <div className="bg-gradient-to-r from-[#0a192f] to-[#112240] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-emerald-50">
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles size={16} className="text-emerald-400" />
              Tổng kho 10.000m² tại Miền Nam
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-500 hidden md:block" />
            <span className="hidden md:inline text-gray-400">
              Giao hàng hỏa tốc trong 2H nội thành
            </span>
          </div>

          <Link
            href="/products"
            className="group/all inline-flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-400 transition-colors bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
          >
            Khám phá toàn bộ
            <ArrowRight
              size={16}
              className="group-hover/all:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
