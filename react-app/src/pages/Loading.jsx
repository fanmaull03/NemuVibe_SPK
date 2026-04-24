import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreference } from '../context/PreferenceContext';
import { fetchCustomRecommend } from '../services/api';
import './Loading.css';

export default function Loading() {
  const navigate = useNavigate();
  const { category, weights, setResults } = usePreference();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Mengambil data kafe...');

  // Top 3 bobot user untuk ditampilkan
  const labels = ['Digital', 'Harga', 'Visual', 'Tenang', 'Hiburan', 'Rasa'];
  const wArr = [weights.w1, weights.w2, weights.w3, weights.w4, weights.w5, weights.w6];
  const sorted = wArr.map((v, i) => ({ v, l: labels[i] })).sort((a, b) => b.v - a.v);
  const topCriteria = sorted.slice(0, 3).map(x => x.l);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 12;
      });
    }, 300);

    // Status text transitions
    const t1 = setTimeout(() => setStatusText('Menghitung bobot SAW...'), 800);
    const t2 = setTimeout(() => setStatusText('Membandingkan kafe...'), 1600);

    // Actual API call
    const doRequest = async () => {
      try {
        const res = await fetchCustomRecommend({
          category,
          w1: weights.w1, w2: weights.w2, w3: weights.w3,
          w4: weights.w4, w5: weights.w5, w6: weights.w6,
        });
        setResults(res.data.results);
      } catch (err) {
        console.error('SAW calculation failed:', err);
        setResults([]);
      }

      // Finish animation
      setProgress(100);
      setStatusText('Selesai!');

      setTimeout(() => navigate('/recommendation', { replace: true }), 600);
    };

    // Wait minimum 2.5s for effect
    const t3 = setTimeout(doRequest, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const pct = Math.min(Math.round(progress), 100);

  return (
    <div className="loading-page">
      {/* Header */}
      <header className="loading-header">
        <h1 className="loading-header-title">Memproses...</h1>
      </header>

      {/* Center illustration */}
      <div className="loading-center">
        <div className="loading-ring">
          <div className="loading-ring-inner">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="20" height="18" rx="3" fill="#0047AB"/>
              <path d="M14 24h8M14 28h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M32 26l-4 4 4 4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="36" cy="30" r="2" fill="#FFD700"/>
            </svg>
          </div>
        </div>

        <h2 className="loading-title">
          <span className="loading-title-accent">Vibe</span> Matching…
        </h2>
        <p className="loading-desc">
          Menjalankan algoritma SAW untuk menemukan spot terbaik berdasarkan{' '}
          <span className="loading-highlight">{topCriteria[0]}</span>,{' '}
          <span className="loading-highlight">{topCriteria[1]}</span>, dan{' '}
          <span className="loading-highlight">{topCriteria[2]}</span>.
        </p>
      </div>

      {/* Bottom progress */}
      <div className="loading-bottom">
        <div className="loading-status-row">
          <div>
            <p className="loading-status-title">{statusText}</p>
            <p className="loading-status-sub">Membandingkan kafe terdekat</p>
          </div>
          <span className="loading-pct">{pct}%</span>
        </div>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" style={{ width: `${pct}%` }}/>
        </div>
      </div>
    </div>
  );
}
