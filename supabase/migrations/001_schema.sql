-- ============================================================
-- HarvestCo - Full Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Categories
CREATE TABLE categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  slug       text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

INSERT INTO categories (name, slug) VALUES
  ('Vegetables',    'vegetables'),
  ('Fruits',        'fruits'),
  ('Grains & Pulses','grains-pulses'),
  ('Dairy',         'dairy'),
  ('Herbs',         'herbs'),
  ('Seasonal Box',  'seasonal-box');

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  text,
  phone      text,
  address    text,
  city       text DEFAULT 'Panvel',
  pincode    text,
  created_at timestamptz DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Products
CREATE TABLE products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  price       numeric(10,2) NOT NULL,
  unit        text NOT NULL,            -- e.g. "per kg", "per 500g", "per litre"
  stock       integer NOT NULL DEFAULT 0,
  image_url   text,
  category_id uuid REFERENCES categories(id),
  is_organic  boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES auth.users(id),
  status           text NOT NULL DEFAULT 'pending',
                   -- pending | paid | processing | dispatched | delivered | cancelled
  total            numeric(10,2) NOT NULL,
  address          text NOT NULL,
  city             text NOT NULL DEFAULT 'Panvel',
  pincode          text NOT NULL,
  phone            text NOT NULL,
  razorpay_order_id   text,
  razorpay_payment_id text,
  notes            text,
  created_at       timestamptz DEFAULT now()
);

-- Order line items
CREATE TABLE order_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  name       text NOT NULL,             -- snapshot at purchase time
  price      numeric(10,2) NOT NULL,    -- snapshot at purchase time
  qty        integer NOT NULL,
  image_url  text
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Products: everyone can read active products
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (is_active = true);

-- Categories: public read
CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);

-- Orders: users see only their own
CREATE POLICY "Own orders" ON orders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Own order items" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- ============================================================
-- Sample products
-- ============================================================

INSERT INTO products (name, slug, description, price, unit, stock, category_id, is_featured) VALUES
  ('Fresh Broccoli',    'fresh-broccoli',   'Crisp, farm-fresh broccoli. Packed with vitamins.', 65,  'per 500g', 50,  (SELECT id FROM categories WHERE slug='vegetables'), true),
  ('Country Tomatoes',  'country-tomatoes', 'Deep red, naturally ripened desi tomatoes.',        80,  'per kg',   80,  (SELECT id FROM categories WHERE slug='vegetables'), true),
  ('A2 Cow Milk',       'a2-cow-milk',      'Pure A2 milk from our desi cows. No additives.',    90,  'per litre',30,  (SELECT id FROM categories WHERE slug='dairy'),      true),
  ('Whole Wheat Flour', 'whole-wheat-flour','Stone-ground atta from our farm wheat.',            55,  'per kg',   100, (SELECT id FROM categories WHERE slug='grains-pulses'), false),
  ('Organic Carrots',   'organic-carrots',  'Sweet, crunchy carrots straight from the field.',  45,  'per 500g', 60,  (SELECT id FROM categories WHERE slug='vegetables'), false),
  ('Alphonso Mangoes',  'alphonso-mangoes', 'Premium Ratnagiri Alphonso. Seasonal delight.',    380, 'per dozen',20,  (SELECT id FROM categories WHERE slug='fruits'),     true),
  ('Toor Dal',          'toor-dal',         'Freshly harvested pigeon peas. High protein.',      95,  'per kg',   70,  (SELECT id FROM categories WHERE slug='grains-pulses'), false),
  ('Fresh Spinach',     'fresh-spinach',    'Tender baby spinach leaves. Harvested daily.',      40,  'per 250g', 40,  (SELECT id FROM categories WHERE slug='vegetables'), false),
  ('Seasonal Box',      'seasonal-box',     '5kg mix of whatever is freshest this week.',       499, 'per box',  15,  (SELECT id FROM categories WHERE slug='seasonal-box'), true);
