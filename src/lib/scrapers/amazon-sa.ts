// Amazon SA Scraper
import { ScrapedProduct, ScraperConfig, ScraperResult, DEFAULT_USER_AGENT } from "./types";

const config: ScraperConfig = {
    baseUrl: "https://www.amazon.sa",
    name: "Amazon Saudi Arabia",
    retailerKey: "amazon_sa",
    rateLimit: 2000, // 2 seconds between requests
    userAgent: DEFAULT_USER_AGENT,
};

// Parse price from Amazon format "SAR 1,234.56"
function parsePrice(priceText: string): number {
    const cleaned = priceText.replace(/[^\d.]/g, "");
    return parseFloat(cleaned) || 0;
}

// Extract ASIN from product URL
function extractASIN(url: string): string | null {
    const match = url.match(/\/dp\/([A-Z0-9]{10})/);
    return match ? match[1] : null;
}

// Determine category from product title/category
function categorizeProduct(title: string, categoryText: string): string {
    const lower = (title + " " + categoryText).toLowerCase();

    if (lower.includes("graphics card") || lower.includes("gpu") || lower.includes("geforce") || lower.includes("radeon")) {
        return "gpu";
    }
    if (lower.includes("processor") || lower.includes("cpu") || lower.includes("ryzen") || lower.includes("core i")) {
        return "cpu";
    }
    if (lower.includes("monitor") || lower.includes("display")) {
        return "monitor";
    }
    if (lower.includes("mouse") || lower.includes("mice")) {
        return "mouse";
    }
    if (lower.includes("keyboard")) {
        return "keyboard";
    }
    if (lower.includes("headset") || lower.includes("headphone")) {
        return "headset";
    }
    if (lower.includes("playstation") || lower.includes("xbox") || lower.includes("nintendo") || lower.includes("console")) {
        return "console";
    }
    if (lower.includes("motherboard")) {
        return "motherboard";
    }
    if (lower.includes("ram") || lower.includes("memory")) {
        return "ram";
    }
    if (lower.includes("ssd") || lower.includes("hdd") || lower.includes("storage")) {
        return "storage";
    }
    if (lower.includes("power supply") || lower.includes("psu")) {
        return "psu";
    }

    return "other";
}

// Extract brand from product title
function extractBrand(title: string): string {
    const brands = [
        "NVIDIA", "AMD", "Intel", "ASUS", "MSI", "Gigabyte", "EVGA", "Zotac",
        "Logitech", "Razer", "SteelSeries", "Corsair", "HyperX", "BenQ",
        "Samsung", "LG", "Dell", "Alienware", "Sony", "Microsoft", "Nintendo",
        "Finalmouse", "Glorious", "Pulsar", "Lamzu", "Wooting", "Keychron",
        "ROG", "TUF", "Acer", "ViewSonic", "AOC", "G.Skill", "Kingston",
        "Western Digital", "Seagate", "Crucial", "NZXT", "be quiet!", "Cooler Master"
    ];

    for (const brand of brands) {
        if (title.toLowerCase().includes(brand.toLowerCase())) {
            return brand;
        }
    }

    // Try to get first word as brand
    const firstWord = title.split(" ")[0];
    return firstWord || "Unknown";
}

// Parse HTML and extract products (simplified - in production use cheerio/puppeteer)
export async function scrapeAmazonCategory(categoryUrl: string): Promise<ScraperResult> {
    const products: ScrapedProduct[] = [];
    const errors: string[] = [];

    try {
        const fullUrl = `${config.baseUrl}${categoryUrl}`;

        const response = await fetch(fullUrl, {
            headers: {
                "User-Agent": config.userAgent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

        // In a real implementation, you would parse the HTML here
        // For now, we'll return an error indicating scraping needs proper setup
        errors.push("HTML parsing requires server-side execution with proper parsing libraries");

    } catch (error) {
        errors.push(`Scraping error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    return {
        success: errors.length === 0,
        products,
        errors,
        scrapedAt: new Date(),
    };
}

// Scrape a specific product page for detailed info
export async function scrapeAmazonProduct(productUrl: string): Promise<ScrapedProduct | null> {
    try {
        const response = await fetch(productUrl, {
            headers: {
                "User-Agent": config.userAgent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
        });

        if (!response.ok) {
            return null;
        }

        // Parse product page - would need cheerio/puppeteer in production
        return null;

    } catch (error) {
        console.error("Error scraping Amazon product:", error);
        return null;
    }
}

export { config as amazonSaConfig };
