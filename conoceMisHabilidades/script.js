/* ===== LLUVIA MATRIX (mismo efecto de fondo que la página principal) ===== */
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

  // ===== Vista previa de cada certificado (PDF -> canvas) con pdf.js =====
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';
  }

  async function renderCertThumbnail(card){
    const url = card.dataset.pdf;
    const canvas = card.querySelector('.cert-canvas');
    const container = canvas.parentElement; // .cert-preview
    if (!url || !canvas || !window.pdfjsLib) {
      card.classList.add('pdf-error');
      return;
    }
    try {
      const pdf = await pdfjsLib.getDocument({
        url,
        // Son PDFs de una sola página y pequeños: forzamos descarga completa
        // en vez de peticiones "Range", que a veces fallan de forma
        // intermitente contra el hosting (Vercel) y rompen la vista previa
        // de algunos certificados sin que el PDF esté dañado.
        disableStream: true,
        disableAutoFetch: true,
      }).promise;
      const page = await pdf.getPage(1);
      const baseViewport = page.getViewport({ scale: 1 });

      const containerW = container.clientWidth;
      const containerH = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      // ajustamos la escala para que la página quepa entera (contain), con
      // resolución extra para que se vea nítida al agrandarse en el hover
      const fitScale = Math.min(containerW / baseViewport.width, containerH / baseViewport.height);
      const renderScale = fitScale * dpr * 1.3;
      const viewport = page.getViewport({ scale: renderScale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = (viewport.width / dpr / 1.3) + 'px';
      canvas.style.height = (viewport.height / dpr / 1.3) + 'px';

      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;
      card.classList.add('pdf-ready');
    } catch (err) {
      console.warn('No se pudo generar la vista previa del certificado:', url, err);
      card.classList.add('pdf-error');
    }
  }

  const certCards = document.querySelectorAll('.cert-card');

  // Cargamos el PDF solo cuando la tarjeta entra en pantalla (mejor rendimiento)
  const pdfObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        renderCertThumbnail(entry.target);
        pdfObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '200px 0px' });

  certCards.forEach(el => pdfObserver.observe(el));

  // ===== Aparición progresiva (fade + slide) de las tarjetas =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  certCards.forEach(el => revealObserver.observe(el));
});