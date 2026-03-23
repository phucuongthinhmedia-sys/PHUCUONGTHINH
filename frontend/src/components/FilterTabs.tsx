"use client";

import { motion } from "framer-motion";

interface FilterTabsProps {
  activeTab: "inspiration" | "technical";
  onTabChange: (tab: "inspiration" | "technical") => void;
}

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="flex bg-gray-100 p-1.5 rounded-xl">
      <button
        onClick={() => onTabChange("inspiration")}
        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative ${
          activeTab === "inspiration"
            ? "text-gray-900 shadow-sm bg-white"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
        }`}
      >
        Cảm hứng
      </button>

      <button
        onClick={() => onTabChange("technical")}
        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative ${
          activeTab === "technical"
            ? "text-gray-900 shadow-sm bg-white"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
        }`}
      >
        Kỹ thuật
      </button>
    </div>
  );
}
