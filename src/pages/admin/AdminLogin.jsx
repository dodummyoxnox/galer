import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoggingIn(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server.');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="admin-login" id="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <h1 className="admin-login__brand">ADMIN</h1>
          <span className="admin-login__sub">
            {settings?.studioName || 'Studio Urakan'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="admin-login__form">
          {error && <div className="admin-login__error">{error}</div>}

          <div className="admin-login__group">
            <label htmlFor="admin-email" className="admin-login__label">EMAIL</label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="admin-login__input"
              placeholder="admin@studio.com"
              disabled={loggingIn}
            />
          </div>

          <div className="admin-login__group">
            <label htmlFor="admin-password" className="admin-login__label">PASSWORD</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-login__input"
              placeholder="••••••••"
              disabled={loggingIn}
            />
          </div>

          <button
            type="submit"
            className="admin-login__submit"
            id="admin-login-submit"
            disabled={loggingIn}
          >
            {loggingIn ? 'MEMPROSES...' : 'MASUK'}
          </button>
        </form>

        <p className="admin-login__hint">
          Gunakan kredensial admin yang terkonfigurasi di env.
        </p>
      </div>
    </div>
  );
}
