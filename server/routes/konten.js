import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protectAdmin } from '../middlewares/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET page content (Public)
router.get('/:kunci', async (req, res) => {
  const { kunci } = req.params;

  try {
    const page = await prisma.halamanKonten.findUnique({
      where: { kunci },
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        error: `Konten untuk kunci '${kunci}' tidak ditemukan.`,
      });
    }

    return res.json({ success: true, data: page.konten });
  } catch (error) {
    console.error(`Get Konten (${kunci}) Error:`, error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data konten.' });
  }
});

// PUT update page content (Protected)
router.put('/:kunci', protectAdmin, async (req, res) => {
  const { kunci } = req.params;
  const { konten } = req.body;

  if (!konten) {
    return res.status(400).json({ success: false, error: 'Isi konten wajib disertakan.' });
  }

  try {
    const updated = await prisma.halamanKonten.upsert({
      where: { kunci },
      update: { konten },
      create: { kunci, konten },
    });

    return res.json({ success: true, data: updated.konten });
  } catch (error) {
    console.error(`Update Konten (${kunci}) Error:`, error);
    return res.status(500).json({ success: false, error: 'Gagal memperbarui data konten.' });
  }
});

export default router;
