# Studio Urakan — Personal Art Gallery & CMS

Platform galeri seni lukis personal (portofolio & pemesanan lukisan) dengan estetika visual **underground zine / brutalist web** pada antarmuka publik dan panel **Admin CMS** yang bersih serta fungsional untuk mengelola seluruh konten secara dinamis.

## Tech Stack
- **Frontend**: React (v19) + Vite + React Router (v7) + Vanilla CSS (No CSS Frameworks)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Prisma ORM)
- **Storage**: Supabase Storage
- **Authentication**: JWT token stored via `httpOnly` secure cookies

---

## Persiapan & Pengaturan Lingkungan (Environment Setup)

### 1. Kredensial Backend (`server/.env`)
Salin file `server/.env.example` menjadi `server/.env` dan sesuaikan nilainya:
```env
NODE_ENV=development
PORT=5000

# Database PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT Secret untuk Autentikasi Admin
JWT_SECRET="isi_dengan_secret_yang_panjang_dan_aman"

# URL Frontend (untuk CORS)
FRONTEND_URL="http://localhost:5173"

# Akun Admin Pertama (untuk Seeding)
ADMIN_EMAIL="admin@studio.com"
ADMIN_PASSWORD="admin123"

# Supabase Storage Configuration
STORAGE_PROVIDER=supabase
SUPABASE_URL="https://your_project_ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
SUPABASE_BUCKET="uploads"
```

> [!IMPORTANT]
> **Supabase Bucket**: Buat bucket baru bernama `uploads` di panel Storage Supabase Anda, dan pastikan akses bucket disetel ke **Public** agar url berkas bisa diakses secara langsung oleh frontend. Gunakan `service_role_key` di backend agar server memiliki hak untuk mengunggah dan menghapus gambar secara otomatis.

---

## Langkah Menjalankan Aplikasi Secara Lokal

### 1. Migrasi & Seeding Database (Backend)
Buka terminal baru di direktori `server/` dan jalankan:
```bash
# Install package server
npm install

# Jalankan migrasi schema Prisma ke database PostgreSQL Anda
npx prisma migrate dev --name init

# Jalankan database seeding untuk memasukkan data awal
npm run prisma:seed
```

### 2. Jalankan Server API
Jalankan perintah ini di direktori `server/`:
```bash
npm run dev
```
Server akan berjalan di port `5000` (`http://localhost:5000`).

### 3. Jalankan Aplikasi Frontend (React)
Buka terminal terpisah di direktori root project (`seni/`) dan jalankan:
```bash
# Install package frontend
npm install

# Jalankan dev server Vite
npm run dev
```
Aplikasi akan dapat diakses melalui browser di alamat `http://localhost:5173`.

---

## Panduan Deployment di Railway

1. Hubungkan repository Git Anda ke Railway.
2. Buat database PostgreSQL bawaan Railway di project yang sama.
3. Railway akan menyuntikkan variabel `DATABASE_URL` secara otomatis.
4. Set variabel lainnya pada pengaturan tab **Variables** di Railway (`JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_URL`, dan kredensial Supabase Anda).
5. Atur build & start command berikut di Railway:
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npx prisma migrate deploy && node server.js`
