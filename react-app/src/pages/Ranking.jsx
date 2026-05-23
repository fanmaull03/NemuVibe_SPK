import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecommend } from '../services/api';
import './Ranking.css';

const TABS = ['semua', 'wfc', 'nongkrong', 'ngedate'];

const TROPHY_COLORS = {
  1: { fill: '#FFD700', stroke: '#DAA520' },
  2: { fill: '#C0C0C0', stroke: '#A9A9A9' },
  3: { fill: '#CD7F32', stroke: '#A0522D' },
};

// Removed fallback

function TrophySvg({ rank }) {
  const c = TROPHY_COLORS[rank];
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d={`M5 3h12v4a6 6 0 01-6 6h0a6 6 0 01-6-6V3z`} fill={c.fill} stroke={c.stroke} strokeWidth="1.2"/>
      <path d="M5 5H3a2 2 0 000 4h2" stroke={c.stroke} strokeWidth="1.2" fill="none"/>
      <path d="M17 5h2a2 2 0 010 4h-2" stroke={c.stroke} strokeWidth="1.2" fill="none"/>
      <path d="M8 16h6" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 19h8" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 13v3" stroke={c.stroke} strokeWidth="1.5"/>
    </svg>
  );
}

export default function Ranking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState('semua');
  const [cafes, setCafes]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(false);
      try {
        if (activeTab === 'semua') {
          const [wfc, nong, date] = await Promise.all([
            fetchRecommend('wfc'),
            fetchRecommend('nongkrong'),
            fetchRecommend('ngedate'),
          ]);
          // Merge & pick best score per cafe
          const map = {};
          [...wfc.data, ...nong.data, ...date.data].forEach(c => {
            if (!map[c.id] || c.skor_akhir > map[c.id].skor_akhir) map[c.id] = c;
          });
          const sorted = Object.values(map).sort((a, b) => b.skor_akhir - a.skor_akhir);
          setCafes(sorted.slice(0, 10));
        } else {
          const res = await fetchRecommend(activeTab);
          setCafes(res.data.slice(0, 10));
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(key => key + 1);
  };
  return (
    <div className="app-page">
      {/* Header */}
      <header className="ranking-header" id="ranking-header">
        <button className="back-btn" id="back-btn" aria-label="Kembali" onClick={() => navigate(-1)}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5L8 11L14 17" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="ranking-header-title">Peringkat Kafe</h1>
        <div className="header-spacer"/>
      </header>

      <main className="ranking-main" id="ranking-main">
        {/* Tabs */}
        <section className="category-tabs-wrap" id="category-tabs">
          <div className="category-tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`cat-tab${activeTab === t ? ' cat-tab--active' : ''}`}
                data-cat={t}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Subheader */}
        <section className="ranking-subheader">
          <h2 className="ranking-subtitle">Peringkat Global</h2>
          <div className="ranking-actions">
            <span className="ranking-badge-info">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 3.5h12M4 8h8M6 12.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Berdasarkan bobot admin
            </span>
            <button
              type="button"
              className="filter-advanced-btn"
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh ranking"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 3.5v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.2 7.5a5.5 5.5 0 10-1.1 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Refresh
            </button>
          </div>
        </section>

        {/* List */}
        <section className="ranking-list" id="ranking-list">
          {loading && (
            <div className="reco-loading">
              {[1,2,3,4,5].map(i => (
                <div className="skeleton-card" key={i} style={{ display:'flex', gap:12, padding:14 }}>
                  <div className="skeleton-image shimmer" style={{ width:64, height:64, borderRadius:12, flexShrink:0 }}/>
                  <div className="skeleton-body" style={{ flex:1, padding:0 }}>
                    <div className="skeleton-line skeleton-line--title shimmer"/>
                    <div className="skeleton-line skeleton-line--text shimmer"/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="reco-error" style={{ padding:'40px 20px', textAlign:'center', color:'var(--gray-500)' }}>
              ⚠️ Gagal memuat data ranking.
            </div>
          )}

          {!loading && !error && cafes.map((cafe, i) => {
            const rank = i + 1;
            const isTop3 = rank <= 3;
            const img = cafe.foto_utama;

            return (
              <article
                key={cafe.id}
                className={`rank-card${isTop3 ? ' rank-card--top' : ''}`}
                id={`rank-${rank}`}
                data-rank={rank}
                onClick={() => navigate(`/detail/${cafe.id}`)}
                style={{ cursor:'pointer' }}
              >
                {isTop3 ? (
                  <div className={`rank-trophy rank-trophy--${rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze'}`}>
                    <TrophySvg rank={rank}/>
                  </div>
                ) : (
                  <div className={`rank-number rank-number--${rank}`}>
                    <span>#{rank}</span>
                  </div>
                )}

                <div className="rank-thumb">
                  {img ? (
                    <img src={img} alt={cafe.nama} className="rank-img" loading="lazy"/>
                  ) : (
                    <div className="rank-img-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 16l4-4 4 4 4-4 4 4M20 9V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="2" stroke="#9CA3AF" strokeWidth="1.5"/></svg>
                    </div>
                  )}
                </div>

                <div className="rank-info">
                  <h3 className="rank-name">{cafe.nama}</h3>
                  {cafe.alamat && (
                    <p className="rank-addr">📍 {cafe.alamat.substring(0, 40)}{cafe.alamat.length > 40 ? '...' : ''}</p>
                  )}
                  <div className="rank-tags">
                    {cafe.kategori && <span className="rank-tag">{cafe.kategori}</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <div className="bottom-spacer"/>
      </main>
    </div>
  );
}
