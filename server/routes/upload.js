import express from 'express';
import multer from 'multer';
import { protectAdmin } from '../middlewares/auth.js';
import { uploadFile } from '../services/storage.js';

const router = express.Router();

// Setup Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Tipe file tidak didukung. Hanya gambar (JPEG/PNG) yang diperbolehkan.'));
    }
  },
});

// Single image upload endpoint
router.post('/single', protectAdmin, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Kesalahan Multer: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'File gambar tidak ditemukan.' });
    }

    const url = await uploadFile(req.file);
    return res.json({ success: true, url });
  } catch (error) {
    console.error('Upload Single Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Multiple image upload endpoint (Max 5 files)
router.post('/multiple', protectAdmin, (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Kesalahan Multer: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'File gambar tidak ditemukan.' });
    }

    const uploadPromises = req.files.map((file) => uploadFile(file));
    const urls = await Promise.all(uploadPromises);

    return res.json({ success: true, urls });
  } catch (error) {
    console.error('Upload Multiple Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
