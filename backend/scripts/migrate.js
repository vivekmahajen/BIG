require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigrations() {
  const dir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  console.log(`Running ${files.length} migration(s):`, files);
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log(`\n→ ${file}`);
    try {
      await pool.query(sql);
      console.log(`  ✅ done`);
    } catch (err) {
      console.error(`  ❌ FAILED:`, err.message);
      process.exit(1);
    }
  }
  console.log('\nAll migrations complete.');
  await pool.end();
}

runMigrations();
