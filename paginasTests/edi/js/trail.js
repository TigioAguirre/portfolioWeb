/* Rastro de huellas ligado al scroll.
   1) hilera en el borde del encabezado que avanza con el progreso de la pagina;
   2) rastro bajo cada titular que aparece huella por huella (IntersectionObserver). */
(function () {
  "use strict";
  var hdr = document.querySelector(".hdr");
  if (!hdr) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STEP = 26;

  var bar = document.createElement("div");
  bar.className = "trail-progress";
  bar.setAttribute("aria-hidden", "true");
  hdr.appendChild(bar);
  var paws = [], lit = -1, maxScroll = 0;

  function measure() {
    maxScroll = document.documentElement.scrollHeight - innerHeight;
  }
  function build() {
    var n = Math.max(6, Math.floor(innerWidth / STEP));
    bar.innerHTML = "";
    paws = [];
    for (var i = 0; i < n; i++) {
      var p = document.createElement("i");
      p.className = i % 2 ? "up" : "";
      bar.appendChild(p);
      paws.push(p);
    }
    lit = -1;
    measure();
    update();
  }
  function update() {
    var prog = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    var n = Math.round(prog * paws.length);
    if (n === lit) return;
    for (var i = 0; i < paws.length; i++) {
      paws[i].classList.toggle("on", i < n);
      paws[i].classList.toggle("now", n > 0 && i === n - 1);
    }
    lit = n;
  }

  var ticking = false;
  addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  addEventListener("resize", build);
  if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); update(); }).observe(document.body);
  build();

  /* Rastros de los titulares: aparecen en 4 pasos al entrar en pantalla */
  var heads = [].slice.call(document.querySelectorAll(".sec-head"));
  if (reduce || !("IntersectionObserver" in window)) {
    heads.forEach(function (h) { h.style.setProperty("--p", "1"); });
  } else {
    heads.forEach(function (h) { h.style.setProperty("--p", "0"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var visible = e.isIntersecting ? e.intersectionRatio : 0;
        var steps = Math.min(4, Math.ceil(visible * 4));
        var prev = parseFloat(e.target.style.getPropertyValue("--p")) || 0;
        var next = Math.max(prev, steps / 4);
        e.target.style.setProperty("--p", String(next));
      });
    }, { threshold: [0.05, 0.25, 0.5, 0.75, 1], rootMargin: "0px 0px -8% 0px" });
    heads.forEach(function (h) { io.observe(h); });
  }
})();
