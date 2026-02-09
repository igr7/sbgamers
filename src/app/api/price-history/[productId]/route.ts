import { NextRequest, NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/price-history/:productId - Get price history for a product
export async function GET(
    request: NextRequest,
    { params }: { params: { productId: string } }
) {
    const productId = params.productId;
    const searchParams = request.nextUrl.searchParams;
    const retailer = searchParams.get("retailer");
    const days = parseInt(searchParams.get("days") || "30");

    if (!isDatabaseConfigured()) {
        // Return demo price history
        return NextResponse.json({
            productId,
            history: generateDemoPriceHistory(productId, days),
            source: "demo",
        });
    }

    try {
        let sql = `
      SELECT 
        ph.id,
        ph.price_id,
        ph.price,
        ph.in_stock,
        ph.recorded_at,
        p.retailer,
        p.currency
      FROM price_history ph
      JOIN prices p ON ph.price_id = p.id
      WHERE p.product_id = $1
        AND ph.recorded_at >= NOW() - INTERVAL '${days} days'
    `;

        const params: any[] = [productId];
        let paramIndex = 2;

        if (retailer) {
            sql += ` AND p.retailer = $${paramIndex}`;
            params.push(retailer);
        }

        sql += ` ORDER BY ph.recorded_at ASC`;

        const result = await query(sql, params);

        if (!result) {
            return NextResponse.json({
                productId,
                history: generateDemoPriceHistory(productId, days),
                source: "demo",
            });
        }

        // Group by retailer for charting
        const historyByRetailer: Record<string, any[]> = {};

        result.rows.forEach((row: any) => {
            if (!historyByRetailer[row.retailer]) {
                historyByRetailer[row.retailer] = [];
            }
            historyByRetailer[row.retailer].push({
                date: row.recorded_at,
                price: parseFloat(row.price),
                in_stock: row.in_stock,
            });
        });

        // Get current prices for comparison
        const currentPrices = await query(
            `SELECT retailer, price, original_price, in_stock, last_checked
       FROM prices WHERE product_id = $1 ORDER BY price ASC`,
            [productId]
        );

        return NextResponse.json({
            productId,
            historyByRetailer,
            currentPrices: currentPrices?.rows || [],
            days,
            source: "database",
        });

    } catch (error: any) {
        console.error("Error fetching price history:", error);
        return NextResponse.json({
            productId,
            history: generateDemoPriceHistory(productId, days),
            error: error.message,
            source: "demo",
        });
    }
}

// Generate demo price history for testing
function generateDemoPriceHistory(productId: string, days: number) {
    const retailers = ["amazon_sa", "newegg", "jarir"];
    const basePrice = 1500 + Math.random() * 3000;
    const historyByRetailer: Record<string, any[]> = {};

    retailers.forEach(retailer => {
        historyByRetailer[retailer] = [];
        const retailerBasePrice = basePrice * (0.9 + Math.random() * 0.2);

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Simulate price fluctuations
            const fluctuation = (Math.random() - 0.5) * 200;
            const price = Math.round(retailerBasePrice + fluctuation);

            historyByRetailer[retailer].push({
                date: date.toISOString(),
                price,
                in_stock: Math.random() > 0.1,
            });
        }
    });

    return historyByRetailer;
}
