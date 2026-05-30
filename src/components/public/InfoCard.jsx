import { formatHarga } from '../../data/mockData';
import './InfoCard.css';

export default function InfoCard({ layanan }) {
  return (
    <div className="info-card" id={`info-card-${layanan.nama.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="info-card__header">
        <h3 className="info-card__title font-display">{layanan.nama}</h3>
        <span className="info-card__waktu font-mono">{layanan.estimasiWaktu}</span>
      </div>
      <p className="info-card__desc font-mono">{layanan.deskripsi}</p>
      <div className="info-card__price font-mono">
        <span className="info-card__price-label">MULAI DARI</span>
        <span className="info-card__price-range">
          {formatHarga(layanan.hargaMin)} — {formatHarga(layanan.hargaMax)}
        </span>
      </div>
    </div>
  );
}
