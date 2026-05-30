import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lukisanData, kategoriData } from '../../data/mockData';
import './AdminLukisanForm.css';

export default function AdminLukisanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const existing = isEdit ? lukisanData.find((l) => l.id === parseInt(id)) : null;

  const [form, setForm] = useState({
    judul: existing?.judul || '',
    tahun: existing?.tahun || new Date().getFullYear(),
    medium: existing?.medium || '',
    ukuran: existing?.ukuran || '',
    kanvas: existing?.kanvas || '',
    deskripsi: existing?.deskripsi || '',
    harga: existing?.harga || '',
    tampilHarga: existing?.tampilHarga || false,
    status: existing?.status || 'TERSEDIA',
    featured: existing?.featured || false,
    kategoriIds: existing?.kategori?.map((k) => k.id) || [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleKategoriToggle = (katId) => {
    setForm((prev) => ({
      ...prev,
      kategoriIds: prev.kategoriIds.includes(katId)
        ? prev.kategoriIds.filter((id) => id !== katId)
        : [...prev.kategoriIds, katId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock save
    alert(isEdit ? 'Lukisan berhasil diperbarui!' : 'Lukisan berhasil ditambahkan!');
    navigate('/admin/lukisan');
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  return (
    <div className="admin-lukisan-form" id="admin-lukisan-form">
      <h1 className="admin-page-title">{isEdit ? 'Edit Lukisan' : 'Tambah Lukisan Baru'}</h1>
      <p className="admin-lukisan-form__slug">
        Slug: <code>/galeri/{generateSlug(form.judul) || '...'}</code>
      </p>

      <form onSubmit={handleSubmit} className="admin-lukisan-form__body">
        {/* Image Upload Area */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Foto</h3>
          <div className="admin-upload-zone" id="upload-zone">
            <div className="admin-upload-zone__content">
              <span className="admin-upload-zone__icon">📷</span>
              <span className="admin-upload-zone__text">Klik atau drag & drop foto utama di sini</span>
              <span className="admin-upload-zone__hint">JPG, PNG · Maks 5MB</span>
            </div>
          </div>
          {existing?.fotoUtama && (
            <img src={existing.fotoUtama} alt="Preview" className="admin-upload-preview" />
          )}
        </div>

        {/* Basic Info */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Informasi Dasar</h3>

          <div className="admin-form-group">
            <label htmlFor="form-judul">Judul *</label>
            <input type="text" id="form-judul" name="judul" value={form.judul} onChange={handleChange} required className="admin-input" />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="form-tahun">Tahun *</label>
              <input type="number" id="form-tahun" name="tahun" value={form.tahun} onChange={handleChange} required className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label htmlFor="form-medium">Medium *</label>
              <input type="text" id="form-medium" name="medium" value={form.medium} onChange={handleChange} required className="admin-input" placeholder="Cat Minyak di atas Kanvas" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="form-ukuran">Ukuran *</label>
              <input type="text" id="form-ukuran" name="ukuran" value={form.ukuran} onChange={handleChange} required className="admin-input" placeholder="100 × 120 cm" />
            </div>
            <div className="admin-form-group">
              <label htmlFor="form-kanvas">Kanvas *</label>
              <input type="text" id="form-kanvas" name="kanvas" value={form.kanvas} onChange={handleChange} required className="admin-input" placeholder="Kanvas / Kertas / Kayu" />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="form-deskripsi">Deskripsi</label>
            <textarea id="form-deskripsi" name="deskripsi" value={form.deskripsi} onChange={handleChange} rows={6} className="admin-input admin-textarea" placeholder="Ceritakan tentang karya ini..." />
          </div>
        </div>

        {/* Pricing & Status */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Harga & Status</h3>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="form-harga">Harga (Rp)</label>
              <input type="number" id="form-harga" name="harga" value={form.harga} onChange={handleChange} className="admin-input" placeholder="15000000" />
            </div>
            <div className="admin-form-group">
              <label htmlFor="form-status">Status *</label>
              <select id="form-status" name="status" value={form.status} onChange={handleChange} className="admin-input">
                <option value="TERSEDIA">Tersedia</option>
                <option value="TERJUAL">Terjual</option>
                <option value="TIDAK_DIJUAL">Tidak Dijual</option>
              </select>
            </div>
          </div>

          <div className="admin-form-checks">
            <label className="admin-checkbox">
              <input type="checkbox" name="tampilHarga" checked={form.tampilHarga} onChange={handleChange} />
              <span>Tampilkan harga di halaman publik</span>
            </label>
            <label className="admin-checkbox">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              <span>Tampilkan di Hero beranda (featured)</span>
            </label>
          </div>
        </div>

        {/* Categories */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Kategori</h3>
          <div className="admin-form-checks">
            {kategoriData.map((k) => (
              <label key={k.id} className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={form.kategoriIds.includes(k.id)}
                  onChange={() => handleKategoriToggle(k.id)}
                />
                <span>{k.nama}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary" id="save-lukisan">
            {isEdit ? 'PERBARUI LUKISAN' : 'SIMPAN LUKISAN'}
          </button>
          <button type="button" className="admin-btn-secondary" onClick={() => navigate('/admin/lukisan')}>
            BATAL
          </button>
        </div>
      </form>
    </div>
  );
}
