"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button, Badge, StockBadge } from "@/components/ui";
import { Product, Price, PriceHistory } from "@/types";
import { formatPrice, getCategoryLabel, getRetailerLabel, formatDate } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  ExternalLink, Bell, TrendingDown, TrendingUp, Share2, ArrowLeft, ShoppingCart
} from "lucide-react";
import Link from "next/link";

// Demo product data
const demoProduct: Product & { prices: Price[]; price_history: PriceHistory[] } = {
  id: "1",
  name: "AMD Ryzen 9 7950X 16-Core Processor",
  brand: "AMD",
  model: "7950X",
  category: "cpu",
  image_url: null,
  specs: {
    cores: 16,
    threads: 32,
    base_clock: 4500,
    boost_clock: 5700,
    socket: "AM5",
    tdp: 170,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  prices: [
    { id: "p1", product_id: "1", retailer: "amazon_sa", price: 2299, currency: "SAR", url: "https://amazon.sa", in_stock: true, last_checked: new Date().toISOString() },
    { id: "p2", product_id: "1", retailer: "jarir", price: 2399, currency: "SAR", url: "https://jarir.com", in_stock: true, last_checked: new Date().toISOString() },
    { id: "p3", product_id: "1", retailer: "newegg", price: 2199, currency: "SAR", url: "https://newegg.com", in_stock: false, last_checked: new Date().toISOString() },
    { id: "p4", product_id: "1", retailer: "amazon_ae", price: 2350, currency: "SAR", url: "https://amazon.ae", in_stock: true, last_checked: new Date().toISOString() },
  ],
  price_history: [
    { id: "h1", product_id: "1", retailer: "amazon_sa", price: 2599, currency: "SAR", recorded_at: "2024-01-01" },
    { id: "h2", product_id: "1", retailer: "amazon_sa", price: 2549, currency: "SAR", recorded_at: "2024-01-15" },
    { id: "h3", product_id: "1", retailer: "amazon_sa", price: 2499, currency: "SAR", recorded_at: "2024-02-01" },
    { id: "h4", product_id: "1", retailer: "amazon_sa", price: 2449, currency: "SAR", recorded_at: "2024-02-15" },
    { id: "h5", product_id: "1", retailer: "amazon_sa", price: 2399, currency: "SAR", recorded_at: "2024-03-01" },
    { id: "h6", product_id: "1", retailer: "amazon_sa", price: 2349, currency: "SAR", recorded_at: "2024-03-15" },
    { id: "h7", product_id: "1", retailer: "amazon_sa", price: 2299, currency: "SAR", recorded_at: "2024-04-01" },
  ],
};

const specLabels: Record<string, string> = {
  cores: "CPU Cores",
  threads: "Threads",
  base_clock: "Base Clock",
  boost_clock: "Boost Clock",
  socket: "Socket",
  tdp: "TDP",
  vram: "VRAM",
  vram_type: "VRAM Type",
  cuda_cores: "CUDA Cores",
  length_mm: "Card Length",
  screen_size: "Screen Size",
  resolution: "Resolution",
  refresh_rate: "Refresh Rate",
  panel_type: "Panel Type",
  response_time: "Response Time",
  capacity: "Capacity",
  speed: "Speed",
  memory_type: "Memory Type",
  storage_capacity: "Storage",
  storage_type: "Type",
  read_speed: "Read Speed",
  write_speed: "Write Speed",
  wattage: "Wattage",
  efficiency: "Efficiency",
};

const specUnits: Record<string, string> = {
  base_clock: "MHz",
  boost_clock: "MHz",
  tdp: "W",
  vram: "GB",
  length_mm: "mm",
  screen_size: '"',
  refresh_rate: "Hz",
  response_time: "ms",
  capacity: "GB",
  speed: "MHz",
  storage_capacity: "GB",
  read_speed: "MB/s",
  write_speed: "MB/s",
  wattage: "W",
};

export default function ProductDetailPage() {
  const params = useParams();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");

  // In production, fetch product by params.slug
  const product = demoProduct;

  const lowestPrice = product.prices
    .filter((p) => p.in_stock)
    .sort((a, b) => a.price - b.price)[0];

  const highestPrice = product.prices
    .filter((p) => p.in_stock)
    .sort((a, b) => b.price - a.price)[0];

  const priceRange = lowestPrice && highestPrice
    ? highestPrice.price - lowestPrice.price
    : 0;

  // Chart data
  const chartData = product.price_history.map((h) => ({
    date: formatDate(h.recorded_at),
    price: h.price,
  }));

  const allTimeLow = Math.min(...product.price_history.map((h) => h.price));
  const allTimeHigh = Math.max(...product.price_history.map((h) => h.price));

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-grid opacity-30" />
      <Header />

      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link href="/products" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Image & Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Product Image */}
              <div className="glass rounded-3xl aspect-square flex items-center justify-center mb-6">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain p-8" />
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-white/10 flex items-center justify-center">
                    <span className="text-8xl text-white/20">🖥️</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <TrendingDown className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <div className="text-sm text-white/50">All-Time Low</div>
                  <div className="font-bold">{formatPrice(allTimeLow)}</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-red-400" />
                  <div className="text-sm text-white/50">All-Time High</div>
                  <div className="font-bold">{formatPrice(allTimeHigh)}</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-sm text-white/50">Retailers</div>
                  <div className="font-bold">{product.prices.length}</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Category & Brand */}
              <div className="flex items-center gap-3 mb-4">
                <Badge>{getCategoryLabel(product.category)}</Badge>
                <span className="text-white/50">{product.brand}</span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6">{product.name}</h1>

              {/* Price Summary */}
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-white/50 mb-1">Best Price</div>
                    <div className="text-4xl font-bold text-green-400">
                      {lowestPrice ? formatPrice(lowestPrice.price, lowestPrice.currency) : "N/A"}
                    </div>
                    {lowestPrice && (
                      <div className="text-sm text-white/50 mt-1">
                        at {getRetailerLabel(lowestPrice.retailer)}
                      </div>
                    )}
                  </div>
                  {priceRange > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-white/50 mb-1">Price Range</div>
                      <div className="text-xl font-semibold text-white/70">
                        {formatPrice(priceRange)} spread
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {lowestPrice && (
                    <Button variant="primary" size="lg" className="flex-1">
                      <ExternalLink className="w-4 h-4" />
                      Buy Now
                    </Button>
                  )}
                  <Button variant="secondary" size="lg" onClick={() => setShowAlertModal(true)}>
                    <Bell className="w-4 h-4" />
                    Set Alert
                  </Button>
                  <Button variant="ghost" size="lg">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* All Prices */}
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">All Prices</h3>
                <div className="space-y-3">
                  {product.prices
                    .sort((a, b) => a.price - b.price)
                    .map((price) => (
                      <div
                        key={price.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold">
                            {price.retailer.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{getRetailerLabel(price.retailer)}</div>
                            <StockBadge inStock={price.in_stock} />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xl font-bold ${price.id === lowestPrice?.id ? "text-green-400" : ""}`}>
                            {formatPrice(price.price, price.currency)}
                          </span>
                          <a
                            href={price.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => {
                    if (value === undefined || value === null) return null;
                    const unit = specUnits[key] || "";
                    return (
                      <div key={key} className="flex justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-white/60">{specLabels[key] || key}</span>
                        <span className="font-medium">
                          {typeof value === "boolean" ? (value ? "Yes" : "No") : `${value}${unit}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Price History Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 glass rounded-3xl p-8"
          >
            <h3 className="text-xl font-semibold mb-6">Price History</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                    labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                    formatter={(value) => [formatPrice(value as number), "Price"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#22c55e" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Alert Modal */}
      {showAlertModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowAlertModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-strong rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-2">Set Price Alert</h3>
            <p className="text-white/60 mb-6">
              Get notified when the price drops for {product.name}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Your Email</label>
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full glass rounded-xl px-4 py-3 bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Alert Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="glass rounded-xl p-3 text-center hover:bg-white/10 transition-colors border-2 border-white/20">
                    <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Any Drop</span>
                  </button>
                  <button className="glass rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                    <Bell className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Target Price</span>
                  </button>
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full">
                Create Alert
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </main>
  );
}
