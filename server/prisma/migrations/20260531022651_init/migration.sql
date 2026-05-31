-- CreateEnum
CREATE TYPE "StatusLukisan" AS ENUM ('TERSEDIA', 'TERJUAL', 'TIDAK_DIJUAL');

-- CreateEnum
CREATE TYPE "StatusPesan" AS ENUM ('BARU', 'DIBACA');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lukisan" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "medium" TEXT NOT NULL,
    "ukuran" TEXT NOT NULL,
    "kanvas" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "harga" INTEGER,
    "tampilHarga" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusLukisan" NOT NULL DEFAULT 'TERSEDIA',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "fotoUtama" TEXT NOT NULL,
    "fotoLain" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lukisan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pesan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noWa" TEXT,
    "jenis" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "status" "StatusPesan" NOT NULL DEFAULT 'BARU',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pesan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HalamanKonten" (
    "id" SERIAL NOT NULL,
    "kunci" TEXT NOT NULL,
    "konten" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HalamanKonten_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LukisanKategori" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lukisan_slug_key" ON "Lukisan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_nama_key" ON "Kategori"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_slug_key" ON "Kategori"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HalamanKonten_kunci_key" ON "HalamanKonten"("kunci");

-- CreateIndex
CREATE UNIQUE INDEX "_LukisanKategori_AB_unique" ON "_LukisanKategori"("A", "B");

-- CreateIndex
CREATE INDEX "_LukisanKategori_B_index" ON "_LukisanKategori"("B");

-- AddForeignKey
ALTER TABLE "_LukisanKategori" ADD CONSTRAINT "_LukisanKategori_A_fkey" FOREIGN KEY ("A") REFERENCES "Kategori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LukisanKategori" ADD CONSTRAINT "_LukisanKategori_B_fkey" FOREIGN KEY ("B") REFERENCES "Lukisan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
