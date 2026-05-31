import { useState, useEffect, useMemo } from 'react';
import FilterBar from '../../components/public/FilterBar';
import GaleriGrid from '../../components/public/GaleriGrid';
import { request } from '../../utils/api';
import './Galeri.css';

const ITEMS_PER_PAGE = 9;

export default function Galeri() {
  const [lukisanList, setLukisanList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('semua');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGaleriData = async () => {
      try {
        const [lukisanRes, kategoriRes] = await Promise.all([
          request('/api/lukisan'),
          request('/api/kategori'),
        ]);

        if (lukisanRes.success) setLukisanList(lukisanRes.data);
        if (kategoriRes.success) setKategoriList(kategoriRes.data);
      } catch (error) {
        console.error('Gagal memuat data galeri:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadGaleriData();
  }, []);

  const filteredLukisan = useMemo(() => {
    if (activeFilter === 'semua') return lukisanList;
    return lukisanList.filter((l) =>
      l.kategori?.some((k) => k.slug === activeFilter)
    );
  }, [activeFilter, lukisanList]);

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
          {loading ? (
            <p className="galeri-page__subtitle font-mono">Memuat galeri...</p>
          ) : (
            <p className="galeri-page__subtitle font-mono">
              {filteredLukisan.length} karya — setiap goresan punya cerita.
            </p>
          )}
          <div className="divider-kasar" />
        </div>

        {loading ? (
          <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '50px 0', textAlign: 'center' }}>
            Mengambil data lukisan...
          </div>
        ) : (
          <>
            <FilterBar
              kategoriList={kategoriList}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />

            {visibleLukisan.length === 0 ? (
              <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '50px 0', textAlign: 'center' }}>
                Tidak ada lukisan dengan kategori ini.
              </div>
            ) : (
              <GaleriGrid
                lukisan={visibleLukisan}
                showLoadMore={hasMore}
                onLoadMore={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
