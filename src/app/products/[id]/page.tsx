"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceHistoryChart } from "@/components/products/PriceHistoryChart";
import { Badge } from "@/components/ui";
import { Product, Price, RETAILER_INFO, CATEGORY_INFO, Retailer, Category } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
    ArrowLeft,
    ExternalLink,
    Store,
    TrendingDown,
    Check,
    X,
    Star,
    Clock,
    Loader2
} from "lucide-react";

interface ProductWithPrices extends Product {
    prices: Price[];
    lowest_price: Price | null;
}

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<ProductWithPrices | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/products/${productId}`);

            if (!response.ok) {
                throw new Error("Product not found");
            }

            const data = await response.json();
            setProduct(data.product);
        } catch (err) {
            setError("Failed to load product");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white">
                <Header />
                <div className="pt-28 pb-20 px-4 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-white/30" />
                </div>
                <Footer />
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="min-h-screen bg-black text-white">
                <Header />
                <div className="pt-28 pb-20 px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/products" className="text-white/60 hover:text-white">
                        ← Back to Products
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const categoryInfo = CATEGORY_INFO[product.category as Category];
    const lowestPrice = product.lowest_price;
    const savings = lowestPrice?.original_price
        ? lowestPrice.original_price - lowestPrice.price
        : 0;
    const discountPercent = lowestPrice?.original_price
        ? Math.round((savings / lowestPrice.original_price) * 100)
        : 0;

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
                    {/* Back Link */}
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Products
                    </Link>

                    {/* Product Header */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-chrome rounded-3xl p-8 flex items-center justify-center aspect-square"
                        >
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <span className="text-6xl">{categoryInfo?.icon || "📦"}</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            {/* Category Badge */}
                            <Badge className="self-start mb-4">
                                {categoryInfo?.icon} {categoryInfo?.name || product.category}
                            </Badge>

                            {/* Brand */}
                            <span className="text-white/50 uppercase tracking-wider text-sm mb-2">
                                {product.brand}
                            </span>

                            {/* Name */}
                            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                                {product.name}
                            </h1>

                            {/* Price */}
                            {lowestPrice && (
                                <div className="glass-chrome rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-4xl font-bold text-white">
                                            {formatPrice(lowestPrice.price)}
                                        </span>
                                        {discountPercent > 0 && (
                                            <>
                                                <span className="text-xl text-white/30 line-through">
                                                    {formatPrice(lowestPrice.original_price!)}
                                                </span>
                                                <span className="bg-green-500 text-black px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                                                    <TrendingDown className="w-4 h-4" />
                                                    -{discountPercent}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {savings > 0 && (
                                        <p className="text-green-400 text-lg mb-4">
                                            You save {formatPrice(savings)}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 text-white/50 text-sm mb-4">
                                        <Store className="w-4 h-4" />
                                        <span>Best price at {RETAILER_INFO[lowestPrice.retailer as Retailer]?.name}</span>
                                        {lowestPrice.in_stock ? (
                                            <span className="flex items-center gap-1 text-green-400">
                                                <Check className="w-4 h-4" /> In Stock
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-400">
                                                <X className="w-4 h-4" /> Out of Stock
                                            </span>
                                        )}
                                    </div>
                                    <a
                                        href={lowestPrice.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-chrome w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
                                    >
                                        Buy Now at {RETAILER_INFO[lowestPrice.retailer as Retailer]?.name}
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </div>
                            )}

                            {/* All Prices */}
                            <div className="glass-chrome rounded-2xl p-6">
                                <h3 className="font-semibold mb-4">Compare Prices ({product.prices.length} stores)</h3>
                                <div className="space-y-3">
                                    {product.prices.map((price, i) => (
                                        <div
                                            key={price.id}
                                            className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: RETAILER_INFO[price.retailer as Retailer]?.color }}
                                                />
                                                <span>{RETAILER_INFO[price.retailer as Retailer]?.name}</span>
                                                {!price.in_stock && (
                                                    <span className="text-xs text-red-400">(Out of Stock)</span>
                                                )}
                                                {i === 0 && (
                                                    <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded font-medium">
                                                        BEST PRICE
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold">{formatPrice(price.price)}</span>
                                                <a
                                                    href={price.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Price History Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <PriceHistoryChart productId={productId} days={30} />
                    </motion.div>

                    {/* Specifications */}
                    {product.specs && Object.keys(product.specs).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-chrome rounded-3xl p-8"
                        >
                            <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(product.specs).map(([key, value]) => (
                                    value !== undefined && value !== null && (
                                        <div key={key} className="bg-white/5 rounded-xl p-4">
                                            <div className="text-white/50 text-sm mb-1">
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </div>
                                            <div className="font-medium">
                                                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
