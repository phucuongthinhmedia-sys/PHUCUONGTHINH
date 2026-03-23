"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BudgetCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function BudgetCalculator({
  isOpen,
  onClose,
  productName,
}: BudgetCalculatorProps) {
  const [area, setArea] = useState("");
  const [pricePerM2, setPricePerM2] = useState("");

  const totalMaterialCost = Number(area) * Number(pricePerM2) || 0;
  const laborCostPerM2 = 150000;
  const otherCostPerM2 = 50000;
  const totalLaborCost = Number(area) * laborCostPerM2 || 0;
  const totalOtherCost = Number(area) * otherCostPerM2 || 0;
  const grandTotal = totalMaterialCost + totalLaborCost + totalOtherCost;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  Dự trù kinh phí
                </h2>
                <p className="text-sm text-gray-500 mt-1">{productName}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Diện tích (m²)
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Nhập diện tích"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-primary outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Giá gạch / m²
                </label>
                <input
                  type="number"
                  value={pricePerM2}
                  onChange={(e) => setPricePerM2(e.target.value)}
                  placeholder="Nhập giá"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-primary outline-none"
                />
              </div>

              {area && pricePerM2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-50 rounded-xl p-4 space-y-2 mt-4"
                >
                  <div className="flex justify-between text-sm">
                    <span>Vật liệu:</span>
                    <span className="font-semibold">
                      {formatCurrency(totalMaterialCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thi công:</span>
                    <span className="font-semibold">
                      {formatCurrency(totalLaborCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phụ kiện:</span>
                    <span className="font-semibold">
                      {formatCurrency(totalOtherCost)}
                    </span>
                  </div>
                  <div className="border-t-2 border-green-200 pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-primary">Tổng:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* Giá ước tính</p>
                </motion.div>
              )}

              <button
                onClick={onClose}
                className="w-full mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-gray-800"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
