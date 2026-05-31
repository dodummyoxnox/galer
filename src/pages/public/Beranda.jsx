import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../../components/public/HeroSection';
import LukisanCard from '../../components/public/LukisanCard';
import { useSettings } from '../../context/SettingsContext';
import { request } from '../../utils/api';
import './Beranda.css';

export default function Beranda() {
  const [recentLukisan, setRecentLukisan] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Fetch all paintings to get recent list and featured item
        const response = await request('/api/lukisan');
        if (response.success && response.data) {
          setRecentLukisan(response.data.slice(0, 6));
          const featItem = response.data.find((l) => l.featured) || response.data[0];
          setFeatured(featItem);
        }
      } catch (error) {
        console.error('Gagal memuat data beranda:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const quoteText = settings?.manifestoQuote || 'Melukis bukan tentang membuat yang indah. Melukis adalah menyampaikan yang jujur — meskipun jujur itu jelek, kasar, dan tidak enak dilihat.';
  const quoteAuthor = settings?.manifestoCite || 'Ari "Urakan" Wibowo';
  const ctaTitle = settings?.ctaTitle || 'PUNYA CERITA\nYANG INGIN\nDILUKIS?';
  const ctaDesc = settings?.ctaDesc || 'Setiap lukisan dimulai dari percakapan. Ceritakan idemu.';

  return (
    <>
      <HeroSection featured={featured} />

      {/* Preview Galeri */}
      <section className="section beranda-galeri" id="beranda-galeri">
        <div className="container">
          <div className="beranda-galeri__header">
            <h2 className="font-display">KARYA TERBARU</h2>
            <div className="divider-kasar divider-kasar--thin" style={{ maxWidth: 120 }} />
          </div>

          {loading ? (
            <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '40px 0' }}>
              Memuat karya terbaru...
            </div>
          ) : recentLukisan.length === 0 ? (
            <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '40px 0' }}>
              Belum ada lukisan yang dipajang.
            </div>
          ) : (
            <div className="beranda-galeri__grid">
              {recentLukisan.map((item, idx) => (
                <LukisanCard key={item.id} lukisan={item} index={idx} />
              ))}
            </div>
          )}

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
            <p className="font-heading">"{quoteText}"</p>
            <cite className="font-mono">— {quoteAuthor}</cite>
          </blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section beranda-cta" id="beranda-cta">
        <div className="container">
          <h2 className="beranda-cta__title text-oversize" style={{ whiteSpace: 'pre-line' }}>
            {ctaTitle}
          </h2>
          <p className="beranda-cta__desc font-mono">
            {ctaDesc}
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
