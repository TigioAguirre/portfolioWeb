/* ===== LLUVIA MATRIX (mismo efecto de fondo que el resto del sitio) ===== */
(function matrixRain(){
  const canvas = document.getElementById('matrixRain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = "アイウエオカキクケコサシスセソ01アイウエオカキクケコ$#{}<>/;=+*";
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let columns, drops, fontSize = 16;

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * -40));
  }

  function draw(){
    ctx.fillStyle = 'rgba(5, 10, 16, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < columns; i++){
      const char = chars[Math.floor(Math.random() * chars.length)];
      const y = drops[i] * fontSize;
      ctx.fillStyle = Math.random() > 0.94 ? '#eef3f8' : '#29b6f6';
      ctx.fillText(char, i * fontSize, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);

  if (prefersReducedMotion){
    draw();
  } else {
    setInterval(draw, 55);
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  // ===== Año en el footer =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Aparición progresiva (fade + slide) de cada tarjeta y título de sección =====
  const revealTargets = document.querySelectorAll('.project-card, .section-title');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  // ===== Galería de capturas: permitir arrastrar con el mouse (drag-to-scroll) =====
  document.querySelectorAll('.shot-gallery').forEach(gallery => {
    let isDown = false, startX, scrollLeft;

    gallery.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(evt =>
      gallery.addEventListener(evt, () => { isDown = false; })
    );
    gallery.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.2;
      gallery.scrollLeft = scrollLeft - walk;
    });
  });
});