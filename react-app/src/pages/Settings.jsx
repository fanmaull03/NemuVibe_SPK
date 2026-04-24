import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('Pecinta Kopi & Penikmat Suasana ✨');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Simulasi penyimpanan lokal / API call
    setMessage('Profil berhasil diperbarui!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage('Password baru minimal 6 karakter.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setMessage('Password berhasil diubah!');
    setMessageType('success');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="app-page settings-page">
      <header className="settings-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5L8 11L14 17" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="settings-header-title">Pengaturan Akun</h1>
        <div className="header-spacer"/>
      </header>

      <main className="settings-main">
        {message && (
          <div className={`settings-alert settings-alert--${messageType}`}>
            {message}
          </div>
        )}

        <section className="settings-section">
          <h2 className="settings-section-title">Foto Profil</h2>
          <div className="settings-avatar-wrap">
            <div className="settings-avatar">
              <span className="settings-avatar-initial">
                {(username || 'U')[0].toUpperCase()}
              </span>
            </div>
            <button className="settings-avatar-btn">Ubah Foto</button>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">Informasi Pribadi</h2>
          <form className="settings-form" onSubmit={handleSaveProfile}>
            <div className="settings-field">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="settings-field">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="settings-field">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="settings-field">
              <label>Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                placeholder="Tulis sedikit tentang dirimu..."
              />
            </div>
            <button type="submit" className="settings-save-btn">Simpan Profil</button>
          </form>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">Keamanan</h2>
          <form className="settings-form" onSubmit={handleUpdatePassword}>
            <div className="settings-field">
              <label>Password Saat Ini</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>
            <div className="settings-field">
              <label>Password Baru</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                placeholder="Minimal 6 karakter"
              />
            </div>
            <button type="submit" className="settings-save-btn settings-save-btn--danger">Ubah Password</button>
          </form>
        </section>
      </main>
    </div>
  );
}
