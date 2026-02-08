import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: "SAR" | "AED" | "USD" = "SAR"): string {
  const symbols: Record<string, string> = {
    SAR: "SAR",
    AED: "AED",
    USD: "$",
  };
  return `${symbols[currency]} ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
    cpu: "Processor (CPU)",
    gpu: "Graphics Card (GPU)",
    motherboard: "Motherboard",
    ram: "Memory (RAM)",
    storage: "Storage",
    psu: "Power Supply (PSU)",
    case: "Case",
    cooler: "CPU Cooler",
    // Displays
    monitor: "Monitor",
    tv: "TV",
    // Peripherals
    keyboard: "Keyboard",
    mouse: "Mouse",
    headset: "Headset",
    mousepad: "Mousepad",
    webcam: "Webcam",
    microphone: "Microphone",
    controller: "Controller",
    // Gaming Consoles
    console: "Gaming Console",
    console_accessory: "Console Accessory",
  };
  return labels[category] || category;
}

export function getRetailerLabel(retailer: string): string {
  const labels: Record<string, string> = {
    amazon_sa: "Amazon SA",
    amazon_ae: "Amazon AE",
    newegg: "Newegg",
    jarir: "Jarir",
    softland: "Softland",
  };
  return labels[retailer] || retailer;
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
