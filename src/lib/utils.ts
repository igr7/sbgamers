import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Retailer } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: "SAR" | "AED" | "USD" = "SAR"): string {
  const symbols: Record<string, string> = {
    SAR: "SAR",
    AED: "AED",
    USD: "$",
  };
  return `${symbols[currency]} ${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPriceCompact(price: number): string {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(1)}K`;
  }
  return price.toString();
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    // PC Components
    cpu: "CPU",
    gpu: "GPU",
    motherboard: "Motherboard",
    ram: "RAM",
    storage: "Storage",
    psu: "PSU",
    case: "Case",
    cooler: "Cooler",
    // Displays
    monitor: "Monitor",
    tv: "TV",
    // Peripherals
    keyboard: "Keyboard",
    mouse: "Mouse",
    headset: "Headset",
    mousepad: "Mousepad",
    webcam: "Webcam",
    microphone: "Mic",
    controller: "Controller",
    // Gaming Consoles
    console: "Console",
    console_accessory: "Accessory",
    // Gaming Systems
    gaming_laptop: "Gaming Laptop",
    gaming_pc: "Gaming PC",
    // Furniture & VR
    gaming_chair: "Gaming Chair",
    vr_headset: "VR Headset",
  };
  return labels[category] || category;
}

export function getRetailerLabel(retailer: string): string {
  const labels: Record<string, string> = {
    amazon_sa: "Amazon SA",
    amazon_ae: "Amazon AE",
    newegg: "Newegg",
    jarir: "Jarir",
    extra: "Extra",
    pcd: "PCD",
    infiniarc: "Infiniarc",
  };
  return labels[retailer] || retailer;
}

export function getRetailerUrl(retailer: Retailer): string {
  const urls: Record<Retailer, string> = {
    amazon_sa: "https://amazon.sa",
    amazon_ae: "https://amazon.ae",
    newegg: "https://newegg.com",
    jarir: "https://jarir.com",
    extra: "https://extra.com",
    pcd: "https://pcd.com.sa",
    infiniarc: "https://infiniarc.com",
  };
  return urls[retailer];
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function calculateTotalWattage(specs: {
  cpu_tdp?: number;
  gpu_tdp?: number;
}): number {
  const basePower = 100; // Base system power (motherboard, RAM, storage, fans)
  const cpuPower = specs.cpu_tdp || 0;
  const gpuPower = specs.gpu_tdp || 0;
  return basePower + cpuPower + gpuPower;
}

export function getRecommendedPSU(totalWattage: number): number {
  // Recommend PSU with 20% headroom
  const recommended = totalWattage * 1.2;
  // Round up to nearest 50W
  return Math.ceil(recommended / 50) * 50;
}

// Get lowest price from array of prices
export function getLowestPrice(prices: { price: number; in_stock: boolean }[]): number | null {
  const inStockPrices = prices.filter(p => p.in_stock);
  if (inStockPrices.length === 0) {
    // If nothing in stock, show lowest price anyway
    if (prices.length === 0) return null;
    return Math.min(...prices.map(p => p.price));
  }
  return Math.min(...inStockPrices.map(p => p.price));
}

// Check if any retailer has stock
export function hasStock(prices: { in_stock: boolean }[]): boolean {
  return prices.some(p => p.in_stock);
}
