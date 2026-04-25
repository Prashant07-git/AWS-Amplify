# HarvestCo - Organic Farm E-Commerce

Built with: Next.js 14, Supabase, Razorpay, Resend, Cloudinary

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up Supabase database

1. Create a free project at supabase.com
2. Go to SQL Editor in your dashboard
3. Paste and run the contents of `supabase/migrations/001_schema.sql`
4. Also run this helper function for stock management:

```sql
CREATE OR REPLACE FUNCTION decrement_stock(p_id uuid, qty integer)
RETURNS void AS $$
  UPDATE products SET stock = stock - qty WHERE id = p_id;
$$ LANGUAGE sql;
```

### 4. Set up Razorpay

1. Sign up at razorpay.com
2. Go to Settings -> API Keys -> Generate Test Key
3. Add Key ID and Secret to `.env.local`

### 5. Set up Resend

1. Sign up at resend.com
2. Add your API key to `.env.local`

### 6. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

## Project Structure

- `app/` - All pages and API routes
- `components/` - Navbar, CartDrawer, ProductCard, Footer
- `lib/` - Supabase client, Razorpay config, cart store, email
- `supabase/` - Database schema SQL

## Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero + featured products |
| `/products` | All products with category filter |
| `/products/[slug]` | Single product detail |
| `/checkout` | Checkout with Razorpay |
| `/orders` | User order history |
| `/account` | Login / signup |
| `/admin` | Farmer dashboard: add products, update order status |

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/products` | GET, POST | List / create products |
| `/api/payment` | POST | Create Razorpay order |
| `/api/orders` | GET, POST | Create / fetch orders |
| `/api/webhook` | POST | Razorpay payment webhook |

## Deployment on AWS Free Tier / Free Plan

Use AWS Amplify Hosting for this app because it has Next.js SSR pages and API routes. Supabase remains the database/auth/storage backend.

1. Push code to GitHub
2. Open AWS Amplify and connect the repo
3. Keep the build settings from `amplify.yml`
4. Add all `.env.local` values as Amplify environment variables
5. Deploy
6. See `AWS_DEPLOYMENT.md` for the full no-paid-services checklist

## Going to production with Razorpay

- Switch from test keys to live keys in `.env.local` and Amplify
- Add your Amplify URL as webhook in Razorpay dashboard:
  `https://yourdomain.com/api/webhook`
