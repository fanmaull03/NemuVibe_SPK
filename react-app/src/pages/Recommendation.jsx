import { useNavigate } from 'react-router-dom';
import { usePreference } from '../context/PreferenceContext';
import './Recommendation.css';

// Removed fallback

const TROPHY = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Recommendation() {
  const navigate = useNavigate();
  const { category, results } = usePreference();

  const catLabel = { wfc: 'WFC', nongkrong: 'Nongkrong', ngedate: 'Ngedate' }[category] ?? category;

  if (!results || results.length === 0) {
    return (
      <div className="app-page">
        <div className="rec-empty">
          <p>Belum ada hasil. Silakan atur preferensi terlebih dahulu.</p>
          <button className="rec-empty-btn" onClick={() => navigate('/profile')}>Kembali ke Profil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page rec-page">
      {/* Header */}
      <header className="rec-header">
        <button className="rec-back-btn" onClick={() => navigate('/profile')} aria-label="Kembali">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5L8 11L14 17" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="rec-header-title">Hasil Rekomendasi</h1>
        <div className="rec-header-spacer"/>
      </header>

      <main className="rec-main">
        {/* Category badge */}
        <div className="rec-cat-row">
          <span className="rec-cat-badge">Vibe: {catLabel}</span>
          <span className="rec-cat-count">{results.length} Kafe</span>
        </div>

        {/* Results list */}
        <div className="rec-list">
          {results.map((cafe, i) => {
            const rank = i + 1;
            const matchPct = Math.round((cafe.skor_akhir ?? 0) * 100);
            const img = cafe.foto_utama;
            const isTop3 = rank <= 3;

            return (
              <article
                key={cafe.id}
                className={`rec-card ${isTop3 ? 'rec-card--top' : ''}`}
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => navigate(`/detail/${cafe.id}`)}
              >
                {/* Rank */}
                <div className={`rec-rank ${isTop3 ? `rec-rank--${rank}` : ''}`}>
                  {isTop3 ? TROPHY[rank] : `#${rank}`}
                </div>

                {/* Image */}
                <div className="rec-thumb">
                  {img ? (
                    <img src={img} alt={cafe.nama} className="rec-img" loading="lazy"/>
                  ) : (
                    <div className="rec-img-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 16l4-4 4 4 4-4 4 4M20 9V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="2" stroke="#9CA3AF" strokeWidth="1.5"/></svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="rec-info">
                  <h3 className="rec-name">{cafe.nama}</h3>
                  <div className="rec-meta">
                    <span className="rec-score-tag">⭐ {cafe.skor_akhir}</span>
                  </div>
                </div>

                {/* Match % */}
                <div className={`rec-match ${isTop3 ? `rec-match--${rank}` : ''}`}>
                  <span className="rec-match-val">{matchPct}%</span>
                  <span className="rec-match-label">Match</span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="rec-actions">
          <button className="rec-action-btn rec-action-btn--outline" onClick={() => navigate(-1)}>
            Ubah Preferensi
          </button>
          <button className="rec-action-btn rec-action-btn--primary" onClick={() => navigate('/profile')}>
            Kembali ke Profil
          </button>
        </div>
      </main>
    </div>
  );
}
