"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button, Badge } from "@/components/ui";
import { PC_BUILD_CATEGORIES, Category, Product, Price, BuildItem } from "@/types";
import { getCategoryLabel, formatPrice } from "@/lib/utils";
import { checkCompatibility, calculateBottleneck, getEstimatedWattage } from "@/lib/compatibility";
import {
  Cpu, Monitor, HardDrive, Zap, Box, Fan, CircuitBoard, MemoryStick,
  Plus, X, AlertTriangle, CheckCircle, Share2, Download, Trash2
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  cpu: Cpu,
  gpu: Monitor,
  motherboard: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  psu: Zap,
  case: Box,
  cooler: Fan,
};

// Demo products for selection
const demoProductsByCategory: Record<string, (Product & { price: Price })[]> = {
  cpu: [
    { id: "cpu1", name: "AMD Ryzen 9 7950X", brand: "AMD", model: "7950X", category: "cpu", image_url: null, specs: { cores: 16, threads: 32, socket: "AM5", tdp: 170 }, created_at: "", updated_at: "", price: { id: "1", product_id: "cpu1", retailer: "amazon_sa", price: 2299, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "cpu2", name: "Intel Core i9-14900K", brand: "Intel", model: "i9-14900K", category: "cpu", image_url: null, specs: { cores: 24, threads: 32, socket: "LGA1700", tdp: 253 }, created_at: "", updated_at: "", price: { id: "2", product_id: "cpu2", retailer: "amazon_sa", price: 2499, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "cpu3", name: "AMD Ryzen 7 7800X3D", brand: "AMD", model: "7800X3D", category: "cpu", image_url: null, specs: { cores: 8, threads: 16, socket: "AM5", tdp: 120 }, created_at: "", updated_at: "", price: { id: "3", product_id: "cpu3", retailer: "amazon_sa", price: 1799, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
  ],
  gpu: [
    { id: "gpu1", name: "NVIDIA RTX 4090", brand: "NVIDIA", model: "RTX 4090", category: "gpu", image_url: null, specs: { vram: 24, cuda_cores: 16384, tdp: 450, length_mm: 336 }, created_at: "", updated_at: "", price: { id: "4", product_id: "gpu1", retailer: "amazon_sa", price: 7499, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "gpu2", name: "NVIDIA RTX 4080 Super", brand: "NVIDIA", model: "RTX 4080S", category: "gpu", image_url: null, specs: { vram: 16, cuda_cores: 10240, tdp: 320, length_mm: 304 }, created_at: "", updated_at: "", price: { id: "5", product_id: "gpu2", retailer: "amazon_sa", price: 4499, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "gpu3", name: "AMD RX 7900 XTX", brand: "AMD", model: "RX 7900 XTX", category: "gpu", image_url: null, specs: { vram: 24, cuda_cores: 6144, tdp: 355, length_mm: 287 }, created_at: "", updated_at: "", price: { id: "6", product_id: "gpu3", retailer: "amazon_sa", price: 3999, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
  ],
  motherboard: [
    { id: "mb1", name: "ASUS ROG Crosshair X670E Hero", brand: "ASUS", model: "X670E Hero", category: "motherboard", image_url: null, specs: { socket: "AM5", chipset: "X670E", form_factor: "ATX", memory_type: "DDR5", max_memory: 128 }, created_at: "", updated_at: "", price: { id: "7", product_id: "mb1", retailer: "amazon_sa", price: 2799, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "mb2", name: "MSI MEG Z790 ACE", brand: "MSI", model: "Z790 ACE", category: "motherboard", image_url: null, specs: { socket: "LGA1700", chipset: "Z790", form_factor: "ATX", memory_type: "DDR5", max_memory: 128 }, created_at: "", updated_at: "", price: { id: "8", product_id: "mb2", retailer: "amazon_sa", price: 2499, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
  ],
  ram: [
    { id: "ram1", name: "G.Skill Trident Z5 RGB 32GB DDR5-6000", brand: "G.Skill", model: "Trident Z5", category: "ram", image_url: null, specs: { capacity: 32, speed: 6000, memory_type: "DDR5", modules: 2, height_mm: 44 }, created_at: "", updated_at: "", price: { id: "9", product_id: "ram1", retailer: "amazon_sa", price: 699, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "ram2", name: "Corsair Dominator Platinum 64GB DDR5-5600", brand: "Corsair", model: "Dominator", category: "ram", image_url: null, specs: { capacity: 64, speed: 5600, memory_type: "DDR5", modules: 2, height_mm: 56 }, created_at: "", updated_at: "", price: { id: "10", product_id: "ram2", retailer: "amazon_sa", price: 1199, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
  ],
  storage: [
    { id: "st1", name: "Samsung 990 Pro 2TB NVMe", brand: "Samsung", model: "990 Pro", category: "storage", image_url: null, specs: { storage_capacity: 2000, storage_type: "NVMe SSD", read_speed: 7450, write_speed: 6900 }, created_at: "", updated_at: "", price: { id: "11", product_id: "st1", retailer: "amazon_sa", price: 799, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "st2", name: "WD Black SN850X 1TB", brand: "Western Digital", model: "SN850X", category: "storage", image_url: null, specs: { storage_capacity: 1000, storage_type: "NVMe SSD", read_speed: 7300, write_speed: 6300 }, created_at: "", updated_at: "", price: { id: "12", product_id: "st2", retailer: "amazon_sa", price: 449, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
  ],
  psu: [
    { id: "psu1", name: "Corsair RM1000x 1000W 80+ Gold", brand: "Corsair", model: "RM1000x", category: "psu", image_url: null, specs: { wattage: 1000, efficiency: "80+ Gold", modular: "Full" }, created_at: "", updated_at: "", price: { id: "13", product_id: "psu1", retailer: "amazon_sa", price: 699, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "psu2", name: "EVGA SuperNOVA 850 G6", brand: "EVGA", model: "850 G6", category: "psu", image_url: null, specs: { wattage: 850, efficiency: "80+ Gold", modular: "Full" }, created_at: "", updated_at: "", price: { id: "14", product_id: "psu2", retailer: "amazon_sa", price: 549, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
  ],
  case: [
    { id: "case1", name: "Lian Li O11 Dynamic EVO", brand: "Lian Li", model: "O11 EVO", category: "case", image_url: null, specs: { max_gpu_length: 420, max_cooler_height: 167, case_form_factor: "Mid Tower" }, created_at: "", updated_at: "", price: { id: "15", product_id: "case1", retailer: "amazon_sa", price: 699, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "case2", name: "NZXT H7 Flow", brand: "NZXT", model: "H7 Flow", category: "case", image_url: null, specs: { max_gpu_length: 400, max_cooler_height: 185, case_form_factor: "Mid Tower" }, created_at: "", updated_at: "", price: { id: "16", product_id: "case2", retailer: "amazon_sa", price: 549, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
  ],
  cooler: [
    { id: "cool1", name: "Noctua NH-D15", brand: "Noctua", model: "NH-D15", category: "cooler", image_url: null, specs: { cooler_height: 165, cooler_type: "tower", supported_sockets: ["AM5", "LGA1700", "AM4"] }, created_at: "", updated_at: "", price: { id: "17", product_id: "cool1", retailer: "amazon_sa", price: 399, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
    { id: "cool2", name: "NZXT Kraken X73 RGB", brand: "NZXT", model: "Kraken X73", category: "cooler", image_url: null, specs: { cooler_height: 30, cooler_type: "aio", supported_sockets: ["AM5", "LGA1700", "AM4"] }, created_at: "", updated_at: "", price: { id: "18", product_id: "cool2", retailer: "amazon_sa", price: 899, currency: "SAR", url: "#", in_stock: true, last_checked: "" } },
  ],
};

type BuildState = Partial<Record<Category, { product: Product; price: Price } | null>>;

export default function BuilderPage() {
  const [build, setBuild] = useState<BuildState>({});
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Calculate totals
  const totalPrice = Object.values(build).reduce((sum, item) => {
    return sum + (item?.price.price || 0);
  }, 0);

  const selectedCount = Object.values(build).filter(Boolean).length;

  // Check compatibility
  const buildItems = PC_BUILD_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = {
      category: cat,
      product: build[cat]?.product || null,
      price: build[cat]?.price || null,
    };
    return acc;
  }, {} as Record<Category, BuildItem>);

  const compatibilityIssues = checkCompatibility(buildItems);
  const errors = compatibilityIssues.filter((i) => i.type === "error");
  const warnings = compatibilityIssues.filter((i) => i.type === "warning");

  // Bottleneck calculation
  const bottleneck = calculateBottleneck(build.cpu?.product || null, build.gpu?.product || null);

  // Estimated wattage
  const estimatedWattage = getEstimatedWattage(buildItems);

  const handleSelectProduct = (product: Product & { price: Price }) => {
    if (!selectedCategory) return;
    setBuild((prev) => ({
      ...prev,
      [selectedCategory]: { product, price: product.price },
    }));
    setSelectedCategory(null);
  };

  const handleRemoveProduct = (category: Category) => {
    setBuild((prev) => ({
      ...prev,
      [category]: null,
    }));
  };

  const handleClearBuild = () => {
    setBuild({});
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">PC Builder</h1>
            <p className="text-white/60 text-lg">
              Build your dream PC with real-time compatibility checking
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Parts List */}
            <div className="lg:col-span-2 space-y-4">
              {PC_BUILD_CATEGORIES.map((category, index) => {
                const Icon = categoryIcons[category] || Box;
                const selected = build[category];
                const hasError = errors.some((e) => e.affected_parts.includes(category));
                const hasWarning = warnings.some((w) => w.affected_parts.includes(category));

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`glass rounded-2xl p-5 ${hasError ? "border-red-500/50" : hasWarning ? "border-yellow-500/50" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? "bg-white/20" : "bg-white/10"}`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white/50 mb-1">{getCategoryLabel(category)}</div>
                        {selected ? (
                          <div className="flex items-center gap-3">
                            <span className="font-medium truncate">{selected.product.name}</span>
                            <span className="text-white/50 shrink-0">
                              {formatPrice(selected.price.price, selected.price.currency)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/40">No {getCategoryLabel(category).toLowerCase()} selected</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {hasError && <AlertTriangle className="w-5 h-5 text-red-400" />}
                        {hasWarning && !hasError && <AlertTriangle className="w-5 h-5 text-yellow-400" />}

                        {selected ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCategory(category)}
                            >
                              Change
                            </Button>
                            <button
                              onClick={() => handleRemoveProduct(category)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              {/* Price Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Build Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-white/60">
                    <span>Components</span>
                    <span>{selectedCount} / {PC_BUILD_CATEGORIES.length}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Est. Wattage</span>
                    <span>{estimatedWattage}W</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Total Price</span>
                    <span className="text-3xl font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="primary" size="md" className="w-full">
                    <Share2 className="w-4 h-4" />
                    Share Build
                  </Button>
                  <Button variant="secondary" size="md" className="w-full" onClick={handleClearBuild}>
                    <Trash2 className="w-4 h-4" />
                    Clear Build
                  </Button>
                </div>
              </motion.div>

              {/* Compatibility Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Compatibility</h3>

                {errors.length === 0 && warnings.length === 0 ? (
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>All parts are compatible</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {errors.map((error, i) => (
                      <div key={i} className="flex items-start gap-3 text-red-400">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm">{error.message}</span>
                      </div>
                    ))}
                    {warnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-3 text-yellow-400">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm">{warning.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Bottleneck Calculator */}
              {build.cpu && build.gpu && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Bottleneck Analysis</h3>
                  <div className={`text-sm ${bottleneck.bottleneck === "balanced" ? "text-green-400" : "text-yellow-400"}`}>
                    {bottleneck.message}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedCategory(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-strong rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Select {getCategoryLabel(selectedCategory)}</h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {(demoProductsByCategory[selectedCategory] || []).map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="w-full glass rounded-xl p-4 text-left hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-white/50">{product.brand}</div>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatPrice(product.price.price, product.price.currency)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </main>
  );
}
