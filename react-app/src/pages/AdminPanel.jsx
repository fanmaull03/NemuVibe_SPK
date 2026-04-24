import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchAllCafes, deleteCafe, fetchAllWeights, updateWeights } from '../services/api';
import './AdminPanel.css';

// Fallback array custom icon removed

export default function AdminPanel() {
  const navigate = useNavigate();
  const { token, user, isAdmin, logout } = useContext(AuthContext);
  const [cafes, setCafes] = useState([]);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState('');

  // Redirect jika bukan admin
  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/login', { replace: true });
    }
  }, [token, isAdmin]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cafeRes, weightRes] = await Promise.all([
        fetchAllCafes(),
        fetchAllWeights(),
      ]);
      setCafes(cafeRes.data);
      setWeights(weightRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCafe(deleteId);
      setCafes(prev => prev.filter(c => c.id !== deleteId));
      showToast('Cafe berhasil dihapus');
    } catch {
      showToast('Gagal menghapus cafe');
    } finally {
      setDeleteId(null);
    }
  };

  const handleWeightChange = (idx, field, val) => {
    setWeights(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: parseFloat(val) || 0 };
      return next;
    });
  };

  const handleSaveWeights = async (w) => {
    try {
      await updateWeights(w.nama_kategori, {
        w1_digital: w.w1_digital,
        w2_harga: w.w2_harga,
        w3_suasana: w.w3_suasana,
        w4_tenang: w.w4_tenang,
        w5_hiburan: w.w5_hiburan,
        w6_rasa: w.w6_rasa,
      });
      showToast(`Bobot "${w.nama_kategori}" tersimpan!`);
    } catch {
      showToast('Gagal menyimpan bobot');
    }
  };

  const getWeightTotal = (w) => {
    return (w.w1_digital + w.w2_harga + w.w3_suasana + w.w4_tenang + w.w5_hiburan + w.w6_rasa).toFixed(2);
  };

  const CAT_LABELS = { wfc: 'Work From Cafe (WFC)', nongkrong: 'Nongkrong Santai', ngedate: 'Date / Romantic' };
  const CAT_ICONS  = { wfc: '💻', nongkrong: '👥', ngedate: '💝' };
  const FIELDS = [
    { key: 'w1_digital', label: 'Digital' },
    { key: 'w2_harga',   label: 'Harga' },
    { key: 'w3_suasana', label: 'Suasana' },
    { key: 'w4_tenang',  label: 'Tenang' },
    { key: 'w5_hiburan', label: 'Hiburan' },
    { key: 'w6_rasa',    label: 'Rasa' },
  ];

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
        <button className="admin-logout-btn" onClick={() => { logout(); navigate('/'); }} aria-label="Logout">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4H5a2 2 0 00-2 2v8a2 2 0 002 2h2M10 13l3-3-3-3M13 10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <main className="admin-main">
        {/* ===== KELOLA DATA CAFE ===== */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Kelola Data Cafe</h2>
            <span className="admin-count">Total: {cafes.length}</span>
          </div>

          {loading ? (
            <div className="admin-skeleton-list">
              {[1, 2, 3].map(i => (
                <div className="admin-skeleton-card" key={i}>
                  <div className="admin-skeleton-img shimmer"/>
                  <div className="admin-skeleton-text">
                    <div className="admin-skeleton-line shimmer" style={{ width: '60%' }}/>
                    <div className="admin-skeleton-line shimmer" style={{ width: '80%' }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-cafe-list">
              {cafes.map(cafe => {
                const img = cafe.foto_utama;
                return (
                  <div className="admin-cafe-card" key={cafe.id}>
                    {img ? (
                      <img src={img} alt={cafe.nama} className="admin-cafe-img" loading="lazy"/>
                    ) : (
                      <div className="admin-cafe-img-placeholder">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 16l4-4 4 4 4-4 4 4M20 9V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="2" stroke="#9CA3AF" strokeWidth="2"/></svg>
                      </div>
                    )}
                    <div className="admin-cafe-info">
                      <h3 className="admin-cafe-name">{cafe.nama}</h3>
                      <p className="admin-cafe-addr">{(cafe.alamat || 'Purwokerto').substring(0, 35)}...</p>
                    </div>
                    <div className="admin-cafe-actions">
                      <button className="admin-icon-btn admin-icon-btn--edit" onClick={() => navigate(`/admin/edit/${cafe.id}`)} aria-label="Edit">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--delete" onClick={() => setDeleteId(cafe.id)} aria-label="Hapus">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 4l1 10h8l1-10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ===== BOBOT GLOBAL ===== */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title admin-section-title--gold">Pengaturan Bobot Global</h2>
          </div>
          <p className="admin-section-desc">Sesuaikan bobot kriteria untuk perhitungan SPK metode SAW.</p>

          {weights.map((w, idx) => {
            const total = getWeightTotal(w);
            const isValid = Math.abs(parseFloat(total) - 1) < 0.05;
            return (
              <div className="admin-weight-group" key={w.id || idx}>
                <div className="admin-weight-header">
                  <span className="admin-weight-cat-label">{CAT_LABELS[w.nama_kategori] || w.nama_kategori}</span>
                  <span className={`admin-weight-total ${isValid ? '' : 'admin-weight-total--warn'}`}>
                    {total}
                  </span>
                </div>
                {FIELDS.map(f => (
                  <div className="admin-weight-row" key={f.key}>
                    <span className="admin-weight-field-icon">{CAT_ICONS[w.nama_kategori] || '⚙️'}</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={w[f.key]}
                      onChange={e => handleWeightChange(idx, f.key, e.target.value)}
                      className="admin-weight-input"
                    />
                    <span className="admin-weight-field-label">{f.label}</span>
                  </div>
                ))}
                <button className="admin-save-weight-btn" onClick={() => handleSaveWeights(w)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 2v4h6V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <rect x="5" y="9" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                  Simpan Perubahan
                </button>
              </div>
            );
          })}
        </section>

        <div style={{ height: 100 }}/>
      </main>

      {/* FAB */}
      <button className="admin-fab" onClick={() => navigate('/admin/add')} aria-label="Tambah Cafe">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3 className="admin-modal-title">Hapus Cafe?</h3>
            <p className="admin-modal-desc">Data cafe ini akan dihapus permanen dari database.</p>
            <div className="admin-modal-actions">
              <button className="admin-modal-btn admin-modal-btn--cancel" onClick={() => setDeleteId(null)}>Batal</button>
              <button className="admin-modal-btn admin-modal-btn--danger" onClick={handleDelete}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
