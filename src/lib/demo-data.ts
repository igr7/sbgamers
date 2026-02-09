// Demo data for local development when database is not available
import { Product, Price } from "@/types";

export interface DemoProduct extends Omit<Product, 'created_at' | 'updated_at'> {
    prices: DemoPrice[];
    lowest_price: DemoPrice | null;
}

export interface DemoPrice extends Omit<Price, 'last_checked'> {
    original_price?: number;
}

export const DEMO_PRODUCTS: DemoProduct[] = [
    // GPUs
    {
        id: "gpu-1",
        name: "NVIDIA GeForce RTX 4090 Founders Edition",
        brand: "NVIDIA",
        model: "RTX 4090 FE",
        category: "gpu",
        image_url: "https://m.media-amazon.com/images/I/61W4YoCOdAL._AC_SL1500_.jpg",
        specs: { vram: 24, vram_type: "GDDR6X", cuda_cores: 16384, boost_clock: 2520, tdp: 450 },
        prices: [
            { id: "p1", product_id: "gpu-1", retailer: "amazon_sa", price: 7999, currency: "SAR", url: "https://www.amazon.sa/dp/B0BLNDHD3J", in_stock: true },
            { id: "p2", product_id: "gpu-1", retailer: "newegg", price: 7499, original_price: 7999, currency: "SAR", url: "https://www.newegg.com/global/sa-en/p/N82E16814137766", in_stock: true },
            { id: "p3", product_id: "gpu-1", retailer: "jarir", price: 8299, currency: "SAR", url: "https://www.jarir.com/sa-en/nvidia-rtx-4090", in_stock: true },
        ],
        lowest_price: { id: "p2", product_id: "gpu-1", retailer: "newegg", price: 7499, original_price: 7999, currency: "SAR", url: "https://www.newegg.com/global/sa-en/p/N82E16814137766", in_stock: true },
    },
    {
        id: "gpu-2",
        name: "ASUS ROG Strix GeForce RTX 4080 Super OC",
        brand: "ASUS",
        model: "ROG Strix RTX 4080S",
        category: "gpu",
        image_url: "https://m.media-amazon.com/images/I/81GnqCuMwgL._AC_SL1500_.jpg",
        specs: { vram: 16, vram_type: "GDDR6X", cuda_cores: 10240, boost_clock: 2640, tdp: 320 },
        prices: [
            { id: "p4", product_id: "gpu-2", retailer: "amazon_sa", price: 4899, original_price: 5299, currency: "SAR", url: "https://www.amazon.sa/dp/B0CS6WF7J5", in_stock: true },
            { id: "p5", product_id: "gpu-2", retailer: "newegg", price: 4699, currency: "SAR", url: "https://www.newegg.com/global/sa-en/asus-rtx-4080-super", in_stock: true },
            { id: "p6", product_id: "gpu-2", retailer: "pcd", price: 4799, currency: "SAR", url: "https://pcd.com.sa/rtx-4080-super", in_stock: true },
        ],
        lowest_price: { id: "p5", product_id: "gpu-2", retailer: "newegg", price: 4699, currency: "SAR", url: "https://www.newegg.com/global/sa-en/asus-rtx-4080-super", in_stock: true },
    },
    {
        id: "gpu-3",
        name: "MSI Gaming GeForce RTX 4070 Ti Super",
        brand: "MSI",
        model: "RTX 4070 Ti Super",
        category: "gpu",
        image_url: "https://m.media-amazon.com/images/I/81aLBdpXVvL._AC_SL1500_.jpg",
        specs: { vram: 16, vram_type: "GDDR6X", cuda_cores: 8448, boost_clock: 2640, tdp: 285 },
        prices: [
            { id: "p7", product_id: "gpu-3", retailer: "amazon_sa", price: 3499, original_price: 3799, currency: "SAR", url: "https://www.amazon.sa/dp/B0CS67K3G3", in_stock: true },
            { id: "p8", product_id: "gpu-3", retailer: "jarir", price: 3599, currency: "SAR", url: "https://www.jarir.com/sa-en/msi-rtx-4070-ti-super", in_stock: true },
        ],
        lowest_price: { id: "p7", product_id: "gpu-3", retailer: "amazon_sa", price: 3499, original_price: 3799, currency: "SAR", url: "https://www.amazon.sa/dp/B0CS67K3G3", in_stock: true },
    },

    // CPUs
    {
        id: "cpu-1",
        name: "AMD Ryzen 9 7950X3D",
        brand: "AMD",
        model: "7950X3D",
        category: "cpu",
        image_url: "https://m.media-amazon.com/images/I/51iji7Gel4L._AC_SL1280_.jpg",
        specs: { cores: 16, threads: 32, base_clock: 4200, boost_clock: 5700, socket: "AM5", tdp: 120 },
        prices: [
            { id: "p10", product_id: "cpu-1", retailer: "amazon_sa", price: 2699, currency: "SAR", url: "https://www.amazon.sa/dp/B0BTRRNK7T", in_stock: true },
            { id: "p11", product_id: "cpu-1", retailer: "newegg", price: 2599, original_price: 2899, currency: "SAR", url: "https://www.newegg.com/global/sa-en/amd-ryzen-9-7950x3d", in_stock: true },
            { id: "p12", product_id: "cpu-1", retailer: "jarir", price: 2799, currency: "SAR", url: "https://www.jarir.com/sa-en/amd-ryzen-9-7950x3d", in_stock: true },
        ],
        lowest_price: { id: "p11", product_id: "cpu-1", retailer: "newegg", price: 2599, original_price: 2899, currency: "SAR", url: "https://www.newegg.com/global/sa-en/amd-ryzen-9-7950x3d", in_stock: true },
    },
    {
        id: "cpu-2",
        name: "AMD Ryzen 7 7800X3D",
        brand: "AMD",
        model: "7800X3D",
        category: "cpu",
        image_url: "https://m.media-amazon.com/images/I/51iji7Gel4L._AC_SL1280_.jpg",
        specs: { cores: 8, threads: 16, base_clock: 4200, boost_clock: 5000, socket: "AM5", tdp: 120 },
        prices: [
            { id: "p13", product_id: "cpu-2", retailer: "amazon_sa", price: 1699, original_price: 1899, currency: "SAR", url: "https://www.amazon.sa/dp/B0BTZB7F88", in_stock: true },
            { id: "p14", product_id: "cpu-2", retailer: "jarir", price: 1799, currency: "SAR", url: "https://www.jarir.com/sa-en/amd-ryzen-7-7800x3d", in_stock: true },
            { id: "p15", product_id: "cpu-2", retailer: "pcd", price: 1749, currency: "SAR", url: "https://pcd.com.sa/amd-ryzen-7-7800x3d", in_stock: true },
        ],
        lowest_price: { id: "p13", product_id: "cpu-2", retailer: "amazon_sa", price: 1699, original_price: 1899, currency: "SAR", url: "https://www.amazon.sa/dp/B0BTZB7F88", in_stock: true },
    },
    {
        id: "cpu-3",
        name: "Intel Core i9-14900K",
        brand: "Intel",
        model: "i9-14900K",
        category: "cpu",
        image_url: "https://m.media-amazon.com/images/I/51-N3MJ6seL._AC_SL1500_.jpg",
        specs: { cores: 24, threads: 32, base_clock: 3200, boost_clock: 6000, socket: "LGA1700", tdp: 253 },
        prices: [
            { id: "p16", product_id: "cpu-3", retailer: "amazon_sa", price: 2499, currency: "SAR", url: "https://www.amazon.sa/dp/B0CHCMH49Y", in_stock: true },
            { id: "p17", product_id: "cpu-3", retailer: "newegg", price: 2399, original_price: 2699, currency: "SAR", url: "https://www.newegg.com/global/sa-en/intel-i9-14900k", in_stock: true },
        ],
        lowest_price: { id: "p17", product_id: "cpu-3", retailer: "newegg", price: 2399, original_price: 2699, currency: "SAR", url: "https://www.newegg.com/global/sa-en/intel-i9-14900k", in_stock: true },
    },

    // Monitors
    {
        id: "mon-1",
        name: "Samsung Odyssey G9 49\" DQHD 240Hz",
        brand: "Samsung",
        model: "Odyssey G9 49",
        category: "monitor",
        image_url: "https://m.media-amazon.com/images/I/81cmoNPoQsL._AC_SL1500_.jpg",
        specs: { screen_size: 49, resolution: "5120x1440", refresh_rate: 240, panel_type: "VA", curved: true, response_time: 1 },
        prices: [
            { id: "p20", product_id: "mon-1", retailer: "amazon_sa", price: 4999, original_price: 5499, currency: "SAR", url: "https://www.amazon.sa/dp/B088HH6LW5", in_stock: true },
            { id: "p21", product_id: "mon-1", retailer: "jarir", price: 5299, currency: "SAR", url: "https://www.jarir.com/sa-en/samsung-odyssey-g9-49", in_stock: true },
        ],
        lowest_price: { id: "p20", product_id: "mon-1", retailer: "amazon_sa", price: 4999, original_price: 5499, currency: "SAR", url: "https://www.amazon.sa/dp/B088HH6LW5", in_stock: true },
    },
    {
        id: "mon-2",
        name: "ASUS ROG Swift OLED PG27AQDM 27\" 240Hz",
        brand: "ASUS",
        model: "PG27AQDM",
        category: "monitor",
        image_url: "https://m.media-amazon.com/images/I/81pKKqOOQsL._AC_SL1500_.jpg",
        specs: { screen_size: 27, resolution: "2560x1440", refresh_rate: 240, panel_type: "OLED", response_time: 0.03 },
        prices: [
            { id: "p22", product_id: "mon-2", retailer: "amazon_sa", price: 3999, currency: "SAR", url: "https://www.amazon.sa/dp/B0BV9TCC9H", in_stock: true },
            { id: "p23", product_id: "mon-2", retailer: "newegg", price: 3699, original_price: 4199, currency: "SAR", url: "https://www.newegg.com/global/sa-en/asus-pg27aqdm", in_stock: true },
            { id: "p24", product_id: "mon-2", retailer: "pcd", price: 3899, currency: "SAR", url: "https://pcd.com.sa/asus-pg27aqdm", in_stock: true },
        ],
        lowest_price: { id: "p23", product_id: "mon-2", retailer: "newegg", price: 3699, original_price: 4199, currency: "SAR", url: "https://www.newegg.com/global/sa-en/asus-pg27aqdm", in_stock: true },
    },
    {
        id: "mon-3",
        name: "LG UltraGear 27GP850-B 27\" 180Hz",
        brand: "LG",
        model: "27GP850-B",
        category: "monitor",
        image_url: "https://m.media-amazon.com/images/I/81oupIS8qRL._AC_SL1500_.jpg",
        specs: { screen_size: 27, resolution: "2560x1440", refresh_rate: 180, panel_type: "Nano IPS", response_time: 1 },
        prices: [
            { id: "p25", product_id: "mon-3", retailer: "amazon_sa", price: 1499, original_price: 1799, currency: "SAR", url: "https://www.amazon.sa/dp/B093MTSTKL", in_stock: true },
            { id: "p26", product_id: "mon-3", retailer: "jarir", price: 1599, currency: "SAR", url: "https://www.jarir.com/sa-en/lg-ultragear-27gp850", in_stock: true },
        ],
        lowest_price: { id: "p25", product_id: "mon-3", retailer: "amazon_sa", price: 1499, original_price: 1799, currency: "SAR", url: "https://www.amazon.sa/dp/B093MTSTKL", in_stock: true },
    },

    // Mice
    {
        id: "mouse-1",
        name: "Logitech G Pro X Superlight 2",
        brand: "Logitech",
        model: "GPX Superlight 2",
        category: "mouse",
        image_url: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg",
        specs: { dpi: 32000, sensor: "HERO 2", weight: 60, wireless: true, polling_rate: 2000 },
        prices: [
            { id: "p30", product_id: "mouse-1", retailer: "amazon_sa", price: 649, original_price: 749, currency: "SAR", url: "https://www.amazon.sa/dp/B0CKJ5GZYB", in_stock: true },
            { id: "p31", product_id: "mouse-1", retailer: "jarir", price: 699, currency: "SAR", url: "https://www.jarir.com/sa-en/logitech-gpx-superlight-2", in_stock: true },
            { id: "p32", product_id: "mouse-1", retailer: "extra", price: 679, currency: "SAR", url: "https://www.extra.com/en-sa/logitech-gpx-superlight-2", in_stock: true },
        ],
        lowest_price: { id: "p30", product_id: "mouse-1", retailer: "amazon_sa", price: 649, original_price: 749, currency: "SAR", url: "https://www.amazon.sa/dp/B0CKJ5GZYB", in_stock: true },
    },
    {
        id: "mouse-2",
        name: "Razer DeathAdder V3 Pro",
        brand: "Razer",
        model: "DeathAdder V3 Pro",
        category: "mouse",
        image_url: "https://m.media-amazon.com/images/I/61Hc6maoJCL._AC_SL1500_.jpg",
        specs: { dpi: 35000, sensor: "Focus Pro 35K", weight: 63, wireless: true, polling_rate: 4000 },
        prices: [
            { id: "p33", product_id: "mouse-2", retailer: "amazon_sa", price: 599, currency: "SAR", url: "https://www.amazon.sa/dp/B0B6XDDCNR", in_stock: true },
            { id: "p34", product_id: "mouse-2", retailer: "newegg", price: 579, original_price: 649, currency: "SAR", url: "https://www.newegg.com/global/sa-en/razer-deathadder-v3-pro", in_stock: true },
        ],
        lowest_price: { id: "p34", product_id: "mouse-2", retailer: "newegg", price: 579, original_price: 649, currency: "SAR", url: "https://www.newegg.com/global/sa-en/razer-deathadder-v3-pro", in_stock: true },
    },
    {
        id: "mouse-3",
        name: "Finalmouse UltralightX",
        brand: "Finalmouse",
        model: "UltralightX",
        category: "mouse",
        image_url: "https://m.media-amazon.com/images/I/51K5Nb-XXPL._AC_SL1080_.jpg",
        specs: { dpi: 26000, sensor: "Finalsensor", weight: 29, wireless: true, polling_rate: 8000 },
        prices: [
            { id: "p35", product_id: "mouse-3", retailer: "amazon_sa", price: 899, currency: "SAR", url: "https://www.amazon.sa/dp/B0CSGK1MP2", in_stock: false },
            { id: "p36", product_id: "mouse-3", retailer: "pcd", price: 949, currency: "SAR", url: "https://pcd.com.sa/finalmouse-ultralightx", in_stock: true },
        ],
        lowest_price: { id: "p36", product_id: "mouse-3", retailer: "pcd", price: 949, currency: "SAR", url: "https://pcd.com.sa/finalmouse-ultralightx", in_stock: true },
    },

    // Keyboards
    {
        id: "kb-1",
        name: "Wooting 60HE+",
        brand: "Wooting",
        model: "60HE+",
        category: "keyboard",
        image_url: "https://m.media-amazon.com/images/I/61H9l5c5SDL._AC_SL1500_.jpg",
        specs: { switch_type: "Lekker L60", layout: "60%", hot_swappable: true, wireless: false },
        prices: [
            { id: "p40", product_id: "kb-1", retailer: "amazon_sa", price: 899, currency: "SAR", url: "https://www.amazon.sa/dp/B0CGXZ2QMK", in_stock: true },
            { id: "p41", product_id: "kb-1", retailer: "pcd", price: 949, currency: "SAR", url: "https://pcd.com.sa/wooting-60he-plus", in_stock: false },
        ],
        lowest_price: { id: "p40", product_id: "kb-1", retailer: "amazon_sa", price: 899, currency: "SAR", url: "https://www.amazon.sa/dp/B0CGXZ2QMK", in_stock: true },
    },
    {
        id: "kb-2",
        name: "Corsair K70 RGB Pro",
        brand: "Corsair",
        model: "K70 RGB Pro",
        category: "keyboard",
        image_url: "https://m.media-amazon.com/images/I/71cPIKykSvL._AC_SL1500_.jpg",
        specs: { switch_type: "Cherry MX Red", layout: "Full", backlight: "RGB", wireless: false },
        prices: [
            { id: "p42", product_id: "kb-2", retailer: "amazon_sa", price: 449, original_price: 549, currency: "SAR", url: "https://www.amazon.sa/dp/B09HMKT8VJ", in_stock: true },
            { id: "p43", product_id: "kb-2", retailer: "jarir", price: 479, currency: "SAR", url: "https://www.jarir.com/sa-en/corsair-k70-rgb-pro", in_stock: true },
            { id: "p44", product_id: "kb-2", retailer: "extra", price: 499, currency: "SAR", url: "https://www.extra.com/en-sa/corsair-k70-rgb-pro", in_stock: true },
        ],
        lowest_price: { id: "p42", product_id: "kb-2", retailer: "amazon_sa", price: 449, original_price: 549, currency: "SAR", url: "https://www.amazon.sa/dp/B09HMKT8VJ", in_stock: true },
    },

    // Headsets
    {
        id: "head-1",
        name: "SteelSeries Arctis Nova Pro Wireless",
        brand: "SteelSeries",
        model: "Arctis Nova Pro",
        category: "headset",
        image_url: "https://m.media-amazon.com/images/I/61HFGTN2l0L._AC_SL1500_.jpg",
        specs: { driver_size: 40, wireless: true, noise_cancelling: true, battery_life: 44 },
        prices: [
            { id: "p50", product_id: "head-1", retailer: "amazon_sa", price: 1399, original_price: 1599, currency: "SAR", url: "https://www.amazon.sa/dp/B09ZYC6GCQ", in_stock: true },
            { id: "p51", product_id: "head-1", retailer: "jarir", price: 1499, currency: "SAR", url: "https://www.jarir.com/sa-en/steelseries-arctis-nova-pro", in_stock: true },
        ],
        lowest_price: { id: "p50", product_id: "head-1", retailer: "amazon_sa", price: 1399, original_price: 1599, currency: "SAR", url: "https://www.amazon.sa/dp/B09ZYC6GCQ", in_stock: true },
    },
    {
        id: "head-2",
        name: "HyperX Cloud III Wireless",
        brand: "HyperX",
        model: "Cloud III Wireless",
        category: "headset",
        image_url: "https://m.media-amazon.com/images/I/71oo0l8c6SL._AC_SL1500_.jpg",
        specs: { driver_size: 53, wireless: true, battery_life: 120 },
        prices: [
            { id: "p52", product_id: "head-2", retailer: "amazon_sa", price: 599, original_price: 699, currency: "SAR", url: "https://www.amazon.sa/dp/B0C4PQHGXV", in_stock: true },
            { id: "p53", product_id: "head-2", retailer: "extra", price: 649, currency: "SAR", url: "https://www.extra.com/en-sa/hyperx-cloud-iii", in_stock: true },
        ],
        lowest_price: { id: "p52", product_id: "head-2", retailer: "amazon_sa", price: 599, original_price: 699, currency: "SAR", url: "https://www.amazon.sa/dp/B0C4PQHGXV", in_stock: true },
    },

    // Consoles
    {
        id: "con-1",
        name: "PlayStation 5 Slim",
        brand: "Sony",
        model: "PS5 Slim",
        category: "console",
        image_url: "https://m.media-amazon.com/images/I/41gT8ArSa+L._SL1500_.jpg",
        specs: { console_storage: 1000, max_resolution: "4K", max_fps: 120, digital_only: false },
        prices: [
            { id: "p60", product_id: "con-1", retailer: "amazon_sa", price: 2099, currency: "SAR", url: "https://www.amazon.sa/dp/B0CL5KMD9G", in_stock: true },
            { id: "p61", product_id: "con-1", retailer: "jarir", price: 1999, original_price: 2199, currency: "SAR", url: "https://www.jarir.com/sa-en/sony-ps5-slim", in_stock: true },
            { id: "p62", product_id: "con-1", retailer: "extra", price: 2049, currency: "SAR", url: "https://www.extra.com/en-sa/ps5-slim", in_stock: true },
        ],
        lowest_price: { id: "p61", product_id: "con-1", retailer: "jarir", price: 1999, original_price: 2199, currency: "SAR", url: "https://www.jarir.com/sa-en/sony-ps5-slim", in_stock: true },
    },
    {
        id: "con-2",
        name: "Xbox Series X",
        brand: "Microsoft",
        model: "Series X",
        category: "console",
        image_url: "https://m.media-amazon.com/images/I/61-jjE67uqL._AC_SL1500_.jpg",
        specs: { console_storage: 1000, max_resolution: "4K", max_fps: 120, digital_only: false },
        prices: [
            { id: "p63", product_id: "con-2", retailer: "amazon_sa", price: 2199, currency: "SAR", url: "https://www.amazon.sa/dp/B08H75RTZ8", in_stock: true },
            { id: "p64", product_id: "con-2", retailer: "jarir", price: 2099, original_price: 2299, currency: "SAR", url: "https://www.jarir.com/sa-en/xbox-series-x", in_stock: true },
            { id: "p65", product_id: "con-2", retailer: "extra", price: 2149, currency: "SAR", url: "https://www.extra.com/en-sa/xbox-series-x", in_stock: false },
        ],
        lowest_price: { id: "p64", product_id: "con-2", retailer: "jarir", price: 2099, original_price: 2299, currency: "SAR", url: "https://www.jarir.com/sa-en/xbox-series-x", in_stock: true },
    },
    {
        id: "con-3",
        name: "Nintendo Switch OLED",
        brand: "Nintendo",
        model: "Switch OLED",
        category: "console",
        image_url: "https://m.media-amazon.com/images/I/61i5IEqGqjL._AC_SL1500_.jpg",
        specs: { console_storage: 64, screen_size: 7, panel_type: "OLED", battery_life: 9 },
        prices: [
            { id: "p66", product_id: "con-3", retailer: "amazon_sa", price: 1499, currency: "SAR", url: "https://www.amazon.sa/dp/B098RJT9M4", in_stock: true },
            { id: "p67", product_id: "con-3", retailer: "jarir", price: 1449, original_price: 1599, currency: "SAR", url: "https://www.jarir.com/sa-en/nintendo-switch-oled", in_stock: true },
            { id: "p68", product_id: "con-3", retailer: "extra", price: 1479, currency: "SAR", url: "https://www.extra.com/en-sa/nintendo-switch-oled", in_stock: true },
        ],
        lowest_price: { id: "p67", product_id: "con-3", retailer: "jarir", price: 1449, original_price: 1599, currency: "SAR", url: "https://www.jarir.com/sa-en/nintendo-switch-oled", in_stock: true },
    },

    // Gaming Laptops
    {
        id: "laptop-1",
        name: "ASUS ROG Zephyrus G16 RTX 4090",
        brand: "ASUS",
        model: "ROG Zephyrus G16",
        category: "gaming_laptop",
        image_url: "https://m.media-amazon.com/images/I/81PJGO6p2yL._AC_SL1500_.jpg",
        specs: { processor: "Intel Core i9-14900HX", graphics: "RTX 4090 16GB", display: "16\" QHD+ 240Hz OLED", ram_size: 32, storage_size: 2000, battery: "90Wh" },
        prices: [
            { id: "p70", product_id: "laptop-1", retailer: "amazon_sa", price: 14999, original_price: 16499, currency: "SAR", url: "https://www.amazon.sa/dp/B0CXDNQ9WD", in_stock: true },
            { id: "p71", product_id: "laptop-1", retailer: "jarir", price: 15499, currency: "SAR", url: "https://www.jarir.com/sa-en/asus-rog-zephyrus-g16", in_stock: true },
            { id: "p72", product_id: "laptop-1", retailer: "extra", price: 15299, currency: "SAR", url: "https://www.extra.com/en-sa/asus-rog-zephyrus-g16", in_stock: true },
        ],
        lowest_price: { id: "p70", product_id: "laptop-1", retailer: "amazon_sa", price: 14999, original_price: 16499, currency: "SAR", url: "https://www.amazon.sa/dp/B0CXDNQ9WD", in_stock: true },
    },
    {
        id: "laptop-2",
        name: "Razer Blade 18 RTX 4080",
        brand: "Razer",
        model: "Blade 18",
        category: "gaming_laptop",
        image_url: "https://m.media-amazon.com/images/I/71lmXzz6fVL._AC_SL1500_.jpg",
        specs: { processor: "Intel Core i9-13950HX", graphics: "RTX 4080 12GB", display: "18\" QHD+ 240Hz", ram_size: 32, storage_size: 1000 },
        prices: [
            { id: "p73", product_id: "laptop-2", retailer: "amazon_sa", price: 13999, currency: "SAR", url: "https://www.amazon.sa/dp/B0BSQ8HJPC", in_stock: true },
            { id: "p74", product_id: "laptop-2", retailer: "newegg", price: 13499, original_price: 14499, currency: "SAR", url: "https://www.newegg.com/global/sa-en/razer-blade-18", in_stock: true },
        ],
        lowest_price: { id: "p74", product_id: "laptop-2", retailer: "newegg", price: 13499, original_price: 14499, currency: "SAR", url: "https://www.newegg.com/global/sa-en/razer-blade-18", in_stock: true },
    },
    {
        id: "laptop-3",
        name: "MSI Titan GT77 HX RTX 4090",
        brand: "MSI",
        model: "Titan GT77 HX",
        category: "gaming_laptop",
        image_url: "https://m.media-amazon.com/images/I/71j4TqQDxML._AC_SL1500_.jpg",
        specs: { processor: "Intel Core i9-13980HX", graphics: "RTX 4090 16GB", display: "17.3\" 4K 144Hz Mini LED", ram_size: 64, storage_size: 2000 },
        prices: [
            { id: "p75", product_id: "laptop-3", retailer: "amazon_sa", price: 18999, currency: "SAR", url: "https://www.amazon.sa/dp/B0BVJPHX94", in_stock: true },
            { id: "p76", product_id: "laptop-3", retailer: "jarir", price: 18499, original_price: 19999, currency: "SAR", url: "https://www.jarir.com/sa-en/msi-titan-gt77", in_stock: true },
        ],
        lowest_price: { id: "p76", product_id: "laptop-3", retailer: "jarir", price: 18499, original_price: 19999, currency: "SAR", url: "https://www.jarir.com/sa-en/msi-titan-gt77", in_stock: true },
    },

    // Gaming PCs
    {
        id: "pc-1",
        name: "NZXT Player: Three RTX 4080 Super",
        brand: "NZXT",
        model: "Player Three",
        category: "gaming_pc",
        image_url: "https://m.media-amazon.com/images/I/71mE1pkBYKL._AC_SL1500_.jpg",
        specs: { processor: "Intel Core i7-14700KF", graphics: "RTX 4080 Super", ram_size: 32, storage_size: 2000, os: "Windows 11 Home" },
        prices: [
            { id: "p80", product_id: "pc-1", retailer: "amazon_sa", price: 9999, original_price: 10999, currency: "SAR", url: "https://www.amazon.sa/dp/B0CSKQKD96", in_stock: true },
            { id: "p81", product_id: "pc-1", retailer: "newegg", price: 9699, currency: "SAR", url: "https://www.newegg.com/global/sa-en/nzxt-player-three", in_stock: true },
        ],
        lowest_price: { id: "p81", product_id: "pc-1", retailer: "newegg", price: 9699, currency: "SAR", url: "https://www.newegg.com/global/sa-en/nzxt-player-three", in_stock: true },
    },
    {
        id: "pc-2",
        name: "Alienware Aurora R16 RTX 4090",
        brand: "Alienware",
        model: "Aurora R16",
        category: "gaming_pc",
        image_url: "https://m.media-amazon.com/images/I/71ZBbQYpCML._AC_SL1500_.jpg",
        specs: { processor: "Intel Core i9-14900KF", graphics: "RTX 4090", ram_size: 64, storage_size: 4000, os: "Windows 11 Pro" },
        prices: [
            { id: "p82", product_id: "pc-2", retailer: "amazon_sa", price: 15999, currency: "SAR", url: "https://www.amazon.sa/dp/B0CNXP7CLJ", in_stock: true },
            { id: "p83", product_id: "pc-2", retailer: "extra", price: 15499, original_price: 16999, currency: "SAR", url: "https://www.extra.com/en-sa/alienware-aurora-r16", in_stock: true },
        ],
        lowest_price: { id: "p83", product_id: "pc-2", retailer: "extra", price: 15499, original_price: 16999, currency: "SAR", url: "https://www.extra.com/en-sa/alienware-aurora-r16", in_stock: true },
    },

    // Gaming Chairs
    {
        id: "chair-1",
        name: "Secretlab TITAN Evo 2024",
        brand: "Secretlab",
        model: "TITAN Evo 2024",
        category: "gaming_chair",
        image_url: "https://m.media-amazon.com/images/I/71m7RsYYl9L._AC_SL1500_.jpg",
        specs: { max_weight: 130, material: "NEO Hybrid Leatherette", armrests: "4D", recline_angle: 165 },
        prices: [
            { id: "p90", product_id: "chair-1", retailer: "amazon_sa", price: 2199, original_price: 2499, currency: "SAR", url: "https://www.amazon.sa/dp/B0C5RH7RGJ", in_stock: true },
            { id: "p91", product_id: "chair-1", retailer: "jarir", price: 2299, currency: "SAR", url: "https://www.jarir.com/sa-en/secretlab-titan-evo", in_stock: true },
        ],
        lowest_price: { id: "p90", product_id: "chair-1", retailer: "amazon_sa", price: 2199, original_price: 2499, currency: "SAR", url: "https://www.amazon.sa/dp/B0C5RH7RGJ", in_stock: true },
    },
    {
        id: "chair-2",
        name: "Herman Miller x Logitech Embody Gaming Chair",
        brand: "Herman Miller",
        model: "Embody Gaming",
        category: "gaming_chair",
        image_url: "https://m.media-amazon.com/images/I/71YB6VjEoML._AC_SL1500_.jpg",
        specs: { max_weight: 136, material: "Sync Fabric", armrests: "Fully Adjustable" },
        prices: [
            { id: "p92", product_id: "chair-2", retailer: "amazon_sa", price: 6499, currency: "SAR", url: "https://www.amazon.sa/dp/B08L8LG4M3", in_stock: true },
            { id: "p93", product_id: "chair-2", retailer: "newegg", price: 6199, original_price: 6899, currency: "SAR", url: "https://www.newegg.com/global/sa-en/herman-miller-embody", in_stock: true },
        ],
        lowest_price: { id: "p93", product_id: "chair-2", retailer: "newegg", price: 6199, original_price: 6899, currency: "SAR", url: "https://www.newegg.com/global/sa-en/herman-miller-embody", in_stock: true },
    },
    {
        id: "chair-3",
        name: "Razer Iskur V2 Gaming Chair",
        brand: "Razer",
        model: "Iskur V2",
        category: "gaming_chair",
        image_url: "https://m.media-amazon.com/images/I/71YI3n2CDIL._AC_SL1500_.jpg",
        specs: { max_weight: 136, material: "EPU Synthetic Leather", armrests: "4D", recline_angle: 152 },
        prices: [
            { id: "p94", product_id: "chair-3", retailer: "amazon_sa", price: 1899, currency: "SAR", url: "https://www.amazon.sa/dp/B0CLYLGLXJ", in_stock: true },
            { id: "p95", product_id: "chair-3", retailer: "jarir", price: 1799, original_price: 1999, currency: "SAR", url: "https://www.jarir.com/sa-en/razer-iskur-v2", in_stock: true },
            { id: "p96", product_id: "chair-3", retailer: "extra", price: 1849, currency: "SAR", url: "https://www.extra.com/en-sa/razer-iskur-v2", in_stock: true },
        ],
        lowest_price: { id: "p95", product_id: "chair-3", retailer: "jarir", price: 1799, original_price: 1999, currency: "SAR", url: "https://www.jarir.com/sa-en/razer-iskur-v2", in_stock: true },
    },

    // VR Headsets
    {
        id: "vr-1",
        name: "Meta Quest 3 512GB",
        brand: "Meta",
        model: "Quest 3 512GB",
        category: "vr_headset",
        image_url: "https://m.media-amazon.com/images/I/61XMbk2cDPL._AC_SL1500_.jpg",
        specs: { resolution: "2064x2208 per eye", refresh_rate: 120, field_of_view: 110, tracking: "Inside-out", controllers_included: true },
        prices: [
            { id: "p100", product_id: "vr-1", retailer: "amazon_sa", price: 2499, original_price: 2799, currency: "SAR", url: "https://www.amazon.sa/dp/B0CD1JTBSC", in_stock: true },
            { id: "p101", product_id: "vr-1", retailer: "jarir", price: 2599, currency: "SAR", url: "https://www.jarir.com/sa-en/meta-quest-3", in_stock: true },
            { id: "p102", product_id: "vr-1", retailer: "extra", price: 2549, currency: "SAR", url: "https://www.extra.com/en-sa/meta-quest-3", in_stock: true },
        ],
        lowest_price: { id: "p100", product_id: "vr-1", retailer: "amazon_sa", price: 2499, original_price: 2799, currency: "SAR", url: "https://www.amazon.sa/dp/B0CD1JTBSC", in_stock: true },
    },
    {
        id: "vr-2",
        name: "PlayStation VR2",
        brand: "Sony",
        model: "PSVR2",
        category: "vr_headset",
        image_url: "https://m.media-amazon.com/images/I/51paGWnvMhL._AC_SL1500_.jpg",
        specs: { resolution: "2000x2040 per eye", refresh_rate: 120, field_of_view: 110, tracking: "Inside-out with eye tracking", controllers_included: true },
        prices: [
            { id: "p103", product_id: "vr-2", retailer: "amazon_sa", price: 2099, currency: "SAR", url: "https://www.amazon.sa/dp/B0BSRF7DPP", in_stock: true },
            { id: "p104", product_id: "vr-2", retailer: "jarir", price: 1999, original_price: 2299, currency: "SAR", url: "https://www.jarir.com/sa-en/playstation-vr2", in_stock: true },
            { id: "p105", product_id: "vr-2", retailer: "extra", price: 2049, currency: "SAR", url: "https://www.extra.com/en-sa/playstation-vr2", in_stock: false },
        ],
        lowest_price: { id: "p104", product_id: "vr-2", retailer: "jarir", price: 1999, original_price: 2299, currency: "SAR", url: "https://www.jarir.com/sa-en/playstation-vr2", in_stock: true },
    },
    {
        id: "vr-3",
        name: "Valve Index VR Kit",
        brand: "Valve",
        model: "Index Full Kit",
        category: "vr_headset",
        image_url: "https://m.media-amazon.com/images/I/61lqVPIGvPL._AC_SL1500_.jpg",
        specs: { resolution: "1440x1600 per eye", refresh_rate: 144, field_of_view: 130, tracking: "Base Station", controllers_included: true },
        prices: [
            { id: "p106", product_id: "vr-3", retailer: "amazon_sa", price: 4499, currency: "SAR", url: "https://www.amazon.sa/dp/B07VPRVQPT", in_stock: false },
            { id: "p107", product_id: "vr-3", retailer: "newegg", price: 4299, original_price: 4699, currency: "SAR", url: "https://www.newegg.com/global/sa-en/valve-index", in_stock: true },
        ],
        lowest_price: { id: "p107", product_id: "vr-3", retailer: "newegg", price: 4299, original_price: 4699, currency: "SAR", url: "https://www.newegg.com/global/sa-en/valve-index", in_stock: true },
    },
];

// Helper to get demo deals (products with discount)
export function getDemoDeals() {
    return DEMO_PRODUCTS
        .filter(p => p.lowest_price?.original_price && p.lowest_price.original_price > p.lowest_price.price)
        .map(p => {
            const discount = Math.round(((p.lowest_price!.original_price! - p.lowest_price!.price) / p.lowest_price!.original_price!) * 100);
            const savings = p.lowest_price!.original_price! - p.lowest_price!.price;
            return {
                id: p.id,
                product: {
                    id: p.id,
                    name: p.name,
                    brand: p.brand,
                    model: p.model,
                    category: p.category,
                    image_url: p.image_url,
                    specs: p.specs,
                },
                prices: p.prices,
                lowest_price: p.lowest_price,
                original_price: p.lowest_price!.original_price!,
                sale_price: p.lowest_price!.price,
                discount_percent: discount,
                savings,
            };
        })
        .sort((a, b) => b.discount_percent - a.discount_percent);
}

