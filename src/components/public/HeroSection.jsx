import { Link } from 'react-router-dom';
import { lukisanData } from '../../data/mockData';
import './HeroSection.css';

export default function HeroSection() {
  const featured = lukisanData.find((l) => l.featured) || lukisanData[0];

  return (
    <section className="hero" id="hero-section">
      <div className="hero__bg" style={{ backgroundImage: `url(${featured.fotoUtama})` }} />
      <div className="hero__overlay" />

      <div className="hero__content container">
        <div className="hero__text">
          <h1 className="hero__title text-oversize">
            STUDIO<br />
            <span className="hero__title--accent">URAKAN</span>
          </h1>
          <p className="hero__tagline font-mono">
            Seni yang jujur tidak butuh packaging yang mewah.<br />
            Tapi tetap butuh rancangan yang matang.
          </p>
          <div className="hero__cta">
            <Link to="/galeri" className="btn-brutal btn-brutal--filled">
              LIHAT SEMUA KARYA
            </Link>
            <Link to="/kontak" className="btn-brutal btn-brutal--accent">
              PESAN LUKISAN
            </Link>
          </div>
        </div>

        <div className="hero__featured">
          <span className="hero__featured-label font-mono">KARYA TERBARU</span>
          <span className="hero__featured-title font-display">{featured.judul}</span>
        </div>
      </div>

      <div className="hero__scroll-hint font-mono">
        <span>SCROLL</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
