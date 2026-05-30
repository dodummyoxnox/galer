import { Link } from 'react-router-dom';
import { formatNomor } from '../../data/mockData';
import './LukisanCard.css';

export default function LukisanCard({ lukisan, index }) {
  return (
    <Link
      to={`/galeri/${lukisan.slug}`}
      className="lukisan-card"
      id={`lukisan-card-${lukisan.id}`}
    >
      <div className="lukisan-card__img-wrap">
        <img
          src={lukisan.fotoUtama}
          alt={lukisan.judul}
          className="lukisan-card__img"
          loading="lazy"
        />
        <div className="lukisan-card__overlay">
          <span className="lukisan-card__num font-mono">{formatNomor(index)}</span>
          <h3 className="lukisan-card__title font-display">{lukisan.judul}</h3>
          <span className="lukisan-card__meta font-mono">
            {lukisan.tahun} · {lukisan.medium}
          </span>
        </div>
      </div>
    </Link>
  );
}
