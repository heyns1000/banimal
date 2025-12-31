import { Hono } from "hono";
import { cors } from "hono/cors";
import licenses from "./routes/licenses";
import configuration from "./routes/configuration";
import payments from "./routes/payments";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// Mount routes
app.route("/api/licenses", licenses);
app.route("/api/configuration", configuration);
app.route("/api/payments", payments);

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get brand systems
app.get("/api/systems", async (c) => {
  const db = c.env.DB;
  const systems = await db
    .prepare("SELECT * FROM brand_systems WHERE is_active = 1 ORDER BY system_name")
    .all();
  return c.json({ systems: systems.results });
});

// Get brand tiers
app.get("/api/tiers", async (c) => {
  const db = c.env.DB;
  const tiers = await db
    .prepare("SELECT * FROM brand_tiers WHERE is_active = 1 ORDER BY priority")
    .all();
  return c.json({ tiers: tiers.results });
});

// Get brands with pagination and filters
app.get("/api/brands", async (c) => {
  const db = c.env.DB;
  
  // Parse query parameters
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "20");
  const system = c.req.query("system") || "";
  const tier = c.req.query("tier") || "";
  const search = c.req.query("search") || "";
  const offset = (page - 1) * limit;

  // Build WHERE clause
  const conditions: string[] = ["is_active = 1"];
  const params: any[] = [];

  if (system && system !== "all") {
    conditions.push("system = ?");
    params.push(system);
  }

  if (tier && tier !== "all") {
    conditions.push("tier = ?");
    params.push(tier);
  }

  if (search) {
    conditions.push("(name LIKE ? OR category LIKE ? OR description LIKE ?)");
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  const whereClause = conditions.join(" AND ");

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM brands WHERE ${whereClause}`;
  const countResult = await db.prepare(countQuery).bind(...params).first();
  const total = (countResult as any)?.total || 0;

  // Get paginated results
  const query = `
    SELECT * FROM brands 
    WHERE ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;
  const brands = await db
    .prepare(query)
    .bind(...params, limit, offset)
    .all();

  return c.json({
    brands: brands.results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total
    }
  });
});

// Get single brand
app.get("/api/brands/:id", async (c) => {
  const db = c.env.DB;
  const id = c.req.param("id");

  const brand = await db
    .prepare("SELECT * FROM brands WHERE id = ? AND is_active = 1")
    .bind(id)
    .first();

  if (!brand) {
    return c.json({ error: "Brand not found" }, 404);
  }

  return c.json({ brand });
});

// Webhook endpoint for brand data integration
app.post("/api/webhook/brands", async (c) => {
  const db = c.env.DB;
  
  try {
    const body = await c.req.json();
    const brands = Array.isArray(body) ? body : [body];

    const inserted: any[] = [];
    const errors: any[] = [];

    for (const brandData of brands) {
      try {
        // Validate required fields
        if (!brandData.name || !brandData.system || !brandData.tier) {
          errors.push({
            brand: brandData.name || "unknown",
            error: "Missing required fields: name, system, tier"
          });
          continue;
        }

        // Check if brand already exists
        const existing = await db
          .prepare("SELECT id FROM brands WHERE name = ? AND system = ?")
          .bind(brandData.name, brandData.system)
          .first();

        if (existing) {
          // Update existing brand
          await db
            .prepare(`
              UPDATE brands 
              SET tier = ?, category = ?, description = ?, emoji = ?, 
                  fee = ?, royalty = ?, division = ?, vault_mesh_id = ?,
                  parent_id = ?, use_phrase = ?, subnodes = ?, metadata = ?,
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `)
            .bind(
              brandData.tier,
              brandData.category || "",
              brandData.description || "",
              brandData.emoji || "",
              brandData.fee || null,
              brandData.royalty || null,
              brandData.division || null,
              brandData.vault_mesh_id || null,
              brandData.parent_id || null,
              brandData.use_phrase || null,
              brandData.subnodes ? JSON.stringify(brandData.subnodes) : null,
              brandData.metadata ? JSON.stringify(brandData.metadata) : null,
              (existing as any).id
            )
            .run();

          inserted.push({ id: (existing as any).id, name: brandData.name, action: "updated" });
        } else {
          // Insert new brand
          const result = await db
            .prepare(`
              INSERT INTO brands 
              (name, system, tier, category, description, emoji, fee, royalty, 
               division, vault_mesh_id, parent_id, use_phrase, subnodes, metadata)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
            .bind(
              brandData.name,
              brandData.system,
              brandData.tier,
              brandData.category || "",
              brandData.description || "",
              brandData.emoji || "",
              brandData.fee || null,
              brandData.royalty || null,
              brandData.division || null,
              brandData.vault_mesh_id || null,
              brandData.parent_id || null,
              brandData.use_phrase || null,
              brandData.subnodes ? JSON.stringify(brandData.subnodes) : null,
              brandData.metadata ? JSON.stringify(brandData.metadata) : null
            )
            .run();

          inserted.push({ id: result.meta.last_row_id, name: brandData.name, action: "created" });
        }

        // Update system totals
        await db
          .prepare(`
            UPDATE brand_systems 
            SET total_brands = (SELECT COUNT(*) FROM brands WHERE system = ? AND is_active = 1),
                updated_at = CURRENT_TIMESTAMP
            WHERE system_key = ?
          `)
          .bind(brandData.system, brandData.system)
          .run();

      } catch (error) {
        errors.push({
          brand: brandData.name || "unknown",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    return c.json({
      success: true,
      inserted: inserted.length,
      errors: errors.length,
      details: { inserted, errors }
    });

  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, 400);
  }
});

// Bulk delete brands (with authentication check)
app.delete("/api/webhook/brands", async (c) => {
  const db = c.env.DB;
  
  try {
    const body = await c.req.json();
    const brandIds = body.ids || [];

    if (!Array.isArray(brandIds) || brandIds.length === 0) {
      return c.json({ error: "Invalid or empty brand IDs array" }, 400);
    }

    // Soft delete (set is_active = 0)
    const placeholders = brandIds.map(() => "?").join(",");
    await db
      .prepare(`UPDATE brands SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`)
      .bind(...brandIds)
      .run();

    return c.json({
      success: true,
      deleted: brandIds.length
    });

  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, 400);
  }
});

// Get webhook documentation
app.get("/api/webhook/docs", (c) => {
  const baseUrl = new URL(c.req.url).origin;
  
  return c.json({
    webhook_url: `${baseUrl}/api/webhook/brands`,
    method: "POST",
    content_type: "application/json",
    description: "Submit brand data to the Banimal ecosystem",
    authentication: "None (public endpoint for integration)",
    request_format: {
      single_brand: {
        name: "string (required)",
        system: "string (required: faa, hsomni, or seedwave)",
        tier: "string (required: sovereign, dynastic, operational, market, vaultmesh)",
        category: "string (optional)",
        description: "string (optional)",
        emoji: "string (optional)",
        fee: "string (optional)",
        royalty: "string (optional)",
        division: "string (optional)",
        vault_mesh_id: "string (optional)",
        parent_id: "string (optional)",
        use_phrase: "string (optional)",
        subnodes: "array of strings (optional)",
        metadata: "object (optional)"
      },
      bulk_brands: "Array of brand objects as shown above"
    },
    example_single: {
      name: "AUREUM PATH™",
      system: "seedwave",
      tier: "sovereign",
      category: "Seedwave Verified Brands",
      description: "Legacy Scroll / Wealthline Expansion",
      emoji: "💛",
      fee: "18,800 ECR",
      royalty: "27%",
      use_phrase: "Trace the golden."
    },
    example_bulk: [
      {
        name: "Brand One",
        system: "faa",
        tier: "sovereign",
        category: "Technology"
      },
      {
        name: "Brand Two",
        system: "hsomni",
        tier: "vaultmesh",
        category: "AI & Logic"
      }
    ],
    response_format: {
      success: "boolean",
      inserted: "number of brands inserted/updated",
      errors: "number of errors",
      details: {
        inserted: "array of successful operations",
        errors: "array of failed operations with error messages"
      }
    }
  });
});

// Get stats
app.get("/api/stats", async (c) => {
  const db = c.env.DB;

  const totalBrands = await db
    .prepare("SELECT COUNT(*) as count FROM brands WHERE is_active = 1")
    .first();

  const systemCounts = await db
    .prepare("SELECT system, COUNT(*) as count FROM brands WHERE is_active = 1 GROUP BY system")
    .all();

  const tierCounts = await db
    .prepare("SELECT tier, COUNT(*) as count FROM brands WHERE is_active = 1 GROUP BY tier")
    .all();

  return c.json({
    total: (totalBrands as any)?.count || 0,
    by_system: systemCounts.results,
    by_tier: tierCounts.results
  });
});

export default app;
