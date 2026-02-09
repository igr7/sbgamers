import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SBGamers | Gaming Gear Price Comparison Saudi Arabia",
  description: "Compare gaming gear prices across Saudi Arabia's top retailers. Find the best deals on PC parts, monitors, mice, keyboards, headsets, and consoles from Amazon SA, Jarir, Extra, Newegg, and more.",
  keywords: [
    "gaming gear", "Saudi Arabia", "price comparison",
    "PC parts", "gaming mouse", "gaming keyboard", "gaming headset",
    "RTX 4090", "PS5", "Xbox", "gaming monitor",
    "Amazon SA", "Jarir", "Extra", "Newegg",
    "best gaming deals", "gaming setup", "PC build Saudi"
  ],
  authors: [{ name: "SBGamers" }],
  openGraph: {
    title: "SBGamers | Gaming Gear Price Comparison",
    description: "Compare prices from 6+ Saudi retailers. Find the best deals on gaming gear.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SBGamers | Gaming Gear Price Comparison",
    description: "Compare prices from 6+ Saudi retailers. Find the best deals on gaming gear.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
