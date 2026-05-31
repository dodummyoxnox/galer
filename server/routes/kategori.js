import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protectAdmin } from '../middlewares/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Helper: slugify category name
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

// GET all categories (Public)
router.get('/', async (req, res) => {
  try {
    const kategori = await prisma.kategori.findMany({
      include: {
        _count: {
          select: { lukisan: true },
        },
      },
      orderBy: { nama: 'asc' },
    });

    // Format output to match mock data but include count
    const formatted = kategori.map((k) => ({
      id: k.id,
      nama: k.nama,
      slug: k.slug,
      lukisanCount: k._count.lukisan,
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Get Kategori Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data kategori.' });
  }
});

// POST create category (Protected)
router.post('/', protectAdmin, async (req, res) => {
  const { nama } = req.body;

  if (!nama) {
    return res.status(400).json({ success: false, error: 'Nama kategori wajib diisi.' });
  }

  try {
    const slug = slugify(nama);

    // Cek apakah sudah ada kategori dengan nama atau slug yang sama
    const existing = await prisma.kategori.findFirst({
      where: {
        OR: [{ nama }, { slug }],
      },
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'Kategori dengan nama/slug ini sudah ada.' });
    }

    const created = await prisma.kategori.create({
      data: { nama, slug },
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Create Kategori Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal membuat kategori baru.' });
  }
});

// PUT update category (Protected)
router.put('/:id', protectAdmin, async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  if (!nama) {
    return res.status(400).json({ success: false, error: 'Nama kategori wajib diisi.' });
  }

  try {
    const kategoriId = parseInt(id);
    const existing = await prisma.kategori.findUnique({
      where: { id: kategoriId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Kategori tidak ditemukan.' });
    }

    const slug = slugify(nama);

    // Cek duplikasi dengan ID lain
    const duplicate = await prisma.kategori.findFirst({
      where: {
        id: { not: kategoriId },
        OR: [{ nama }, { slug }],
      },
    });

    if (duplicate) {
      return res.status(400).json({ success: false, error: 'Kategori dengan nama/slug ini sudah digunakan.' });
    }

    const updated = await prisma.kategori.update({
      where: { id: kategoriId },
      data: { nama, slug },
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update Kategori Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal memperbarui kategori.' });
  }
});

// DELETE category (Protected)
router.delete('/:id', protectAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const kategoriId = parseInt(id);

    // Cek apakah kategori ada dan apakah masih berelasi dengan lukisan
    const kategori = await prisma.kategori.findUnique({
      where: { id: kategoriId },
      include: {
        _count: {
          select: { lukisan: true },
        },
      },
    });

    if (!kategori) {
      return res.status(404).json({ success: false, error: 'Kategori tidak ditemukan.' });
    }

    if (kategori._count.lukisan > 0) {
      return res.status(400).json({
        success: false,
        error: `Kategori '${kategori.nama}' tidak bisa dihapus karena masih digunakan oleh ${kategori._count.lukisan} lukisan.`,
      });
    }

    await prisma.kategori.delete({
      where: { id: kategoriId },
    });

    return res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    console.error('Delete Kategori Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal menghapus kategori.' });
  }
});

export default router;
