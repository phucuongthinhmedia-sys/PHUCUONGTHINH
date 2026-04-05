"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

// Bảng màu đồng bộ thương hiệu
const palette = {
  be: "#FDF5E6",
  beDarker: "#F5EAD6",
  brown: "#804000",
  lightBrown: "#D2B48C",
};

export function BOQLeadMagnet() {
  const [phone, setPhone] = useState("");

  return (
    <section
      style={{ backgroundColor: palette.brown }}
      className="py-32 px-6 lg:px-12 relative overflow-hidden rounded-t-[60px] mt-10"
    >
      <div
        style={{ backgroundColor: palette.lightBrown }}
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none"
      />
      <div
        style={{ backgroundColor: palette.be }}
        className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] rounded-full blur-[100px] opacity-10 pointer-events-none"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm text-[#FDF5E6] font-bold text-sm mb-8 border border-white/20">
          <FileText size={16} /> Nhận bảng tính BOQ hoàn toàn miễn phí
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-[#FDF5E6] mb-8 leading-tight tracking-tight">
          Bạn Đã Có Bản Vẽ <br className="hidden md:block" /> Thiết Kế?
        </h2>
        <p className="text-[#FDF5E6]/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Gửi bản vẽ cho Phú Cường Thịnh, chuyên gia của chúng tôi sẽ phản hồi
          kèm <strong className="text-white">Bảng dự toán chi tiết</strong> chỉ
          trong vòng 30 phút.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto bg-white/5 p-2 rounded-full backdrop-blur-md border border-white/10">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số Zalo của bạn..."
            className="flex-1 px-6 py-4 rounded-full bg-transparent text-white placeholder-white/50 text-base font-medium outline-none focus:bg-white/10 transition-colors"
          />
          <button
            style={{ backgroundColor: palette.be, color: palette.brown }}
            className="font-black px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-xl text-base whitespace-nowrap"
          >
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </section>
  );
}
