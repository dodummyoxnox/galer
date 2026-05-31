import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import './HeroSection.css';

export default function HeroSection({ featured }) {
  const { settings } = useSettings();

  const titleFirst = settings?.heroTitleFirst || 'STUDIO';
  const titleSecond = settings?.heroTitleSecond || 'URAKAN';
  const tagline = settings?.heroTagline || 'Seni yang jujur tidak butuh packaging yang mewah.\nTapi tetap butuh rancangan yang matang.';

  // Fallback if no featured painting is loaded yet
  const backgroundUrl = featured?.fotoUtama || 'https://picsum.photos/seed/lukisan1/1200/800';
  const featuredTitle = featured?.judul || 'Memuat Karya...';

  return (
    <section className="hero" id="hero-section">
      <div className="hero__bg" style={{ backgroundImage: `url(${backgroundUrl})` }} />
      <div className="hero__overlay" />

      <div className="hero__content container">
        <div className="hero__text">
          <h1 className="hero__title text-oversize">
            {titleFirst}<br />
            <span className="hero__title--accent">{titleSecond}</span>
          </h1>
          <p className="hero__tagline font-mono" style={{ whiteSpace: 'pre-line' }}>
            {tagline}
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
          <span className="hero__featured-label font-mono">KARYA FEATURED</span>
          <span className="hero__featured-title font-display">{featuredTitle}</span>
        </div>
      </div>

      <div className="hero__scroll-hint font-mono">
        <span>SCROLL</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
