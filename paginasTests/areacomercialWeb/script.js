document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. ANIMACIÓN DE ENTRADA (Intro)
     ========================================================= */
  const intro = document.getElementById('intro');
  const mainContent = document.getElementById('main-content');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    intro.remove();
    mainContent.classList.add('visible');
  } else {
    // --- TIEMPOS DE LA ANIMACIÓN ---
    const T_GREET = 0;      // Aparece el logo (fade + escala)
    const T_TEAR = 1000;    // Empieza el "rasguño" que revela el subtítulo
    const T_SHINE = 1900;   // Destello que recorre el logo ya completo
    const T_DONE = 3000;    // Fin de la animación, pasamos a la web

    setTimeout(() => intro.classList.add('phase-greet'), T_GREET);
    setTimeout(() => intro.classList.add('phase-tear'), T_TEAR);
    setTimeout(() => intro.classList.add('phase-shine'), T_SHINE);

    setTimeout(() => {
      mainContent.classList.add('visible');
      intro.classList.add('phase-done');
      setTimeout(() => intro.remove(), 400);
    }, T_DONE);
  }

  /* =========================================================
     2. SOMBRA EN EL HEADER FIJO AL HACER SCROLL
     ========================================================= */
  const siteHeader = document.getElementById('siteHeader');
  const toggleHeaderShadow = () => {
    if (window.scrollY > 4) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };
  toggleHeaderShadow();
  window.addEventListener('scroll', toggleHeaderShadow, { passive: true });

  /* =========================================================
     3. SLIDER / CARRUSEL PRINCIPAL (funcional)
     ========================================================= */
  const track = document.getElementById('sliderTrack');
  const slides = Array.from(track.children);
  const dots = Array.from(document.querySelectorAll('#sliderDots .dot'));
  const prevBtn = document.getElementById('prevArrow');
  const nextBtn = document.getElementById('nextArrow');
  const slider = document.getElementById('heroSlider');

  const AUTOPLAY_MS = 5000;
  let currentIndex = 0;
  let autoplayTimer = null;

  function goToSlide(index) {
    const total = slides.length;
    currentIndex = (index + total) % total;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i === currentIndex ? 'false' : 'true');
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  // Controles manuales
  nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
  prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index, 10));
      startAutoplay();
    });
  });

  // Pausa el autoplay mientras el usuario interactúa con el slider
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Soporte táctil (swipe) para móviles
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 40) {
      delta < 0 ? nextSlide() : prevSlide();
    }
    startAutoplay();
  }, { passive: true });

  // Navegación con teclado cuando el slider tiene foco
  slider.setAttribute('tabindex', '0');
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
    if (e.key === 'ArrowLeft') { prevSlide(); startAutoplay(); }
  });

  goToSlide(0);
  startAutoplay();
});