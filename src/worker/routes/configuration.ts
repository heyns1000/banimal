import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const configuration = new Hono<{ Bindings: Env }>();

// Get all configuration settings
configuration.get('/', async (c) => {
  try {
    const db = c.env.DB;
    const category = c.req.query('category');
    
    let query = 'SELECT key, value, category, description FROM app_configuration';
    const params: string[] = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY category, key';
    
    const result = await db.prepare(query).bind(...params).all();
    
    return c.json({
      success: true,
      settings: result.results || []
    });
  } catch (error) {
    console.error('Failed to fetch configuration:', error);
    return c.json({ success: false, error: 'Failed to fetch configuration' }, 500);
  }
});

const updateConfigSchema = z.object({
  key: z.string(),
  value: z.string()
});

// Update configuration setting
configuration.post('/update', zValidator('json', updateConfigSchema), async (c) => {
  try {
    const db = c.env.DB;
    const { key, value } = c.req.valid('json');
    
    await db.prepare(
      'UPDATE app_configuration SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?'
    ).bind(value, key).run();
    
    return c.json({
      success: true,
      message: 'Configuration updated'
    });
  } catch (error) {
    console.error('Failed to update configuration:', error);
    return c.json({ success: false, error: 'Failed to update configuration' }, 500);
  }
});

// Get payment configuration
configuration.get('/payment', async (c) => {
  try {
    const db = c.env.DB;
    
    const settings = await db.prepare(
      "SELECT key, value FROM app_configuration WHERE category = 'payment'"
    ).all();
    
    const paymentConfig: Record<string, string> = {};
    for (const setting of (settings.results || [])) {
      const s = setting as { key: string; value: string };
      paymentConfig[s.key] = s.value || '';
    }
    
    return c.json({
      success: true,
      config: paymentConfig
    });
  } catch (error) {
    console.error('Failed to fetch payment config:', error);
    return c.json({ success: false, error: 'Failed to fetch payment config' }, 500);
  }
});

export default configuration;
