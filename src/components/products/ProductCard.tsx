"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product, Price } from "@/types";
import { formatPrice, getCategoryLabel } from "@/lib/utils";
import { Badge, StockBadge } from "@/components/ui";
import { ExternalLink } from "lucide-react";

interface ProductCardProps {
  product: Product;
  lowestPrice?: Price | null;
  prices?: Price[];
}

export function ProductCard({ product, lowestPrice, prices = [] }: ProductCardProps) {
  const inStock = prices.some((p) => p.in_stock);

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="glass rounded-2xl overflow-hidden group cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative aspect-square bg-white/5 flex items-center justify-center p-6">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="text-4xl text-white/30">?</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge>{getCategoryLabel(product.category)}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Brand */}
          <span className="text-xs text-white/50 uppercase tracking-wider mb-1">
            {product.brand}
          </span>

          {/* Name */}
          <h3 className="font-semibold text-white mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
            {product.name}
          </h3>

          {/* Specs Preview */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.specs.cores && (
              <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
                {product.specs.cores} Cores
              </span>
            )}
            {product.specs.vram && (
              <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
                {product.specs.vram}GB VRAM
              </span>
            )}
            {product.specs.capacity && (
              <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
                {product.specs.capacity}GB
              </span>
            )}
            {product.specs.refresh_rate && (
              <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
                {product.specs.refresh_rate}Hz
              </span>
            )}
          </div>

          {/* Price & Stock */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              {lowestPrice ? (
                <div>
                  <span className="text-xs text-white/50">From</span>
                  <div className="text-xl font-bold text-white">
                    {formatPrice(lowestPrice.price, lowestPrice.currency)}
                  </div>
                </div>
              ) : (
                <span className="text-white/50">Price unavailable</span>
              )}
              <StockBadge inStock={inStock} />
            </div>

            {/* Retailer count */}
            {prices.length > 0 && (
              <div className="mt-2 text-xs text-white/40">
                Available at {prices.length} retailer{prices.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
