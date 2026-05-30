import LukisanCard from './LukisanCard';
import './GaleriGrid.css';

export default function GaleriGrid({ lukisan, showLoadMore, onLoadMore }) {
  return (
    <div className="galeri-grid-wrap">
      <div className="galeri-grid" id="galeri-grid">
        {lukisan.map((item, idx) => (
          <LukisanCard key={item.id} lukisan={item} index={idx} />
        ))}
      </div>

      {showLoadMore && (
        <div className="galeri-grid__more">
          <button
            className="galeri-grid__load-btn font-mono"
            onClick={onLoadMore}
            id="load-more-btn"
          >
            ── MUAT LEBIH BANYAK ──
          </button>
        </div>
      )}
    </div>
  );
}
