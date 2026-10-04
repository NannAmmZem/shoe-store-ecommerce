/**
 * PostgreSQL Database Connection Helper
 * Manages connection pool for the shoe store database
 */

import { Pool, QueryResult } from 'pg';

// Database configuration from environment variables
const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'shoe_store',
  user: process.env.DB_USER || 'shoe_admin',
  password: process.env.DB_PASSWORD || 'shoe1234',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection fails
};

// Create a single pool instance to be shared across the application
let pool: Pool | null = null;

/**
 * Get or create the database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(config);

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    console.log('✅ Database connection pool created');
  }

  return pool;
}

/**
 * Execute a query with parameters
 * @param text - SQL query string
 * @param params - Query parameters (optional)
 * @returns Query result
 */
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const pool = getPool();
  const start = Date.now();

  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries (> 100ms)
    if (duration > 100) {
      console.log('⚠️ Slow query:', { text, duration, rows: result.rowCount });
    }

    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

/**
 * Test database connection
 * @returns true if connected successfully
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Database connected at:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * Close all connections in the pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection pool closed');
  }
}

// Export the pool for advanced use cases
export default getPool;
