import { Outlet } from 'react-router-dom';
import NavBar from '../components/public/NavBar';
import Footer from '../components/public/Footer';
import GrainOverlay from '../components/public/GrainOverlay';

export default function PublicLayout() {
  return (
    <>
      <GrainOverlay />
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
