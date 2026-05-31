import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protectAdmin } from '../middlewares/auth.js';
import { deleteFile } from '../services/storage.js';

const router = express.Router();
const prisma = new PrismaClient();

// Helper: slugify title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// GET all paintings (Public)
router.get('/', async (req, res) => {
  const { status, kategori, featured, q, sort, limit } = req.query;

  try {
    const where = {};

    // Filter status
    if (status) {
      where.status = status;
    }

    // Filter featured
    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    // Filter kategori slug
    if (kategori) {
      where.kategori = {
        some: {
          slug: kategori,
        },
      };
    }

    // Search query
    if (q) {
      where.OR = [
        { judul: { contains: q, mode: 'insensitive' } },
        { deskripsi: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Sorting
    let orderBy = { createdAt: 'desc' }; // default: terbaru
    if (sort === 'terlama') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'judul-az') {
      orderBy = { judul: 'asc' };
    } else if (sort === 'judul-za') {
      orderBy = { judul: 'desc' };
    } else if (sort === 'tahun-terbaru') {
      orderBy = { tahun: 'desc' };
    } else if (sort === 'tahun-terlama') {
      orderBy = { tahun: 'asc' };
    }

    const queryOptions = {
      where,
      orderBy,
      include: {
        kategori: {
          select: { id: true, nama: true, slug: true },
        },
      },
    };

    if (limit) {
      queryOptions.take = parseInt(limit);
    }

    const lukisan = await prisma.lukisan.findMany(queryOptions);
    return res.json({ success: true, count: lukisan.length, data: lukisan });
  } catch (error) {
    console.error('Get Lukisan Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data lukisan.' });
  }
});

// GET detail painting by slug (Public)
router.get('/:slugOrId', async (req, res) => {
  const { slugOrId } = req.params;
  const isNumeric = /^\d+$/.test(slugOrId);
  const queryWhere = isNumeric ? { id: parseInt(slugOrId) } : { slug: slugOrId };

  try {
    const lukisan = await prisma.lukisan.findUnique({
      where: queryWhere,
      include: {
        kategori: {
          select: { id: true, nama: true, slug: true },
        },
      },
    });

    if (!lukisan) {
      return res.status(404).json({ success: false, error: 'Lukisan tidak ditemukan.' });
    }

    // Cari lukisan sebelum (prev) dan sesudah (next) untuk navigasi detail page
    const prevLukisan = await prisma.lukisan.findFirst({
      where: { id: { lt: lukisan.id } },
      orderBy: { id: 'desc' },
      select: { slug: true, judul: true },
    });

    const nextLukisan = await prisma.lukisan.findFirst({
      where: { id: { gt: lukisan.id } },
      orderBy: { id: 'asc' },
      select: { slug: true, judul: true },
    });

    return res.json({
      success: true,
      data: lukisan,
      prev: prevLukisan ? { slug: prevLukisan.slug, judul: prevLukisan.judul } : null,
      next: nextLukisan ? { slug: nextLukisan.slug, judul: nextLukisan.judul } : null,
    });
  } catch (error) {
    console.error('Get Lukisan Detail Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil detail lukisan.' });
  }
});

// POST create painting (Protected)
router.post('/', protectAdmin, async (req, res) => {
  const {
    judul,
    tahun,
    medium,
    ukuran,
    kanvas,
    deskripsi,
    harga,
    tampilHarga,
    status,
    featured,
    fotoUtama,
    fotoLain,
    kategoriIds,
  } = req.body;

  if (!judul || !fotoUtama) {
    return res.status(400).json({ success: false, error: 'Judul dan Foto Utama wajib diisi.' });
  }

  try {
    // Generate unique slug
    let baseSlug = slugify(judul);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.lukisan.findUnique({ where: { slug: uniqueSlug } });
      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Connect kategori
    const connectKategori = Array.isArray(kategoriIds)
      ? kategoriIds.map((id) => ({ id: parseInt(id) }))
      : [];

    const newLukisan = await prisma.lukisan.create({
      data: {
        judul,
        slug: uniqueSlug,
        tahun: tahun ? parseInt(tahun) : new Date().getFullYear(),
        medium: medium || '',
        ukuran: ukuran || '',
        kanvas: kanvas || '',
        deskripsi: deskripsi || '',
        harga: harga ? parseInt(harga) : null,
        tampilHarga: tampilHarga === true,
        status: status || 'TERSEDIA',
        featured: featured === true,
        fotoUtama,
        fotoLain: Array.isArray(fotoLain) ? fotoLain : [],
        kategori: {
          connect: connectKategori,
        },
      },
      include: {
        kategori: true,
      },
    });

    return res.status(201).json({ success: true, data: newLukisan });
  } catch (error) {
    console.error('Create Lukisan Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal menambahkan lukisan baru.' });
  }
});

// PUT update painting (Protected)
router.put('/:id', protectAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    judul,
    tahun,
    medium,
    ukuran,
    kanvas,
    deskripsi,
    harga,
    tampilHarga,
    status,
    featured,
    fotoUtama,
    fotoLain,
    kategoriIds,
  } = req.body;

  try {
    const lukisanId = parseInt(id);
    const existingLukisan = await prisma.lukisan.findUnique({
      where: { id: lukisanId },
    });

    if (!existingLukisan) {
      return res.status(404).json({ success: false, error: 'Lukisan tidak ditemukan.' });
    }

    // Hapus foto lama di R2 jika diganti
    if (fotoUtama && existingLukisan.fotoUtama && existingLukisan.fotoUtama !== fotoUtama) {
      await deleteFile(existingLukisan.fotoUtama);
    }

    // Hapus foto tambahan lama di R2 jika tidak ada lagi di list baru
    if (Array.isArray(fotoLain)) {
      const deletedPhotos = existingLukisan.fotoLain.filter(
        (url) => !fotoLain.includes(url)
      );
      for (const url of deletedPhotos) {
        await deleteFile(url);
      }
    }

    // Siapkan update data
    const updateData = {
      judul,
      tahun: tahun ? parseInt(tahun) : undefined,
      medium,
      ukuran,
      kanvas,
      deskripsi,
      harga: harga !== undefined ? (harga ? parseInt(harga) : null) : undefined,
      tampilHarga,
      status,
      featured,
      fotoUtama,
      fotoLain: Array.isArray(fotoLain) ? fotoLain : undefined,
    };

    // Update slug jika judul berubah
    if (judul && judul !== existingLukisan.judul) {
      let baseSlug = slugify(judul);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await prisma.lukisan.findFirst({
          where: { slug: uniqueSlug, id: { not: lukisanId } },
        });
        if (!existing) break;
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = uniqueSlug;
    }

    // Set kategori (putuskan yang lama, sambungkan yang baru)
    if (Array.isArray(kategoriIds)) {
      updateData.kategori = {
        set: [], // putuskan relasi kategori lama
        connect: kategoriIds.map((katId) => ({ id: parseInt(katId) })), // hubungkan baru
      };
    }

    const updated = await prisma.lukisan.update({
      where: { id: lukisanId },
      data: updateData,
      include: {
        kategori: true,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update Lukisan Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal memperbarui lukisan.' });
  }
});

// DELETE single painting (Protected)
router.delete('/:id', protectAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const lukisanId = parseInt(id);
    const lukisan = await prisma.lukisan.findUnique({
      where: { id: lukisanId },
    });

    if (!lukisan) {
      return res.status(404).json({ success: false, error: 'Lukisan tidak ditemukan.' });
    }

    // Hapus dari database
    await prisma.lukisan.delete({
      where: { id: lukisanId },
    });

    // Hapus file gambar terkait di Cloudflare R2
    if (lukisan.fotoUtama) {
      await deleteFile(lukisan.fotoUtama);
    }
    if (Array.isArray(lukisan.fotoLain)) {
      for (const url of lukisan.fotoLain) {
        await deleteFile(url);
      }
    }

    return res.json({ success: true, message: 'Lukisan berhasil dihapus secara permanen.' });
  } catch (error) {
    console.error('Delete Lukisan Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal menghapus lukisan.' });
  }
});

// DELETE bulk paintings (Protected)
router.delete('/', protectAdmin, async (req, res) => {
  const { ids } = req.body; // array of IDs

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, error: 'ID lukisan wajib disertakan.' });
  }

  try {
    const parsedIds = ids.map((id) => parseInt(id));

    // Dapatkan file-file gambar lukisan terlebih dahulu
    const paintings = await prisma.lukisan.findMany({
      where: {
        id: { in: parsedIds },
      },
      select: {
        fotoUtama: true,
        fotoLain: true,
      },
    });

    // Hapus dari database
    await prisma.lukisan.deleteMany({
      where: {
        id: { in: parsedIds },
      },
    });

    // Hapus gambar terkait di R2
    for (const luk of paintings) {
      if (luk.fotoUtama) {
        await deleteFile(luk.fotoUtama);
      }
      if (Array.isArray(luk.fotoLain)) {
        for (const url of luk.fotoLain) {
          await deleteFile(url);
        }
      }
    }

    return res.json({ success: true, message: 'Sejumlah lukisan terpilih berhasil dihapus.' });
  } catch (error) {
    console.error('Bulk Delete Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal menghapus beberapa lukisan.' });
  }
});

export default router;
