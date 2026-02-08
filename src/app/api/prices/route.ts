import { NextRequest, NextResponse } from "next/server";
import { productQueries, isDatabaseConfigured } from "@/lib/db";

// Demo price history
const demoPriceHistory = [
  { date: "2024-01-01", price: 2599 },
  { date: "2024-01-15", price: 2549 },
  { date: "2024-02-01", price: 2499 },
  { date: "2024-02-15", price: 2449 },
  { date: "2024-03-01", price: 2399 },
  { date: "2024-03-15", price: 2349 },
  { date: "2024-04-01", price: 2299 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");
  const days = parseInt(searchParams.get("days") || "90");

  if (!productId) {
    return NextResponse.json(
      { error: "product_id is required" },
      { status: 400 }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      data: demoPriceHistory,
      source: "demo",
    });
  }

  try {
    const result = await productQueries.getPriceHistory(productId, days);

    return NextResponse.json({
      data: result.rows,
      source: "database",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    );
  }
}
