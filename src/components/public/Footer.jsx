import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="divider-kasar" />
      <div className="footer__inner container">
        <div className="footer__left">
          <span className="footer__brand font-display">STUDIO URAKAN</span>
          <span className="footer__copy font-mono">
            &copy; {currentYear} — Semua hak dilindungi (atau tidak).
          </span>
        </div>
        <div className="footer__socials">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer__social-link">
            <FaInstagram size={22} />
          </a>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="footer__social-link">
            <FaWhatsapp size={22} />
          </a>
          <a href="mailto:studio@urakan.com" aria-label="Email" className="footer__social-link">
            <HiMail size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}
