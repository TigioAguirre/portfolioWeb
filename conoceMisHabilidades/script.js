const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fecha = new Date().toLocaleDateString("es-EC", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});

const logLines = [
  { text: "$ whoami", type: "cmd" },
  { text: "> Remigio Aguirre — Estudiante de Ingeniería de Software / Desarrollador Web en Quito", type: "out" },
  { text: "", type: "out" },
  { text: "$ ls certificaciones/", type: "cmd" },
  { text: "> AWS Cloud Foundations · Cisco CCST IT Support · Red Hat Linux · Python Essentials 2", type: "out" },
  { text: "", type: "out" },
  { text: "$ ./build_seccion.sh --certificados", type: "cmd" },
  { text: "> Subiendo credenciales y enlaces de verificación... esto puede tardar unos días", type: "muted" },
  { text: "> Última actualización: " + fecha, type: "muted" }
];

const logEl = document.getElementById("log");
const progressFill = document.getElementById("progressFill");
const progressPct = document.getElementById("progressPct");

function renderInstant() {
  logEl.textContent = logLines.map(l => l.text).join("\n");
  startProgress();
}

function typeLines(lines, container, onDone) {
  let lineIndex = 0;
  let charIndex = 0;

  function step() {
    if (lineIndex >= lines.length) {
      onDone();
      return;
    }
    const current = lines[lineIndex];
    if (charIndex === 0) {
      const span = document.createElement("span");
      span.className = "line-" + current.type;
      span.dataset.buffer = "";
      container.appendChild(span);
    }
    const activeSpan = container.lastElementChild;
    if (charIndex < current.text.length) {
      activeSpan.textContent += current.text[charIndex];
      charIndex++;
      setTimeout(step, 14 + Math.random() * 22);
    } else {
      container.appendChild(document.createTextNode("\n"));
      lineIndex++;
      charIndex = 0;
      setTimeout(step, 90);
    }
  }
  step();
}

function startProgress() {
  const target = 30;
  requestAnimationFrame(() => {
    progressFill.style.width = target + "%";
  });
  const duration = prefersReducedMotion ? 0 : 1400;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const ratio = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
    progressPct.textContent = Math.round(target * ratio) + "%";
    if (ratio < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (prefersReducedMotion) {
  renderInstant();
} else {
  typeLines(logLines, logEl, startProgress);
}
