-- SBGamers Database Schema for PostgreSQL (Crank.com compatible)
-- Run this to set up your database

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(500) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200),
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    specs JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Prices table (one product can have multiple prices from different retailers)
CREATE TABLE IF NOT EXISTS prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    retailer VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2), -- For tracking deals/discounts
    currency VARCHAR(3) DEFAULT 'SAR',
    url TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT true,
    sku VARCHAR(100),
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Composite index for fast lookups
CREATE INDEX IF NOT EXISTS idx_prices_product_retailer ON prices(product_id, retailer);
CREATE INDEX IF NOT EXISTS idx_prices_retailer ON prices(retailer);
CREATE INDEX IF NOT EXISTS idx_prices_in_stock ON prices(in_stock);

-- Price history for tracking changes over time
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_id UUID NOT NULL REFERENCES prices(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    in_stock BOOLEAN,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_price_id ON price_history(price_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);

-- Deals view - products with significant discounts
CREATE OR REPLACE VIEW active_deals AS
SELECT 
    p.id as product_id,
    p.name,
    p.brand,
    p.model,
    p.category,
    p.image_url,
    p.specs,
    pr.id as price_id,
    pr.retailer,
    pr.price as sale_price,
    pr.original_price,
    pr.currency,
    pr.url,
    pr.in_stock,
    ROUND(((pr.original_price - pr.price) / pr.original_price * 100)::numeric, 0) as discount_percent
FROM products p
JOIN prices pr ON p.id = pr.product_id
WHERE pr.original_price IS NOT NULL 
  AND pr.original_price > pr.price
  AND pr.in_stock = true
  AND ((pr.original_price - pr.price) / pr.original_price * 100) >= 10
ORDER BY discount_percent DESC;

-- Function to update timestamp on product update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Scrape logs for tracking scraper runs
CREATE TABLE IF NOT EXISTS scrape_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    products_found INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,
    errors TEXT[],
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_scrape_logs_retailer ON scrape_logs(retailer);
CREATE INDEX IF NOT EXISTS idx_scrape_logs_started_at ON scrape_logs(started_at);
