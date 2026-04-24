import { useNavigate } from 'react-router-dom';
import './CafeCard.css';

const VIBE_CONFIG = {
  wfc:       { cls: 'vibe-chip--wfc',       label: '✨ Cocok WFC' },
  nongkrong: { cls: 'vibe-chip--nongkrong', label: '☕ Nongkrong' },
  ngedate:   { cls: 'vibe-chip--ngedate',   label: '🌹 Ngedate'   },
};

// Fallback removed

export default function CafeCard({ cafe, index }) {
  const navigate = useNavigate();
  const imgSrc = cafe.foto_utama;

  return (
    <article
      className="reco-card"
      id={`reco-card-${index + 1}`}
      style={{ animation: `cardSlideIn 0.5s ease-out ${index * 0.1}s backwards` }}
      onClick={() => navigate(`/detail/${cafe.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/detail/${cafe.id}`)}
    >
      <div className="reco-card-image-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={cafe.nama} className="reco-card-image" loading="lazy"/>
        ) : (
          <div className="reco-card-no-image">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M4 16l4-4 4 4 4-4 4 4M20 9V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="2" stroke="#9CA3AF" strokeWidth="2"/></svg>
          </div>
        )}
      </div>
      <div className="reco-card-body">
        <div className="reco-card-top">
          <h3 className="reco-card-name">{cafe.nama}</h3>
        </div>
        <p className="reco-card-address" style={{ marginTop: '6px', marginBottom: 0 }}>
          📍 {cafe.alamat || 'Alamat tidak tersedia'}
        </p>
      </div>
    </article>
  );
}
