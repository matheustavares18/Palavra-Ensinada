// ===== Montagem da linha do tempo, câmera, legendas e reprodução =====
const CPS = 17.2;          // ~170 palavras/min: ritmo ágil de narrador (estimativa até existir a narração final)
const CPS_SHORT = 18.2;    // Shorts: mesma voz ~6% mais rápida (ritmo de Shorts)
const GAP = 0.2;           // respiro entre falas
const SHOT = 2.6;          // troca de enquadramento a cada ~2,6 s
const XFADE = 0.35;        // transição entre cenas
const TAIL = 2.0;          // tela depois da última palavra
const SCENE_OY = { themeTitle: 0, recap: 0, end: 0, attributes: 0, comment: 0, hebrew: 0, galaxy: 0, scroll: 0, bibleIntro: 0 };

function buildScript(mode) {
  if (!mode || mode === 'full') return SCRIPT;
  const n = +mode, sh = SHORTS[n];
  let part = SCRIPT.filter(e => e.sec === n).map(e => ({ ...e, banner: null }));
  let card = null;
  if (sh.skipFirst) { card = part[0].card; part = part.slice(1); }
  return [{ t: sh.open[0], sc: sh.open[1], p: sh.open[2], sec: n, card, banner: SCRIPT.find(e => e.sec === n).banner }, ...part, { t: SHORT_CTA[0], sc: SHORT_CTA[1], p: SHORT_CTA[2], sec: 'cta' }];
}

function chunkText(text) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const chunks = []; let cur = '';
  for (const w of words) {
    const nx = cur ? cur + ' ' + w : w;
    if (nx.length > 38 && cur) { chunks.push(cur); cur = w; }
    else { cur = nx; if (/[.,:;?!…]["”]?$/.test(w) && cur.length >= 18) { chunks.push(cur); cur = ''; } }
  }
  if (cur) chunks.push(cur);
  // junta sobras muito curtas
  for (let i = chunks.length - 1; i > 0; i--) if (chunks[i].length < 8 && (chunks[i - 1].length + chunks[i].length) < 44) { chunks[i - 1] += ' ' + chunks[i]; chunks.splice(i, 1); }
  return chunks;
}
function wrapLines(text, max) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { const nx = cur ? cur + ' ' + w : w; if (nx.length > max && cur) { lines.push(cur); cur = w; } else cur = nx; }
  if (cur) lines.push(cur); return lines;
}

function buildTimeline(mode, timings) {
  const script = buildScript(mode);
  let T = 0.4; const segs = [];
  const cps = (!mode || mode === 'full') ? CPS : CPS_SHORT;
  script.forEach((e, i) => {
    const txt = e.t.replace(/"/g, '');
    let dur = Math.max(1.4, txt.length / cps);
    let start = T;
    if (timings && timings[i]) { start = timings[i][0]; dur = timings[i][1] - timings[i][0]; }
    const chunks = chunkText(txt); const tot = chunks.reduce((a, c) => a + c.length + 4, 0);
    let ct = start; const cs = chunks.map(c => { const d = dur * (c.length + 4) / tot; const o = { text: c, s: ct, e: ct + d, kw: findKeyword(c) }; ct += d; return o; });
    segs.push({ ...e, s: start, e: start + dur, chunks: cs, i });
    T = start + dur + GAP;
  });
  // blocos de cena contínuos
  const blocks = []; let bi = -1;
  segs.forEach(sg => {
    const key = sg.sc + JSON.stringify(sg.p);
    if (bi < 0 || blocks[bi].key !== key) { blocks.push({ key, sc: sg.sc, p: sg.p, s: bi < 0 ? 0 : sg.s - GAP / 2, idx: blocks.length }); bi++; }
    blocks[bi].e = sg.e + GAP / 2;
  });
  blocks.forEach((b, i) => { if (blocks[i + 1]) b.e = blocks[i + 1].s; });
  const total = segs[segs.length - 1].e + TAIL;
  blocks[blocks.length - 1].e = total;
  return { segs, blocks, total, mode };
}

function shotAt(shots, k, lt) {
  return shots[k % shots.length];
}
function camFor(block, lt, shots, first) {
  const n = shots.length; const start = first ?? (block.idx % n);
  const i = Math.floor(lt / SHOT); const f = (lt - i * SHOT) / SHOT;
  const cur = shots[(start + i) % n], prev = shots[(start + i - 1 + n) % n];
  const k = i === 0 ? 1 : ease(clamp((lt - i * SHOT) / 0.75, 0, 1));
  const z0 = prev.z * 1.035, z1 = cur.z * (1 + 0.035 * f);
  const lerpS = (a, b) => lerp(a, b, k);
  return { fx: lerpS(prev.fx, cur.fx), fy: lerpS(prev.fy, cur.fy), z: lerpS(z0, z1), sy: lerpS(prev.sy, cur.sy), drift: f };
}
function camTransform(c, oy) {
  const z = c.z, cx = c.fx, cy = c.fy + oy + (512 - c.sy) / z;
  const ccx = clamp(cx, 288 / z - 40, W - 288 / z + 40), ccy = clamp(cy, 512 / z - 40, H - 512 / z + 120);
  return `translate(288,512) scale(${f1(z * 1000) / 1000}) translate(${f1(-ccx)},${f1(-ccy)}) translate(0,${oy})`;
}
function renderScene(block, T) {
  const lt = T - block.s;
  const r = S[block.sc](lt, block.p);
  const oy = SCENE_OY[block.sc] ?? -90;
  const cam = camFor(block, lt, r.shots, r.first);
  return `<g transform="${camTransform(cam, oy)}">${r.svg}</g>${r.ov || ''}`;
}

const GOLD = '#ffd84d';
function subtitleSVG(ch, T) {
  const lines = wrapLines(ch.text, 22);
  const kw = ch.kw; const k = clamp((T - ch.s) / .12, 0, 1);
  const LH = 42, yb = 880, y0 = yb - (lines.length - 1) * LH;
  const wmax = Math.min(440, Math.max(...lines.map(l => l.length)) * 18.5 + 40);
  const box = '';
  const txt = lines.map((ln, i) => {
    let words = ln.split(' ').map(w => {
      const hit = kw && norm(w).replace(/[^a-z\s]/g, '').startsWith(kw.k.split(' ')[0]) || /^El$|^Roi/.test(w) && kw && kw.k === 'el roi';
      return `<tspan fill="${hit ? GOLD : '#fff'}">${esc(w)}</tspan>`;
    }).join(' ');
    return `<text x="288" y="${y0 + i * LH}" text-anchor="middle" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="34" stroke="#000" stroke-width="7" stroke-linejoin="round" paint-order="stroke" filter="url(#tsh)" opacity="${f1(k)}">${words}</text>`;
  }).join('');
  return box + txt;
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function iconBadge(ch, T) {
  if (!ch.kw || !ICONS[ch.kw.ic]) return '';
  const k = pop((T - ch.s) / .35); if (k <= 0) return '';
  const fl = Math.sin(T * 2) * 3;
  return `<g transform="translate(438,${f1(512 + fl)}) scale(${f1(k)})"><circle r="36" fill="#fff8e6" stroke="#d7a84a" stroke-width="3"/><g transform="scale(.9)">${ICONS[ch.kw.ic]()}</g></g>`;
}
function cardSVG(seg, T) {
  const c = seg.card; if (!c) return '';
  const k = easeOut((T - seg.s - .2) / .5); if (k <= 0) return '';
  const shade = `<defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".62"/><stop offset=".75" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect x="0" y="0" width="576" height="${c.v ? 400 : 420}" fill="url(#tg)" opacity="${f1(k)}"/>`;
  if (c.ref) {
    const d0 = seg.banner ? 3.1 : 0;
    const kk = easeOut((T - seg.s - d0) / .45); if (kk <= 0) return '';
    const w = c.ref.length * 13 + 60;
    return `<g opacity="${f1(kk)}" transform="translate(288,${f1(190 - (1 - kk) * 10)})"><path d="M${-w / 2 - 14} 0 L${-w / 2} -22 L${w / 2} -22 L${w / 2 + 14} 0 L${w / 2} 22 L${-w / 2} 22Z" fill="#1a0f05" opacity=".72"/><path d="M${-w / 2 - 14} 0 L${-w / 2} -22 L${w / 2} -22 L${w / 2 + 14} 0 L${w / 2} 22 L${-w / 2} 22Z" fill="none" stroke="#d7a84a" stroke-width="2"/><text y="9" text-anchor="middle" font-family="'Times New Roman', 'Liberation Serif', serif" font-weight="bold" font-size="25" letter-spacing="2" fill="#ffd84d">${esc(c.ref)}</text></g>`;
  }
  if (c.v) {
    const lines = wrapLines(c.v, 30);
    const y0 = 196 + (lines.length > 4 ? -8 : 0);
    let s = lines.map((l, i) => `<text x="288" y="${y0 + i * 31}" text-anchor="middle" font-family="'Times New Roman', 'Liberation Serif', serif" font-size="26" font-style="italic" fill="${GOLD}" stroke="#2a1a00" stroke-width="3" paint-order="stroke">${esc(l)}</text>`).join('');
    s += `<text x="288" y="${y0 + lines.length * 31 + 10}" text-anchor="middle" font-family="'Times New Roman', 'Liberation Serif', serif" font-size="19" letter-spacing="2" fill="#f3e6c8" stroke="#2a1a00" stroke-width="3" paint-order="stroke">${esc(c.ref)}</text>`;
    return shade + `<g opacity="${f1(k)}" transform="translate(0,${f1((1 - k) * -10)})">${s}</g>`;
  }
  const lines = wrapLines(c.impact, 16);
  const sc = pop((T - seg.s - .2) / .45);
  let s = lines.map((l, i) => `<text x="0" y="${i * 50}" text-anchor="middle" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="44" stroke="#000" stroke-width="7" stroke-linejoin="round" paint-order="stroke">${l.split(' ').map(w => /\*/.test(w) ? `<tspan fill="${GOLD}">${esc(w.replace(/\*/g, ''))}</tspan>` : `<tspan fill="#fff">${esc(w)}</tspan>`).join(' ')}</text>`).join('');
  return shade + `<g transform="translate(288,${230 - (lines.length - 1) * 25}) scale(${f1(sc)})">${s}</g>`;
}
function bannerSVG(seg, T) {
  const b = seg.banner; if (!b) return '';
  const lt = T - seg.s; if (lt > 3.2) return '';
  const k = easeOut(lt / .45) * (1 - easeOut((lt - 2.7) / .5));
  const lines = wrapLines(b.name.toUpperCase(), 22);
  const h = 30 + lines.length * 30;
  return `<g opacity="${f1(k)}" transform="translate(288,${f1(172 + (1 - k) * -10)})" font-family="Liberation Sans, Arial" font-weight="bold"><rect x="-215" y="0" width="430" height="${h}" rx="16" fill="#120a04" opacity=".7"/><rect x="-215" y="0" width="430" height="${h}" rx="16" fill="none" stroke="#d7a84a" stroke-width="2"/><circle cx="-172" cy="${h / 2}" r="26" fill="#d7a84a"/><text x="-172" y="${h / 2 + 12}" text-anchor="middle" font-size="34" fill="#2a1600">${b.n}</text><text x="-132" y="24" font-size="15" letter-spacing="2" fill="#f3e6c8">${b.n}ª DESCOBERTA</text>${lines.map((l, i) => `<text x="-132" y="${52 + i * 28}" font-size="25" fill="#ffd84d">${l}</text>`).join('')}</g>`;
}
function safeArea() {
  return `<g pointer-events="none"><rect x="0" y="0" width="576" height="154" fill="#ff0040" opacity=".25"/><rect x="0" y="665" width="576" height="359" fill="#ff0040" opacity=".25"/><rect x="474" y="154" width="102" height="511" fill="#ff0040" opacity=".25"/><rect x="0" y="154" width="34" height="511" fill="#ff0040" opacity=".25"/><rect x="34" y="154" width="440" height="511" fill="none" stroke="#ff0040" stroke-width="2" stroke-dasharray="6 6"/></g>`;
}

function frameSVG(TL, T, opts = {}) {
  const { blocks, segs, total } = TL;
  DEFS = {}; _uid = 0;
  let bi = blocks.findIndex(b => T >= b.s && T < b.e); if (bi < 0) bi = T < 0 ? 0 : blocks.length - 1;
  const b = blocks[bi];
  let world = renderScene(b, T);
  const tin = T - b.s;
  if (bi > 0 && tin < XFADE) world = renderScene(blocks[bi - 1], T) + `<g opacity="${f1(tin / XFADE)}">${world}</g>`;
  let ov = '';
  // fala atual (ou a última que terminou há pouco, para o cartão não sumir no respiro)
  const seg = segs.find(s => T >= s.s && T < s.e + GAP);
  if (seg) {
    ov += cardSVG(seg, T) + bannerSVG(seg, T);
    const ch = seg.chunks.find(c => T >= c.s && T < c.e) || (T >= seg.e ? null : null);
    if (ch) { ov += iconBadge(ch, T); ov += subtitleSVG(ch, T); }
  }
  const fadeIn = clamp(T / .6, 0, 1), fadeOut = clamp((total - T) / .8, 0, 1);
  const vign = `<defs><radialGradient id="vg" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="5"/></filter><filter id="tsh" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#000" flood-opacity=".8"/></filter></defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 1024" width="576" height="1024"><defs>${Object.values(DEFS).join('')}</defs>${vign}<rect width="576" height="1024" fill="#000"/>${world}<rect width="576" height="1024" fill="url(#vg)"/>${ov}${opts.safe ? safeArea() : ''}<rect width="576" height="1024" fill="#000" opacity="${f1(1 - Math.min(fadeIn, fadeOut))}"/></svg>`;
}

// ===== Página =====
let TL, playing = false, t0 = 0, Tcur = 0, audio = null, safeOn = false;
const qs = new URLSearchParams(location.search);
function setMode(m) { TL = buildTimeline(m, window.TIMINGS && window.TIMINGS[m || 'full']); Tcur = 0; draw(); updUI(); }
function draw() { document.getElementById('stage').innerHTML = frameSVG(TL, Tcur, { safe: safeOn }); }
window.renderAt = (T) => { Tcur = T; draw(); };
window.getTotal = () => TL.total;
window.setMode = setMode;
function fmt(s) { s = Math.max(0, s); return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); }
function updUI() { const r = document.getElementById('seek'); if (!r) return; r.max = TL.total; r.value = Tcur; document.getElementById('tm').textContent = fmt(Tcur) + ' / ' + fmt(TL.total); }
function loop() {
  if (playing) {
    Tcur = audio && !audio.paused ? audio.currentTime : (performance.now() - t0) / 1000;
    if (Tcur >= TL.total) { playing = false; Tcur = TL.total; if (audio) audio.pause(); document.getElementById('pp').textContent = '▶'; }
    draw(); updUI();
  }
  requestAnimationFrame(loop);
}
function play() { playing = !playing; document.getElementById('pp').textContent = playing ? '❚❚' : '▶'; if (playing) { t0 = performance.now() - Tcur * 1000; if (audio) { audio.currentTime = Tcur; audio.play(); } } else if (audio) audio.pause(); }
window.addEventListener('DOMContentLoaded', () => {
  const render = qs.has('render');
  document.body.classList.toggle('render', render);
  setMode(qs.get('part') || 'full');
  if (render) return;
  document.getElementById('pp').onclick = play;
  document.getElementById('seek').oninput = e => { Tcur = +e.target.value; t0 = performance.now() - Tcur * 1000; if (audio) audio.currentTime = Tcur; draw(); updUI(); };
  document.getElementById('mode').onchange = e => { playing = false; if (audio) audio.pause(); document.getElementById('pp').textContent = '▶'; setMode(e.target.value); };
  document.getElementById('safe').onchange = e => { safeOn = e.target.checked; draw(); };
  document.getElementById('mp3').onchange = e => { const f = e.target.files[0]; if (!f) return; audio = new Audio(URL.createObjectURL(f)); document.getElementById('mp3l').textContent = '✓ ' + f.name; };
  const embedded = document.getElementById('narr'); if (embedded && embedded.src) audio = embedded;
  requestAnimationFrame(loop);
});
