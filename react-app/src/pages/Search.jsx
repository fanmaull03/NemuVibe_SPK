import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CafeCard from '../components/CafeCard';
import { fetchAllCafes } from '../services/api';
import './Search.css';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetchAllCafes(initialQuery);
        let data = res.data;
        // Fallback filter lokal jika backend belum direstart dan mengembalikan seluruh data
        if (initialQuery) {
          const lowerQ = initialQuery.toLowerCase();
          data = data.filter(c => c.nama.toLowerCase().includes(lowerQ));
        }
        setResults(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    // Minimal debounce for smooth UX or if initialQuery changes
    if (initialQuery.trim()) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="app-page search-page">
      <header className="search-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5L8 11L14 17" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <form className="search-header-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-header-input"
            placeholder="Cari kafe, kopi, atau vibe..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button type="button" className="search-clear-btn" onClick={() => { setSearchQuery(''); setSearchParams({}); }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </form>
      </header>

      <main className="search-main">
        <div className="search-results-meta">
          {initialQuery ? (
            <p>Menampilkan hasil untuk <strong>"{initialQuery}"</strong></p>
          ) : (
            <p>Tuliskan nama cafe untuk dicari...</p>
          )}
        </div>

        {loading ? (
          <div className="search-loading">
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
        ) : error ? (
          <div className="search-empty">
            <p>⚠️ Gagal memuat data pencarian.</p>
          </div>
        ) : results.length > 0 ? (
          <div className="search-list">
            {results.map((cafe, i) => (
              <CafeCard key={cafe.id} cafe={cafe} index={i} category=""/>
            ))}
          </div>
        ) : initialQuery ? (
          <div className="search-empty">
            <div className="search-empty-icon">🔍</div>
            <h3>Kafe tidak ditemukan</h3>
            <p>Coba gunakan kata kunci lain untuk menemukan apa yang kamu cari.</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
