import { Link } from 'react-router-dom';
import HeroSection from '../../components/public/HeroSection';
import LukisanCard from '../../components/public/LukisanCard';
import { lukisanData } from '../../data/mockData';
import './Beranda.css';

export default function Beranda() {
  const recentLukisan = lukisanData.slice(0, 6);

  return (
    <>
      <HeroSection />

      {/* Preview Galeri */}
      <section className="section beranda-galeri" id="beranda-galeri">
        <div className="container">
          <div className="beranda-galeri__header">
            <h2 className="font-display">KARYA TERBARU</h2>
            <div className="divider-kasar divider-kasar--thin" style={{ maxWidth: 120 }} />
          </div>

          <div className="beranda-galeri__grid">
            {recentLukisan.map((item, idx) => (
              <LukisanCard key={item.id} lukisan={item} index={idx} />
            ))}
          </div>

          <div className="beranda-galeri__more">
            <Link to="/galeri" className="btn-brutal">
              LIHAT SEMUA KARYA →
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="section section--paper beranda-manifesto" id="beranda-manifesto">
        <div className="container">
          <blockquote className="beranda-manifesto__quote">
            <p className="font-heading">"Melukis bukan tentang membuat yang indah. Melukis adalah menyampaikan yang jujur — meskipun jujur itu jelek, kasar, dan tidak enak dilihat."</p>
            <cite className="font-mono">— Ari "Urakan" Wibowo</cite>
          </blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section beranda-cta" id="beranda-cta">
        <div className="container">
          <h2 className="beranda-cta__title text-oversize">
            PUNYA CERITA<br />
            <span style={{ color: 'var(--color-accent)' }}>YANG INGIN</span><br />
            DILUKIS?
          </h2>
          <p className="beranda-cta__desc font-mono">
            Setiap lukisan dimulai dari percakapan. Ceritakan idemu.
          </p>
          <div className="beranda-cta__actions">
            <Link to="/info" className="btn-brutal">INFO LAYANAN</Link>
            <Link to="/kontak" className="btn-brutal btn-brutal--accent">HUBUNGI SAYA</Link>
          </div>
        </div>
      </section>
    </>
  );
}
