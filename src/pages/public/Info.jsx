import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InfoCard from '../../components/public/InfoCard';
import StepGuide from '../../components/public/StepGuide';
import { request } from '../../utils/api';
import './Info.css';

export default function Info() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const response = await request('/api/konten/info');
        if (response.success && response.data) {
          setInfo(response.data);
        }
      } catch (error) {
        console.error('Gagal memuat konten info:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInfo();
  }, []);

  if (loading) {
    return (
      <div className="info-page section container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="font-mono" style={{ color: 'var(--color-muted)' }}>Memuat info layanan...</h2>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="info-page section container" style={{ minHeight: '60vh' }}>
        <h1 className="font-display">INFO TIDAK DITEMUKAN</h1>
        <p className="font-mono">Maaf, informasi layanan melukis belum dikonfigurasi.</p>
      </div>
    );
  }

  return (
    <div className="info-page" id="info-page">
      {/* Header */}
      <section className="section info-page__header">
        <div className="container">
          <h1 className="font-display">INFO &<br />LAYANAN</h1>
          <p className="info-page__intro font-mono">{info.intro}</p>
          <div className="divider-kasar" />
        </div>
      </section>

      {/* Services */}
      {info.layanan && info.layanan.length > 0 && (
        <section className="section info-page__services" id="info-services">
          <div className="container">
            <div className="info-page__services-grid">
              {info.layanan.map((layanan, i) => (
                <InfoCard key={i} layanan={layanan} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How to Order */}
      {info.caraPesan && info.caraPesan.length > 0 && (
        <section className="section section--paper info-page__steps" id="info-steps">
          <div className="container">
            <h2 className="font-display" style={{ color: 'var(--color-ink-dark)', marginBottom: 'var(--space-3xl)' }}>
              CARA PESAN
            </h2>
            <StepGuide steps={info.caraPesan} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section info-page__cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h3 className="font-display" style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--space-lg)' }}>
            SIAP MEMULAI?
          </h3>
          <p className="font-mono" style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-2xl)' }}>
            Isi form kontak atau langsung kirim pesan WhatsApp.
          </p>
          <Link to="/kontak" className="btn-brutal btn-brutal--accent">
            HUBUNGI SAYA →
          </Link>
        </div>
      </section>
    </div>
  );
}
