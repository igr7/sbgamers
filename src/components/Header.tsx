"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Menu, X, Flame } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/compare", label: "Compare" },
  { href: "/deals", label: "Deals", icon: Flame },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-chrome rounded-2xl px-5 md:px-7 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">SBGamers</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    className={cn(
                      "text-sm transition-colors flex items-center gap-1.5",
                      isActive
                        ? "text-white"
                        : "text-white/50 hover:text-white"
                    )}
                    whileHover={{ y: -2 }}
                  >
                    {link.icon && <link.icon className="w-4 h-4 text-orange-400" />}
                    {link.label}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-chrome px-5 py-2.5 rounded-xl text-sm font-medium"
              >
                Browse Products
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 hover:bg-white/10 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 glass-chrome rounded-2xl overflow-hidden"
            >
              <nav className="p-3 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "px-4 py-3.5 rounded-xl transition-colors flex items-center gap-2",
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {link.icon && <link.icon className="w-4 h-4 text-orange-400" />}
                        {link.label}
                      </motion.div>
                    </Link>
                  );
                })}
                <div className="pt-2 mt-1 border-t border-white/5">
                  <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-chrome py-3.5 rounded-xl font-medium"
                    >
                      Browse Products
                    </motion.button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
