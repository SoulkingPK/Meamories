// =========================================
//  COLLAGE FAREWELL — MAIN SCRIPT
// =========================================

/* ---------- SCROLL PROGRESS ---------- */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
});

/* ---------- REVEAL ON SCROLL ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.style.getPropertyValue('--delay') || '0s';
      setTimeout(() => {
        el.classList.add('visible');
      }, parseFloat(delay) * 1000);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- PARALLAX EFFECT ---------- */
const parallaxBgs = document.querySelectorAll('.parallax-bg');
window.addEventListener('scroll', () => {
  parallaxBgs.forEach(bg => {
    const section = bg.parentElement;
    const rect = section.getBoundingClientRect();
    const offset = rect.top / window.innerHeight;
    bg.style.transform = `scale(1.08) translateY(${offset * 30}px)`;
  });
});

/* ---------- LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryItems = Array.from(document.querySelectorAll('.masonry-item'));
let currentLightboxIdx = 0;

function openLightbox(idx) {
  currentLightboxIdx = idx;
  lightboxImg.src = galleryItems[idx].dataset.src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function showPrev() {
  currentLightboxIdx = (currentLightboxIdx - 1 + galleryItems.length) % galleryItems.length;
  lightboxImg.src = galleryItems[currentLightboxIdx].dataset.src;
}
function showNext() {
  currentLightboxIdx = (currentLightboxIdx + 1) % galleryItems.length;
  lightboxImg.src = galleryItems[currentLightboxIdx].dataset.src;
}

galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// Keyboard nav
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Touch swipe for lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? showNext() : showPrev();
});

/* ---------- REPLAY BUTTON ---------- */
document.getElementById('replayBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- HIDDEN MESSAGE ---------- */
const hiddenMsgBtn = document.getElementById('hiddenMsgBtn');
const hiddenMsg = document.getElementById('hiddenMsg');
hiddenMsgBtn.addEventListener('click', () => {
  hiddenMsg.classList.toggle('open');
  hiddenMsgBtn.textContent = hiddenMsg.classList.contains('open')
    ? '✦ Close ✦'
    : '✦ A secret message ✦';
});

/* ---------- ENTRY SPLASH + BACKGROUND MUSIC ---------- */
const bgMusic  = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon= document.getElementById('musicIcon');
const entrySplash = document.getElementById('entrySplash');
const entryBtn    = document.getElementById('entryBtn');
let musicPlaying = false;

function setMusicPlaying(state) {
  musicPlaying = state;
  musicIcon.textContent = state ? '♬' : '♪';
  musicBtn.style.background = state ? 'rgba(247,198,199,0.5)' : 'rgba(255,249,245,0.92)';
}

// Kick off preload immediately so file is buffered before user clicks
bgMusic.volume = 0.6;
bgMusic.load();

function startMusic() {
  bgMusic.play().then(() => {
    setMusicPlaying(true);
  }).catch(() => {
    // Fallback: muted trick for very strict browsers
    bgMusic.muted = true;
    bgMusic.play().then(() => {
      bgMusic.muted = false;
      setMusicPlaying(true);
    }).catch(() => {});
  });
}

// ✨ Glitter burst — canvas particles exploding from center for 4 seconds
function glitterBurst() {
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:100001;pointer-events:none;';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var colors = ['#f7c6c7','#f2d388','#fcd5b5','#ff99bb','#ffe066',
                '#ffffff','#8B5E3C','#ffaacc','#ffd700','#ffb347','#e8a0bf'];
  var particles = [];

  for (var i = 0; i < 180; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = 4 + Math.random() * 9;
    particles.push({
      x:        canvas.width  / 2,
      y:        canvas.height / 2,
      vx:       Math.cos(angle) * speed,
      vy:       Math.sin(angle) * speed - 3,   // slight upward bias
      size:     4 + Math.random() * 9,
      color:    colors[Math.floor(Math.random() * colors.length)],
      alpha:    1,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.25,
      gravity:  0.07 + Math.random() * 0.06,
      shape:    Math.floor(Math.random() * 3)  // 0=square, 1=circle, 2=diamond
    });
  }

  var start    = Date.now();
  var duration = 4000;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var elapsed  = Date.now() - start;
    var progress = elapsed / duration;
    var alive    = false;

    particles.forEach(function(p) {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.rotation += p.rotSpeed;
      p.alpha = Math.max(0, 1 - progress * 1.2);

      if (p.alpha > 0.01) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle   = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = 8;

        if (p.shape === 0) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.5, 0);
          ctx.lineTo(0,  p.size);
          ctx.lineTo(-p.size * 0.5, 0);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (alive && elapsed < duration + 500) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  animate();
}

// Entry button — fire glitter, then reveal site + start music
entryBtn.addEventListener('click', () => {
  glitterBurst();                                    // 🎉 glitter!
  setTimeout(() => entrySplash.classList.add('hidden'), 500); // slight delay looks better
  startMusic();
});

// Manual music toggle button
musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    setMusicPlaying(false);
  } else {
    bgMusic.play().then(() => {
      bgMusic.muted = false;
      setMusicPlaying(true);
    }).catch(() => {});
  }
});


/* ---------- STAGGER REVEAL FOR COLLAGE ITEMS ---------- */
document.querySelectorAll('.collage-grid .polaroid, .collage-scatter .polaroid').forEach((el, i) => {
  el.style.setProperty('--delay', `${i * 0.12}s`);
});

/* ---------- CURSOR SPARKLE EFFECT ---------- */
function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.style.cssText = `
    position:fixed; pointer-events:none; z-index:9998;
    left:${x}px; top:${y}px; width:6px; height:6px;
    border-radius:50%; background:var(--yellow);
    transform:translate(-50%,-50%) scale(0);
    animation: sparkleAnim 0.6s ease forwards;
  `;
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 600);
}

// Add sparkle keyframes once
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkleAnim {
    0%   { transform: translate(-50%,-50%) scale(0); opacity:1; }
    50%  { transform: translate(-50%,-80%) scale(1); opacity:0.8; }
    100% { transform: translate(-50%,-130%) scale(0); opacity:0; }
  }
`;
document.head.appendChild(sparkleStyle);

let sparkleThrottle = 0;
document.addEventListener('mousemove', (e) => {
  if (Date.now() - sparkleThrottle < 80) return;
  sparkleThrottle = Date.now();
  if (Math.random() > 0.4) createSparkle(e.clientX, e.clientY);
});

/* ---------- VIDEO MEMORY PLAYER ---------- */
(function () {
  const video = document.getElementById('memoryVideo');
  const hint = document.getElementById('videoPlayHint');
  if (!video || !hint) return;

  // Hide the overlay once the user clicks it or video starts playing
  hint.addEventListener('click', () => {
    video.play().catch(() => { });
  });
  video.addEventListener('play', () => hint.classList.add('hidden'));
  video.addEventListener('pause', () => hint.classList.remove('hidden'));
  video.addEventListener('ended', () => hint.classList.remove('hidden'));
})();

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.8s ease';
    document.body.style.opacity = '1';
  });
});

/* ---------- SECRET VAULT (single vault, multiple keys) ---------- */
(function () {

  // ★ ADD / CHANGE KEYS HERE ★
  // Each key maps to { panelId, musicId }
  const KEY_MAP = {
    'kitty':     { panelId: 'secretPanel',  musicId: 'panel1Music' },
    'celebrity': { panelId: 'secretPanel2', musicId: 'panel2Music' },
  };

  const btn      = document.getElementById('vaultOpenBtn');
  const modal    = document.getElementById('vaultModal');
  const closeBtn = document.getElementById('vaultModalClose');
  const input    = document.getElementById('vaultKeyInput');
  const errorEl  = document.getElementById('vaultKeyError');
  const unlockBtn= document.getElementById('vaultUnlockBtn');
  const lockIcon = document.querySelector('#vaultCard .vault-lock');

  if (!btn || !modal || !input || !unlockBtn) return;

  // Helper: cross-fade bg music ↔ panel music
  function pauseBgMusic() {
    if (bgMusic && !bgMusic.paused) bgMusic.pause();
  }
  function resumeBgMusic() {
    if (bgMusic && musicPlaying) bgMusic.play().catch(function(){});
  }
  function playPanelMusic(musicEl) {
    if (!musicEl) return;
    musicEl.volume = 0.7;
    musicEl.currentTime = 0;
    musicEl.play().catch(function () {
      // Autoplay blocked — retry on next user interaction
      var retry = function () {
        musicEl.play().catch(function(){});
        document.removeEventListener('click',     retry);
        document.removeEventListener('touchstart',retry);
      };
      document.addEventListener('click',     retry, { once: true });
      document.addEventListener('touchstart',retry, { once: true });
    });
  }
  function stopPanelMusic(musicEl) {
    if (!musicEl) return;
    musicEl.pause();
    musicEl.currentTime = 0;
  }

  // Open modal
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    input.value = '';
    errorEl.textContent = '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { input.focus(); }, 300);
  });

  // Close modal
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Unlock — check key, open correct panel + play its song
  unlockBtn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tryUnlock();
  });

  function tryUnlock() {
    var entered = input.value.trim().toLowerCase();
    var config  = KEY_MAP[entered];

    if (config) {
      var panel    = document.getElementById(config.panelId);
      var musicEl  = document.getElementById(config.musicId);
      if (!panel) return;

      closeModal();
      // ↓ Must be called BEFORE setTimeout to stay in user gesture context
      pauseBgMusic();
      playPanelMusic(musicEl);
      setTimeout(function () {
        panel.classList.add('open');
        document.body.style.overflow = 'hidden';
      }, 200);

      if (lockIcon) lockIcon.textContent = '🔓';
    } else {
      errorEl.textContent = '✕ Wrong key — try again';
      input.classList.add('shake');
      setTimeout(function () { input.classList.remove('shake'); }, 500);
      input.value = '';
      input.focus();
    }
  }

  // Wire up close buttons for both panels
  var panelConfigs = [
    { panelId: 'secretPanel',  musicId: 'panel1Music' },
    { panelId: 'secretPanel2', musicId: 'panel2Music' },
  ];

  panelConfigs.forEach(function (cfg) {
    var panel   = document.getElementById(cfg.panelId);
    var musicEl = document.getElementById(cfg.musicId);
    if (!panel) return;

    panel.querySelectorAll('.secret-panel-close, .secret-panel-lock-again')
      .forEach(function (b) {
        b.addEventListener('click', function () { closePanel(panel, musicEl); });
      });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    panelConfigs.forEach(function (cfg) {
      var p = document.getElementById(cfg.panelId);
      var m = document.getElementById(cfg.musicId);
      if (p && p.classList.contains('open')) closePanel(p, m);
    });
  });

  function closePanel(panel, musicEl) {
    panel.classList.remove('open');
    document.body.style.overflow = '';
    if (lockIcon) lockIcon.textContent = '🔐';
    stopPanelMusic(musicEl);
    resumeBgMusic();
  }

  // Shake animation
  var s = document.createElement('style');
  s.textContent = '@keyframes shakeInput{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}.vault-key-input.shake{animation:shakeInput .45s ease;border-color:#c0392b!important}';
  document.head.appendChild(s);

})();

