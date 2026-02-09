"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button, Badge } from "@/components/ui";
import { Product, Price, Category, Retailer } from "@/types";
import { formatPrice, getCategoryLabel, getRetailerLabel } from "@/lib/utils";
import {
  Plus,
  X,
  Check,
  ExternalLink,
  Package,
  Store,
  Search,
  ArrowRight,
  Sparkles
} from "lucide-react";

// Demo products for comparison
const demoProducts: (Product & { prices: Price[] })[] = [
  // CPUs
  {
    id: "1", name: "AMD Ryzen 9 7950X3D", brand: "AMD", model: "7950X3D", category: "cpu", image_url: null,
    specs: { cores: 16, threads: 32, base_clock: 4200, boost_clock: 5700, socket: "AM5", tdp: 120 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p1", product_id: "1", retailer: "amazon_sa", price: 2699, currency: "SAR", url: "https://amazon.sa/1", in_stock: true, last_checked: "" },
      { id: "p2", product_id: "1", retailer: "newegg", price: 2599, currency: "SAR", url: "https://newegg.com/1", in_stock: true, last_checked: "" },
      { id: "p3", product_id: "1", retailer: "jarir", price: 2799, currency: "SAR", url: "#", in_stock: false, last_checked: "" },
    ],
  },
  {
    id: "2", name: "Intel Core i9-14900K", brand: "Intel", model: "i9-14900K", category: "cpu", image_url: null,
    specs: { cores: 24, threads: 32, base_clock: 3200, boost_clock: 6000, socket: "LGA1700", tdp: 253 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p4", product_id: "2", retailer: "amazon_sa", price: 2499, currency: "SAR", url: "https://amazon.sa/2", in_stock: true, last_checked: "" },
      { id: "p5", product_id: "2", retailer: "pcd", price: 2399, currency: "SAR", url: "https://pcd.com/2", in_stock: true, last_checked: "" },
    ],
  },
  {
    id: "3", name: "AMD Ryzen 7 7800X3D", brand: "AMD", model: "7800X3D", category: "cpu", image_url: null,
    specs: { cores: 8, threads: 16, base_clock: 4200, boost_clock: 5000, socket: "AM5", tdp: 120 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p6", product_id: "3", retailer: "amazon_sa", price: 1799, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
      { id: "p7", product_id: "3", retailer: "jarir", price: 1899, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    ],
  },
  // GPUs
  {
    id: "4", name: "NVIDIA RTX 4090", brand: "NVIDIA", model: "RTX 4090", category: "gpu", image_url: null,
    specs: { vram: 24, vram_type: "GDDR6X", cuda_cores: 16384, tdp: 450, length_mm: 336 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p8", product_id: "4", retailer: "amazon_sa", price: 7999, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
      { id: "p9", product_id: "4", retailer: "newegg", price: 7499, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
      { id: "p10", product_id: "4", retailer: "pcd", price: 7699, currency: "SAR", url: "#", in_stock: false, last_checked: "" },
    ],
  },
  {
    id: "5", name: "NVIDIA RTX 4080 Super", brand: "NVIDIA", model: "RTX 4080S", category: "gpu", image_url: null,
    specs: { vram: 16, vram_type: "GDDR6X", cuda_cores: 10240, tdp: 320, length_mm: 304 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p11", product_id: "5", retailer: "amazon_sa", price: 4699, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
      { id: "p12", product_id: "5", retailer: "infiniarc", price: 4499, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    ],
  },
  {
    id: "6", name: "AMD RX 7900 XTX", brand: "AMD", model: "RX 7900 XTX", category: "gpu", image_url: null,
    specs: { vram: 24, vram_type: "GDDR6", cuda_cores: 6144, tdp: 355, length_mm: 287 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p13", product_id: "6", retailer: "amazon_sa", price: 4299, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
      { id: "p14", product_id: "6", retailer: "newegg", price: 4199, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    ],
  },
  // Mice
  {
    id: "7", name: "Logitech G Pro X Superlight 2", brand: "Logitech", model: "GPX2", category: "mouse", image_url: null,
    specs: { dpi: 32000, weight: 60, wireless: true, polling_rate: 2000 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p15", product_id: "7", retailer: "amazon_sa", price: 649, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
      { id: "p16", product_id: "7", retailer: "jarir", price: 699, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    ],
  },
  {
    id: "8", name: "Razer DeathAdder V3 Pro", brand: "Razer", model: "DAV3 Pro", category: "mouse", image_url: null,
    specs: { dpi: 30000, weight: 63, wireless: true, polling_rate: 4000 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p17", product_id: "8", retailer: "newegg", price: 579, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    ],
  },
  // Monitors
  {
    id: "9", name: "Samsung Odyssey G9 49\"", brand: "Samsung", model: "G9 49", category: "monitor", image_url: null,
    specs: { screen_size: 49, resolution: "5120x1440", refresh_rate: 240, panel_type: "VA", curved: true, response_time: 1 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p18", product_id: "9", retailer: "amazon_sa", price: 4999, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    ],
  },
  {
    id: "10", name: "ASUS ROG Swift OLED PG27AQDM", brand: "ASUS", model: "PG27AQDM", category: "monitor", image_url: null,
    specs: { screen_size: 27, resolution: "2560x1440", refresh_rate: 240, panel_type: "OLED", response_time: 0.03 },
    created_at: "", updated_at: "",
    prices: [
      { id: "p19", product_id: "10", retailer: "newegg", price: 3699, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
      { id: "p20", product_id: "10", retailer: "pcd", price: 3799, currency: "SAR", url: "#", in_stock: true, last_checked: "" },
    ],
  },
];

const specLabels: Record<string, string> = {
  // CPU
  cores: "Cores",
  threads: "Threads",
  base_clock: "Base Clock (MHz)",
  boost_clock: "Boost Clock (MHz)",
  socket: "Socket",
  tdp: "TDP (W)",
  // GPU
  vram: "VRAM (GB)",
  vram_type: "VRAM Type",
  cuda_cores: "Stream Processors",
  length_mm: "Length (mm)",
  // Monitor
  screen_size: "Screen Size",
  resolution: "Resolution",
  refresh_rate: "Refresh Rate (Hz)",
  panel_type: "Panel Type",
  response_time: "Response Time (ms)",
  curved: "Curved",
  // Mouse
  dpi: "DPI",
  weight: "Weight (g)",
  wireless: "Wireless",
  polling_rate: "Polling Rate (Hz)",
  // Common
  sensor: "Sensor",
};

// Arabic translations
const specLabelsAr: Record<string, string> = {
  cores: "الأنوية",
  threads: "الخيوط",
  base_clock: "التردد الأساسي",
  boost_clock: "التردد المعزز",
  socket: "المقبس",
  tdp: "استهلاك الطاقة",
  vram: "ذاكرة الفيديو",
  vram_type: "نوع الذاكرة",
  cuda_cores: "وحدات المعالجة",
  length_mm: "الطول",
  screen_size: "حجم الشاشة",
  resolution: "الدقة",
  refresh_rate: "معدل التحديث",
  panel_type: "نوع اللوحة",
  response_time: "وقت الاستجابة",
  curved: "منحنية",
  dpi: "الحساسية",
  weight: "الوزن",
  wireless: "لاسلكي",
  polling_rate: "معدل الاستجابة",
};

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<(Product & { prices: Price[] })[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const addProduct = (product: Product & { prices: Price[] }) => {
    if (selectedProducts.length < 4 && !selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setShowSelector(false);
    setSearchQuery("");
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const clearAll = () => {
    setSelectedProducts([]);
  };

  // Get all unique specs from selected products
  const allSpecs = useMemo(() => {
    return selectedProducts.reduce((specs, product) => {
      Object.keys(product.specs).forEach((key) => {
        if (!specs.includes(key) && specLabels[key]) specs.push(key);
      });
      return specs;
    }, [] as string[]);
  }, [selectedProducts]);

  // Filter available products
  const availableProducts = useMemo(() => {
    return demoProducts.filter((p) => {
      if (filterCategory !== "all" && p.category !== filterCategory) return false;
      if (selectedProducts.find((sp) => sp.id === p.id)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);
      }
      return true;
    });
  }, [filterCategory, selectedProducts, searchQuery]);

  // Get best value for each spec
  const getBestValue = (spec: string): string | null => {
    if (selectedProducts.length < 2) return null;

    const values = selectedProducts
      .map((p) => ({ id: p.id, value: p.specs[spec as keyof typeof p.specs] }))
      .filter((v) => v.value !== undefined);

    if (values.length < 2) return null;

    const lowerIsBetter = ["tdp", "length_mm", "response_time", "weight"];
    const numericValues = values.filter((v) => typeof v.value === "number");

    if (numericValues.length > 0) {
      const sorted = [...numericValues].sort((a, b) => {
        const aVal = a.value as number;
        const bVal = b.value as number;
        return lowerIsBetter.includes(spec) ? aVal - bVal : bVal - aVal;
      });
      return sorted[0].id;
    }

    return null;
  };

  // Get lowest price product
  const getLowestPriceProduct = (): string | null => {
    if (selectedProducts.length < 2) return null;
    const sorted = [...selectedProducts].sort((a, b) => {
      const aPrice = Math.min(...a.prices.filter(p => p.in_stock).map(p => p.price)) || Infinity;
      const bPrice = Math.min(...b.prices.filter(p => p.in_stock).map(p => p.price)) || Infinity;
      return aPrice - bPrice;
    });
    return sorted[0].id;
  };

  const lowestPriceId = getLowestPriceProduct();

  // Get lowest price for a product
  const getLowestPrice = (product: Product & { prices: Price[] }) => {
    const inStockPrices = product.prices.filter(p => p.in_stock);
    if (inStockPrices.length === 0) return product.prices[0];
    return inStockPrices.reduce((min, p) => p.price < min.price ? p : min, inStockPrices[0]);
  };

  const retailers: Retailer[] = ["amazon_sa", "jarir", "extra", "newegg", "pcd", "infiniarc"];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="chrome-waves">
        <div className="chrome-wave chrome-wave-1" style={{ opacity: 0.3 }} />
        <div className="chrome-wave chrome-wave-2" style={{ opacity: 0.2 }} />
      </div>
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />

      <Header />

      <div className="relative pt-28 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text-static">Compare Products</span>
            </h1>
            <p className="text-white/50 text-lg">
              Compare prices and specs (مواصفات) side by side • Up to 4 products
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-chrome rounded-2xl overflow-hidden"
          >
            {/* Product Headers */}
            <div className="grid grid-cols-5 border-b border-white/5">
              <div className="p-5 bg-white/[0.02]">
                <span className="text-white/40 text-sm">المواصفات / Specs</span>
              </div>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="p-5 border-l border-white/5">
                  {selectedProducts[index] ? (
                    <div className="relative">
                      <button
                        onClick={() => removeProduct(selectedProducts[index].id)}
                        className="absolute -top-1 -right-1 p-1.5 bg-white/10 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                        {selectedProducts[index].brand}
                      </div>
                      <div className="font-semibold mb-2 pr-6 line-clamp-2 text-sm">
                        {selectedProducts[index].name}
                      </div>
                      <Badge>{getCategoryLabel(selectedProducts[index].category)}</Badge>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSelector(true)}
                      className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 hover:bg-white/5 rounded-xl transition-all border border-dashed border-white/10 hover:border-white/20"
                    >
                      <Plus className="w-7 h-7" />
                      <span className="text-sm">Add Product</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Price Row */}
            {selectedProducts.length > 0 && (
              <div className="grid grid-cols-5 border-b border-white/5">
                <div className="p-5 bg-white/[0.02] font-medium text-white/60">
                  السعر / Price
                </div>
                {[0, 1, 2, 3].map((index) => {
                  const product = selectedProducts[index];
                  if (!product) return <div key={index} className="p-5 border-l border-white/5" />;

                  const lowestPrice = getLowestPrice(product);
                  const isBest = lowestPriceId === product.id;

                  return (
                    <div key={index} className="p-5 border-l border-white/5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xl font-bold ${isBest ? "text-green-400" : ""}`}>
                          {formatPrice(lowestPrice.price, lowestPrice.currency)}
                        </span>
                        {isBest && selectedProducts.length > 1 && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Best
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-white/40">
                        <Store className="w-3.5 h-3.5" />
                        <span>{getRetailerLabel(lowestPrice.retailer)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Store Availability Row */}
            {selectedProducts.length > 0 && (
              <div className="grid grid-cols-5 border-b border-white/5">
                <div className="p-5 bg-white/[0.02] font-medium text-white/60">
                  المتاجر / Stores
                </div>
                {[0, 1, 2, 3].map((index) => {
                  const product = selectedProducts[index];
                  if (!product) return <div key={index} className="p-5 border-l border-white/5" />;

                  return (
                    <div key={index} className="p-5 border-l border-white/5">
                      <div className="space-y-2">
                        {product.prices.map((price) => (
                          <div key={price.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Package className={`w-3.5 h-3.5 ${price.in_stock ? 'text-green-400' : 'text-red-400'}`} />
                              <span className="text-white/60">{getRetailerLabel(price.retailer)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={price.in_stock ? 'text-white' : 'text-white/40'}>
                                {formatPrice(price.price)}
                              </span>
                              <a
                                href={price.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 text-white/40" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Spec Rows */}
            {allSpecs.map((spec) => {
              const bestId = getBestValue(spec);
              return (
                <div key={spec} className="grid grid-cols-5 border-b border-white/5 last:border-b-0">
                  <div className="p-5 bg-white/[0.02] text-white/60">
                    <div className="text-sm">{specLabels[spec] || spec}</div>
                    {specLabelsAr[spec] && (
                      <div className="text-xs text-white/30 mt-0.5">{specLabelsAr[spec]}</div>
                    )}
                  </div>
                  {[0, 1, 2, 3].map((index) => {
                    const product = selectedProducts[index];
                    const value = product?.specs[spec as keyof typeof product.specs];
                    const isBest = bestId === product?.id;

                    return (
                      <div key={index} className="p-5 border-l border-white/5">
                        {product && value !== undefined && (
                          <div className="flex items-center gap-2">
                            <span className={isBest ? "text-green-400 font-medium" : ""}>
                              {typeof value === "boolean" ? (value ? "✓ Yes" : "✗ No") : String(value)}
                            </span>
                            {isBest && <Check className="w-4 h-4 text-green-400" />}
                          </div>
                        )}
                        {product && value === undefined && (
                          <span className="text-white/20">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Empty State */}
            {selectedProducts.length === 0 && (
              <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">⚖️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">No products to compare</h3>
                <p className="text-white/40 mb-8 max-w-md mx-auto">
                  Add products to compare their specs and prices across different stores
                </p>
                <Button variant="primary" onClick={() => setShowSelector(true)}>
                  <Plus className="w-4 h-4" />
                  Add Products
                </Button>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex justify-end gap-4"
            >
              <Button variant="ghost" onClick={clearAll}>
                Clear All
              </Button>
              <Button variant="secondary" onClick={() => setShowSelector(true)} disabled={selectedProducts.length >= 4}>
                <Plus className="w-4 h-4" />
                Add Another
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Product Selector Modal */}
      {showSelector && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSelector(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-chrome rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Select Product to Compare</h3>
              <button
                onClick={() => setShowSelector(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {(["all", "cpu", "gpu", "monitor", "mouse", "keyboard", "headset"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm transition-colors ${filterCategory === cat
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {cat === "all" ? "All" : getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            {/* Product List */}
            <div className="space-y-2 overflow-y-auto flex-1 pr-2">
              {availableProducts.map((product) => {
                const lowestPrice = getLowestPrice(product);
                return (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="w-full glass rounded-xl p-4 text-left hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-medium truncate">{product.name}</span>
                          <Badge>{getCategoryLabel(product.category)}</Badge>
                        </div>
                        <div className="text-sm text-white/40">{product.brand}</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-semibold">
                          {formatPrice(lowestPrice.price, lowestPrice.currency)}
                        </div>
                        <div className="text-xs text-white/40">
                          {product.prices.filter(p => p.in_stock).length} stores
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {availableProducts.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  {searchQuery ? "No products match your search" : "No more products available in this category"}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </main>
  );
}
