const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- MULTER: File Upload Config ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'react-app', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // max 5MB

// --- ENDPOINT UPLOAD FILE ---
app.post('/api/upload', upload.array('photos', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Tidak ada file yang diupload' });
  }
  const urls = req.files.map(f => '/uploads/' + f.filename);
  res.json({ urls });
});

// --- ENDPOINT REGISTRASI USER ---
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Cek apakah email atau username sudah terdaftar di database 'nemuvibe'
    const userExist = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "Email atau Username sudah digunakan." });
    }

    // 2. Enkripsi password agar aman (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Masukkan data user baru ke tabel 'users'
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const userId = newUser.rows[0].id;

    // 4. Inisialisasi default preferences (Bobot 6 kriteria untuk user tersebut)
    // Nilai default 0.16 agar totalnya mendekati 1.0 (100%)
    await pool.query(
      'INSERT INTO user_preferences (user_id, w1_digital, w2_harga, w3_suasana, w4_tenang, w5_hiburan, w6_rasa) VALUES ($1, 0.16, 0.16, 0.16, 0.16, 0.16, 0.16)',
      [userId]
    );

    res.status(201).json({
      message: "Registrasi berhasil!",
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error saat registrasi.');
  }
});

// --- ENDPOINT LOGIN USER ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Cari user berdasarkan email di database 'nemuvibe'
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email tidak terdaftar." });
    }

    // 2. Bandingkan password yang diketik dengan yang terenkripsi di database
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password salah." });
    }

    // 3. Jika cocok, buatkan Token JWT (Berlaku 24 jam)
    const role = user.rows[0].role || 'user';
    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username, role },
      'RAHASIA_KUNCI_NEMUVIBE', // Ganti dengan kata rahasia bebas
      { expiresIn: '24h' }
    );

    res.json({
      message: "Login Berhasil!",
      token: token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
        role: role
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error saat login.');
  }
});

// --- MIDDLEWARE: Verifikasi JWT Token ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan. Silakan login.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'RAHASIA_KUNCI_NEMUVIBE');
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah expired.' });
  }
};

// --- MIDDLEWARE: Verifikasi Admin Role ---
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan.' });
  }
  next();
};

// Endpoint untuk mendapatkan rekomendasi berdasarkan kategori
app.get('/api/recommend/:category', async (req, res) => {
  const { category } = req.params;

  try {
    // 1. Ambil Data Cafe
    const cafeRes = await pool.query('SELECT * FROM cafes');
    const cafes = cafeRes.rows;

    // 2. Ambil Bobot sesuai kategori
    const weightRes = await pool.query('SELECT * FROM weights WHERE nama_kategori = $1', [category]);
    
    if (weightRes.rows.length === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    
    const w = weightRes.rows[0];

    // 3. Hitung Skor SAW
    
    // 3. Hitung Skor SAW dengan normalisasi yang benar
const maxDigital  = Math.max(...cafes.map(c => c.c1_digital));
const minHarga    = Math.min(...cafes.map(c => c.c2_harga));
const maxSuasana  = Math.max(...cafes.map(c => c.c3_suasana));
const maxTenang   = Math.max(...cafes.map(c => c.c4_tenang));
const maxHiburan  = Math.max(...cafes.map(c => c.c5_hiburan));
const maxRasa     = Math.max(...cafes.map(c => c.c6_rasa));

const results = cafes.map(cafe => {
  const n1 = (cafe.c1_digital / maxDigital) * w.w1_digital;  // Benefit
  const n2 = (minHarga / cafe.c2_harga)     * w.w2_harga;    // Cost
  const n3 = (cafe.c3_suasana / maxSuasana) * w.w3_suasana;  // Benefit
  const n4 = (cafe.c4_tenang  / maxTenang)  * w.w4_tenang;   // Benefit
  const n5 = (cafe.c5_hiburan / maxHiburan) * w.w5_hiburan;  // Benefit
  const n6 = (cafe.c6_rasa    / maxRasa)    * w.w6_rasa;     // Benefit

   console.log(`${cafe.nama}: n1=${n1.toFixed(4)} n2=${n2.toFixed(4)} n3=${n3.toFixed(4)} n4=${n4.toFixed(4)} n5=${n5.toFixed(4)} n6=${n6.toFixed(4)}`);
  const totalSkor = n1 + n2 + n3 + n4 + n5 + n6;


  return {
    id: cafe.id,
    nama: cafe.nama,
    alamat: cafe.alamat,
    foto_utama: cafe.foto_utama,
    kategori: cafe.kategori,
    area: cafe.area,
    c1_digital: cafe.c1_digital,
    c2_harga: cafe.c2_harga,
    c3_suasana: cafe.c3_suasana,
    c4_tenang: cafe.c4_tenang,
    c5_hiburan: cafe.c5_hiburan,
    c6_rasa: cafe.c6_rasa,
    skor_akhir: parseFloat(totalSkor.toFixed(4))
  };
});

    // 4. Urutkan dari skor tertinggi (Ranking)
    results.sort((a, b) => b.skor_akhir - a.skor_akhir);

    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Endpoint untuk rekomendasi dengan bobot KUSTOM dari user
app.post('/api/recommend/custom', async (req, res) => {
  const { category, w1, w2, w3, w4, w5, w6 } = req.body;

  try {
    // 1. Ambil Data Cafe
    const cafeRes = await pool.query('SELECT * FROM cafes');
    const cafes = cafeRes.rows;

    // 2. Normalisasi bobot user agar totalnya = 1
    const totalW = w1 + w2 + w3 + w4 + w5 + w6;
    const nw1 = w1 / totalW;
    const nw2 = w2 / totalW;
    const nw3 = w3 / totalW;
    const nw4 = w4 / totalW;
    const nw5 = w5 / totalW;
    const nw6 = w6 / totalW;

    // 3. Hitung Skor SAW dengan bobot kustom
    const maxDigital  = Math.max(...cafes.map(c => c.c1_digital));
const minHarga    = Math.min(...cafes.map(c => c.c2_harga));
const maxSuasana  = Math.max(...cafes.map(c => c.c3_suasana));
const maxTenang   = Math.max(...cafes.map(c => c.c4_tenang));
const maxHiburan  = Math.max(...cafes.map(c => c.c5_hiburan));
const maxRasa     = Math.max(...cafes.map(c => c.c6_rasa));

const results = cafes.map(cafe => {
  const n1 = (cafe.c1_digital / maxDigital) * nw1;  // Benefit
  const n2 = (minHarga / cafe.c2_harga)     * nw2;  // Cost
  const n3 = (cafe.c3_suasana / maxSuasana) * nw3;  // Benefit
  const n4 = (cafe.c4_tenang  / maxTenang)  * nw4;  // Benefit
  const n5 = (cafe.c5_hiburan / maxHiburan) * nw5;  // Benefit
  const n6 = (cafe.c6_rasa    / maxRasa)    * nw6;  // Benefit

  const totalSkor = n1 + n2 + n3 + n4 + n5 + n6;

      return {
        id: cafe.id,
        nama: cafe.nama,
        alamat: cafe.alamat,
        foto_utama: cafe.foto_utama,
        kategori: cafe.kategori,
        area: cafe.area,
        c1_digital: cafe.c1_digital,
        c2_harga: cafe.c2_harga,
        c3_suasana: cafe.c3_suasana,
        c4_tenang: cafe.c4_tenang,
        c5_hiburan: cafe.c5_hiburan,
        c6_rasa: cafe.c6_rasa,
        skor_akhir: parseFloat(totalSkor.toFixed(4))
      };
    });

    // 4. Urutkan dari skor tertinggi
    results.sort((a, b) => b.skor_akhir - a.skor_akhir);

    res.json({ category, results });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/cafes', async (req, res) => {
  const { q } = req.query;
  try {
    let result;
    if (q) {
      result = await pool.query('SELECT * FROM cafes WHERE nama ILIKE $1 ORDER BY id ASC', [`%${q}%`]);
    } else {
      result = await pool.query('SELECT * FROM cafes ORDER BY id ASC');
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- ENDPOINT DETAIL CAFE BY ID ---
app.get('/api/cafes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM cafes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cafe tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- ADMIN: Tambah Cafe Baru ---
app.post('/api/cafes', authenticate, adminOnly, async (req, res) => {
  console.log("Data masuk dari Frontend:", req.body);

  const { nama, alamat, jam_buka, jam_tutup, link_gmaps, kategori, area, keunggulan, foto_utama, galeri, c1_digital, c2_harga, c3_suasana, c4_tenang, c5_hiburan, c6_rasa } = req.body;
  try {
    const toScale5 = (val) => Math.max(1, Math.min(5, Math.round((val / 100) * 5)));
    
    const newCafe = await pool.query(
      `INSERT INTO cafes (nama, alamat, jam_buka, jam_tutup, link_gmaps, kategori, area, keunggulan, foto_utama, galeri, c1_digital, c2_harga, c3_suasana, c4_tenang, c5_hiburan, c6_rasa)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [nama, alamat || '', jam_buka || '', jam_tutup || '', link_gmaps || '',
       kategori || '', area || '', keunggulan || '', foto_utama || '', galeri || '',
       toScale5(c1_digital), toScale5(c2_harga), toScale5(c3_suasana),
       toScale5(c4_tenang), toScale5(c5_hiburan), toScale5(c6_rasa)]
    );
    res.status(201).json(newCafe.rows[0]);
  } catch (err) {
    console.error("ADA ERROR SQL NIH:", err.message);
    res.status(500).json({ message: 'Gagal menambahkan cafe' });
  }
});

// --- ADMIN: Update Cafe ---
app.put('/api/cafes/:id', authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { nama, alamat, jam_buka, jam_tutup, link_gmaps, kategori, area, keunggulan, foto_utama, galeri, c1_digital, c2_harga, c3_suasana, c4_tenang, c5_hiburan, c6_rasa } = req.body;
  try {
    const toScale5 = (val) => Math.max(1, Math.min(5, Math.round((val / 100) * 5)));
    
    const result = await pool.query(
      `UPDATE cafes SET nama=$1, alamat=$2, jam_buka=$3, jam_tutup=$4, link_gmaps=$5,
       kategori=$6, area=$7, keunggulan=$8, foto_utama=$9, galeri=$10,
       c1_digital=$11, c2_harga=$12, c3_suasana=$13, c4_tenang=$14, c5_hiburan=$15, c6_rasa=$16
       WHERE id=$17 RETURNING *`,
      [nama, alamat || '', jam_buka || '', jam_tutup || '', link_gmaps || '',
       kategori || '', area || '', keunggulan || '', foto_utama || '', galeri || '',
       toScale5(c1_digital), toScale5(c2_harga), toScale5(c3_suasana),
       toScale5(c4_tenang), toScale5(c5_hiburan), toScale5(c6_rasa), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cafe tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Gagal mengupdate cafe' });
  }
});

// --- ADMIN: Hapus Cafe ---
app.delete('/api/cafes/:id', authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM cafes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cafe tidak ditemukan' });
    }
    res.json({ message: 'Cafe berhasil dihapus', id: result.rows[0].id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Gagal menghapus cafe' });
  }
});

// --- ADMIN: Get All Weights ---
app.get('/api/weights', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM weights ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- ADMIN: Update Weights by Category ---
app.put('/api/weights/:category', authenticate, adminOnly, async (req, res) => {
  const { category } = req.params;
  const { w1_digital, w2_harga, w3_suasana, w4_tenang, w5_hiburan, w6_rasa } = req.body;
  try {
    const result = await pool.query(
      `UPDATE weights SET w1_digital=$1, w2_harga=$2, w3_suasana=$3, w4_tenang=$4, w5_hiburan=$5, w6_rasa=$6
       WHERE nama_kategori=$7 RETURNING *`,
      [w1_digital, w2_harga, w3_suasana, w4_tenang, w5_hiburan, w6_rasa, category]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Gagal mengupdate bobot' });
  }
});

// --- SAVED: Ambil semua cafe tersimpan milik user ---
app.get('/api/saved', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.* FROM saved_cafes sc
       JOIN cafes c ON c.id = sc.cafe_id
       WHERE sc.user_id = $1
       ORDER BY sc.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Gagal mengambil data tersimpan' });
  }
});

// --- SAVED: Cek apakah cafe tertentu sudah disimpan ---
app.get('/api/saved/check/:cafeId', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id FROM saved_cafes WHERE user_id = $1 AND cafe_id = $2',
      [req.user.id, req.params.cafeId]
    );
    res.json({ saved: result.rows.length > 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- SAVED: Toggle simpan/hapus cafe ---
app.post('/api/saved/:cafeId', authenticate, async (req, res) => {
  const { cafeId } = req.params;
  try {
    // Cek apakah sudah tersimpan
    const existing = await pool.query(
      'SELECT id FROM saved_cafes WHERE user_id = $1 AND cafe_id = $2',
      [req.user.id, cafeId]
    );
    if (existing.rows.length > 0) {
      // Sudah ada → hapus (unsave)
      await pool.query('DELETE FROM saved_cafes WHERE user_id = $1 AND cafe_id = $2', [req.user.id, cafeId]);
      res.json({ saved: false, message: 'Cafe dihapus dari simpanan' });
    } else {
      // Belum ada → simpan
      await pool.query('INSERT INTO saved_cafes (user_id, cafe_id) VALUES ($1, $2)', [req.user.id, cafeId]);
      res.json({ saved: true, message: 'Cafe berhasil disimpan' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Gagal toggle simpan cafe' });
  }
});

// --- SAVED: Hitung jumlah cafe tersimpan user ---
app.get('/api/saved/count', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*)::int AS count FROM saved_cafes WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- USER PREFS: Ambil preferensi per kategori ---
app.get('/api/user-preferences/:category', authenticate, async (req, res) => {
  const { category } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM user_category_preferences WHERE user_id = $1 AND category = $2',
      [req.user.id, category]
    );
    if (result.rows.length === 0) {
      // Return default values
      return res.json({
        category,
        w1_digital: 50, w2_harga: 50, w3_suasana: 50,
        w4_tenang: 50, w5_hiburan: 50, w6_rasa: 50
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Gagal mengambil preferensi' });
  }
});

// --- USER PREFS: Ambil semua preferensi user (3 kategori) ---
app.get('/api/user-preferences', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_category_preferences WHERE user_id = $1 ORDER BY category',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Gagal mengambil preferensi' });
  }
});

// --- USER PREFS: Simpan/Update preferensi per kategori ---
app.put('/api/user-preferences/:category', authenticate, async (req, res) => {
  const { category } = req.params;
  const { w1_digital, w2_harga, w3_suasana, w4_tenang, w5_hiburan, w6_rasa } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO user_category_preferences (user_id, category, w1_digital, w2_harga, w3_suasana, w4_tenang, w5_hiburan, w6_rasa, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (user_id, category)
       DO UPDATE SET w1_digital=$3, w2_harga=$4, w3_suasana=$5, w4_tenang=$6, w5_hiburan=$7, w6_rasa=$8, updated_at=NOW()
       RETURNING *`,
      [req.user.id, category, w1_digital, w2_harga, w3_suasana, w4_tenang, w5_hiburan, w6_rasa]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Gagal menyimpan preferensi' });
  }
});

app.listen(PORT, () => {
  console.log(`Server NemuVibe jalan di port ${PORT}`);
});