import { NextRequest, NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";
import { DEMO_PRODUCTS } from "@/lib/demo-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const retailer = searchParams.get("retailer");
  const search = searchParams.get("search")?.toLowerCase();
  const inStock = searchParams.get("inStock");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const sortBy = searchParams.get("sortBy") || "price_asc";

  // Try database first
  if (isDatabaseConfigured()) {
    try {
      const result = await getProductsFromDB(searchParams);
      if (result) {
        return NextResponse.json(result);
      }
    } catch (error) {
      console.error("Database error, falling back to demo data:", error);
    }
  }

  // Fallback to demo data
  let products = [...DEMO_PRODUCTS];

  // Filter by category
  if (category && category !== "all") {
    products = products.filter(p => p.category === category);
  }

  // Filter by retailer
  if (retailer && retailer !== "all") {
    products = products.filter(p => p.prices.some(pr => pr.retailer === retailer));
  }

  // Filter by search
  if (search) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search) ||
      p.model.toLowerCase().includes(search)
    );
  }

  // Filter by stock
  if (inStock === "true") {
    products = products.filter(p => p.lowest_price?.in_stock);
  }

  // Sort
  switch (sortBy) {
    case "price_asc":
      products.sort((a, b) => (a.lowest_price?.price || 0) - (b.lowest_price?.price || 0));
      break;
    case "price_desc":
      products.sort((a, b) => (b.lowest_price?.price || 0) - (a.lowest_price?.price || 0));
      break;
    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      products.reverse(); // Demo data doesn't have dates
      break;
  }

  // Pagination
  const total = products.length;
  products = products.slice(offset, offset + limit);

  return NextResponse.json({
    products,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + products.length < total,
    },
    source: "demo",
  });
}

async function getProductsFromDB(searchParams: URLSearchParams) {
  const category = searchParams.get("category");
  const retailer = searchParams.get("retailer");
  const search = searchParams.get("search");
  const inStock = searchParams.get("inStock");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const sortBy = searchParams.get("sortBy") || "price_asc";

  let sql = `
    SELECT 
      p.id,
      p.name,
      p.brand,
      p.model,
      p.category,
      p.image_url,
      p.specs,
      p.created_at,
      p.updated_at,
      json_agg(
        json_build_object(
          'id', pr.id,
          'retailer', pr.retailer,
          'price', pr.price,
          'original_price', pr.original_price,
          'currency', pr.currency,
          'url', pr.url,
          'in_stock', pr.in_stock,
          'last_checked', pr.last_checked
        ) ORDER BY pr.price ASC
      ) as prices,
      MIN(CASE WHEN pr.in_stock THEN pr.price END) as lowest_price
    FROM products p
    LEFT JOIN prices pr ON p.id = pr.product_id
    WHERE 1=1
  `;

  const params: any[] = [];
  let paramIndex = 1;

  if (category && category !== "all") {
    sql += ` AND p.category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  if (retailer && retailer !== "all") {
    sql += ` AND pr.retailer = $${paramIndex}`;
    params.push(retailer);
    paramIndex++;
  }

  if (search) {
    sql += ` AND (p.name ILIKE $${paramIndex} OR p.brand ILIKE $${paramIndex} OR p.model ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (inStock === "true") {
    sql += ` AND pr.in_stock = true`;
  }

  sql += ` GROUP BY p.id`;

  switch (sortBy) {
    case "price_asc":
      sql += ` ORDER BY lowest_price ASC NULLS LAST`;
      break;
    case "price_desc":
      sql += ` ORDER BY lowest_price DESC NULLS LAST`;
      break;
    case "name":
      sql += ` ORDER BY p.name ASC`;
      break;
    case "newest":
      sql += ` ORDER BY p.created_at DESC`;
      break;
    default:
      sql += ` ORDER BY lowest_price ASC NULLS LAST`;
  }

  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await query(sql, params);

  if (!result || result.rows.length === 0) {
    return null;
  }

  // Get total count
  let countSql = `SELECT COUNT(DISTINCT p.id) as total FROM products p LEFT JOIN prices pr ON p.id = pr.product_id WHERE 1=1`;
  const countParams: any[] = [];
  let countParamIndex = 1;

  if (category && category !== "all") {
    countSql += ` AND p.category = $${countParamIndex}`;
    countParams.push(category);
    countParamIndex++;
  }

  if (retailer && retailer !== "all") {
    countSql += ` AND pr.retailer = $${countParamIndex}`;
    countParams.push(retailer);
    countParamIndex++;
  }

  if (search) {
    countSql += ` AND (p.name ILIKE $${countParamIndex} OR p.brand ILIKE $${countParamIndex})`;
    countParams.push(`%${search}%`);
  }

  const countResult = await query(countSql, countParams);
  const total = parseInt(countResult?.rows[0]?.total || "0");

  const products = result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    model: row.model,
    category: row.category,
    image_url: row.image_url,
    specs: row.specs || {},
    created_at: row.created_at,
    updated_at: row.updated_at,
    prices: row.prices?.filter((p: any) => p.id !== null) || [],
    lowest_price: row.prices?.find((p: any) => p.in_stock && p.price === row.lowest_price) || row.prices?.[0] || null,
  }));

  return {
    products,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + products.length < total,
    },
    source: "database",
  };
}
