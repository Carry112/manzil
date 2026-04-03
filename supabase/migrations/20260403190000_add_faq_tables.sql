/*
  # Add FAQ tables for admin-managed FAQ content

  1. New Tables
    - faq_categories
    - faqs

  2. Relations
    - faqs.category_id -> faq_categories.id (cascade delete)

  3. Indexes
    - Sorting and category lookup indexes
*/

CREATE TABLE IF NOT EXISTS faq_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES faq_categories(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faq_categories_order ON faq_categories(sort_order, name);
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faqs(category_id, sort_order);
