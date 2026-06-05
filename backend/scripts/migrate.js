const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration file(s):`, files);

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`\nRunning migration: ${file}`);
    try {
      await pool.query(sql);
      console.log(`✅ ${file} — completed`);
    } catch (err) {
      console.error(`❌ ${file} — FAILED:`, err.message);
      process.exit(1);
    }
  }

  console.log('\nAll migrations complete.');
  await pool.end();
}

runMigrations();
