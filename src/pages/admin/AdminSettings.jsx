import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { request } from '../../utils/api';
import './AdminSettings.css';

export default function AdminSettings() {
  const { settings, reloadSettings } = useSettings();
  const [form, setForm] = useState({
    studioName: '',
    heroTitleFirst: '',
    heroTitleSecond: '',
    heroTagline: '',
    manifestoQuote: '',
    manifestoCite: '',
    ctaTitle: '',
    ctaDesc: '',
    email: '',
    whatsapp: '',
    instagram: '',
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Sync settings when loaded from context
  useEffect(() => {
    if (settings) {
      setForm({
        studioName: settings.studioName || '',
        heroTitleFirst: settings.heroTitleFirst || '',
        heroTitleSecond: settings.heroTitleSecond || '',
        heroTagline: settings.heroTagline || '',
        manifestoQuote: settings.manifestoQuote || '',
        manifestoCite: settings.manifestoCite || '',
        ctaTitle: settings.ctaTitle || '',
        ctaDesc: settings.ctaDesc || '',
        email: settings.email || '',
        whatsapp: settings.whatsapp || '',
        instagram: settings.instagram || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await request('/api/konten/settings', {
        method: 'PUT',
        body: { konten: form },
      });

      if (response.success) {
        setStatus({ type: 'success', message: 'Pengaturan situs berhasil diperbarui!' });
        reloadSettings(); // Refresh global settings
      } else {
        setStatus({ type: 'error', message: 'Gagal memperbarui pengaturan situs.' });
      }
    } catch (error) {
      console.error('Update settings error:', error);
      setStatus({ type: 'error', message: error.message || 'Terjadi kesalahan pada server.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-settings" id="admin-settings-container">
      <h1 className="admin-page-title">Pengaturan Situs & Landing Page</h1>
      <p className="admin-page-desc">Kelola nama studio, teks hero, manifesto, CTA, dan kontak sosial media.</p>

      {status.message && (
        <div className={`admin-settings__status admin-settings__status--${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-settings__form">
        {/* Identitas Studio */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Identitas Studio</h3>
          <div className="admin-form-group">
            <label htmlFor="settings-studioName">Nama Studio (Brand)</label>
            <input
              type="text"
              id="settings-studioName"
              name="studioName"
              value={form.studioName}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="STUDIO URAKAN"
            />
            <span className="admin-form-hint">Digunakan di Navigasi, Footer, dan halaman Login Admin.</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Hero Section Landing Page</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="settings-heroTitleFirst">Judul Baris Atas</label>
              <input
                type="text"
                id="settings-heroTitleFirst"
                name="heroTitleFirst"
                value={form.heroTitleFirst}
                onChange={handleChange}
                required
                className="admin-input"
                placeholder="STUDIO"
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="settings-heroTitleSecond">Judul Baris Bawah (Merah)</label>
              <input
                type="text"
                id="settings-heroTitleSecond"
                name="heroTitleSecond"
                value={form.heroTitleSecond}
                onChange={handleChange}
                required
                className="admin-input"
                placeholder="URAKAN"
              />
            </div>
          </div>
          <div className="admin-form-group">
            <label htmlFor="settings-heroTagline">Tagline Hero</label>
            <textarea
              id="settings-heroTagline"
              name="heroTagline"
              value={form.heroTagline}
              onChange={handleChange}
              required
              rows={3}
              className="admin-input admin-textarea"
              placeholder="Seni yang jujur tidak butuh packaging yang mewah..."
            />
          </div>
        </div>

        {/* Manifesto / Quote */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Manifesto (Quote Landing Page)</h3>
          <div className="admin-form-group">
            <label htmlFor="settings-manifestoQuote">Quote Manifesto</label>
            <textarea
              id="settings-manifestoQuote"
              name="manifestoQuote"
              value={form.manifestoQuote}
              onChange={handleChange}
              required
              rows={4}
              className="admin-input admin-textarea"
              placeholder="Melukis bukan tentang membuat yang indah..."
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="settings-manifestoCite">Nama Pembuat Quote (Cite)</label>
            <input
              type="text"
              id="settings-manifestoCite"
              name="manifestoCite"
              value={form.manifestoCite}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="Ari &quot;Urakan&quot; Wibowo"
            />
          </div>
        </div>

        {/* Call to Action (CTA) */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">CTA Section (Butuh Jasa Melukis)</h3>
          <div className="admin-form-group">
            <label htmlFor="settings-ctaTitle">Judul CTA</label>
            <textarea
              id="settings-ctaTitle"
              name="ctaTitle"
              value={form.ctaTitle}
              onChange={handleChange}
              required
              rows={3}
              className="admin-input admin-textarea"
              placeholder="PUNYA CERITA YANG INGIN DILUKIS?"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="settings-ctaDesc">Deskripsi CTA</label>
            <input
              type="text"
              id="settings-ctaDesc"
              name="ctaDesc"
              value={form.ctaDesc}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="Setiap lukisan dimulai dari percakapan. Ceritakan idemu."
            />
          </div>
        </div>

        {/* Kontak & Sosial Media */}
        <div className="admin-form-section">
          <h3 className="admin-form-section__title">Kontak & Sosial Media</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="settings-whatsapp">WhatsApp (Gunakan Kode Negara, cth: 6281xxx)</label>
              <input
                type="text"
                id="settings-whatsapp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                required
                className="admin-input"
                placeholder="6281234567890"
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="settings-email">Email Hubungi</label>
              <input
                type="email"
                id="settings-email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="admin-input"
                placeholder="studio@urakan.com"
              />
            </div>
          </div>
          <div className="admin-form-group">
            <label htmlFor="settings-instagram">Instagram URL</label>
            <input
              type="url"
              id="settings-instagram"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="https://instagram.com/studio.urakan"
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button
            type="submit"
            disabled={saving}
            className="admin-btn-primary"
            id="save-settings-btn"
          >
            {saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
          </button>
        </div>
      </form>
    </div>
  );
}
