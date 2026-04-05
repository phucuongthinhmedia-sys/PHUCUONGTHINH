"use client";

import { motion } from "framer-motion";

interface FilterTabsProps {
  activeTab: "inspiration" | "technical";
  onTabChange: (tab: "inspiration" | "technical") => void;
}

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  const tabs = [
    { id: "inspiration", label: "Cảm hứng" },
    { id: "technical", label: "Kỹ thuật" },
  ] as const;

  return (
    <div className="relative flex bg-black/5 backdrop-blur-xl p-1 rounded-full border border-black/5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-1 py-2.5 sm:py-3 text-[13px] sm:text-[14px] font-bold rounded-full transition-colors z-10 ${
              isActive
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700 active:scale-95"
            }`}
          >
            {/* Hiệu ứng thanh trượt (Sliding Pill) giống iOS Segmented Control */}
            {isActive && (
              <motion.div
                layoutId="filterActiveTab"
                className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-black/5"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
