import { useState } from 'react';
import { Link } from 'react-router-dom';
import { lukisanData, getStatusLabel, kategoriData } from '../../data/mockData';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import './AdminLukisan.css';

export default function AdminLukisan() {
  const [filter, setFilter] = useState({ status: '', kategori: '' });
  const [sortBy, setSortBy] = useState('terbaru');

  let data = [...lukisanData];

  // Filter
  if (filter.status) data = data.filter((l) => l.status === filter.status);
  if (filter.kategori) data = data.filter((l) => l.kategori.some((k) => k.slug === filter.kategori));

  // Sort
  if (sortBy === 'terbaru') data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sortBy === 'terlama') data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (sortBy === 'judul') data.sort((a, b) => a.judul.localeCompare(b.judul));

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
          {kategoriData.map((k) => (
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

        <span className="admin-lukisan__count">{data.length} lukisan</span>
      </div>

      {/* Table */}
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
            {data.map((l) => (
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
                    {l.kategori.map((k) => (
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
                    <button className="admin-icon-btn admin-icon-btn--danger" title="Hapus">
                      <HiTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
