import { NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// This endpoint sets up the database schema and seed data
export async function POST() {
    if (!isDatabaseConfigured()) {
        return NextResponse.json({
            success: false,
            error: "Database not configured. Set DATABASE_URL environment variable.",
        }, { status: 500 });
    }

    const results: string[] = [];
    const errors: string[] = [];

    try {
        // Test connection
        const testResult = await query("SELECT NOW() as time");
        if (!testResult) {
            return NextResponse.json({
                success: false,
                error: "Could not connect to database",
            }, { status: 500 });
        }
        results.push(`Connected to database at ${testResult.rows[0].time}`);

        // Run schema
        const schemaPath = path.join(process.cwd(), "database", "schema.sql");
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, "utf8");
            const statements = schemaSql.split(/;[\r\n]+/).filter(s => s.trim().length > 0);

            for (const statement of statements) {
                try {
                    await query(statement);
                    results.push(`Schema: ${statement.substring(0, 40)}...`);
                } catch (err: any) {
                    if (!err.message?.includes("already exists")) {
                        errors.push(`Schema error: ${err.message}`);
                    }
                }
            }
        }

        // Run seed
        const seedPath = path.join(process.cwd(), "database", "seed.sql");
        if (fs.existsSync(seedPath)) {
            const seedSql = fs.readFileSync(seedPath, "utf8");
            const statements = seedSql.split(/;[\r\n]+/).filter(s => s.trim().length > 0);

            for (const statement of statements) {
                try {
                    await query(statement);
                    results.push(`Seed: ${statement.substring(0, 40)}...`);
                } catch (err: any) {
                    if (!err.message?.includes("duplicate key") && !err.message?.includes("already exists")) {
                        errors.push(`Seed error: ${err.message}`);
                    }
                }
            }
        }

        // Get counts
        const productCount = await query("SELECT COUNT(*) as count FROM products");
        const priceCount = await query("SELECT COUNT(*) as count FROM prices");

        return NextResponse.json({
            success: true,
            message: "Database setup complete!",
            stats: {
                products: productCount?.rows[0]?.count || 0,
                prices: priceCount?.rows[0]?.count || 0,
            },
            results: results.slice(-10),
            errors: errors.slice(0, 5),
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            results,
            errors,
        }, { status: 500 });
    }
}

export async function GET() {
    if (!isDatabaseConfigured()) {
        return NextResponse.json({
            configured: false,
            connected: false,
            message: "DATABASE_URL not set",
        });
    }

    try {
        const result = await query("SELECT NOW() as time");
        if (!result) {
            return NextResponse.json({
                configured: true,
                connected: false,
                message: "Could not connect to database",
            });
        }

        const productCount = await query("SELECT COUNT(*) as count FROM products");
        const priceCount = await query("SELECT COUNT(*) as count FROM prices");

        return NextResponse.json({
            configured: true,
            connected: true,
            serverTime: result.rows[0].time,
            stats: {
                products: productCount?.rows[0]?.count || 0,
                prices: priceCount?.rows[0]?.count || 0,
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            configured: true,
            connected: false,
            error: error.message,
        });
    }
}
