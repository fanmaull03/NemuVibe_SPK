// ============================================
// NemuVibe — Frontend Logic (Dynamic Data)
// ============================================

const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {

  // ===== STATE =====
  let selectedVibe = 'wfc'; // Default category
  let topCafes = [];

  // ===== LOAD RECOMMENDATIONS ON PAGE LOAD =====
  loadRecommendations(selectedVibe);

  // ===== VIBE CARD SELECTION =====
  const vibeCards = document.querySelectorAll('.vibe-card');

  vibeCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;

      // Set active state
      vibeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedVibe = category;

      // Reload recommendations for selected category
      loadRecommendations(category);

      // Add ripple micro-animation
      addRipple(card);
    });
  });

  // Set WFC as default active
  document.getElementById('vibe-wfc').classList.add('active');

  // ===== FETCH & RENDER RECOMMENDATIONS =====
  async function loadRecommendations(category) {
    const recoList = document.getElementById('reco-list');
    const loading = document.getElementById('reco-loading');
    const errorEl = document.getElementById('reco-error');

    // Show loading, hide content
    loading.style.display = 'flex';
    recoList.innerHTML = '';
    errorEl.style.display = 'none';

    try {
      const response = await fetch(`${API_BASE}/recommend/${category}`);

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      topCafes = data;

      // Hide loading
      loading.style.display = 'none';

      // Render top 3 cards
      const top3 = data.slice(0, 3);
      recoList.innerHTML = top3.map((cafe, index) => renderCafeCard(cafe, index, category)).join('');

      // Observe new cards for scroll animation
      document.querySelectorAll('.reco-card').forEach(card => {
        observer.observe(card);
      });

    } catch (err) {
      console.error('Error fetching recommendations:', err);
      loading.style.display = 'none';
      errorEl.style.display = 'block';
    }
  }

  // ===== RENDER SINGLE CAFE CARD =====
  function renderCafeCard(cafe, index, category) {
    const rank = index + 1;
    const matchPercent = Math.round(cafe.skor_akhir * 100);

    // Vibe chip config
    const vibeConfig = {
      wfc: { class: 'vibe-chip--wfc', label: '✨ Cocok untuk WFC' },
      nongkrong: { class: 'vibe-chip--nongkrong', label: '☕ Cocok untuk Nongkrong' },
      ngedate: { class: 'vibe-chip--ngedate', label: '🌹 Cocok untuk Ngedate' }
    };

    const vibe = vibeConfig[category] || vibeConfig.wfc;

    // Use default images based on rank (fallback)
    const images = [
      'images/cafe_vato.png',
      'images/cafe_society.png',
      'images/cafe_singgah.png'
    ];
    const imgSrc = images[index] || images[0];

    return `
      <article class="reco-card" id="reco-card-${rank}" style="animation: cardSlideIn 0.5s ease-out ${index * 0.1}s backwards;">
        <div class="reco-card-image-wrap">
          <img src="${imgSrc}" alt="${cafe.nama}" class="reco-card-image" loading="lazy">
          <span class="reco-rank">#${rank}</span>
          <span class="vibe-chip ${vibe.class}">${vibe.label}</span>
        </div>
        <div class="reco-card-body">
          <div class="reco-card-top">
            <h3 class="reco-card-name">${cafe.nama}</h3>
            <span class="match-badge">${matchPercent}% Match</span>
          </div>
          <p class="reco-card-address">Purwokerto</p>
          <div class="reco-card-tags">
            <span class="tag">⭐ Skor: ${cafe.skor_akhir}</span>
            <span class="tag">🏆 Rank #${rank}</span>
          </div>
        </div>
      </article>
    `;
  }

  // ===== RETRY BUTTON =====
  document.getElementById('retry-btn').addEventListener('click', () => {
    loadRecommendations(selectedVibe);
  });

  // ===== LOCKED NAV ITEMS =====
  const lockedItems = document.querySelectorAll('.nav-item--locked');
  let tooltipTimeout = null;

  lockedItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const token = localStorage.getItem('nemuvibe_token');
      if (token) {
        return;
      }
      showTooltip('🔒 Fitur ini memerlukan Login');

      item.classList.add('shake');
      setTimeout(() => item.classList.remove('shake'), 500);

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    });
  });

  function showTooltip(message) {
    const existing = document.querySelector('.tooltip');
    if (existing) existing.remove();
    if (tooltipTimeout) clearTimeout(tooltipTimeout);

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    document.getElementById('app').appendChild(tooltip);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tooltip.classList.add('show');
      });
    });

    tooltipTimeout = setTimeout(() => {
      tooltip.classList.remove('show');
      setTimeout(() => tooltip.remove(), 300);
    }, 2500);
  }

  // ===== SEARCH BAR INTERACTION =====
  const searchInput = document.getElementById('search-input');

  searchInput.addEventListener('focus', () => {
    document.getElementById('search-bar').style.borderColor = 'var(--blue)';
  });

  searchInput.addEventListener('blur', () => {
    document.getElementById('search-bar').style.borderColor = '';
  });

  // ===== INFO BUTTON =====
  const infoBtn = document.getElementById('info-btn');
  infoBtn.addEventListener('click', () => {
    window.location.href = 'about.html';
  });

  // ===== ACTIVE NAV SWITCHING =====
  const navItems = document.querySelectorAll('.nav-item:not(.nav-item--locked):not(.nav-item--center)');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.id === 'nav-ranking') {
        window.location.href = 'ranking.html';
        return;
      }
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('nav-item--active'));
      item.classList.add('nav-item--active');
    });
  });

  // Center search button
  document.getElementById('nav-search').addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('nav-item--active'));
    searchInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // See all button -> ranking page
  document.getElementById('see-all-btn').addEventListener('click', () => {
    window.location.href = 'ranking.html';
  });

  // ===== RIPPLE EFFECT =====
  function addRipple(element) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(0,71,171,0.1);
      width: 100px;
      height: 100px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
    `;
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // Add keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleEffect {
      to {
        transform: translate(-50%, -50%) scale(3);
        opacity: 0;
      }
    }
    @keyframes shakeAnim {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    .shake {
      animation: shakeAnim 0.3s ease-in-out !important;
    }
  `;
  document.head.appendChild(style);

  // ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // ===== HEADER SCROLL EFFECT =====
  let lastScroll = 0;
  const header = document.getElementById('main-header');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 60) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  }, { passive: true });

});
