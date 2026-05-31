import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protectAdmin } from '../middlewares/auth.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST send message (Public + Rate Limit)
router.post('/', rateLimiter(60 * 1000, 3), async (req, res) => {
  const { nama, email, noWa, jenis, isi } = req.body;

  if (!nama || !email || !jenis || !isi) {
    return res.status(400).json({
      success: false,
      error: 'Nama, Email, Jenis Permintaan, dan Isi Pesan wajib diisi.',
    });
  }

  try {
    const newMessage = await prisma.pesan.create({
      data: {
        nama,
        email,
        noWa: noWa || null,
        jenis,
        isi,
        status: 'BARU',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Pesan berhasil terkirim.',
      data: newMessage,
    });
  } catch (error) {
    console.error('Create Pesan Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengirimkan pesan.' });
  }
});

// GET all messages (Protected)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const pesan = await prisma.pesan.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: pesan });
  } catch (error) {
    console.error('Get Pesan Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal mengambil data pesan.' });
  }
});

// PUT mark message as read (Protected)
router.put('/:id/dibaca', protectAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const pesanId = parseInt(id);
    const existing = await prisma.pesan.findUnique({
      where: { id: pesanId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Pesan tidak ditemukan.' });
    }

    const updated = await prisma.pesan.update({
      where: { id: pesanId },
      data: { status: 'DIBACA' },
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update Pesan Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal memperbarui status pesan.' });
  }
});

// DELETE message (Protected)
router.delete('/:id', protectAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const pesanId = parseInt(id);
    const existing = await prisma.pesan.findUnique({
      where: { id: pesanId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Pesan tidak ditemukan.' });
    }

    await prisma.pesan.delete({
      where: { id: pesanId },
    });

    return res.json({ success: true, message: 'Pesan berhasil dihapus.' });
  } catch (error) {
    console.error('Delete Pesan Error:', error);
    return res.status(500).json({ success: false, error: 'Gagal menghapus pesan.' });
  }
});

export default router;
