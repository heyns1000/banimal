import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { nanoid } from 'nanoid';

const payments = new Hono<{ Bindings: Env }>();

const createPaymentIntentSchema = z.object({
  session_id: z.string(),
  gateway: z.enum(['paypal', 'stripe', 'manual']),
  amount_cents: z.number(),
  currency: z.string().default('USD'),
  customer_email: z.string().email().optional()
});

// Create payment intent
payments.post('/create-intent', zValidator('json', createPaymentIntentSchema), async (c) => {
  try {
    const db = c.env.DB;
    const { session_id, gateway, amount_cents, currency, customer_email } = c.req.valid('json');
    
    // Get cart session to verify
    const cartSession = await db.prepare(
      'SELECT * FROM cart_sessions WHERE session_id = ? AND status = ?'
    ).bind(session_id, 'active').first<any>();
    
    if (!cartSession) {
      return c.json({ success: false, error: 'Invalid cart session' }, 400);
    }
    
    // Create transaction record
    const transactionId = `TXN_${nanoid(16)}`;
    
    await db.prepare(`
      INSERT INTO payment_transactions 
      (transaction_id, session_id, gateway, amount_cents, currency, status, customer_email, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      transactionId,
      session_id,
      gateway,
      amount_cents,
      currency,
      'pending',
      customer_email || null,
      JSON.stringify({ cart_total: cartSession.total_amount, care_loop: cartSession.care_loop_amount })
    ).run();
    
    // For manual/test payments, immediately mark as completed
    if (gateway === 'manual') {
      await db.prepare(
        'UPDATE payment_transactions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE transaction_id = ?'
      ).bind('completed', transactionId).run();
      
      // Mark cart as completed
      await db.prepare(
        'UPDATE cart_sessions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?'
      ).bind('completed', session_id).run();
    }
    
    return c.json({
      success: true,
      transaction_id: transactionId,
      status: gateway === 'manual' ? 'completed' : 'pending',
      gateway,
      amount_cents,
      currency,
      // In production, would return PayPal order ID or Stripe client secret here
      payment_url: gateway === 'paypal' 
        ? `https://www.paypal.com/checkoutnow?token=${transactionId}`
        : gateway === 'stripe'
        ? `https://checkout.stripe.com/pay/${transactionId}`
        : null
    });
  } catch (error) {
    console.error('Failed to create payment intent:', error);
    return c.json({ success: false, error: 'Failed to create payment intent' }, 500);
  }
});

const confirmPaymentSchema = z.object({
  transaction_id: z.string(),
  payment_intent_id: z.string().optional()
});

// Confirm payment (called after PayPal/Stripe redirect)
payments.post('/confirm', zValidator('json', confirmPaymentSchema), async (c) => {
  try {
    const db = c.env.DB;
    const { transaction_id, payment_intent_id } = c.req.valid('json');
    
    const transaction = await db.prepare(
      'SELECT * FROM payment_transactions WHERE transaction_id = ?'
    ).bind(transaction_id).first<any>();
    
    if (!transaction) {
      return c.json({ success: false, error: 'Transaction not found' }, 404);
    }
    
    // Update transaction status
    await db.prepare(`
      UPDATE payment_transactions 
      SET status = ?, payment_intent_id = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE transaction_id = ?
    `).bind('completed', payment_intent_id || null, transaction_id).run();
    
    // Mark cart session as completed
    await db.prepare(
      'UPDATE cart_sessions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?'
    ).bind('completed', transaction.session_id).run();
    
    // Clear cart items
    await db.prepare(
      'DELETE FROM cart_items WHERE session_id = ?'
    ).bind(transaction.session_id).run();
    
    return c.json({
      success: true,
      message: 'Payment confirmed',
      transaction_id,
      status: 'completed'
    });
  } catch (error) {
    console.error('Failed to confirm payment:', error);
    return c.json({ success: false, error: 'Failed to confirm payment' }, 500);
  }
});

// Get transaction status
payments.get('/transaction/:id', async (c) => {
  try {
    const db = c.env.DB;
    const transactionId = c.req.param('id');
    
    const transaction = await db.prepare(
      'SELECT * FROM payment_transactions WHERE transaction_id = ?'
    ).bind(transactionId).first();
    
    if (!transaction) {
      return c.json({ success: false, error: 'Transaction not found' }, 404);
    }
    
    return c.json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return c.json({ success: false, error: 'Failed to fetch transaction' }, 500);
  }
});

// List transactions
payments.get('/transactions', async (c) => {
  try {
    const db = c.env.DB;
    const status = c.req.query('status');
    const limit = parseInt(c.req.query('limit') || '50');
    
    let query = 'SELECT * FROM payment_transactions';
    const params: any[] = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);
    
    const result = await db.prepare(query).bind(...params).all();
    
    return c.json({
      success: true,
      transactions: result.results || []
    });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return c.json({ success: false, error: 'Failed to fetch transactions' }, 500);
  }
});

// Get payment stats
payments.get('/stats', async (c) => {
  try {
    const db = c.env.DB;
    
    const totalRevenue = await db.prepare(
      "SELECT SUM(amount_cents) as total FROM payment_transactions WHERE status = 'completed'"
    ).first<{ total: number }>();
    
    const totalTransactions = await db.prepare(
      'SELECT COUNT(*) as count FROM payment_transactions'
    ).first<{ count: number }>();
    
    const completedTransactions = await db.prepare(
      "SELECT COUNT(*) as count FROM payment_transactions WHERE status = 'completed'"
    ).first<{ count: number }>();
    
    return c.json({
      success: true,
      stats: {
        total_revenue_cents: totalRevenue?.total || 0,
        total_transactions: totalTransactions?.count || 0,
        completed_transactions: completedTransactions?.count || 0,
        success_rate: totalTransactions?.count 
          ? Math.round(((completedTransactions?.count || 0) / totalTransactions.count) * 100)
          : 0
      }
    });
  } catch (error) {
    console.error('Failed to fetch payment stats:', error);
    return c.json({ success: false, error: 'Failed to fetch payment stats' }, 500);
  }
});

export default payments;
