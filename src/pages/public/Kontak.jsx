import { FaWhatsapp } from 'react-icons/fa';
import { HiMail, HiLocationMarker } from 'react-icons/hi';
import FormKontak from '../../components/public/FormKontak';
import './Kontak.css';

export default function Kontak() {
  return (
    <div className="kontak-page section" id="kontak-page">
      <div className="container">
        <div className="kontak-page__header">
          <h1 className="font-display">KONTAK</h1>
          <p className="font-mono kontak-page__subtitle">
            Punya pertanyaan, ide, atau ingin pesan lukisan? Tulis di sini.
          </p>
          <div className="divider-kasar" />
        </div>

        <div className="kontak-page__body">
          <div className="kontak-page__form">
            <FormKontak />
          </div>

          <div className="kontak-page__info">
            <h4 className="font-display" style={{ marginBottom: 'var(--space-xl)' }}>
              ATAU LANGSUNG
            </h4>

            <div className="kontak-page__info-item">
              <FaWhatsapp size={20} className="kontak-page__info-icon" />
              <div>
                <span className="kontak-page__info-label font-mono">WHATSAPP</span>
                <a href="https://wa.me/6281234567890" className="kontak-page__info-value font-mono link-marker">
                  +62 812-3456-7890
                </a>
              </div>
            </div>

            <div className="kontak-page__info-item">
              <HiMail size={20} className="kontak-page__info-icon" />
              <div>
                <span className="kontak-page__info-label font-mono">EMAIL</span>
                <a href="mailto:studio@urakan.com" className="kontak-page__info-value font-mono link-marker">
                  studio@urakan.com
                </a>
              </div>
            </div>

            <div className="kontak-page__info-item">
              <HiLocationMarker size={20} className="kontak-page__info-icon" />
              <div>
                <span className="kontak-page__info-label font-mono">STUDIO</span>
                <span className="kontak-page__info-value font-mono">
                  Yogyakarta, Indonesia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
