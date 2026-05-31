import { useState, useEffect } from 'react';
import { HiMail, HiMailOpen, HiTrash, HiX } from 'react-icons/hi';
import { request } from '../../utils/api';
import './AdminPesan.css';

const formatTanggal = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminPesan() {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await request('/api/pesan');
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Gagal memuat pesan di admin inbox:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const selected = messages.find((m) => m.id === selectedId);

  const handleOpen = async (msg) => {
    setSelectedId(msg.id);
    if (msg.status === 'BARU') {
      try {
        const response = await request(`/api/pesan/${msg.id}/dibaca`, {
          method: 'PUT',
        });
        if (response.success) {
          // Update status in state immediately
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, status: 'DIBACA' } : m))
          );
        }
      } catch (error) {
        console.error('Gagal menandai pesan telah dibaca:', error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pesan ini secara permanen?')) {
      return;
    }

    try {
      const response = await request(`/api/pesan/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedId === id) setSelectedId(null);
      }
    } catch (error) {
      alert(`Gagal menghapus pesan: ${error.message}`);
    }
  };

  return (
    <div className="admin-pesan" id="admin-pesan">
      <h1 className="admin-page-title">Inbox Pesan</h1>
      
      {loading ? (
        <p className="admin-pesan__summary">Memuat inbox...</p>
      ) : (
        <p className="admin-pesan__summary">
          {messages.filter((m) => m.status === 'BARU').length} pesan baru dari {messages.length} total
        </p>
      )}

      {loading ? (
        <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '40px 0' }}>
          Mengambil data pesan...
        </div>
      ) : (
        <div className="admin-pesan__layout">
          {/* List */}
          <div className="admin-pesan__list">
            {messages.length === 0 ? (
              <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '20px 0', textAlign: 'center' }}>
                Inbox kosong.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`admin-pesan__item ${msg.status === 'BARU' ? 'admin-pesan__item--new' : ''} ${selectedId === msg.id ? 'admin-pesan__item--active' : ''}`}
                  onClick={() => handleOpen(msg)}
                >
                  <div className="admin-pesan__item-icon">
                    {msg.status === 'BARU' ? <HiMail size={18} /> : <HiMailOpen size={18} />}
                  </div>
                  <div className="admin-pesan__item-info">
                    <span className="admin-pesan__item-name">{msg.nama}</span>
                    <span className="admin-pesan__item-jenis">{msg.jenis}</span>
                    <span className="admin-pesan__item-preview">{msg.isi.slice(0, 60)}...</span>
                  </div>
                  <span className="admin-pesan__item-date">{formatTanggal(msg.createdAt)}</span>
                </div>
              ))
            )}
          </div>

          {/* Detail */}
          <div className="admin-pesan__detail">
            {selected ? (
              <>
                <div className="admin-pesan__detail-header">
                  <h3>{selected.nama}</h3>
                  <div className="admin-pesan__detail-actions">
                    <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(selected.id)} title="Hapus">
                      <HiTrash size={16} />
                    </button>
                    <button className="admin-icon-btn" onClick={() => setSelectedId(null)} title="Tutup">
                      <HiX size={16} />
                    </button>
                  </div>
                </div>

                <div className="admin-pesan__detail-meta">
                  <div><strong>Email:</strong> {selected.email}</div>
                  {selected.noWa && <div><strong>WhatsApp:</strong> {selected.noWa}</div>}
                  <div><strong>Jenis:</strong> {selected.jenis}</div>
                  <div><strong>Tanggal:</strong> {formatTanggal(selected.createdAt)}</div>
                </div>

                <div className="admin-pesan__detail-body">
                  <p style={{ whiteSpace: 'pre-line' }}>{selected.isi}</p>
                </div>

                <div className="admin-pesan__detail-reply">
                  {selected.noWa && (
                    <a
                      href={`https://wa.me/${selected.noWa.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn-primary"
                    >
                      Balas via WhatsApp
                    </a>
                  )}
                  <a href={`mailto:${selected.email}`} className="admin-btn-secondary">
                    Balas via Email
                  </a>
                </div>
              </>
            ) : (
              <div className="admin-pesan__empty">
                <HiMailOpen size={48} style={{ color: '#e5e5e5' }} />
                <p>Pilih pesan untuk membaca detail</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
