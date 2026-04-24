import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import './Auth.css';

function PasswordInput({ id, value, onChange, placeholder, label }) {
  const [show, setShow] = useState(false);
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <div className="input-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="8" width="12" height="10" rx="2" stroke="#0047AB" strokeWidth="1.8" fill="none"/>
            <path d="M7 8V6a3 3 0 016 0v2" stroke="#0047AB" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <circle cx="10" cy="13" r="1.5" fill="#0047AB"/>
          </svg>
        </div>
        <input
          type={show ? 'text' : 'password'}
          className="form-input"
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          minLength={6}
        />
        <button type="button" className="toggle-pw-btn" aria-label="Toggle" onClick={() => setShow(s => !s)}>
          {show ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#0047AB" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="2.5" stroke="#0047AB" strokeWidth="1.5" fill="none"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="2.5" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
              <path d="M3 17L17 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (password !== confirm) {
      setMessage({ text: '❌ Password dan konfirmasi tidak cocok.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await registerUser({ username, email, password });
      setMessage({ text: '✅ Registrasi berhasil! Silakan login.', type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Terjadi kesalahan. Coba lagi.';
      setMessage({ text: `❌ ${msg}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        {/* Logo */}
        <section className="auth-logo-section auth-logo-section--register">
          <div className="auth-logo-box">
            <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
              <path d="M14 4C9.03 4 5 8.03 5 13c0 3.5 2 6.5 4.94 7.94L14 24l4.06-3.06C20.98 19.5 23 16.5 23 13c0-4.97-4.03-9-9-9z" fill="white"/>
              <circle cx="14" cy="12.5" r="3" fill="#0047AB"/>
            </svg>
          </div>
          <h1 className="auth-brand">NemuVibe</h1>
          <p className="auth-tagline">Buat akun dan temukan<br/>vibe cafe terbaikmu.</p>
        </section>

        {/* Form */}
        <form className="auth-form" id="register-form" onSubmit={handleSubmit} autoComplete="off">
          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">Username</label>
            <div className="input-wrap">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="3.5" stroke="#0047AB" strokeWidth="1.8" fill="none"/>
                  <path d="M3 18c0-3.5 3-6 7-6s7 2.5 7 6" stroke="#0047AB" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <input
                type="text"
                className="form-input"
                id="reg-username"
                placeholder="Masukkan username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <div className="input-wrap">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="#0047AB" strokeWidth="1.8" fill="none"/>
                  <path d="M2 6l8 5 8-5" stroke="#0047AB" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <input
                type="email"
                className="form-input"
                id="reg-email"
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <PasswordInput
            id="reg-password"
            label="Password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <PasswordInput
            id="reg-confirm"
            label="Konfirmasi Password"
            placeholder="Ulangi password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />

          {/* Submit */}
          <button type="submit" className="auth-submit-btn auth-submit-btn--yellow" id="register-btn" disabled={loading}>
            <span>{loading ? 'Mendaftarkan…' : 'Daftar Sekarang'}</span>
            {!loading && (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9h10M11 5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {message.text && (
            <div className={`auth-message auth-message--${message.type}`} id="register-message">
              {message.text}
            </div>
          )}

          <div className="auth-divider"><span>ATAU</span></div>

          <p className="auth-switch">
            Sudah punya akun?{' '}
            <Link to="/login" className="auth-switch-link auth-switch-link--blue">Masuk Sekarang</Link>
          </p>
        </form>
      </main>

      <div className="auth-bottom-bar auth-bottom-bar--yellow"/>
    </div>
  );
}
