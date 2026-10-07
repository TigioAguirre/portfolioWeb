(function () {
  "use strict";
  var S = window.SITE, DOGS = window.DOGS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var wa = function (t) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(t); };
  var coatName = { negro: "negro y blanco", merle: "blue merle", tricolor: "tricolor", chocolate: "chocolate" };

  /* Foto o marcador */
  function photo(d, alt, label, eager) {
    if (d.photo) return '<img class="photo" src="' + esc(d.photo) + '" alt="' + esc(alt) + '" width="800" height="680" decoding="async"' + (eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') + '>';
    return '<div class="ph coat-' + d.coat + '" role="img" aria-label="' + esc(alt) + '"><span>FOTO CLIENTE: ' + esc(label || d.name + ", " + d.color) + '</span></div>';
  }
  var alt = function (d) { return d.name + ", border collie " + d.color.toLowerCase() + " de " + d.ageLabel; };
  var dots = function (n) { var h = ""; for (var i = 1; i <= 5; i++) h += "<i" + (i <= n ? ' class="on"' : "") + "></i>"; return '<span class="dots" aria-hidden="true">' + h + "</span>"; };

  /* Enlaces WhatsApp */
  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = wa(a.dataset.wa); });
  $("#fWa").href = wa("Hola, quiero información."); $("#fWa").textContent = "WhatsApp " + S.whatsappDisplay;
  $("#fMail").href = "mailto:" + S.email; $("#fMail").textContent = S.email;
  $("#fIg").href = S.instagram; $("#fFb").href = S.facebook; $("#fTk").href = S.tiktok;

  /* Tema */
  var root = document.documentElement, tBtn = $("#themeBtn");
  function isDark() { return root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; }
  function syncTheme() { tBtn.setAttribute("aria-label", isDark() ? "Cambiar a tema claro" : "Cambiar a tema oscuro"); }
  tBtn.addEventListener("click", function () { var n = isDark() ? "light" : "dark"; root.dataset.theme = n; try { localStorage.setItem("cdp-theme", n); } catch (e) {} syncTheme(); });
  syncTheme();

  /* Menú móvil */
  var burger = $("#burger"), menu = $("#menu");
  function closeMenu() { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Abrir menú"); }
  burger.addEventListener("click", function () { var o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Cerrar menú" : "Abrir menú"); });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* Hero */
  var hero = DOGS.filter(function (d) { return d.status === "Disponible"; })[1] || DOGS[0];
  $("#heroPhoto").innerHTML = photo(hero, "Retrato de " + alt(hero), "FOTO DESTACADA: " + hero.name, true);
  $("#heroName").textContent = hero.name; $("#heroMeta").textContent = hero.ageLabel + ", " + hero.color;
  $("#breedPhoto").innerHTML = '<img class="photo" src="' + esc(window.BREED_PHOTO) + '" alt="" width="800" height="920" decoding="async" loading="lazy">';

  /* Favoritos */
  var favs = []; try { favs = JSON.parse(localStorage.getItem("cdp-favs") || "[]"); } catch (e) {}
  function saveFavs() { try { localStorage.setItem("cdp-favs", JSON.stringify(favs)); } catch (e) {} }

  /* Catálogo */
  var grid = $("#dogs"), count = $("#count");
  function cardHTML(d) {
    var res = d.status === "Reservado", f = favs.indexOf(d.id) > -1;
    return '<li class="card' + (res ? " is-res" : "") + '">' +
      '<span class="badge ' + (res ? "res" : "ok") + '">' + d.status + "</span>" +
      '<button class="fav" type="button" data-fav="' + d.id + '" aria-pressed="' + f + '" aria-label="Guardar a ' + esc(d.name) + ' en favoritos"><svg class="p-off" aria-hidden="true"><use href="#i-pawo"/></svg><svg class="p-on" aria-hidden="true"><use href="#i-paw"/></svg></button>' +
      '<button class="card-open" type="button" data-open="' + d.id + '" aria-label="Ver a ' + esc(d.name) + '">' +
      '<div class="card-img">' + photo(d, alt(d)) + "</div>" +
      '<div class="card-body"><div class="card-top"><h3>' + esc(d.name) + '</h3><span class="fee">$' + d.fee + "</span></div>" +
      '<p class="meta">' + d.sex + ", " + d.ageLabel + ", " + esc(d.color) + "</p>" +
      '<ul class="tags">' + d.traits.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
      '<div class="energy">Energía ' + dots(d.energy) + '<span class="sr">' + d.energy + " de 5</span></div></div></button></li>";
  }
  function render() {
    var q = $("#fq").value.trim().toLowerCase(), age = $("#fage").value, sex = $("#fsex").value, en = $("#fen").value;
    var list = DOGS.filter(function (d) {
      if (q && (d.name + " " + d.color + " " + coatName[d.coat]).toLowerCase().indexOf(q) < 0) return false;
      if (age && d.ageGroup !== age) return false;
      if (sex && d.sex !== sex) return false;
      if (en === "low" && d.energy > 2) return false;
      if (en === "mid" && d.energy !== 3) return false;
      if (en === "high" && d.energy < 4) return false;
      return true;
    });
    count.textContent = list.length === 1 ? "1 perro encontrado" : list.length + " perros encontrados";
    grid.innerHTML = list.length ? list.map(cardHTML).join("") : '<li class="empty">No hay perros con esos filtros. <a href="#solicitud">Déjanos tu solicitud</a> y te avisamos cuando llegue uno.</li>';
  }
  ["fq", "fage", "fsex", "fen"].forEach(function (id) { $("#" + id).addEventListener("input", render); });
  grid.addEventListener("click", function (e) {
    var f = e.target.closest("[data-fav]");
    if (f) { var id = f.dataset.fav, i = favs.indexOf(id); if (i > -1) favs.splice(i, 1); else favs.push(id); saveFavs(); f.setAttribute("aria-pressed", i < 0); return; }
    var o = e.target.closest("[data-open]"); if (o) openModal(o.dataset.open, o);
  });

  /* Modal de detalle */
  var modal = $("#modal"), lastBtn = null;
  function openModal(id, btn) {
    var d = DOGS.filter(function (x) { return x.id === id; })[0]; if (!d) return;
    lastBtn = btn; var res = d.status === "Reservado";
    modal.innerHTML = '<button class="m-close" type="button" aria-label="Cerrar"><svg aria-hidden="true"><use href="#i-x"/></svg></button><div class="m-grid">' +
      '<div class="m-img">' + photo(d, alt(d)) + "</div><div class=\"m-body\">" +
      '<span class="badge ' + (res ? "res" : "ok") + '" style="position:static;display:inline-block;margin-bottom:.7rem">' + d.status + "</span>" +
      '<h2 id="mName" style="font-size:var(--fs-xl)">' + esc(d.name) + "</h2>" +
      '<p class="meta">' + d.sex + ", " + d.ageLabel + ", " + esc(d.color) + "</p>" +
      '<ul class="tags">' + d.traits.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul><div class="energy">Energía ' + dots(d.energy) + "</div>" +
      '<p style="margin-top:1rem">' + esc(d.story) + '</p><h3 style="font-size:var(--fs-base);margin-top:1.25rem">Salud</h3>' +
      '<ul class="check">' + d.health.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" +
      '<div class="m-fee"><div><small>Donación de adopción</small><b>$' + d.fee + "</b></div>" +
      (res ? '<a class="btn btn-dark" href="' + wa("Hola, quiero que me avisen si " + d.name + " vuelve a estar disponible.") + '" target="_blank" rel="noopener">Avísame si se libera</a>'
        : '<button class="btn btn-sun" type="button" data-adopt="' + d.id + '">Quiero adoptarlo</button>') +
      '</div><p class="hint" style="margin-top:.8rem">Incluye vacunas, microchip y revisión veterinaria.</p></div></div>';
    modal.showModal();
  }
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.closest(".m-close")) modal.close();
    var a = e.target.closest("[data-adopt]");
    if (a) { $("#dog").value = a.dataset.adopt; modal.close(); lastBtn = null; location.hash = "solicitud"; setTimeout(function () { $("#name").focus({ preventScroll: true }); }, 400); }
  });
  modal.addEventListener("close", function () { if (lastBtn) lastBtn.focus(); });

  /* Raza */
  var meters = [["Energía", 5, "Necesita 2 horas de actividad al día"], ["Inteligencia", 5, "Aprende rápido y se aburre rápido"], ["Con niños", 4, "Cariñoso, pero tiende a «pastorear»"], ["En departamento", 3, "Posible si hay paseos largos"], ["Cuidado del pelaje", 3, "Cepillado 2 o 3 veces por semana"]];
  $("#meters").innerHTML = meters.map(function (m) {
    var b = ""; for (var i = 1; i <= 5; i++) b += "<i" + (i <= m[1] ? ' class="on"' : "") + "></i>";
    return '<li class="meter"><b>' + m[0] + '</b><span class="bars" role="img" aria-label="' + m[1] + ' de 5">' + b + "</span><small>" + m[2] + "</small></li>";
  }).join("");

  /* FAQ */
  $("#faq").innerHTML = window.FAQ.map(function (f) { return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>"; }).join("");

  /* Formulario */
  $("#dog").innerHTML = '<option value="">Aún no sé, quiero que me recomienden</option>' + DOGS.filter(function (d) { return d.status === "Disponible"; }).map(function (d) { return '<option value="' + d.id + '">' + esc(d.name) + " (" + d.ageLabel + ", $" + d.fee + ")" + "</option>"; }).join("");
  $("#sector").innerHTML = '<option value="">Elige…</option>' + S.sectors.map(function (s) { return "<option>" + esc(s) + "</option>"; }).join("");
  var form = $("#form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, first = null;
    function mark(id, valid) { var w = $("#" + id).closest("[data-f]"); w.classList.toggle("invalid", !valid); $("#" + id).setAttribute("aria-invalid", !valid); if (!valid) { ok = false; first = first || $("#" + id); } }
    mark("name", $("#name").value.trim().length > 1);
    mark("phone", /^(\+?593|0)?9\d{8}$/.test($("#phone").value.replace(/[\s-]/g, "")));
    mark("sector", !!$("#sector").value); mark("housing", !!$("#housing").value); mark("consent", $("#consent").checked);
    if (!ok) { first.focus(); return; }
    var d = DOGS.filter(function (x) { return x.id === $("#dog").value; })[0];
    var msg = "Hola, quiero adoptar" + (d ? " a " + d.name : " un border collie") + ".\n" +
      "Nombre: " + $("#name").value.trim() + "\nWhatsApp: " + $("#phone").value.trim() + "\nSector: " + $("#sector").value + "\nVivienda: " + $("#housing").value +
      "\nExperiencia: " + $("#exp").value + "\nTiempo solo: " + $("#alone").value;
    window.open(wa(msg), "_blank", "noopener");
    $("#ok").classList.add("show");
  });
  form.addEventListener("input", function (e) { var w = e.target.closest("[data-f]"); if (w) w.classList.remove("invalid"); });

  render();
})();
