import { useState, useEffect } from 'react';
import { HiPlus, HiTrash } from 'react-icons/hi';
import { request } from '../../utils/api';
import './AdminInfo.css';

export default function AdminInfo() {
  const [intro, setIntro] = useState('');
  const [layanan, setLayanan] = useState([]);
  const [caraPesan, setCaraPesan] = useState([]); // Preserve caraPesan steps
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadInfoData = async () => {
      try {
        const response = await request('/api/konten/info');
        if (response.success && response.data) {
          setIntro(response.data.intro || '');
          setLayanan(response.data.layanan || []);
          setCaraPesan(response.data.caraPesan || []);
        }
      } catch (error) {
        console.error('Gagal mengambil konten info halaman:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInfoData();
  }, []);

  const handleLayananChange = (index, field, value) => {
    const updated = [...layanan];
    // Convert price strings back to numbers if applicable
    let finalValue = value;
    if ((field === 'hargaMin' || field === 'hargaMax') && value !== '') {
      finalValue = parseInt(value) || 0;
    }
    updated[index] = { ...updated[index], [field]: finalValue };
    setLayanan(updated);
  };

  const addLayanan = () => {
    setLayanan([
      ...layanan,
      { nama: '', deskripsi: '', hargaMin: '', hargaMax: '', estimasiWaktu: '' },
    ]);
  };

  const removeLayanan = (index) => {
    setLayanan(layanan.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const response = await request('/api/konten/info', {
        method: 'PUT',
        body: {
          konten: {
            intro,
            layanan,
            caraPesan, // Kept to preserve steps ordering
          },
        },
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
      <div className="admin-info font-mono" style={{ padding: '40px' }}>
        Memuat konten info layanan...
      </div>
    );
  }

  return (
    <div className="admin-info" id="admin-info">
      <h1 className="admin-page-title">Kelola Halaman Info</h1>

      <form onSubmit={handleSave} className="admin-info__form">
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Intro</h3>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            className="admin-input admin-textarea"
            rows={3}
            disabled={saving}
          />
        </div>

        <div className="admin-form-section">
          <div className="admin-info__section-header">
            <h3 className="admin-form-section__title" style={{ border: 'none', margin: 0, padding: 0 }}>Layanan</h3>
            <button type="button" className="admin-btn-primary" onClick={addLayanan} disabled={saving}>
              <HiPlus size={16} /> Tambah
            </button>
          </div>

          {layanan.length === 0 ? (
            <p className="font-mono" style={{ color: 'var(--color-muted)', padding: '10px 0' }}>Belum ada layanan ditambahkan.</p>
          ) : (
            layanan.map((l, i) => (
              <div key={i} className="admin-info__layanan-item">
                <div className="admin-info__layanan-header">
                  <span className="admin-info__layanan-num">{String(i + 1).padStart(2, '0')}</span>
                  <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => removeLayanan(i)} disabled={saving}>
                    <HiTrash size={14} />
                  </button>
                </div>

                <div className="admin-form-group">
                  <label>Nama Layanan</label>
                  <input type="text" value={l.nama} onChange={(e) => handleLayananChange(i, 'nama', e.target.value)} className="admin-input" disabled={saving} />
                </div>

                <div className="admin-form-group">
                  <label>Deskripsi</label>
                  <textarea value={l.deskripsi} onChange={(e) => handleLayananChange(i, 'deskripsi', e.target.value)} className="admin-input admin-textarea" rows={3} disabled={saving} />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Harga Min (Rp)</label>
                    <input type="number" value={l.hargaMin || ''} onChange={(e) => handleLayananChange(i, 'hargaMin', e.target.value)} className="admin-input" disabled={saving} />
                  </div>
                  <div className="admin-form-group">
                    <label>Harga Max (Rp)</label>
                    <input type="number" value={l.hargaMax || ''} onChange={(e) => handleLayananChange(i, 'hargaMax', e.target.value)} className="admin-input" disabled={saving} />
                  </div>
                  <div className="admin-form-group">
                    <label>Estimasi Waktu</label>
                    <input type="text" value={l.estimasiWaktu} onChange={(e) => handleLayananChange(i, 'estimasiWaktu', e.target.value)} className="admin-input" placeholder="2–4 minggu" disabled={saving} />
                  </div>
                </div>
              </div>
            ))
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
