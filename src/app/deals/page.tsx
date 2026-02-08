"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge, Select } from "@/components/ui";
import { Product, Price } from "@/types";
import { formatPrice, getCategoryLabel } from "@/lib/utils";
import { useState } from "react";
import { TrendingDown, Flame, Clock, Percent } from "lucide-react";

// Demo deals data
const demoDeals: (Product & { prices: Price[]; lowest_price: Price; original_price: number; discount_percent: number })[] = [
  {
    id: "d1", name: "AMD Ryzen 7 7800X3D", brand: "AMD", model: "7800X3D", category: "cpu", image_url: null,
    specs: { cores: 8, threads: 16, socket: "AM5", tdp: 120 },
    created_at: "", updated_at: "",
    prices: [{ id: "p1", product_id: "d1", retailer: "amazon_sa", price: 1499, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
    lowest_price: { id: "p1", product_id: "d1", retailer: "amazon_sa", price: 1499, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    original_price: 1799,
    discount_percent: 17,
  },
  {
    id: "d2", name: "NVIDIA RTX 4070 Ti Super", brand: "NVIDIA", model: "RTX 4070 Ti S", category: "gpu", image_url: null,
    specs: { vram: 16, cuda_cores: 8448, tdp: 285 },
    created_at: "", updated_at: "",
    prices: [{ id: "p2", product_id: "d2", retailer: "newegg", price: 3199, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
    lowest_price: { id: "p2", product_id: "d2", retailer: "newegg", price: 3199, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    original_price: 3699,
    discount_percent: 14,
  },
  {
    id: "d3", name: "Samsung Odyssey G7 32\"", brand: "Samsung", model: "G7 32", category: "monitor", image_url: null,
    specs: { screen_size: 32, resolution: "2560x1440", refresh_rate: 240, panel_type: "VA" },
    created_at: "", updated_at: "",
    prices: [{ id: "p3", product_id: "d3", retailer: "amazon_sa", price: 1899, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
    lowest_price: { id: "p3", product_id: "d3", retailer: "amazon_sa", price: 1899, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    original_price: 2499,
    discount_percent: 24,
  },
  {
    id: "d4", name: "Logitech G Pro X Superlight 2", brand: "Logitech", model: "GPX2", category: "mouse", image_url: null,
    specs: { dpi: 32000, weight: 60, wireless: true },
    created_at: "", updated_at: "",
    prices: [{ id: "p4", product_id: "d4", retailer: "jarir", price: 549, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
    lowest_price: { id: "p4", product_id: "d4", retailer: "jarir", price: 549, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    original_price: 649,
    discount_percent: 15,
  },
  {
    id: "d5", name: "PlayStation 5 Slim", brand: "Sony", model: "PS5 Slim", category: "console", image_url: null,
    specs: { console_storage: 1000, max_resolution: "4K", max_fps: 120 },
    created_at: "", updated_at: "",
    prices: [{ id: "p5", product_id: "d5", retailer: "jarir", price: 1899, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
    lowest_price: { id: "p5", product_id: "d5", retailer: "jarir", price: 1899, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    original_price: 2099,
    discount_percent: 10,
  },
  {
    id: "d6", name: "Corsair K70 RGB Pro", brand: "Corsair", model: "K70 Pro", category: "keyboard", image_url: null,
    specs: { switch_type: "Cherry MX Red", backlight: "RGB", wireless: false },
    created_at: "", updated_at: "",
    prices: [{ id: "p6", product_id: "d6", retailer: "amazon_sa", price: 449, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
    lowest_price: { id: "p6", product_id: "d6", retailer: "amazon_sa", price: 449, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    original_price: 599,
    discount_percent: 25,
  },
];

const sortOptions = [
  { value: "discount", label: "Biggest Discount" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Deals" },
];

export default function DealsPage() {
  const [sortBy, setSortBy] = useState("discount");

  const sortedDeals = [...demoDeals].sort((a, b) => {
    switch (sortBy) {
      case "discount":
        return b.discount_percent - a.discount_percent;
      case "price_asc":
        return a.lowest_price.price - b.lowest_price.price;
      case "price_desc":
        return b.lowest_price.price - a.lowest_price.price;
      default:
        return 0;
    }
  });

  const totalSavings = demoDeals.reduce((sum, deal) => sum + (deal.original_price - deal.lowest_price.price), 0);

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
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-10 h-10 text-orange-500" />
              <h1 className="text-4xl md:text-5xl font-bold">Hot Deals</h1>
            </div>
            <p className="text-white/60 text-lg">
              The best discounts on PC parts and gaming gear across all retailers
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="glass rounded-2xl p-5 text-center">
              <TrendingDown className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">{demoDeals.length}</div>
              <div className="text-white/50 text-sm">Active Deals</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <Percent className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold">25%</div>
              <div className="text-white/50 text-sm">Max Discount</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-white/50 text-sm">Price Monitoring</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <div className="text-2xl font-bold">{formatPrice(totalSavings)}</div>
              <div className="text-white/50 text-sm">Total Savings</div>
            </div>
          </motion.div>

          {/* Sort */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="text-white/50">{sortedDeals.length} deals found</div>
            <div className="w-48">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Sort by"
              />
            </div>
          </motion.div>

          {/* Deals Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 6) }}
              >
                <div className="glass rounded-2xl overflow-hidden group cursor-pointer h-full flex flex-col relative">
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="success" className="text-base px-3 py-1.5">
                      -{deal.discount_percent}%
                    </Badge>
                  </div>

                  {/* Image Placeholder */}
                  <div className="relative aspect-square bg-white/5 flex items-center justify-center p-6">
                    <div className="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center">
                      <span className="text-4xl text-white/30">🔥</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge>{getCategoryLabel(deal.category)}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs text-white/50 uppercase tracking-wider mb-1">
                      {deal.brand}
                    </span>
                    <h3 className="font-semibold text-white mb-4 line-clamp-2">
                      {deal.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-auto pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-green-400">
                          {formatPrice(deal.lowest_price.price, deal.lowest_price.currency)}
                        </span>
                        <span className="text-white/40 line-through">
                          {formatPrice(deal.original_price, deal.lowest_price.currency)}
                        </span>
                      </div>
                      <div className="text-sm text-white/50">
                        Save {formatPrice(deal.original_price - deal.lowest_price.price, deal.lowest_price.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 glass-strong rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Never Miss a Deal</h2>
            <p className="text-white/60 mb-6 max-w-xl mx-auto">
              Get notified when prices drop on your favorite products. Set up price alerts and we&apos;ll email you instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 glass rounded-xl px-4 py-3 bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
