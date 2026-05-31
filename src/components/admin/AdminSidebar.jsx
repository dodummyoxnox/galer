import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { request } from '../../utils/api';
import { HiHome, HiPhotograph, HiTag, HiMail, HiInformationCircle, HiUser, HiLogout, HiCog } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import './AdminSidebar.css';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/admin/lukisan', label: 'Lukisan', icon: HiPhotograph },
  { to: '/admin/kategori', label: 'Kategori', icon: HiTag },
  { to: '/admin/pesan', label: 'Pesan', icon: HiMail, badge: true },
  { to: '/admin/info', label: 'Info / Layanan', icon: HiInformationCircle },
  { to: '/admin/tentang', label: 'Tentang', icon: HiUser },
  { to: '/admin/settings', label: 'Pengaturan', icon: HiCog },
];

export default function AdminSidebar() {
  const { logout, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread messages count dynamically if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMessages = async () => {
      try {
        const response = await request('/api/pesan');
        if (response.success && response.data) {
          const count = response.data.filter((p) => p.status === 'BARU').length;
          setUnreadCount(count);
        }
      } catch (error) {
        console.warn('Gagal memuat pesan masuk di sidebar:', error.message);
      }
    };

    fetchMessages();
    
    // Poll every 30 seconds to update badge count
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  return (
    <>
      <button className="admin-sidebar__toggle" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
        {open ? <HiX size={24} /> : <HiMenuAlt2 size={24} />}
      </button>

      <aside className={`admin-sidebar ${open ? 'admin-sidebar--open' : ''}`} id="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-text">ADMIN</span>
          <span className="admin-sidebar__brand-sub">
            {settings?.studioName || 'Studio Urakan'}
          </span>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.badge && unreadCount > 0 && (
                <span className="admin-sidebar__badge">{unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" className="admin-sidebar__link" target="_blank" rel="noopener noreferrer">
            <HiPhotograph size={18} />
            <span>Lihat Situs</span>
          </a>
          <button className="admin-sidebar__link admin-sidebar__logout" onClick={handleLogout}>
            <HiLogout size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {open && <div className="admin-sidebar__backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}
