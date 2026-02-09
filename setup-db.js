// Database setup script - runs schema and seed
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: 'postgresql://dbsbgamers:3Q6yjF2sfuUHnFNL33TIytoSzpoUsxEZ@sbgamers-zlwi8g:5432/sbgamers',
    ssl: { rejectUnauthorized: false },
});

async function runSQL(filename) {
    const filePath = path.join(__dirname, 'database', filename);
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split by semicolon but keep the statements
    const statements = sql.split(/;[\r\n]+/).filter(s => s.trim().length > 0);

    for (const statement of statements) {
        try {
            await pool.query(statement);
            console.log('✓ Executed:', statement.substring(0, 50) + '...');
        } catch (err) {
            // Ignore "already exists" errors
            if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
                console.error('✗ Error:', err.message);
            }
        }
    }
}

async function main() {
    try {
        console.log('🚀 Connecting to database...');
        await pool.query('SELECT NOW()');
        console.log('✓ Connected!\n');

        console.log('📋 Running schema.sql...');
        await runSQL('schema.sql');
        console.log('✓ Schema complete!\n');

        console.log('🌱 Running seed.sql...');
        await runSQL('seed.sql');
        console.log('✓ Seed complete!\n');

        // Verify data
        const products = await pool.query('SELECT COUNT(*) as count FROM products');
        const prices = await pool.query('SELECT COUNT(*) as count FROM prices');

        console.log('📊 Database stats:');
        console.log(`   Products: ${products.rows[0].count}`);
        console.log(`   Prices: ${prices.rows[0].count}`);

        console.log('\n✅ Database setup complete!');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await pool.end();
    }
}

main();
