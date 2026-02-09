"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Cpu,
  TrendingDown,
  ArrowRight,
  ChevronDown,
  Layers,
  BarChart3,
  Zap,
  Shield,
  Monitor,
  Gamepad2,
  Headphones,
  Mouse,
  Keyboard,
  Store,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
};

// Store logos/names
const stores = [
  { name: "Amazon SA", id: "amazon_sa" },
  { name: "Jarir", id: "jarir" },
  { name: "Extra", id: "extra" },
  { name: "Newegg", id: "newegg" },
  { name: "PCD", id: "pcd" },
  { name: "Infiniarc", id: "infiniarc" },
];

// Product categories
const categories = [
  { icon: Monitor, label: "Monitors", count: "500+" },
  { icon: Cpu, label: "PC Parts", count: "2000+" },
  { icon: Gamepad2, label: "Consoles", count: "50+" },
  { icon: Headphones, label: "Headsets", count: "300+" },
  { icon: Mouse, label: "Mice", count: "400+" },
  { icon: Keyboard, label: "Keyboards", count: "350+" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Chrome Wave Background */}
      <div className="chrome-waves">
        <motion.div 
          className="chrome-wave chrome-wave-1" 
          style={{ y: backgroundY }}
        />
        <div className="chrome-wave chrome-wave-2" />
        <div className="chrome-wave chrome-wave-3" />
      </div>
      <div className="chrome-reflection" />
      
      {/* Subtle Grid */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-chrome rounded-2xl px-5 md:px-8 py-4 flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">SBGamers</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-10">
              {["Products", "Compare", "Deals"].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`}>
                  <motion.span
                    className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                    whileHover={{ y: -2 }}
                  >
                    {item}
                  </motion.span>
                </Link>
              ))}
            </div>

            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-chrome px-6 py-2.5 rounded-xl text-sm"
              >
                Browse Products
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Live Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 glass-chrome px-5 py-2.5 rounded-full text-sm text-white/70 mb-10"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
              </span>
              Tracking prices from {stores.length} Saudi retailers in real-time
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
            >
              <span className="gradient-text">Find the Best</span>
              <br />
              <span className="text-white">Gaming Gear Deals</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Compare prices across all major Saudi stores. 
              Monitors, PC parts, consoles, headsets, mice, keyboards & more.
              <span className="text-white/70"> No signup required.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(255,255,255,0.25)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 btn-chrome px-10 py-5 rounded-2xl font-semibold text-lg"
                >
                  Browse Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/deals">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-strong px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  🔥 Hot Deals
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-white/30"
            >
              <span className="text-xs uppercase tracking-[0.2em]">Explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text-static">All Gaming Gear</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Everything you need to build the ultimate gaming setup
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((category) => (
              <motion.div
                key={category.label}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Link href={`/products?category=${category.label.toLowerCase()}`}>
                  <div className="glass-chrome rounded-2xl p-6 text-center group cursor-pointer h-full">
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/10 transition-colors border border-white/5">
                      <category.icon className="w-7 h-7 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.label}</h3>
                    <p className="text-sm text-white/40">{category.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="gradient-text-static">SBGamers</span>?
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Smart tools to help you find the best deals on gaming gear
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: TrendingDown,
                title: "Price Comparison",
                description: "Compare prices from 6+ retailers instantly"
              },
              {
                icon: BarChart3,
                title: "Price History",
                description: "Track price changes over time"
              },
              {
                icon: Zap,
                title: "Real-Time Updates",
                description: "Prices updated daily from all stores"
              },
              {
                icon: Shield,
                title: "Trusted Stores",
                description: "Only verified Saudi retailers"
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="card-chrome p-8 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors border border-white/5">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="glass-chrome rounded-3xl p-12 md:p-20"
          >
            <div className="grid md:grid-cols-4 gap-12 text-center">
              {[
                { value: "6+", label: "Retailers" },
                { value: "5000+", label: "Products" },
                { value: "Daily", label: "Price Updates" },
                { value: "Free", label: "Forever" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-5xl md:text-6xl font-bold mb-3 gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-white/40 uppercase tracking-wider text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stores Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text-static">Trusted Stores</span>
            </h2>
            <p className="text-white/50 text-lg">
              We track prices from the biggest retailers in Saudi Arabia
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
          >
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-chrome px-8 py-5 rounded-2xl text-white/60 hover:text-white transition-all cursor-pointer flex items-center gap-3"
              >
                <Store className="w-5 h-5" />
                <span className="font-medium">{store.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="gradient-text">Start Saving Today</span>
            </h2>
            <p className="text-white/50 text-xl mb-12 max-w-2xl mx-auto">
              Find the best prices on gaming gear across Saudi Arabia. 
              No account needed, just browse and buy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center gap-3 btn-chrome px-12 py-6 rounded-2xl font-semibold text-xl"
                >
                  Browse Products
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </Link>
              
              <Link href="/compare">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-strong px-12 py-6 rounded-2xl font-semibold text-xl hover:bg-white/10 transition-all"
                >
                  Compare Prices
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">SBGamers</span>
            </div>

            <div className="flex items-center gap-8 text-white/40">
              {["Products", "Compare", "Deals"].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="hover:text-white transition-colors text-sm"
                >
                  {link}
                </Link>
              ))}
            </div>

            <div className="text-white/30 text-sm">
              © 2026 SBGamers. Compare prices, save money.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
