import { useState } from 'react';
import './FormKontak.css';

const jenisOptions = [
  'Lukisan Potret',
  'Lukisan Custom',
  'Mural',
  'Ilustrasi',
  'Pertanyaan Umum',
  'Lainnya',
];

export default function FormKontak() {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    noWa: '',
    jenis: '',
    isi: '',
  });
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setForm({ nama: '', email: '', noWa: '', jenis: '', isi: '' });
      setTimeout(() => setStatus(null), 5000);
    }, 1500);
  };

  return (
    <form className="form-kontak" onSubmit={handleSubmit} id="form-kontak">
      <div className="form-kontak__group">
        <label className="form-kontak__label font-mono" htmlFor="field-nama">NAMA *</label>
        <input
          type="text"
          id="field-nama"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          required
          className="form-kontak__input font-mono"
          placeholder="Nama lengkap kamu"
        />
      </div>

      <div className="form-kontak__row">
        <div className="form-kontak__group">
          <label className="form-kontak__label font-mono" htmlFor="field-email">EMAIL *</label>
          <input
            type="email"
            id="field-email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="form-kontak__input font-mono"
            placeholder="email@contoh.com"
          />
        </div>

        <div className="form-kontak__group">
          <label className="form-kontak__label font-mono" htmlFor="field-nowa">NO. WHATSAPP</label>
          <input
            type="tel"
            id="field-nowa"
            name="noWa"
            value={form.noWa}
            onChange={handleChange}
            className="form-kontak__input font-mono"
            placeholder="08xxxxxxxxxx"
          />
        </div>
      </div>

      <div className="form-kontak__group">
        <label className="form-kontak__label font-mono" htmlFor="field-jenis">JENIS PERMINTAAN *</label>
        <select
          id="field-jenis"
          name="jenis"
          value={form.jenis}
          onChange={handleChange}
          required
          className="form-kontak__input form-kontak__select font-mono"
        >
          <option value="">— Pilih jenis —</option>
          {jenisOptions.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
      </div>

      <div className="form-kontak__group">
        <label className="form-kontak__label font-mono" htmlFor="field-isi">PESAN *</label>
        <textarea
          id="field-isi"
          name="isi"
          value={form.isi}
          onChange={handleChange}
          required
          rows={6}
          className="form-kontak__input form-kontak__textarea font-mono"
          placeholder="Ceritakan apa yang kamu butuhkan..."
        />
      </div>

      <div className="form-kontak__footer">
        <button
          type="submit"
          className="btn-brutal btn-brutal--filled"
          disabled={status === 'loading'}
          id="submit-kontak"
        >
          {status === 'loading' ? 'MENGIRIM...' : 'KIRIM PESAN'}
        </button>

        {status === 'success' && (
          <span className="form-kontak__status form-kontak__status--success font-mono">
            PESAN TERKIRIM ✓
          </span>
        )}
        {status === 'error' && (
          <span className="form-kontak__status form-kontak__status--error font-mono">
            GAGAL MENGIRIM — COBA LAGI
          </span>
        )}
      </div>
    </form>
  );
}
