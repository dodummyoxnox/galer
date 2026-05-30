import { useParams, Link } from 'react-router-dom';
import { lukisanData, formatHarga } from '../../data/mockData';
import StatusStamp from '../../components/public/StatusStamp';
import './DetailLukisan.css';

export default function DetailLukisan() {
  const { slug } = useParams();
  const index = lukisanData.findIndex((l) => l.slug === slug);
  const lukisan = lukisanData[index];

  if (!lukisan) {
    return (
      <div className="detail-page section container">
        <h1 className="font-display">KARYA TIDAK DITEMUKAN</h1>
        <p className="font-mono" style={{ color: 'var(--color-muted)' }}>
          Lukisan yang kamu cari tidak ada di galeri.
        </p>
        <Link to="/galeri" className="btn-brutal" style={{ marginTop: 'var(--space-xl)', display: 'inline-block' }}>
          ← KEMBALI KE GALERI
        </Link>
      </div>
    );
  }

  const prevLukisan = index > 0 ? lukisanData[index - 1] : null;
  const nextLukisan = index < lukisanData.length - 1 ? lukisanData[index + 1] : null;

  const details = [
    { label: 'TAHUN', value: lukisan.tahun },
    { label: 'MEDIUM', value: lukisan.medium },
    { label: 'UKURAN', value: lukisan.ukuran },
    { label: 'KANVAS', value: lukisan.kanvas },
    ...(lukisan.tampilHarga && lukisan.harga
      ? [{ label: 'HARGA', value: formatHarga(lukisan.harga) }]
      : []),
  ];

  return (
    <div className="detail-page" id="detail-page">
      <div className="detail-page__hero">
        <div className="detail-page__image">
          <img src={lukisan.fotoUtama} alt={lukisan.judul} />
        </div>

        <div className="detail-page__info">
          <StatusStamp status={lukisan.status} />

          <h1 className="detail-page__title font-display">{lukisan.judul}</h1>

          <div className="detail-page__details">
            {details.map((d) => (
              <div key={d.label} className="detail-page__detail-row">
                <span className="detail-page__detail-label font-mono">{d.label}</span>
                <span className="detail-page__detail-value font-mono">{d.value}</span>
              </div>
            ))}
          </div>

          {lukisan.kategori.length > 0 && (
            <div className="detail-page__tags">
              {lukisan.kategori.map((k) => (
                <span key={k.id} className="detail-page__tag stamp" style={{ transform: `rotate(${Math.random() * 4 - 2}deg)` }}>
                  {k.nama}
                </span>
              ))}
            </div>
          )}

          <div className="divider-kasar divider-kasar--thin" />

          <div className="detail-page__desc font-mono">
            <p>{lukisan.deskripsi}</p>
          </div>

          <Link to="/kontak" className="btn-brutal btn-brutal--accent">
            TERTARIK? HUBUNGI SAYA
          </Link>
        </div>
      </div>

      {/* Additional photos */}
      {lukisan.fotoLain.length > 0 && (
        <div className="detail-page__gallery container">
          <h4 className="font-display" style={{ marginBottom: 'var(--space-lg)' }}>FOTO LAINNYA</h4>
          <div className="detail-page__gallery-grid">
            {lukisan.fotoLain.map((foto, i) => (
              <img key={i} src={foto} alt={`${lukisan.judul} - foto ${i + 2}`} loading="lazy" />
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="detail-page__nav container">
        <div>
          {prevLukisan && (
            <Link to={`/galeri/${prevLukisan.slug}`} className="detail-page__nav-link font-mono">
              ← KARYA SEBELUMNYA
              <span className="detail-page__nav-title font-display">{prevLukisan.judul}</span>
            </Link>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          {nextLukisan && (
            <Link to={`/galeri/${nextLukisan.slug}`} className="detail-page__nav-link font-mono">
              KARYA BERIKUTNYA →
              <span className="detail-page__nav-title font-display">{nextLukisan.judul}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
