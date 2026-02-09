import { NextRequest, NextResponse } from "next/server";
import { getJobStatus, triggerScrape, startScheduler, RetailerKey, RETAILERS } from "@/lib/scrapers/scheduler";

export const dynamic = "force-dynamic";

// GET /api/scrape - Get scraper status
export async function GET() {
    const status = getJobStatus();

    return NextResponse.json({
        status,
        retailers: Object.keys(RETAILERS),
        message: status.isRunning
            ? "Scraping in progress..."
            : status.lastRun
                ? `Last scrape: ${status.lastRun.toISOString()}`
                : "No scrapes run yet",
    });
}

// POST /api/scrape - Trigger a scrape
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const retailer = body.retailer as RetailerKey | undefined;

        // Validate retailer if provided
        if (retailer && !RETAILERS[retailer]) {
            return NextResponse.json(
                { error: `Invalid retailer: ${retailer}. Valid options: ${Object.keys(RETAILERS).join(", ")}` },
                { status: 400 }
            );
        }

        // Check if scrape is already running
        const currentStatus = getJobStatus();
        if (currentStatus.isRunning) {
            return NextResponse.json(
                { error: "Scrape already in progress", status: currentStatus },
                { status: 409 }
            );
        }

        // Trigger scrape (runs in background)
        const resultPromise = triggerScrape(retailer);

        // Don't await - let it run in background
        resultPromise.catch(console.error);

        return NextResponse.json({
            message: retailer
                ? `Started scraping ${retailer}...`
                : "Started full scrape of all retailers...",
            status: getJobStatus(),
        });

    } catch (error) {
        console.error("Error triggering scrape:", error);
        return NextResponse.json(
            { error: "Failed to trigger scrape", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
