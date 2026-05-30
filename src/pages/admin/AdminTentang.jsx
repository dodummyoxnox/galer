import { useState } from 'react';
import { kontenTentang } from '../../data/mockData';
import './AdminTentang.css';

export default function AdminTentang() {
  const { konten } = kontenTentang;
  const [form, setForm] = useState({
    nama: konten.nama,
    tagline: konten.tagline,
    bio: konten.bio,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-tentang" id="admin-tentang">
      <h1 className="admin-page-title">Edit Halaman Tentang</h1>

      <form onSubmit={handleSave} className="admin-tentang__form">
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Profil Pelukis</h3>

          <div className="admin-form-group">
            <label htmlFor="tentang-nama">Nama</label>
            <input type="text" id="tentang-nama" name="nama" value={form.nama} onChange={handleChange} className="admin-input" />
          </div>

          <div className="admin-form-group">
            <label htmlFor="tentang-tagline">Tagline</label>
            <input type="text" id="tentang-tagline" name="tagline" value={form.tagline} onChange={handleChange} className="admin-input" />
          </div>

          <div className="admin-form-group">
            <label htmlFor="tentang-bio">Bio / Manifesto</label>
            <textarea id="tentang-bio" name="bio" value={form.bio} onChange={handleChange} className="admin-input admin-textarea" rows={10} />
            <span className="admin-tentang__hint">Gunakan baris kosong untuk paragraf baru.</span>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Foto Profil</h3>
          <div className="admin-upload-zone">
            <div className="admin-upload-zone__content">
              <span className="admin-upload-zone__icon">📷</span>
              <span className="admin-upload-zone__text">Klik atau drag & drop foto profil</span>
            </div>
          </div>
          {konten.foto && (
            <img src={konten.foto} alt="Preview" className="admin-upload-preview" />
          )}
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            SIMPAN PERUBAHAN
          </button>
          {saved && <span style={{ color: 'var(--color-success)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>Perubahan tersimpan ✓</span>}
        </div>
      </form>
    </div>
  );
}
