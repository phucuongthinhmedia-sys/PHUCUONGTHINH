"use client";

import { useState } from "react";

interface TechnicalFiltersProps {
  onFilterChange: (specs: Record<string, any>) => void;
}

export function TechnicalFilters({ onFilterChange }: TechnicalFiltersProps) {
  const [specs, setSpecs] = useState<Record<string, any>>({});

  const handleSpecChange = (key: string, value: any) => {
    const updated = { ...specs, [key]: value };
    setSpecs(updated);
    onFilterChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold mb-3">Định dạng</label>
        <select
          value={specs.format || ""}
          onChange={(e) =>
            handleSpecChange("format", e.target.value || undefined)
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
        >
          <option value="">Tất cả định dạng</option>
          <option value="Slab">Slab</option>
          <option value="Mosaic">Mosaic</option>
          <option value="Hexagon">Hexagon</option>
        </select>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-3">Chất liệu</label>
        <select
          value={specs.material || ""}
          onChange={(e) =>
            handleSpecChange("material", e.target.value || undefined)
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
        >
          <option value="">Tất cả chất liệu</option>
          <option value="Porcelain">Sứ</option>
          <option value="Ceramic">Gốm</option>
          <option value="Natural Stone">Đá tự nhiên</option>
        </select>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-3">Bề mặt</label>
        <select
          value={specs.finish || ""}
          onChange={(e) =>
            handleSpecChange("finish", e.target.value || undefined)
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
        >
          <option value="">Tất cả bề mặt</option>
          <option value="Matte">Mờ</option>
          <option value="Glossy">Bóng</option>
          <option value="Textured">Nhám</option>
        </select>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-3">Chống trơn</label>
        <select
          value={specs.slip_resistance || ""}
          onChange={(e) =>
            handleSpecChange("slip_resistance", e.target.value || undefined)
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
        >
          <option value="">Tất cả mức độ</option>
          <option value="R9">R9</option>
          <option value="R10">R10</option>
          <option value="R11">R11</option>
        </select>
      </div>
    </div>
  );
}
