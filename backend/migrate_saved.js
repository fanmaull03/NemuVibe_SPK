// Migrasi: Buat tabel saved_cafes
const pool = require('./db');

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_cafes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        cafe_id INTEGER NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, cafe_id)
      );
    `);
    console.log('✅ Tabel saved_cafes berhasil dibuat!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal migrasi:', err.message);
    process.exit(1);
  }
}

migrate();
