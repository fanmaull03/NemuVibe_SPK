import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CafeCard from '../components/CafeCard';
import { fetchAllCafes } from '../services/api';
import './Home.css';

const VIBE_CARDS = [
  {
    id: 'wfc', label: 'WFC',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="13" rx="2" stroke="#0047AB" strokeWidth="2" fill="none"/>
        <path d="M8 22h12" stroke="#0047AB" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 19v3" stroke="#0047AB" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'nongkrong', label: 'Nongkrong',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 12h12v2a6 6 0 01-6 6h0a6 6 0 01-6-6v-2z" stroke="#B8860B" strokeWidth="2" fill="none"/>
        <path d="M18 13h1a3 3 0 010 6h-1" stroke="#B8860B" strokeWidth="2" fill="none"/>
        <path d="M8 22h8" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 7c0-2 1.5-2 1.5-4M12 7c0-2 1.5-2 1.5-4M15 7c0-2 1.5-2 1.5-4" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'ngedate', label: 'Ngedate',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 24s-7-5-7-10.5a4.5 4.5 0 019 0 4.5 4.5 0 019 0C25 19 14 24 14 24z" fill="#FCE4EC"/>
        <path d="M14 23s-6-4.5-6-9.5a3.8 3.8 0 017.6 0h0a3.8 3.8 0 017.6 0c0 5-6 9.5-6 9.5" fill="none" stroke="#E91E63" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;
  const [cafes, setCafes]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const loadAllCafes = useCallback(async () => {
    setLoading(true);
    setError(false);
    setCafes([]);
    try {
      const res = await fetchAllCafes();
      setCafes(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllCafes();
  }, [loadAllCafes]);

  // Klik Vibe Card → cek login dulu, tampilkan modal jika guest 
  const handleVibeClick = useCallback((id) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/preferences/${id}`);
  }, [navigate, isLoggedIn]);

  // Filter local for Home
  const filteredCafes = searchQuery.trim()
    ? cafes.filter(c => c.nama.toLowerCase().includes(searchQuery.toLowerCase()))
    : cafes;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="app-page">
      <Navbar/>

      <main className="main-content" id="main-content">
        {/* ── Hero ── */}
        <section className="hero-section" id="hero-section">
          <h1 className="hero-headline">
            Pilih Vibe-mu,<br/>
            <span className="hero-headline-accent">Temukan Tempatmu.</span>
          </h1>
          <p className="hero-subtitle">Rekomendasi kafe terbaik di sekitar Purwokerto.</p>

          {/* Search Bar */}
          <form className="search-bar" id="search-bar" onSubmit={handleSearchSubmit}>
            <button type="submit" style={{ background:'none', border:'none', padding:0, margin:0, display:'flex', cursor:'pointer' }}>
              <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="6" stroke="#9CA3AF" strokeWidth="2"/>
                <path d="M13 13L18 18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <input
              type="text"
              className="search-input"
              id="search-input"
              placeholder="Cari kafe, kopi, atau vibe..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="button" className="search-filter-btn" id="search-filter-btn" aria-label="Filter">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4h14M5 9h8M7 14h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </form>
        </section>

        {/* ── Vibe Cards → navigasi ke /preferences ── */}
        <section className="vibe-section" id="vibe-section">
          <h2 className="section-label">Mau ngapain hari ini?</h2>
          <div className="vibe-cards">
            {VIBE_CARDS.map(v => (
              <button
                key={v.id}
                id={`vibe-${v.id}`}
                className="vibe-card"
                data-category={v.id}
                onClick={() => handleVibeClick(v.id)}
              >
                <div className={`vibe-icon vibe-icon--${v.id}`}>{v.icon}</div>
                <span className="vibe-label">{v.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Daftar Kafe Tersedia (katalog, tanpa filter kategori) ── */}
        <section className="reco-section" id="reco-section">
          <div className="reco-header">
            <h2 className="section-title">Daftar Kafe Tersedia</h2>
            <button className="see-all-btn" id="see-all-btn" onClick={() => navigate('/ranking')}>
              Lihat Semua
            </button>
          </div>

          {loading && (
            <div className="reco-loading" id="reco-loading">
              {[1, 2, 3].map(i => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton-image shimmer"/>
                  <div className="skeleton-body">
                    <div className="skeleton-line skeleton-line--title shimmer"/>
                    <div className="skeleton-line skeleton-line--text shimmer"/>
                    <div className="skeleton-line skeleton-line--tags shimmer"/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="reco-error" id="reco-error">
              <p>⚠️ Gagal memuat data.{' '}
                <button className="retry-btn" id="retry-btn" onClick={loadAllCafes}>
                  Coba Lagi
                </button>
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="reco-list" id="reco-list">
              {filteredCafes.map((cafe, i) => (
                <CafeCard key={cafe.id} cafe={cafe} index={i} category=""/>
              ))}
            </div>
          )}
        </section>

        <div className="bottom-spacer"/>
      </main>

      {/* Modal Wajib Login */}
      {showLoginModal && (
        <div className="home-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="home-modal" onClick={e => e.stopPropagation()}>
            <div className="home-modal-icon">🔒</div>
            <h3 className="home-modal-title">Akses Terbatas</h3>
            <p className="home-modal-desc">
              Silakan login terlebih dahulu untuk mengatur preferensi dan mencari Vibe kafe personal-mu!
            </p>
            <div className="home-modal-actions">
              <button className="home-modal-btn home-modal-btn--cancel" onClick={() => setShowLoginModal(false)}>
                Batal
              </button>
              <button className="home-modal-btn home-modal-btn--primary" onClick={() => navigate('/login')}>
                Login Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
