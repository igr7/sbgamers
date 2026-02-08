-- Seed Data for SBGamers
-- Run this after the initial schema migration

-- Insert sample products

-- CPUs
INSERT INTO products (id, name, brand, model, category, specs) VALUES
  ('11111111-1111-1111-1111-111111111101', 'AMD Ryzen 9 7950X', 'AMD', '7950X', 'cpu', '{"cores": 16, "threads": 32, "base_clock": 4500, "boost_clock": 5700, "socket": "AM5", "tdp": 170}'),
  ('11111111-1111-1111-1111-111111111102', 'Intel Core i9-14900K', 'Intel', 'i9-14900K', 'cpu', '{"cores": 24, "threads": 32, "base_clock": 3200, "boost_clock": 6000, "socket": "LGA1700", "tdp": 253}'),
  ('11111111-1111-1111-1111-111111111103', 'AMD Ryzen 7 7800X3D', 'AMD', '7800X3D', 'cpu', '{"cores": 8, "threads": 16, "base_clock": 4200, "boost_clock": 5000, "socket": "AM5", "tdp": 120}'),
  ('11111111-1111-1111-1111-111111111104', 'Intel Core i7-14700K', 'Intel', 'i7-14700K', 'cpu', '{"cores": 20, "threads": 28, "base_clock": 3400, "boost_clock": 5600, "socket": "LGA1700", "tdp": 253}');

-- GPUs
INSERT INTO products (id, name, brand, model, category, specs) VALUES
  ('11111111-1111-1111-1111-111111111201', 'NVIDIA GeForce RTX 4090', 'NVIDIA', 'RTX 4090', 'gpu', '{"vram": 24, "vram_type": "GDDR6X", "cuda_cores": 16384, "tdp": 450, "length_mm": 336}'),
  ('11111111-1111-1111-1111-111111111202', 'NVIDIA GeForce RTX 4080 Super', 'NVIDIA', 'RTX 4080S', 'gpu', '{"vram": 16, "vram_type": "GDDR6X", "cuda_cores": 10240, "tdp": 320, "length_mm": 304}'),
  ('11111111-1111-1111-1111-111111111203', 'AMD Radeon RX 7900 XTX', 'AMD', 'RX 7900 XTX', 'gpu', '{"vram": 24, "vram_type": "GDDR6", "cuda_cores": 6144, "tdp": 355, "length_mm": 287}'),
  ('11111111-1111-1111-1111-111111111204', 'NVIDIA GeForce RTX 4070 Ti Super', 'NVIDIA', 'RTX 4070TiS', 'gpu', '{"vram": 16, "vram_type": "GDDR6X", "cuda_cores": 8448, "tdp": 285, "length_mm": 285}');

-- Monitors
INSERT INTO products (id, name, brand, model, category, specs) VALUES
  ('11111111-1111-1111-1111-111111111301', 'Samsung Odyssey G9 49"', 'Samsung', 'G9', 'monitor', '{"screen_size": 49, "resolution": "5120x1440", "refresh_rate": 240, "panel_type": "VA", "curved": true, "response_time": 1}'),
  ('11111111-1111-1111-1111-111111111302', 'LG UltraGear 27GP950', 'LG', '27GP950', 'monitor', '{"screen_size": 27, "resolution": "3840x2160", "refresh_rate": 160, "panel_type": "IPS", "hdr": true, "response_time": 1}'),
  ('11111111-1111-1111-1111-111111111303', 'ASUS ROG Swift PG32UQX', 'ASUS', 'PG32UQX', 'monitor', '{"screen_size": 32, "resolution": "3840x2160", "refresh_rate": 144, "panel_type": "IPS", "hdr": true, "response_time": 4}');

-- Gaming Consoles
INSERT INTO products (id, name, brand, model, category, specs) VALUES
  ('11111111-1111-1111-1111-111111111401', 'PlayStation 5', 'Sony', 'PS5', 'console', '{"console_generation": "9th", "console_storage": 825, "max_resolution": "4K", "max_fps": 120, "digital_only": false}'),
  ('11111111-1111-1111-1111-111111111402', 'PlayStation 5 Digital Edition', 'Sony', 'PS5 Digital', 'console', '{"console_generation": "9th", "console_storage": 825, "max_resolution": "4K", "max_fps": 120, "digital_only": true}'),
  ('11111111-1111-1111-1111-111111111403', 'Xbox Series X', 'Microsoft', 'Series X', 'console', '{"console_generation": "9th", "console_storage": 1000, "max_resolution": "4K", "max_fps": 120, "digital_only": false}'),
  ('11111111-1111-1111-1111-111111111404', 'Nintendo Switch OLED', 'Nintendo', 'Switch OLED', 'console', '{"console_generation": "8th", "console_storage": 64, "max_resolution": "1080p", "max_fps": 60}');

-- Keyboards
INSERT INTO products (id, name, brand, model, category, specs) VALUES
  ('11111111-1111-1111-1111-111111111501', 'Logitech G Pro X', 'Logitech', 'G Pro X', 'keyboard', '{"switch_type": "GX Blue", "layout": "TKL", "backlight": "RGB", "wireless": false, "hot_swappable": true}'),
  ('11111111-1111-1111-1111-111111111502', 'Razer Huntsman V3 Pro', 'Razer', 'Huntsman V3', 'keyboard', '{"switch_type": "Analog Optical", "layout": "Full", "backlight": "RGB", "wireless": false}'),
  ('11111111-1111-1111-1111-111111111503', 'Corsair K70 RGB Pro', 'Corsair', 'K70 Pro', 'keyboard', '{"switch_type": "Cherry MX Red", "layout": "Full", "backlight": "RGB", "wireless": false}');

-- Mice
INSERT INTO products (id, name, brand, model, category, specs) VALUES
  ('11111111-1111-1111-1111-111111111601', 'Logitech G Pro X Superlight 2', 'Logitech', 'GPX2', 'mouse', '{"dpi": 32000, "sensor": "HERO 2", "weight": 60, "wireless": true, "polling_rate": 2000}'),
  ('11111111-1111-1111-1111-111111111602', 'Razer DeathAdder V3 Pro', 'Razer', 'DAV3 Pro', 'mouse', '{"dpi": 30000, "sensor": "Focus Pro", "weight": 63, "wireless": true, "polling_rate": 4000}'),
  ('11111111-1111-1111-1111-111111111603', 'Finalmouse UltralightX', 'Finalmouse', 'UltralightX', 'mouse', '{"dpi": 26000, "weight": 40, "wireless": true, "polling_rate": 8000}');

-- Headsets
INSERT INTO products (id, name, brand, model, category, specs) VALUES
  ('11111111-1111-1111-1111-111111111701', 'SteelSeries Arctis Nova Pro Wireless', 'SteelSeries', 'Nova Pro', 'headset', '{"driver_size": 40, "wireless": true, "noise_cancelling": true, "battery_life": 44, "microphone": true, "surround_sound": "360"}'),
  ('11111111-1111-1111-1111-111111111702', 'Logitech G Pro X 2 Lightspeed', 'Logitech', 'GPX2', 'headset', '{"driver_size": 50, "wireless": true, "noise_cancelling": false, "battery_life": 50, "microphone": true}'),
  ('11111111-1111-1111-1111-111111111703', 'HyperX Cloud III Wireless', 'HyperX', 'Cloud III', 'headset', '{"driver_size": 53, "wireless": true, "battery_life": 120, "microphone": true}');

-- TVs
INSERT INTO products (id, name, brand, model, category, specs) VALUES
  ('11111111-1111-1111-1111-111111111801', 'LG C3 65" OLED', 'LG', 'OLED65C3', 'tv', '{"screen_size": 65, "resolution": "3840x2160", "refresh_rate": 120, "panel_type": "OLED", "hdr": true, "smart_tv": true}'),
  ('11111111-1111-1111-1111-111111111802', 'Samsung QN90C 55" Neo QLED', 'Samsung', 'QN55QN90C', 'tv', '{"screen_size": 55, "resolution": "3840x2160", "refresh_rate": 144, "panel_type": "Mini LED", "hdr": true, "smart_tv": true}'),
  ('11111111-1111-1111-1111-111111111803', 'Sony A95L 65" QD-OLED', 'Sony', 'XR65A95L', 'tv', '{"screen_size": 65, "resolution": "3840x2160", "refresh_rate": 120, "panel_type": "QD-OLED", "hdr": true, "smart_tv": true}');

-- Insert sample prices
INSERT INTO prices (product_id, retailer, price, currency, url, in_stock) VALUES
  -- CPUs
  ('11111111-1111-1111-1111-111111111101', 'amazon_sa', 2299.00, 'SAR', 'https://amazon.sa/dp/B0BBHD5D8Y', true),
  ('11111111-1111-1111-1111-111111111101', 'jarir', 2399.00, 'SAR', 'https://jarir.com/sa-en/amd-ryzen-9-7950x', true),
  ('11111111-1111-1111-1111-111111111101', 'newegg', 2199.00, 'SAR', 'https://newegg.com/amd-ryzen-9-7950x', false),
  ('11111111-1111-1111-1111-111111111102', 'amazon_sa', 2499.00, 'SAR', 'https://amazon.sa/dp/B0CHBH5GYK', true),
  ('11111111-1111-1111-1111-111111111102', 'jarir', 2599.00, 'SAR', 'https://jarir.com/sa-en/intel-i9-14900k', true),
  ('11111111-1111-1111-1111-111111111103', 'amazon_sa', 1799.00, 'SAR', 'https://amazon.sa/dp/B0BTZB7F88', true),
  ('11111111-1111-1111-1111-111111111104', 'amazon_sa', 1699.00, 'SAR', 'https://amazon.sa/dp/B0CHBH5GYL', true),

  -- GPUs
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7499.00, 'SAR', 'https://amazon.sa/dp/B0BGP8FGNZ', true),
  ('11111111-1111-1111-1111-111111111201', 'newegg', 7299.00, 'SAR', 'https://newegg.com/nvidia-rtx-4090', true),
  ('11111111-1111-1111-1111-111111111202', 'amazon_sa', 4499.00, 'SAR', 'https://amazon.sa/dp/B0CS6XC79Y', true),
  ('11111111-1111-1111-1111-111111111203', 'amazon_sa', 3999.00, 'SAR', 'https://amazon.sa/dp/B0BSHJ9YXG', true),
  ('11111111-1111-1111-1111-111111111204', 'amazon_sa', 3199.00, 'SAR', 'https://amazon.sa/dp/B0CS6XBVNZ', true),

  -- Monitors
  ('11111111-1111-1111-1111-111111111301', 'amazon_sa', 4999.00, 'SAR', 'https://amazon.sa/dp/B088HH6LW5', true),
  ('11111111-1111-1111-1111-111111111302', 'amazon_sa', 2999.00, 'SAR', 'https://amazon.sa/dp/B09QG3BPR7', true),
  ('11111111-1111-1111-1111-111111111303', 'amazon_sa', 11999.00, 'SAR', 'https://amazon.sa/dp/B09QKXZX5Y', false),

  -- Consoles
  ('11111111-1111-1111-1111-111111111401', 'jarir', 2099.00, 'SAR', 'https://jarir.com/sa-en/playstation-5', true),
  ('11111111-1111-1111-1111-111111111401', 'amazon_sa', 2199.00, 'SAR', 'https://amazon.sa/dp/B08H93ZRK9', true),
  ('11111111-1111-1111-1111-111111111402', 'jarir', 1899.00, 'SAR', 'https://jarir.com/sa-en/ps5-digital', true),
  ('11111111-1111-1111-1111-111111111403', 'jarir', 2199.00, 'SAR', 'https://jarir.com/sa-en/xbox-series-x', true),
  ('11111111-1111-1111-1111-111111111404', 'amazon_sa', 1499.00, 'SAR', 'https://amazon.sa/dp/B098RKWHHZ', true),

  -- Keyboards
  ('11111111-1111-1111-1111-111111111501', 'amazon_sa', 549.00, 'SAR', 'https://amazon.sa/dp/B07QQB9VCV', true),
  ('11111111-1111-1111-1111-111111111502', 'amazon_sa', 899.00, 'SAR', 'https://amazon.sa/dp/B0CHVJZ5VK', true),
  ('11111111-1111-1111-1111-111111111503', 'amazon_sa', 649.00, 'SAR', 'https://amazon.sa/dp/B09HGDKX3P', true),

  -- Mice
  ('11111111-1111-1111-1111-111111111601', 'amazon_sa', 649.00, 'SAR', 'https://amazon.sa/dp/B0CKJ7J5ZY', true),
  ('11111111-1111-1111-1111-111111111602', 'amazon_sa', 599.00, 'SAR', 'https://amazon.sa/dp/B0B6HFCQWM', true),
  ('11111111-1111-1111-1111-111111111603', 'amazon_sa', 799.00, 'SAR', 'https://amazon.sa/dp/B0CXYZ1234', false),

  -- Headsets
  ('11111111-1111-1111-1111-111111111701', 'amazon_sa', 1399.00, 'SAR', 'https://amazon.sa/dp/B09ZWMXL5P', true),
  ('11111111-1111-1111-1111-111111111702', 'amazon_sa', 999.00, 'SAR', 'https://amazon.sa/dp/B0C5HQWX7K', true),
  ('11111111-1111-1111-1111-111111111703', 'amazon_sa', 599.00, 'SAR', 'https://amazon.sa/dp/B0CGXYZ789', true),

  -- TVs
  ('11111111-1111-1111-1111-111111111801', 'amazon_sa', 8499.00, 'SAR', 'https://amazon.sa/dp/B0BVXF72HV', true),
  ('11111111-1111-1111-1111-111111111801', 'jarir', 8999.00, 'SAR', 'https://jarir.com/sa-en/lg-c3-65', true),
  ('11111111-1111-1111-1111-111111111802', 'amazon_sa', 5999.00, 'SAR', 'https://amazon.sa/dp/B0BV1VWKQ2', true),
  ('11111111-1111-1111-1111-111111111803', 'amazon_sa', 12999.00, 'SAR', 'https://amazon.sa/dp/B0C1XYZABC', true);

-- Insert sample price history (last 90 days for RTX 4090)
INSERT INTO price_history (product_id, retailer, price, currency, recorded_at) VALUES
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 8499.00, 'SAR', NOW() - INTERVAL '90 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 8299.00, 'SAR', NOW() - INTERVAL '75 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7999.00, 'SAR', NOW() - INTERVAL '60 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7799.00, 'SAR', NOW() - INTERVAL '45 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7699.00, 'SAR', NOW() - INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7599.00, 'SAR', NOW() - INTERVAL '15 days'),
  ('11111111-1111-1111-1111-111111111201', 'amazon_sa', 7499.00, 'SAR', NOW());
