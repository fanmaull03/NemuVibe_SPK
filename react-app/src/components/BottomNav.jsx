import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import './BottomNav.css';

const NAV_ITEMS = [
  {
    id: 'home', label: 'Beranda', path: '/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 8.5L11 2l8 6.5V19a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 013 19V8.5z" fill="currentColor"/>
        <path d="M8 20.5v-6h6v6" stroke="white" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'ranking', label: 'Peringkat', path: '/ranking',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2"   y="12" width="5"  height="8"  rx="1" fill="currentColor"/>
        <rect x="8.5" y="6"  width="5"  height="14" rx="1" fill="currentColor"/>
        <rect x="15"  y="9"  width="5"  height="11" rx="1" fill="currentColor"/>
        <path d="M11 2l1 2.5h2.5l-2 1.5.8 2.5L11 7l-2.3 1.5.8-2.5-2-1.5H10L11 2z" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'search', label: 'Cari', path: '/#search', center: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="9.5" cy="9.5" r="6.5" stroke="white" strokeWidth="2.5"/>
        <path d="M14.5 14.5L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'saved', label: 'Disimpan', path: '/saved',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 19s-7-4.5-7-10a4.5 4.5 0 019 0 4.5 4.5 0 019 0c0 5.5-7 10-7 10h-4z" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'profile', label: 'Profil', path: '/profile',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="4" fill="currentColor"/>
        <path d="M3 20c0-4 3.5-7 8-7s8 3 8 7" fill="currentColor"/>
      </svg>
    )
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback((item) => {
    if (item.id === 'search') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('search-input');
        if (el) { el.focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      }, 100);
      return;
    }
    navigate(item.path);
  }, [navigate]);

  return (
    <nav className="bottom-nav" id="bottom-nav">
      {NAV_ITEMS.map(item => {
        const isActive = item.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.path);

        return (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={[
              'nav-item',
              item.center ? 'nav-item--center' : '',
              isActive && !item.center ? 'nav-item--active' : '',
            ].join(' ').trim()}
            aria-label={item.label}
            onClick={() => handleClick(item)}
          >
            {item.center ? (
              <div className="nav-center-circle">{item.icon}</div>
            ) : (
              item.icon
            )}
            <span className={`nav-label${item.center ? ' nav-label--center' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
