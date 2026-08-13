/* ===== LLUVIA MATRIX (fondo, tono azul) ===== */
(function matrixRain(){
  const canvas = document.getElementById('matrixRain');
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
  document.getElementById('year').textContent = new Date().getFullYear();

  // ===== Navbar: sombra al hacer scroll + link activo =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], .hero[id]');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = sections[0].id;
    const offset = 120;
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - offset) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  // ===== Menú hamburguesa (mobile) =====
  const burger = document.getElementById('burger');
  const navList = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navList.classList.toggle('open');
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    burger.classList.remove('open');
    navList.classList.remove('open');
  }));

  // ===== Efecto "máquina de escribir" en el rol del hero =====
  const roles = ['Desarrollador de Software', 'Desarrollador Web en Quito', 'Estudiante de Ingeniería', 'Pasante de TI en Quito', 'Líder de Equipo'];
  const typedEl = document.getElementById('typed');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  // ===== Revelado de secciones + barras de habilidades al hacer scroll =====
  const revealTargets = document.querySelectorAll(
    '.about-content, .about-avatar, .journey-col, .skills-col, .contact-form, .tl-item'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const bars = document.querySelectorAll('.bar');
  const techTiles = document.querySelectorAll('.tech-tile');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        if (entry.target.classList.contains('bar')) {
          const fill = entry.target.querySelector('.bar-fill');
          fill.style.width = entry.target.dataset.value + '%';
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  revealTargets.forEach(el => observer.observe(el));
  bars.forEach(bar => observer.observe(bar));
  techTiles.forEach(tile => observer.observe(tile));

  // ===== Formulario de contacto =====
// ===== Formulario de contacto → WhatsApp =====
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const WHATSAPP_NUMBER = '593995920940'; // ej: '593987654321'

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  const texto =
    `Hola Remigio, soy ${name}.\n` +
    `Mi Correo es: ${email}\n` +
    (phone ? `Mi Teléfono es: ${phone}\n` : '') +
    `Te escribo para: ${subject}\n` +
    `${message}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

  note.textContent = 'Abriendo WhatsApp con tu mensaje listo…';
  window.open(url, '_blank');
  form.reset();
});

});