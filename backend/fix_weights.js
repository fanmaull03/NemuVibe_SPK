const pool = require('./db');
require('dotenv').config();

async function fix() {
  try {
    // Rename nongki -> nongkrong
    const r1 = await pool.query(
      "UPDATE weights SET nama_kategori='nongkrong' WHERE nama_kategori='nongki'"
    );
    console.log('Updated nongki->nongkrong:', r1.rowCount, 'rows');

    // Rename date -> ngedate
    const r2 = await pool.query(
      "UPDATE weights SET nama_kategori='ngedate' WHERE nama_kategori='date'"
    );
    console.log('Updated date->ngedate:', r2.rowCount, 'rows');

    // Confirm
    const final = await pool.query('SELECT nama_kategori FROM weights ORDER BY id');
    console.log('Final categories:', final.rows.map(x => x.nama_kategori));
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    pool.end();
  }
}

fix();
