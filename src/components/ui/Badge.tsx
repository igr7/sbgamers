"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-white/70",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface PriceBadgeProps {
  price: number;
  currency?: "SAR" | "AED" | "USD";
  originalPrice?: number;
  className?: string;
}

export function PriceBadge({ price, currency = "SAR", originalPrice, className }: PriceBadgeProps) {
  const symbols: Record<string, string> = {
    SAR: "SAR",
    AED: "AED",
    USD: "$",
  };

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-2xl font-bold text-white">
        {symbols[currency]} {price.toLocaleString()}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-white/40 line-through">
            {symbols[currency]} {originalPrice.toLocaleString()}
          </span>
          <Badge variant="success">-{discountPercent}%</Badge>
        </>
      )}
    </div>
  );
}

interface StockBadgeProps {
  inStock: boolean;
}

export function StockBadge({ inStock }: StockBadgeProps) {
  return (
    <Badge variant={inStock ? "success" : "error"}>
      <span className={cn("w-2 h-2 rounded-full mr-2", inStock ? "bg-green-400" : "bg-red-400")} />
      {inStock ? "In Stock" : "Out of Stock"}
    </Badge>
  );
}
