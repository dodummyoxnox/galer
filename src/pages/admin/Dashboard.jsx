import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPhotograph, HiCheckCircle, HiMail, HiPlus } from 'react-icons/hi';
import { request } from '../../utils/api';
import './Dashboard.css';

const formatTanggal = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getStatusLabel = (status) => {
  const labels = {
    TERSEDIA: 'Tersedia',
    TERJUAL: 'Terjual',
    TIDAK_DIJUAL: 'Tidak Dijual',
  };
  return labels[status] || status;
};

export default function Dashboard() {
  const [lukisanList, setLukisanList] = useState([]);
  const [pesanList, setPesanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [lukisanRes, pesanRes] = await Promise.all([
          request('/api/lukisan'),
          request('/api/pesan'),
        ]);

        if (lukisanRes.success) setLukisanList(lukisanRes.data);
        if (pesanRes.success) setPesanList(pesanRes.data);
      } catch (error) {
        console.error('Gagal memuat data dashboard:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalLukisan = lukisanList.length;
  const lukisanTersedia = lukisanList.filter((l) => l.status === 'TERSEDIA').length;
  const pesanBaru = pesanList.filter((p) => p.status === 'BARU').length;
  const recentLukisan = lukisanList.slice(0, 5);
  const recentPesan = pesanList.slice(0, 5);

  const stats = [
    { label: 'Total Lukisan', value: totalLukisan, icon: HiPhotograph, color: '#3b82f6' },
    { label: 'Lukisan Tersedia', value: lukisanTersedia, icon: HiCheckCircle, color: '#22c55e' },
    { label: 'Pesan Baru', value: pesanBaru, icon: HiMail, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="admin-dashboard font-mono" style={{ padding: '40px 0', color: 'var(--color-muted)' }}>
        Memuat data dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard" id="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Dashboard</h1>
        <Link to="/admin/lukisan/baru" className="admin-dashboard__add-btn">
          <HiPlus size={18} />
          Tambah Lukisan
        </Link>
      </div>

      {/* Stats */}
      <div className="admin-dashboard__stats">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-card__icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="admin-dashboard__grid">
        {/* Recent Lukisan */}
        <div className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-header">
            <h3>Lukisan Terbaru</h3>
            <Link to="/admin/lukisan" className="admin-dashboard__view-all">Lihat semua →</Link>
          </div>
          <div className="admin-dashboard__list">
            {recentLukisan.length === 0 ? (
              <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '15px 0' }}>
                Belum ada lukisan.
              </div>
            ) : (
              recentLukisan.map((l) => (
                <div key={l.id} className="admin-dashboard__list-item">
                  <img src={l.fotoUtama} alt={l.judul} className="admin-dashboard__thumb" />
                  <div className="admin-dashboard__list-info">
                    <span className="admin-dashboard__list-title">{l.judul}</span>
                    <span className="admin-dashboard__list-meta">{l.tahun} · {getStatusLabel(l.status)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-header">
            <h3>Pesan Terbaru</h3>
            <Link to="/admin/pesan" className="admin-dashboard__view-all">Lihat semua →</Link>
          </div>
          <div className="admin-dashboard__list">
            {recentPesan.length === 0 ? (
              <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '15px 0' }}>
                Belum ada pesan masuk.
              </div>
            ) : (
              recentPesan.map((p) => (
                <div key={p.id} className="admin-dashboard__list-item">
                  <div className={`admin-dashboard__msg-dot ${p.status === 'BARU' ? 'admin-dashboard__msg-dot--new' : ''}`} />
                  <div className="admin-dashboard__list-info">
                    <span className="admin-dashboard__list-title">{p.nama}</span>
                    <span className="admin-dashboard__list-meta">
                      {formatTanggal(p.createdAt)} · {p.isi.slice(0, 50)}...
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
