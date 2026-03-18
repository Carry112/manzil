// server/index.mjs  — Manzil REST API (Express + PostgreSQL 18)
import express from 'express';
import cors    from 'cors';
import pg      from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host:     process.env.PG_HOST     || 'localhost',
  port:     parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_DATABASE || 'manzil_db',
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASSWORD || 'putrid123',
});

const app  = express();
const PORT = process.env.API_PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── helpers ───────────────────────────────────────────────────────────────
const q = (text, params) => pool.query(text, params);

function ok(res, data)  { res.json({ data, error: null }); }
function err(res, e, code = 500) {
  console.error(e);
  res.status(code).json({ data: null, error: e?.message || String(e) });
}

// pg returns NUMERIC as strings and JSONB as parsed objects — normalise here
function castProduct(p) {
  if (!p) return p;
  return {
    ...p,
    price:  parseFloat(p.price),
    images: Array.isArray(p.images) ? p.images : (p.images ? JSON.parse(p.images) : []),
    sizes:  Array.isArray(p.sizes)  ? p.sizes  : (p.sizes  ? JSON.parse(p.sizes)  : []),
    colors: Array.isArray(p.colors) ? p.colors : (p.colors ? JSON.parse(p.colors) : []),
  };
}

function castOrder(o) {
  if (!o) return o;
  return {
    ...o,
    total: parseFloat(o.total),
    shipping_info: typeof o.shipping_info === 'string' ? JSON.parse(o.shipping_info) : (o.shipping_info || {}),
    order_items: Array.isArray(o.order_items)
      ? o.order_items.map(i => i ? { ...i, price: parseFloat(i.price) } : i)
      : [],
  };
}

// ─── HEALTH ────────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try { await q('SELECT 1'); ok(res, 'ok'); } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════
//  CATEGORIES
// ══════════════════════════════════════════════════════
app.get('/api/categories', async (_req, res) => {
  try {
    const { rows } = await q('SELECT * FROM categories ORDER BY name');
    ok(res, rows);
  } catch (e) { err(res, e); }
});

app.post('/api/categories', async (req, res) => {
  const { name, slug, description = '' } = req.body;
  try {
    const { rows } = await q(
      `INSERT INTO categories (name, slug, description)
       VALUES ($1,$2,$3) RETURNING *`,
      [name, slug, description]
    );
    ok(res, rows[0]);
  } catch (e) { err(res, e); }
});

app.put('/api/categories/:id', async (req, res) => {
  const { name, slug, description = '' } = req.body;
  try {
    const { rows } = await q(
      `UPDATE categories SET name=$1, slug=$2, description=$3 WHERE id=$4 RETURNING *`,
      [name, slug, description, req.params.id]
    );
    ok(res, rows[0]);
  } catch (e) { err(res, e); }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    await q('DELETE FROM categories WHERE id=$1', [req.params.id]);
    ok(res, null);
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════
//  PRODUCTS
// ══════════════════════════════════════════════════════
app.get('/api/products', async (req, res) => {
  const { featured, new_arrival, category_id, slug, limit } = req.query;
  let text = 'SELECT * FROM products WHERE 1=1';
  const vals = [];
  if (featured    === 'true')  { vals.push(true);         text += ` AND featured=$${vals.length}`; }
  if (new_arrival === 'true')  { vals.push(true);         text += ` AND new_arrival=$${vals.length}`; }
  if (category_id)             { vals.push(category_id);  text += ` AND category_id=$${vals.length}`; }
  if (slug)                    { vals.push(slug);         text += ` AND slug=$${vals.length}`; }
  text += ' ORDER BY created_at DESC';
  if (limit)                   { vals.push(parseInt(limit)); text += ` LIMIT $${vals.length}`; }
  try {
    const { rows } = await q(text, vals);
    ok(res, rows.map(castProduct));
  } catch (e) { err(res, e); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await q('SELECT * FROM products WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ data: null, error: 'Not found' });
    ok(res, castProduct(rows[0]));
  } catch (e) { err(res, e); }
});

app.post('/api/products', async (req, res) => {
  const {
    name, slug, description = '', price, category_id = null,
    images = [], sizes = [], colors = [],
    materials = '', care_instructions = '',
    featured = false, new_arrival = false,
  } = req.body;
  try {
    const { rows } = await q(
      `INSERT INTO products
         (name,slug,description,price,category_id,images,sizes,colors,
          materials,care_instructions,featured,new_arrival)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [name, slug, description, price, category_id,
       JSON.stringify(images), JSON.stringify(sizes), JSON.stringify(colors),
       materials, care_instructions, featured, new_arrival]
    );
    ok(res, castProduct(rows[0]));
  } catch (e) { err(res, e); }
});

app.put('/api/products/:id', async (req, res) => {
  const {
    name, slug, description = '', price, category_id = null,
    images = [], sizes = [], colors = [],
    materials = '', care_instructions = '',
    featured = false, new_arrival = false,
  } = req.body;
  try {
    const { rows } = await q(
      `UPDATE products SET
         name=$1, slug=$2, description=$3, price=$4, category_id=$5,
         images=$6, sizes=$7, colors=$8, materials=$9,
         care_instructions=$10, featured=$11, new_arrival=$12
       WHERE id=$13 RETURNING *`,
      [name, slug, description, price, category_id,
       JSON.stringify(images), JSON.stringify(sizes), JSON.stringify(colors),
       materials, care_instructions, featured, new_arrival, req.params.id]
    );
    ok(res, castProduct(rows[0]));
  } catch (e) { err(res, e); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await q('DELETE FROM products WHERE id=$1', [req.params.id]);
    ok(res, null);
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════
//  CART ITEMS
// ══════════════════════════════════════════════════════
app.get('/api/cart', async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return err(res, new Error('session_id required'), 400);
  try {
    const { rows } = await q(
      `SELECT ci.*, row_to_json(p) AS product
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.session_id = $1`,
      [session_id]
    );
    // cast product inside each cart row
    ok(res, rows.map(r => ({ ...r, product: castProduct(r.product) })));
  } catch (e) { err(res, e); }
});

app.post('/api/cart', async (req, res) => {
  const { session_id, product_id, quantity, size, color } = req.body;
  try {
    const { rows } = await q(
      `INSERT INTO cart_items (session_id,product_id,quantity,size,color)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [session_id, product_id, quantity, size, color]
    );
    ok(res, rows[0]);
  } catch (e) { err(res, e); }
});

app.put('/api/cart/:id', async (req, res) => {
  const { quantity } = req.body;
  try {
    const { rows } = await q(
      'UPDATE cart_items SET quantity=$1 WHERE id=$2 RETURNING *',
      [quantity, req.params.id]
    );
    ok(res, rows[0]);
  } catch (e) { err(res, e); }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    await q('DELETE FROM cart_items WHERE id=$1', [req.params.id]);
    ok(res, null);
  } catch (e) { err(res, e); }
});

app.delete('/api/cart/session/:session_id', async (req, res) => {
  try {
    await q('DELETE FROM cart_items WHERE session_id=$1', [req.params.session_id]);
    ok(res, null);
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════
//  ORDERS
// ══════════════════════════════════════════════════════
app.get('/api/orders', async (req, res) => {
  const { limit } = req.query;
  let text = `SELECT o.*, json_agg(
      json_build_object(
        'id',oi.id,'product_name',oi.product_name,'quantity',oi.quantity,
        'size',oi.size,'color',oi.color,'price',oi.price
      )
    ) FILTER (WHERE oi.id IS NOT NULL) AS order_items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC`;
  if (limit) text += ` LIMIT ${parseInt(limit)}`;
  try {
    const { rows } = await q(text);
    ok(res, rows.map(castOrder));
  } catch (e) { err(res, e); }
});

app.post('/api/orders', async (req, res) => {
  const { session_id, email, total, status = 'pending', shipping_info = {}, items = [] } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (session_id,email,total,status,shipping_info)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [session_id, email, total, status, JSON.stringify(shipping_info)]
    );
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id,product_id,product_name,quantity,size,color,price)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [order.id, item.product_id, item.product_name, item.quantity, item.size, item.color, item.price]
      );
    }
    await client.query('COMMIT');
    ok(res, castOrder(order));
  } catch (e) {
    await client.query('ROLLBACK');
    err(res, e);
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const { rows } = await q(
      'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    ok(res, rows[0]);
  } catch (e) { err(res, e); }
});

// ══════════════════════════════════════════════════════
//  STATS  (admin dashboard)
// ══════════════════════════════════════════════════════
app.get('/api/stats', async (_req, res) => {
  try {
    const [prodRes, ordRes, catRes] = await Promise.all([
      q('SELECT COUNT(*) FROM products'),
      q('SELECT COUNT(*) AS total_orders, COALESCE(SUM(total),0) AS revenue FROM orders'),
      q('SELECT COUNT(*) FROM categories'),
    ]);
    ok(res, {
      totalProducts:    parseInt(prodRes.rows[0].count),
      totalOrders:      parseInt(ordRes.rows[0].total_orders),
      totalRevenue:     parseFloat(ordRes.rows[0].revenue),
      totalCategories:  parseInt(catRes.rows[0].count),
    });
  } catch (e) { err(res, e); }
});

// ──────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀  Manzil API running on http://localhost:${PORT}`));
