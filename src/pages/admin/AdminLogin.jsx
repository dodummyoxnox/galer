import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="admin-login" id="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <h1 className="admin-login__brand">ADMIN</h1>
          <span className="admin-login__sub">Studio Urakan</span>
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
            />
          </div>

          <button type="submit" className="admin-login__submit" id="admin-login-submit">
            MASUK
          </button>
        </form>

        <p className="admin-login__hint">
          Demo: admin@studio.com / admin123
        </p>
      </div>
    </div>
  );
}
