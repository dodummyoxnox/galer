import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import './AdminLayout.css';

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        background: '#0d0d0d',
        color: '#f0ead6',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: '18px'
      }}>
        MEMVERIFIKASI SESI...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="admin-layout" id="admin-layout">
      <AdminSidebar />
      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
