import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const brands = new Hono<{ Bindings: Env }>();

// Get system stats
brands.get('/stats', async (c) => {
  try {
    const db = c.env.DB;
    
    const stats = await db
      .prepare('SELECT system, COUNT(*) as total FROM brands WHERE is_active = 1 GROUP BY system')
      .all();

    return c.json({
      success: true,
      stats: stats.results || []
    });
  } catch (error) {
    console.error('Failed to fetch system stats:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

// Existing routes...
brands.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const system = c.req.query('system');
  const tier = c.req.query('tier');
  const search = c.req.query('search');

  const offset = (page - 1) * limit;

  try {
    const db = c.env.DB;
    
    let whereConditions: string[] = ['is_active = 1'];
    let params: any[] = [];

    if (system) {
      whereConditions.push('system = ?');
      params.push(system);
    }

    if (tier) {
      whereConditions.push('tier = ?');
      params.push(tier);
    }

    if (search) {
      whereConditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    const countResult = await db
      .prepare(`SELECT COUNT(*) as total FROM brands WHERE ${whereClause}`)
      .bind(...params)
      .first<{ total: number }>();

    const brands = await db
      .prepare(`SELECT * FROM brands WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .bind(...params, limit, offset)
      .all();

    const total = countResult?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return c.json({
      brands: brands.results || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return c.json({ error: 'Failed to fetch brands' }, 500);
  }
});

const webhookSchema = z.object({
  brands: z.array(z.object({
    name: z.string(),
    system: z.string(),
    tier: z.string(),
    category: z.string(),
    description: z.string().optional(),
    emoji: z.string().optional(),
    fee: z.string().optional(),
    royalty: z.string().optional(),
    division: z.string().optional(),
    vault_mesh_id: z.string().optional(),
    parent_id: z.string().optional(),
    use_phrase: z.string().optional(),
    subnodes: z.string().optional(),
    metadata: z.string().optional()
  }))
});

brands.post('/webhook/brands', zValidator('json', webhookSchema), async (c) => {
  const { brands: incomingBrands } = c.req.valid('json');

  try {
    const db = c.env.DB;

    for (const brand of incomingBrands) {
      await db
        .prepare(`
          INSERT INTO brands (
            name, system, tier, category, description, emoji, fee, royalty,
            division, vault_mesh_id, parent_id, use_phrase, subnodes, metadata
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          brand.name,
          brand.system,
          brand.tier,
          brand.category,
          brand.description || null,
          brand.emoji || null,
          brand.fee || null,
          brand.royalty || null,
          brand.division || null,
          brand.vault_mesh_id || null,
          brand.parent_id || null,
          brand.use_phrase || null,
          brand.subnodes || null,
          brand.metadata || null
        )
        .run();
    }

    return c.json({
      success: true,
      message: `Successfully imported ${incomingBrands.length} brands`
    });
  } catch (error) {
    console.error('Failed to import brands:', error);
    return c.json({ success: false, error: 'Failed to import brands' }, 500);
  }
});

export default brands;
