// Database Migration Script
// Run with: node scripts/migrate.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];

if (!DATABASE_URL) {
  console.error('Usage: DATABASE_URL=... node scripts/migrate.js');
  console.error('   or: node scripts/migrate.js <database_url>');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration(filename) {
  const filePath = path.join(__dirname, '..', 'supabase', 'migrations', filename);
  const sql = fs.readFileSync(filePath, 'utf8');

  console.log(`Running migration: ${filename}`);
  try {
    await pool.query(sql);
    console.log(`✓ ${filename} completed`);
  } catch (error) {
    console.error(`✗ ${filename} failed:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('Starting database migrations...\n');

  try {
    await runMigration('001_initial_schema.sql');
    await runMigration('002_seed_data.sql');

    console.log('\n✓ All migrations completed successfully!');
  } catch (error) {
    console.error('\n✗ Migration failed');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
