// Comprehensive Web Scraper for Saudi Gaming Retailers
// This scraper uses Puppeteer for JavaScript-rendered pages and Cheerio for static HTML

import puppeteer, { Browser, Page } from "puppeteer";
import * as cheerio from "cheerio";
import { ScrapedProduct, ScraperResult } from "./types";
import { query } from "@/lib/db";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Rate limiting helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retailer configurations
export const RETAILERS = {
    amazon_sa: {
        name: "Amazon Saudi Arabia",
        baseUrl: "https://www.amazon.sa",
        searchUrl: (query: string) => `/s?k=${encodeURIComponent(query)}`,
        categories: {
            gpu: { url: "/s?k=graphics+card+gaming&rh=n%3A12463157031", keywords: ["RTX", "Radeon", "GeForce", "graphics card"] },
            cpu: { url: "/s?k=processor+gaming&rh=n%3A12463156031", keywords: ["Ryzen", "Core i9", "Core i7", "processor"] },
            monitor: { url: "/s?k=gaming+monitor&rh=n%3A12463152031", keywords: ["gaming monitor", "144Hz", "240Hz", "OLED"] },
            mouse: { url: "/s?k=gaming+mouse", keywords: ["gaming mouse", "wireless mouse"] },
            keyboard: { url: "/s?k=gaming+keyboard+mechanical", keywords: ["mechanical keyboard", "gaming keyboard"] },
            headset: { url: "/s?k=gaming+headset+wireless", keywords: ["gaming headset", "wireless headset"] },
            console: { url: "/s?k=playstation+xbox+nintendo", keywords: ["PlayStation", "Xbox", "Nintendo", "console"] },
            ram: { url: "/s?k=ddr5+ram+gaming", keywords: ["DDR5", "DDR4", "RAM", "memory"] },
            motherboard: { url: "/s?k=gaming+motherboard", keywords: ["motherboard", "AM5", "LGA1700"] },
            storage: { url: "/s?k=ssd+nvme+gaming", keywords: ["SSD", "NVMe", "M.2"] },
            psu: { url: "/s?k=power+supply+gaming", keywords: ["power supply", "PSU", "modular"] },
            cooler: { url: "/s?k=cpu+cooler+gaming", keywords: ["CPU cooler", "AIO", "liquid cooling"] },
        },
        selectors: {
            productList: '[data-component-type="s-search-result"]',
            productName: "h2 a span",
            productLink: "h2 a",
            productPrice: ".a-price .a-offscreen",
            originalPrice: ".a-text-price .a-offscreen",
            productImage: ".s-image",
            inStock: ".a-color-success",
            rating: ".a-icon-star-small .a-icon-alt",
        },
        rateLimit: 2000,
    },
    jarir: {
        name: "Jarir Bookstore",
        baseUrl: "https://www.jarir.com/sa-en",
        categories: {
            gpu: { url: "/gaming/pc-components/graphics-cards.html", keywords: ["graphics"] },
            cpu: { url: "/gaming/pc-components/processors.html", keywords: ["processor"] },
            monitor: { url: "/gaming/gaming-monitors.html", keywords: ["monitor"] },
            mouse: { url: "/gaming/gaming-accessories/gaming-mice.html", keywords: ["mouse"] },
            keyboard: { url: "/gaming/gaming-accessories/gaming-keyboards.html", keywords: ["keyboard"] },
            headset: { url: "/gaming/gaming-accessories/gaming-headsets.html", keywords: ["headset"] },
            console: { url: "/gaming/game-consoles.html", keywords: ["console"] },
        },
        selectors: {
            productList: ".product-item",
            productName: ".product-item-link",
            productLink: ".product-item-link",
            productPrice: ".price",
            productImage: ".product-image-photo",
        },
        rateLimit: 3000,
    },
    extra: {
        name: "Extra Stores",
        baseUrl: "https://www.extra.com/en-sa",
        categories: {
            gpu: { url: "/computers-tablets/pc-components/graphics-cards/c/0Z70GFXCRD", keywords: ["graphics"] },
            cpu: { url: "/computers-tablets/pc-components/processors/c/0Z70PRCSR", keywords: ["processor"] },
            monitor: { url: "/computers-tablets/monitors/gaming-monitors/c/0Z46MNTRGM", keywords: ["monitor"] },
            mouse: { url: "/computers-tablets/accessories/computer-mice/gaming-mice/c/0Z73MSCGM", keywords: ["mouse"] },
            keyboard: { url: "/computers-tablets/accessories/keyboards/gaming-keyboards/c/0Z74KYBRDGM", keywords: ["keyboard"] },
            headset: { url: "/audio/headphones/gaming-headphones/c/0Z42GMHDPH", keywords: ["headset"] },
            console: { url: "/electronics/gaming/game-consoles/c/0Z39GMCSLE", keywords: ["console"] },
        },
        selectors: {
            productList: ".product-item",
            productName: ".product-title a",
            productLink: ".product-title a",
            productPrice: ".price .value",
            productImage: ".product-image img",
        },
        rateLimit: 3000,
    },
    newegg: {
        name: "Newegg Global (Saudi)",
        baseUrl: "https://www.newegg.com/global/sa-en",
        categories: {
            gpu: { url: "/p/pl?N=100007709", keywords: ["RTX", "graphics"] },
            cpu: { url: "/p/pl?N=100007671", keywords: ["processor", "CPU"] },
            monitor: { url: "/p/pl?N=100898493", keywords: ["monitor"] },
            mouse: { url: "/p/pl?N=100160947", keywords: ["mouse"] },
            keyboard: { url: "/p/pl?N=100160946", keywords: ["keyboard"] },
            headset: { url: "/p/pl?N=100160955", keywords: ["headset"] },
        },
        selectors: {
            productList: ".item-cell",
            productName: ".item-title",
            productLink: ".item-title",
            productPrice: ".price-current strong",
            originalPrice: ".price-was-data",
            productImage: ".item-img img",
        },
        rateLimit: 2500,
    },
    pcd: {
        name: "PC Digital",
        baseUrl: "https://pcd.com.sa",
        categories: {
            gpu: { url: "/categories/graphics-cards", keywords: ["RTX", "graphics"] },
            cpu: { url: "/categories/processors", keywords: ["Ryzen", "Intel"] },
            monitor: { url: "/categories/gaming-monitors", keywords: ["monitor"] },
            mouse: { url: "/categories/gaming-mice", keywords: ["mouse"] },
            keyboard: { url: "/categories/gaming-keyboards", keywords: ["keyboard"] },
        },
        selectors: {
            productList: ".product-card",
            productName: ".product-title",
            productLink: ".product-card a",
            productPrice: ".product-price",
            productImage: ".product-image img",
        },
        rateLimit: 2000,
    },
    infiniarc: {
        name: "Infiniarc",
        baseUrl: "https://infiniarc.com",
        categories: {
            gpu: { url: "/product-category/graphic-cards/", keywords: ["RTX", "graphics"] },
            cpu: { url: "/product-category/processors/", keywords: ["Ryzen", "Intel"] },
            mouse: { url: "/product-category/gaming-mice/", keywords: ["mouse"] },
            keyboard: { url: "/product-category/gaming-keyboards/", keywords: ["keyboard"] },
        },
        selectors: {
            productList: ".product",
            productName: ".woocommerce-loop-product__title",
            productLink: ".woocommerce-LoopProduct-link",
            productPrice: ".woocommerce-Price-amount",
            productImage: ".wp-post-image",
        },
        rateLimit: 2000,
    },
};

export type RetailerKey = keyof typeof RETAILERS;

// Browser instance management
let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
    if (!browser || !browser.isConnected()) {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--disable-gpu",
                "--window-size=1920x1080",
            ],
        });
    }
    return browser;
}

async function closeBrowser(): Promise<void> {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

// Parse price from various formats
function parsePrice(priceText: string): number {
    if (!priceText) return 0;
    // Remove currency symbols, commas, and other non-numeric characters except decimal point
    const cleaned = priceText.replace(/[^\d.]/g, "");
    const price = parseFloat(cleaned);
    return isNaN(price) ? 0 : price;
}

// Extract brand from product name
function extractBrand(name: string): string {
    const brands = [
        "NVIDIA", "AMD", "Intel", "ASUS", "MSI", "Gigabyte", "EVGA", "Zotac", "Sapphire", "PowerColor", "XFX",
        "Logitech", "Razer", "SteelSeries", "Corsair", "HyperX", "BenQ", "Glorious", "Pulsar", "Lamzu", "Finalmouse",
        "Samsung", "LG", "Dell", "Alienware", "AOC", "ViewSonic", "Acer", "ASUS ROG", "ROG",
        "Sony", "Microsoft", "Nintendo", "PlayStation", "Xbox",
        "Wooting", "Keychron", "Ducky", "Leopold", "Varmilo",
        "G.Skill", "Kingston", "Crucial", "Corsair", "TeamGroup",
        "Western Digital", "Seagate", "Samsung", "SK Hynix", "Sabrent",
        "NZXT", "be quiet!", "Cooler Master", "Lian Li", "Fractal Design", "Phanteks",
        "Seasonic", "EVGA", "Thermaltake", "Super Flower",
    ];

    const nameLower = name.toLowerCase();
    for (const brand of brands) {
        if (nameLower.includes(brand.toLowerCase())) {
            return brand;
        }
    }
    return name.split(" ")[0] || "Unknown";
}

// Categorize product based on name
function categorizeProduct(name: string): string {
    const nameLower = name.toLowerCase();

    if (nameLower.match(/\b(rtx|radeon|geforce|rx\s*\d|graphics\s*card|gpu)\b/)) return "gpu";
    if (nameLower.match(/\b(ryzen|core\s*i\d|processor|cpu|threadripper)\b/)) return "cpu";
    if (nameLower.match(/\b(monitor|display|screen|27"|32"|24")\b/) && nameLower.match(/\b(hz|gaming|oled|ips|va)\b/)) return "monitor";
    if (nameLower.match(/\b(mouse|mice)\b/)) return "mouse";
    if (nameLower.match(/\b(keyboard|keeb)\b/)) return "keyboard";
    if (nameLower.match(/\b(headset|headphone|earphone)\b/)) return "headset";
    if (nameLower.match(/\b(playstation|ps5|ps4|xbox|nintendo|switch|console)\b/)) return "console";
    if (nameLower.match(/\b(motherboard|mainboard)\b/)) return "motherboard";
    if (nameLower.match(/\b(ram|ddr\d|memory)\b/) && !nameLower.includes("vram")) return "ram";
    if (nameLower.match(/\b(ssd|hdd|nvme|storage|m\.2)\b/)) return "storage";
    if (nameLower.match(/\b(psu|power\s*supply|watt)\b/)) return "psu";
    if (nameLower.match(/\b(cooler|cooling|aio|fan)\b/)) return "cooler";
    if (nameLower.match(/\b(case|chassis|tower)\b/)) return "case";
    if (nameLower.match(/\b(controller|gamepad|joystick)\b/)) return "controller";
    if (nameLower.match(/\b(mousepad|mouse\s*pad|desk\s*mat)\b/)) return "mousepad";
    if (nameLower.match(/\b(webcam|camera)\b/)) return "webcam";
    if (nameLower.match(/\b(microphone|mic)\b/)) return "microphone";

    return "other";
}

// Main scraping function for Amazon
async function scrapeAmazonPage(page: Page, url: string): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];
    const config = RETAILERS.amazon_sa;

    try {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
        await delay(1000);

        // Wait for products to load
        await page.waitForSelector(config.selectors.productList, { timeout: 10000 }).catch(() => null);

        const html = await page.content();
        const $ = cheerio.load(html);

        $(config.selectors.productList).each((_, element) => {
            try {
                const $el = $(element);

                const name = $el.find(config.selectors.productName).first().text().trim();
                if (!name) return;

                const linkEl = $el.find(config.selectors.productLink).first();
                const relativeUrl = linkEl.attr("href") || "";
                const productUrl = relativeUrl.startsWith("http")
                    ? relativeUrl
                    : `${config.baseUrl}${relativeUrl}`;

                const priceText = $el.find(config.selectors.productPrice).first().text();
                const price = parsePrice(priceText);
                if (price === 0) return; // Skip products without price

                const originalPriceText = $el.find(config.selectors.originalPrice).first().text();
                const originalPrice = parsePrice(originalPriceText);

                const imageUrl = $el.find(config.selectors.productImage).attr("src") || "";

                const inStock = !$el.text().toLowerCase().includes("out of stock") &&
                    !$el.text().toLowerCase().includes("unavailable");

                const product: ScrapedProduct = {
                    name,
                    brand: extractBrand(name),
                    model: name.split(" ").slice(1, 4).join(" "),
                    category: categorizeProduct(name),
                    imageUrl,
                    price,
                    currency: "SAR",
                    originalPrice: originalPrice > price ? originalPrice : undefined,
                    url: productUrl,
                    retailer: "amazon_sa",
                    inStock,
                    specs: {},
                    lastScraped: new Date(),
                };

                products.push(product);
            } catch (err) {
                console.error("Error parsing product:", err);
            }
        });

    } catch (error) {
        console.error("Error scraping Amazon page:", error);
    }

    return products;
}

// Generic scraping function using Cheerio for static pages
async function scrapeStaticPage(
    url: string,
    retailer: RetailerKey,
    html?: string
): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];
    const config = RETAILERS[retailer];

    try {
        if (!html) {
            const response = await fetch(url, {
                headers: { "User-Agent": USER_AGENT },
            });
            html = await response.text();
        }

        const $ = cheerio.load(html);

        $(config.selectors.productList).each((_, element) => {
            try {
                const $el = $(element);

                const name = $el.find(config.selectors.productName).first().text().trim();
                if (!name) return;

                const linkEl = $el.find(config.selectors.productLink).first();
                let productUrl = linkEl.attr("href") || "";
                if (productUrl && !productUrl.startsWith("http")) {
                    productUrl = `${config.baseUrl}${productUrl}`;
                }

                const priceText = $el.find(config.selectors.productPrice).first().text();
                const price = parsePrice(priceText);
                if (price === 0) return;

                const selectors = config.selectors as { originalPrice?: string;[key: string]: string | undefined };
                const originalPriceText = selectors.originalPrice
                    ? $el.find(selectors.originalPrice).first().text()
                    : "";
                const originalPrice = parsePrice(originalPriceText);

                const imageUrl = $el.find(config.selectors.productImage).attr("src") ||
                    $el.find(config.selectors.productImage).attr("data-src") || "";

                const product: ScrapedProduct = {
                    name,
                    brand: extractBrand(name),
                    model: name.split(" ").slice(1, 4).join(" "),
                    category: categorizeProduct(name),
                    imageUrl: imageUrl.startsWith("http") ? imageUrl : `${config.baseUrl}${imageUrl}`,
                    price,
                    currency: "SAR",
                    originalPrice: originalPrice > price ? originalPrice : undefined,
                    url: productUrl,
                    retailer,
                    inStock: true,
                    specs: {},
                    lastScraped: new Date(),
                };

                products.push(product);
            } catch (err) {
                console.error(`Error parsing ${retailer} product:`, err);
            }
        });

    } catch (error) {
        console.error(`Error scraping ${retailer}:`, error);
    }

    return products;
}

// Scrape a retailer's category
export async function scrapeCategory(
    retailer: RetailerKey,
    category: string
): Promise<ScraperResult> {
    const config = RETAILERS[retailer];
    const categoryConfig = config.categories[category as keyof typeof config.categories];

    if (!categoryConfig) {
        return {
            success: false,
            products: [],
            errors: [`Category ${category} not found for ${retailer}`],
            scrapedAt: new Date(),
        };
    }

    const url = `${config.baseUrl}${categoryConfig.url}`;
    const products: ScrapedProduct[] = [];
    const errors: string[] = [];

    try {
        if (retailer === "amazon_sa") {
            const browser = await getBrowser();
            const page = await browser.newPage();
            await page.setUserAgent(USER_AGENT);
            await page.setViewport({ width: 1920, height: 1080 });

            // Scrape first 3 pages
            for (let pageNum = 1; pageNum <= 3; pageNum++) {
                const pageUrl = pageNum === 1 ? url : `${url}&page=${pageNum}`;
                const pageProducts = await scrapeAmazonPage(page, pageUrl);
                products.push(...pageProducts);
                await delay(config.rateLimit);
            }

            await page.close();
        } else {
            const pageProducts = await scrapeStaticPage(url, retailer);
            products.push(...pageProducts);
        }
    } catch (error) {
        errors.push(`Error scraping ${retailer}/${category}: ${error}`);
    }

    return {
        success: errors.length === 0,
        products,
        errors,
        scrapedAt: new Date(),
    };
}

// Scrape all categories for a retailer
export async function scrapeRetailer(retailer: RetailerKey): Promise<ScraperResult> {
    const config = RETAILERS[retailer];
    const allProducts: ScrapedProduct[] = [];
    const allErrors: string[] = [];

    for (const category of Object.keys(config.categories)) {
        console.log(`Scraping ${retailer}/${category}...`);

        const result = await scrapeCategory(retailer, category);
        allProducts.push(...result.products);
        allErrors.push(...result.errors);

        await delay(config.rateLimit);
    }

    return {
        success: allErrors.length === 0,
        products: allProducts,
        errors: allErrors,
        scrapedAt: new Date(),
    };
}

// Scrape all retailers
export async function scrapeAll(): Promise<Map<RetailerKey, ScraperResult>> {
    const results = new Map<RetailerKey, ScraperResult>();

    for (const retailer of Object.keys(RETAILERS) as RetailerKey[]) {
        console.log(`Starting scrape for ${retailer}...`);

        try {
            const result = await scrapeRetailer(retailer);
            results.set(retailer, result);
            console.log(`Completed ${retailer}: ${result.products.length} products`);
        } catch (error) {
            results.set(retailer, {
                success: false,
                products: [],
                errors: [`Failed to scrape ${retailer}: ${error}`],
                scrapedAt: new Date(),
            });
        }
    }

    await closeBrowser();
    return results;
}

// Save scraped products to database
export async function saveToDatabase(products: ScrapedProduct[]): Promise<{
    inserted: number;
    updated: number;
    errors: string[];
}> {
    let inserted = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const product of products) {
        try {
            // Check if product exists (by name and brand)
            const existingProduct = await query(
                `SELECT id FROM products WHERE name = $1 AND brand = $2 LIMIT 1`,
                [product.name, product.brand]
            );

            if (!existingProduct) {
                errors.push(`Database not available for product: ${product.name}`);
                continue;
            }

            let productId: string;

            if (existingProduct.rows.length > 0) {
                productId = existingProduct.rows[0].id;

                // Update product image if we have a better one
                if (product.imageUrl) {
                    await query(
                        `UPDATE products SET image_url = $1, updated_at = NOW() WHERE id = $2`,
                        [product.imageUrl, productId]
                    );
                }
            } else {
                // Insert new product
                const insertResult = await query(
                    `INSERT INTO products (name, brand, model, category, image_url, specs)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
                    [product.name, product.brand, product.model, product.category, product.imageUrl, product.specs]
                );
                if (!insertResult) {
                    errors.push(`Failed to insert product: ${product.name}`);
                    continue;
                }
                productId = insertResult.rows[0].id;
                inserted++;
            }

            // Check if price exists for this retailer
            const existingPrice = await query(
                `SELECT id, price FROM prices WHERE product_id = $1 AND retailer = $2 LIMIT 1`,
                [productId, product.retailer]
            );

            if (!existingPrice) {
                errors.push(`Database not available for price: ${product.name}`);
                continue;
            }

            if (existingPrice.rows.length > 0) {
                const oldPrice = parseFloat(existingPrice.rows[0].price);
                const priceId = existingPrice.rows[0].id;

                // Update price if changed
                if (Math.abs(oldPrice - product.price) > 0.01) {
                    // Save to price history
                    await query(
                        `INSERT INTO price_history (price_id, price, in_stock) VALUES ($1, $2, $3)`,
                        [priceId, oldPrice, product.inStock]
                    );

                    // Update current price
                    await query(
                        `UPDATE prices SET 
              price = $1, 
              original_price = $2, 
              in_stock = $3, 
              url = $4, 
              last_checked = NOW() 
             WHERE id = $5`,
                        [product.price, product.originalPrice || null, product.inStock, product.url, priceId]
                    );
                    updated++;
                } else {
                    // Just update last_checked
                    await query(
                        `UPDATE prices SET last_checked = NOW(), in_stock = $1 WHERE id = $2`,
                        [product.inStock, priceId]
                    );
                }
            } else {
                // Insert new price
                await query(
                    `INSERT INTO prices (product_id, retailer, price, original_price, currency, url, in_stock)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [productId, product.retailer, product.price, product.originalPrice || null, product.currency, product.url, product.inStock]
                );
                inserted++;
            }

        } catch (error) {
            errors.push(`Error saving product ${product.name}: ${error}`);
        }
    }

    return { inserted, updated, errors };
}

// Export for API usage
export { getBrowser, closeBrowser };
