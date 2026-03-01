/* ===================================================
   BIRTHDAY WEBSITE — script.js
   =================================================== */

// ── CONFIG ──────────────────────────────────────────
const CONFIG = {
  birthdayDate: new Date('2026-03-03T00:00:00'),
  name: 'Thùy Linh',
  galleryImages: [
    { src: 'photos/image1.jpg', caption: 'Khoảnh khắc đầu tiên', date: '01/2024' },
    { src: 'photos/image2.jpg', caption: 'Chuyến đi cùng nhau',  date: '04/2024' },
    { src: 'photos/image3.jpg', caption: 'Ngày bình thường đặc biệt', date: '07/2024' },
    { src: 'photos/image4.jpg', caption: 'Nụ cười của em',       date: '12/2024' },
    { src: 'photos/image5.jpg', caption: 'Hạnh phúc bên nhau',   date: '02/2025' },
  ],
  particles: ['💕', '🌸', '✨', '💖', '🌷', '💫', '🎀'],
};

// ── INTRO SCREEN ────────────────────────────────────
(function initIntro() {
  spawnIntroParticles();

  document.getElementById('btn-enter').addEventListener('click', () => {
    const intro = document.getElementById('intro-screen');
    const main  = document.getElementById('main-content');

    intro.classList.add('fade-out');
    setTimeout(() => {
      intro.style.display = 'none';
      main.classList.remove('hidden');
      startEverything();
    }, 1000);
  });
})();

function spawnIntroParticles() {
  const container = document.getElementById('intro-particles');
  const symbols = ['💕', '🌸', '✨', '💖', '🌷', '⭐', '🎀'];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('span');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      font-size: ${0.8 + Math.random() * 1.2}rem;
      opacity: ${0.3 + Math.random() * 0.5};
      animation: floatUp ${6 + Math.random() * 8}s ${Math.random() * 4}s linear infinite;
    `;
    container.appendChild(el);
  }
}

// ── START EVERYTHING (after intro) ──────────────────
function startEverything() {
  initParticles();
  initCountdown();
  initCake();
  initLocket();
  initAudio();
  initScrollReveal();
}

// ── FLOATING PARTICLES ──────────────────────────────
function initParticles() {
  const container = document.getElementById('particles');

  function spawn() {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = CONFIG.particles[Math.floor(Math.random() * CONFIG.particles.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -2rem;
      font-size: ${0.8 + Math.random()}rem;
      animation-duration: ${7 + Math.random() * 8}s;
      animation-delay: 0s;
    `;
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  // Spawn periodically
  setInterval(spawn, 1200);
  // Initial burst
  for (let i = 0; i < 8; i++) setTimeout(spawn, i * 300);
}

// ── COUNTDOWN ───────────────────────────────────────
function initCountdown() {
  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');
  const grid    = document.getElementById('countdown-grid');
  const bdMsg   = document.getElementById('birthday-msg');

  function pad(n) { return String(n).padStart(2, '0'); }

  function bump(el) {
    el.classList.remove('bump');
    void el.offsetWidth; // reflow
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 200);
  }

  let prevSecs = -1;

  function tick() {
    const now  = new Date();
    const diff = CONFIG.birthdayDate - now;

    if (diff <= 0) {
      // It's birthday!
      grid.style.display = 'none';
      bdMsg.classList.remove('hidden');
      launchConfetti(120);
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    cdDays.textContent  = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent  = pad(mins);

    if (secs !== prevSecs) {
      cdSecs.textContent = pad(secs);
      bump(cdSecs);
      if (secs === 0) bump(cdMins);
      prevSecs = secs;
    }
  }

  tick();
  setInterval(tick, 500);
}

// ── CAKE & CANDLES ──────────────────────────────────
function initCake() {
  const flames  = Array.from(document.querySelectorAll('.flame'));
  const hint    = document.getElementById('cake-hint');
  const wish    = document.getElementById('cake-wish');
  let blown = 0;
  let allOut = false;

  function blowCandle(flame) {
    if (flame.classList.contains('out')) return;
    flame.classList.add('out');
    blown++;

    if (blown === flames.length && !allOut) {
      allOut = true;
      hint.classList.add('hidden');
      wish.classList.remove('hidden');
      launchConfetti(80);
    }
  }

  // Click on each candle
  document.querySelectorAll('.candle').forEach((candle, i) => {
    candle.addEventListener('click', () => blowCandle(flames[i]));
  });

  // Also click on the whole cake = blow all
  document.getElementById('cake').addEventListener('click', () => {
    flames.forEach(f => blowCandle(f));
  });
}

// ── LOCKET-STYLE GALLERY ────────────────────────────
function initLocket() {
  const images   = CONFIG.galleryImages;
  const mainImg  = document.getElementById('locket-img-main');
  const prevImg  = document.getElementById('locket-img-prev');
  const nextImg  = document.getElementById('locket-img-next');
  const caption  = document.getElementById('locket-caption');
  const dateEl   = document.getElementById('locket-date');
  const dotsEl   = document.getElementById('locket-dots');
  const stage    = document.getElementById('locket-stage');
  let current    = 0;
  let animating  = false;
  let autoTimer;

  function placeholder(text) {
    return `https://placehold.co/400x580/1a0828/f472b6?text=${encodeURIComponent(text)}`;
  }

  function imgSrc(i) {
    const img = images[(i + images.length) % images.length];
    return img ? img.src : '';
  }

  // Build dots
  images.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'locket-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i, i > current ? 'left' : 'right'));
    dotsEl.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.locket-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function setBackCards() {
    const pi = (current - 1 + images.length) % images.length;
    const ni = (current + 1) % images.length;
    prevImg.src = images[pi].src;
    prevImg.onerror = () => { prevImg.src = placeholder(images[pi].caption); };
    nextImg.src = images[ni].src;
    nextImg.onerror = () => { nextImg.src = placeholder(images[ni].caption); };
  }

  function render() {
    const img = images[current];
    mainImg.src = img.src;
    mainImg.onerror = () => { mainImg.src = placeholder(img.caption); };
    caption.textContent = img.caption;
    dateEl.textContent  = img.date;
    setBackCards();
    updateDots();
  }

  function goTo(idx, direction = 'left') {
    if (animating) return;
    animating = true;
    const next = (idx + images.length) % images.length;

    // Clone current image for out-animation
    const outImg = mainImg.cloneNode();
    outImg.className = '';
    document.getElementById('locket-widget').appendChild(outImg);

    // Animate out old
    outImg.classList.add(direction === 'left' ? 'slide-out-left' : 'slide-out-right');

    // Set new image and animate in
    current = next;
    const newSrc = images[current].src;
    mainImg.src = newSrc;
    mainImg.onerror = () => { mainImg.src = placeholder(images[current].caption); };
    mainImg.classList.add(direction === 'left' ? 'slide-in-right' : 'slide-in-left');

    caption.textContent = images[current].caption;
    dateEl.textContent  = images[current].date;
    updateDots();

    setTimeout(() => {
      outImg.remove();
      mainImg.classList.remove('slide-in-right', 'slide-in-left');
      setBackCards();
      animating = false;
    }, 460);

    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1, 'left'), 4000);
  }

  document.getElementById('locket-prev').addEventListener('click', () => goTo(current - 1, 'right'));
  document.getElementById('locket-next').addEventListener('click', () => goTo(current + 1, 'left'));

  // Touch / drag swipe on stage
  let touchStartX = 0;
  stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1, dx < 0 ? 'left' : 'right');
  });

  // Mouse drag
  let mouseStartX = 0, isDragging = false;
  stage.addEventListener('mousedown', e => { mouseStartX = e.clientX; isDragging = true; });
  stage.addEventListener('mouseup',   e => {
    if (!isDragging) return; isDragging = false;
    const dx = e.clientX - mouseStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1, dx < 0 ? 'left' : 'right');
  });
  stage.addEventListener('mouseleave', () => { isDragging = false; });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(current + 1, 'left');
    if (e.key === 'ArrowLeft')  goTo(current - 1, 'right');
  });

  render();
  resetAuto();
}

// ── AUDIO ────────────────────────────────────────────
function initAudio() {
  const btn   = document.getElementById('audio-btn');
  const audio = document.getElementById('bg-music');
  const iconPlay = document.getElementById('icon-play');
  const iconMute = document.getElementById('icon-mute');
  audio.volume = 0.4;

  function setPlaying(playing) {
    iconPlay.classList.toggle('hidden', playing);
    iconMute.classList.toggle('hidden', !playing);
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  // Try autoplay
  audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
}

// ── SCROLL REVEAL ────────────────────────────────────
function initScrollReveal() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(s => s.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
}

// ── CONFETTI ─────────────────────────────────────────
function launchConfetti(count = 60) {
  const colors = ['#f472b6', '#a78bfa', '#fbbf24', '#34d399', '#60a5fa', '#f87171'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: 0s;
      `;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 25);
  }
}
