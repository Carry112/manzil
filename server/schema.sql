-- Manzil E-Commerce Schema (PostgreSQL 18)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  slug               TEXT UNIQUE NOT NULL,
  description        TEXT DEFAULT '',
  price              NUMERIC NOT NULL CHECK (price >= 0),
  category_id        UUID REFERENCES categories(id) ON DELETE SET NULL,
  images             JSONB DEFAULT '[]'::jsonb,
  sizes              JSONB DEFAULT '[]'::jsonb,
  colors             JSONB DEFAULT '[]'::jsonb,
  materials          TEXT DEFAULT '',
  care_instructions  TEXT DEFAULT '',
  featured           BOOLEAN DEFAULT false,
  new_arrival        BOOLEAN DEFAULT false,
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- Cart items (session-based, guest carts)
CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  size        TEXT NOT NULL,
  color       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        TEXT NOT NULL,
  email             TEXT NOT NULL,
  total             NUMERIC NOT NULL CHECK (total >= 0),
  status            TEXT DEFAULT 'pending',
  shipping_info     JSONB DEFAULT '{}'::jsonb,
  payment_intent_id TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id   UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  size         TEXT NOT NULL,
  color        TEXT NOT NULL,
  price        NUMERIC NOT NULL CHECK (price >= 0),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- FAQ categories
CREATE TABLE IF NOT EXISTS faq_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- FAQ items
CREATE TABLE IF NOT EXISTS faqs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID REFERENCES faq_categories(id) ON DELETE CASCADE NOT NULL,
  question     TEXT NOT NULL,
  answer       TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured    ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(new_arrival) WHERE new_arrival = true;
CREATE INDEX IF NOT EXISTS idx_cart_session         ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_session       ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order    ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_faq_categories_order ON faq_categories(sort_order, name);
CREATE INDEX IF NOT EXISTS idx_faq_items_category   ON faqs(category_id, sort_order);
