import './FilterBar.css';

export default function FilterBar({ kategoriList, activeFilter, onFilterChange }) {
  return (
    <div className="filter-bar" id="filter-bar">
      <button
        className={`filter-bar__item font-mono ${activeFilter === 'semua' ? 'filter-bar__item--active' : ''}`}
        onClick={() => onFilterChange('semua')}
      >
        Semua
      </button>
      {kategoriList.map((kat) => (
        <button
          key={kat.id}
          className={`filter-bar__item font-mono ${activeFilter === kat.slug ? 'filter-bar__item--active' : ''}`}
          onClick={() => onFilterChange(kat.slug)}
        >
          {kat.nama}
        </button>
      ))}
    </div>
  );
}
