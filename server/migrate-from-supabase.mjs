// migrate-from-supabase.mjs
// Run once: node server/migrate-from-supabase.mjs
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
const { Pool } = pg;

const supabase = createClient(
  'https://wrgrkqpwvkftrjhggcip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZ3JrcXB3dmtmdHJqaGdnY2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjYyODEsImV4cCI6MjA4OTI0MjI4MX0._kGpbqhJ4LyCsisjUCIg5zZbHzKDs7fqXQLMd4xJyGo'
);

const pool = new Pool({
  host:     'localhost',
  port:     5432,
  database: 'manzil_db',
  user:     'postgres',
  password: 'putrid123',
});

async function migrate() {
  const client = await pool.connect();
  try {
    // ── CATEGORIES ────────────────────────────────────────────────────────────
    console.log('Migrating categories...');
    const { data: categories, error: catErr } = await supabase.from('categories').select('*');
    if (catErr) throw catErr;

    for (const cat of categories || []) {
      await client.query(
        `INSERT INTO categories (id, name, slug, description, created_at)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO NOTHING`,
        [cat.id, cat.name, cat.slug, cat.description || '', cat.created_at]
      );
    }
    console.log(`  ✓ ${(categories || []).length} categories`);

    // ── PRODUCTS ─────────────────────────────────────────────────────────────
    console.log('Migrating products...');
    const { data: products, error: prodErr } = await supabase.from('products').select('*');
    if (prodErr) throw prodErr;

    for (const p of products || []) {
      await client.query(
        `INSERT INTO products
           (id, name, slug, description, price, category_id, images, sizes, colors,
            materials, care_instructions, featured, new_arrival, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO NOTHING`,
        [
          p.id, p.name, p.slug, p.description || '', p.price,
          p.category_id || null,
          JSON.stringify(p.images  || []),
          JSON.stringify(p.sizes   || []),
          JSON.stringify(p.colors  || []),
          p.materials || '', p.care_instructions || '',
          p.featured, p.new_arrival, p.created_at,
        ]
      );
    }
    console.log(`  ✓ ${(products || []).length} products`);

    // ── ORDERS ───────────────────────────────────────────────────────────────
    console.log('Migrating orders...');
    const { data: orders, error: ordErr } = await supabase.from('orders').select('*');
    if (ordErr) throw ordErr;

    for (const o of orders || []) {
      await client.query(
        `INSERT INTO orders (id, session_id, email, total, status, shipping_info, payment_intent_id, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO NOTHING`,
        [o.id, o.session_id, o.email, o.total, o.status,
         JSON.stringify(o.shipping_info || {}), o.payment_intent_id || null, o.created_at]
      );
    }
    console.log(`  ✓ ${(orders || []).length} orders`);

    // ── ORDER ITEMS ──────────────────────────────────────────────────────────
    console.log('Migrating order_items...');
    const { data: orderItems, error: oiErr } = await supabase.from('order_items').select('*');
    if (oiErr) throw oiErr;

    for (const oi of orderItems || []) {
      await client.query(
        `INSERT INTO order_items (id, order_id, product_id, product_name, quantity, size, color, price, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [oi.id, oi.order_id, oi.product_id, oi.product_name, oi.quantity, oi.size, oi.color, oi.price, oi.created_at]
      );
    }
    console.log(`  ✓ ${(orderItems || []).length} order items`);

    console.log('\n✅ Migration complete!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
