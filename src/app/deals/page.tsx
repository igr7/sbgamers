"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui";
import { Product, Price } from "@/types";
import { formatPrice, getCategoryLabel, getRetailerLabel } from "@/lib/utils";
import {
  TrendingDown,
  Flame,
  Clock,
  Percent,
  ExternalLink,
  Store,
  ArrowRight,
  Timer,
  Loader2,
  RefreshCw
} from "lucide-react";

interface Deal {
  id: string;
  product: Product;
  prices: Price[];
  lowest_price: Price & { original_price?: number };
  original_price: number;
  sale_price: number;
  discount_percent: number;
  savings: number;
}

const sortOptions = [
  { value: "discount", label: "Biggest Discount" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "savings", label: "Most Savings" },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("discount");
  const [stats, setStats] = useState({ total: 0, totalSavings: 0, maxDiscount: 0 });

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("sortBy", sortBy);
      params.set("minDiscount", "10");
      params.set("limit", "50");

      const response = await fetch(`/api/deals?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch deals");
      }

      const data = await response.json();
      setDeals(data.deals || []);
      setStats(data.stats || { total: 0, totalSavings: 0, maxDiscount: 0 });
    } catch (err) {
      console.error("Error fetching deals:", err);
      setError("Failed to load deals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [sortBy]);

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
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/20">
                <Flame className="w-7 h-7 text-orange-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="gradient-text-static">Hot Deals</span>
                </h1>
                <p className="text-white/50 text-lg mt-1">
                  Real discounts from Saudi retailers, updated hourly
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="glass-chrome rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-white/40 text-sm">Active Deals</div>
            </div>
            <div className="glass-chrome rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                <Percent className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-2xl font-bold">{stats.maxDiscount}%</div>
              <div className="text-white/40 text-sm">Max Discount</div>
            </div>
            <div className="glass-chrome rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold">Hourly</div>
              <div className="text-white/40 text-sm">Updates</div>
            </div>
            <div className="glass-chrome rounded-2xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                <Flame className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold">{formatPrice(stats.totalSavings)}</div>
              <div className="text-white/40 text-sm">Total Savings</div>
            </div>
          </motion.div>

          {/* Sort & Refresh */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="text-white/40">
              {loading ? "Loading deals..." : `${deals.length} deals available`}
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchDeals}
                disabled={loading}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-white/20"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-black">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && deals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-white/30 animate-spin mb-4" />
              <p className="text-white/40">Finding the best deals...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchDeals}
                className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/15 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Deals Grid */}
          {!loading && !error && deals.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {deals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(0.05 * index, 0.3) }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="card-chrome overflow-hidden group cursor-pointer h-full flex flex-col relative"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 text-black px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4" />
                      -{deal.discount_percent}%
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-6">
                    {deal.product.image_url ? (
                      <img
                        src={deal.product.image_url}
                        alt={deal.product.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                        <span className="text-3xl">🔥</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge>{getCategoryLabel(deal.product.category)}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs text-white/40 uppercase tracking-wider mb-1.5 font-medium">
                      {deal.product.brand}
                    </span>
                    <h3 className="font-semibold text-white mb-4 line-clamp-2 group-hover:text-white/90 transition-colors leading-snug">
                      {deal.product.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-auto pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-green-400">
                          {formatPrice(deal.sale_price)}
                        </span>
                        <span className="text-white/30 line-through text-sm">
                          {formatPrice(deal.original_price)}
                        </span>
                      </div>
                      <div className="text-sm text-white/50 mb-3">
                        Save {formatPrice(deal.savings)}
                      </div>

                      {/* Store & Buy button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-white/40">
                          <Store className="w-3.5 h-3.5" />
                          <span>{getRetailerLabel(deal.lowest_price.retailer)}</span>
                          {deal.prices.length > 1 && (
                            <span className="text-white/30">+{deal.prices.length - 1} more</span>
                          )}
                        </div>

                        <a
                          href={deal.lowest_price.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-sm font-medium text-black bg-white hover:bg-white/90 px-4 py-2 rounded-lg transition-colors"
                        >
                          <span>Get Deal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && deals.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Flame className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No deals available right now</h3>
              <p className="text-white/40 mb-6">Check back later for new deals</p>
            </div>
          )}

          {/* Browse All Products CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 glass-chrome rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Looking for something specific?
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Browse all products and compare prices across 6+ Saudi retailers
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 btn-chrome px-8 py-4 rounded-xl font-semibold text-lg"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
