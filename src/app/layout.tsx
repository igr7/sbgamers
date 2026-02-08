import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SBGamers | PC Part Aggregator for MENA",
  description: "Build your dream PC with real-time prices from Saudi Arabia and UAE retailers. Compare parts, check compatibility, and track price drops.",
  keywords: ["PC parts", "Saudi Arabia", "UAE", "gaming PC", "price tracker", "PC builder"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
