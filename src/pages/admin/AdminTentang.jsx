import { useState, useEffect, useRef } from 'react';
import { request } from '../../utils/api';
import './AdminTentang.css';

export default function AdminTentang() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    nama: '',
    tagline: '',
    bio: '',
    foto: '',
    timeline: [], // Keep it in state to preserve on save
  });

  useEffect(() => {
    const loadTentangData = async () => {
      try {
        const response = await request('/api/konten/tentang');
        if (response.success && response.data) {
          const data = response.data;
          setForm({
            nama: data.nama || '',
            tagline: data.tagline || '',
            bio: data.bio || '',
            foto: data.foto || '',
            timeline: data.timeline || [],
          });
        }
      } catch (error) {
        console.error('Gagal memuat data tentang:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTentangData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await request('/api/upload/single', {
        method: 'POST',
        body: formData,
      });

      if (response.success && response.url) {
        setForm((prev) => ({ ...prev, foto: response.url }));
        alert('Foto profil berhasil diunggah!');
      }
    } catch (error) {
      alert(`Gagal mengunggah foto profil: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const response = await request('/api/konten/tentang', {
        method: 'PUT',
        body: { konten: form },
      });

      if (response.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      alert(`Gagal menyimpan perubahan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-tentang font-mono" style={{ padding: '40px' }}>
        Memuat konten profil pelukis...
      </div>
    );
  }

  return (
    <div className="admin-tentang" id="admin-tentang">
      <h1 className="admin-page-title">Edit Halaman Tentang</h1>

      <form onSubmit={handleSave} className="admin-tentang__form">
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Profil Pelukis</h3>

          <div className="admin-form-group">
            <label htmlFor="tentang-nama">Nama</label>
            <input
              type="text"
              id="tentang-nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="admin-input"
              disabled={saving}
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="tentang-tagline">Tagline</label>
            <input
              type="text"
              id="tentang-tagline"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              className="admin-input"
              disabled={saving}
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="tentang-bio">Bio / Manifesto</label>
            <textarea
              id="tentang-bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="admin-input admin-textarea"
              rows={10}
              disabled={saving}
              required
            />
            <span className="admin-tentang__hint">Gunakan baris kosong untuk paragraf baru.</span>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Foto Profil</h3>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleUploadPhoto}
          />
          <div
            className="admin-upload-zone"
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-upload-zone__content">
              <span className="admin-upload-zone__icon">📷</span>
              <span className="admin-upload-zone__text">
                {uploading ? 'Sedang mengunggah...' : 'Klik untuk mengunggah foto profil'}
              </span>
            </div>
          </div>
          {form.foto && (
            <div style={{ marginTop: '15px' }}>
              <img src={form.foto} alt="Preview" className="admin-upload-preview" />
              <span className="admin-form-hint">URL Foto: {form.foto.slice(0, 50)}...</span>
            </div>
          )}
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
          </button>
          {saved && <span style={{ color: 'var(--color-success)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', marginLeft: '15px' }}>Perubahan tersimpan ✓</span>}
        </div>
      </form>
    </div>
  );
}
