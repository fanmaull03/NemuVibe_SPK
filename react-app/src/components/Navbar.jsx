import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="header" id="main-header">
      <div className="header-left">
        <svg className="header-logo-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="14" fill="#0047AB"/>
          <path d="M14 6C10.134 6 7 9.134 7 13c0 2.76 1.6 5.14 3.92 6.28L14 22l3.08-2.72C19.4 18.14 21 15.76 21 13c0-3.866-3.134-7-7-7z" fill="#FFD700"/>
          <circle cx="14" cy="13" r="2.5" fill="#0047AB"/>
        </svg>
        <span className="header-logo-text">NemuVibe</span>
      </div>
      <div className="header-right">
        <button
          className="info-btn"
          id="info-btn"
          aria-label="Tentang Kami"
          onClick={() => navigate('/about')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#0047AB" strokeWidth="2" fill="none"/>
            <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0047AB" fontFamily="Plus Jakarta Sans, sans-serif">i</text>
          </svg>
        </button>
      </div>
    </header>
  );
}
