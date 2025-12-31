import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { nanoid } from 'nanoid';

const licenses = new Hono<{ Bindings: Env }>();

// Get all active licenses
licenses.get('/', async (c) => {
  try {
    const db = c.env.DB;
    const tier = c.req.query('tier');
    
    let query = 'SELECT * FROM licenses WHERE is_active = 1';
    const params: string[] = [];
    
    if (tier) {
      query += ' AND tier = ?';
      params.push(tier);
    }
    
    query += ' ORDER BY tier, price_usd DESC';
    
    const result = await db.prepare(query).bind(...params).all();
    
    return c.json({
      success: true,
      licenses: result.results || []
    });
  } catch (error) {
    console.error('Failed to fetch licenses:', error);
    return c.json({ success: false, error: 'Failed to fetch licenses' }, 500);
  }
});

// Get or create cart session
licenses.get('/cart/session', async (c) => {
  try {
    const db = c.env.DB;
    let sessionId = c.req.query('session_id');
    
    if (!sessionId) {
      sessionId = nanoid();
      await db.prepare(
        'INSERT INTO cart_sessions (session_id, status) VALUES (?, ?)'
      ).bind(sessionId, 'active').run();
    }
    
    // Get cart items
    const items = await db.prepare(`
      SELECT ci.*, l.name, l.license_code, l.tier, l.category
      FROM cart_items ci
      JOIN licenses l ON ci.license_id = l.id
      WHERE ci.session_id = ?
    `).bind(sessionId).all();
    
    const session = await db.prepare(
      'SELECT * FROM cart_sessions WHERE session_id = ?'
    ).bind(sessionId).first();
    
    return c.json({
      success: true,
      session_id: sessionId,
      session,
      items: items.results || []
    });
  } catch (error) {
    console.error('Failed to get cart session:', error);
    return c.json({ success: false, error: 'Failed to get cart session' }, 500);
  }
});

const addToCartSchema = z.object({
  session_id: z.string(),
  license_id: z.number()
});

// Add item to cart
licenses.post('/cart/add', zValidator('json', addToCartSchema), async (c) => {
  try {
    const db = c.env.DB;
    const { session_id, license_id } = c.req.valid('json');
    
    // Check if license exists and is active
    const license = await db.prepare(
      'SELECT * FROM licenses WHERE id = ? AND is_active = 1'
    ).bind(license_id).first<any>();
    
    if (!license) {
      return c.json({ success: false, error: 'License not found' }, 404);
    }
    
    // Check if already in cart
    const existing = await db.prepare(
      'SELECT * FROM cart_items WHERE session_id = ? AND license_id = ?'
    ).bind(session_id, license_id).first();
    
    if (existing) {
      return c.json({ success: false, error: 'License already in cart' }, 400);
    }
    
    // Add to cart
    await db.prepare(
      'INSERT INTO cart_items (session_id, license_id, price_usd) VALUES (?, ?, ?)'
    ).bind(session_id, license_id, license.price_usd).run();
    
    // Update cart session totals
    const totals = await db.prepare(`
      SELECT SUM(price_usd) as total FROM cart_items WHERE session_id = ?
    `).bind(session_id).first<{ total: number }>();
    
    const total = totals?.total || 0;
    const careLoop = Math.floor(total * 0.15);
    
    await db.prepare(
      'UPDATE cart_sessions SET total_amount = ?, care_loop_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?'
    ).bind(total, careLoop, session_id).run();
    
    return c.json({
      success: true,
      message: 'Added to cart',
      total,
      care_loop: careLoop
    });
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return c.json({ success: false, error: 'Failed to add to cart' }, 500);
  }
});

const removeFromCartSchema = z.object({
  session_id: z.string(),
  license_id: z.number()
});

// Remove item from cart
licenses.post('/cart/remove', zValidator('json', removeFromCartSchema), async (c) => {
  try {
    const db = c.env.DB;
    const { session_id, license_id } = c.req.valid('json');
    
    await db.prepare(
      'DELETE FROM cart_items WHERE session_id = ? AND license_id = ?'
    ).bind(session_id, license_id).run();
    
    // Update cart session totals
    const totals = await db.prepare(`
      SELECT SUM(price_usd) as total FROM cart_items WHERE session_id = ?
    `).bind(session_id).first<{ total: number }>();
    
    const total = totals?.total || 0;
    const careLoop = Math.floor(total * 0.15);
    
    await db.prepare(
      'UPDATE cart_sessions SET total_amount = ?, care_loop_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?'
    ).bind(total, careLoop, session_id).run();
    
    return c.json({
      success: true,
      message: 'Removed from cart',
      total,
      care_loop: careLoop
    });
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    return c.json({ success: false, error: 'Failed to remove from cart' }, 500);
  }
});

const checkoutSchema = z.object({
  session_id: z.string(),
  grain_count: z.number()
});

// Process checkout
licenses.post('/cart/checkout', zValidator('json', checkoutSchema), async (c) => {
  try {
    const db = c.env.DB;
    const { session_id, grain_count } = c.req.valid('json');
    
    // Get cart session
    const session = await db.prepare(
      'SELECT * FROM cart_sessions WHERE session_id = ? AND status = ?'
    ).bind(session_id, 'active').first<any>();
    
    if (!session) {
      return c.json({ success: false, error: 'Cart session not found' }, 404);
    }
    
    if (session.total_amount === 0) {
      return c.json({ success: false, error: 'Cart is empty' }, 400);
    }
    
    // Create checkout transaction
    const result = await db.prepare(`
      INSERT INTO checkout_transactions 
      (session_id, total_amount, care_loop_amount, grain_count, payment_status, sync_time_ms)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      session_id,
      session.total_amount,
      session.care_loop_amount,
      grain_count,
      'processing',
      80
    ).run();
    
    // Mark cart session as completed
    await db.prepare(
      'UPDATE cart_sessions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?'
    ).bind('completed', session_id).run();
    
    // Clear cart items
    await db.prepare(
      'DELETE FROM cart_items WHERE session_id = ?'
    ).bind(session_id).run();
    
    return c.json({
      success: true,
      message: 'Checkout initiated',
      transaction_id: result.meta.last_row_id,
      total_amount: session.total_amount,
      care_loop_amount: session.care_loop_amount,
      grain_count,
      sync_time: '0.08s',
      status: 'processing'
    });
  } catch (error) {
    console.error('Failed to process checkout:', error);
    return c.json({ success: false, error: 'Failed to process checkout' }, 500);
  }
});

// Get checkout stats
licenses.get('/stats', async (c) => {
  try {
    const db = c.env.DB;
    
    const licenseCount = await db.prepare(
      'SELECT COUNT(*) as total FROM licenses WHERE is_active = 1'
    ).first<{ total: number }>();
    
    const revenueTotal = await db.prepare(
      'SELECT SUM(total_amount) as revenue FROM checkout_transactions WHERE payment_status = ?'
    ).bind('processing').first<{ revenue: number }>();
    
    const activeCarts = await db.prepare(
      'SELECT COUNT(*) as total FROM cart_sessions WHERE status = ?'
    ).bind('active').first<{ total: number }>();
    
    return c.json({
      success: true,
      stats: {
        total_licenses: licenseCount?.total || 0,
        total_revenue: revenueTotal?.revenue || 0,
        active_carts: activeCarts?.total || 0,
        sync_speed: 80
      }
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

export default licenses;
