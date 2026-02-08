"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button, Badge, Select } from "@/components/ui";
import { Product, Price, Category } from "@/types";
import { formatPrice, getCategoryLabel } from "@/lib/utils";
import { Plus, X, Check, Minus, ArrowRight } from "lucide-react";

// Demo products for comparison
const demoProducts: (Product & { prices: Price[] })[] = [
  {
    id: "1", name: "AMD Ryzen 9 7950X", brand: "AMD", model: "7950X", category: "cpu", image_url: null,
    specs: { cores: 16, threads: 32, base_clock: 4500, boost_clock: 5700, socket: "AM5", tdp: 170 },
    created_at: "", updated_at: "",
    prices: [{ id: "p1", product_id: "1", retailer: "amazon_sa", price: 2299, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
  },
  {
    id: "2", name: "Intel Core i9-14900K", brand: "Intel", model: "i9-14900K", category: "cpu", image_url: null,
    specs: { cores: 24, threads: 32, base_clock: 3200, boost_clock: 6000, socket: "LGA1700", tdp: 253 },
    created_at: "", updated_at: "",
    prices: [{ id: "p2", product_id: "2", retailer: "amazon_sa", price: 2499, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
  },
  {
    id: "3", name: "AMD Ryzen 7 7800X3D", brand: "AMD", model: "7800X3D", category: "cpu", image_url: null,
    specs: { cores: 8, threads: 16, base_clock: 4200, boost_clock: 5000, socket: "AM5", tdp: 120 },
    created_at: "", updated_at: "",
    prices: [{ id: "p3", product_id: "3", retailer: "amazon_sa", price: 1799, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
  },
  {
    id: "4", name: "NVIDIA RTX 4090", brand: "NVIDIA", model: "RTX 4090", category: "gpu", image_url: null,
    specs: { vram: 24, vram_type: "GDDR6X", cuda_cores: 16384, tdp: 450, length_mm: 336 },
    created_at: "", updated_at: "",
    prices: [{ id: "p4", product_id: "4", retailer: "amazon_sa", price: 7499, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
  },
  {
    id: "5", name: "NVIDIA RTX 4080 Super", brand: "NVIDIA", model: "RTX 4080S", category: "gpu", image_url: null,
    specs: { vram: 16, vram_type: "GDDR6X", cuda_cores: 10240, tdp: 320, length_mm: 304 },
    created_at: "", updated_at: "",
    prices: [{ id: "p5", product_id: "5", retailer: "amazon_sa", price: 4499, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
  },
  {
    id: "6", name: "AMD RX 7900 XTX", brand: "AMD", model: "RX 7900 XTX", category: "gpu", image_url: null,
    specs: { vram: 24, vram_type: "GDDR6", cuda_cores: 6144, tdp: 355, length_mm: 287 },
    created_at: "", updated_at: "",
    prices: [{ id: "p6", product_id: "6", retailer: "amazon_sa", price: 3999, currency: "SAR", url: "#", in_stock: true, last_checked: "" }],
  },
];

const specLabels: Record<string, string> = {
  cores: "CPU Cores",
  threads: "Threads",
  base_clock: "Base Clock (MHz)",
  boost_clock: "Boost Clock (MHz)",
  socket: "Socket",
  tdp: "TDP (W)",
  vram: "VRAM (GB)",
  vram_type: "VRAM Type",
  cuda_cores: "Stream Processors",
  length_mm: "Length (mm)",
  screen_size: "Screen Size",
  resolution: "Resolution",
  refresh_rate: "Refresh Rate (Hz)",
  panel_type: "Panel Type",
};

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<(Product & { prices: Price[] })[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");

  const addProduct = (product: Product & { prices: Price[] }) => {
    if (selectedProducts.length < 4 && !selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setShowSelector(false);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const clearAll = () => {
    setSelectedProducts([]);
  };

  // Get all unique specs from selected products
  const allSpecs = selectedProducts.reduce((specs, product) => {
    Object.keys(product.specs).forEach((key) => {
      if (!specs.includes(key)) specs.push(key);
    });
    return specs;
  }, [] as string[]);

  // Filter available products
  const availableProducts = demoProducts.filter((p) => {
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    return !selectedProducts.find((sp) => sp.id === p.id);
  });

  // Get best value for each spec
  const getBestValue = (spec: string): string | null => {
    if (selectedProducts.length < 2) return null;

    const values = selectedProducts
      .map((p) => ({ id: p.id, value: p.specs[spec as keyof typeof p.specs] }))
      .filter((v) => v.value !== undefined);

    if (values.length < 2) return null;

    // For numeric values, higher is usually better (except TDP, length)
    const lowerIsBetter = ["tdp", "length_mm", "response_time"];
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
      const aPrice = a.prices[0]?.price || Infinity;
      const bPrice = b.prices[0]?.price || Infinity;
      return aPrice - bPrice;
    });
    return sorted[0].id;
  };

  const lowestPriceId = getLowestPriceProduct();

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Compare Products</h1>
            <p className="text-white/60 text-lg">
              Compare up to 4 products side by side to find the best value
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl overflow-hidden"
          >
            {/* Product Headers */}
            <div className="grid grid-cols-5 border-b border-white/10">
              <div className="p-6 bg-white/5">
                <span className="text-white/50">Specifications</span>
              </div>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="p-6 border-l border-white/10">
                  {selectedProducts[index] ? (
                    <div className="relative">
                      <button
                        onClick={() => removeProduct(selectedProducts[index].id)}
                        className="absolute -top-2 -right-2 p-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="text-xs text-white/50 mb-1">{selectedProducts[index].brand}</div>
                      <div className="font-semibold mb-2 pr-6">{selectedProducts[index].name}</div>
                      <Badge>{getCategoryLabel(selectedProducts[index].category)}</Badge>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSelector(true)}
                      className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/60 hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <Plus className="w-8 h-8" />
                      <span className="text-sm">Add Product</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Price Row */}
            {selectedProducts.length > 0 && (
              <div className="grid grid-cols-5 border-b border-white/10">
                <div className="p-6 bg-white/5 font-medium">Price</div>
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="p-6 border-l border-white/10">
                    {selectedProducts[index] && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${lowestPriceId === selectedProducts[index].id ? "text-green-400" : ""}`}>
                          {formatPrice(selectedProducts[index].prices[0]?.price || 0, selectedProducts[index].prices[0]?.currency)}
                        </span>
                        {lowestPriceId === selectedProducts[index].id && (
                          <Badge variant="success">Best Price</Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Spec Rows */}
            {allSpecs.map((spec) => {
              const bestId = getBestValue(spec);
              return (
                <div key={spec} className="grid grid-cols-5 border-b border-white/10 last:border-b-0">
                  <div className="p-6 bg-white/5 text-white/70">
                    {specLabels[spec] || spec}
                  </div>
                  {[0, 1, 2, 3].map((index) => {
                    const product = selectedProducts[index];
                    const value = product?.specs[spec as keyof typeof product.specs];
                    const isBest = bestId === product?.id;

                    return (
                      <div key={index} className="p-6 border-l border-white/10">
                        {product && value !== undefined && (
                          <div className="flex items-center gap-2">
                            <span className={isBest ? "text-green-400 font-medium" : ""}>
                              {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                            </span>
                            {isBest && <Check className="w-4 h-4 text-green-400" />}
                          </div>
                        )}
                        {product && value === undefined && (
                          <span className="text-white/30">-</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Empty State */}
            {selectedProducts.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">⚖️</div>
                <h3 className="text-xl font-semibold mb-2">No products to compare</h3>
                <p className="text-white/50 mb-6">Add products to start comparing specifications and prices</p>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSelector(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-strong rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
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

            {/* Category Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {["all", "cpu", "gpu", "monitor", "headset"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat as Category | "all")}
                  className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                    filterCategory === cat
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {cat === "all" ? "All" : getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            {/* Product List */}
            <div className="space-y-3 overflow-y-auto flex-1">
              {availableProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product)}
                  className="w-full glass rounded-xl p-4 text-left hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{product.name}</span>
                        <Badge>{getCategoryLabel(product.category)}</Badge>
                      </div>
                      <div className="text-sm text-white/50">{product.brand}</div>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatPrice(product.prices[0]?.price || 0, product.prices[0]?.currency)}
                    </div>
                  </div>
                </button>
              ))}

              {availableProducts.length === 0 && (
                <div className="text-center py-8 text-white/50">
                  No more products available in this category
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
