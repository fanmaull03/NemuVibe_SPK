import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const BOBOT_DATA = [
  {
    kategori: 'WFC',
    bobot: [
      { label: 'Fasilitas Digital (C1)', value: 0.30 },
      { label: 'Harga (C2)',             value: 0.10 },
      { label: 'Estetika (C3)',          value: 0.10 },
      { label: 'Ketenangan (C4)',        value: 0.25 },
      { label: 'Hiburan (C5)',           value: 0.05 },
      { label: 'Rasa (C6)',              value: 0.20 },
    ]
  },
  {
    kategori: 'Nongkrong',
    bobot: [
      { label: 'Fasilitas Digital (C1)', value: 0.10 },
      { label: 'Harga (C2)',             value: 0.20 },
      { label: 'Estetika (C3)',          value: 0.20 },
      { label: 'Ketenangan (C4)',        value: 0.10 },
      { label: 'Hiburan (C5)',           value: 0.25 },
      { label: 'Rasa (C6)',              value: 0.15 },
    ]
  },
  {
    kategori: 'Ngedate',
    bobot: [
      { label: 'Fasilitas Digital (C1)', value: 0.05 },
      { label: 'Harga (C2)',             value: 0.15 },
      { label: 'Estetika (C3)',          value: 0.30 },
      { label: 'Ketenangan (C4)',        value: 0.20 },
      { label: 'Hiburan (C5)',           value: 0.15 },
      { label: 'Rasa (C6)',              value: 0.15 },
    ]
  },
];

const CRITERIA_DATA = [
  { id: 'digital',    label: 'Fasilitas Digital', desc: 'Wi-Fi & Stop Kontak',  cls: 'blue',   icon: '🛡️' },
  { id: 'harga',      label: 'Harga',             desc: 'Range harga menu',     cls: 'green',  icon: '💰' },
  { id: 'estetika',   label: 'Estetika',          desc: 'Instagramable spot',   cls: 'pink',   icon: '📸' },
  { id: 'ketenangan', label: 'Ketenangan',        desc: 'Level kebisingan',     cls: 'purple', icon: '🎵' },
  { id: 'hiburan',    label: 'Hiburan',           desc: 'Live music & games',   cls: 'indigo', icon: '✨' },
  { id: 'rasa',       label: 'Rasa',              desc: 'Kualitas F&B',         cls: 'amber',  icon: '☕' },
];

export default function About() {
  const navigate = useNavigate();
  const [showBobot, setShowBobot] = useState(false);

  return (
    <div className="app-page">
      {/* Header */}
      <header className="about-header" id="about-header">
        <button className="back-btn" id="back-btn" aria-label="Kembali" onClick={() => navigate(-1)}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5L8 11L14 17" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="about-header-title">Tentang Kami</h1>
        <div className="header-spacer"/>
      </header>

      <main className="about-main">
        {/* Hero Banner */}
        <section className="about-hero" id="about-hero">
          <div className="about-hero-bg">
            <div className="about-hero-overlay"/>
            <div className="about-hero-content">
              <div className="about-logo-circle">
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="14" fill="rgba(255,255,255,0.15)"/>
                  <path d="M14 6C10.134 6 7 9.134 7 13c0 2.76 1.6 5.14 3.92 6.28L14 22l3.08-2.72C19.4 18.14 21 15.76 21 13c0-3.866-3.134-7-7-7z" fill="#FFD700"/>
                  <circle cx="14" cy="13" r="2.5" fill="#0047AB"/>
                </svg>
              </div>
              <span className="about-hero-brand">NemuVibe</span>
              <span className="about-hero-tagline">Pilih Vibe-mu, Temukan Tempatmu</span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section" id="about-section">
          <div className="about-section-header">
            <div className="about-info-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="#0047AB" strokeWidth="1.8" fill="none"/>
                <text x="9" y="13" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0047AB" fontFamily="Plus Jakarta Sans, sans-serif">i</text>
              </svg>
            </div>
            <h2 className="about-section-title">Tentang NemuVibe</h2>
          </div>
          <p className="about-text">
            <strong>NemuVibe</strong> lahir dari kebutuhan mahasiswa. Nama ini menggabungkan filosofi:
          </p>

          <div className="philosophy-cards">
            <div className="philosophy-card">
              <div className="philosophy-accent philosophy-accent--blue"/>
              <h3 className="philosophy-name">Nemu</h3>
              <p className="philosophy-desc">Efisiensi pencarian tempat yang tepat.</p>
            </div>
            <div className="philosophy-card">
              <div className="philosophy-accent philosophy-accent--yellow"/>
              <h3 className="philosophy-name">Vibe</h3>
              <p className="philosophy-desc">Kecocokan emosional &amp; produktivitas.</p>
            </div>
          </div>

          <p className="about-text about-text--bottom">
            Kami hadir sebagai <strong>Sistem Pendukung Keputusan (SPK)</strong> untuk membantumu menemukan spot terbaik di sekitar kampus.
          </p>
        </section>

        {/* Methodology Section */}
        <section className="method-section" id="method-section">
          <h2 className="method-main-title">Metodologi SAW</h2>

          <div className="method-card">
            <div className="method-card-header">
              <div className="method-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="16" height="16" rx="3" stroke="white" strokeWidth="1.8" fill="none"/>
                  <path d="M6 10h8M10 6v8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="method-card-text">
                <h3 className="method-card-title">Simple Additive Weighting</h3>
                <p className="method-card-subtitle">Algoritma di balik rekomendasi kami</p>
              </div>
            </div>
          </div>

          <p className="method-desc">
            Metode SAW sering disebut metode penjumlahan terbobot. Konsep dasarnya adalah mencari penjumlahan terbobot dari rating kinerja pada setiap alternatif pada semua atribut.
          </p>

          <div className="process-flow">
            {[
              { label: 'Data',    color: 'blue' },
              { label: 'Hitung', color: 'yellow' },
              { label: 'Ranking', color: 'orange' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <div className="process-step">
                  <div className={`process-circle process-circle--${step.color}`}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{i + 1}</span>
                  </div>
                  <span className="process-label">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="process-connector">
                    <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
                      <path d="M0 4h20M17 1l3 3-3 3" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Criteria Section */}
        <section className="criteria-section" id="criteria-section">
          <div className="criteria-header">
            <h2 className="criteria-title">6 Kriteria Utama</h2>
            <button className="bobot-btn" id="bobot-btn" onClick={() => setShowBobot(true)}>Bobot Penilaian</button>
          </div>

          <div className="criteria-grid">
            {CRITERIA_DATA.map(c => (
              <div key={c.id} className="criteria-card" id={`criteria-${c.id}`}>
                <div className={`criteria-icon criteria-icon--${c.cls}`}>
                  <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                </div>
                <h3 className="criteria-name">{c.label}</h3>
                <p className="criteria-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="about-bottom-spacer"/>
      </main>

      {/* Bobot Modal */}
      {showBobot && (
        <div className="bobot-overlay" onClick={() => setShowBobot(false)}>
          <div className="bobot-modal" onClick={e => e.stopPropagation()}>
            <div className="bobot-modal-header">
              <h3 className="bobot-modal-title">Bobot Penilaian SAW</h3>
              <button className="bobot-close-btn" onClick={() => setShowBobot(false)} aria-label="Tutup">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <p className="bobot-modal-desc">Setiap kategori vibe memiliki bobot kriteria berbeda.</p>
            {BOBOT_DATA.map(cat => (
              <div key={cat.kategori} className="bobot-category">
                <h4 className="bobot-cat-title">{cat.kategori}</h4>
                <div className="bobot-bars">
                  {cat.bobot.map(b => (
                    <div className="bobot-bar-row" key={b.label}>
                      <span className="bobot-bar-label">{b.label}</span>
                      <div className="bobot-bar-track">
                        <div className="bobot-bar-fill" style={{ width: `${b.value * 100}%` }}/>
                      </div>
                      <span className="bobot-bar-value">{(b.value * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
