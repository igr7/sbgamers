// Test CranL.com database connection
const { Pool } = require('pg');

async function testConnection(name, config) {
    console.log(`\n🔄 Testing: ${name}`);
    console.log(`   Host: ${config.connectionString.split('@')[1]?.split('/')[0] || 'N/A'}`);
    const pool = new Pool(config);

    try {
        const result = await pool.query('SELECT NOW() as time');
        console.log(`✅ Connected! Server time: ${result.rows[0].time}`);
        await pool.end();
        return true;
    } catch (err) {
        console.log(`❌ Failed: ${err.message}`);
        try { await pool.end(); } catch { }
        return false;
    }
}

async function main() {
    console.log('🔍 Testing CranL.com database connections...\n');

    const configs = [
        {
            name: 'CranL.com format 1',
            config: {
                connectionString: 'postgresql://dbsbgamers:3Q6yjF2sfuUHnFNL33TIytoSzpoUsxEZ@sbgamers-zlwi8g.cranl.com:5432/sbgamers',
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 15000,
            }
        },
        {
            name: 'CranL.com format 2 (db prefix)',
            config: {
                connectionString: 'postgresql://dbsbgamers:3Q6yjF2sfuUHnFNL33TIytoSzpoUsxEZ@db.sbgamers-zlwi8g.cranl.com:5432/sbgamers',
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 15000,
            }
        },
        {
            name: 'CranL.com format 3 (postgres prefix)',
            config: {
                connectionString: 'postgresql://dbsbgamers:3Q6yjF2sfuUHnFNL33TIytoSzpoUsxEZ@postgres.cranl.com:5432/sbgamers',
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 15000,
            }
        },
        {
            name: 'Original (internal hostname)',
            config: {
                connectionString: 'postgresql://dbsbgamers:3Q6yjF2sfuUHnFNL33TIytoSzpoUsxEZ@sbgamers-zlwi8g:5432/sbgamers',
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 15000,
            }
        },
    ];

    for (const { name, config } of configs) {
        const success = await testConnection(name, config);
        if (success) {
            console.log('\n🎉 Found working connection!');
            console.log('Connection string:', config.connectionString.replace(/:[^:@]+@/, ':****@'));
            break;
        }
    }
}

main();
