"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";

const footerLinks = {
  Products: [
    { href: "/products?category=cpu", label: "CPUs" },
    { href: "/products?category=gpu", label: "Graphics Cards" },
    { href: "/products?category=monitor", label: "Monitors" },
    { href: "/products?category=console", label: "Consoles" },
  ],
  Tools: [
    { href: "/builder", label: "PC Builder" },
    { href: "/compare", label: "Compare" },
    { href: "/deals", label: "Deals" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">SBGamers</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Your trusted PC parts aggregator for Saudi Arabia and UAE. Compare prices, check compatibility, and build your dream setup.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} SBGamers. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-white/40 text-sm">
            <span>Prices updated in real-time</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
