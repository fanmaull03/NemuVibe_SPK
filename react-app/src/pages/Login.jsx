import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/api';
import './Auth.css';

export default function Login() {
  const navigate    = useNavigate();
  const { login }   = useContext(AuthContext);

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data.user, res.data.token);
      const isAdminUser = res.data.user.role === 'admin';
      setMessage({ text: '✅ Login berhasil! Mengalihkan...', type: 'success' });
      setTimeout(() => navigate(isAdminUser ? '/admin' : '/'), 1200);
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
        <section className="auth-logo-section">
          <div className="auth-logo-box">
            <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
              <path d="M14 4C9.03 4 5 8.03 5 13c0 3.5 2 6.5 4.94 7.94L14 24l4.06-3.06C20.98 19.5 23 16.5 23 13c0-4.97-4.03-9-9-9z" fill="white"/>
              <circle cx="14" cy="12.5" r="3" fill="#0047AB"/>
            </svg>
          </div>
          <h1 className="auth-brand">NemuVibe</h1>
          <p className="auth-tagline">Temukan cafe terbaik<br/>di Purwokerto.</p>
        </section>

        {/* Form */}
        <form className="auth-form" id="login-form" onSubmit={handleSubmit} autoComplete="off">
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
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
                id="login-email"
                placeholder="Email Anda"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-wrap">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="4" y="8" width="12" height="10" rx="2" stroke="#0047AB" strokeWidth="1.8" fill="none"/>
                  <path d="M7 8V6a3 3 0 016 0v2" stroke="#0047AB" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <circle cx="10" cy="13" r="1.5" fill="#0047AB"/>
                </svg>
              </div>
              <input
                type={showPw ? 'text' : 'password'}
                className="form-input"
                id="login-password"
                placeholder="Masukkan Password Anda"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pw-btn"
                id="toggle-pw"
                aria-label="Toggle password"
                onClick={() => setShowPw(p => !p)}
              >
                {showPw ? (
                  <svg className="eye-icon eye-on" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#0047AB" strokeWidth="1.5" fill="none"/>
                    <circle cx="10" cy="10" r="2.5" stroke="#0047AB" strokeWidth="1.5" fill="none"/>
                  </svg>
                ) : (
                  <svg className="eye-icon eye-off" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
                    <circle cx="10" cy="10" r="2.5" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
                    <path d="M3 17L17 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="form-row-end">
              <a href="#" className="forgot-link" id="forgot-link">Lupa Password?</a>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" id="login-btn" disabled={loading}>
            <span>{loading ? 'Memproses…' : 'Masuk'}</span>
            {!loading && (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9h10M11 5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {message.text && (
            <div className={`auth-message auth-message--${message.type}`} id="login-message">
              {message.text}
            </div>
          )}

          <div className="auth-divider"><span>ATAU</span></div>

          <p className="auth-switch">
            Belum punya akun?{' '}
            <Link to="/register" className="auth-switch-link">Daftar Sekarang</Link>
          </p>
        </form>
      </main>

      <div className="auth-bottom-bar"/>
    </div>
  );
}
