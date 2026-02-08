# SBGamers - PC Part Aggregator for MENA

A professional-grade PC Part Aggregator, Compatibility Checker, and Price Tracker for Saudi Arabia and UAE.

## Features

- **PC Builder** - Build your dream PC with real-time compatibility checking
- **Price Comparison** - Compare prices across 5+ MENA retailers
- **Price History** - Track price trends with interactive charts
- **Smart Alerts** - Get notified when prices drop (email-based)
- **Product Comparison** - Compare up to 4 products side-by-side
- **Bottleneck Calculator** - Check CPU/GPU balance

## Product Categories

- PC Components: CPUs, GPUs, Motherboards, RAM, Storage, PSUs, Cases, Coolers
- Displays: Monitors, TVs
- Peripherals: Keyboards, Mice, Headsets, Mousepads, Webcams, Microphones, Controllers
- Gaming Consoles: PlayStation, Xbox, Nintendo Switch

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Database:** PostgreSQL (Cranl.com)
- **Styling:** Tailwind CSS + Framer Motion
- **Charts:** Recharts
- **Hosting:** Cranl.com

## Deployment on Cranl

1. Push this repo to GitHub
2. Go to [Cranl Dashboard](https://app.cranl.com)
3. Create a new project and connect your GitHub repo
4. Create a PostgreSQL database
5. Add environment variable:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```
6. Run the SQL migrations from `supabase/migrations/` in your database
7. Deploy!

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

## Database Setup

Run the SQL files in order:
1. `supabase/migrations/001_initial_schema.sql` - Creates tables
2. `supabase/migrations/002_seed_data.sql` - Adds sample data

## Retailers Supported

- Amazon SA
- Amazon AE
- Newegg
- Jarir
- Softland

## License

MIT
