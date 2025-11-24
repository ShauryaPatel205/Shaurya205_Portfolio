// main.js — merged particle/fire + BGMI Live + 3D icon tilt
(() => {
  // Canvas flame/particles
  const canvas = document.getElementById('bg-canvas');
  const bgWrap = document.getElementById('bg-wrap');
  const ctx = canvas.getContext('2d');

  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  let particles = [];
  let liveMode = false;

  // resize
  window.addEventListener('resize', () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  });

  // Particle class
  class P {
    constructor(x, y, colorShift = 0) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * (2 + Math.random()*4);
      this.vy = -Math.random() * (4 + Math.random()*6) - 1;
      this.life = 60 + Math.random() * 40;
      this.size = 6 + Math.random() * 12;
      this.h = Math.floor(20 + Math.random() * 120) + colorShift;
      this.alpha = 1;
    }
    update() {
      this.vy += 0.18; // gravity
      this.vx *= 0.995;
      this.x += this.vx;
      this.y += this.vy;
      this.size *= 0.97;
      this.life--;
      this.alpha = Math.max(0, this.life / 100);
    }
    draw(ctx) {
      ctx.beginPath();
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      g.addColorStop(0, `hsla(${this.h},100%,60%,${this.alpha})`);
      g.addColorStop(0.4, `hsla(${this.h+20},100%,50%,${this.alpha*0.75})`);
      g.addColorStop(1, `hsla(${this.h+40},100%,30%,0)`);
      ctx.fillStyle = g;
      ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function spawn(x, y, count = 18, colorShift = 0) {
    for (let i = 0; i < count; i++) particles.push(new P(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 30, colorShift));
  }

  // interaction
  function pointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    spawn(x, y, 28, liveMode ? 10 : 0);
  }

  function enablePointer() {
    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('touchstart', pointerDown, { passive: true });
    canvas.addEventListener('click', pointerDown);
  }

  ['touchstart', 'pointerdown', 'click'].forEach(ev => {
    window.addEventListener(ev, function once() {
      enablePointer();
      ['touchstart', 'pointerdown', 'click'].forEach(e => window.removeEventListener(e, once));
    });
  });

  // animation loop
  function frame() {
    // subtle dark / glow backing
    ctx.clearRect(0, 0, w, h);

    // optional slow background glow for live mode
    if (liveMode) {
      ctx.fillStyle = 'rgba(12, 8, 20, 0.06)';
      ctx.fillRect(0, 0, w, h);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0 || p.size <= 0.2) particles.splice(i, 1);
    }

    requestAnimationFrame(frame);
  }
  frame();

  // tab visibility optimization (rAF pauses on hidden typically)
  document.addEventListener('visibilitychange', () => { /* placeholder */ });

  // **********************
  // 3D icon tilt behavior
  // **********************
  (function iconTilt(){
    const cards = document.querySelectorAll('.icon-card');

    cards.forEach(card => {
      let bounds = card.getBoundingClientRect();
      function updateBounds(){ bounds = card.getBoundingClientRect(); }
      window.addEventListener('resize', updateBounds);

      card.addEventListener('pointermove', (ev) => {
        if (!bounds) updateBounds();
        const cx = bounds.left + bounds.width / 2;
        const cy = bounds.top + bounds.height / 2;
        const dx = (ev.clientX - cx) / (bounds.width / 2); // -1..1
        const dy = (ev.clientY - cy) / (bounds.height / 2);
        const rotateY = dx * 10; // deg
        const rotateX = -dy * 10;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        const plate = card.querySelector('.plate');
        if (plate) plate.style.transform = `translateZ(36px) translateY(${ -Math.abs(dy)*6 }px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        const plate = card.querySelector('.plate');
        if (plate) plate.style.transform = '';
      });

      card.addEventListener('pointerdown', () => {
        card.style.transition = 'transform 120ms';
        card.style.transform += ' scale(0.994)';
      });
      card.addEventListener('pointerup', () => {
        card.style.transition = '';
        card.style.transform = '';
      });
    });
  })();

  // **********************
  // BGMI Live Toggle
  // **********************
  const toggleBtn = document.getElementById('toggle-live');
  toggleBtn?.addEventListener('click', () => {
    liveMode = !liveMode;
    document.documentElement.classList.toggle('bgmi-live', liveMode);
    toggleBtn.textContent = `BGMI Live: ${liveMode ? 'On' : 'Off'}`;
    if (liveMode) {
      // small auto spawn effect to feel live
      const cx = innerWidth * 0.75;
      const cy = innerHeight * 0.6;
      const t = setInterval(()=> spawn(cx + (Math.random()-0.5)*140, cy + (Math.random()-0.5)*80, 16, 18), 700);
      toggleBtn._interval = t;
    } else {
      clearInterval(toggleBtn._interval);
    }
  });

  // small helpful keyboard shortcut: L toggles live
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'l') toggleBtn?.click();
  });

})();
