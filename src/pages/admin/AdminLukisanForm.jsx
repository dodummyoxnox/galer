import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../../utils/api';
import './AdminLukisanForm.css';

export default function AdminLukisanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const fileInputRef = useRef(null);
  const multipleFilesInputRef = useRef(null);

  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [uploadingLain, setUploadingLain] = useState(false);

  const [form, setForm] = useState({
    judul: '',
    tahun: new Date().getFullYear(),
    medium: '',
    ukuran: '',
    kanvas: '',
    deskripsi: '',
    harga: '',
    tampilHarga: false,
    status: 'TERSEDIA',
    featured: false,
    fotoUtama: '',
    fotoLain: [],
    kategoriIds: [],
  });

  // Fetch categories & painting detail on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch categories
        const katResponse = await request('/api/kategori');
        if (katResponse.success) {
          setKategoriList(katResponse.data);
        }

        // Fetch painting detail if editing
        if (isEdit) {
          const lukResponse = await request(`/api/lukisan/${id}`);
          if (lukResponse.success && lukResponse.data) {
            const l = lukResponse.data;
            setForm({
              judul: l.judul || '',
              tahun: l.tahun || new Date().getFullYear(),
              medium: l.medium || '',
              ukuran: l.ukuran || '',
              kanvas: l.kanvas || '',
              deskripsi: l.deskripsi || '',
              harga: l.harga !== null ? l.harga : '',
              tampilHarga: l.tampilHarga || false,
              status: l.status || 'TERSEDIA',
              featured: l.featured || false,
              fotoUtama: l.fotoUtama || '',
              fotoLain: l.fotoLain || [],
              kategoriIds: l.kategori?.map((k) => k.id) || [],
            });
          }
        }
      } catch (error) {
        console.error('Gagal memuat data form lukisan:', error.message);
        alert('Gagal mengambil data dari server.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit]);

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
        ? prev.kategoriIds.filter((kid) => kid !== katId)
        : [...prev.kategoriIds, katId],
    }));
  };

  // Upload Foto Utama
  const handleUploadMain = async (e) => {
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
        setForm((prev) => ({ ...prev, fotoUtama: response.url }));
        alert('Foto utama berhasil diunggah!');
      }
    } catch (error) {
      alert(`Gagal mengunggah foto utama: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Upload Foto Tambahan (Max 5)
  const handleUploadAdditional = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (form.fotoLain.length + files.length > 5) {
      alert('Maksimal foto tambahan adalah 5 gambar.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    setUploadingLain(true);
    try {
      const response = await request('/api/upload/multiple', {
        method: 'POST',
        body: formData,
      });

      if (response.success && response.urls) {
        setForm((prev) => ({
          ...prev,
          fotoLain: [...prev.fotoLain, ...response.urls].slice(0, 5),
        }));
        alert('Foto tambahan berhasil diunggah!');
      }
    } catch (error) {
      alert(`Gagal mengunggah foto tambahan: ${error.message}`);
    } finally {
      setUploadingLain(false);
    }
  };

  // Remove Additional Photo
  const handleRemoveAdditional = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      fotoLain: prev.fotoLain.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fotoUtama) {
      alert('Foto utama wajib diunggah.');
      return;
    }

    try {
      const endpoint = isEdit ? `/api/lukisan/${id}` : '/api/lukisan';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await request(endpoint, {
        method,
        body: form,
      });

      if (response.success) {
        alert(isEdit ? 'Lukisan berhasil diperbarui!' : 'Lukisan berhasil ditambahkan!');
        navigate('/admin/lukisan');
      }
    } catch (error) {
      alert(`Gagal menyimpan lukisan: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-lukisan-form font-mono" style={{ padding: '40px' }}>
        Memuat data lukisan...
      </div>
    );
  }

  return (
    <div className="admin-lukisan-form" id="admin-lukisan-form">
      <h1 className="admin-page-title">{isEdit ? 'Edit Lukisan' : 'Tambah Lukisan Baru'}</h1>

      <form onSubmit={handleSubmit} className="admin-lukisan-form__body">
        {/* Foto Utama */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Foto Utama *</h3>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleUploadMain}
          />
          <div
            className="admin-upload-zone"
            id="upload-zone-main"
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-upload-zone__content">
              <span className="admin-upload-zone__icon">📷</span>
              <span className="admin-upload-zone__text">
                {uploading ? 'Sedang mengunggah...' : 'Klik untuk mengunggah foto utama'}
              </span>
              <span className="admin-upload-zone__hint">JPG, PNG · Maks 5MB</span>
            </div>
          </div>
          {form.fotoUtama && (
            <div style={{ marginTop: '15px' }}>
              <img src={form.fotoUtama} alt="Preview Utama" className="admin-upload-preview" />
              <span className="admin-form-hint">URL R2: {form.fotoUtama.slice(0, 50)}...</span>
            </div>
          )}
        </div>

        {/* Foto Tambahan (Galeri) */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Foto Tambahan (Galeri - Maks 5)</h3>
          <input
            type="file"
            ref={multipleFilesInputRef}
            style={{ display: 'none' }}
            multiple
            accept="image/*"
            onChange={handleUploadAdditional}
          />
          <div
            className="admin-upload-zone"
            id="upload-zone-multiple"
            onClick={() => multipleFilesInputRef.current.click()}
            style={{ cursor: 'pointer', borderStyle: 'dashed' }}
          >
            <div className="admin-upload-zone__content">
              <span className="admin-upload-zone__icon">🖼️</span>
              <span className="admin-upload-zone__text">
                {uploadingLain ? 'Sedang mengunggah...' : 'Klik untuk mengunggah foto galeri'}
              </span>
              <span className="admin-upload-zone__hint">Hingga 5 gambar</span>
            </div>
          </div>

          {form.fotoLain.length > 0 && (
            <div className="admin-lukisan-form__gallery-previews" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
              {form.fotoLain.map((foto, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={foto} alt={`Preview ${idx}`} style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid var(--color-border)' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditional(idx)}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: 'var(--color-accent)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
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
            {kategoriList.map((k) => (
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
