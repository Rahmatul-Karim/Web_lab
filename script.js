/* PlaySpace: games list, 3D-style icons, hero, launcher, game screen and Live API Integrations. */
const GAMES = [
  { id: "battle",  name: "Battle Quiz BD", cat: "App",  sub: "Live API Trivia", a: "#7c6cff", b: "#4b3fe0", l: ["#ffe8c2", "#e4dcff"], k: ["#3b3150", "#1e2542"] },
  { id: "guess",   name: "Guess the Flag", cat: "App",  sub: "REST Countries API", a: "#2f8bff", b: "#1259d6", l: ["#d8efff", "#eaf6ff"], k: ["#17344f", "#16253a"] },
  { id: "world",   name: "Explore World",  cat: "App",  sub: "REST Countries API", a: "#1fc7a5", b: "#0f8f7a", l: ["#d5f4ff", "#e3f8e6"], k: ["#123a44", "#173126"] },
  { id: "rooftop", name: "Rooftop Jump",   cat: "Game", sub: "Adventure",       a: "#ff7a9c", b: "#e0457a", l: ["#e8dfff", "#ffdfe9"], k: ["#33284f", "#4a2339"] },
  { id: "chaos",   name: "Cha-er Dokan",   cat: "Game", sub: "Simulation",      a: "#ffb347", b: "#e8801a", l: ["#ffe6cc", "#fff3dc"], k: ["#4a3220", "#33251a"], full: true },
  { id: "robo",    name: "Robo Escape",    cat: "Game", sub: "Puzzle & Action", a: "#8a94ff", b: "#5565f0", l: ["#dde3ff", "#eadcff"], k: ["#232b52", "#352b55"], full: true }
];

const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};

/* ---------- Fallback Country Data (If API fails) ---------- */
const FALLBACK_COUNTRIES = [
  { name: { common: "Bangladesh" }, capital: ["Dhaka"], region: "Asia", population: 165000000, flags: { png: "https://flagcdn.com/w320/bd.png" } },
  { name: { common: "Japan" }, capital: ["Tokyo"], region: "Asia", population: 125000000, flags: { png: "https://flagcdn.com/w320/jp.png" } },
  { name: { common: "Canada" }, capital: ["Ottawa"], region: "Americas", population: 38000000, flags: { png: "https://flagcdn.com/w320/ca.png" } },
  { name: { common: "Germany" }, capital: ["Berlin"], region: "Europe", population: 83000000, flags: { png: "https://flagcdn.com/w320/de.png" } },
  { name: { common: "France" }, capital: ["Paris"], region: "Europe", population: 67000000, flags: { png: "https://flagcdn.com/w320/fr.png" } },
  { name: { common: "Australia" }, capital: ["Canberra"], region: "Oceania", population: 25000000, flags: { png: "https://flagcdn.com/w320/au.png" } },
  { name: { common: "Brazil" }, capital: ["Brasilia"], region: "Americas", population: 212000000, flags: { png: "https://flagcdn.com/w320/br.png" } },
  { name: { common: "Egypt" }, capital: ["Cairo"], region: "Africa", population: 104000000, flags: { png: "https://flagcdn.com/w320/eg.png" } }
];

/* ---------- Fallback Trivia Questions (If OpenTrivia API is rate-limited or fails) ---------- */
const FALLBACK_QUESTIONS = [
  { question: "What is the capital city of Bangladesh?", correct_answer: "Dhaka", incorrect_answers: ["Chittagong", "Sylhet", "Rajshahi"], category: "Geography & Bangladesh" },
  { question: "Which river is known as the longest river in Bangladesh?", correct_answer: "Surma", incorrect_answers: ["Padma", "Meghna", "Jamuna"], category: "Geography" },
  { question: "What is the national animal of Bangladesh?", correct_answer: "Royal Bengal Tiger", incorrect_answers: ["Asian Elephant", "Leopard", "Spotted Deer"], category: "General Knowledge" },
  { question: "In computing, what does 'HTTP' stand for?", correct_answer: "HyperText Transfer Protocol", incorrect_answers: ["High Transfer Text Protocol", "Hyper Transfer Tool Program", "Hyperlink Text Transmission Protocol"], category: "Technology" },
  { question: "Which planet is known as the Red Planet?", correct_answer: "Mars", incorrect_answers: ["Venus", "Jupiter", "Saturn"], category: "Science" },
  { question: "Who wrote the national anthem of Bangladesh, 'Amar Sonar Bangla'?", correct_answer: "Rabindranath Tagore", incorrect_answers: ["Kazi Nazrul Islam", "Jibanananda Das", "Michael Madhusudan Dutt"], category: "Literature & History" },
  { question: "Which language is primarily used for structuring web pages?", correct_answer: "HTML", incorrect_answers: ["Python", "SQL", "C++"], category: "Web Development" },
  { question: "What year did Bangladesh achieve independence?", correct_answer: "1971", incorrect_answers: ["1947", "1952", "1969"], category: "History" },
  { question: "What is the largest ocean on Earth?", correct_answer: "Pacific Ocean", incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], category: "Geography" },
  { question: "Which data structure operates on a First-In-First-Out (FIFO) basis?", correct_answer: "Queue", incorrect_answers: ["Stack", "Tree", "Graph"], category: "Computer Science" }
];

/* ---------- Icons: SVG Definitions ---------- */
const stop = (o, c, a) => `<stop offset="${o}" stop-color="${c}"${a ? ` stop-opacity="${a}"` : ""}/>`;
const DEFS = `
<linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1">${stop(0, "#ffe9a3")}${stop(.5, "#e0a82e")}${stop(1, "#9a6410")}</linearGradient>
<linearGradient id="gGreen" x1="0" y1="0" x2="1" y2="1">${stop(0, "#19c488")}${stop(1, "#065c3e")}</linearGradient>
<radialGradient id="gRed" cx=".35" cy=".3" r=".8">${stop(0, "#ff8a8a")}${stop(1, "#b3101f")}</radialGradient>
<linearGradient id="gMetal" x1="0" x2="1">${stop(0, "#f2f4f8")}${stop(.5, "#aab2c3")}${stop(1, "#6b7488")}</linearGradient>
<linearGradient id="gShade" x1="0" x2="1">${stop(0, "#000", .28)}${stop(.25, "#fff", .22)}${stop(.5, "#000", .22)}${stop(.75, "#fff", .18)}${stop(1, "#000", .3)}</linearGradient>
<radialGradient id="gOcean" cx=".35" cy=".3" r=".85">${stop(0, "#5cc8ff")}${stop(1, "#0a3d91")}</radialGradient>
<linearGradient id="gLand" x1="0" y1="0" x2="1" y2="1">${stop(0, "#7be08a")}${stop(1, "#2f9e52")}</linearGradient>
<radialGradient id="gShine" cx=".3" cy=".25" r=".85">${stop(0, "#fff", .5)}${stop(.4, "#fff", 0)}${stop(1, "#001030", .55)}</radialGradient>
<linearGradient id="gCup" x1="0" x2="1">${stop(0, "#ffffff")}${stop(.6, "#dfe3ea")}${stop(1, "#9aa3b5")}</linearGradient>
<linearGradient id="gSteel" x1="0" y1="0" x2="1" y2="1">${stop(0, "#f1f4f9")}${stop(.5, "#9aa5ba")}${stop(1, "#566074")}</linearGradient>
<radialGradient id="gCyan">${stop(0, "#e8fdff")}${stop(.45, "#4fe3ff")}${stop(1, "#0a8fb0")}</radialGradient>`;

function bld(cx, y0, h, top, left, right, seed) {
  const L = cx - 20;
  let s = `<path d="M${L} ${y0}l20 10 20-10-20-10z" fill="${top}"/><path d="M${L} ${y0}l20 10v${h}l-20-10z" fill="${left}"/><path d="M${cx} ${y0 + 10}l20-10v${h}l-20 10z" fill="${right}"/>`;
  for (let r = 0; r < Math.floor((h - 12) / 14); r++) for (const dx of [4, 13]) {
    const lit = (r * 3 + dx + seed) % 3 ? "#ffd97a" : "#3b4580";
    s += `<path d="M${L + dx} ${y0 + dx / 2 + 8 + r * 14}l5 2.5v7l-5-2.5z" fill="${lit}"/>`;
    s += `<path d="M${cx + dx} ${y0 + 10 - dx / 2 + 8 + r * 14}l5-2.5v7l-5 2.5z" fill="${lit}" opacity=".7"/>`;
  }
  return s;
}
const SH = (rx) => `<ellipse cx="60" cy="109" rx="${rx}" ry="5" fill="#000" opacity=".4"/>`;
const ICONS = {
  battle: `${SH(30)}
    <path d="M60 10 101 25v33c0 26-17 43-41 53-24-10-41-27-41-53V25z" fill="url(#gGold)"/>
    <path d="M60 19 93 31v27c0 21-13 35-33 44-20-9-33-23-33-44V31z" fill="url(#gGreen)"/>
    <path d="M60 19 27 31v27c0 21 13 35 33 44z" fill="#fff" opacity=".13"/>
    <circle cx="60" cy="58" r="18" fill="url(#gRed)"/>
    <text x="60" y="67" text-anchor="middle" font-size="24" font-weight="800" fill="#fff" font-family="Arial,sans-serif">?</text>`,
  guess: `${SH(32)}
    <rect x="29" y="14" width="6" height="94" rx="3" fill="url(#gMetal)"/><circle cx="32" cy="13" r="6" fill="url(#gGold)"/>
    <clipPath id="cWave"><path d="M35 24c16-10 28 10 46 0 10-5 18-2 24 0v38c-6-2-14-5-24 0-18 10-30-10-46 0z"/></clipPath>
    <g clip-path="url(#cWave)"><rect x="35" y="10" width="72" height="28" fill="#e63946"/><rect x="35" y="38" width="72" height="14" fill="#f8f9fa"/><rect x="35" y="52" width="72" height="26" fill="#2b6cb0"/><rect x="35" y="10" width="72" height="70" fill="url(#gShade)"/></g>`,
  world: `${SH(34)}
    <g transform="rotate(-20 60 58)"><ellipse cx="60" cy="58" rx="54" ry="13" fill="none" stroke="#9ee7ff" stroke-width="3" opacity=".5"/></g>
    <circle cx="60" cy="58" r="40" fill="url(#gOcean)"/>
    <clipPath id="cGlobe"><circle cx="60" cy="58" r="40"/></clipPath>
    <g clip-path="url(#cGlobe)" fill="url(#gLand)"><path d="M30 40c8-10 20-8 24 0s-2 12-8 14-12 8-16 0z"/><path d="M62 30c10-6 22 0 24 10s-8 8-12 14-10 2-12-6z"/><path d="M52 70c8-4 16 2 14 12s-12 14-16 6z"/><path d="M78 64c6 0 10 6 6 12s-10 2-10-6z"/></g>
    <circle cx="60" cy="58" r="40" fill="url(#gShine)"/>
    <g transform="rotate(-20 60 58)"><clipPath id="cFront"><rect x="0" y="58" width="120" height="40"/></clipPath><ellipse cx="60" cy="58" rx="54" ry="13" fill="none" stroke="#e6faff" stroke-width="3.5" clip-path="url(#cFront)"/></g>`,
  rooftop: `${SH(38)}${bld(40, 38, 54, "#7385c9", "#3a4478", "#252c55", 0)}${bld(88, 62, 30, "#7385c9", "#3a4478", "#252c55", 1)}
    <path d="M62 22q-8-2-12 4" fill="none" stroke="#e63946" stroke-width="3" stroke-linecap="round"/>
    <path d="M66 27 62 38M62 38l-8 6M62 38l8 6M65 30l7-4" fill="none" stroke="#12a874" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="66" cy="21" r="5" fill="#e0a878"/><path d="M61 20a5 5 0 0 1 10 0z" fill="#1b1b1b"/>`,
  chaos: `${SH(36)}
    <path d="M24 6h72l8 14H16z" fill="#f8f4e3"/><path d="M36 6h12l-2 14H30zM60 6h12l2 14H62zM84 6h12l8 14H90z" fill="#0a8a5a"/>
    <path d="M16 20h88l-3 4H19z" fill="#000" opacity=".2"/>
    <ellipse cx="60" cy="100" rx="38" ry="8" fill="url(#gCup)"/>
    <path d="M28 54h64c0 26-12 44-32 44S28 80 28 54z" fill="url(#gCup)"/>
    <ellipse cx="60" cy="54" rx="32" ry="7" fill="#4a2a10"/><ellipse cx="60" cy="55" rx="28" ry="5" fill="#b9742f"/>
    <path d="M92 60c16-2 16 20-2 22" fill="none" stroke="url(#gCup)" stroke-width="7" stroke-linecap="round"/>
    <path d="M48 46c-6-6 6-10 0-16M62 46c-6-6 6-10 0-18M76 46c-6-6 6-10 0-14" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  robo: `${SH(34)}
    <rect x="58.5" y="8" width="3" height="16" fill="#8a94a8"/><circle cx="60" cy="8" r="5" fill="url(#gRed)"/>
    <rect x="14" y="46" width="12" height="24" rx="5" fill="#6b7488"/><rect x="94" y="46" width="12" height="24" rx="5" fill="#6b7488"/>
    <rect x="24" y="22" width="72" height="66" rx="18" fill="url(#gSteel)"/>
    <rect x="32" y="38" width="56" height="30" rx="13" fill="#0a1020"/>
    <circle cx="48" cy="53" r="12" fill="#4fe3ff" opacity=".25"/><circle cx="72" cy="53" r="12" fill="#4fe3ff" opacity=".25"/>
    <ellipse cx="48" cy="53" rx="7" ry="8.5" fill="url(#gCyan)"/><ellipse cx="72" cy="53" rx="7" ry="8.5" fill="url(#gCyan)"/>
    <path d="M44 78h32M44 83h32" stroke="#3b4456" stroke-width="3" stroke-linecap="round"/>
    <path d="M26 40c0-10 8-16 18-16h20" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>`
};
document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${DEFS}</defs>${Object.entries(ICONS).map(([k, v]) => `<symbol id="ic-${k}" viewBox="0 0 120 120">${v}</symbol>`).join("")}</svg>`);
const ico = (g, size) => `<span class="ico" style="--a:${g.a};--b:${g.b};${size ? `--s:${size}px` : ""}"><svg viewBox="0 0 120 120"><use href="#ic-${g.id}"/></svg></span>`;
const art = (g, cls = "") => `<span class="art ${cls}" style="--l1:${g.l[0]};--l2:${g.l[1]};--k1:${g.k[0]};--k2:${g.k[1]}"><svg viewBox="0 0 120 120"><use href="#ic-${g.id}"/></svg></span>`;
const game = (id) => GAMES.find((g) => g.id === id);
const TAG_ICON = {
  App: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>',
  Game: '<svg viewBox="0 0 24 24"><rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M8 10v5M5.5 12.5h5"/></svg>'
};

/* ---------- Light / dark mode ---------- */
const html = document.documentElement, mq = window.matchMedia("(prefers-color-scheme: dark)");
const isDark = () => (store.get("ps-theme") || (mq.matches ? "dark" : "light")) === "dark";
function applyTheme() {
  const saved = store.get("ps-theme");
  if (saved) html.dataset.theme = saved; else html.removeAttribute("data-theme");
  html.classList.toggle("is-dark", isDark());
}
$("#themeBtn").addEventListener("click", () => { store.set("ps-theme", isDark() ? "light" : "dark"); applyTheme(); });
mq.addEventListener("change", applyTheme);
applyTheme();

/* ---------- Hero ---------- */
$("#floats").innerHTML = [["battle", 3, 8, 92, -8, 7], ["world", 72, 0, 88, 10, 8], ["rooftop", 82, 40, 78, -6, 9], ["guess", 4, 58, 84, 8, 10], ["chaos", 66, 70, 74, -9, 8]]
  .map(([id, x, y, s, r, d]) => `<span class="fi" style="left:${x}%;top:${y}%;--r:${r}deg;--d:${d}s;animation-delay:-${d / 2}s">${ico(game(id), s)}</span>`).join("");

/* ---------- Explore ---------- */
let cat = "all", query = "";
function renderApps() {
  const q = query.trim().toLowerCase();
  const list = GAMES.filter((g) => (cat === "all" || g.cat === cat) && (!q || `${g.name} ${g.sub} ${g.cat}`.toLowerCase().includes(q)));
  $("#apps").innerHTML = list.map((g) => `
    <button class="card" data-id="${g.id}">${art(g)}
      <span class="tag ${g.cat.toLowerCase()}">${TAG_ICON[g.cat]}${g.cat}</span>
      <span class="nm">${g.name}</span><span class="sb">${g.sub}</span>
      <span class="go" aria-hidden="true">→</span>
    </button>`).join("");
  $("#empty").hidden = list.length > 0;
}
function setCat(c) {
  cat = c;
  document.querySelectorAll("#filters .seg-b").forEach((b) => b.classList.toggle("active", b.dataset.cat === c));
  document.querySelectorAll(".nl").forEach((b) => b.classList.toggle("active", b.dataset.nav === (c === "all" ? "home" : c)));
  renderApps();
}
$("#filters").addEventListener("click", (e) => { const b = e.target.closest(".seg-b"); if (b) setCat(b.dataset.cat); });
$("#navlinks").addEventListener("click", (e) => {
  const b = e.target.closest(".nl");
  if (!b) return;
  if (b.dataset.nav === "home") { setCat("all"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  else { setCat(b.dataset.nav); $("#launcher").scrollIntoView({ behavior: "smooth" }); }
});
$("#searchBtn").addEventListener("click", () => {
  const s = $("#search");
  s.classList.toggle("open");
  if (s.classList.contains("open")) $("#q").focus(); else { $("#q").value = ""; query = ""; renderApps(); }
});
$("#q").addEventListener("input", (e) => { query = e.target.value; renderApps(); });
$("#apps").addEventListener("click", (e) => {
  const a = e.target.closest(".card");
  if (a) openApp(a.dataset.id);
});

/* ---------- Game screen ---------- */
let cleanup = null;
const stage = $("#stage"), play = $("#play");
function openApp(id) {
  const g = game(id);
  if (!g) return;
  if (cleanup) cleanup();
  $("#stageLogo").innerHTML = art(g, "mini");
  $("#stageTitle").textContent = g.name;
  play.innerHTML = "";
  play.className = "play" + (g.full ? " full" : "");
  stage.classList.add("open");
  stage.setAttribute("aria-hidden", "false");
  stage.scrollTop = 0;
  document.body.style.overflow = "hidden";
  cleanup = launchers[id](play) || null;
}
function closeApp() {
  if (cleanup) cleanup();
  cleanup = null;
  play.innerHTML = "";
  stage.classList.remove("open");
  stage.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
$("#backBtn").addEventListener("click", closeApp);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && stage.classList.contains("open")) closeApp(); });

/* ---------- Shared 3D helpers (Three.js) ---------- */
let SC;
let mat = (c) => new THREE.MeshLambertMaterial({ color: c });
function add(geo, color, x, y, z, parent = SC) {
  const m = new THREE.Mesh(geo, mat(color));
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
}
const box = (w, h, d, c, x, y, z, p) => add(new THREE.BoxGeometry(w, h, d), c, x, y, z, p);
const cyl = (rt, rb, h, c, x, y, z, p) => add(new THREE.CylinderGeometry(rt, rb, h, 16), c, x, y, z, p);
const ball = (r, c, x, y, z, p) => add(new THREE.SphereGeometry(r, 16, 12), c, x, y, z, p);

function stage3d(wrap) {
  const holder = document.createElement("div");
  holder.className = "stage3d";
  wrap.prepend(holder);
  const S = { scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera(50, 1, 0.1, 100), renderer: new THREE.WebGLRenderer({ antialias: true }), onResize() {}, onFrame() {} };
  S.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  S.renderer.shadowMap.enabled = true;
  holder.appendChild(S.renderer.domElement);
  const resize = () => {
    const w = holder.clientWidth || 1, h = holder.clientHeight || 1;
    S.renderer.setSize(w, h);
    S.camera.aspect = w / h;
    S.onResize(w, h);
    S.camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(holder);
  const clock = new THREE.Clock();
  let raf;
  const loop = () => { raf = requestAnimationFrame(loop); S.onFrame(Math.min(clock.getDelta(), 0.05)); S.renderer.render(S.scene, S.camera); };
  S.start = () => { resize(); loop(); };
  S.stop = () => { cancelAnimationFrame(raf); ro.disconnect(); S.renderer.dispose(); };
  return S;
}
function holdBtn(el, on, off) {
  el.addEventListener("pointerdown", (e) => { e.preventDefault(); on(); });
  for (const ev of ["pointerup", "pointerleave", "pointercancel"]) el.addEventListener(ev, off);
}
const NO3D = '<p class="muted mt">3D games need an internet connection to load Three.js. Please reconnect and open the game again.</p>';

/* ---------- Cha-er Dokan Chaos ---------- */
function chaosGame(root) {
  if (!window.THREE) { root.innerHTML = NO3D; return; }
  const wrap = document.createElement("div");
  wrap.className = "g3d";
  wrap.innerHTML = `
    <div class="g3d-hud"><div class="pill">Time <b data-k="time">60</b>s</div><div class="pill">Score <b data-k="score">0</b></div><div class="pill">৳ <b data-k="money">0</b></div><button class="rbtn" data-k="restart" aria-label="Restart">↻</button></div>
    <div class="g3d-toast"></div><div class="g3d-bubbles"></div><div class="making"><i></i></div>
    <div class="g3d-ctrl"><div class="grp"><button class="gbtn round" data-k="left" aria-label="Move left">◀</button><button class="gbtn round" data-k="right" aria-label="Move right">▶</button></div>
      <div class="grp"><button class="gbtn tea" data-k="make">Cha banao</button><button class="gbtn green" data-k="serve">Serve</button></div></div>
    <div class="g3d-over show"><div class="card3"><p class="tag">PlaySpace Game</p><h2 data-k="title">Cha-er Dokan Chaos</h2>
      <p data-k="msg">Customer ashbe, cha chaibe. Cha banao, shamne dao, taka kamao. 60 second e koto pare?</p>
      <ul class="help"><li><kbd>A</kbd><kbd>D</kbd> / <kbd>←</kbd><kbd>→</kbd> move</li><li><kbd>E</kbd> cha banao, <kbd>E</kbd> abar serve</li></ul>
      <button class="gbtn tea big" data-k="start">Shuru kori!</button></div></div>`;
  root.appendChild(wrap);
  const q = (k) => wrap.querySelector(`[data-k=${k}]`);
  const S = stage3d(wrap), scene = S.scene, camera = S.camera;
  SC = scene; mat = (c) => new THREE.MeshLambertMaterial({ color: c });
  scene.background = new THREE.Color(0xa6e0ff);
  scene.fog = new THREE.Fog(0xa6e0ff, 28, 60);
  S.onResize = (w, h) => {
    const portrait = w / h < 1;
    camera.fov = portrait ? 72 : 50;
    camera.position.set(0, portrait ? 8 : 6.5, portrait ? 13 : 11);
    camera.lookAt(0, 1.2, 0);
  };
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7cc36b, 0.85));
  const sun = new THREE.DirectionalLight(0xfff0d0, 0.9);
  sun.position.set(6, 12, 8); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 });
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun);

  function sign(text, w, h, bg, fg, x, y, z) {
    const cv = document.createElement("canvas");
    cv.width = 512; cv.height = Math.round(512 * h / w);
    const g = cv.getContext("2d");
    g.fillStyle = bg; g.fillRect(0, 0, cv.width, cv.height);
    g.strokeStyle = fg; g.lineWidth = 8; g.strokeRect(8, 8, cv.width - 16, cv.height - 16);
    g.fillStyle = fg; g.font = "bold " + cv.height * 0.42 + "px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(text, cv.width / 2, cv.height / 2 + 4, cv.width - 40);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) }));
    m.position.set(x, y, z); scene.add(m);
  }
  function makePerson(shirt, lungi, extra) {
    const g = new THREE.Group(), dark = 0x1b1b1b;
    cyl(0.38, 0.5, 0.95, lungi, 0, 0.475, 0, g);
    cyl(0.34, 0.4, 0.8, shirt, 0, 1.35, 0, g);
    for (const s of [-1, 1]) cyl(0.09, 0.09, 0.65, shirt, s * 0.47, 1.35, 0, g).rotation.z = s * 0.15;
    ball(0.32, 0xc68a5a, 0, 2.05, 0, g);
    for (const s of [-1, 1]) ball(0.05, 0x111111, s * 0.12, 2.1, 0.29, g);
    if (extra === "tupi" || extra === "gamchha") cyl(0.27, 0.3, 0.2, 0xffffff, 0, 2.38, 0, g);
    if (extra === "gamchha") box(0.9, 0.12, 0.45, 0xe63946, 0, 1.75, 0, g).rotation.z = 0.25;
    if (["hair", "moustache", "shades"].includes(extra)) ball(0.34, dark, 0, 2.12, -0.06, g);
    if (extra === "moustache") box(0.36, 0.07, 0.06, dark, 0, 1.95, 0.3, g);
    if (extra === "shades") box(0.42, 0.1, 0.06, 0x111111, 0, 2.1, 0.3, g);
    return g;
  }

  box(90, 0.2, 90, 0x7cc36b, 0, -0.1, 0);
  box(90, 0.08, 4.6, 0xd8c8a0, 0, 0.04, 3.7);
  box(90, 0.06, 4, 0x4a4e5a, 0, 0.03, 8.6);
  for (let i = -9; i <= 9; i++) box(1.2, 0.02, 0.15, 0xffffff, i * 2.6, 0.08, 8.6);
  box(11, 0.15, 4.6, 0xb08968, 0, 0.075, -0.9);
  box(11, 3.4, 0.2, 0xf4d58d, 0, 1.85, -3.2);
  sign("CHA-ER DOKAN", 6.2, 0.9, "#fff3c4", "#c1121f", 0, 3.0, -3.08);
  box(10, 1.1, 1, 0x8d5524, 0, 0.7, 0.5);
  box(10.5, 0.12, 1.3, 0xc68642, 0, 1.31, 0.5);
  for (const x of [-5.2, 5.2]) for (const z of [-3, -1]) cyl(0.1, 0.1, 3.6, 0x5c4033, x, 1.95, z);
  const canopy = new THREE.Group();
  canopy.position.set(0, 3.85, -2.2); canopy.rotation.x = 0.12; scene.add(canopy);
  for (let i = 0; i < 8; i++) box(1.45, 0.2, 2.4, i % 2 ? 0x0a7a4b : 0xf4f1de, -5.075 + i * 1.45, 0, 0, canopy);
  box(9, 0.1, 0.4, 0x6d4c41, 0, 1.9, -3.0);
  [0xe63946, 0xffd166, 0x06d6a0, 0x4dabf7, 0xf78c6b, 0xc77dff, 0xffd166, 0x06d6a0].forEach((c, i) => cyl(0.18, 0.18, 0.45, c, -3.85 + i * 1.1, 2.2, -3.0));
  const kettle = new THREE.Group();
  kettle.position.set(-4.2, 1.37, 0.5); scene.add(kettle);
  cyl(0.32, 0.42, 0.6, 0xc0c6d0, 0, 0.3, 0, kettle);
  cyl(0.2, 0.3, 0.12, 0x9aa3b0, 0, 0.66, 0, kettle);
  ball(0.07, 0x333333, 0, 0.76, 0, kettle);
  cyl(0.05, 0.1, 0.5, 0xc0c6d0, 0.45, 0.45, 0, kettle).rotation.z = -0.9;
  add(new THREE.TorusGeometry(0.22, 0.04, 8, 16), 0x333333, -0.4, 0.4, 0, kettle);
  const steam = [0, 1, 2].map((i) => { const s = ball(0.12, 0xffffff, 0.5, 1, 0, kettle); s.material.transparent = true; s.castShadow = false; s.userData.o = i / 3; return s; });
  for (let i = 0; i < 5; i++) cyl(0.13, 0.1, 0.22, 0xffffff, -3.2 + i * 0.4, 1.48, 0.25);
  cyl(0.3, 0.3, 0.55, 0xffd166, 4.2, 1.65, 0.5);
  cyl(0.32, 0.32, 0.1, 0xe63946, 4.2, 2.0, 0.5);
  for (const x of [-5, 5]) { box(2.6, 0.14, 0.6, 0x8d5524, x, 0.55, 4.6); for (const dx of [-1.1, 1.1]) box(0.14, 0.5, 0.5, 0x5c4033, x + dx, 0.28, 4.6); }
  function shop(x, z, color, name, h) {
    box(5.5, h, 4, color, x, h / 2, z);
    sign(name, 4.2, 0.8, "#fff8e1", "#7b2d26", x, h - 0.7, z + 2.02);
    box(1.2, 2, 0.1, 0x5c4033, x - 1.5, 1, z + 2.02);
    box(1.6, 1.2, 0.1, 0xbfe9ff, x + 1.3, 1.6, z + 2.02);
    box(5.9, 0.12, 1.3, 0xe63946, x, h - 1.5, z + 2.6).rotation.x = 0.35;
  }
  shop(-9.5, -4, 0xf4a261, "MUDI DOKAN", 4.5); shop(9.5, -4, 0x90be6d, "PHARMACY", 4.5); shop(0, -8, 0x8ecae6, "BIRIANI HOUSE", 6);
  for (const [x, z] of [[-14, -1], [14, -1], [-13, 5], [13, 5]]) { cyl(0.2, 0.3, 1.6, 0x6b4226, x, 0.8, z); ball(1.1, 0x2f9e44, x, 2.4, z); ball(0.8, 0x40b35a, x + 0.5, 3.0, z); }
  cyl(0.06, 0.06, 5, 0xdddddd, 6.8, 2.5, 2.4);
  const flag = new THREE.Group();
  flag.position.set(6.8, 4.45, 2.4); scene.add(flag);
  const fm = (c) => new THREE.MeshLambertMaterial({ color: c, side: THREE.DoubleSide });
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1), fm(0x006a4e)); cloth.position.x = 0.9; flag.add(cloth);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.33, 24), fm(0xf42a41)); disc.position.set(0.8, 0, 0.01); flag.add(disc);
  function rickshaw(color) {
    const g = new THREE.Group();
    box(1.7, 0.45, 0.9, color, 0, 0.75, 0, g); box(0.5, 0.6, 0.9, color, -0.6, 1.2, 0, g); box(1.5, 0.1, 1.1, 0xffd166, 0.1, 2.0, 0, g);
    for (const z of [-0.45, 0.45]) cyl(0.04, 0.04, 1, 0x333333, 0.7, 1.5, z, g);
    for (const [x, z] of [[-0.6, 0.5], [-0.6, -0.5], [0.9, 0]]) cyl(0.35, 0.35, 0.1, 0x222222, x, 0.35, z, g).rotation.x = Math.PI / 2;
    const d = makePerson(0x3a86ff, 0x444444, "hair");
    d.scale.setScalar(0.45); d.position.set(0.6, 0.95, 0); d.rotation.y = Math.PI / 2; g.add(d);
    scene.add(g);
    return g;
  }
  const rickshaws = [{ g: rickshaw(0xe63946), v: 3, x: -20, z: 8.0 }, { g: rickshaw(0x2a9d8f), v: -2.4, x: 20, z: 9.4 }];
  rickshaws[1].g.rotation.y = Math.PI;

  const player = makePerson(0xfff3c4, 0x1d4e89, "tupi");
  player.position.set(0, 0.15, -1.4);
  box(0.62, 0.7, 0.06, 0x0a7a4b, 0, 1.3, 0.33, player);
  scene.add(player);
  const held = new THREE.Group();
  held.position.set(0.35, 1.55, 0.5); held.visible = false; player.add(held);
  cyl(0.11, 0.08, 0.2, 0xffffff, 0, 0, 0, held); cyl(0.1, 0.1, 0.02, 0xc97b3a, 0, 0.1, 0, held);

  const SLOTS = [-2.8, 0, 2.8];
  const STYLES = [[0xe63946, 0x2a6f97, "moustache"], [0xffd166, 0x6a994e, "shades"], [0x4dabf7, 0x7b2cbf, "gamchha"], [0xf8f9fa, 0x8d5524, "tupi"], [0x80ed99, 0x1d3557, "hair"]];
  const ORDERS = ["Bhai, cha koi? ☕", "Bhai, chini kom den!", "Ek cup dudh cha den!", "Ektu jaldi den bhai!", "Bhai, extra adrak den!", "Cha chara adda hoy na!"];
  const THANKS = ["Wah! Mojar cha! 😋", "Bhai, tumi legend! 🔥", "Ahh! Jaan ferot ashlo! 😌"];
  const state = { running: false, time: 60, score: 0, money: 0, served: 0, hasTea: false, makeT: -1, spawnT: 0 };
  let customers = [], t = 0, toastTimer;
  const hud = () => { q("time").textContent = Math.ceil(state.time); q("score").textContent = state.score; q("money").textContent = state.money; };
  const toast = (text) => {
    const el = wrap.querySelector(".g3d-toast");
    el.textContent = text; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 1400);
  };

  const say = (c, text, cls) => { c.el.firstChild.textContent = text; c.el.className = "bubble show " + (cls || ""); };
  function spawn() {
    const free = [0, 1, 2].filter((i) => !customers.some((c) => c.slot === i));
    if (!free.length) return;
    const i = pick(free), s = pick(STYLES), g = makePerson(s[0], s[1], s[2]);
    g.position.set(SLOTS[i], 0.08, 9); g.rotation.y = Math.PI; scene.add(g);
    const el = document.createElement("div");
    el.className = "bubble"; el.innerHTML = "<span></span><i><b></b></i>";
    wrap.querySelector(".g3d-bubbles").appendChild(el);
    customers.push({ g, el, slot: i, mode: "walk", pat: 1, mood: 0, timer: 0, dir: 1 });
  }
  function leave(c, happy) {
    c.mode = "leave"; c.slot = -1; c.dir = c.g.position.x >= 0 ? 1 : -1; c.g.rotation.set(0, 0, 0);
    if (!happy) {
      say(c, "Dhur! Gelam! 😤", "hide-bar mad");
      state.money = Math.max(0, state.money - 5); state.score = Math.max(0, state.score - 20);
      toast("Customer rege gelo! −৳5"); hud();
    } else c.el.classList.add("hide-bar");
  }
  function updateCustomers(dt) {
    for (const c of customers) {
      const g = c.g;
      if (c.mode === "walk") {
        g.position.z -= 3.2 * dt; g.position.y = 0.08 + Math.abs(Math.sin(t * 10)) * 0.06;
        if (g.position.z <= 2.3) { g.position.z = 2.3; g.position.y = 0.08; c.mode = "wait"; say(c, pick(ORDERS)); }
      } else if (c.mode === "wait" && state.running) {
        c.pat -= dt / 13;
        const mood = c.pat < 0.25 ? 2 : c.pat < 0.55 ? 1 : 0;
        if (mood !== c.mood) { c.mood = mood; say(c, mood === 2 ? "Cha dibi na?! 😡" : "Bhai, koto deri? 😒", mood === 2 ? "mad" : ""); }
        g.rotation.z = mood === 2 ? Math.sin(t * 35) * 0.08 : Math.sin(t * 2 + c.slot) * 0.02;
        if (c.pat <= 0) leave(c, false);
      } else if (c.mode === "happy") {
        c.timer -= dt; g.position.y = 0.08 + Math.abs(Math.sin(t * 10)) * 0.35;
        if (c.timer <= 0) leave(c, true);
      } else if (c.mode === "leave") {
        g.position.z += 4 * dt; g.position.x += c.dir * 1.2 * dt; g.position.y = 0.08 + Math.abs(Math.sin(t * 12)) * 0.06;
      }
    }
    customers = customers.filter((c) => {
      if (c.mode === "leave" && c.g.position.z > 9) { scene.remove(c.g); c.el.remove(); return false; }
      return true;
    });
  }

  const makeTea = () => { if (state.running && !state.hasTea && state.makeT < 0) state.makeT = 0; };
  function serve() {
    if (!state.running) return;
    if (!state.hasTea) return toast("Age cha banao! ☕");
    let best = null, bd = 2;
    for (const c of customers) { const d = Math.abs(c.g.position.x - player.position.x); if (c.mode === "wait" && d < bd) { bd = d; best = c; } }
    if (!best) return toast("Customer er shamne jao!");
    const tip = best.pat > 0.5 ? 10 : 0;
    state.hasTea = false; held.visible = false;
    state.money += 20 + tip; state.score += 100 + Math.round(best.pat * 50); state.served++;
    best.mode = "happy"; best.timer = 1.1; best.g.rotation.z = 0;
    say(best, pick(THANKS), "hide-bar");
    toast(tip ? "+৳" + (20 + tip) + " (tip shoho!) 🎉" : "+৳20");
    hud();
  }
  const act = () => (state.hasTea ? serve() : makeTea());

  const keys = {}, virt = { left: false, right: false };
  const kd = (e) => {
    if (!root.isConnected) return;
    keys[e.code] = true;
    if (e.code === "KeyE" || e.code === "Space") act();
    if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
  };
  const ku = (e) => { keys[e.code] = false; };
  window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
  holdBtn(q("left"), () => (virt.left = true), () => (virt.left = false));
  holdBtn(q("right"), () => (virt.right = true), () => (virt.right = false));
  q("make").addEventListener("click", makeTea); q("serve").addEventListener("click", serve);

  function startGame() {
    customers.forEach((c) => { scene.remove(c.g); c.el.remove(); });
    customers = [];
    Object.assign(state, { running: true, time: 60, score: 0, money: 0, served: 0, hasTea: false, makeT: -1, spawnT: 0.3 });
    held.visible = false; player.position.set(0, 0.15, -1.4);
    hud(); wrap.querySelector(".g3d-over").classList.remove("show");
  }
  function endGame() {
    state.running = false; state.hasTea = false; held.visible = false; state.makeT = -1;
    const best = Math.max(Number(store.get("ps-cha-best")) || 0, state.score);
    store.set("ps-cha-best", best);
    const rank = state.money >= 150 ? "Cha-er Dokan er Boss! 👑" : state.money >= 80 ? "Shabash, Mama! 👏" : "Aro practice lagbe! ☕";
    q("title").textContent = "Time sesh! ⏰";
    q("msg").innerHTML = `<b>${state.served}</b> cup cha · <b>৳${state.money}</b> · <b>${state.score}</b> points<br>${rank}<br><small>Best score: ${best}</small>`;
    wrap.querySelector(".help").style.display = "none";
    q("start").textContent = "Restart ↻";
    wrap.querySelector(".g3d-over").classList.add("show");
  }
  q("start").addEventListener("click", startGame); q("restart").addEventListener("click", startGame);

  const v = new THREE.Vector3();
  const follow = (el, obj, yOff) => {
    v.set(obj.position.x, obj.position.y + yOff, obj.position.z).project(camera);
    el.style.transform = `translate(${(v.x * 0.5 + 0.5) * wrap.clientWidth}px,${(-v.y * 0.5 + 0.5) * wrap.clientHeight}px) translate(-50%,-100%)`;
  };
  S.onFrame = (dt) => {
    t += dt;
    const dx = (keys.KeyD || keys.ArrowRight || virt.right ? 1 : 0) - (keys.KeyA || keys.ArrowLeft || virt.left ? 1 : 0);
    const dz = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0);
    const moving = state.running && (dx || dz);
    if (state.running) {
      player.position.x = clamp(player.position.x + dx * 6 * dt, -4.6, 4.6);
      player.position.z = clamp(player.position.z + dz * 4 * dt, -2.4, -0.7);
      state.time -= dt; state.spawnT -= dt;
      if (state.spawnT <= 0) { spawn(); state.spawnT = 2 + Math.random() * 2; }
      if (state.makeT >= 0) {
        state.makeT += dt;
        if (state.makeT >= 0.9) { state.makeT = -1; state.hasTea = true; held.visible = true; toast("Cha ready! Ekhon serve koro 🫖"); }
      }
      hud();
      if (state.time <= 0) { state.time = 0; hud(); endGame(); }
    }
    player.position.y = 0.15 + (moving ? Math.abs(Math.sin(t * 14)) * 0.07 : Math.sin(t * 2) * 0.015);
    player.rotation.z += (-dx * 0.12 - player.rotation.z) * Math.min(1, dt * 10);
    updateCustomers(dt);
    for (const c of customers) { follow(c.el, c.g, 3.0); c.el.querySelector("b").style.width = Math.max(0, c.pat) * 100 + "%"; }
    const mk = wrap.querySelector(".making");
    mk.style.opacity = state.makeT >= 0 ? 1 : 0;
    mk.firstChild.style.width = Math.min(1, state.makeT / 0.9) * 100 + "%";
    follow(mk, player, 3.0);
    steam.forEach((s) => { const k = (t * 0.5 + s.userData.o) % 1; s.position.y = 0.9 + k * 0.9; s.material.opacity = 0.6 * (1 - k); s.scale.setScalar(0.6 + k); });
    flag.rotation.y = Math.sin(t * 3) * 0.2;
    for (const r of rickshaws) {
      r.x += r.v * dt;
      if (r.x > 22) r.x = -22;
      if (r.x < -22) r.x = 22;
      r.g.position.set(r.x, 0.06 + Math.abs(Math.sin(t * 9 + r.z)) * 0.02, r.z);
    }
  };
  S.start();
  return () => { S.stop(); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); clearTimeout(toastTimer); };
}

/* ---------- Robo Escape ---------- */
function roboGame(root) {
  if (!window.THREE) { root.innerHTML = NO3D; return; }
  const wrap = document.createElement("div");
  wrap.className = "g3d";
  wrap.innerHTML = `
    <div class="g3d-hud"><div class="pill">Level <b data-k="level">1</b></div><div class="pill">Lives <b data-k="lives">3</b></div><div class="pill">Score <b data-k="score">0</b></div><button class="rbtn" data-k="restart" aria-label="Restart">↻</button></div>
    <div class="g3d-toast"></div>
    <div class="g3d-ctrl"><div class="pad4"><button class="gbtn round" data-k="up" aria-label="Up">▲</button><button class="gbtn round" data-k="left" aria-label="Left">◀</button><button class="gbtn round" data-k="down" aria-label="Down">▼</button><button class="gbtn round" data-k="right" aria-label="Right">▶</button></div></div>
    <div class="g3d-over show"><div class="card3"><p class="tag">PlaySpace Game</p><h2 data-k="title">Robo Escape</h2>
      <p data-k="msg">The facility is on lockdown. Slip past the red drones, grab the energy cells and reach the green exit portal.</p>
      <ul class="help"><li><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / arrows to move</li><li>A drone hit costs one life</li></ul>
      <button class="gbtn tea big" data-k="start">Boot up</button></div></div>`;
  root.appendChild(wrap);
  const q = (k) => wrap.querySelector(`[data-k=${k}]`);
  const S = stage3d(wrap), scene = S.scene, camera = S.camera;
  SC = scene;
  mat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.45 });
  const glow = (c, i = 1.6) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.4 });
  S.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  S.renderer.outputEncoding = THREE.sRGBEncoding;
  S.renderer.shadowMap.enabled = false;
  scene.background = new THREE.Color(0x05070b);
  scene.fog = new THREE.Fog(0x05070b, 7, 17);
  scene.add(new THREE.AmbientLight(0x4a5f80, 0.6));
  const lamp = new THREE.PointLight(0x7fe8ff, 1.6, 9, 1.6); scene.add(lamp);
  const exitL = new THREE.PointLight(0x35ff9a, 1.3, 5, 1.8); scene.add(exitL);
  const view = { h: 7.5, d: 5.2 };
  S.onResize = (w, h) => { const portrait = w / h < 1; view.h = portrait ? 10.5 : 7.5; view.d = portrait ? 7 : 5.2; };

  const cv = document.createElement("canvas"); cv.width = cv.height = 128;
  const c2 = cv.getContext("2d");
  c2.fillStyle = "#1a202c"; c2.fillRect(0, 0, 128, 128);
  c2.strokeStyle = "#0b0e14"; c2.lineWidth = 4; c2.strokeRect(2, 2, 124, 124);
  c2.fillStyle = "#2c3647";
  for (const [x, y] of [[10, 10], [118, 10], [10, 118], [118, 118]]) { c2.beginPath(); c2.arc(x, y, 3, 0, 7); c2.fill(); }
  for (let i = 0; i < 120; i++) { c2.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`; c2.fillRect(Math.random() * 128, Math.random() * 128, 2, 2); }
  const floorTex = new THREE.CanvasTexture(cv);
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;

  const robot = new THREE.Group();
  box(0.46, 0.34, 0.4, 0x9aa5b8, 0, 0.38, 0, robot);
  ball(0.21, 0xc9d2e0, 0, 0.66, 0, robot);
  box(0.3, 0.1, 0.1, 0x05080f, 0, 0.68, 0.15, robot);
  for (const s of [-1, 1]) box(0.07, 0.07, 0.04, 0, s * 0.07, 0.68, 0.21, robot).material = glow(0x4fe3ff, 2);
  cyl(0.02, 0.02, 0.2, 0x6b7488, 0, 0.92, 0, robot);
  ball(0.04, 0, 0, 1.03, 0, robot).material = glow(0xff4d4d, 2);
  for (const s of [-1, 1]) box(0.12, 0.16, 0.46, 0x2a3140, s * 0.27, 0.12, 0, robot);
  scene.add(robot);

  let level = 1, lives = 3, score = 0, running = false, G, g, world, drones = [], cells = [], ring, exit = { x: 1, z: 1 }, invuln = 0, levelT = 0, t = 0, toastTimer;
  const pos = { x: 1, z: 1 }, cam = { x: 1, z: 1 };
  const hud = () => { q("level").textContent = level; q("lives").textContent = lives; q("score").textContent = score; };
  const toast = (text) => {
    const el = wrap.querySelector(".g3d-toast");
    el.textContent = text; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 1500);
  };

  function buildLevel() {
    if (world) scene.remove(world);
    world = new THREE.Group(); scene.add(world);
    const N = Math.min(4 + level, 9);
    G = 2 * N + 1;
    g = Array.from({ length: G }, () => Array(G).fill(1));
    const st = [[1, 1]]; g[1][1] = 0;
    while (st.length) {
      const [x, y] = st[st.length - 1];
      const nb = shuffle([[2, 0], [-2, 0], [0, 2], [0, -2]]).map(([a, b]) => [x + a, y + b, a / 2, b / 2])
        .filter(([nx, ny]) => nx > 0 && ny > 0 && nx < G - 1 && ny < G - 1 && g[ny][nx]);
      if (!nb.length) { st.pop(); continue; }
      const [nx, ny, hx, hy] = nb[0];
      g[y + hy][x + hx] = 0; g[ny][nx] = 0; st.push([nx, ny]);
    }
    for (let k = 0; k < N * 2; k++) {
      const x = 1 + Math.floor(Math.random() * (G - 2)), y = 1 + Math.floor(Math.random() * (G - 2));
      if (g[y][x] && ((!g[y][x - 1] && !g[y][x + 1]) || (!g[y - 1][x] && !g[y + 1][x]))) g[y][x] = 0;
    }
    floorTex.repeat.set(G, G);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(G, G), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.5, metalness: 0.6 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set((G - 1) / 2, 0, (G - 1) / 2); world.add(floor);
    const walls = [], open = [];
    g.forEach((row, y) => row.forEach((v, x) => (v ? walls : open).push([x, y])));
    const wm = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1.5, 1), mat(0x2b3547), walls.length);
    const tm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.84, 0.05, 0.84), glow(0x1fa6c9, 0.8), walls.length);
    const o = new THREE.Object3D();
    walls.forEach(([x, y], i) => {
      o.position.set(x, 0.75, y); o.updateMatrix(); wm.setMatrixAt(i, o.matrix);
      o.position.y = 1.52; o.updateMatrix(); tm.setMatrixAt(i, o.matrix);
    });
    world.add(wm, tm);
    exit = { x: G - 2, z: G - 2 };
    ring = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.06, 12, 32), glow(0x35ff9a, 1.8));
    ring.rotation.x = Math.PI / 2; ring.position.set(exit.x, 0.5, exit.z); world.add(ring);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.36, 24), new THREE.MeshBasicMaterial({ color: 0x35ff9a, transparent: true, opacity: 0.35 }));
    disc.rotation.x = -Math.PI / 2; disc.position.set(exit.x, 0.02, exit.z); world.add(disc);
    exitL.position.set(exit.x, 1, exit.z);
    const far = shuffle(open.filter(([x, y]) => x + y > 8 && !(x === exit.x && y === exit.z)));
    cells = far.slice(0, 3).map(([x, y]) => {
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.17), glow(0xffc247, 1.4));
      m.position.set(x, 0.5, y); world.add(m); return m;
    });
    drones = far.slice(3, 3 + Math.min(1 + level, 4)).map(([x, y]) => {
      const m = new THREE.Group();
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), glow(0xff3b30, 1.2));
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 8, 24), mat(0x2a3140));
      band.rotation.x = Math.PI / 2; m.add(body, band);
      const light = new THREE.PointLight(0xff3b30, 0.9, 3.5, 2); m.add(light);
      m.position.set(x, 0.7, y); world.add(m);
      const d = { m, x, z: y, tx: x, tz: y, dx: 0, dz: 0 };
      pickDir(d); return d;
    });
    pos.x = 1; pos.z = 1; cam.x = 1; cam.z = 1; invuln = 1.5; levelT = 0;
    hud();
  }
  function pickDir(d) {
    const cx = d.tx, cz = d.tz;
    let opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([a, b]) => !g[cz + b][cx + a]);
    const fwd = opts.filter(([a, b]) => !(a === -d.dx && b === -d.dz));
    if (fwd.length) opts = fwd;
    const dist = (o) => Math.hypot(cx + o[0] - pos.x, cz + o[1] - pos.z);
    const c = Math.random() < 0.3 + level * 0.05 ? opts.reduce((m, o) => (dist(o) < dist(m) ? o : m)) : pick(opts);
    d.dx = c[0]; d.dz = c[1]; d.tx = cx + c[0]; d.tz = cz + c[1];
  }
  const blocked = (x, z) => [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].some(([a, b]) => g[Math.round(z + b)][Math.round(x + a)]);

  const keys = {}, virt = { up: 0, down: 0, left: 0, right: 0 };
  const kd = (e) => { if (!root.isConnected) return; keys[e.code] = true; if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault(); };
  const ku = (e) => { keys[e.code] = false; };
  window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
  for (const k of Object.keys(virt)) holdBtn(q(k), () => (virt[k] = 1), () => (virt[k] = 0));

  function startGame() {
    level = 1; lives = 3; score = 0; running = true;
    buildLevel();
    wrap.querySelector(".g3d-over").classList.remove("show");
  }
  function endGame() {
    running = false;
    const best = Math.max(Number(store.get("ps-robo-best")) || 0, score);
    store.set("ps-robo-best", best);
    q("title").textContent = "System failure";
    q("msg").innerHTML = `Reached level <b>${level}</b> · <b>${score}</b> points<br><small>Best score: ${best}</small>`;
    wrap.querySelector(".help").style.display = "none";
    q("start").textContent = "Reboot ↻";
    wrap.querySelector(".g3d-over").classList.add("show");
  }
  q("start").addEventListener("click", startGame); q("restart").addEventListener("click", startGame);

  S.onFrame = (dt) => {
    t += dt;
    if (running) {
      levelT += dt; invuln = Math.max(0, invuln - dt);
      const ix = (keys.KeyD || keys.ArrowRight || virt.right ? 1 : 0) - (keys.KeyA || keys.ArrowLeft || virt.left ? 1 : 0);
      const iz = (keys.KeyS || keys.ArrowDown || virt.down ? 1 : 0) - (keys.KeyW || keys.ArrowUp || virt.up ? 1 : 0);
      if (ix || iz) {
        const l = Math.hypot(ix, iz), vx = ix / l * 3.6 * dt, vz = iz / l * 3.6 * dt;
        if (!blocked(pos.x + vx, pos.z)) pos.x += vx;
        if (!blocked(pos.x, pos.z + vz)) pos.z += vz;
        let da = Math.atan2(ix, iz) - robot.rotation.y;
        da = Math.atan2(Math.sin(da), Math.cos(da));
        robot.rotation.y += da * Math.min(1, dt * 12);
      }
      for (const d of drones) {
        const ddx = d.tx - d.x, ddz = d.tz - d.z, dist = Math.hypot(ddx, ddz), step = (1.7 + level * 0.15) * dt;
        if (dist <= step) { d.x = d.tx; d.z = d.tz; pickDir(d); }
        else { d.x += ddx / dist * step; d.z += ddz / dist * step; }
        d.m.position.set(d.x, 0.7 + Math.sin(t * 4 + d.x) * 0.06, d.z);
        if (invuln <= 0 && Math.hypot(d.x - pos.x, d.z - pos.z) < 0.5) {
          lives--; invuln = 2; pos.x = 1; pos.z = 1; hud();
          toast("Caught by a drone!");
          if (lives <= 0) endGame();
        }
      }
      cells = cells.filter((c) => {
        if (Math.hypot(c.position.x - pos.x, c.position.z - pos.z) < 0.45) { world.remove(c); score += 50; hud(); toast("+50 energy"); return false; }
        return true;
      });
      if (Math.hypot(exit.x - pos.x, exit.z - pos.z) < 0.5) {
        const bonus = 100 * level + Math.max(0, Math.round(60 - levelT)) * 2;
        score += bonus; level++;
        toast(`Level clear! +${bonus}`);
        buildLevel();
      }
    }
    robot.position.set(pos.x, Math.sin(t * 6) * 0.015, pos.z);
    robot.visible = invuln <= 0 || Math.floor(t * 10) % 2 === 0;
    lamp.position.set(pos.x, 1.6, pos.z);
    if (ring) ring.rotation.z = t * 2;
    cells.forEach((c, i) => { c.rotation.y = t * 2 + i; c.position.y = 0.5 + Math.sin(t * 3 + i) * 0.06; });
    const k = Math.min(1, dt * 6);
    cam.x += (pos.x - cam.x) * k; cam.z += (pos.z - cam.z) * k;
    camera.position.set(cam.x, view.h, cam.z + view.d);
    camera.lookAt(cam.x, 0, cam.z - 0.3);
  };
  buildLevel();
  S.start();
  return () => { S.stop(); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); clearTimeout(toastTimer); };
}

/* ---------- Rooftop Jump ---------- */
function rooftopGame(root) {
  const W = 540, H = 300;
  root.innerHTML = `
    <div class="stats"><span>Score <b id="rs">0</b></span><span>Best <b id="rb">0</b></span></div>
    <canvas class="gamecv" width="${W}" height="${H}" aria-label="Rooftop Jump game"></canvas>
    <p class="muted mt">Tap, click or press Space to jump. Hold to jump higher.</p>`;
  const cv = root.querySelector("canvas"), c = cv.getContext("2d");
  let best = Number(store.get("ps-rooftop-best")) || 0;
  root.querySelector("#rb").textContent = best;
  let mode = "ready", raf, last = 0, holding = false, dist = 0, speed = 5, bld = [], p, buffer = 0, frame = 0, diedAt = 0, shown = -1;
  const stars = Array.from({ length: 40 }, () => [Math.random() * W, Math.random() * 150, Math.random() * 1.5 + .5]);
  const far = Array.from({ length: 14 }, (_, i) => [i * 60, 40 + Math.random() * 80, 40 + Math.random() * 25]);
  const mid = Array.from({ length: 10 }, (_, i) => [i * 84, 40 + Math.random() * 70, 50 + Math.random() * 30]);

  function addB() {
    const l = bld[bld.length - 1];
    bld.push({ x: l.x + l.w + 55 + speed * (6 + Math.random() * 7), w: 140 + Math.random() * 170, h: clamp(l.h + Math.random() * 80 - 40, 60, 150), tank: Math.random() < .4, s: Math.floor(Math.random() * 100) });
  }
  function reset() {
    bld = [{ x: 0, w: 330, h: 90, tank: false, s: 3 }];
    p = { x: 90, y: H - 90, vy: 0, ground: true, air: 0 };
    dist = 0; speed = 5; buffer = 0;
    while (bld[bld.length - 1].x < W + 300) addB();
  }
  function jump() {
    if (mode === "ready") { reset(); mode = "run"; }
    else if (mode === "dead") { if (performance.now() - diedAt > 400) { reset(); mode = "run"; } return; }
    buffer = 8;
  }
  function die() {
    mode = "dead"; diedAt = performance.now();
    const sc = Math.floor(dist / 10);
    if (sc > best) { best = sc; store.set("ps-rooftop-best", best); root.querySelector("#rb").textContent = best; }
  }
  function step(k) {
    frame++;
    if (mode !== "run") return;
    speed = Math.min(9, 5 + dist / 3000);
    const dx = speed * k;
    dist += dx;
    bld.forEach((b) => (b.x -= dx));
    if (bld[0].x + bld[0].w < -20) bld.shift();
    while (bld[bld.length - 1].x < W + 300) addB();
    p.air = p.ground ? 0 : p.air + k;
    if (buffer > 0) { buffer -= k; if (p.air < 6 && p.vy >= 0) { p.vy = -10.5; p.ground = false; p.air = 99; buffer = 0; } }
    p.vy += (holding && p.vy < 0 ? 0.38 : 0.7) * k;
    const prev = p.y;
    p.y += p.vy * k;
    p.ground = false;
    for (const b of bld) {
      const top = H - b.h;
      if (p.x + 9 > b.x && p.x - 9 < b.x + b.w) {
        if (prev <= top + 10 && p.y >= top && p.vy >= 0) { p.y = top; p.vy = 0; p.ground = true; }
        else if (p.y > top + 10) { die(); }
      }
    }
    if (p.y > H + 40) die();
    const sc = Math.floor(dist / 10);
    if (sc !== shown) { shown = sc; root.querySelector("#rs").textContent = sc; }
  }
  function draw() {
    const sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#1c1b4d"); sky.addColorStop(.6, "#7b3f8c"); sky.addColorStop(1, "#ff9a76");
    c.fillStyle = sky; c.fillRect(0, 0, W, H);
    stars.forEach((s) => { c.fillStyle = `rgba(255,255,255,${.4 + .4 * Math.sin(frame / 20 + s[0])})`; c.fillRect(s[0], s[1], s[2], s[2]); });
    c.fillStyle = "#ffe9a8"; c.beginPath(); c.arc(430, 64, 26, 0, 7); c.fill();
    c.fillStyle = "#3d2f6b"; far.forEach((f) => { const x = ((f[0] - dist * .15) % 840 + 840) % 840 - 60; c.fillRect(x, H - f[1] - 60, f[2], f[1] + 60); });
    c.fillStyle = "#2c2556"; mid.forEach((f) => { const x = ((f[0] - dist * .35) % 840 + 840) % 840 - 80; c.fillRect(x, H - f[1] - 30, f[2], f[1] + 30); });
    bld.forEach((b) => {
      const top = H - b.h;
      c.fillStyle = "#232a4d"; c.fillRect(b.x, top, b.w, b.h);
      c.fillStyle = "#3a4476"; c.fillRect(b.x, top, b.w, 6);
      for (let i = 0, wx = b.x + 14; wx < b.x + b.w - 20; i++, wx += 26)
        for (let j = 0, wy = top + 18; wy < H - 10; j++, wy += 26) {
          c.fillStyle = (i * 7 + j * 13 + b.s) % 5 > 1 ? "#ffd97a" : "#2f3860";
          c.fillRect(wx, wy, 12, 14);
        }
      if (b.tank) {
        c.fillStyle = "#8a93b8"; c.fillRect(b.x + 24, top - 24, 34, 20);
        c.fillStyle = "#6b7399"; c.fillRect(b.x + 22, top - 28, 38, 5);
        c.fillRect(b.x + 28, top - 5, 4, 5); c.fillRect(b.x + 50, top - 5, 4, 5);
      }
    });
    const sw = mode === "run" && p.ground ? Math.sin(frame * .5) * 6 : 0, px = p.x, py = p.y;
    c.fillStyle = "#111"; c.fillRect(px - 6 + sw, py - 12, 5, 12); c.fillRect(px + 1 - sw, py - 12, 5, 12);
    c.fillStyle = "#0a7a4b"; c.fillRect(px - 8, py - 30, 16, 19);
    c.fillStyle = "#e63946"; c.fillRect(px - 15, py - 29 + Math.sin(frame * .4) * 2, 9, 4);
    c.fillStyle = "#c68a5a"; c.beginPath(); c.arc(px, py - 37, 7, 0, 7); c.fill();
    c.fillStyle = "#1b1b1b"; c.beginPath(); c.arc(px, py - 39, 7, Math.PI, 0); c.fill();
    if (mode !== "run") {
      c.fillStyle = "rgba(10,8,30,.55)"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#fff"; c.textAlign = "center";
      c.font = "800 30px sans-serif";
      c.fillText(mode === "ready" ? "Rooftop Jump" : "Game over · " + Math.floor(dist / 10), W / 2, H / 2 - 8);
      c.font = "600 16px sans-serif";
      c.fillText(mode === "ready" ? "Tap to start" : "Tap to try again", W / 2, H / 2 + 22);
    }
  }
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const k = Math.min(2, (ts - last) / 16.67 || 1); last = ts;
    step(k); draw();
  }
  const keyOn = (e) => { if (["Space", "ArrowUp", "KeyW"].includes(e.code)) { e.preventDefault(); if (!e.repeat) { holding = true; jump(); } } };
  const keyOff = (e) => { if (["Space", "ArrowUp", "KeyW"].includes(e.code)) holding = false; };
  window.addEventListener("keydown", keyOn); window.addEventListener("keyup", keyOff);
  cv.addEventListener("pointerdown", (e) => { e.preventDefault(); holding = true; jump(); });
  for (const ev of ["pointerup", "pointerleave", "pointercancel"]) cv.addEventListener(ev, () => { holding = false; });
  reset(); raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", keyOn); window.removeEventListener("keyup", keyOff); };
}

/* ---------- LIVE API GAMES & APPS (With Fallbacks) ---------- */

// 1. Battle Quiz BD (Uses OpenTrivia DB API)
function battleGame(root) {
  root.innerHTML = `<p class="muted mt">Loading live trivia questions...</p>`;
  let timer, nextTimeout;

  fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then(data => {
      if (!data.results || !data.results.length) throw new Error("No results");
      return data.results;
    })
    .catch(() => FALLBACK_QUESTIONS)
    .then(qs => {
      let i = 0, me = 100, foe = 100, left = 12, busy = false, cur;

      root.innerHTML = `
        <div class="hp">
          <div class="me"><small><b>You</b><span id="meT">100 HP</span></small><div class="meter"><i id="meB"></i></div></div>
          <div class="foe"><small><b>Rival Bot</b><span id="foeT">100 HP</span></small><div class="meter"><i id="foeB"></i></div></div>
        </div>
        <div class="meter"><i id="bt"></i></div>
        <div id="bq"></div>
        <p class="log" id="bl"></p>`;

      const q$ = (s) => root.querySelector(s);
      const hp = () => {
        if (!q$("#meB")) return;
        q$("#meB").style.width = me + "%"; q$("#foeB").style.width = foe + "%";
        q$("#meT").textContent = me + " HP"; q$("#foeT").textContent = foe + " HP";
      };

      function decodeHTML(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
      }

      function ask() {
        busy = false; left = 12;
        const qObj = qs[i];
        const a = decodeHTML(qObj.correct_answer);
        const w = qObj.incorrect_answers.map(decodeHTML);
        cur = { a, opts: shuffle([a, ...w]) };

        q$("#bq").innerHTML = `<p class="q">${decodeHTML(qObj.question)}</p><div class="opts">${cur.opts.map((o, k) => `<button class="opt" data-n="${k}">${o}</button>`).join("")}</div>`;
        q$("#bl").textContent = `Question ${i + 1} of ${qs.length}. Category: ${qObj.category}`;
        const bt = q$("#bt");
        bt.style.transition = "none"; bt.style.width = "100%"; bt.offsetWidth;
        bt.style.transition = `width 12s linear`; bt.style.width = "0%";
        
        clearInterval(timer);
        timer = setInterval(() => { if (--left <= 0) answer(-1); }, 1000);
        root.querySelectorAll(".opt").forEach((b) => b.onclick = () => answer(+b.dataset.n));
      }

      function answer(n) {
        if (busy) return;
        busy = true; clearInterval(timer);
        const ok = n >= 0 && cur.opts[n] === cur.a;
        root.querySelectorAll(".opt").forEach((b, k) => {
          b.disabled = true;
          if (cur.opts[k] === cur.a) b.classList.add("right"); else if (k === n) b.classList.add("wrong");
        });
        if (ok) { const d = left >= 8 ? 30 : 25; foe = Math.max(0, foe - d); q$("#bl").textContent = `Correct! Rival lost ${d} HP.`; }
        else { me = Math.max(0, me - 20); q$("#bl").textContent = n < 0 ? "Time's up! You lost 20 HP." : "Wrong answer! You lost 20 HP."; }
        hp();
        nextTimeout = setTimeout(() => (foe <= 0 || me <= 0 || ++i >= qs.length ? end() : ask()), 1300);
      }

      function end() {
        const win = foe <= 0 || (me > 0 && me > foe), draw = me > 0 && foe > 0 && me === foe;
        root.innerHTML = `
          <div class="big">${win ? "You win!" : draw ? "Draw!" : "Rival wins"}</div>
          <p class="muted mt">${win ? "Great job!" : draw ? "Tie match!" : "Try again!"}<br>You: ${me} HP · Rival: ${foe} HP</p>
          <button class="btn mt" id="again">Play Again</button>`;
        root.querySelector("#again").onclick = () => battleGame(root);
      }
      hp(); ask();
    })
    .catch(() => {
      root.innerHTML = `<p class="muted mt">Failed to fetch trivia questions. Check connection.</p>`;
    });

  return () => { clearInterval(timer); clearTimeout(nextTimeout); };
}

// 2. Guess the Flag (Uses REST Countries API with Fallback)
function guessGame(root) {
  root.innerHTML = `<p class="muted mt">Loading live flag data...</p>`;
  let nextTimeout;

  fetch("https://restcountries.com/v3.1/all?fields=name,flags")
    .then(res => res.json())
    .catch(() => FALLBACK_COUNTRIES)
    .then(countries => {
      const order = shuffle(countries).slice(0, 8);
      let q = 0, score = 0, busy = false;

      function show() {
        busy = false;
        const f = order[q];
        const wrongChoices = shuffle(countries.filter((x) => x.name.common !== f.name.common)).slice(0, 3);
        const opts = shuffle([f, ...wrongChoices]);

        root.innerHTML = `
          <div class="stats"><span>Flag <b>${q + 1}/${order.length}</b></span><span>Score <b>${score}</b></span></div>
          <div class="flagbox"><img src="${f.flags.png}" class="flag" alt="Flag"></div>
          <div class="opts">${opts.map((o) => `<button class="opt" data-n="${o.name.common}">${o.name.common}</button>`).join("")}</div>`;

        root.querySelectorAll(".opt").forEach((b) => b.onclick = () => {
          if (busy) return;
          busy = true;
          const ok = b.dataset.n === f.name.common;
          if (ok) score++;
          root.querySelectorAll(".opt").forEach((x) => { x.disabled = true; if (x.dataset.n === f.name.common) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          nextTimeout = setTimeout(() => (++q < order.length ? show() : finish()), 1000);
        });
      }

      function finish() {
        const msg = score >= 7 ? "Flag Master!" : score >= 4 ? "Nice Work!" : "Keep Exploring!";
        root.innerHTML = `<div class="big">${score}/${order.length}</div><p class="muted mt">${msg}</p><button class="btn mt" id="again">Play Again</button>`;
        root.querySelector("#again").onclick = () => guessGame(root);
      }
      show();
    });

  return () => clearTimeout(nextTimeout);
}

// 3. Explore World (Uses REST Countries API with Fallback)
function worldGame(root) {
  root.innerHTML = `<p class="muted mt">Loading countries from REST API...</p>`;

  fetch("https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population")
    .then(res => res.json())
    .catch(() => FALLBACK_COUNTRIES)
    .then(countries => {
      let list = shuffle(countries).slice(0, 20);
      let cont = "All", sel = list[0];
      const box = document.createElement("div");
      box.innerHTML = `<div class="info" id="wi"></div><div class="chips" id="wc"></div><div class="flags" id="wf"></div>`;
      root.innerHTML = "";
      root.appendChild(box);

      const draw = () => {
        box.querySelector("#wi").innerHTML = `
          <div class="flagbox"><img src="${sel.flags.png}" class="flag" alt="Flag"></div>
          <h3>${sel.name.common}</h3>
          <p class="muted">Capital: ${sel.capital ? sel.capital[0] : 'N/A'} · Region: ${sel.region || 'World'}</p>
          <p class="fact">Population: ${(sel.population || 0).toLocaleString()}</p>`;
        box.querySelector("#wc").innerHTML = ["All", "Asia", "Europe", "Africa", "Americas"].map((c) => `<button class="chip${c === cont ? " active" : ""}" data-c="${c}">${c}</button>`).join("");
        box.querySelector("#wf").innerHTML = list.filter((f) => cont === "All" || f.region === cont).map((f) =>
          `<button class="${f.name.common === sel.name.common ? "on" : ""}" data-n="${f.name.common}"><div class="flagbox"><img src="${f.flags.png}" class="flag"></div><small>${f.name.common}</small></button>`).join("");
      };

      box.addEventListener("click", (e) => {
        const c = e.target.closest("[data-c]"), f = e.target.closest("[data-n]");
        if (c) cont = c.dataset.c;
        if (f) sel = list.find((x) => x.name.common === f.dataset.n);
        if (c || f) draw();
      });
      draw();
    });
}

/* ---------- Launchers ---------- */
const launchers = {
  battle: battleGame,
  guess: guessGame,
  world: worldGame,
  rooftop: rooftopGame,
  chaos: chaosGame,
  robo: roboGame
};

setCat("all");