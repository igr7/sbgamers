// Scraper types and interfaces

export interface ScrapedProduct {
    name: string;
    brand: string;
    model: string;
    category: string;
    imageUrl: string;
    price: number;
    currency: "SAR" | "AED" | "USD";
    originalPrice?: number; // For deals
    url: string;
    retailer: string;
    inStock: boolean;
    specs: Record<string, string | number | boolean>;
    sku?: string;
    lastScraped: Date;
}

export interface ScraperConfig {
    baseUrl: string;
    name: string;
    retailerKey: string;
    rateLimit: number; // ms between requests
    userAgent: string;
}

export interface ScraperResult {
    success: boolean;
    products: ScrapedProduct[];
    errors: string[];
    scrapedAt: Date;
}

// Category mapping for each retailer
export const CATEGORY_URLS: Record<string, Record<string, string>> = {
    amazon_sa: {
        gpu: "/s?k=graphics+card&rh=n%3A12463157031",
        cpu: "/s?k=processor&rh=n%3A12463156031",
        monitor: "/s?k=gaming+monitor&rh=n%3A12463152031",
        mouse: "/s?k=gaming+mouse&rh=n%3A12463182031",
        keyboard: "/s?k=gaming+keyboard&rh=n%3A12463181031",
        headset: "/s?k=gaming+headset&rh=n%3A12463183031",
        console: "/s?k=playstation+xbox&rh=n%3A12463213031",
    },
    jarir: {
        gpu: "/gaming/pc-components/graphics-cards",
        cpu: "/gaming/pc-components/processors",
        monitor: "/gaming/gaming-monitors",
        mouse: "/gaming/gaming-accessories/gaming-mice",
        keyboard: "/gaming/gaming-accessories/gaming-keyboards",
        headset: "/gaming/gaming-accessories/gaming-headsets",
        console: "/gaming/game-consoles",
    },
    extra: {
        gpu: "/computers-tablets/pc-components/graphics-cards",
        cpu: "/computers-tablets/pc-components/processors",
        monitor: "/computers-tablets/monitors/gaming-monitors",
        mouse: "/computers-tablets/accessories/gaming-mice",
        keyboard: "/computers-tablets/accessories/gaming-keyboards",
        headset: "/audio/headphones/gaming-headsets",
        console: "/electronics/gaming/consoles",
    },
};

export const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
