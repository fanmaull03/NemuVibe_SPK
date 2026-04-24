const pool = require('./db');
require('dotenv').config();
const bcrypt = require('bcryptjs');

async function migrate() {
  try {
    // 1. Add role column to users table
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'
    `);
    console.log('✅ Kolom "role" berhasil ditambahkan ke tabel users');

    // 2. Create default admin account (if not exists)
    const existing = await pool.query("SELECT id FROM users WHERE email = 'admin@nemuvibe.com'");
    if (existing.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash('admin123', salt);
      await pool.query(
        "INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@nemuvibe.com', $1, 'admin')",
        [hashed]
      );
      console.log('✅ Akun admin default dibuat: admin@nemuvibe.com / admin123');
    } else {
      // Update existing admin to have admin role
      await pool.query("UPDATE users SET role = 'admin' WHERE email = 'admin@nemuvibe.com'");
      console.log('✅ Akun admin sudah ada, role diupdate ke admin');
    }

    console.log('\n🎉 Migrasi admin selesai!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error migrasi:', err.message);
    process.exit(1);
  }
}

migrate();
