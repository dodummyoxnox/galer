import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { useSettings } from '../../context/SettingsContext';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  const waNumber = settings?.whatsapp || '6281234567890';
  const emailAddr = settings?.email || 'studio@urakan.com';
  const instaUrl = settings?.instagram || 'https://instagram.com';

  return (
    <footer className="footer" id="footer">
      <div className="divider-kasar" />
      <div className="footer__inner container">
        <div className="footer__left">
          <span className="footer__brand font-display">
            {settings?.studioName || 'STUDIO URAKAN'}
          </span>
          <span className="footer__copy font-mono">
            &copy; {currentYear} — Semua hak dilindungi (atau tidak).
          </span>
        </div>
        <div className="footer__socials">
          <a
            href={instaUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="footer__social-link"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="footer__social-link"
          >
            <FaWhatsapp size={22} />
          </a>
          <a
            href={`mailto:${emailAddr}`}
            aria-label="Email"
            className="footer__social-link"
          >
            <HiMail size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}
