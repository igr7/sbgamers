import { NextRequest, NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";
import { DEMO_PRODUCTS } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

// GET /api/products/:id - Get specific product with all prices
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const productId = params.id;

    // Try database first
    if (isDatabaseConfigured()) {
        try {
            const result = await query(
                `SELECT 
          p.id,
          p.name,
          p.brand,
          p.model,
          p.category,
          p.image_url,
          p.specs,
          p.created_at,
          p.updated_at
        FROM products p
        WHERE p.id = $1`,
                [productId]
            );

            if (result && result.rows.length > 0) {
                const product = result.rows[0];

                // Get all prices
                const pricesResult = await query(
                    `SELECT id, retailer, price, original_price, currency, url, in_stock, last_checked
           FROM prices WHERE product_id = $1 ORDER BY price ASC`,
                    [productId]
                );

                const prices = pricesResult?.rows || [];
                const lowestPrice = prices.find((p: any) => p.in_stock) || prices[0] || null;

                return NextResponse.json({
                    product: {
                        ...product,
                        specs: product.specs || {},
                        prices,
                        lowest_price: lowestPrice,
                    },
                    source: "database",
                });
            }
        } catch (error) {
            console.error("Database error:", error);
        }
    }

    // Fallback to demo data
    const demoProduct = DEMO_PRODUCTS.find(p => p.id === productId);

    if (demoProduct) {
        return NextResponse.json({
            product: demoProduct,
            source: "demo",
        });
    }

    return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
    );
}
