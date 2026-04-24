# NemuVibe SPK

NemuVibe adalah aplikasi Sistem Pendukung Keputusan (SPK) untuk rekomendasi cafe menggunakan metode SAW (Simple Additive Weighting).

Repositori ini berisi:

- `react-app/` frontend React + Vite
- `backend/` REST API Express + PostgreSQL
- `frontend/` aset/versi frontend lama

## Fitur Utama

- Registrasi dan login pengguna (JWT)
- Rekomendasi cafe per kategori
- Rekomendasi kustom berdasarkan preferensi pengguna
- Ranking cafe
- Detail cafe, pencarian, dan simpan cafe favorit
- Admin panel untuk CRUD cafe dan update bobot
- Upload foto cafe

## Menjalankan Project

1. Jalankan backend

```bash
cd backend
npm install
node index.js
```

2. Jalankan frontend

```bash
cd react-app
npm install
npm run dev
```

Frontend default: `http://localhost:5173`  
Backend default: `http://localhost:5000`

## Konfigurasi Backend

Buat file `.env` di folder `backend/`:

```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=nemuvibe
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
```

## Dokumentasi Frontend

Dokumentasi lebih detail tersedia di [react-app/README.md](react-app/README.md).