import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.js';
import lukisanRoutes from './routes/lukisan.js';
import kategoriRoutes from './routes/kategori.js';
import pesanRoutes from './routes/pesan.js';
import kontenRoutes from './routes/konten.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: frontendUrl,
    credentials: true, // Diperlukan agar cookie JWT dikirim/diterima
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Disable caching for all API responses to ensure real-time updates
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Trust proxy (required for Heroku/Railway secure cookies behind load balancers)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Routes Mapping
app.use('/api/auth', authRoutes);
app.use('/api/lukisan', lukisanRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/pesan', pesanRoutes);
app.use('/api/konten', kontenRoutes);
app.use('/api/upload', uploadRoutes);

// Base Endpoint
app.get('/api', (req, res) => {
  return res.json({
    message: 'Welcome to Studio Urakan API',
    version: '1.0.0',
    status: 'Running',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    success: false,
    error: err.message || 'Terjadi kesalahan internal pada server.',
  });
});

// Server Listen
app.listen(PORT, () => {
  console.log(`Backend server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
