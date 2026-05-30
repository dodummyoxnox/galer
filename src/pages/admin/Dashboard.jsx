import { Link } from 'react-router-dom';
import { lukisanData, pesanData, formatTanggal, getStatusLabel } from '../../data/mockData';
import { HiPhotograph, HiCheckCircle, HiMail, HiPlus } from 'react-icons/hi';
import './Dashboard.css';

export default function Dashboard() {
  const totalLukisan = lukisanData.length;
  const lukisanTersedia = lukisanData.filter((l) => l.status === 'TERSEDIA').length;
  const pesanBaru = pesanData.filter((p) => p.status === 'BARU').length;
  const recentLukisan = lukisanData.slice(0, 5);
  const recentPesan = pesanData.slice(0, 5);

  const stats = [
    { label: 'Total Lukisan', value: totalLukisan, icon: HiPhotograph, color: '#3b82f6' },
    { label: 'Lukisan Tersedia', value: lukisanTersedia, icon: HiCheckCircle, color: '#22c55e' },
    { label: 'Pesan Baru', value: pesanBaru, icon: HiMail, color: '#ef4444' },
  ];

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
            {recentLukisan.map((l) => (
              <div key={l.id} className="admin-dashboard__list-item">
                <img src={l.fotoUtama} alt={l.judul} className="admin-dashboard__thumb" />
                <div className="admin-dashboard__list-info">
                  <span className="admin-dashboard__list-title">{l.judul}</span>
                  <span className="admin-dashboard__list-meta">{l.tahun} · {getStatusLabel(l.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-header">
            <h3>Pesan Terbaru</h3>
            <Link to="/admin/pesan" className="admin-dashboard__view-all">Lihat semua →</Link>
          </div>
          <div className="admin-dashboard__list">
            {recentPesan.map((p) => (
              <div key={p.id} className="admin-dashboard__list-item">
                <div className={`admin-dashboard__msg-dot ${p.status === 'BARU' ? 'admin-dashboard__msg-dot--new' : ''}`} />
                <div className="admin-dashboard__list-info">
                  <span className="admin-dashboard__list-title">{p.nama}</span>
                  <span className="admin-dashboard__list-meta">
                    {formatTanggal(p.createdAt)} · {p.isi.slice(0, 50)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
