import { useState, useMemo } from 'react';
import FilterBar from '../../components/public/FilterBar';
import GaleriGrid from '../../components/public/GaleriGrid';
import { lukisanData, kategoriData } from '../../data/mockData';
import './Galeri.css';

const ITEMS_PER_PAGE = 9;

export default function Galeri() {
  const [activeFilter, setActiveFilter] = useState('semua');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredLukisan = useMemo(() => {
    if (activeFilter === 'semua') return lukisanData;
    return lukisanData.filter((l) =>
      l.kategori.some((k) => k.slug === activeFilter)
    );
  }, [activeFilter]);

  const visibleLukisan = filteredLukisan.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLukisan.length;

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="galeri-page section" id="galeri-page">
      <div className="container">
        <div className="galeri-page__header">
          <h1 className="font-display">GALERI</h1>
          <p className="galeri-page__subtitle font-mono">
            {filteredLukisan.length} karya — setiap goresan punya cerita.
          </p>
          <div className="divider-kasar" />
        </div>

        <FilterBar
          kategoriList={kategoriData}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        <GaleriGrid
          lukisan={visibleLukisan}
          showLoadMore={hasMore}
          onLoadMore={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
        />
      </div>
    </div>
  );
}
