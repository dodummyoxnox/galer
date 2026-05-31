import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Beranda from './pages/public/Beranda';
import Galeri from './pages/public/Galeri';
import DetailLukisan from './pages/public/DetailLukisan';
import Tentang from './pages/public/Tentang';
import Info from './pages/public/Info';
import Kontak from './pages/public/Kontak';
import NotFound from './pages/public/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminLukisan from './pages/admin/AdminLukisan';
import AdminLukisanForm from './pages/admin/AdminLukisanForm';
import AdminKategori from './pages/admin/AdminKategori';
import AdminPesan from './pages/admin/AdminPesan';
import AdminInfo from './pages/admin/AdminInfo';
import AdminTentang from './pages/admin/AdminTentang';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Beranda />} />
              <Route path="/galeri" element={<Galeri />} />
              <Route path="/galeri/:slug" element={<DetailLukisan />} />
              <Route path="/tentang" element={<Tentang />} />
              <Route path="/info" element={<Info />} />
              <Route path="/kontak" element={<Kontak />} />
            </Route>

            {/* Admin Login (no layout) */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Admin Routes (protected) */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/lukisan" element={<AdminLukisan />} />
              <Route path="/admin/lukisan/baru" element={<AdminLukisanForm />} />
              <Route path="/admin/lukisan/:id" element={<AdminLukisanForm />} />
              <Route path="/admin/kategori" element={<AdminKategori />} />
              <Route path="/admin/pesan" element={<AdminPesan />} />
              <Route path="/admin/info" element={<AdminInfo />} />
              <Route path="/admin/tentang" element={<AdminTentang />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
