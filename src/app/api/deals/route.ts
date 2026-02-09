import { NextRequest, NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";
import { getDemoDeals } from "@/lib/demo-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const minDiscount = parseInt(searchParams.get("minDiscount") || "10");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy = searchParams.get("sortBy") || "discount";

    // Try database first
    if (isDatabaseConfigured()) {
        try {
            const result = await getDealsFromDB(searchParams);
            if (result) {
                return NextResponse.json(result);
            }
        } catch (error) {
            console.error("Database error, falling back to demo data:", error);
        }
    }

    // Fallback to demo data
    let deals = getDemoDeals();

    // Filter by minimum discount
    deals = deals.filter(d => d.discount_percent >= minDiscount);

    // Filter by category
    if (category && category !== "all") {
        deals = deals.filter(d => d.product.category === category);
    }

    // Sort
    switch (sortBy) {
        case "discount":
            deals.sort((a, b) => b.discount_percent - a.discount_percent);
            break;
        case "savings":
            deals.sort((a, b) => b.savings - a.savings);
            break;
        case "price_asc":
            deals.sort((a, b) => a.sale_price - b.sale_price);
            break;
        case "price_desc":
            deals.sort((a, b) => b.sale_price - a.sale_price);
            break;
    }

    // Limit
    deals = deals.slice(0, limit);

    // Stats
    const totalSavings = deals.reduce((sum, d) => sum + d.savings, 0);
    const maxDiscount = Math.max(...deals.map(d => d.discount_percent), 0);

    return NextResponse.json({
        deals,
        stats: {
            total: deals.length,
            totalSavings,
            maxDiscount,
        },
        source: "demo",
    });
}

async function getDealsFromDB(searchParams: URLSearchParams) {
    const minDiscount = parseInt(searchParams.get("minDiscount") || "10");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy = searchParams.get("sortBy") || "discount";

    let sql = `
    SELECT 
      p.id,
      p.name,
      p.brand,
      p.model,
      p.category,
      p.image_url,
      p.specs,
      pr.id as price_id,
      pr.retailer,
      pr.price as sale_price,
      pr.original_price,
      pr.currency,
      pr.url,
      pr.in_stock,
      pr.last_checked,
      ROUND(((pr.original_price - pr.price) / pr.original_price * 100)::numeric, 0) as discount_percent,
      (pr.original_price - pr.price) as savings
    FROM products p
    JOIN prices pr ON p.id = pr.product_id
    WHERE pr.original_price IS NOT NULL 
      AND pr.original_price > pr.price
      AND pr.in_stock = true
      AND ((pr.original_price - pr.price) / pr.original_price * 100) >= $1
  `;

    const params: any[] = [minDiscount];
    let paramIndex = 2;

    if (category && category !== "all") {
        sql += ` AND p.category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
    }

    switch (sortBy) {
        case "discount":
            sql += ` ORDER BY discount_percent DESC`;
            break;
        case "savings":
            sql += ` ORDER BY savings DESC`;
            break;
        case "price_asc":
            sql += ` ORDER BY pr.price ASC`;
            break;
        case "price_desc":
            sql += ` ORDER BY pr.price DESC`;
            break;
        default:
            sql += ` ORDER BY discount_percent DESC`;
    }

    sql += ` LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await query(sql, params);

    if (!result || result.rows.length === 0) {
        return null;
    }

    // Get all prices for each deal product
    const productIds = [...new Set(result.rows.map((r: any) => r.id))];

    const pricesMap: Record<string, any[]> = {};

    if (productIds.length > 0) {
        const pricesResult = await query(
            `SELECT product_id, id, retailer, price, original_price, currency, url, in_stock, last_checked
       FROM prices WHERE product_id = ANY($1) ORDER BY price ASC`,
            [productIds]
        );

        if (pricesResult) {
            pricesResult.rows.forEach((price: any) => {
                if (!pricesMap[price.product_id]) {
                    pricesMap[price.product_id] = [];
                }
                pricesMap[price.product_id].push(price);
            });
        }
    }

    const deals = result.rows.map((row: any) => ({
        id: row.id,
        product: {
            id: row.id,
            name: row.name,
            brand: row.brand,
            model: row.model,
            category: row.category,
            image_url: row.image_url,
            specs: row.specs || {},
        },
        prices: pricesMap[row.id] || [],
        lowest_price: {
            id: row.price_id,
            retailer: row.retailer,
            price: parseFloat(row.sale_price),
            original_price: parseFloat(row.original_price),
            currency: row.currency,
            url: row.url,
            in_stock: row.in_stock,
            last_checked: row.last_checked,
        },
        original_price: parseFloat(row.original_price),
        sale_price: parseFloat(row.sale_price),
        discount_percent: parseInt(row.discount_percent),
        savings: parseFloat(row.savings),
    }));

    const totalSavings = deals.reduce((sum: number, d: any) => sum + d.savings, 0);
    const maxDiscount = Math.max(...deals.map((d: any) => d.discount_percent), 0);

    return {
        deals,
        stats: {
            total: deals.length,
            totalSavings,
            maxDiscount,
        },
        source: "database",
    };
}
