# NemuVibe Frontend (React + Vite)

NemuVibe adalah aplikasi rekomendasi cafe berbasis metode SAW (Simple Additive Weighting).
Frontend ini berkomunikasi dengan API backend Express dan database PostgreSQL.

## Fitur Utama

- Auth: register, login, token JWT
- Rekomendasi cafe berdasarkan kategori
- Rekomendasi kustom berdasarkan preferensi pengguna
- Ranking cafe
- Detail cafe, pencarian cafe, dan simpan cafe favorit
- Manajemen preferensi pengguna
- Admin panel untuk tambah, edit, hapus cafe dan update bobot
- Upload foto cafe (melalui backend)

## Stack

- Frontend: React, React Router, Axios, Vite
- Backend API: Express, PostgreSQL, JWT, Multer
- Database: PostgreSQL

## Struktur Proyek (yang dipakai)

- react-app: aplikasi frontend React
- backend: REST API Express + koneksi PostgreSQL

Catatan:
Perintah npm run dev harus dijalankan di folder react-app, bukan di root proyek.

## Prasyarat

- Node.js 18+
- npm 9+
- PostgreSQL aktif

## Konfigurasi Backend

Backend membaca env dari file .env di folder backend.

Contoh isi file backend/.env:

DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=nemuvibe
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000

## Setup Database

1. Buat database PostgreSQL, misalnya nemuvibe.
2. Import schema/data SQL sesuai kebutuhan dari file di folder backend.
3. Pastikan tabel user, cafes, weights, saved, dan preferences sudah tersedia.

## Menjalankan Aplikasi (Development)

Jalankan backend dan frontend di terminal terpisah.

1. Backend

	 cd backend
	 npm install
	 node index.js

	 API berjalan di http://localhost:5000

2. Frontend

	 cd react-app
	 npm install
	 npm run dev

	 App berjalan di URL Vite (biasanya http://localhost:5173)

## Konfigurasi API Frontend

Base URL API saat ini ada di src/services/api.js:

http://localhost:5000/api

Jika port/backend host berubah, sesuaikan nilai tersebut.

## Skrip Frontend

- npm run dev: jalankan mode development
- npm run build: build production
- npm run preview: preview hasil build
- npm run lint: lint kode

## Rute Halaman Utama

- /: home
- /ranking: ranking cafe
- /detail/:id: detail cafe
- /search: pencarian
- /saved: daftar simpanan
- /preferences dan /preferences/:category: preferensi user
- /recommendation: hasil rekomendasi
- /admin, /admin/add, /admin/edit/:id: halaman admin

## Troubleshooting

- Error Missing script: dev
	Kamu menjalankan npm run dev di folder yang salah. Pindah ke folder react-app dulu.

- Backend gagal saat npm start
	Di backend saat ini belum ada script start pada package.json. Gunakan node index.js.

- CORS atau request gagal
	Pastikan backend berjalan di port 5000 dan API base URL frontend sesuai.
