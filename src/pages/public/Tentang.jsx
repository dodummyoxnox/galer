import { kontenTentang } from '../../data/mockData';
import './Tentang.css';

export default function Tentang() {
  const { konten } = kontenTentang;

  return (
    <div className="tentang-page" id="tentang-page">
      {/* Hero */}
      <section className="tentang-hero section">
        <div className="container tentang-hero__inner">
          <div className="tentang-hero__photo">
            <img src={konten.foto} alt={konten.nama} />
            <div className="tentang-hero__photo-label font-mono">
              <span>EST. 2015</span>
              <span>YOGYAKARTA</span>
            </div>
          </div>

          <div className="tentang-hero__text">
            <h1 className="font-display tentang-hero__name">{konten.nama}</h1>
            <p className="tentang-hero__tagline font-heading">{konten.tagline}</p>
            <div className="divider-kasar" style={{ maxWidth: 80 }} />
            {konten.bio.split('\n\n').map((para, i) => (
              <p key={i} className="tentang-hero__bio font-mono">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section--paper tentang-timeline" id="tentang-timeline">
        <div className="container">
          <h2 className="font-display" style={{ color: 'var(--color-ink-dark)', marginBottom: 'var(--space-3xl)' }}>
            PERJALANAN
          </h2>
          <div className="tentang-timeline__list">
            {konten.timeline.map((item, i) => (
              <div key={i} className="tentang-timeline__item">
                <span className="tentang-timeline__year font-display">{item.tahun}</span>
                <div className="tentang-timeline__dot" />
                <p className="tentang-timeline__event font-mono">{item.peristiwa}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
