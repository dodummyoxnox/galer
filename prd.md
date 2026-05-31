# Backend & Admin CMS Enhancement — Railway Production Ready Implementation Plan

Membangun **backend Express.js + Prisma ORM + PostgreSQL** dan mengintegrasikannya dengan frontend React + Vite. Rencana ini juga mencakup penambahan halaman pengaturan admin (Admin Settings) untuk mengedit nama studio dan seluruh konten halaman landing page secara dinamis tanpa hardcoding.

Implementasi harus siap untuk deployment pada Railway (backend + PostgreSQL) dan Vercel (frontend) dengan praktik produksi yang aman.

---

## User Review Required

> [!IMPORTANT]
> **Prisma ORM & PostgreSQL**
>
> Backend menggunakan Prisma ORM dengan PostgreSQL.
>
> Database PostgreSQL dapat menggunakan Railway PostgreSQL atau PostgreSQL eksternal.
>
> User wajib menyediakan:
>
> ```env
> DATABASE_URL=
> ```
>
> Prisma harus menggunakan migration production:
>
> ```bash
> npx prisma migrate deploy
> ```

> [!IMPORTANT]
> **Image Storage**
>
> Jangan menyimpan gambar ke folder lokal `/uploads`.
>
> Gunakan storage yang kompatibel dengan Amazon S3:
>
> * Cloudflare R2 (direkomendasikan)
> * AWS S3
> * Backblaze B2
> * Supabase Storage
>
> Backend hanya menyimpan URL gambar di database.
>
> Saat lukisan dihapus, file pada storage juga harus ikut dihapus.
>
> Environment variable:
>
> ```env
> STORAGE_PROVIDER=r2
>
> R2_ACCOUNT_ID=
> R2_ACCESS_KEY_ID=
> R2_SECRET_ACCESS_KEY=
> R2_BUCKET_NAME=
> R2_PUBLIC_URL=
> ```

> [!IMPORTANT]
> **Authentication**
>
> JWT disimpan pada cookie httpOnly.
>
> Frontend tidak menyimpan token pada localStorage atau sessionStorage.
>
> Status login diverifikasi melalui endpoint:
>
> ```http
> GET /api/auth/status
> ```

> [!IMPORTANT]
> **Environment Variables**
>
> Semua credential, secret, URL, dan konfigurasi harus berasal dari environment variables.
>
> Tidak boleh ada secret yang di-hardcode dalam source code.

---

## Open Questions

> [!IMPORTANT]
> Admin default tidak boleh menggunakan credential hardcoded.
>
> Gunakan:
>
> ```env
> ADMIN_EMAIL=
> ADMIN_PASSWORD=
> ```
>
> Seed hanya membuat admin jika belum ada akun admin di database.

---

## Environment Variables

```env
NODE_ENV=production

PORT=5000

DATABASE_URL=

JWT_SECRET=

FRONTEND_URL=https://frontend-domain.vercel.app

ADMIN_EMAIL=
ADMIN_PASSWORD=

STORAGE_PROVIDER=r2

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

---

# Proposed Changes

## 1. Backend Setup & Configuration (`server/`)

### [NEW] package.json

Dependencies:

* express
* prisma
* @prisma/client
* bcryptjs
* jsonwebtoken
* cookie-parser
* multer
* cors
* dotenv

Dev Dependencies:

* nodemon

Scripts:

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "prisma:migrate": "prisma migrate dev",
  "prisma:deploy": "prisma migrate deploy",
  "prisma:generate": "prisma generate",
  "prisma:seed": "node prisma/seed.js"
}
```

Menggunakan:

```json
{
  "type": "module"
}
```

---

### [NEW] Prisma Schema

Model:

#### Admin

* id
* email
* passwordHash
* createdAt

#### Lukisan

* id
* slug
* judul
* tahun
* medium
* ukuran
* kanvas
* deskripsi
* harga
* tampilHarga
* status
* featured
* fotoUtama
* fotoLain
* kategoriId
* createdAt
* updatedAt

#### Kategori

* id
* nama
* slug
* lukisan[]

#### Pesan

* id
* nama
* email
* noWa
* jenis
* isi
* status
* createdAt

#### HalamanKonten

* id
* kunci
* konten (Json)
* updatedAt

---

### [NEW] Seed Database

Seed data awal:

* Admin pertama dari:

  * ADMIN_EMAIL
  * ADMIN_PASSWORD

* Kategori bawaan

* Data lukisan contoh

* Konten halaman:

  * tentang
  * info
  * settings

Seed harus memeriksa apakah data sudah ada sebelum membuat ulang.

---

## 2. Backend Express Server

### [NEW] server.js

Setup:

* express
* cors
* express.json
* cookie-parser

Konfigurasi CORS:

```js
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

Tidak menggunakan static local uploads.

Global error handler wajib tersedia.

---

### [NEW] Auth Middleware

Middleware:

```js
protectAdmin
```

Fungsi:

* membaca JWT dari cookie
* validasi token
* inject admin ke request

---

### [NEW] Rate Limiter

Rate limiter sederhana untuk:

```http
POST /api/pesan
```

Mencegah spam.

---

### [NEW] Storage Service

Buat service baru:

```txt
services/storage.js
```

Fitur:

* uploadSingle()
* uploadMultiple()
* deleteFile()

Storage provider default:

Cloudflare R2

Gunakan multer memoryStorage.

Jangan pernah menyimpan file pada filesystem container.

---

### [NEW] Upload Routes

Endpoint:

```http
POST /api/upload/single
POST /api/upload/multiple
```

Upload langsung ke R2.

Response:

```json
{
  "url": "https://..."
}
```

---

### [NEW] Authentication Routes

Endpoints:

```http
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/status
```

Cookie configuration:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none"
}
```

---

### [NEW] Lukisan Routes

CRUD lengkap:

```http
GET /api/lukisan
GET /api/lukisan/:slug

POST /api/lukisan
PUT /api/lukisan/:id

DELETE /api/lukisan/:id
DELETE /api/lukisan
```

Protected:

* POST
* PUT
* DELETE

Saat delete:

* hapus data database
* hapus file gambar dari storage

---

### [NEW] Kategori Routes

```http
GET /api/kategori
POST /api/kategori
PUT /api/kategori/:id
DELETE /api/kategori/:id
```

---

### [NEW] Pesan Routes

```http
POST /api/pesan
GET /api/pesan
PUT /api/pesan/:id/dibaca
DELETE /api/pesan/:id
```

---

### [NEW] Konten Routes

```http
GET /api/konten/:kunci
PUT /api/konten/:kunci
```

Mendukung:

* tentang
* info
* settings

---

## 3. Frontend Integration (React + Vite)

### [MODIFY] Environment Configuration

Gunakan:

```env
VITE_API_URL=http://localhost:5000
```

Production:

```env
VITE_API_URL=https://your-backend.up.railway.app
```

Jangan hardcode localhost.

---

### [NEW] api.js

Helper API:

* auto JSON parsing
* credentials include
* upload FormData
* handling session expired

Contoh:

```js
fetch(`${API_URL}/api/...`, {
  credentials: "include"
})
```

---

### [MODIFY] AuthContext

* login → API
* logout → API
* status → API

Tidak menggunakan sessionStorage.

---

### [NEW] SettingsContext

Memuat:

```http
GET /api/konten/settings
```

Data global:

* studioName
* whatsapp
* email
* instagram
* hero settings
* quote
* CTA

---

### [MODIFY] App.jsx

Tambahkan route:

```txt
/admin/settings
```

Provider:

```txt
SettingsProvider
```

---

### [MODIFY] NavBar

### [MODIFY] Footer

### [MODIFY] AdminSidebar

### [MODIFY] AdminLogin

Gunakan SettingsContext.

Tidak ada string hardcoded:

```txt
STUDIO URAKAN
```

---

### [MODIFY] HeroSection

Data dari settings.

Featured painting dari API.

---

### [MODIFY] Beranda

Fetch:

```http
GET /api/lukisan?limit=6
```

Data CTA, quote, dan hero dari settings.

---

### [MODIFY] Public Pages

Galeri:

```http
GET /api/lukisan
GET /api/kategori
```

Detail:

```http
GET /api/lukisan/:slug
```

Tentang:

```http
GET /api/konten/tentang
```

Info:

```http
GET /api/konten/info
```

Kontak:

```http
POST /api/pesan
```

---

### [MODIFY] Admin Pages

Seluruh data berasal dari API.

Tidak menggunakan mockData.

---

### [NEW] AdminSettings

Fitur:

#### Identitas Studio

* Nama Studio

#### Hero

* Judul Atas
* Judul Bawah
* Tagline

#### Manifesto

* Quote
* Nama Penulis

#### CTA

* Judul CTA
* Deskripsi CTA

#### Kontak

* WhatsApp
* Email
* Instagram

Tombol:

```txt
SIMPAN PERUBAHAN
```

Desain brutalist-clean.

---

# Railway Deployment Requirements

Build Command:

```bash
npm install
npx prisma generate
npm run build
```

Start Command:

```bash
npx prisma migrate deploy && node server.js
```

Semua secret berasal dari Railway Variables.

Tidak boleh ada konfigurasi production yang hardcoded.

Aplikasi harus dapat berjalan setelah deploy pertama tanpa modifikasi kode tambahan.

---

# Verification Plan

## Database

```bash
npx prisma migrate deploy
npm run prisma:seed
```

Pastikan:

* migration sukses
* seed sukses

---

## Backend

Test:

```http
GET /api/lukisan
GET /api/konten/settings
```

Harus mengembalikan data valid.

---

## Authentication

* Login gagal jika password salah
* Login berhasil jika credential benar
* Cookie tersimpan
* Logout menghapus cookie

---

## CMS Settings

* Ubah nama studio
* Ubah hero
* Simpan

Pastikan:

* Navbar berubah
* Footer berubah
* Landing page berubah

Tanpa reload data manual.

---

## Lukisan & Storage

* Upload gambar
* Simpan lukisan
* Edit lukisan
* Hapus lukisan

Pastikan:

* URL tersimpan di database
* File ada di R2
* File terhapus saat lukisan dihapus

---

## Pesan Kontak

* Kirim pesan
* Pesan masuk ke dashboard admin
* Tandai dibaca
* Hapus pesan

Semua perubahan harus tersimpan di database secara permanen.
