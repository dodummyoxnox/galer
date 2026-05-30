import { useState } from 'react';
import { kategoriData, lukisanData } from '../../data/mockData';
import { HiPencil, HiTrash, HiPlus, HiCheck, HiX } from 'react-icons/hi';
import './AdminKategori.css';

export default function AdminKategori() {
  const [categories, setCategories] = useState(kategoriData);
  const [editingId, setEditingId] = useState(null);
  const [editNama, setEditNama] = useState('');
  const [newNama, setNewNama] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const getLukisanCount = (katId) => {
    return lukisanData.filter((l) => l.kategori.some((k) => k.id === katId)).length;
  };

  const startEdit = (kat) => {
    setEditingId(kat.id);
    setEditNama(kat.nama);
  };

  const saveEdit = () => {
    setCategories(categories.map((k) =>
      k.id === editingId ? { ...k, nama: editNama, slug: editNama.toLowerCase().replace(/\s+/g, '-') } : k
    ));
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newNama.trim()) return;
    const newKat = {
      id: Math.max(...categories.map((k) => k.id)) + 1,
      nama: newNama.trim(),
      slug: newNama.trim().toLowerCase().replace(/\s+/g, '-'),
    };
    setCategories([...categories, newKat]);
    setNewNama('');
    setShowAdd(false);
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
                <td>{getLukisanCount(kat.id)}</td>
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
                          title={getLukisanCount(kat.id) > 0 ? 'Tidak bisa hapus — masih dipakai' : 'Hapus'}
                          disabled={getLukisanCount(kat.id) > 0}
                          style={getLukisanCount(kat.id) > 0 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
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
    </div>
  );
}
