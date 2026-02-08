import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Migration SQL - Schema
const schemaSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories enum (expanded for all product types)
DO $$ BEGIN
  CREATE TYPE category_type AS ENUM (
    'cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler',
    'monitor', 'tv',
    'keyboard', 'mouse', 'headset', 'mousepad', 'webcam', 'microphone', 'controller',
    'console', 'console_accessory'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Retailers enum
DO $$ BEGIN
  CREATE TYPE retailer_type AS ENUM (
    'amazon_sa', 'amazon_ae', 'newegg', 'jarir', 'softland'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Currency enum
DO $$ BEGIN
  CREATE TYPE currency_type AS ENUM ('SAR', 'AED', 'USD');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Alert type enum
DO $$ BEGIN
  CREATE TYPE alert_type AS ENUM ('price_drop', 'stock', 'target_price');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(200) NOT NULL,
  category category_type NOT NULL,
  image_url TEXT,
  specs JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Prices table
CREATE TABLE IF NOT EXISTS prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  retailer retailer_type NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency currency_type NOT NULL DEFAULT 'SAR',
  url TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, retailer)
);

CREATE INDEX IF NOT EXISTS idx_prices_product ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_retailer ON prices(retailer);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  retailer retailer_type NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency currency_type NOT NULL DEFAULT 'SAR',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_date ON price_history(recorded_at);

-- Alert subscriptions
CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  target_price DECIMAL(10, 2),
  alert_type alert_type NOT NULL DEFAULT 'price_drop',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, product_id, alert_type)
);

CREATE INDEX IF NOT EXISTS idx_alerts_email ON alert_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_alerts_product ON alert_subscriptions(product_id);

-- Compatibility rules table
CREATE TABLE IF NOT EXISTS compatibility_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_type VARCHAR(100) NOT NULL,
  source_category category_type NOT NULL,
  target_category category_type NOT NULL,
  source_field VARCHAR(100) NOT NULL,
  target_field VARCHAR(100) NOT NULL,
  comparison VARCHAR(20) NOT NULL,
  error_message TEXT NOT NULL
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products table
DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
`;

// Seed data SQL
const seedSQL = `
-- Insert sample products (skip if already exists)
INSERT INTO products (id, name, brand, model, category, specs) VALUES
  ('11111111-1111-1111-1111-111111111101', 'AMD Ryzen 9 7950X', 'AMD', '7950X', 'cpu', '{"cores": 16, "threads": 32, "base_clock": 4500, "boost_clock": 5700, "socket": "AM5", "tdp": 170}'),
  ('11111111-1111-1111-1111-111111111102', 'Intel Core i9-14900K', 'Intel', 'i9-14900K', 'cpu', '{"cores": 24, "threads": 32, "base_clock": 3200, "boost_clock": 6000, "socket": "LGA1700", "tdp": 253}'),
  ('11111111-1111-1111-1111-111111111103', 'AMD Ryzen 7 7800X3D', 'AMD', '7800X3D', 'cpu', '{"cores": 8, "threads": 16, "base_clock": 4200, "boost_clock": 5000, "socket": "AM5", "tdp": 120}'),
  ('11111111-1111-1111-1111-111111111104', 'Intel Core i7-14700K', 'Intel', 'i7-14700K', 'cpu', '{"cores": 20, "threads": 28, "base_clock": 3400, "boost_clock": 5600, "socket": "LGA1700", "tdp": 253}'),
  ('11111111-1111-1111-1111-111111111201', 'NVIDIA GeForce RTX 4090', 'NVIDIA', 'RTX 4090', 'gpu', '{"vram": 24, "vram_type": "GDDR6X", "cuda_cores": 16384, "tdp": 450, "length_mm": 336}'),
  ('11111111-1111-1111-1111-111111111202', 'NVIDIA GeForce RTX 4080 Super', 'NVIDIA', 'RTX 4080S', 'gpu', '{"vram": 16, "vram_type": "GDDR6X", "cuda_cores": 10240, "tdp": 320, "length_mm": 304}'),
  ('11111111-1111-1111-1111-111111111203', 'AMD Radeon RX 7900 XTX', 'AMD', 'RX 7900 XTX', 'gpu', '{"vram": 24, "vram_type": "GDDR6", "cuda_cores": 6144, "tdp": 355, "length_mm": 287}'),
  ('11111111-1111-1111-1111-111111111204', 'NVIDIA GeForce RTX 4070 Ti Super', 'NVIDIA', 'RTX 4070TiS', 'gpu', '{"vram": 16, "vram_type": "GDDR6X", "cuda_cores": 8448, "tdp": 285, "length_mm": 285}'),
  ('11111111-1111-1111-1111-111111111301', 'Samsung Odyssey G9 49"', 'Samsung', 'G9', 'monitor', '{"screen_size": 49, "resolution": "5120x1440", "refresh_rate": 240, "panel_type": "VA", "curved": true, "response_time": 1}'),
  ('11111111-1111-1111-1111-111111111302', 'LG UltraGear 27GP950', 'LG', '27GP950', 'monitor', '{"screen_size": 27, "resolution": "3840x2160", "refresh_rate": 160, "panel_type": "IPS", "hdr": true, "response_time": 1}'),
  ('11111111-1111-1111-1111-111111111303', 'ASUS ROG Swift PG32UQX', 'ASUS', 'PG32UQX', 'monitor', '{"screen_size": 32, "resolution": "3840x2160", "refresh_rate": 144, "panel_type": "IPS", "hdr": true, "response_time": 4}'),
  ('11111111-1111-1111-1111-111111111401', 'PlayStation 5', 'Sony', 'PS5', 'console', '{"console_generation": "9th", "console_storage": 825, "max_resolution": "4K", "max_fps": 120, "digital_only": false}'),
  ('11111111-1111-1111-1111-111111111402', 'PlayStation 5 Digital Edition', 'Sony', 'PS5 Digital', 'console', '{"console_generation": "9th", "console_storage": 825, "max_resolution": "4K", "max_fps": 120, "digital_only": true}'),
  ('11111111-1111-1111-1111-111111111403', 'Xbox Series X', 'Microsoft', 'Series X', 'console', '{"console_generation": "9th", "console_storage": 1000, "max_resolution": "4K", "max_fps": 120, "digital_only": false}'),
  ('11111111-1111-1111-1111-111111111404', 'Nintendo Switch OLED', 'Nintendo', 'Switch OLED', 'console', '{"console_generation": "8th", "console_storage": 64, "max_resolution": "1080p", "max_fps": 60}'),
  ('11111111-1111-1111-1111-111111111501', 'Logitech G Pro X', 'Logitech', 'G Pro X', 'keyboard', '{"switch_type": "GX Blue", "layout": "TKL", "backlight": "RGB", "wireless": false, "hot_swappable": true}'),
  ('11111111-1111-1111-1111-111111111502', 'Razer Huntsman V3 Pro', 'Razer', 'Huntsman V3', 'keyboard', '{"switch_type": "Analog Optical", "layout": "Full", "backlight": "RGB", "wireless": false}'),
  ('11111111-1111-1111-1111-111111111503', 'Corsair K70 RGB Pro', 'Corsair', 'K70 Pro', 'keyboard', '{"switch_type": "Cherry MX Red", "layout": "Full", "backlight": "RGB", "wireless": false}'),
  ('11111111-1111-1111-1111-111111111601', 'Logitech G Pro X Superlight 2', 'Logitech', 'GPX2', 'mouse', '{"dpi": 32000, "sensor": "HERO 2", "weight": 60, "wireless": true, "polling_rate": 2000}'),
  ('11111111-1111-1111-1111-111111111602', 'Razer DeathAdder V3 Pro', 'Razer', 'DAV3 Pro', 'mouse', '{"dpi": 30000, "sensor": "Focus Pro", "weight": 63, "wireless": true, "polling_rate": 4000}'),
  ('11111111-1111-1111-1111-111111111603', 'Finalmouse UltralightX', 'Finalmouse', 'UltralightX', 'mouse', '{"dpi": 26000, "weight": 40, "wireless": true, "polling_rate": 8000}'),
  ('11111111-1111-1111-1111-111111111701', 'SteelSeries Arctis Nova Pro Wireless', 'SteelSeries', 'Nova Pro', 'headset', '{"driver_size": 40, "wireless": true, "noise_cancelling": true, "battery_life": 44, "microphone": true, "surround_sound": "360"}'),
  ('11111111-1111-1111-1111-111111111702', 'Logitech G Pro X 2 Lightspeed', 'Logitech', 'GPX2', 'headset', '{"driver_size": 50, "wireless": true, "noise_cancelling": false, "battery_life": 50, "microphone": true}'),
  ('11111111-1111-1111-1111-111111111703', 'HyperX Cloud III Wireless', 'HyperX', 'Cloud III', 'headset', '{"driver_size": 53, "wireless": true, "battery_life": 120, "microphone": true}'),
  ('11111111-1111-1111-1111-111111111801', 'LG C3 65" OLED', 'LG', 'OLED65C3', 'tv', '{"screen_size": 65, "resolution": "3840x2160", "refresh_rate": 120, "panel_type": "OLED", "hdr": true, "smart_tv": true}'),
  ('11111111-1111-1111-1111-111111111802', 'Samsung QN90C 55" Neo QLED', 'Samsung', 'QN55QN90C', 'tv', '{"screen_size": 55, "resolution": "3840x2160", "refresh_rate": 144, "panel_type": "Mini LED", "hdr": true, "smart_tv": true}'),
  ('11111111-1111-1111-1111-111111111803', 'Sony A95L 65" QD-OLED', 'Sony', 'XR65A95L', 'tv', '{"screen_size": 65, "resolution": "3840x2160", "refresh_rate": 120, "panel_type": "QD-OLED", "hdr": true, "smart_tv": true}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample prices
INSERT INTO prices (product_id, retailer, price, currency, url, in_stock) VALUES
  ('11111111-1111-1111-1111-111111111101', 'amazon_sa', 2299.00, 'SAR', 'https://amazon.sa/dp/B0BBHD5D8Y', true),
  ('11111111-1111-1111-1111-111111111101', 'jarir', 2399.00, 'SAR', 'https://jarir.com/sa-en/amd-ryzen-9-7950x', true),
  ('11111111-1111-1111-1111-111111111101', 'newegg', 2199.00, 'SAR', 'https://newegg.com/amd-ryzen-9-7950x', false),
  ('11111111-1111-1111-1111-111111111102', 'amazon_sa', 2499.00, 'SAR', 'https://amazon.sa/dp/B0CHBH5GYK', true),
  ('11111111-1111-1111-1111-111111111102', 'jarir', 2599.00, 'SAR', 'https://jarir.com/sa-en/intel-i9-14900k', true),
  ('11111111-1111-1111-1111-111111111103', 'amazon_sa', 1799.00, 'SAR', 'https://amazon.sa/dp/B0BTZB7F88', true),
  ('11111111-1111-1111-1111-111111111104', 'amazon_sa', 1699.00, 'SAR', 'https://amazon.sa/dp/B0CHBH5GYL', true),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7499.00, 'SAR', 'https://amazon.sa/dp/B0BGP8FGNZ', true),
  ('11111111-1111-1111-1111-111111111201', 'newegg', 7299.00, 'SAR', 'https://newegg.com/nvidia-rtx-4090', true),
  ('11111111-1111-1111-1111-111111111202', 'amazon_sa', 4499.00, 'SAR', 'https://amazon.sa/dp/B0CS6XC79Y', true),
  ('11111111-1111-1111-1111-111111111203', 'amazon_sa', 3999.00, 'SAR', 'https://amazon.sa/dp/B0BSHJ9YXG', true),
  ('11111111-1111-1111-1111-111111111204', 'amazon_sa', 3199.00, 'SAR', 'https://amazon.sa/dp/B0CS6XBVNZ', true),
  ('11111111-1111-1111-1111-111111111301', 'amazon_sa', 4999.00, 'SAR', 'https://amazon.sa/dp/B088HH6LW5', true),
  ('11111111-1111-1111-1111-111111111302', 'amazon_sa', 2999.00, 'SAR', 'https://amazon.sa/dp/B09QG3BPR7', true),
  ('11111111-1111-1111-1111-111111111303', 'amazon_sa', 11999.00, 'SAR', 'https://amazon.sa/dp/B09QKXZX5Y', false),
  ('11111111-1111-1111-1111-111111111401', 'jarir', 2099.00, 'SAR', 'https://jarir.com/sa-en/playstation-5', true),
  ('11111111-1111-1111-1111-111111111401', 'amazon_sa', 2199.00, 'SAR', 'https://amazon.sa/dp/B08H93ZRK9', true),
  ('11111111-1111-1111-1111-111111111402', 'jarir', 1899.00, 'SAR', 'https://jarir.com/sa-en/ps5-digital', true),
  ('11111111-1111-1111-1111-111111111403', 'jarir', 2199.00, 'SAR', 'https://jarir.com/sa-en/xbox-series-x', true),
  ('11111111-1111-1111-1111-111111111404', 'amazon_sa', 1499.00, 'SAR', 'https://amazon.sa/dp/B098RKWHHZ', true),
  ('11111111-1111-1111-1111-111111111501', 'amazon_sa', 549.00, 'SAR', 'https://amazon.sa/dp/B07QQB9VCV', true),
  ('11111111-1111-1111-1111-111111111502', 'amazon_sa', 899.00, 'SAR', 'https://amazon.sa/dp/B0CHVJZ5VK', true),
  ('11111111-1111-1111-1111-111111111503', 'amazon_sa', 649.00, 'SAR', 'https://amazon.sa/dp/B09HGDKX3P', true),
  ('11111111-1111-1111-1111-111111111601', 'amazon_sa', 649.00, 'SAR', 'https://amazon.sa/dp/B0CKJ7J5ZY', true),
  ('11111111-1111-1111-1111-111111111602', 'amazon_sa', 599.00, 'SAR', 'https://amazon.sa/dp/B0B6HFCQWM', true),
  ('11111111-1111-1111-1111-111111111603', 'amazon_sa', 799.00, 'SAR', 'https://amazon.sa/dp/B0CXYZ1234', false),
  ('11111111-1111-1111-1111-111111111701', 'amazon_sa', 1399.00, 'SAR', 'https://amazon.sa/dp/B09ZWMXL5P', true),
  ('11111111-1111-1111-1111-111111111702', 'amazon_sa', 999.00, 'SAR', 'https://amazon.sa/dp/B0C5HQWX7K', true),
  ('11111111-1111-1111-1111-111111111703', 'amazon_sa', 599.00, 'SAR', 'https://amazon.sa/dp/B0CGXYZ789', true),
  ('11111111-1111-1111-1111-111111111801', 'amazon_sa', 8499.00, 'SAR', 'https://amazon.sa/dp/B0BVXF72HV', true),
  ('11111111-1111-1111-1111-111111111801', 'jarir', 8999.00, 'SAR', 'https://jarir.com/sa-en/lg-c3-65', true),
  ('11111111-1111-1111-1111-111111111802', 'amazon_sa', 5999.00, 'SAR', 'https://amazon.sa/dp/B0BV1VWKQ2', true),
  ('11111111-1111-1111-1111-111111111803', 'amazon_sa', 12999.00, 'SAR', 'https://amazon.sa/dp/B0C1XYZABC', true)
ON CONFLICT (product_id, retailer) DO NOTHING;

-- Insert price history
INSERT INTO price_history (product_id, retailer, price, currency, recorded_at) VALUES
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 8499.00, 'SAR', NOW() - INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 8299.00, 'SAR', NOW() - INTERVAL '75 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7999.00, 'SAR', NOW() - INTERVAL '60 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7799.00, 'SAR', NOW() - INTERVAL '45 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7699.00, 'SAR', NOW() - INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7599.00, 'SAR', NOW() - INTERVAL '15 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7499.00, 'SAR', NOW());

-- Insert compatibility rules
INSERT INTO compatibility_rules (rule_type, source_category, target_category, source_field, target_field, comparison, error_message)
SELECT * FROM (VALUES
  ('socket_match', 'cpu'::category_type, 'motherboard'::category_type, 'socket', 'socket', 'equals', 'CPU socket does not match motherboard socket'),
  ('socket_match', 'cpu'::category_type, 'cooler'::category_type, 'socket', 'supported_sockets', 'contains', 'CPU cooler does not support this CPU socket'),
  ('ram_type', 'ram'::category_type, 'motherboard'::category_type, 'memory_type', 'memory_type', 'equals', 'RAM type is not compatible with motherboard'),
  ('gpu_clearance', 'gpu'::category_type, 'case'::category_type, 'length_mm', 'max_gpu_length', 'lte', 'GPU is too long for this case'),
  ('cooler_clearance', 'cooler'::category_type, 'case'::category_type, 'cooler_height', 'max_cooler_height', 'lte', 'CPU cooler is too tall for this case'),
  ('ram_clearance', 'ram'::category_type, 'cooler'::category_type, 'height_mm', 'cooler_height', 'lte', 'RAM may interfere with CPU cooler')
) AS v(rule_type, source_category, target_category, source_field, target_field, comparison, error_message)
WHERE NOT EXISTS (SELECT 1 FROM compatibility_rules LIMIT 1);
`;

export async function GET(request: NextRequest) {
  // Simple secret key protection
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== "sbgamers2024migrate") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const results: string[] = [];

  try {
    // Run schema migration
    results.push("Starting schema migration...");
    await pool.query(schemaSQL);
    results.push("✓ Schema migration completed");

    // Run seed data
    results.push("Starting seed data...");
    await pool.query(seedSQL);
    results.push("✓ Seed data completed");

    // Verify
    const productCount = await pool.query("SELECT COUNT(*) FROM products");
    const priceCount = await pool.query("SELECT COUNT(*) FROM prices");

    results.push(`✓ Products: ${productCount.rows[0].count}`);
    results.push(`✓ Prices: ${priceCount.rows[0].count}`);
    results.push("");
    results.push("Migration completed successfully!");

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error: any) {
    results.push(`✗ Error: ${error.message}`);
    return NextResponse.json({
      success: false,
      results,
      error: error.message
    }, { status: 500 });
  } finally {
    await pool.end();
  }
}
