import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt4, HiX } from 'react-icons/hi';
import { useSettings } from '../../context/SettingsContext';
import './NavBar.css';

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/info', label: 'Info' },
  { to: '/kontak', label: 'Kontak' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand font-display">
          {settings?.studioName || 'STUDIO URAKAN'}
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <HiX size={28} /> : <HiMenuAlt4 size={28} />}
        </button>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar__link link-marker ${
                  location.pathname === link.to ? 'navbar__link--active' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
