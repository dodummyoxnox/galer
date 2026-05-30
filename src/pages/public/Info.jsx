import { Link } from 'react-router-dom';
import InfoCard from '../../components/public/InfoCard';
import StepGuide from '../../components/public/StepGuide';
import { kontenInfo } from '../../data/mockData';
import './Info.css';

export default function Info() {
  const { konten } = kontenInfo;

  return (
    <div className="info-page" id="info-page">
      {/* Header */}
      <section className="section info-page__header">
        <div className="container">
          <h1 className="font-display">INFO &<br />LAYANAN</h1>
          <p className="info-page__intro font-mono">{konten.intro}</p>
          <div className="divider-kasar" />
        </div>
      </section>

      {/* Services */}
      <section className="section info-page__services" id="info-services">
        <div className="container">
          <div className="info-page__services-grid">
            {konten.layanan.map((layanan, i) => (
              <InfoCard key={i} layanan={layanan} />
            ))}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="section section--paper info-page__steps" id="info-steps">
        <div className="container">
          <h2 className="font-display" style={{ color: 'var(--color-ink-dark)', marginBottom: 'var(--space-3xl)' }}>
            CARA PESAN
          </h2>
          <StepGuide steps={konten.caraPesan} />
        </div>
      </section>

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
