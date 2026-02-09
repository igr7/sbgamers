"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { CATEGORY_GROUPS, Category, Product, Price, Retailer } from "@/types";
import { getCategoryLabel, getRetailerLabel, formatPrice } from "@/lib/utils";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Store,
  Package,
  Loader2,
  RefreshCw
} from "lucide-react";

interface ProductWithPrices extends Product {
  prices: Price[];
  lowest_price: Price | null;
}

const retailers: Retailer[] = ["amazon_sa", "jarir", "extra", "newegg", "pcd", "infiniarc"];

const sortOptions = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
  { value: "newest", label: "Newest First" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithPrices[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | "all">("all");
  const [sortBy, setSortBy] = useState("price_asc");
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [total, setTotal] = useState(0);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedRetailer !== "all") params.set("retailer", selectedRetailer);
      if (search) params.set("search", search);
      if (inStockOnly) params.set("inStock", "true");
      params.set("sortBy", sortBy);
      params.set("limit", "100");

      const response = await fetch(`/api/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [selectedCategory, selectedRetailer, sortBy, inStockOnly, search]);

  const allCategories = Object.values(CATEGORY_GROUPS).flat() as Category[];

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedRetailer("all");
    setInStockOnly(false);
  };

  const hasActiveFilters = search || selectedCategory !== "all" || selectedRetailer !== "all" || inStockOnly;

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
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text-static">Products</span>
            </h1>
            <p className="text-white/50 text-lg">
              Compare prices across {retailers.length} Saudi retailers • {total.toLocaleString()} products
            </p>
          </motion.div>

          {/* Search & Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-chrome rounded-2xl p-4 md:p-6 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                  >
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-white/20 transition-colors"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-black">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              </div>

              {/* Refresh */}
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>
            </div>

            {/* Filters Row */}
            <div className={`mt-4 pt-4 border-t border-white/5 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="flex flex-wrap gap-3">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === "all"
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    All
                  </button>
                  {["gpu", "cpu", "monitor", "mouse", "keyboard", "headset", "console", "ram", "storage"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as Category)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat
                          ? "bg-white text-black"
                          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {getCategoryLabel(cat)}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-8 bg-white/10 self-center" />

                {/* Store Filter */}
                <div className="relative">
                  <select
                    value={selectedRetailer}
                    onChange={(e) => setSelectedRetailer(e.target.value as Retailer | "all")}
                    className="px-4 py-2 pr-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 appearance-none cursor-pointer focus:outline-none focus:border-white/20"
                  >
                    <option value="all" className="bg-black">All Stores</option>
                    {retailers.map(r => (
                      <option key={r} value={r} className="bg-black">{getRetailerLabel(r)}</option>
                    ))}
                  </select>
                  <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>

                {/* In Stock Toggle */}
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${inStockOnly
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                >
                  <Package className="w-4 h-4" />
                  In Stock Only
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="text-white/40">
              {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-white/30 animate-spin mb-4" />
              <p className="text-white/40">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <X className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-red-400">{error}</h3>
              <button
                onClick={fetchProducts}
                className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/15 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(0.03 * index, 0.3) }}
                >
                  <ProductCard
                    product={product}
                    lowestPrice={product.lowest_price}
                    prices={product.prices}
                    showDiscount={!!product.lowest_price?.original_price}
                    originalPrice={product.lowest_price?.original_price || undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No products found</h3>
              <p className="text-white/40 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/15 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
