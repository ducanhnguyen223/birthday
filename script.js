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
  initAudio();
  initScrollReveal();
  initGacha();
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
  const flames       = Array.from(document.querySelectorAll('.flame'));
  const hint         = document.getElementById('cake-hint');
  const wishWrap     = document.getElementById('cake-wish');
  const wishSent     = wishWrap.querySelector('.wish-sent');
  const wishDisplay  = document.getElementById('wish-display');
  const wishInput    = document.getElementById('wish-input');
  const wishInputWrap = document.getElementById('wish-input-wrap');
  const cheerSound   = document.getElementById('cheer-sound');
  let blown = 0;
  let allOut = false;

  function blowCandle(flame) {
    if (flame.classList.contains('out')) return;
    flame.classList.add('out');
    blown++;

    if (blown === flames.length && !allOut) {
      allOut = true;

      // Ẩn hint + input
      hint.classList.add('hidden');
      wishInputWrap.classList.add('hidden');

      // Hiện wish confirmed
      const typed = wishInput.value.trim();
      wishDisplay.textContent = typed ? `"${typed}"` : '';
      wishWrap.classList.remove('hidden');

      // Âm thanh hò reo
      if (cheerSound.readyState >= 1) {
        cheerSound.currentTime = 0;
        cheerSound.play().catch(() => {});
      }

      // Confetti
      launchConfetti(100);

      // Reveal gallery + letter sau 1.2s
      setTimeout(() => revealSections(), 1200);
    }
  }

  document.querySelectorAll('.candle').forEach((candle, i) => {
    candle.addEventListener('click', () => blowCandle(flames[i]));
  });

  document.getElementById('cake').addEventListener('click', () => {
    flames.forEach(f => blowCandle(f));
  });
}

// ── REVEAL SECTIONS SAU KHI THỔI NẾN ───────────────
function revealSections() {
  const ids = ['section-gallery', 'section-message', 'gacha-btn-wrap', 'site-footer'];
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    setTimeout(() => {
      el.classList.add('revealed');
      el.classList.remove('reveal');
      el.classList.add('visible');
    }, i * 300);
  });
  // Khởi tạo locket sau khi section hiện
  setTimeout(() => initLocket(), 100);
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
  // Chỉ apply cho countdown + cake, không phải gallery/letter (unlock sau khi thổi nến)
  const sections = document.querySelectorAll('.section:not(.section-hidden)');
  sections.forEach(s => s.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
}

// ── GACHA MINI-GAME ──────────────────────────────────
function initGacha() {
  // ── Reward pool ─────────────────────────────────
  // weight: tỉ lệ tương đối. Được normalize khi roll.
  const REWARDS = [
    {
      id: 'money_3030',
      tier: 1,
      icon: '💵',
      name: '3.030 VNĐ',
      weight: 99,       // 99% (tier 1)
    },
    {
      id: 'face_wash',
      tier: 2,
      icon: '🫧',
      name: 'Bộ máy rửa mặt',
      img: 'photos/reward-facewash.jpg',  // bạn thêm ảnh sau
      weight: 35,       // ~35% (tier 2) — tỉ lệ bạn điều chỉnh ở đây
    },
    {
      id: 'miss',
      tier: 'miss',
      icon: '🌙',
      name: 'Chúc em ngủ ngon~',
      weight: 40,       // miss
    },
    {
      id: 'billion',
      tier: 3,
      icon: '💰',
      name: '5.000.000.000 VNĐ',
      weight: 0.001,    // gần như không bao giờ
    },
  ];

  const TOTAL_CARDS  = 9;
  const MAX_TURNS    = 3;
  const TIMER_SECS   = 30;
  const CIRCUMFERENCE = 2 * Math.PI * 34; // 213.6

  let turnsLeft  = MAX_TURNS;
  let timerSec   = TIMER_SECS;
  let timerInterval = null;
  let gameOver   = false;
  let cardRewards = []; // reward được assign cho mỗi thẻ

  // ── DOM refs ────────────────────────────────────
  const overlay      = document.getElementById('gacha-overlay');
  const btnOpen      = document.getElementById('btn-open-gacha');
  const btnClose     = document.getElementById('gacha-close');
  const grid         = document.getElementById('gacha-grid');
  const turnsEl      = document.getElementById('gacha-turns-left');
  const timerNumEl   = document.getElementById('gacha-timer-num');
  const ringFill     = document.getElementById('ring-fill');
  const resultBox    = document.getElementById('gacha-result');
  const resultInner  = document.getElementById('gacha-result-inner');
  const hintText     = document.getElementById('gacha-hint-text');

  // ── Helpers ─────────────────────────────────────
  function roll() {
    const total = REWARDS.reduce((s, r) => s + r.weight, 0);
    let rand = Math.random() * total;
    for (const r of REWARDS) {
      rand -= r.weight;
      if (rand <= 0) return r;
    }
    return REWARDS[0];
  }

  function buildCards() {
    grid.innerHTML = '';
    cardRewards = [];

    // Assign rewards — guarantee tier-1 shows ≥1 times to keep promise
    for (let i = 0; i < TOTAL_CARDS; i++) {
      cardRewards.push(roll());
    }

    cardRewards.forEach((reward, i) => {
      const card = document.createElement('div');
      card.className = 'g-card';
      card.dataset.index = i;
      card.style.setProperty('--i', i);

      const inner = document.createElement('div');
      inner.className = 'g-card-inner';

      // Front
      const front = document.createElement('div');
      front.className = 'g-card-front';
      front.innerHTML = `
        <span class="card-deco">✨</span>
        <span class="card-num">${String(i + 1).padStart(2,'0')}</span>
      `;

      // Back
      const back = document.createElement('div');
      back.className = `g-card-back tier-${reward.tier}`;

      if (reward.tier === 'miss') {
        back.innerHTML = `
          <span class="reward-icon">${reward.icon}</span>
          <span class="reward-name">${reward.name}</span>
        `;
      } else if (reward.img) {
        back.innerHTML = `
          <img class="reward-img"
               src="${reward.img}"
               onerror="this.style.display='none';this.previousSibling && (this.previousSibling.style.display='block')"
               alt="${reward.name}" />
          <span class="reward-icon" style="display:none">${reward.icon}</span>
          <span class="reward-name">${reward.name}</span>
        `;
      } else {
        back.innerHTML = `
          <span class="reward-icon">${reward.icon}</span>
          <span class="reward-name">${reward.name}</span>
        `;
      }

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      card.addEventListener('click', () => onCardClick(card, i));
      grid.appendChild(card);
    });
  }

  function onCardClick(card, idx) {
    if (gameOver || card.classList.contains('flipped') || turnsLeft <= 0) return;

    card.classList.add('flipped', 'used');
    turnsLeft--;
    turnsEl.textContent = turnsLeft;

    const reward = cardRewards[idx];
    showResult(reward);

    if (turnsLeft <= 0) {
      setTimeout(() => endGame(), 800);
    }
  }

  function showResult(reward) {
    resultBox.classList.remove('hidden');
    hideResultTimeout = setTimeout(() => resultBox.classList.add('hidden'), 2200);

    if (reward.tier === 'miss') {
      resultInner.innerHTML = `
        <div class="result-icon">🌙</div>
        <div class="result-title">Lần này chưa trúng</div>
        <div class="result-miss">${reward.name}</div>
        <div class="result-close-hint">tự tắt sau 2s</div>
      `;
    } else {
      const prizeClass = reward.tier === 3 ? 'gold' : '';
      resultInner.innerHTML = `
        <div class="result-icon">${reward.icon}</div>
        <div class="result-title">🎉 Chúc mừng!</div>
        <div class="result-prize ${prizeClass}">${reward.name}</div>
        <div class="result-close-hint">tự tắt sau 2s</div>
      `;
      launchConfetti(reward.tier === 3 ? 150 : 60);
    }
  }

  let hideResultTimeout = null;

  function endGame() {
    gameOver = true;
    stopTimer();

    // Lật hết các thẻ còn lại
    document.querySelectorAll('.g-card:not(.flipped)').forEach(c => {
      c.classList.add('flipped', 'used');
    });

    resultBox.classList.add('hidden');
    hintText.textContent = 'Hết lượt rồi! Hy vọng em thích quà nhé 🎁';
  }

  // ── Timer ────────────────────────────────────────
  function startTimer() {
    timerSec   = TIMER_SECS;
    timerNumEl.textContent = timerSec;
    ringFill.style.strokeDashoffset = 0;
    timerNumEl.classList.remove('urgent');
    ringFill.classList.remove('urgent');

    timerInterval = setInterval(() => {
      timerSec--;
      timerNumEl.textContent = timerSec;

      const progress = (TIMER_SECS - timerSec) / TIMER_SECS;
      ringFill.style.strokeDashoffset = CIRCUMFERENCE * progress;

      if (timerSec <= 10) {
        timerNumEl.classList.add('urgent');
        ringFill.classList.add('urgent');
      }

      if (timerSec <= 0) endGame();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // ── Open / Close ────────────────────────────────
  function openModal() {
    // Reset state
    turnsLeft = MAX_TURNS;
    gameOver  = false;
    turnsEl.textContent = turnsLeft;
    resultBox.classList.add('hidden');
    hintText.textContent = 'Chọn một thẻ bất kỳ để lật ✨';

    buildCards();
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    startTimer();
  }

  function closeModal() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    stopTimer();
    clearTimeout(hideResultTimeout);
  }

  btnOpen.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
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
