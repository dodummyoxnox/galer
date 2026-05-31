import { useState, useEffect } from 'react';
import { HiPencil, HiTrash, HiPlus, HiCheck, HiX } from 'react-icons/hi';
import { request } from '../../utils/api';
import './AdminKategori.css';

export default function AdminKategori() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editNama, setEditNama] = useState('');
  const [newNama, setNewNama] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await request('/api/kategori');
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Gagal memuat kategori di admin:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const startEdit = (kat) => {
    setEditingId(kat.id);
    setEditNama(kat.nama);
  };

  const saveEdit = async () => {
    if (!editNama.trim()) return;
    try {
      const response = await request(`/api/kategori/${editingId}`, {
        method: 'PUT',
        body: { nama: editNama.trim() },
      });

      if (response.success) {
        setEditingId(null);
        fetchCategories();
      }
    } catch (error) {
      alert(`Gagal memperbarui kategori: ${error.message}`);
    }
  };

  const handleAdd = async () => {
    if (!newNama.trim()) return;
    try {
      const response = await request('/api/kategori', {
        method: 'POST',
        body: { nama: newNama.trim() },
      });

      if (response.success) {
        setNewNama('');
        setShowAdd(false);
        fetchCategories();
      }
    } catch (error) {
      alert(`Gagal menambahkan kategori: ${error.message}`);
    }
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kategori "${nama}"?`)) {
      return;
    }

    try {
      const response = await request(`/api/kategori/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        fetchCategories();
      }
    } catch (error) {
      alert(`Gagal menghapus kategori: ${error.message}`);
    }
  };

  return (
    <div className="admin-kategori" id="admin-kategori">
      <div className="admin-lukisan__header">
        <h1 className="admin-page-title">Kelola Kategori</h1>
        <button className="admin-btn-primary" onClick={() => setShowAdd(true)}>
          <HiPlus size={18} />
          Tambah Kategori
        </button>
      </div>

      {loading ? (
        <div className="font-mono" style={{ color: 'var(--color-muted)', padding: '40px 0' }}>
          Memuat kategori...
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Kategori</th>
                <th>Slug</th>
                <th>Jumlah Lukisan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {showAdd && (
                <tr>
                  <td>
                    <input
                      type="text"
                      value={newNama}
                      onChange={(e) => setNewNama(e.target.value)}
                      className="admin-input"
                      placeholder="Nama kategori baru"
                      autoFocus
                    />
                  </td>
                  <td style={{ color: '#999' }}>{newNama.toLowerCase().replace(/\s+/g, '-') || '...'}</td>
                  <td>0</td>
                  <td>
                    <div className="admin-lukisan__actions">
                      <button className="admin-icon-btn" onClick={handleAdd} title="Simpan"><HiCheck size={16} /></button>
                      <button className="admin-icon-btn" onClick={() => setShowAdd(false)} title="Batal"><HiX size={16} /></button>
                    </div>
                  </td>
                </tr>
              )}
              {categories.map((kat) => (
                <tr key={kat.id}>
                  <td>
                    {editingId === kat.id ? (
                      <input
                        type="text"
                        value={editNama}
                        onChange={(e) => setEditNama(e.target.value)}
                        className="admin-input"
                        autoFocus
                      />
                    ) : (
                      <strong>{kat.nama}</strong>
                    )}
                  </td>
                  <td style={{ color: '#999' }}>{kat.slug}</td>
                  <td>{kat.lukisanCount}</td>
                  <td>
                    <div className="admin-lukisan__actions">
                      {editingId === kat.id ? (
                        <>
                          <button className="admin-icon-btn" onClick={saveEdit} title="Simpan"><HiCheck size={16} /></button>
                          <button className="admin-icon-btn" onClick={() => setEditingId(null)} title="Batal"><HiX size={16} /></button>
                        </>
                      ) : (
                        <>
                          <button className="admin-icon-btn" onClick={() => startEdit(kat)} title="Edit"><HiPencil size={16} /></button>
                          <button
                            className="admin-icon-btn admin-icon-btn--danger"
                            title={kat.lukisanCount > 0 ? 'Tidak bisa hapus — masih dipakai' : 'Hapus'}
                            disabled={kat.lukisanCount > 0}
                            style={kat.lukisanCount > 0 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                            onClick={() => handleDelete(kat.id, kat.nama)}
                          >
                            <HiTrash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
