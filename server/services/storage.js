import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';

dotenv.config();

// Polyfill WebSocket for Node < 22 to prevent Supabase Realtime Client crash
if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const {
  STORAGE_PROVIDER,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_BUCKET = 'uploads',
} = process.env;

const isSupabaseConfigured =
  STORAGE_PROVIDER === 'supabase' &&
  SUPABASE_URL &&
  SUPABASE_SERVICE_ROLE_KEY &&
  SUPABASE_BUCKET;

let supabase = null;

if (isSupabaseConfigured) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  console.log('Storage Service: Supabase Client terkonfigurasi.');
} else {
  console.warn(
    'Storage Service WARNING: Kredensial Supabase Storage tidak lengkap. Menggunakan mode MOCK/DUMMY untuk upload gambar.'
  );
}

/**
 * Upload single file to Supabase Storage
 * @param {object} file Multer file object
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadFile(file) {
  if (!file) throw new Error('File tidak ditemukan.');

  const fileExtension = file.originalname.split('.').pop();
  const cleanFilename = file.originalname
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
  const key = `${Date.now()}_${cleanFilename}.${fileExtension}`;

  if (!isSupabaseConfigured) {
    // Fallback: kembalikan picsum placeholder URL agar bisa ditest lokal tanpa kredensial
    const mockSeed = Math.floor(Math.random() * 1000);
    const mockUrl = `https://picsum.photos/seed/${mockSeed}/800/1000`;
    console.log(`[STORAGE MOCK] Uploading '${file.originalname}' -> Mock URL: ${mockUrl}`);
    return mockUrl;
  }

  try {
    // 1. Verify bucket exists before uploading
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(SUPABASE_BUCKET);
    if (bucketError || !bucketData) {
      throw new Error(`Supabase Storage Bucket '${SUPABASE_BUCKET}' tidak ditemukan. Pastikan bucket telah dibuat di dashboard Supabase.`);
    }

    // 2. Upload file buffer to Supabase bucket
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(key, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah file ke Supabase: ${uploadError.message}`);
    }

    // 3. Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(key);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Gagal mengambil URL publik dari berkas yang diunggah.');
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Gagal mengunggah file ke Supabase Storage:', error.message);
    throw new Error(error.message || 'Gagal mengunggah gambar ke storage cloud.');
  }
}

/**
 * Delete file from Supabase Storage
 * @param {string} url Public URL of the file to delete
 * @returns {Promise<void>}
 */
export async function deleteFile(url) {
  if (!url) return;

  if (!isSupabaseConfigured) {
    console.log(`[STORAGE MOCK] Hapus file url: ${url}`);
    return;
  }

  // format url Supabase: https://[project_ref].supabase.co/storage/v1/object/public/[bucket_name]/[file_key]
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/`;

  // Cek apakah URL berasal dari Supabase bucket kita
  if (!url.startsWith(prefix)) {
    console.log('Melewati penghapusan file, URL bukan berasal dari bucket Supabase kita:', url);
    return;
  }

  // Ambil key file dari akhir URL
  const key = url.replace(prefix, '');

  try {
    const { error: removeError } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .remove([key]);

    if (removeError) {
      throw new Error(removeError.message);
    }
    
    console.log(`File berhasil dihapus dari Supabase Storage: ${key}`);
  } catch (error) {
    console.error(`Gagal menghapus file dari Supabase Storage (${key}):`, error.message);
    // Kita tidak melempar error di sini agar proses delete database tetap berjalan sukses
  }
}
