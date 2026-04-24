import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RadarChart from '../components/RadarChart';
import { usePreference } from '../context/PreferenceContext';
import { AuthContext } from '../context/AuthContext';
import { fetchCafeDetail, checkSaved, saveToggle } from '../services/api';
import './CafeDetail.css';

// Fallback images removed

/* Fallback highlights berdasarkan kategori */
const HIGHLIGHTS_MAP = {
  'Spot WFC':         [
    { icon: '📶', label: 'Wi-Fi Super Cepat' },
    { icon: '🔌', label: 'Banyak Stop Kontak' },
    { icon: '❄️', label: 'AC Dingin' },
    { icon: '💺', label: 'Kursi Ergonomis' },
  ],
  'Tempat Nongkrong': [
    { icon: '🎵', label: 'Live Music' },
    { icon: '🎮', label: 'Board Games' },
    { icon: '☕', label: 'Kopi Enak' },
    { icon: '📸', label: 'Instagramable' },
  ],
  'Ngedate Spot':     [
    { icon: '🕯️', label: 'Suasana Romantis' },
    { icon: '📸', label: 'Spot Foto' },
    { icon: '🍰', label: 'Dessert Spesial' },
    { icon: '🌿', label: 'Outdoor Asri' },
  ],
};

const CRITERIA_LABELS = ['Digital', 'Harga', 'Estetika', 'Tenang', 'Hiburan', 'Rasa'];

export default function CafeDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { hasSetPreferences } = usePreference();
  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  const [cafe, setCafe]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);
  const [liked, setLiked]   = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetchCafeDetail(id);
        setCafe(res.data);
        // Cek apakah cafe ini sudah disimpan user
        if (token) {
          try {
            const savedRes = await checkSaved(id);
            setLiked(savedRes.data.saved);
          } catch { /* ignore if not logged in */ }
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  // === Data dinamis dari database ===
  const tag = cafe?.kategori || 'Tempat Nongkrong';
  const areaLabel = cafe?.area || 'Purwokerto';
  const heroImg = cafe?.foto_utama || null;

  // Parse keunggulan dari string koma-separated menjadi array
  const highlights = cafe?.keunggulan
    ? cafe.keunggulan.split(',').map(k => k.trim()).filter(Boolean).map(k => ({ icon: '✨', label: k }))
    : (HIGHLIGHTS_MAP[tag] ?? HIGHLIGHTS_MAP['Tempat Nongkrong']);

  // Parse galeri dari string koma-separated menjadi array
  const galleryImages = cafe?.galeri
    ? cafe.galeri.split(',').map(g => g.trim()).filter(Boolean)
    : [];

  // Hitung match % HANYA jika user sudah set preferensi
  const matchPct = (cafe && hasSetPreferences) ? (() => {
    if (cafe.skor_akhir) return Math.round(cafe.skor_akhir * 100);
    const scores = [cafe.c1_digital, cafe.c2_harga, cafe.c3_suasana, cafe.c4_tenang, cafe.c5_hiburan, cafe.c6_rasa].filter(Boolean);
    return scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 5)) * 100) : 0;
  })() : 0;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleSaveToggle = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    try {
      const res = await saveToggle(id);
      setLiked(res.data.saved);
    } catch (err) {
      console.error('Gagal toggle simpan:', err);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: cafe?.nama,
        text: `Lihat kafe ${cafe?.nama} di NemuVibe!`,
        url: window.location.href,
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link disalin ke clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="app-page">
        <div className="cd-loading">
          <div className="skeleton-image shimmer" style={{ width:'100%', height:280 }}/>
          <div style={{ padding: 20 }}>
            <div className="skeleton-line skeleton-line--title shimmer" style={{ marginBottom:12 }}/>
            <div className="skeleton-line skeleton-line--text shimmer" style={{ marginBottom:8 }}/>
            <div className="skeleton-line skeleton-line--tags shimmer"/>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (!loading && error) {
    return (
      <div className="app-page">
        <div className="cd-error">
          <p>⚠️ Gagal memuat detail kafe.</p>
          <button className="cd-error-btn" onClick={() => navigate(-1)}>← Kembali</button>
        </div>
      </div>
    );
  }
  /* ── No data ── */
  if (!cafe) return null;

  return (
    <div className="app-page cd-page">

      {/* ===== HERO COVER ===== */}
      <section className="cd-hero">
        {heroImg ? (
          <img src={heroImg} alt={cafe.nama} className="cd-hero-img"/>
        ) : (
          <div className="cd-hero-no-image">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M4 16l4-4 4 4 4-4 4 4M20 9V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="2" stroke="#9CA3AF" strokeWidth="1.5"/></svg>
            <span>Tidak Ada Foto Utama</span>
          </div>
        )}
        <div className="cd-hero-gradient"/>

        {/* Floating header buttons */}
        <div className="cd-hero-topbar">
          <button className="cd-icon-btn cd-icon-btn--glass" onClick={handleBack} aria-label="Kembali">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="cd-hero-actions">
            <button className="cd-icon-btn cd-icon-btn--glass" onClick={handleShare} aria-label="Bagikan">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="14" cy="4" r="2.5" stroke="white" strokeWidth="1.5"/>
                <circle cx="4" cy="9" r="2.5" stroke="white" strokeWidth="1.5"/>
                <circle cx="14" cy="14" r="2.5" stroke="white" strokeWidth="1.5"/>
                <path d="M6.3 7.8L11.7 5.2M6.3 10.2L11.7 12.8" stroke="white" strokeWidth="1.5"/>
              </svg>
            </button>
            <button
              className={`cd-icon-btn cd-icon-btn--glass ${liked ? 'cd-icon-btn--liked' : ''}`}
              aria-label="Simpan"
              onClick={handleSaveToggle}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 17s-7-4.5-7-10a4.5 4.5 0 019 0 4.5 4.5 0 019 0c0 5.5-7 10-7 10h-4z"
                  fill={liked ? '#E91E63' : 'none'}
                  stroke={liked ? '#E91E63' : 'white'}
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Badge + Cafe name on cover */}
        <div className="cd-hero-info">
          <div className="cd-hero-badges">
            <span className="cd-tag-badge">{tag.toUpperCase()}</span>
            <span className="cd-loc-badge">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1C3.34 1 2 2.34 2 4c0 2.25 3 5 3 5s3-2.75 3-5c0-1.66-1.34-3-3-3z" fill="white"/>
                <circle cx="5" cy="4" r="1" fill="#0047AB"/>
              </svg>
              {areaLabel}
            </span>
          </div>
          <h1 className="cd-hero-name">{cafe.nama}</h1>
          <div className="cd-hero-meta">
            <span className="cd-status cd-status--open">● Buka</span>
            <span className="cd-meta-sep">•</span>
            <span>
              {cafe.buka_24_jam || (cafe.jam_buka === '00:00' && cafe.jam_tutup === '00:00') 
                ? '24 Jam' 
                : `Tutup ${cafe.jam_tutup || 'Malam'}`}
            </span>
            <span className="cd-meta-sep">•</span>
            <span>$$</span>
          </div>
        </div>
      </section>

      {/* ===== VIBE ANALYSIS CARD ===== */}
      <section className="cd-vibe-card">
        <div className="cd-vibe-header">
          <div>
            <h2 className="cd-vibe-title">Analisis Vibe</h2>
            <p className="cd-vibe-sub">Profil kriteria cafe ini</p>
          </div>
          {hasSetPreferences && (
            <div className="cd-match-score">
              <span className="cd-match-number">{matchPct}<small>%</small></span>
              <span className="cd-match-label">SKOR COCOK</span>
            </div>
          )}
        </div>
        <div className="cd-chart-wrap">
          <RadarChart cafe={cafe}/>
        </div>
        {!hasSetPreferences && (
          <p className="cd-vibe-hint">
            💡 Atur preferensi vibe kamu di Beranda untuk melihat skor kecocokan personal!
          </p>
        )}
      </section>

      {/* ===== HIGHLIGHTS / KEUNGGULAN ===== */}
      <section className="cd-section">
        <h3 className="cd-section-title">
          <span className="cd-section-icon">✨</span>
          Keunggulan
        </h3>
        <div className="cd-highlights">
          {highlights.map(h => (
            <span className="cd-highlight-chip" key={h.label}>
              <span className="cd-chip-icon">{h.icon}</span>
              {h.label}
            </span>
          ))}
        </div>
      </section>

      {/* ===== DETAIL SKOR KRITERIA ===== */}
      <section className="cd-section">
        <h3 className="cd-section-title">
          <span className="cd-section-icon">📊</span>
          Detail Skor Kriteria
        </h3>
        <div className="cd-criteria-bars">
          {CRITERIA_LABELS.map((label, i) => {
            const keys = ['c1_digital','c2_harga','c3_suasana','c4_tenang','c5_hiburan','c6_rasa'];
            const colors = ['#0047AB','#10B981','#E91E63','#8B5CF6','#4F46E5','#F59E0B'];
            const score = cafe[keys[i]] ?? 0;
            const pct = (score / 5) * 100;
            return (
              <div className="cd-bar-item" key={label}>
                <div className="cd-bar-top">
                  <span className="cd-bar-label">{label}</span>
                  <span className="cd-bar-score" style={{ color: colors[i] }}>{score}/5</span>
                </div>
                <div className="cd-bar-track">
                  <div className="cd-bar-fill" style={{ width: `${pct}%`, background: colors[i] }}/>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== GALERI ===== */}
      {galleryImages.length > 0 && (
        <section className="cd-section">
          <div className="cd-section-row">
            <h3 className="cd-section-title">
              <span className="cd-section-icon">🖼️</span>
              Galeri
            </h3>
            <span className="cd-gallery-tag">Validasi: Estetika</span>
          </div>
          <div className="cd-gallery">
            {galleryImages.map((src, i) => (
              <div className="cd-gallery-item" key={i}>
                <img src={src} alt={`Galeri ${i + 1}`} className="cd-gallery-img" loading="lazy"/>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== JAM OPERASIONAL ===== */}
      <section className="cd-section">
        <h3 className="cd-section-title">
          <span className="cd-section-icon">🕐</span>
          Jam Operasional
        </h3>
        <div className="cd-hours">
          <div className="cd-hour-row cd-hour-row--today">
            <span className="cd-hour-day">Senin - Minggu (Setiap Hari)</span>
            <span className="cd-hour-time">
              {cafe.buka_24_jam || (cafe.jam_buka === '00:00' && cafe.jam_tutup === '00:00') 
                ? 'Buka 24 Jam' 
                : `${cafe.jam_buka || '--:--'} - ${cafe.jam_tutup || '--:--'}`}
            </span>
          </div>
        </div>
      </section>

      {/* ===== LOKASI ===== */}
      <section className="cd-section cd-section--last">
        <h3 className="cd-section-title">
          <span className="cd-section-icon">📍</span>
          Lokasi
        </h3>
        <div className="cd-location-card">
          <div className="cd-loc-pin">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#0047AB"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          </div>
          <div className="cd-loc-text">
            <p className="cd-loc-address">
              {cafe.alamat || 'Alamat tidak tersedia'}
            </p>
          </div>
        </div>
        <a className="cd-maps-btn" href={cafe.link_gmaps || '#'} target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" fill="#EA4335"/>
            <circle cx="8" cy="6" r="1.8" fill="white"/>
          </svg>
          Buka di Google Maps
        </a>
      </section>

      {/* ===== BOTTOM ACTION BAR ===== */}
      <div className="cd-bottom-bar">
        <a className="cd-action-btn cd-action-btn--route" href={cafe.link_gmaps || '#'} target="_blank" rel="noopener noreferrer">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 15L15 3M15 3H7M15 3V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Rute Arah
        </a>
        <button
          className={`cd-action-btn cd-action-btn--save ${liked ? 'cd-action-btn--saved' : ''}`}
          onClick={handleSaveToggle}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 15.5s-6-4-6-8.5a3.8 3.8 0 017.6 0h0a3.8 3.8 0 017.6 0c0 4.5-6 8.5-6 8.5h-3.2z"
              fill={liked ? 'white' : 'none'}
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          {liked ? 'Tersimpan' : 'Simpan'}
        </button>
      </div>

      {/* Bottom spacer for action bar */}
      <div style={{ height: 100 }}/>

      {/* Modal Wajib Login */}
      {showLoginModal && (
        <div className="cd-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="cd-modal" onClick={e => e.stopPropagation()}>
            <div className="cd-modal-icon">🔒</div>
            <h3 className="cd-modal-title">Akses Terbatas</h3>
            <p className="cd-modal-desc">
              Silakan masuk dengan akun terdaftarmu terlebih dahulu untuk bisa menyimpan kafe ini.
            </p>
            <div className="cd-modal-actions">
              <button className="cd-modal-btn cd-modal-btn--cancel" onClick={() => setShowLoginModal(false)}>
                Batal
              </button>
              <button className="cd-modal-btn cd-modal-btn--primary" onClick={() => navigate('/login')}>
                Login Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
