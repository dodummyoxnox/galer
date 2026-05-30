import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found section" id="not-found-page">
      <div className="container not-found__inner">
        <span className="not-found__code font-display">404</span>
        <h1 className="not-found__title font-display">
          HALAMAN INI<br />TIDAK ADA, SOB.
        </h1>
        <p className="not-found__desc font-mono">
          Entah kamu salah ketik, atau halaman ini sudah dihapus.<br />
          Yang jelas, tidak ada apa-apa di sini.
        </p>
        <Link to="/" className="btn-brutal">
          ← KEMBALI KE BERANDA
        </Link>
      </div>
    </div>
  );
}
