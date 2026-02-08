import { NextRequest, NextResponse } from "next/server";
import { productQueries, isDatabaseConfigured } from "@/lib/db";
import { ProductFilters } from "@/types";

// Demo data for when database is not configured
const demoProducts = [
  {
    id: "1", name: "AMD Ryzen 9 7950X", brand: "AMD", model: "7950X", category: "cpu",
    image_url: null, specs: { cores: 16, threads: 32, socket: "AM5", tdp: 170 },
    prices: [{ retailer: "amazon_sa", price: 2299, currency: "SAR", in_stock: true }],
  },
  {
    id: "2", name: "NVIDIA RTX 4090", brand: "NVIDIA", model: "RTX 4090", category: "gpu",
    image_url: null, specs: { vram: 24, cuda_cores: 16384, tdp: 450 },
    prices: [{ retailer: "amazon_sa", price: 7499, currency: "SAR", in_stock: true }],
  },
  {
    id: "3", name: "Samsung Odyssey G9", brand: "Samsung", model: "G9", category: "monitor",
    image_url: null, specs: { screen_size: 49, refresh_rate: 240, resolution: "5120x1440" },
    prices: [{ retailer: "jarir", price: 4999, currency: "SAR", in_stock: true }],
  },
  {
    id: "4", name: "PlayStation 5", brand: "Sony", model: "PS5", category: "console",
    image_url: null, specs: { console_storage: 825, max_resolution: "4K" },
    prices: [{ retailer: "jarir", price: 2099, currency: "SAR", in_stock: true }],
  },
  {
    id: "5", name: "Logitech G Pro X Superlight", brand: "Logitech", model: "GPX", category: "mouse",
    image_url: null, specs: { dpi: 25600, weight: 63, wireless: true },
    prices: [{ retailer: "amazon_sa", price: 549, currency: "SAR", in_stock: true }],
  },
  {
    id: "6", name: "SteelSeries Arctis Nova Pro", brand: "SteelSeries", model: "Nova Pro", category: "headset",
    image_url: null, specs: { driver_size: 40, wireless: true, noise_cancelling: true },
    prices: [{ retailer: "amazon_sa", price: 1399, currency: "SAR", in_stock: true }],
  },
];

function filterDemoProducts(filters: ProductFilters) {
  let filtered = [...demoProducts];

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search)
    );
  }

  return filtered;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters: ProductFilters = {
    category: searchParams.get("category") as ProductFilters["category"] || undefined,
    brand: searchParams.get("brand") || undefined,
    min_price: searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined,
    max_price: searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined,
    in_stock: searchParams.get("in_stock") === "true" ? true : undefined,
    search: searchParams.get("search") || undefined,
    sort_by: searchParams.get("sort_by") as ProductFilters["sort_by"] || undefined,
  };

  // Return demo data if database is not configured
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ data: filterDemoProducts(filters), source: "demo" });
  }

  try {
    const result = await productQueries.getAll({
      category: filters.category,
      brand: filters.brand,
      search: filters.search,
    });

    // If database query failed, fall back to demo data
    if (!result) {
      return NextResponse.json({ data: filterDemoProducts(filters), source: "demo" });
    }

    return NextResponse.json({ data: result.rows, source: "database" });
  } catch (error) {
    console.error("Database error:", error);
    // Fall back to demo data on error
    return NextResponse.json({ data: filterDemoProducts(filters), source: "demo" });
  }
}
