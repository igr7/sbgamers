"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchInput, Select, Badge } from "@/components/ui";
import { CATEGORY_GROUPS, Category, Product, Price } from "@/types";
import { getCategoryLabel } from "@/lib/utils";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";

// Demo products for UI display (will be replaced with Supabase data)
const demoProducts: (Product & { prices: Price[]; lowest_price: Price | null })[] = [
  {
    id: "1",
    name: "AMD Ryzen 9 7950X 16-Core Processor",
    brand: "AMD",
    model: "7950X",
    category: "cpu",
    image_url: null,
    specs: { cores: 16, threads: 32, base_clock: 4500, boost_clock: 5700, socket: "AM5", tdp: 170 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { id: "p1", product_id: "1", retailer: "amazon_sa", price: 2299, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
      { id: "p2", product_id: "1", retailer: "jarir", price: 2399, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
    ],
    lowest_price: { id: "p1", product_id: "1", retailer: "amazon_sa", price: 2299, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
  },
  {
    id: "2",
    name: "NVIDIA GeForce RTX 4090 Founders Edition",
    brand: "NVIDIA",
    model: "RTX 4090",
    category: "gpu",
    image_url: null,
    specs: { vram: 24, vram_type: "GDDR6X", cuda_cores: 16384, tdp: 450, length_mm: 336 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { id: "p3", product_id: "2", retailer: "amazon_sa", price: 7499, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
      { id: "p4", product_id: "2", retailer: "newegg", price: 7299, currency: "SAR", url: "#", in_stock: false, last_checked: new Date().toISOString() },
    ],
    lowest_price: { id: "p3", product_id: "2", retailer: "amazon_sa", price: 7499, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
  },
  {
    id: "3",
    name: "Samsung Odyssey G9 49\" Curved Gaming Monitor",
    brand: "Samsung",
    model: "Odyssey G9",
    category: "monitor",
    image_url: null,
    specs: { screen_size: 49, resolution: "5120x1440", refresh_rate: 240, panel_type: "VA", curved: true, response_time: 1 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { id: "p5", product_id: "3", retailer: "amazon_sa", price: 4999, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
    ],
    lowest_price: { id: "p5", product_id: "3", retailer: "amazon_sa", price: 4999, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
  },
  {
    id: "4",
    name: "PlayStation 5 Console",
    brand: "Sony",
    model: "PS5",
    category: "console",
    image_url: null,
    specs: { console_generation: "9th", console_storage: 825, max_resolution: "4K", max_fps: 120 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { id: "p6", product_id: "4", retailer: "jarir", price: 2099, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
      { id: "p7", product_id: "4", retailer: "amazon_sa", price: 2199, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
    ],
    lowest_price: { id: "p6", product_id: "4", retailer: "jarir", price: 2099, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
  },
  {
    id: "5",
    name: "Logitech G Pro X Superlight Wireless Mouse",
    brand: "Logitech",
    model: "G Pro X Superlight",
    category: "mouse",
    image_url: null,
    specs: { dpi: 25600, sensor: "HERO 25K", weight: 63, wireless: true, polling_rate: 1000 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { id: "p8", product_id: "5", retailer: "amazon_sa", price: 549, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
    ],
    lowest_price: { id: "p8", product_id: "5", retailer: "amazon_sa", price: 549, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
  },
  {
    id: "6",
    name: "SteelSeries Arctis Nova Pro Wireless Headset",
    brand: "SteelSeries",
    model: "Arctis Nova Pro",
    category: "headset",
    image_url: null,
    specs: { driver_size: 40, wireless: true, noise_cancelling: true, battery_life: 44, microphone: true },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { id: "p9", product_id: "6", retailer: "amazon_sa", price: 1399, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
    ],
    lowest_price: { id: "p9", product_id: "6", retailer: "amazon_sa", price: 1399, currency: "SAR", url: "#", in_stock: true, last_checked: new Date().toISOString() },
  },
];

const sortOptions = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
  { value: "newest", label: "Newest First" },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [sortBy, setSortBy] = useState("price_asc");
  const [showFilters, setShowFilters] = useState(false);

  // Filter products
  const filteredProducts = demoProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return (a.lowest_price?.price || 0) - (b.lowest_price?.price || 0);
      case "price_desc":
        return (b.lowest_price?.price || 0) - (a.lowest_price?.price || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Get all categories as flat array
  const allCategories = Object.values(CATEGORY_GROUPS).flat();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-grid opacity-30" />
      <Header />

      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Products</h1>
            <p className="text-white/60 text-lg">
              Browse thousands of PC parts, peripherals, and gaming gear with real-time prices
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <SearchInput
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Sort */}
              <div className="w-full lg:w-48">
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort by"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 glass rounded-xl hover:bg-white/10 transition-colors lg:hidden"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Category Filters */}
            <div className={`mt-6 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                    selectedCategory === "all"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  All
                </button>
                {Object.entries(CATEGORY_GROUPS).map(([group, categories]) => (
                  <div key={group} className="flex flex-wrap gap-2">
                    <span className="hidden lg:flex items-center text-white/30 text-sm px-2">|</span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat as Category)}
                        className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                          selectedCategory === cat
                            ? "bg-white text-black"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        {getCategoryLabel(cat)}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-6 text-white/50">
            Showing {sortedProducts.length} products
          </div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 8) }}
              >
                <ProductCard
                  product={product}
                  lowestPrice={product.lowest_price}
                  prices={product.prices}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-white/50">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
