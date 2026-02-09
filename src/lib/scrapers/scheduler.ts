// Scheduled Scraping Service
// Runs automatically to keep prices updated

import * as cron from "node-cron";
import { scrapeAll, scrapeRetailer, saveToDatabase, closeBrowser } from "./scraper";
import { RETAILERS, RetailerKey } from "./scraper";
import { query } from "@/lib/db";

// Re-export for API usage
export type { RetailerKey };
export { RETAILERS };

interface ScrapeJobStatus {
    isRunning: boolean;
    lastRun: Date | null;
    lastResult: {
        success: boolean;
        productsScraped: number;
        productsUpdated: number;
        errors: string[];
    } | null;
    nextRun: Date | null;
}

const jobStatus: ScrapeJobStatus = {
    isRunning: false,
    lastRun: null,
    lastResult: null,
    nextRun: null,
};

// Log scrape run to database
async function logScrapeRun(
    retailer: string,
    category: string | null,
    productsFound: number,
    productsUpdated: number,
    errors: string[]
) {
    try {
        await query(
            `INSERT INTO scrape_logs (retailer, category, products_found, products_updated, errors, started_at, completed_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [retailer, category, productsFound, productsUpdated, errors]
        );
    } catch (error) {
        console.error("Failed to log scrape run:", error);
    }
}

// Run full scrape of all retailers
async function runFullScrape(): Promise<void> {
    if (jobStatus.isRunning) {
        console.log("Scrape already in progress, skipping...");
        return;
    }

    jobStatus.isRunning = true;
    console.log(`[${new Date().toISOString()}] Starting full scrape...`);

    let totalProducts = 0;
    let totalUpdated = 0;
    const allErrors: string[] = [];

    try {
        const results = await scrapeAll();

        for (const [retailer, result] of results) {
            console.log(`Processing ${retailer}: ${result.products.length} products`);

            if (result.products.length > 0) {
                const saveResult = await saveToDatabase(result.products);
                totalProducts += result.products.length;
                totalUpdated += saveResult.updated + saveResult.inserted;
                allErrors.push(...saveResult.errors);
            }

            allErrors.push(...result.errors);

            await logScrapeRun(
                retailer,
                null,
                result.products.length,
                0,
                result.errors
            );
        }

        jobStatus.lastResult = {
            success: allErrors.length === 0,
            productsScraped: totalProducts,
            productsUpdated: totalUpdated,
            errors: allErrors.slice(0, 10), // Keep only first 10 errors
        };

    } catch (error) {
        console.error("Full scrape failed:", error);
        jobStatus.lastResult = {
            success: false,
            productsScraped: 0,
            productsUpdated: 0,
            errors: [String(error)],
        };
    } finally {
        await closeBrowser();
        jobStatus.isRunning = false;
        jobStatus.lastRun = new Date();
        console.log(`[${new Date().toISOString()}] Scrape completed. ${totalProducts} products, ${totalUpdated} updated`);
    }
}

// Run scrape for a single retailer
async function runRetailerScrape(retailer: RetailerKey): Promise<void> {
    if (jobStatus.isRunning) {
        console.log("Scrape already in progress, skipping...");
        return;
    }

    jobStatus.isRunning = true;
    console.log(`[${new Date().toISOString()}] Starting scrape for ${retailer}...`);

    try {
        const result = await scrapeRetailer(retailer);

        if (result.products.length > 0) {
            const saveResult = await saveToDatabase(result.products);

            await logScrapeRun(
                retailer,
                null,
                result.products.length,
                saveResult.updated + saveResult.inserted,
                [...result.errors, ...saveResult.errors]
            );

            jobStatus.lastResult = {
                success: result.errors.length === 0 && saveResult.errors.length === 0,
                productsScraped: result.products.length,
                productsUpdated: saveResult.updated + saveResult.inserted,
                errors: [...result.errors, ...saveResult.errors].slice(0, 10),
            };
        }

    } catch (error) {
        console.error(`Scrape for ${retailer} failed:`, error);
        jobStatus.lastResult = {
            success: false,
            productsScraped: 0,
            productsUpdated: 0,
            errors: [String(error)],
        };
    } finally {
        await closeBrowser();
        jobStatus.isRunning = false;
        jobStatus.lastRun = new Date();
    }
}

// Cron jobs - using any type to avoid TS issues with node-cron types
let hourlyJob: ReturnType<typeof cron.schedule> | null = null;
let amazonJob: ReturnType<typeof cron.schedule> | null = null;
let jarirJob: ReturnType<typeof cron.schedule> | null = null;
let extraJob: ReturnType<typeof cron.schedule> | null = null;
let neweggJob: ReturnType<typeof cron.schedule> | null = null;
let pcdJob: ReturnType<typeof cron.schedule> | null = null;
let infiniarcJob: ReturnType<typeof cron.schedule> | null = null;

// Start all scheduled jobs
export function startScheduler(): void {
    console.log("Starting price update scheduler...");

    // Schedule hourly full scrape (disabled by default, use staggered retailer updates instead)
    hourlyJob = cron.schedule("0 * * * *", async () => {
        console.log("Hourly scrape triggered");
        await runFullScrape();
    });
    hourlyJob.stop(); // Don't run full hourly, use staggered instead

    // Schedule updates for each retailer at different times to spread load
    // Amazon: every hour at minute 5
    amazonJob = cron.schedule("5 * * * *", async () => {
        await runRetailerScrape("amazon_sa");
    });

    // Jarir: every hour at minute 15
    jarirJob = cron.schedule("15 * * * *", async () => {
        await runRetailerScrape("jarir");
    });

    // Extra: every hour at minute 25
    extraJob = cron.schedule("25 * * * *", async () => {
        await runRetailerScrape("extra");
    });

    // Newegg: every hour at minute 35
    neweggJob = cron.schedule("35 * * * *", async () => {
        await runRetailerScrape("newegg");
    });

    // PCD: every hour at minute 45
    pcdJob = cron.schedule("45 * * * *", async () => {
        await runRetailerScrape("pcd");
    });

    // Infiniarc: every hour at minute 55
    infiniarcJob = cron.schedule("55 * * * *", async () => {
        await runRetailerScrape("infiniarc");
    });

    // Calculate next run time
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setMinutes(5, 0, 0);
    if (now.getMinutes() >= 5) {
        nextHour.setHours(nextHour.getHours() + 1);
    }
    jobStatus.nextRun = nextHour;

    console.log(`Scheduler started. Next Amazon scrape at: ${nextHour.toISOString()}`);
}

// Stop all scheduled jobs
export function stopScheduler(): void {
    hourlyJob?.stop();
    amazonJob?.stop();
    jarirJob?.stop();
    extraJob?.stop();
    neweggJob?.stop();
    pcdJob?.stop();
    infiniarcJob?.stop();
    console.log("Scheduler stopped");
}

// Get current job status
export function getJobStatus(): ScrapeJobStatus {
    return { ...jobStatus };
}

// Manually trigger a scrape
export async function triggerScrape(retailer?: RetailerKey): Promise<ScrapeJobStatus> {
    if (retailer) {
        await runRetailerScrape(retailer);
    } else {
        await runFullScrape();
    }
    return getJobStatus();
}

// Export for initialization
export { runFullScrape, runRetailerScrape };
