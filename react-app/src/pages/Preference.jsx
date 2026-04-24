import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePreference } from '../context/PreferenceContext';
import { AuthContext } from '../context/AuthContext';
import { fetchUserPref, saveUserPref, fetchAllUserPrefs } from '../services/api';
import './Preference.css';

const CRITERIA = [
  {
    key: 'w1', label: 'Fasilitas Digital', desc: 'Wi-Fi, Colokan',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.55a8 8 0 0114 0" stroke="#0047AB" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8.5 16.05a4.5 4.5 0 017 0" stroke="#0047AB" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="19" r="1.5" fill="#0047AB"/>
      </svg>
    ),
  },
  {
    key: 'w2', label: 'Harga Menu', desc: 'Terjangkau kantong mahasiswa',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="#0047AB" strokeWidth="2" fill="none"/>
        <circle cx="12" cy="12" r="3" stroke="#0047AB" strokeWidth="1.5" fill="none"/>
        <path d="M3 10h2M19 10h2" stroke="#0047AB" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'w3', label: 'Suasana Visual', desc: 'Instagramable, Estetik',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#0047AB" strokeWidth="2" fill="none"/>
        <circle cx="8.5" cy="8.5" r="2" fill="#0047AB"/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#0047AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'w4', label: 'Ketenangan', desc: 'Cocok untuk fokus / WFC',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v18" stroke="#0047AB" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 7v10M16 7v10M4 10v4M20 10v4" stroke="#0047AB" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'w5', label: 'Hiburan', desc: 'Live music, Board games',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="#0047AB"/>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#0047AB" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" stroke="#0047AB" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'w6', label: 'Kualitas Rasa', desc: 'Kopi enak, Makanan lezat',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 11h11v2a6 6 0 01-6 6h0a6 6 0 01-6-6v-2z" stroke="#0047AB" strokeWidth="2" fill="none"/>
        <path d="M16 12h1a3 3 0 010 6h-1" stroke="#0047AB" strokeWidth="2" fill="none"/>
        <path d="M7 7c0-2 1.5-2 1.5-4M10 7c0-2 1.5-2 1.5-4M13 7c0-2 1.5-2 1.5-4" stroke="#0047AB" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const CATEGORIES = [
  { id: 'wfc', label: 'Spot WFC', emoji: '💻', desc: 'Kerja fokus, Wi-Fi kencang' },
  { id: 'nongkrong', label: 'Nongkrong', emoji: '☕', desc: 'Hangout santai bareng teman' },
  { id: 'ngedate', label: 'Ngedate', emoji: '🌹', desc: 'Suasana romantis & cozy' },
];

export default function Preference() {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams();
  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;
  const { setCategory, setWeights, setHasSetPreferences } = usePreference();

  // Mode: dari Home → spontan (ada urlCategory), dari Profile → default (tidak ada urlCategory)
  const isDefaultMode = !urlCategory;

  const [selectedCat, setSelectedCat] = useState(urlCategory || null);
  const [savedStatuses, setSavedStatuses] = useState({});
  const [sliders, setSliders] = useState({
    w1: 50, w2: 50, w3: 50, w4: 50, w5: 50, w6: 50
  });
  const [loadingPrefs, setLoadingPrefs] = useState(false);
  const [saving, setSaving] = useState(false);

  // Jika default mode, load status saved per kategori
  useEffect(() => {
    if (isDefaultMode && isLoggedIn) {
      fetchAllUserPrefs()
        .then(res => {
          const map = {};
          res.data.forEach(p => { map[p.category] = true; });
          setSavedStatuses(map);
        })
        .catch(() => {});
    }
  }, [isDefaultMode, isLoggedIn]);

  // Load preferensi dari DB saat kategori dipilih (berlaku untuk mode spontan & default)
  useEffect(() => {
    if (selectedCat && isLoggedIn) {
      setLoadingPrefs(true);
      fetchUserPref(selectedCat)
        .then(res => {
          const d = res.data;
          setSliders({
            w1: d.w1_digital, w2: d.w2_harga, w3: d.w3_suasana,
            w4: d.w4_tenang, w5: d.w5_hiburan, w6: d.w6_rasa
          });
        })
        .catch(() => {}) // Jika belum ada, tetap pakai default 50
        .finally(() => setLoadingPrefs(false));
    }
  }, [selectedCat, isLoggedIn]);

  const handleChange = (key, val) => {
    setSliders(prev => ({ ...prev, [key]: Number(val) }));
  };

  // Submit spontan (dari Home) → langsung ke loading SAW
  const handleSubmitSpontan = () => {
    setCategory(selectedCat || 'wfc');
    setWeights(sliders);
    setHasSetPreferences(true);
    navigate('/loading');
  };

  // Submit default (dari Profile) → simpan ke DB
  const handleSubmitDefault = async () => {
    if (!selectedCat) return;
    setSaving(true);
    try {
      await saveUserPref(selectedCat, {
        w1_digital: sliders.w1, w2_harga: sliders.w2, w3_suasana: sliders.w3,
        w4_tenang: sliders.w4, w5_hiburan: sliders.w5, w6_rasa: sliders.w6,
      });
      setSavedStatuses(prev => ({ ...prev, [selectedCat]: true }));
      setSelectedCat(null); // Kembali ke pilihan kategori
    } catch (err) {
      console.error('Gagal simpan preferensi:', err);
    } finally {
      setSaving(false);
    }
  };

  // === DEFAULT MODE: Category Picker ===
  if (isDefaultMode && !selectedCat) {
    return (
      <div className="app-page pref-page">
        <header className="pref-header">
          <button className="pref-back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M14 5L8 11L14 17" stroke="#0047AB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="pref-header-title">Preferensi Default</h1>
          <div className="pref-header-spacer"/>
        </header>

        <main className="pref-main">
          <section className="pref-intro">
            <h2 className="pref-heading">Pilih Kategori Vibe</h2>
            <p className="pref-subtext">
              Atur bobot preferensi default untuk masing-masing kategori. Preferensi ini akan tersimpan di akunmu.
            </p>
          </section>

          <div className="pref-cat-list">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`pref-cat-card ${savedStatuses[cat.id] ? 'pref-cat-card--saved' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                <span className="pref-cat-emoji">{cat.emoji}</span>
                <div className="pref-cat-info">
                  <span className="pref-cat-label">{cat.label}</span>
                  <span className="pref-cat-desc">{cat.desc}</span>
                </div>
                {savedStatuses[cat.id] && (
                  <span className="pref-cat-check">✅</span>
                )}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pref-cat-arrow">
                  <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // === SLIDER VIEW (both modes) ===
  const currentCatLabel = CATEGORIES.find(c => c.id === selectedCat)?.label || selectedCat;

  return (
    <div className="app-page pref-page">
      {/* Header */}
      <header className="pref-header">
        <button className="pref-back-btn" onClick={() => {
          if (isDefaultMode) setSelectedCat(null);
          else navigate(-1);
        }} aria-label="Kembali">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5L8 11L14 17" stroke="#0047AB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="pref-header-title">
          {isDefaultMode ? `Preferensi: ${currentCatLabel}` : 'Atur Prioritasmu'}
        </h1>
        <div className="pref-header-spacer"/>
      </header>

      <main className="pref-main">
        {/* Intro */}
        <section className="pref-intro">
          <h2 className="pref-heading">
            {isDefaultMode
              ? `Atur bobot default untuk ${currentCatLabel}`
              : 'Sesuaikan preferensi kafemu'}
          </h2>
          <p className="pref-subtext">
            {isDefaultMode
              ? 'Preferensi ini akan tersimpan sebagai default di akunmu untuk kategori ini.'
              : 'Geser slider untuk menentukan seberapa penting kriteria ini bagi "vibe" yang kamu cari.'}
          </p>
          {!isDefaultMode && isLoggedIn && (
            <div className="pref-hint-banner">
              <span>⚡</span>
              <span>Slider diisi dari <strong>preferensi default</strong> yang tersimpan. Ubah jika perlu, atau langsung cari!</span>
            </div>
          )}
        </section>

        {loadingPrefs ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Memuat preferensi...</div>
        ) : (
          /* Sliders */
          <div className="pref-sliders">
            {CRITERIA.map(c => (
              <div className="pref-slider-card" key={c.key}>
                <div className="pref-slider-top">
                  <div className="pref-slider-icon">{c.icon}</div>
                  <div className="pref-slider-info">
                    <span className="pref-slider-label">{c.label}</span>
                    <span className="pref-slider-desc">{c.desc}</span>
                  </div>
                  <span className="pref-slider-value">{sliders[c.key]}%</span>
                </div>
                <div className="pref-slider-wrap">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={sliders[c.key]}
                    onChange={e => handleChange(c.key, e.target.value)}
                    className="pref-range"
                    style={{ '--pct': `${sliders[c.key]}%` }}
                  />
                  <div className="pref-slider-labels">
                    <span>TIDAK PENTING</span>
                    <span>SANGAT PENTING</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom CTA */}
      <div className="pref-bottom">
        {isDefaultMode ? (
          <button className="pref-submit-btn pref-submit-btn--save" onClick={handleSubmitDefault} disabled={saving}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9l3 3 7-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {saving ? 'Menyimpan...' : 'Simpan Preferensi'}
          </button>
        ) : (
          <button className="pref-submit-btn" onClick={handleSubmitSpontan}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M5 9h8M7 14h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Cari Vibe Mu
          </button>
        )}
      </div>
    </div>
  );
}
