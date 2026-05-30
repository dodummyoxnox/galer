import { useState } from 'react';
import { kontenInfo, formatHarga } from '../../data/mockData';
import { HiPlus, HiTrash } from 'react-icons/hi';
import './AdminInfo.css';

export default function AdminInfo() {
  const [intro, setIntro] = useState(kontenInfo.konten.intro);
  const [layanan, setLayanan] = useState(kontenInfo.konten.layanan);
  const [saved, setSaved] = useState(false);

  const handleLayananChange = (index, field, value) => {
    const updated = [...layanan];
    updated[index] = { ...updated[index], [field]: value };
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

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
          />
        </div>

        <div className="admin-form-section">
          <div className="admin-info__section-header">
            <h3 className="admin-form-section__title" style={{ border: 'none', margin: 0, padding: 0 }}>Layanan</h3>
            <button type="button" className="admin-btn-primary" onClick={addLayanan}>
              <HiPlus size={16} /> Tambah
            </button>
          </div>

          {layanan.map((l, i) => (
            <div key={i} className="admin-info__layanan-item">
              <div className="admin-info__layanan-header">
                <span className="admin-info__layanan-num">{String(i + 1).padStart(2, '0')}</span>
                <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => removeLayanan(i)}>
                  <HiTrash size={14} />
                </button>
              </div>

              <div className="admin-form-group">
                <label>Nama Layanan</label>
                <input type="text" value={l.nama} onChange={(e) => handleLayananChange(i, 'nama', e.target.value)} className="admin-input" />
              </div>

              <div className="admin-form-group">
                <label>Deskripsi</label>
                <textarea value={l.deskripsi} onChange={(e) => handleLayananChange(i, 'deskripsi', e.target.value)} className="admin-input admin-textarea" rows={3} />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Harga Min (Rp)</label>
                  <input type="number" value={l.hargaMin} onChange={(e) => handleLayananChange(i, 'hargaMin', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label>Harga Max (Rp)</label>
                  <input type="number" value={l.hargaMax} onChange={(e) => handleLayananChange(i, 'hargaMax', e.target.value)} className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label>Estimasi Waktu</label>
                  <input type="text" value={l.estimasiWaktu} onChange={(e) => handleLayananChange(i, 'estimasiWaktu', e.target.value)} className="admin-input" placeholder="2–4 minggu" />
                </div>
              </div>
            </div>
          ))}
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
