import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchSavedCount, fetchAllUserPrefs } from '../services/api';
import './Profile.css';

// User preference maps and radar removed because we only show actual features

/* ── Guest Locked View ── */
function GuestProfile({ navigate }) {
  return (
    <div className="prof-guest">
      <div className="prof-guest-illustration">
        <img src="/images/locked_feature.png" alt="Fitur Terkunci" className="prof-locked-feature-img" />
      </div>
      <h2 className="prof-guest-title">Masuk untuk Melihat Profilmu</h2>
      <p className="prof-guest-desc">Simpan kafe favorit, lihat riwayat vibe, dan personalisasi pengalamanmu.</p>
      <button className="prof-guest-cta" onClick={() => navigate('/login')}>
        Masuk / Daftar Sekarang
      </button>
    </div>
  );
}

/* ── Main Profile Component ── */
export default function Profile() {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const isLoggedIn = !!token;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [prefsCount, setPrefsCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;
    // Fetch saved count
    fetchSavedCount()
      .then(res => setSavedCount(res.data.count))
      .catch(() => {});
    // Fetch how many categories have preferences set
    fetchAllUserPrefs()
      .then(res => setPrefsCount(res.data.length))
      .catch(() => {});
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="app-page prof-page">
        <GuestProfile navigate={navigate}/>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-page prof-page">
      {/* ===== BANNER + AVATAR ===== */}
      <section className="prof-banner">
        <div className="prof-banner-bg"/>
        <div className="prof-banner-content">
          <div className="prof-avatar">
            <div className="prof-avatar-circle">
              <span className="prof-avatar-initial">
                {(user?.username || 'U')[0].toUpperCase()}
              </span>
            </div>
          </div>
          <h1 className="prof-name">{user?.username || 'Pengguna'}</h1>
          <p className="prof-email">{user?.email || ''}</p>
          <p className="prof-bio">Pecinta Kopi & Penikmat Suasana ✨</p>
        </div>
      </section>

      {/* ===== STATS CARDS ===== */}
      <section className="prof-stats">
        <div className="prof-stat-card" onClick={() => navigate('/saved')} style={{ cursor: 'pointer' }}>
          <span className="prof-stat-icon">❤️</span>
          <span className="prof-stat-value">{savedCount}</span>
          <span className="prof-stat-label">Disimpan</span>
        </div>
        <div className="prof-stat-card" onClick={() => navigate('/preferences')} style={{ cursor: 'pointer' }}>
          <span className="prof-stat-icon">🎛️</span>
          <span className="prof-stat-value">{prefsCount}/3</span>
          <span className="prof-stat-label">Preferensi</span>
        </div>
      </section>

      {/* ===== MENU OPTIONS ===== */}
      <section className="prof-section">
        <h2 className="prof-section-title">
          <span className="prof-section-icon">⚙️</span>
          Pengaturan
        </h2>
        <div className="prof-menu">
          <button className="prof-menu-item" onClick={() => navigate('/settings')}>
            <div className="prof-menu-icon prof-menu-icon--purple">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3.5" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M3 17c0-3.5 3-6 7-6s7 2.5 7 6" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="prof-menu-text">
              <span className="prof-menu-label">Pengaturan Akun</span>
              <span className="prof-menu-desc">Profile, Username, Bio, Password</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="prof-menu-arrow">
              <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="prof-menu-item" onClick={() => navigate('/saved')}>
            <div className="prof-menu-icon prof-menu-icon--red">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="prof-menu-text">
              <span className="prof-menu-label">Kafe Tersimpan</span>
              <span className="prof-menu-desc">Daftar cafe favoritmu</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="prof-menu-arrow">
              <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="prof-menu-item" onClick={() => navigate('/recommendation')}>
            <div className="prof-menu-icon prof-menu-icon--blue">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 15h12M4 10h12M4 5h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="prof-menu-text">
              <span className="prof-menu-label">Riwayat Rekomendasi</span>
              <span className="prof-menu-desc">Lihat hasil SPK sebelumnya</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="prof-menu-arrow">
              <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="prof-menu-item" onClick={() => navigate('/preferences')}>
            <div className="prof-menu-icon prof-menu-icon--yellow">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 5h5M13 5h5M2 10h8M14 10h4M2 15h3M9 15h9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="5" r="2.5" fill="white"/>
                <circle cx="12" cy="10" r="2.5" fill="white"/>
                <circle cx="7" cy="15" r="2.5" fill="white"/>
              </svg>
            </div>
            <div className="prof-menu-text">
              <span className="prof-menu-label">Preferensi Default</span>
              <span className="prof-menu-desc">Atur bobot per kategori: WFC, Nongkrong, Ngedate</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="prof-menu-arrow">
              <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="prof-menu-item prof-menu-item--danger" onClick={() => setShowLogoutConfirm(true)}>
            <div className="prof-menu-icon prof-menu-icon--red">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4H5a2 2 0 00-2 2v8a2 2 0 002 2h2M10 13l3-3-3-3M13 10H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="prof-menu-text">
              <span className="prof-menu-label prof-menu-label--danger">Keluar</span>
              <span className="prof-menu-desc">Logout dari akun NemuVibe</span>
            </div>
          </button>
        </div>
      </section>

      <div style={{ height: 100 }}/>

      {/* ===== LOGOUT CONFIRM MODAL ===== */}
      {showLogoutConfirm && (
        <div className="prof-modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="prof-modal" onClick={e => e.stopPropagation()}>
            <h3 className="prof-modal-title">Keluar dari NemuVibe?</h3>
            <p className="prof-modal-desc">Kamu harus login kembali untuk mengakses fitur premium.</p>
            <div className="prof-modal-actions">
              <button className="prof-modal-btn prof-modal-btn--cancel" onClick={() => setShowLogoutConfirm(false)}>
                Batal
              </button>
              <button className="prof-modal-btn prof-modal-btn--danger" onClick={handleLogout}>
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
