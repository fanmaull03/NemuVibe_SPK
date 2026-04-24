import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createCafe, updateCafe, fetchCafeDetail, uploadPhotos } from '../services/api';
import './AddCafe.css';

const CRITERIA = [
  { key: 'c1_digital', label: 'Fasilitas Digital', icon: '📶' },
  { key: 'c2_harga',   label: 'Harga Menu',        icon: '💰' },
  { key: 'c3_suasana', label: 'Suasana',            icon: '🎨' },
  { key: 'c4_tenang',  label: 'Ketenangan',         icon: '🔇' },
  { key: 'c5_hiburan', label: 'Hiburan',            icon: '🎵' },
  { key: 'c6_rasa',    label: 'Rasa',               icon: '☕' },
];

export default function AddCafe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { token, isAdmin } = useContext(AuthContext);

  // Redirect jika bukan admin
  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/login', { replace: true });
    }
  }, [token, isAdmin]);

  const [form, setForm] = useState({
    nama: '', alamat: '', jam_buka: '', jam_tutup: '', link_gmaps: '',
    kategori: '', area: '', keunggulan: '', foto_utama: '', galeri: '',
    is24jam: false,
    c1_digital: 50, c2_harga: 50, c3_suasana: 50, c4_tenang: 50, c5_hiburan: 50, c6_rasa: 50
  });

  // Foto utama: satu file
  const [fotoUtamaPreview, setFotoUtamaPreview] = useState(null);
  const [fotoUtamaFile, setFotoUtamaFile] = useState(null);

  // Galeri: multiple files
  const [galeriPreviews, setGaleriPreviews] = useState([]); // { url, file?, isExisting? }
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (isEdit) loadCafe();
  }, [id]);

  const loadCafe = async () => {
    try {
      const res = await fetchCafeDetail(id);
      const d = res.data;
      const is24 = d.jam_buka === '00:00' && d.jam_tutup === '00:00';
      setForm({
        nama: d.nama || '', alamat: d.alamat || '',
        jam_buka: d.jam_buka || '', jam_tutup: d.jam_tutup || '',
        link_gmaps: d.link_gmaps || '',
        kategori: d.kategori || '', area: d.area || '',
        keunggulan: d.keunggulan || '',
        foto_utama: d.foto_utama || '', galeri: d.galeri || '',
        is24jam: is24,
        c1_digital: (d.c1_digital / 5) * 100,
        c2_harga:   (d.c2_harga / 5) * 100,
        c3_suasana: (d.c3_suasana / 5) * 100,
        c4_tenang:  (d.c4_tenang / 5) * 100,
        c5_hiburan: (d.c5_hiburan / 5) * 100,
        c6_rasa:    (d.c6_rasa / 5) * 100,
      });
      if (d.foto_utama) setFotoUtamaPreview(d.foto_utama);
      if (d.galeri) {
        const urls = d.galeri.split(',').map(g => g.trim()).filter(Boolean);
        setGaleriPreviews(urls.map(url => ({ url, isExisting: true })));
      }
    } catch {
      showToast('Gagal memuat data cafe');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleSlider = (key, val) => {
    setForm(prev => ({ ...prev, [key]: Number(val) }));
  };

  const handle24jam = (checked) => {
    setForm(prev => ({
      ...prev,
      is24jam: checked,
      jam_buka: checked ? '00:00' : prev.jam_buka,
      jam_tutup: checked ? '00:00' : prev.jam_tutup,
    }));
  };

  // === FOTO UTAMA ===
  const handleFotoUtama = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoUtamaFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoUtamaPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeFotoUtama = () => {
    setFotoUtamaFile(null);
    setFotoUtamaPreview(null);
    setForm(prev => ({ ...prev, foto_utama: '' }));
  };

  // === GALERI ===
  const handleGaleriAdd = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setGaleriPreviews(prev => [...prev, { url: ev.target.result, file, isExisting: false }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGaleri = (idx) => {
    setGaleriPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // === SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim()) {
      showToast('Nama cafe wajib diisi');
      return;
    }

    setSaving(true);
    setUploading(true);

    try {
      let finalFotoUtama = form.foto_utama;
      let finalGaleri = form.galeri;

      // Upload foto utama jika ada file baru
      if (fotoUtamaFile) {
        const res = await uploadPhotos([fotoUtamaFile]);
        finalFotoUtama = res.data.urls[0];
      }

      // Upload galeri foto baru
      const newGaleriFiles = galeriPreviews.filter(g => !g.isExisting && g.file).map(g => g.file);
      const existingGaleriUrls = galeriPreviews.filter(g => g.isExisting).map(g => g.url);

      if (newGaleriFiles.length > 0) {
        const res = await uploadPhotos(newGaleriFiles);
        finalGaleri = [...existingGaleriUrls, ...res.data.urls].join(', ');
      } else {
        finalGaleri = existingGaleriUrls.join(', ');
      }

      setUploading(false);

      const payload = {
        ...form,
        foto_utama: finalFotoUtama,
        galeri: finalGaleri,
      };

      if (isEdit) {
        await updateCafe(id, payload);
        showToast('Cafe berhasil diupdate!');
      } else {
        await createCafe(payload);
        showToast('Cafe baru berhasil ditambahkan!');
      }
      setTimeout(() => navigate('/admin'), 1000);
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan data cafe');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="addcafe-page">
      {/* Header */}
      <header className="addcafe-header">
        <button className="addcafe-back-btn" onClick={() => navigate('/admin')} aria-label="Kembali">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5L8 11L14 17" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="addcafe-header-title">{isEdit ? 'Edit Cafe' : 'Tambah Cafe Baru'}</h1>
        <div className="addcafe-header-spacer"/>
      </header>

      <form className="addcafe-main" onSubmit={handleSubmit}>
        {/* ===== INFORMASI UMUM ===== */}
        <section className="addcafe-section">
          <h2 className="addcafe-section-title">
            <span className="addcafe-section-icon">🏪</span>
            Informasi Umum
          </h2>

          <div className="addcafe-field">
            <label className="addcafe-label">Nama Cafe</label>
            <input type="text" className="addcafe-input" placeholder="Contoh: Kopi Janji Jiwa" value={form.nama} onChange={e => handleChange('nama', e.target.value)} required/>
          </div>

          <div className="addcafe-field">
            <label className="addcafe-label">Alamat Lengkap</label>
            <input type="text" className="addcafe-input" placeholder="Jl. Kampus No. 123, Grendeng..." value={form.alamat} onChange={e => handleChange('alamat', e.target.value)}/>
          </div>

          {/* Jam Operasional */}
          <div className="addcafe-field">
            <div className="addcafe-24jam-wrap">
              <label className="addcafe-label" style={{ marginBottom: 0 }}>Jam Operasional</label>
              <label className="addcafe-toggle">
                <input type="checkbox" checked={form.is24jam} onChange={e => handle24jam(e.target.checked)}/>
                <span className="addcafe-toggle-slider"/>
                <span className="addcafe-toggle-label">Buka 24 Jam</span>
              </label>
            </div>
          </div>

          {!form.is24jam && (
            <div className="addcafe-row">
              <div className="addcafe-field">
                <label className="addcafe-label">Jam Buka</label>
                <div className="addcafe-time-wrap">
                  <input type="time" className="addcafe-input addcafe-input--time" value={form.jam_buka} onChange={e => handleChange('jam_buka', e.target.value)}/>
                </div>
              </div>
              <div className="addcafe-field">
                <label className="addcafe-label">Jam Tutup</label>
                <div className="addcafe-time-wrap">
                  <input type="time" className="addcafe-input addcafe-input--time" value={form.jam_tutup} onChange={e => handleChange('jam_tutup', e.target.value)}/>
                </div>
              </div>
            </div>
          )}

          <div className="addcafe-field">
            <label className="addcafe-label">Link Google Maps</label>
            <div className="addcafe-input-icon-wrap">
              <span className="addcafe-input-prefix">📍</span>
              <input type="url" className="addcafe-input addcafe-input--icon" placeholder="https://maps.app.goo.gl/..." value={form.link_gmaps} onChange={e => handleChange('link_gmaps', e.target.value)}/>
            </div>
          </div>
        </section>

        {/* ===== DETAIL PROFIL CAFE ===== */}
        <section className="addcafe-section">
          <h2 className="addcafe-section-title">
            <span className="addcafe-section-icon">🏷️</span>
            Detail Profil Cafe
          </h2>

          <div className="addcafe-field">
            <label className="addcafe-label">Kategori / Tag</label>
            <select className="addcafe-input" value={form.kategori} onChange={e => handleChange('kategori', e.target.value)}>
              <option value="">-- Pilih Kategori --</option>
              <option value="Spot WFC">Spot WFC</option>
              <option value="Tempat Nongkrong">Tempat Nongkrong</option>
              <option value="Ngedate Spot">Ngedate Spot</option>
            </select>
          </div>

          <div className="addcafe-field">
            <label className="addcafe-label">Area / Wilayah</label>
            <input type="text" className="addcafe-input" placeholder="Contoh: Purwokerto Utara" value={form.area} onChange={e => handleChange('area', e.target.value)}/>
          </div>

          <div className="addcafe-field">
            <label className="addcafe-label">Keunggulan (pisahkan dengan koma)</label>
            <input type="text" className="addcafe-input" placeholder="Wi-Fi Cepat, Kopi Enak, Instagramable" value={form.keunggulan} onChange={e => handleChange('keunggulan', e.target.value)}/>
          </div>
        </section>

        {/* ===== FOTO UTAMA ===== */}
        <section className="addcafe-section">
          <h2 className="addcafe-section-title">
            <span className="addcafe-section-icon">📸</span>
            Foto Utama
          </h2>
          <p className="addcafe-section-desc">Foto cover yang tampil di kartu dan hero detail cafe.</p>

          <div className="addcafe-foto-utama-wrap">
            {fotoUtamaPreview ? (
              <div className="addcafe-foto-utama-preview">
                <img src={fotoUtamaPreview} alt="Foto Utama" className="addcafe-foto-utama-img"/>
                <button type="button" className="addcafe-gallery-remove" onClick={removeFotoUtama}>×</button>
              </div>
            ) : (
              <label className="addcafe-foto-utama-add">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="#0047AB" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="2" fill="#0047AB"/>
                  <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#0047AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Upload Foto Utama</span>
                <input type="file" accept="image/*" hidden onChange={handleFotoUtama}/>
              </label>
            )}
          </div>
        </section>

        {/* ===== GALERI FOTO ===== */}
        <section className="addcafe-section">
          <h2 className="addcafe-section-title">
            <span className="addcafe-section-icon">🖼️</span>
            Galeri Foto
          </h2>
          <p className="addcafe-section-desc">Foto-foto tambahan yang ditampilkan di halaman detail cafe.</p>

          <div className="addcafe-gallery">
            <label className="addcafe-gallery-add">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#0047AB" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Tambah</span>
              <input type="file" accept="image/*" multiple hidden onChange={handleGaleriAdd}/>
            </label>
            {galeriPreviews.map((img, i) => (
              <div className="addcafe-gallery-item" key={i}>
                <img src={img.url} alt={`Galeri ${i + 1}`} className="addcafe-gallery-img"/>
                <button type="button" className="addcafe-gallery-remove" onClick={() => removeGaleri(i)}>×</button>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PENILAIAN KRITERIA ===== */}
        <section className="addcafe-section">
          <div className="addcafe-section-header-row">
            <h2 className="addcafe-section-title">
              <span className="addcafe-section-icon">⚙️</span>
              Penilaian Kriteria (SAW)
            </h2>
            <span className="addcafe-saw-badge">0 - 100</span>
          </div>
          <p className="addcafe-section-desc">Geser slider untuk menentukan nilai kriteria cafe.</p>

          <div className="addcafe-criteria">
            {CRITERIA.map(c => (
              <div className="addcafe-criteria-row" key={c.key}>
                <div className="addcafe-criteria-top">
                  <span className="addcafe-criteria-icon">{c.icon}</span>
                  <span className="addcafe-criteria-label">{c.label}</span>
                  <span className="addcafe-criteria-value" style={{ color: form[c.key] > 70 ? '#0047AB' : form[c.key] > 40 ? '#B8860B' : '#9CA3AF' }}>
                    {form[c.key]}
                  </span>
                </div>
                <input
                  type="range"
                  min="0" max="100" step="5"
                  value={form[c.key]}
                  onChange={e => handleSlider(c.key, e.target.value)}
                  className="addcafe-range"
                  style={{ '--pct': `${form[c.key]}%` }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ===== SUBMIT ===== */}
        <div className="addcafe-submit-wrap">
          <button type="submit" className="addcafe-submit-btn" disabled={saving}>
            {uploading && saving ? (
              <>
                <span className="addcafe-spinner"/>
                Mengupload foto...
              </>
            ) : saving ? (
              'Menyimpan...'
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M14 2H4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 2v5h8V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="6" y="10" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1"/>
                </svg>
                {isEdit ? 'Update Cafe' : 'Simpan Cafe'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && <div className="addcafe-toast">{toast}</div>}
    </div>
  );
}
