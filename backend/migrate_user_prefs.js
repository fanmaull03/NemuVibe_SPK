// Migrasi: Buat tabel user_category_preferences (preferensi per kategori per user)
const pool = require('./db');

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_category_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(30) NOT NULL,
        w1_digital REAL DEFAULT 50,
        w2_harga REAL DEFAULT 50,
        w3_suasana REAL DEFAULT 50,
        w4_tenang REAL DEFAULT 50,
        w5_hiburan REAL DEFAULT 50,
        w6_rasa REAL DEFAULT 50,
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, category)
      );
    `);
    console.log('✅ Tabel user_category_preferences berhasil dibuat!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal migrasi:', err.message);
    process.exit(1);
  }
}

migrate();
