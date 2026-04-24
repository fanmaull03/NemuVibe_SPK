import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchSaved, saveToggle } from '../services/api';
import './Saved.css';

// Removed Inline SVG LockedIllustration

export default function Saved() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchSaved();
        setCafes(res.data);
      } catch (err) {
        console.error('Gagal memuat cafe tersimpan:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isLoggedIn]);

  const handleUnsave = async (cafeId) => {
    try {
      await saveToggle(cafeId);
      setCafes(prev => prev.filter(c => c.id !== cafeId));
    } catch (err) {
      console.error('Gagal menghapus simpanan:', err);
    }
  };

  /* ─── GUEST MODE ─── */
  if (!isLoggedIn) {
    return (
      <div className="app-page">
        {/* Mini header with logo */}
        <header className="locked-header">
          <div className="locked-header-brand">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#0047AB"/>
              <path d="M14 6C10.134 6 7 9.134 7 13c0 2.76 1.6 5.14 3.92 6.28L14 22l3.08-2.72C19.4 18.14 21 15.76 21 13c0-3.866-3.134-7-7-7z" fill="#FFD700"/>
              <circle cx="14" cy="13" r="2.5" fill="#0047AB"/>
            </svg>
            <span className="locked-header-text">NemuVibe</span>
          </div>
        </header>

        <main className="locked-main">
          {/* Illustration */}
          <div className="locked-illustration-wrap">
            <img src="/images/locked_feature.png" alt="Fitur Terkunci" className="locked-feature-img" />
          </div>

          {/* Message */}
          <div className="locked-content">
            <h1 className="locked-headline">
              Ssttt... Fitur ini<br/>Masih Terkunci!
            </h1>
            <p className="locked-desc">
              Simpan cafe favorit dan atur prioritas vibe kamu dengan masuk ke akun NemuVibe.
            </p>

            {/* CTA Button */}
            <button
              className="locked-cta-btn"
              onClick={() => navigate('/login')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="4" y="7" width="10" height="9" rx="2" stroke="#1a1200" strokeWidth="1.8" fill="none"/>
                <path d="M6.5 7V5.5a2.5 2.5 0 015 0V7" stroke="#1a1200" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              </svg>
              <span>Masuk / Daftar Sekarang</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ─── LOGGED-IN MODE ─── */
  return (
    <div className="app-page">
      <header className="saved-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5L8 11L14 17" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="saved-header-title">Kafe Tersimpan</h1>
        <div className="header-spacer"/>
      </header>

      <main className="saved-main">
        <div className="saved-welcome">
          <span className="saved-avatar">👤</span>
          <span className="saved-username">Hei, {user?.username}!</span>
        </div>

        {loading ? (
          <div className="saved-empty-state saved-empty-state--inner">
            <p style={{ color: '#6B7280' }}>Memuat data...</p>
          </div>
        ) : cafes.length === 0 ? (
          <div className="saved-empty-state saved-empty-state--inner">
            <div className="saved-heart-icon">❤️</div>
            <h2 className="saved-empty-title">Belum ada kafe tersimpan</h2>
            <p className="saved-empty-desc">Jelajahi rekomendasi dan simpan kafe favoritmu di sini.</p>
            <button className="saved-explore-btn" onClick={() => navigate('/')}>
              Kembali ke Beranda
            </button>
          </div>
        ) : (
          <div className="saved-list">
            {cafes.map((cafe, i) => (
              <div
                className="saved-card"
                key={cafe.id}
                style={{ animation: `cardSlideIn 0.4s ease-out ${i * 0.07}s backwards` }}
              >
                <div className="saved-card-img-wrap" onClick={() => navigate(`/detail/${cafe.id}`)}>
                  {cafe.foto_utama ? (
                    <img src={cafe.foto_utama} alt={cafe.nama} className="saved-card-img" loading="lazy"/>
                  ) : (
                    <div className="saved-card-no-img">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 16l4-4 4 4 4-4 4 4M20 9V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="2" stroke="#9CA3AF" strokeWidth="1.5"/></svg>
                    </div>
                  )}
                </div>
                <div className="saved-card-body" onClick={() => navigate(`/detail/${cafe.id}`)}>
                  <h3 className="saved-card-name">{cafe.nama}</h3>
                  <p className="saved-card-address">📍 {cafe.alamat || 'Alamat tidak tersedia'}</p>
                  {cafe.kategori && <span className="saved-card-tag">{cafe.kategori}</span>}
                </div>
                <button className="saved-card-remove" onClick={() => handleUnsave(cafe.id)} aria-label="Hapus dari simpanan">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 17s-7-4.5-7-10a4.5 4.5 0 019 0 4.5 4.5 0 019 0c0 5.5-7 10-7 10h-4z" fill="#E91E63" stroke="#E91E63" strokeWidth="1.5"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
