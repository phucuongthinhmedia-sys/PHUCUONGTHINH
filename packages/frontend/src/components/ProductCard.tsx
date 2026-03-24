"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useWishlist } from "@/lib/wishlist-context";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const coverImage =
    product.media?.find((m) => m.is_cover) || product.media?.[0];
  const imageUrl = coverImage?.file_url || "/placeholder-product.svg";

  // Khởi tạo hooks cho wishlist
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn việc click vào tim bị chuyển hướng sang trang chi tiết
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-4">
        <Link href={`/products/${product.id}`}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </Link>

        {/* Nút Thả Tym (Wishlist Button) */}
        <motion.button
          onClick={handleLike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isLiked ? "#ef4444" : "none"} // Đổ màu đỏ nếu đã thích
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={isLiked ? "#ef4444" : "currentColor"}
            className="w-5 h-5 text-gray-600 transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </motion.button>

        {/* Style Tags (giữ nguyên của bạn) */}
        {product.style_tags && product.style_tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap pointer-events-none">
            {product.style_tags.slice(0, 2).map((tag, i) => (
              <span
                key={tag.id ?? tag.name ?? i}
                className="px-2 py-1 bg-accent text-primary text-xs font-semibold rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-primary hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600">Mã SP: {product.sku}</p>

        {product.space_tags && product.space_tags.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-2">
            {product.space_tags.slice(0, 3).map((tag, i) => (
              <span
                key={tag.id ?? tag.name ?? i}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
