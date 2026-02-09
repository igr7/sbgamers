# SBGamers - Saudi Arabia Gaming Price Comparison Platform

> 🎮 Compare gaming product prices across 6 major Saudi retailers and find the best deals!

![SBGamers](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Price Comparison
- **Multi-Store Comparison**: Compare prices from Amazon SA, Newegg, Jarir, Extra, PCD, and Infiniarc
- **Real-Time Prices**: Automated scrapers update prices every hour
- **Price History Charts**: Track price changes over time with interactive graphs
- **Best Deal Finder**: Automatically highlights the lowest price across all retailers

### Product Categories
- 🖥️ **PC Components**: GPUs, CPUs, Motherboards, RAM, Storage, PSUs, Cases, Coolers
- 💻 **Gaming Systems**: Gaming Laptops, Pre-built Gaming PCs
- 🎮 **Consoles**: PS5, Xbox Series X, Nintendo Switch + Accessories
- 🖥️ **Displays**: Gaming Monitors, TVs
- ⌨️ **Peripherals**: Keyboards, Mice, Headsets, Mousepads, Controllers
- 🪑 **Furniture**: Gaming Chairs
- 🥽 **VR**: VR Headsets

### Hot Deals
- Curated deals with 10%+ discounts
- Real-time savings calculator
- Filter by category and discount percentage
- Direct buy links to retailer pages

### Product Comparison
- Compare up to 4 products side-by-side
- Detailed specifications comparison
- Price comparison across retailers
- Best value highlighting

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, PostgreSQL
- **Scraping**: Puppeteer, Cheerio
- **Charts**: Recharts
- **Scheduling**: node-cron

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sbgamers.git
cd sbgamers
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

4. **Set up the database**
```bash
# Run the schema
psql -d your_database -f database/schema.sql

# Seed with demo data (optional)
psql -d your_database -f database/seed.sql
```

Or use the API endpoint after starting the server:
```bash
curl -X POST http://localhost:3000/api/setup
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🗄️ Database Schema

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(200),
  category VARCHAR(50) NOT NULL,
  image_url TEXT,
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Prices from retailers
CREATE TABLE prices (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  retailer VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'SAR',
  url TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  last_checked TIMESTAMP DEFAULT NOW()
);

-- Price history for charts
CREATE TABLE price_history (
  id UUID PRIMARY KEY,
  price_id UUID REFERENCES prices(id),
  price DECIMAL(10,2) NOT NULL,
  in_stock BOOLEAN,
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - List products with filters
  - `?category=gpu` - Filter by category
  - `?retailer=amazon_sa` - Filter by retailer
  - `?search=rtx` - Search products
  - `?inStock=true` - Only in-stock items
  - `?sortBy=price_asc` - Sort options: price_asc, price_desc, name, newest
  - `?limit=20&offset=0` - Pagination

- `GET /api/products/:id` - Get single product with all prices

### Deals
- `GET /api/deals` - Get discounted products
  - `?minDiscount=15` - Minimum discount percentage
  - `?category=gpu` - Filter by category
  - `?sortBy=discount` - Sort options: discount, savings, price_asc, price_desc

### Price History
- `GET /api/price-history/:productId` - Get price history
  - `?days=30` - Number of days to fetch
  - `?retailer=amazon_sa` - Filter by retailer

### Scraping (Admin)
- `GET /api/scrape` - Get scrape job status
- `POST /api/scrape` - Trigger manual scrape
  - `?retailer=amazon_sa` - Scrape specific retailer only

### Setup (Admin)
- `GET /api/setup` - Check database status
- `POST /api/setup` - Initialize database schema and seed data

## 🕷️ Scraping System

### Supported Retailers
| Retailer | Type | Update Frequency |
|----------|------|------------------|
| Amazon SA | Puppeteer | Every hour at :05 |
| Newegg | Puppeteer | Every hour at :35 |
| Jarir | Cheerio | Every hour at :15 |
| Extra | Cheerio | Every hour at :25 |
| PCD | Cheerio | Every hour at :45 |
| Infiniarc | Cheerio | Every hour at :55 |

### Starting the Scheduler
The scheduler automatically starts when the application runs. To manually control:

```typescript
import { startScheduler, stopScheduler, triggerScrape } from '@/lib/scrapers/scheduler';

// Start scheduled jobs
startScheduler();

// Stop scheduled jobs
stopScheduler();

// Manually trigger scrape
await triggerScrape('amazon_sa'); // Specific retailer
await triggerScrape(); // All retailers
```

## 📁 Project Structure

```
sbgamers/
├── database/
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Sample data
├── public/
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deals/route.ts
│   │   │   ├── products/route.ts
│   │   │   ├── products/[id]/route.ts
│   │   │   ├── price-history/[productId]/route.ts
│   │   │   ├── scrape/route.ts
│   │   │   └── setup/route.ts
│   │   ├── compare/page.tsx
│   │   ├── deals/page.tsx
│   │   ├── products/page.tsx
│   │   ├── products/[id]/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   └── PriceHistoryChart.tsx
│   │   ├── ui/
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   └── ...
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── scrapers/
│   │   │   ├── scraper.ts
│   │   │   ├── scheduler.ts
│   │   │   └── types.ts
│   │   ├── db.ts
│   │   ├── demo-data.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Black (#000000)
- **Accent**: Chrome/Silver gradients
- **Background**: Dark with glassmorphism

### Components
- Glassmorphism panels with `glass-chrome` class
- Chrome metallic buttons with `btn-chrome` class
- Animated wave backgrounds with `chrome-waves`

## 🚢 Deployment

### CranL.com Deployment

1. Push your code to the repository
2. Set environment variables in CranL dashboard
3. Deploy!

The database will be initialized automatically via the `/api/setup` endpoint.

### Vercel Deployment

```bash
npm run build
vercel --prod
```

Set `DATABASE_URL` in Vercel environment variables.

## ⚠️ Legal Disclaimer

- Prices displayed are for reference only and may change
- Product availability is subject to change without notice
- Always verify prices on the retailer's website before purchasing
- This platform is not affiliated with any of the listed retailers
- Data is scraped in compliance with each website's terms of service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Recharts](https://recharts.org/) - Charting library
- [Puppeteer](https://pptr.dev/) - Browser automation

---

Made with ❤️ for Saudi gamers 🎮
