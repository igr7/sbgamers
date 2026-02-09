"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Product, Price } from "@/types";
import { Badge, StockBadge } from "@/components/ui";
import { formatPrice, getCategoryLabel, getRetailerLabel } from "@/lib/utils";
import { ExternalLink, Store, TrendingDown, Image as ImageIcon, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  lowestPrice?: Price | null;
  prices?: Price[];
  showDiscount?: boolean;
  originalPrice?: number;
}

export function ProductCard({
  product,
  lowestPrice,
  prices = [],
  showDiscount = false,
  originalPrice
}: ProductCardProps) {
  const hasImage = product.image_url && product.image_url.length > 10;
  const discountPercent = showDiscount && originalPrice && lowestPrice
    ? Math.round(((originalPrice - lowestPrice.price) / originalPrice) * 100)
    : 0;

  // Get key specs for preview
  const getSpecsPreview = (): string[] => {
    const specs = product.specs;
    const preview: string[] = [];

    // GPU
    if (specs.vram) preview.push(`${specs.vram}GB VRAM`);
    if (specs.cuda_cores) preview.push(`${specs.cuda_cores.toLocaleString()} CUDA`);

    // CPU
    if (specs.cores) preview.push(`${specs.cores} Cores`);
    if (specs.boost_clock) preview.push(`${(specs.boost_clock / 1000).toFixed(1)}GHz`);

    // Monitor
    if (specs.screen_size) preview.push(`${specs.screen_size}"`);
    if (specs.resolution) preview.push(specs.resolution);
    if (specs.refresh_rate) preview.push(`${specs.refresh_rate}Hz`);
    if (specs.panel_type) preview.push(specs.panel_type);

    // Mouse
    if (specs.dpi) preview.push(`${specs.dpi.toLocaleString()} DPI`);
    if (specs.weight) preview.push(`${specs.weight}g`);
    if (specs.wireless) preview.push("Wireless");

    // Keyboard
    if (specs.switch_type) preview.push(specs.switch_type);
    if (specs.layout) preview.push(specs.layout);

    // Headset
    if (specs.driver_size) preview.push(`${specs.driver_size}mm Driver`);
    if (specs.battery_life) preview.push(`${specs.battery_life}h Battery`);

    return preview.slice(0, 3);
  };

  const specsPreview = getSpecsPreview();
  const inStockPrices = prices.filter(p => p.in_stock);
  const storeCount = prices.length;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="card-chrome overflow-hidden group cursor-pointer h-full flex flex-col relative"
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-green-500 text-black px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            -{discountPercent}%
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-4 overflow-hidden">
        {hasImage ? (
          <img
            src={product.image_url!}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // Hide broken image
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
            <ImageIcon className="w-8 h-8 text-white/20" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge>{getCategoryLabel(product.category)}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand */}
        <span className="text-xs text-white/40 uppercase tracking-wider mb-1 font-medium">
          {product.brand}
        </span>

        {/* Product Name */}
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-white/90 transition-colors leading-snug text-sm">
          {product.name}
        </h3>

        {/* Specs Preview */}
        {specsPreview.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {specsPreview.map((spec, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-white/50 border border-white/5"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price Section */}
        <div className="pt-3 border-t border-white/5">
          {lowestPrice ? (
            <>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-bold text-white">
                  {formatPrice(lowestPrice.price)}
                </span>
                {originalPrice && originalPrice > lowestPrice.price && (
                  <span className="text-sm text-white/30 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>

              {/* Store info */}
              <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                <div className="flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  <span>{getRetailerLabel(lowestPrice.retailer)}</span>
                  {storeCount > 1 && (
                    <span className="text-white/25">• {storeCount - 1} more</span>
                  )}
                </div>
                {lowestPrice.in_stock ? (
                  <span className="text-green-400/70">In Stock</span>
                ) : (
                  <span className="text-red-400/70">Out of Stock</span>
                )}
              </div>

              {/* Buy Button */}
              <a
                href={lowestPrice.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors text-sm"
              >
                <span>Buy Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          ) : (
            <div className="text-center text-white/30 py-2">
              No prices available
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
