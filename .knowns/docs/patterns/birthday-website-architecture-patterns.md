---
title: Birthday Website — Architecture & Patterns
createdAt: '2026-03-01T18:55:11.820Z'
updatedAt: '2026-03-01T18:57:01.320Z'
description: >-
  Kiến trúc và các pattern đã dùng cho birthday website static (HTML/CSS/JS
  thuần, GitHub Pages)
tags:
  - pattern
  - frontend
  - static-site
  - birthday
---
# Birthday Website — Architecture & Patterns

## Stack Decision

**Static site (HTML/CSS/JS thuần) > React** cho romantic/gift websites vì:
- Không cần state management phức tạp
- Animation với CSS + vanilla JS đủ mạnh (GSAP/anime.js nếu cần)
- Deploy GitHub Pages miễn phí, zero config
- React = overkill khi không có: auth, database, real-time, complex state

---

## Flow Chính

```
Intro Screen (dark bg)
  → [Mở quà] click
    → fade out intro, fade in main (same dark bg = seamless)
      → Countdown timer
      → Cake section (wish input + candles)
        → Thổi hết nến
          → cheer sound + confetti
          → Reveal: gallery + letter + gacha btn (staggered 300ms)
            → [Nhận quà] → Gacha modal popup
```

**Key insight:** Ẩn gallery/letter/gacha khi load. Dùng `.section-hidden` → `.revealed` thay vì `display:none` để transition được.

---

## Dark Theme Seamless

Intro và main content dùng cùng palette `#0f0517` → không bị "jump" màu khi transition.

```css
:root {
  --bg:       #0f0517;
  --bg-2:     #1a0829;
  --bg-card:  rgba(255,255,255,0.05);
  --border:   rgba(244,114,182,0.18);
  --text:     #f0d8ec;
  --text-sub: #b088b8;
  --pink:     #f472b6;
  --purple:   #a78bfa;
}
```

Ambient glow blobs tạo depth mà không cần ảnh:
```css
#main-content::before { /* purple top-left blob */ }
#main-content::after  { /* pink bottom-right blob */ }
```

---

## Progressive Reveal Pattern

Sections ẩn ban đầu, unlock bằng event (thổi nến):

```css
.section-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(40px);
  transition: opacity 1s ease, transform 1s ease;
}
.section-hidden.revealed {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
```

```js
function revealSections() {
  const ids = ['section-gallery', 'section-message', 'gacha-btn-wrap', 'site-footer'];
  ids.forEach((id, i) => {
    setTimeout(() => {
      document.getElementById(id).classList.add('revealed');
    }, i * 300); // stagger
  });
}
```

---

## Locket-Style Gallery

Phone frame CSS với depth effect:
- 2 "back cards" nghiêng `±6deg`, `scale(0.88)`, `brightness(0.7)`
- Front card = phone shell với notch pseudo-element
- Slide animation: clone outgoing image → animate out + new image animate in simultaneously

```js
// Slide direction
outImg.classList.add(dir === 'left' ? 'slide-out-left' : 'slide-out-right');
mainImg.classList.add(dir === 'left' ? 'slide-in-right' : 'slide-in-left');
```

Supports: touch swipe, mouse drag, keyboard arrows, dot indicators, auto-advance.

---

## Wish Input — Subtle Style

Không dùng border-box input thông thường. Chỉ bottom-border + transparent bg:

```css
.wish-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(244,114,182,0.3);
  color: var(--text-sub);
  font-style: italic;
  caret-color: var(--pink);
}
.wish-input:focus { border-bottom-color: rgba(244,114,182,0.7); }
```

---

## Gacha Modal Pattern

**Guaranteed rigged gacha** — vui nhưng kết quả đã định sẵn:

### Bố cục board 9 thẻ (match-2):
```
[3030][3030][wash]
[wash][5tỷ ][miss]
[miss][miss][miss]
```
- 2× tier-1 (3030) → guaranteed match
- 2× tier-2 (máy rửa mặt) → guaranteed match  
- 1× tier-3 (5 tỷ) → chỉ 1 thẻ, không bao giờ match → tuyệt vọng
- 4× miss → lấp đầy

### Timer ring SVG:
```css
stroke-dasharray: 213.6;   /* 2π × r=34 */
stroke-dashoffset: CIRCUMFERENCE * (elapsed / total);
```

### Cơ chế match:
1. Click thẻ 1 → flip, lưu `pendingCard`
2. Click thẻ 2 → flip, so sánh `id`
3. Match → win animation + add to prizes
4. No match → flip ngược lại sau 1s

---

## Audio Pattern

```js
// Autoplay với fallback
audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));

// Sound effect (one-shot)
cheerSound.currentTime = 0;
cheerSound.play().catch(() => {});
```

File structure: `audio/birthday.mp3` (nhạc nền loop), `audio/cheer.mp3` (one-shot)

---

## Source

@task-wjtvb7
