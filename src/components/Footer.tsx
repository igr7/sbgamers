"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cpu, ExternalLink, Github, Twitter } from "lucide-react";

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

const footerLinks: Record<string, FooterLink[]> = {
  "Browse": [
    { href: "/products", label: "All Products" },
    { href: "/deals", label: "Hot Deals" },
    { href: "/compare", label: "Compare" },
  ],
  "Categories": [
    { href: "/products?category=gpu", label: "Graphics Cards" },
    { href: "/products?category=cpu", label: "Processors" },
    { href: "/products?category=monitor", label: "Monitors" },
    { href: "/products?category=mouse", label: "Gaming Mice" },
  ],
  "Stores": [
    { href: "https://amazon.sa", label: "Amazon SA", external: true },
    { href: "https://jarir.com", label: "Jarir", external: true },
    { href: "https://extra.com", label: "Extra", external: true },
    { href: "https://newegg.com", label: "Newegg", external: true },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/">
              <motion.div
                className="flex items-center gap-3 mb-5"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">SBGamers</span>
              </motion.div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Compare gaming gear prices across Saudi Arabia&apos;s top retailers.
              Find the best deals on PC parts, monitors, peripherals, and consoles.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5"
              >
                <Twitter className="w-4 h-4 text-white/60" />
              </motion.a>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5"
              >
                <Github className="w-4 h-4 text-white/60" />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/40 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/30">
              © {new Date().getFullYear()} SBGamers. Compare prices, save money.
            </div>
            <div className="flex items-center gap-6 text-sm text-white/30">
              <span>No logins. No tracking. Just prices.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
