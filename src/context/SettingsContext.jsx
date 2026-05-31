import { createContext, useContext, useState, useEffect } from 'react';
import { request } from '../utils/api';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  studioName: 'STUDIO URAKAN',
  heroTitleFirst: 'STUDIO',
  heroTitleSecond: 'URAKAN',
  heroTagline: 'Seni yang jujur tidak butuh packaging yang mewah.\nTapi tetap butuh rancangan yang matang.',
  manifestoQuote: 'Melukis bukan tentang membuat yang indah. Melukis adalah menyampaikan yang jujur — meskipun jujur itu jelek, kasar, dan tidak enak dilihat.',
  manifestoCite: 'Ari "Urakan" Wibowo',
  ctaTitle: 'PUNYA CERITA\nYANG INGIN\nDILUKIS?',
  ctaDesc: 'Setiap lukisan dimulai dari percakapan. Ceritakan idemu.',
  email: 'studio@urakan.com',
  whatsapp: '6281234567890',
  instagram: 'https://instagram.com',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await request('/api/konten/settings');
      if (response.success && response.data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...response.data,
        });
      }
    } catch (error) {
      console.warn('Gagal memuat settings dari API, menggunakan data default.', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const reloadSettings = () => {
    fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, reloadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
