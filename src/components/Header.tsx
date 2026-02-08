"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/builder", label: "PC Builder" },
  { href: "/compare", label: "Compare" },
  { href: "/deals", label: "Deals" },
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
        <div className="glass rounded-2xl px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">SBGamers</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  className={cn(
                    "text-sm transition-colors",
                    pathname === link.href
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  )}
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/builder">
              <Button variant="secondary" size="sm">
                Start Building
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass rounded-2xl p-4"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div
                    className={cn(
                      "px-4 py-3 rounded-xl transition-colors",
                      pathname === link.href
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              <Link href="/builder" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full mt-2">
                  Start Building
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
