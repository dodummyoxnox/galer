import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import { request } from '../../utils/api';
import './AdminLukisan.css';

const getStatusLabel = (status) => {
  const labels = {
    TERSEDIA: 'Tersedia',
    TERJUAL: 'Terjual',
    TIDAK_DIJUAL: 'Tidak Dijual',
  };
  return labels[status] || status;
};

export default function AdminLukisan() {
  const [lukisanList, setLukisanList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [filter, setFilter] = useState({ status: '', kategori: '' });
  const [sortBy, setSortBy] = useState('terbaru');
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await request('/api/kategori');
        if (response.success) {
          setKategoriList(response.data);
        }
      } catch (error) {
        console.error('Gagal memuat kategori di admin:', error.message);
      }
    };
    fetchKategori();
  }, []);

  // Fetch paintings list whenever filters or sort parameters change
  const fetchLukisan = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filter.status) query.append('status', filter.status);
      if (filter.kategori) query.append('kategori', filter.kategori);
      if (sortBy) {
        // Map frontend sorting names to backend sorting keys
        let backendSort = 'terbaru';
        if (sortBy === 'terlama') backendSort = 'terlama';
        if (sortBy === 'judul') backendSort = 'judul-az';
        query.append('sort', backendSort);
      }

      const response = await request(`/api/lukisan?${query.toString()}`);
      if (response.success) {
        setLukisanList(response.data);
      }
    } catch (error) {
      console.error('Gagal memuat lukisan di admin:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLukisan();
  }, [filter.status, filter.kategori, sortBy]);

  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus lukisan "${judul}"? File gambar di storage juga akan dihapus secara permanen.`)) {
      return;
    }

    try {
      const response = await request(`/api/lukisan/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        alert('Lukisan berhasil dihapus.');
        // Refresh list
        fetchLukisan();
      }
    } catch (error) {
      alert(`Gagal menghapus lukisan: ${error.message}`);
    }
  };

  return (
    <div className="admin-lukisan" id="admin-lukisan">
      <div className="admin-lukisan__header">
        <h1 className="admin-page-title">Kelola Lukisan</h1>
        <Link to="/admin/lukisan/baru" className="admin-btn-primary">
          <HiPlus size={18} />
          Tambah Lukisan
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-lukisan__filters">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="admin-select"
        >
          <option value="">Semua Status</option>
          <option value="TERSEDIA">Tersedia</option>
          <option value="TERJUAL">Terjual</option>
          <option value="TIDAK_DIJUAL">Tidak Dijual</option>
        </select>

        <select
          value={filter.kategori}
          onChange={(e) => setFilter({ ...filter, kategori: e.target.value })}
          className="admin-select"
        >
          <option value="">Semua Kategori</option>
          {kategoriList.map((k) => (
            <option key={k.id} value={k.slug}>{k.nama}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="admin-select"
        >
          <option value="terbaru">Terbaru</option>
          <option value="terlama">Terlama</option>
          <option value="judul">Judul A-Z</option>
        </select>

        <span className="admin-lukisan__count">
          {loading ? '...' : `${lukisanList.length} lukisan`}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '40px 0' }}>
          Memuat lukisan...
        </div>
      ) : lukisanList.length === 0 ? (
        <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '40px 0' }}>
          Tidak ada lukisan ditemukan.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lukisan</th>
                <th>Kategori</th>
                <th>Tahun</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lukisanList.map((l) => (
                <tr key={l.id}>
                  <td>
                    <div className="admin-lukisan__cell-main">
                      <img src={l.fotoUtama} alt={l.judul} className="admin-lukisan__cell-thumb" />
                      <div>
                        <span className="admin-lukisan__cell-title">{l.judul}</span>
                        <span className="admin-lukisan__cell-meta">{l.medium}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-lukisan__cell-tags">
                      {l.kategori && l.kategori.map((k) => (
                        <span key={k.id} className="admin-tag">{k.nama}</span>
                      ))}
                    </div>
                  </td>
                  <td>{l.tahun}</td>
                  <td>
                    <span className={`admin-status admin-status--${l.status.toLowerCase()}`}>
                      {getStatusLabel(l.status)}
                    </span>
                  </td>
                  <td>
                    <div className="admin-lukisan__actions">
                      <Link to={`/admin/lukisan/${l.id}`} className="admin-icon-btn" title="Edit">
                        <HiPencil size={16} />
                      </Link>
                      <button
                        className="admin-icon-btn admin-icon-btn--danger"
                        title="Hapus"
                        onClick={() => handleDelete(l.id, l.judul)}
                      >
                        <HiTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
