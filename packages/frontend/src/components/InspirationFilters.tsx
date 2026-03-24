"use client";

import { motion } from "framer-motion";
import { Style, Space } from "@/types";
import { Check } from "lucide-react";

interface InspirationFiltersProps {
  styles: Style[];
  spaces: Space[];
  selectedStyles: string[];
  selectedSpaces: string[];
  onStyleChange: (styleId: string) => void;
  onSpaceChange: (spaceId: string) => void;
}

export function InspirationFilters({
  styles,
  spaces,
  selectedStyles,
  selectedSpaces,
  onStyleChange,
  onSpaceChange,
}: InspirationFiltersProps) {
  return (
    <div className="space-y-8">
      {/* Phong cách */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
          Phong cách
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {styles.map((style) => {
            const isSelected = selectedStyles.includes(style.id);
            return (
              <motion.button
                key={style.id}
                onClick={() => onStyleChange(style.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-[#0a192f] text-white shadow-md border border-[#0a192f]"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected && <Check size={14} className="text-emerald-400" />}
                {style.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Không gian */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
          Không gian
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {spaces.map((space) => {
            const isSelected = selectedSpaces.includes(space.id);
            return (
              <motion.button
                key={space.id}
                onClick={() => onSpaceChange(space.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md border border-emerald-600"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected && <Check size={14} className="text-white" />}
                {space.name}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
