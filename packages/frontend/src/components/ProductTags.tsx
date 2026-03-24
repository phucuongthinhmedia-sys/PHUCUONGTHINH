"use client";

import { motion } from "framer-motion";
import { Style, Space } from "@/types";

interface ProductTagsProps {
  styles?: Style[];
  spaces?: Space[];
}

export function ProductTags({ styles = [], spaces = [] }: ProductTagsProps) {
  if (styles.length === 0 && spaces.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {styles.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Phong cách
          </h4>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <motion.span
                key={style.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1 bg-accent text-primary text-sm font-semibold rounded-full"
              >
                {style.name}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {spaces.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Không gian
          </h4>
          <div className="flex flex-wrap gap-2">
            {spaces.map((space) => (
              <motion.span
                key={space.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1 bg-gray-200 text-primary text-sm font-semibold rounded-full"
              >
                {space.name}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
