"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Sparkles } from "lucide-react";

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
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80",
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
        opacity-0 translate-y-4 pointer-events-none scale-95
        group-hover/products:opacity-100 group-hover/products:translate-y-0 group-hover/products:scale-100 group-hover/products:pointer-events-auto
        transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] mt-2
      "
    >
      {/* Cầu nối vô hình giúp chuột không bị trượt */}
      <div className="h-6 w-full absolute -top-6 left-0" />

      {/* APPLE FROSTED GLASSMORPHISM: Đã tăng bg-white/90 để đảm bảo độ tương phản */}
      <div className="bg-white/90 backdrop-blur-[40px] saturate-150 rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.8)_inset] overflow-hidden border border-white">
        {/* Phần lưới chính */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-4 gap-8">
            {menuData.map((col) => (
              <div key={col.id} className="group/col flex flex-col">
                {/* Header Cột: Hình ảnh + Tiêu đề */}
                <Link
                  href={`/products/${col.id}`}
                  className="block relative rounded-[20px] overflow-hidden aspect-[4/3] mb-5 shadow-sm"
                >
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/col:scale-110"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/col:opacity-95 transition-opacity" />
                  <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold text-[14px] tracking-wide leading-tight group-hover/col:text-gray-200 transition-colors">
                    {col.title}
                  </h3>
                </Link>

                {/* Danh sách Links */}
                <ul className="flex flex-col gap-1 flex-1">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="group/link flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
                      >
                        <span className="text-[13.5px] font-semibold text-gray-800 group-hover/link:text-black transition-colors">
                          {link.label}
                        </span>
                        {/* Tag Hot hoặc Mũi tên */}
                        {link.hot ? (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                            <Zap size={10} className="fill-red-600" /> Hot
                          </span>
                        ) : (
                          <ArrowRight
                            size={14}
                            className="text-black opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300"
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

        {/* Footer Bar: Đổi sang nền xám nhạt để phân tách tinh tế */}
        <div className="bg-gray-50/80 border-t border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <span className="flex items-center gap-1.5 font-bold text-gray-900">
              <Sparkles size={16} className="text-gray-900" />
              Tổng kho 10.000m² tại Miền Nam
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
            <span className="hidden md:inline font-medium text-gray-500">
              Giao hàng hỏa tốc trong 2H nội thành
            </span>
          </div>

          <Link
            href="/products"
            className="group/all inline-flex items-center gap-2 text-[13px] font-bold text-gray-900 transition-colors bg-white px-4 py-2 rounded-full hover:bg-gray-50 shadow-sm border border-gray-200 active:scale-95"
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
