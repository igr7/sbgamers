-- SBGamers Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories enum (expanded for all product types)
CREATE TYPE category_type AS ENUM (
  -- PC Components
  'cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler',
  -- Displays
  'monitor', 'tv',
  -- Peripherals
  'keyboard', 'mouse', 'headset', 'mousepad', 'webcam', 'microphone', 'controller',
  -- Gaming Consoles
  'console', 'console_accessory'
);

-- Retailers enum
CREATE TYPE retailer_type AS ENUM (
  'amazon_sa', 'amazon_ae', 'newegg', 'jarir', 'softland'
);

-- Currency enum
CREATE TYPE currency_type AS ENUM ('SAR', 'AED', 'USD');

-- Alert type enum
CREATE TYPE alert_type AS ENUM ('price_drop', 'stock', 'target_price');

-- Products table
CREATE TABLE products (
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

-- Create index for faster searches
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));

-- Prices table (current prices)
CREATE TABLE prices (
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

CREATE INDEX idx_prices_product ON prices(product_id);
CREATE INDEX idx_prices_retailer ON prices(retailer);

-- Price history table (for charts)
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  retailer retailer_type NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency currency_type NOT NULL DEFAULT 'SAR',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_date ON price_history(recorded_at);

-- Alert subscriptions (email-based, no auth)
CREATE TABLE alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  target_price DECIMAL(10, 2),
  alert_type alert_type NOT NULL DEFAULT 'price_drop',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, product_id, alert_type)
);

CREATE INDEX idx_alerts_email ON alert_subscriptions(email);
CREATE INDEX idx_alerts_product ON alert_subscriptions(product_id);

-- Compatibility rules table (for PC Builder)
CREATE TABLE compatibility_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_type VARCHAR(100) NOT NULL,
  source_category category_type NOT NULL,
  target_category category_type NOT NULL,
  source_field VARCHAR(100) NOT NULL,
  target_field VARCHAR(100) NOT NULL,
  comparison VARCHAR(20) NOT NULL,
  error_message TEXT NOT NULL
);

-- Insert default compatibility rules
INSERT INTO compatibility_rules (rule_type, source_category, target_category, source_field, target_field, comparison, error_message) VALUES
  ('socket_match', 'cpu', 'motherboard', 'socket', 'socket', 'equals', 'CPU socket does not match motherboard socket'),
  ('socket_match', 'cpu', 'cooler', 'socket', 'supported_sockets', 'contains', 'CPU cooler does not support this CPU socket'),
  ('ram_type', 'ram', 'motherboard', 'memory_type', 'memory_type', 'equals', 'RAM type is not compatible with motherboard'),
  ('gpu_clearance', 'gpu', 'case', 'length_mm', 'max_gpu_length', 'lte', 'GPU is too long for this case'),
  ('cooler_clearance', 'cooler', 'case', 'cooler_height', 'max_cooler_height', 'lte', 'CPU cooler is too tall for this case'),
  ('ram_clearance', 'ram', 'cooler', 'height_mm', 'cooler_height', 'lte', 'RAM may interfere with CPU cooler');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products table
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- View for products with lowest price
CREATE VIEW products_with_lowest_price AS
SELECT
  p.*,
  (
    SELECT json_agg(pr.*)
    FROM prices pr
    WHERE pr.product_id = p.id
  ) as prices,
  (
    SELECT pr.*
    FROM prices pr
    WHERE pr.product_id = p.id AND pr.in_stock = true
    ORDER BY pr.price ASC
    LIMIT 1
  ) as lowest_price
FROM products p;

-- Row Level Security (for public read access)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products and prices
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON prices FOR SELECT USING (true);
CREATE POLICY "Public read access" ON price_history FOR SELECT USING (true);

-- Allow public insert for alert subscriptions
CREATE POLICY "Public insert alerts" ON alert_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own alerts" ON alert_subscriptions FOR SELECT USING (true);
