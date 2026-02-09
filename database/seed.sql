-- Seed data with REAL products available in Saudi Arabia
-- These are actual gaming products with realistic prices

-- Clear existing data (optional - comment out if you want to keep existing)
-- TRUNCATE products, prices, price_history CASCADE;

-- ============================================
-- GRAPHICS CARDS (GPUs)
-- ============================================

INSERT INTO products (id, name, brand, model, category, image_url, specs) VALUES
('a1111111-1111-1111-1111-111111111111', 'NVIDIA GeForce RTX 4090 Founders Edition', 'NVIDIA', 'RTX 4090 FE', 'gpu', 
 'https://m.media-amazon.com/images/I/61W4YoCOdAL._AC_SL1500_.jpg',
 '{"vram": 24, "vram_type": "GDDR6X", "cuda_cores": 16384, "base_clock": 2235, "boost_clock": 2520, "tdp": 450, "length_mm": 336}'::jsonb),

('a2222222-2222-2222-2222-222222222222', 'ASUS ROG Strix GeForce RTX 4080 Super OC', 'ASUS', 'ROG Strix RTX 4080S', 'gpu',
 'https://m.media-amazon.com/images/I/81GnqCuMwgL._AC_SL1500_.jpg',
 '{"vram": 16, "vram_type": "GDDR6X", "cuda_cores": 10240, "boost_clock": 2640, "tdp": 320}'::jsonb),

('a3333333-3333-3333-3333-333333333333', 'MSI Gaming GeForce RTX 4070 Ti Super', 'MSI', 'RTX 4070 Ti Super', 'gpu',
 'https://m.media-amazon.com/images/I/81aLBdpXVvL._AC_SL1500_.jpg',
 '{"vram": 16, "vram_type": "GDDR6X", "cuda_cores": 8448, "boost_clock": 2640, "tdp": 285}'::jsonb),

('a4444444-4444-4444-4444-444444444444', 'AMD Radeon RX 7900 XTX', 'AMD', 'RX 7900 XTX', 'gpu',
 'https://m.media-amazon.com/images/I/81YX7Y0Y-GL._AC_SL1500_.jpg',
 '{"vram": 24, "vram_type": "GDDR6", "stream_processors": 6144, "boost_clock": 2500, "tdp": 355}'::jsonb),

('a5555555-5555-5555-5555-555555555555', 'Gigabyte GeForce RTX 4060 Ti Gaming OC', 'Gigabyte', 'RTX 4060 Ti', 'gpu',
 'https://m.media-amazon.com/images/I/81qYpf1gKvL._AC_SL1500_.jpg',
 '{"vram": 8, "vram_type": "GDDR6", "cuda_cores": 4352, "boost_clock": 2580, "tdp": 160}'::jsonb);

-- GPU Prices from different retailers
INSERT INTO prices (product_id, retailer, price, original_price, currency, url, in_stock) VALUES
-- RTX 4090
('a1111111-1111-1111-1111-111111111111', 'amazon_sa', 7999, NULL, 'SAR', 'https://www.amazon.sa/dp/B0BLNDHD3J', true),
('a1111111-1111-1111-1111-111111111111', 'newegg', 7499, 7999, 'SAR', 'https://www.newegg.com/global/sa-en/p/N82E16814137766', true),
('a1111111-1111-1111-1111-111111111111', 'jarir', 8299, NULL, 'SAR', 'https://www.jarir.com/sa-en/nvidia-rtx-4090', true),
-- RTX 4080 Super
('a2222222-2222-2222-2222-222222222222', 'amazon_sa', 4899, 5299, 'SAR', 'https://www.amazon.sa/dp/B0CS6WF7J5', true),
('a2222222-2222-2222-2222-222222222222', 'newegg', 4699, NULL, 'SAR', 'https://www.newegg.com/global/sa-en/asus-rtx-4080-super', true),
('a2222222-2222-2222-2222-222222222222', 'pcd', 4799, NULL, 'SAR', 'https://pcd.com.sa/rtx-4080-super', true),
-- RTX 4070 Ti Super  
('a3333333-3333-3333-3333-333333333333', 'amazon_sa', 3499, 3799, 'SAR', 'https://www.amazon.sa/dp/B0CS67K3G3', true),
('a3333333-3333-3333-3333-333333333333', 'jarir', 3599, NULL, 'SAR', 'https://www.jarir.com/sa-en/msi-rtx-4070-ti-super', true),
('a3333333-3333-3333-3333-333333333333', 'extra', 3649, NULL, 'SAR', 'https://www.extra.com/en-sa/rtx-4070-ti-super', false),
-- RX 7900 XTX
('a4444444-4444-4444-4444-444444444444', 'amazon_sa', 4199, 4599, 'SAR', 'https://www.amazon.sa/dp/B0BS8QLDLS', true),
('a4444444-4444-4444-4444-444444444444', 'newegg', 3999, NULL, 'SAR', 'https://www.newegg.com/global/sa-en/amd-rx-7900-xtx', true),
-- RTX 4060 Ti
('a5555555-5555-5555-5555-555555555555', 'amazon_sa', 1799, NULL, 'SAR', 'https://www.amazon.sa/dp/B0C52R7YYC', true),
('a5555555-5555-5555-5555-555555555555', 'jarir', 1899, 2099, 'SAR', 'https://www.jarir.com/sa-en/gigabyte-rtx-4060-ti', true),
('a5555555-5555-5555-5555-555555555555', 'extra', 1849, NULL, 'SAR', 'https://www.extra.com/en-sa/rtx-4060-ti', true);

-- ============================================
-- PROCESSORS (CPUs)
-- ============================================

INSERT INTO products (id, name, brand, model, category, image_url, specs) VALUES
('b1111111-1111-1111-1111-111111111111', 'AMD Ryzen 9 7950X3D', 'AMD', '7950X3D', 'cpu',
 'https://m.media-amazon.com/images/I/51iji7Gel4L._AC_SL1280_.jpg',
 '{"cores": 16, "threads": 32, "base_clock": 4200, "boost_clock": 5700, "socket": "AM5", "tdp": 120, "cache": "144MB"}'::jsonb),

('b2222222-2222-2222-2222-222222222222', 'AMD Ryzen 7 7800X3D', 'AMD', '7800X3D', 'cpu',
 'https://m.media-amazon.com/images/I/51iji7Gel4L._AC_SL1280_.jpg',
 '{"cores": 8, "threads": 16, "base_clock": 4200, "boost_clock": 5000, "socket": "AM5", "tdp": 120, "cache": "104MB"}'::jsonb),

('b3333333-3333-3333-3333-333333333333', 'Intel Core i9-14900K', 'Intel', 'i9-14900K', 'cpu',
 'https://m.media-amazon.com/images/I/51-N3MJ6seL._AC_SL1500_.jpg',
 '{"cores": 24, "threads": 32, "base_clock": 3200, "boost_clock": 6000, "socket": "LGA1700", "tdp": 253}'::jsonb),

('b4444444-4444-4444-4444-444444444444', 'Intel Core i7-14700K', 'Intel', 'i7-14700K', 'cpu',
 'https://m.media-amazon.com/images/I/51-N3MJ6seL._AC_SL1500_.jpg',
 '{"cores": 20, "threads": 28, "base_clock": 3400, "boost_clock": 5600, "socket": "LGA1700", "tdp": 253}'::jsonb),

('b5555555-5555-5555-5555-555555555555', 'AMD Ryzen 5 7600X', 'AMD', '7600X', 'cpu',
 'https://m.media-amazon.com/images/I/51iji7Gel4L._AC_SL1280_.jpg',
 '{"cores": 6, "threads": 12, "base_clock": 4700, "boost_clock": 5300, "socket": "AM5", "tdp": 105}'::jsonb);

-- CPU Prices
INSERT INTO prices (product_id, retailer, price, original_price, currency, url, in_stock) VALUES
-- 7950X3D
('b1111111-1111-1111-1111-111111111111', 'amazon_sa', 2699, NULL, 'SAR', 'https://www.amazon.sa/dp/B0BTRRNK7T', true),
('b1111111-1111-1111-1111-111111111111', 'newegg', 2599, 2899, 'SAR', 'https://www.newegg.com/global/sa-en/amd-ryzen-9-7950x3d', true),
('b1111111-1111-1111-1111-111111111111', 'jarir', 2799, NULL, 'SAR', 'https://www.jarir.com/sa-en/amd-ryzen-9-7950x3d', true),
-- 7800X3D  
('b2222222-2222-2222-2222-222222222222', 'amazon_sa', 1699, 1899, 'SAR', 'https://www.amazon.sa/dp/B0BTZB7F88', true),
('b2222222-2222-2222-2222-222222222222', 'jarir', 1799, NULL, 'SAR', 'https://www.jarir.com/sa-en/amd-ryzen-7-7800x3d', true),
('b2222222-2222-2222-2222-222222222222', 'pcd', 1749, NULL, 'SAR', 'https://pcd.com.sa/amd-ryzen-7-7800x3d', true),
-- i9-14900K
('b3333333-3333-3333-3333-333333333333', 'amazon_sa', 2499, NULL, 'SAR', 'https://www.amazon.sa/dp/B0CHCMH49Y', true),
('b3333333-3333-3333-3333-333333333333', 'newegg', 2399, 2699, 'SAR', 'https://www.newegg.com/global/sa-en/intel-i9-14900k', true),
('b3333333-3333-3333-3333-333333333333', 'extra', 2549, NULL, 'SAR', 'https://www.extra.com/en-sa/intel-i9-14900k', false),
-- i7-14700K
('b4444444-4444-4444-4444-444444444444', 'amazon_sa', 1799, NULL, 'SAR', 'https://www.amazon.sa/dp/B0CHCMGNXV', true),
('b4444444-4444-4444-4444-444444444444', 'jarir', 1899, 2099, 'SAR', 'https://www.jarir.com/sa-en/intel-i7-14700k', true),
-- 7600X
('b5555555-5555-5555-5555-555555555555', 'amazon_sa', 849, 999, 'SAR', 'https://www.amazon.sa/dp/B0BBJFYBND', true),
('b5555555-5555-5555-5555-555555555555', 'extra', 899, NULL, 'SAR', 'https://www.extra.com/en-sa/amd-ryzen-5-7600x', true);

-- ============================================
-- GAMING MONITORS
-- ============================================

INSERT INTO products (id, name, brand, model, category, image_url, specs) VALUES
('c1111111-1111-1111-1111-111111111111', 'Samsung Odyssey G9 49" DQHD', 'Samsung', 'Odyssey G9 49', 'monitor',
 'https://m.media-amazon.com/images/I/81cmoNPoQsL._AC_SL1500_.jpg',
 '{"screen_size": 49, "resolution": "5120x1440", "refresh_rate": 240, "panel_type": "VA", "curved": true, "response_time": 1, "hdr": "HDR1000"}'::jsonb),

('c2222222-2222-2222-2222-222222222222', 'ASUS ROG Swift OLED PG27AQDM', 'ASUS', 'PG27AQDM', 'monitor',
 'https://m.media-amazon.com/images/I/81pKKqOOQsL._AC_SL1500_.jpg',
 '{"screen_size": 27, "resolution": "2560x1440", "refresh_rate": 240, "panel_type": "OLED", "response_time": 0.03, "hdr": "HDR True Black 400"}'::jsonb),

('c3333333-3333-3333-3333-333333333333', 'LG UltraGear 27GP850-B', 'LG', '27GP850-B', 'monitor',
 'https://m.media-amazon.com/images/I/81oupIS8qRL._AC_SL1500_.jpg',
 '{"screen_size": 27, "resolution": "2560x1440", "refresh_rate": 180, "panel_type": "Nano IPS", "response_time": 1, "hdr": "HDR400"}'::jsonb),

('c4444444-4444-4444-4444-444444444444', 'BenQ ZOWIE XL2546K', 'BenQ', 'XL2546K', 'monitor',
 'https://m.media-amazon.com/images/I/71GTQK0F9dL._AC_SL1500_.jpg',
 '{"screen_size": 24.5, "resolution": "1920x1080", "refresh_rate": 240, "panel_type": "TN", "response_time": 0.5, "dyac": true}'::jsonb),

('c5555555-5555-5555-5555-555555555555', 'Samsung Odyssey G7 32"', 'Samsung', 'Odyssey G7 32', 'monitor',
 'https://m.media-amazon.com/images/I/71p-M3-Z2bL._AC_SL1500_.jpg',
 '{"screen_size": 32, "resolution": "2560x1440", "refresh_rate": 240, "panel_type": "VA", "curved": true, "response_time": 1}'::jsonb);

-- Monitor Prices
INSERT INTO prices (product_id, retailer, price, original_price, currency, url, in_stock) VALUES
-- Odyssey G9 49"
('c1111111-1111-1111-1111-111111111111', 'amazon_sa', 4999, 5499, 'SAR', 'https://www.amazon.sa/dp/B088HH6LW5', true),
('c1111111-1111-1111-1111-111111111111', 'jarir', 5299, NULL, 'SAR', 'https://www.jarir.com/sa-en/samsung-odyssey-g9-49', true),
('c1111111-1111-1111-1111-111111111111', 'extra', 5199, NULL, 'SAR', 'https://www.extra.com/en-sa/samsung-odyssey-g9', false),
-- ASUS OLED PG27AQDM
('c2222222-2222-2222-2222-222222222222', 'amazon_sa', 3999, NULL, 'SAR', 'https://www.amazon.sa/dp/B0BV9TCC9H', true),
('c2222222-2222-2222-2222-222222222222', 'newegg', 3699, 4199, 'SAR', 'https://www.newegg.com/global/sa-en/asus-pg27aqdm', true),
('c2222222-2222-2222-2222-222222222222', 'pcd', 3899, NULL, 'SAR', 'https://pcd.com.sa/asus-pg27aqdm', true),
-- LG 27GP850
('c3333333-3333-3333-3333-333333333333', 'amazon_sa', 1499, 1799, 'SAR', 'https://www.amazon.sa/dp/B093MTSTKL', true),
('c3333333-3333-3333-3333-333333333333', 'jarir', 1599, NULL, 'SAR', 'https://www.jarir.com/sa-en/lg-ultragear-27gp850', true),
-- BenQ XL2546K
('c4444444-4444-4444-4444-444444444444', 'amazon_sa', 1899, NULL, 'SAR', 'https://www.amazon.sa/dp/B08KHG2WM1', true),
('c4444444-4444-4444-4444-444444444444', 'newegg', 1799, 1999, 'SAR', 'https://www.newegg.com/global/sa-en/benq-xl2546k', true),
-- Odyssey G7 32"
('c5555555-5555-5555-5555-555555555555', 'amazon_sa', 1999, 2399, 'SAR', 'https://www.amazon.sa/dp/B088HJ4VQK', true),
('c5555555-5555-5555-5555-555555555555', 'extra', 2099, NULL, 'SAR', 'https://www.extra.com/en-sa/samsung-odyssey-g7', true);

-- ============================================
-- GAMING MICE
-- ============================================

INSERT INTO products (id, name, brand, model, category, image_url, specs) VALUES
('d1111111-1111-1111-1111-111111111111', 'Logitech G Pro X Superlight 2', 'Logitech', 'GPX Superlight 2', 'mouse',
 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg',
 '{"dpi": 32000, "sensor": "HERO 2", "weight": 60, "wireless": true, "battery_life": 95, "polling_rate": 2000}'::jsonb),

('d2222222-2222-2222-2222-222222222222', 'Razer DeathAdder V3 Pro', 'Razer', 'DeathAdder V3 Pro', 'mouse',
 'https://m.media-amazon.com/images/I/61Hc6maoJCL._AC_SL1500_.jpg',
 '{"dpi": 35000, "sensor": "Focus Pro 35K", "weight": 63, "wireless": true, "battery_life": 90, "polling_rate": 4000}'::jsonb),

('d3333333-3333-3333-3333-333333333333', 'Finalmouse UltralightX', 'Finalmouse', 'UltralightX', 'mouse',
 'https://m.media-amazon.com/images/I/51K5Nb-XXPL._AC_SL1080_.jpg',
 '{"dpi": 26000, "sensor": "Finalsensor", "weight": 29, "wireless": true, "polling_rate": 8000}'::jsonb),

('d4444444-4444-4444-4444-444444444444', 'Pulsar X2 Wireless', 'Pulsar', 'X2', 'mouse',
 'https://m.media-amazon.com/images/I/51fNwl3bF4L._AC_SL1000_.jpg',
 '{"dpi": 26000, "sensor": "PAW3395", "weight": 56, "wireless": true, "battery_life": 70}'::jsonb),

('d5555555-5555-5555-5555-555555555555', 'Logitech G502 X Plus', 'Logitech', 'G502 X Plus', 'mouse',
 'https://m.media-amazon.com/images/I/61GJC8mLT+L._AC_SL1500_.jpg',
 '{"dpi": 25600, "sensor": "HERO 25K", "weight": 106, "wireless": true, "rgb": true}'::jsonb);

-- Mouse Prices
INSERT INTO prices (product_id, retailer, price, original_price, currency, url, in_stock) VALUES
-- GPX Superlight 2
('d1111111-1111-1111-1111-111111111111', 'amazon_sa', 649, 749, 'SAR', 'https://www.amazon.sa/dp/B0CKJ5GZYB', true),
('d1111111-1111-1111-1111-111111111111', 'jarir', 699, NULL, 'SAR', 'https://www.jarir.com/sa-en/logitech-gpx-superlight-2', true),
('d1111111-1111-1111-1111-111111111111', 'extra', 679, NULL, 'SAR', 'https://www.extra.com/en-sa/logitech-gpx-superlight-2', true),
-- DeathAdder V3 Pro
('d2222222-2222-2222-2222-222222222222', 'amazon_sa', 599, NULL, 'SAR', 'https://www.amazon.sa/dp/B0B6XDDCNR', true),
('d2222222-2222-2222-2222-222222222222', 'newegg', 579, 649, 'SAR', 'https://www.newegg.com/global/sa-en/razer-deathadder-v3-pro', true),
-- Finalmouse UltralightX
('d3333333-3333-3333-3333-333333333333', 'amazon_sa', 899, NULL, 'SAR', 'https://www.amazon.sa/dp/B0CSGK1MP2', false),
('d3333333-3333-3333-3333-333333333333', 'pcd', 949, NULL, 'SAR', 'https://pcd.com.sa/finalmouse-ultralightx', true),
-- Pulsar X2
('d4444444-4444-4444-4444-444444444444', 'amazon_sa', 449, 499, 'SAR', 'https://www.amazon.sa/dp/B0BXM89JDM', true),
('d4444444-4444-4444-4444-444444444444', 'pcd', 469, NULL, 'SAR', 'https://pcd.com.sa/pulsar-x2', true),
-- G502 X Plus
('d5555555-5555-5555-5555-555555555555', 'amazon_sa', 549, 649, 'SAR', 'https://www.amazon.sa/dp/B0B8N7117H', true),
('d5555555-5555-5555-5555-555555555555', 'jarir', 599, NULL, 'SAR', 'https://www.jarir.com/sa-en/logitech-g502-x-plus', true);

-- ============================================
-- GAMING KEYBOARDS
-- ============================================

INSERT INTO products (id, name, brand, model, category, image_url, specs) VALUES
('e1111111-1111-1111-1111-111111111111', 'Wooting 60HE+', 'Wooting', '60HE+', 'keyboard',
 'https://m.media-amazon.com/images/I/61H9l5c5SDL._AC_SL1500_.jpg',
 '{"switch_type": "Lekker L60", "layout": "60%", "hot_swappable": true, "rapid_trigger": true, "analog": true}'::jsonb),

('e2222222-2222-2222-2222-222222222222', 'Corsair K70 RGB Pro', 'Corsair', 'K70 RGB Pro', 'keyboard',
 'https://m.media-amazon.com/images/I/71cPIKykSvL._AC_SL1500_.jpg',
 '{"switch_type": "Cherry MX Red", "layout": "Full", "backlight": "RGB", "wrist_rest": true}'::jsonb),

('e3333333-3333-3333-3333-333333333333', 'Razer Huntsman V3 Pro', 'Razer', 'Huntsman V3 Pro', 'keyboard',
 'https://m.media-amazon.com/images/I/71o6Kp2m5bL._AC_SL1500_.jpg',
 '{"switch_type": "Razer Analog Optical", "layout": "Full", "rapid_trigger": true, "magnetic_wrist_rest": true}'::jsonb),

('e4444444-4444-4444-4444-444444444444', 'Keychron Q1 Pro', 'Keychron', 'Q1 Pro', 'keyboard',
 'https://m.media-amazon.com/images/I/71a7r0E8vhL._AC_SL1500_.jpg',
 '{"switch_type": "Gateron Jupiter Red", "layout": "75%", "wireless": true, "hot_swappable": true, "aluminum_case": true}'::jsonb);

-- Keyboard Prices
INSERT INTO prices (product_id, retailer, price, original_price, currency, url, in_stock) VALUES
-- Wooting 60HE+
('e1111111-1111-1111-1111-111111111111', 'amazon_sa', 899, NULL, 'SAR', 'https://www.amazon.sa/dp/B0CGXZ2QMK', true),
('e1111111-1111-1111-1111-111111111111', 'pcd', 949, NULL, 'SAR', 'https://pcd.com.sa/wooting-60he-plus', false),
-- K70 RGB Pro
('e2222222-2222-2222-2222-222222222222', 'amazon_sa', 449, 549, 'SAR', 'https://www.amazon.sa/dp/B09HMKT8VJ', true),
('e2222222-2222-2222-2222-222222222222', 'jarir', 479, NULL, 'SAR', 'https://www.jarir.com/sa-en/corsair-k70-rgb-pro', true),
('e2222222-2222-2222-2222-222222222222', 'extra', 499, NULL, 'SAR', 'https://www.extra.com/en-sa/corsair-k70-rgb-pro', true),
-- Huntsman V3 Pro
('e3333333-3333-3333-3333-333333333333', 'amazon_sa', 899, 999, 'SAR', 'https://www.amazon.sa/dp/B0CM65XFZZ', true),
('e3333333-3333-3333-3333-333333333333', 'newegg', 879, NULL, 'SAR', 'https://www.newegg.com/global/sa-en/razer-huntsman-v3-pro', true),
-- Keychron Q1 Pro
('e4444444-4444-4444-4444-444444444444', 'amazon_sa', 749, NULL, 'SAR', 'https://www.amazon.sa/dp/B0C1JLGTPQ', true);

-- ============================================
-- GAMING HEADSETS
-- ============================================

INSERT INTO products (id, name, brand, model, category, image_url, specs) VALUES
('f1111111-1111-1111-1111-111111111111', 'SteelSeries Arctis Nova Pro Wireless', 'SteelSeries', 'Arctis Nova Pro', 'headset',
 'https://m.media-amazon.com/images/I/61HFGTN2l0L._AC_SL1500_.jpg',
 '{"driver_size": 40, "wireless": true, "noise_cancelling": true, "battery_life": 44, "bluetooth": true, "game_dac": true}'::jsonb),

('f2222222-2222-2222-2222-222222222222', 'HyperX Cloud III Wireless', 'HyperX', 'Cloud III Wireless', 'headset',
 'https://m.media-amazon.com/images/I/71oo0l8c6SL._AC_SL1500_.jpg',
 '{"driver_size": 53, "wireless": true, "battery_life": 120, "dts_x": true}'::jsonb),

('f3333333-3333-3333-3333-333333333333', 'Logitech G Pro X 2 Lightspeed', 'Logitech', 'G Pro X 2', 'headset',
 'https://m.media-amazon.com/images/I/71x1FLDw+xL._AC_SL1500_.jpg',
 '{"driver_size": 50, "wireless": true, "battery_life": 50, "dts_x": true, "blue_voice": true}'::jsonb),

('f4444444-4444-4444-4444-444444444444', 'Razer BlackShark V2 Pro', 'Razer', 'BlackShark V2 Pro', 'headset',
 'https://m.media-amazon.com/images/I/71RJYl6mP0L._AC_SL1500_.jpg',
 '{"driver_size": 50, "wireless": true, "battery_life": 70, "thx_spatial": true}'::jsonb);

-- Headset Prices
INSERT INTO prices (product_id, retailer, price, original_price, currency, url, in_stock) VALUES
-- Arctis Nova Pro
('f1111111-1111-1111-1111-111111111111', 'amazon_sa', 1399, 1599, 'SAR', 'https://www.amazon.sa/dp/B09ZYC6GCQ', true),
('f1111111-1111-1111-1111-111111111111', 'jarir', 1499, NULL, 'SAR', 'https://www.jarir.com/sa-en/steelseries-arctis-nova-pro', true),
-- Cloud III Wireless
('f2222222-2222-2222-2222-222222222222', 'amazon_sa', 599, 699, 'SAR', 'https://www.amazon.sa/dp/B0C4PQHGXV', true),
('f2222222-2222-2222-2222-222222222222', 'extra', 649, NULL, 'SAR', 'https://www.extra.com/en-sa/hyperx-cloud-iii', true),
-- G Pro X 2
('f3333333-3333-3333-3333-333333333333', 'amazon_sa', 899, NULL, 'SAR', 'https://www.amazon.sa/dp/B0C4XNL7FT', true),
('f3333333-3333-3333-3333-333333333333', 'jarir', 949, NULL, 'SAR', 'https://www.jarir.com/sa-en/logitech-g-pro-x-2', true),
-- BlackShark V2 Pro
('f4444444-4444-4444-4444-444444444444', 'amazon_sa', 699, 799, 'SAR', 'https://www.amazon.sa/dp/B0BXM8GFLJ', true),
('f4444444-4444-4444-4444-444444444444', 'newegg', 679, NULL, 'SAR', 'https://www.newegg.com/global/sa-en/razer-blackshark-v2-pro', true);

-- ============================================
-- GAMING CONSOLES
-- ============================================

INSERT INTO products (id, name, brand, model, category, image_url, specs) VALUES
('g1111111-1111-1111-1111-111111111111', 'PlayStation 5 Slim', 'Sony', 'PS5 Slim', 'console',
 'https://m.media-amazon.com/images/I/41gT8ArSa+L._SL1500_.jpg',
 '{"storage": 1000, "max_resolution": "4K", "max_fps": 120, "disc_drive": true}'::jsonb),

('g2222222-2222-2222-2222-222222222222', 'PlayStation 5 Digital Edition', 'Sony', 'PS5 Digital', 'console',
 'https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_SL1500_.jpg',
 '{"storage": 1000, "max_resolution": "4K", "max_fps": 120, "disc_drive": false}'::jsonb),

('g3333333-3333-3333-3333-333333333333', 'Xbox Series X', 'Microsoft', 'Series X', 'console',
 'https://m.media-amazon.com/images/I/61-jjE67uqL._AC_SL1500_.jpg',
 '{"storage": 1000, "max_resolution": "4K", "max_fps": 120, "disc_drive": true}'::jsonb),

('g4444444-4444-4444-4444-444444444444', 'Nintendo Switch OLED', 'Nintendo', 'Switch OLED', 'console',
 'https://m.media-amazon.com/images/I/61i5IEqGqjL._AC_SL1500_.jpg',
 '{"storage": 64, "screen_size": 7, "panel_type": "OLED", "battery_life": 9}'::jsonb);

-- Console Prices
INSERT INTO prices (product_id, retailer, price, original_price, currency, url, in_stock) VALUES
-- PS5 Slim
('g1111111-1111-1111-1111-111111111111', 'amazon_sa', 2099, NULL, 'SAR', 'https://www.amazon.sa/dp/B0CL5KMD9G', true),
('g1111111-1111-1111-1111-111111111111', 'jarir', 1999, 2199, 'SAR', 'https://www.jarir.com/sa-en/sony-ps5-slim', true),
('g1111111-1111-1111-1111-111111111111', 'extra', 2049, NULL, 'SAR', 'https://www.extra.com/en-sa/ps5-slim', true),
-- PS5 Digital
('g2222222-2222-2222-2222-222222222222', 'amazon_sa', 1699, NULL, 'SAR', 'https://www.amazon.sa/dp/B0CL61F39H', true),
('g2222222-2222-2222-2222-222222222222', 'jarir', 1649, 1799, 'SAR', 'https://www.jarir.com/sa-en/sony-ps5-digital', true),
-- Xbox Series X
('g3333333-3333-3333-3333-333333333333', 'amazon_sa', 2199, NULL, 'SAR', 'https://www.amazon.sa/dp/B08H75RTZ8', true),
('g3333333-3333-3333-3333-333333333333', 'jarir', 2099, 2299, 'SAR', 'https://www.jarir.com/sa-en/xbox-series-x', true),
('g3333333-3333-3333-3333-333333333333', 'extra', 2149, NULL, 'SAR', 'https://www.extra.com/en-sa/xbox-series-x', false),
-- Switch OLED
('g4444444-4444-4444-4444-444444444444', 'amazon_sa', 1499, NULL, 'SAR', 'https://www.amazon.sa/dp/B098RJT9M4', true),
('g4444444-4444-4444-4444-444444444444', 'jarir', 1449, 1599, 'SAR', 'https://www.jarir.com/sa-en/nintendo-switch-oled', true),
('g4444444-4444-4444-4444-444444444444', 'extra', 1479, NULL, 'SAR', 'https://www.extra.com/en-sa/nintendo-switch-oled', true);
