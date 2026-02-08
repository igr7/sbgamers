import { Pool, QueryResult, QueryResultRow } from "pg";

// Lazy pool initialization to prevent startup crashes
let pool: Pool | null = null;

const getPool = (): Pool => {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  if (!pool) {
    throw new Error("Database not configured");
  }
  return pool;
};

// Helper to check if database is configured
export const isDatabaseConfigured = (): boolean => {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL !== "");
};

// Query helper with error handling
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const client = await getPool().connect();
  try {
    const result = await client.query<T>(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Product queries
export const productQueries = {
  getAll: async (filters?: {
    category?: string;
    brand?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    let sql = `
      SELECT
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pr.id,
              'retailer', pr.retailer,
              'price', pr.price,
              'currency', pr.currency,
              'url', pr.url,
              'in_stock', pr.in_stock,
              'last_checked', pr.last_checked
            )
          ) FILTER (WHERE pr.id IS NOT NULL),
          '[]'
        ) as prices
      FROM products p
      LEFT JOIN prices pr ON p.id = pr.product_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.category) {
      sql += ` AND p.category = $${paramIndex++}`;
      params.push(filters.category);
    }
    if (filters?.brand) {
      sql += ` AND p.brand = $${paramIndex++}`;
      params.push(filters.brand);
    }
    if (filters?.search) {
      sql += ` AND (p.name ILIKE $${paramIndex++} OR p.brand ILIKE $${paramIndex++})`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    if (filters?.limit) {
      sql += ` LIMIT $${paramIndex++}`;
      params.push(filters.limit);
    }
    if (filters?.offset) {
      sql += ` OFFSET $${paramIndex++}`;
      params.push(filters.offset);
    }

    return query(sql, params);
  },

  getById: async (id: string) => {
    const sql = `
      SELECT
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pr.id,
              'retailer', pr.retailer,
              'price', pr.price,
              'currency', pr.currency,
              'url', pr.url,
              'in_stock', pr.in_stock,
              'last_checked', pr.last_checked
            )
          ) FILTER (WHERE pr.id IS NOT NULL),
          '[]'
        ) as prices
      FROM products p
      LEFT JOIN prices pr ON p.id = pr.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `;
    return query(sql, [id]);
  },

  getPriceHistory: async (productId: string, days: number = 90) => {
    const sql = `
      SELECT * FROM price_history
      WHERE product_id = $1
        AND recorded_at >= NOW() - INTERVAL '${days} days'
      ORDER BY recorded_at ASC
    `;
    return query(sql, [productId]);
  },
};

// Alert queries
export const alertQueries = {
  create: async (data: {
    email: string;
    product_id: string;
    target_price?: number;
    alert_type?: string;
  }) => {
    const sql = `
      INSERT INTO alert_subscriptions (email, product_id, target_price, alert_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    return query(sql, [
      data.email,
      data.product_id,
      data.target_price || null,
      data.alert_type || "price_drop",
    ]);
  },

  delete: async (id: string, email: string) => {
    const sql = `
      DELETE FROM alert_subscriptions
      WHERE id = $1 AND email = $2
      RETURNING *
    `;
    return query(sql, [id, email]);
  },

  getByEmail: async (email: string) => {
    const sql = `
      SELECT a.*, p.name as product_name
      FROM alert_subscriptions a
      JOIN products p ON a.product_id = p.id
      WHERE a.email = $1 AND a.is_active = true
    `;
    return query(sql, [email]);
  },
};
