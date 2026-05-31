import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function protectAdmin(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Akses ditolak. Silakan login terlebih dahulu.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'ganti_dengan_secret_yang_panjang_dan_aman_12345';
    const decoded = jwt.verify(token, secret);

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
      },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Sesi tidak valid. Admin tidak ditemukan.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth Middleware: Token verifikasi gagal.', error.message);
    return res.status(401).json({
      success: false,
      error: 'Sesi kedaluwarsa atau token tidak valid.',
    });
  }
}
