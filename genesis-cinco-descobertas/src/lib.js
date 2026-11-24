// ===== Utilitários =====
const W = 576, H = 1024;
const f1 = n => (Math.round(n * 10) / 10).toString();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => (k = clamp(k, 0, 1), k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const easeOut = k => (k = clamp(k, 0, 1), 1 - Math.pow(1 - k, 3));
const pop = k => { k = clamp(k, 0, 1); const c = 1.6; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const rnd = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function shade(hex, amt) {
  let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join('');
  let r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
let _uid = 0; const uid = p => p + (++_uid);

// ===== Elementos de cenário vivos =====
function sky(id, stops) {
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs>
  <rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#${id})"/>`;
}
function starsField(t, n, seed, y0 = -300, y1 = 700, big = 1) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = -300 + rnd(seed + i) * (W + 600), y = y0 + rnd(seed + i * 3.7) * (y1 - y0);
    const r = (0.6 + rnd(seed + i * 9.1) * 1.6) * big;
    const tw = 0.55 + 0.45 * Math.sin(t * (0.8 + rnd(i) * 1.5) + i);
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#fff" opacity="${f1(tw * 0.9)}"/>`;
  }
  return s;
}
function starShape(x, y, r, fill, rot = 0, op = 1) {
  let d = '';
  for (let i = 0; i < 10; i++) { const a = rot + i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + f1(x + Math.cos(a) * rr) + ' ' + f1(y + Math.sin(a) * rr); }
  return `<path d="${d}Z" fill="${fill}" opacity="${op}"/>`;
}
function clouds(t, y, n, seed, col = '#fff', op = .85, speed = 6, sc = 1) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const w = (70 + rnd(seed + i) * 90) * sc;
    let x = -250 + ((rnd(seed + i * 2) * (W + 500) + t * speed * (0.6 + rnd(i) * .8)) % (W + 500));
    const yy = y + rnd(seed + i * 5) * 120;
    s += `<g opacity="${op}" fill="${col}"><ellipse cx="${f1(x)}" cy="${f1(yy)}" rx="${f1(w)}" ry="${f1(w * .32)}"/><ellipse cx="${f1(x - w * .35)}" cy="${f1(yy - w * .12)}" rx="${f1(w * .45)}" ry="${f1(w * .3)}"/><ellipse cx="${f1(x + w * .25)}" cy="${f1(yy - w * .2)}" rx="${f1(w * .5)}" ry="${f1(w * .38)}"/></g>`;
  }
  return s;
}
function birds(t, n, seed, y, col = '#2b2b3a', sc = 1) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const sp = 22 + rnd(seed + i) * 20;
    const x = -100 + ((rnd(seed + i * 3) * 900 + t * sp) % 900);
    const yy = y + rnd(seed + i * 7) * 140 + Math.sin(t * 1.3 + i) * 8;
    const fl = Math.sin(t * 9 + i * 2) * 5;
    const k = (0.7 + rnd(seed + i * 11) * .6) * sc;
    s += `<path d="M${f1(x - 9 * k)} ${f1(yy - fl * k)} Q${f1(x - 4 * k)} ${f1(yy - 3 * k)} ${f1(x)} ${f1(yy)} Q${f1(x + 4 * k)} ${f1(yy - 3 * k)} ${f1(x + 9 * k)} ${f1(yy - fl * k)}" stroke="${col}" stroke-width="${f1(2 * k)}" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}
function butterflies(t, n, seed, x0, y0, w, h) {
  let s = ''; const cols = ['#f5b942', '#e86a92', '#7fc8f8', '#f7f7f7'];
  for (let i = 0; i < n; i++) {
    const x = x0 + w * (0.5 + 0.5 * Math.sin(t * 0.35 + i * 2.1 + seed));
    const y = y0 + h * (0.5 + 0.5 * Math.sin(t * 0.5 + i * 1.3));
    const fl = Math.abs(Math.sin(t * 12 + i)) * 0.8 + 0.2;
    const c = cols[i % cols.length];
    s += `<g transform="translate(${f1(x)},${f1(y)})"><ellipse cx="-4" cy="0" rx="${f1(5 * fl)}" ry="4" fill="${c}"/><ellipse cx="4" cy="0" rx="${f1(5 * fl)}" ry="4" fill="${c}"/><rect x="-0.7" y="-4" width="1.4" height="8" fill="#333"/></g>`;
  }
  return s;
}
function grassTufts(t, y, n, seed, col = '#3f8a3a', x0 = -200, x1 = W + 200) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd(seed + i) * (x1 - x0), yy = y + rnd(seed + i * 4) * 30, h = 10 + rnd(i * 3 + seed) * 14;
    const sw = Math.sin(t * 1.8 + i) * 3;
    s += `<path d="M${f1(x - 5)} ${f1(yy)} Q${f1(x - 3 + sw)} ${f1(yy - h * .6)} ${f1(x - 6 + sw)} ${f1(yy - h)} M${f1(x)} ${f1(yy)} Q${f1(x + sw)} ${f1(yy - h)} ${f1(x + 2 + sw)} ${f1(yy - h * 1.2)} M${f1(x + 5)} ${f1(yy)} Q${f1(x + 4 + sw)} ${f1(yy - h * .6)} ${f1(x + 8 + sw)} ${f1(yy - h * .9)}" stroke="${col}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}
function flowers(t, y, n, seed, x0 = -100, x1 = W + 100) {
  let s = ''; const cols = ['#ffd84d', '#ff8fab', '#ffffff', '#c19bff', '#ff7b54'];
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd(seed + i) * (x1 - x0), yy = y + rnd(seed + i * 2.3) * 60; const c = cols[i % cols.length];
    const sw = Math.sin(t * 1.5 + i) * 1.5;
    s += `<g transform="translate(${f1(x + sw)},${f1(yy)})"><line x1="0" y1="0" x2="${f1(-sw)}" y2="14" stroke="#3d7a35" stroke-width="1.6"/>${[0, 1, 2, 3, 4].map(k => `<circle cx="${f1(Math.cos(k * 1.256) * 4)}" cy="${f1(Math.sin(k * 1.256) * 4)}" r="3" fill="${c}"/>`).join('')}<circle r="2.2" fill="#f2a31b"/></g>`;
  }
  return s;
}
function tree(x, y, s, t, kind = 'round', seed = 1) {
  const sw = Math.sin(t * 0.9 + seed) * 2;
  if (kind === 'palm') {
    let fr = '';
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI + i * Math.PI / 6 + Math.sin(t + i) * 0.05;
      const ex = Math.cos(a) * 70, ey = Math.sin(a) * 40 + 25;
      fr += `<path d="M0 0 Q${f1(ex * .5)} ${f1(ey - 30)} ${f1(ex)} ${f1(ey)}" stroke="#2f7a3b" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    }
    return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-6 0 Q${f1(6 + sw)} -80 ${f1(sw * 3)} -160 L${f1(sw * 3 + 8)} -160 Q${f1(16 + sw)} -80 6 0Z" fill="#8a6239"/>${[...Array(8)].map((_, i) => `<line x1="${f1(-4 + sw * i / 8 * 3)}" y1="${-i * 20}" x2="${f1(8 + sw * i / 8 * 3)}" y2="${-i * 20 - 4}" stroke="#6b4826" stroke-width="2"/>`).join('')}<g transform="translate(${f1(sw * 3 + 4)},-160)">${fr}<circle cx="-6" cy="8" r="6" fill="#6b4a1f"/><circle cx="6" cy="9" r="6" fill="#6b4a1f"/></g></g>`;
  }
  if (kind === 'fig') {
    let lv = '';
    for (let i = 0; i < 16; i++) {
      const a = rnd(seed + i) * Math.PI * 2, r = 20 + rnd(seed + i * 3) * 55;
      const lx = Math.cos(a) * r * 1.2, ly = Math.sin(a) * r * .8 - 120;
      lv += figLeaf(lx + sw, ly, 0.9 + rnd(i) * .4, a * 57 + Math.sin(t + i) * 6, i % 3 ? '#3f8f3b' : '#4fa648');
    }
    return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-10 0 Q-4 -60 -18 -110 M10 0 Q4 -60 20 -105" stroke="#7a5532" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-12 0 Q0 -50 0 -90 Q0 -50 12 0Z" fill="#7a5532"/><ellipse cx="0" cy="-125" rx="85" ry="62" fill="#2f7232"/>${lv}${[0, 1, 2, 3, 4].map(i => `<circle cx="${f1(-50 + i * 25 + sw)}" cy="${f1(-110 + rnd(i) * 30)}" r="5" fill="#7b3f73"/>`).join('')}</g>`;
  }
  if (kind === 'cypress') {
    return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-4" y="-20" width="8" height="20" fill="#6b4826"/><path d="M0 -150 Q${f1(26 + sw)} -80 18 -20 L-18 -20 Q${f1(-26 + sw)} -80 0 -150Z" fill="#2d5e34"/><path d="M0 -140 Q${f1(12 + sw)} -80 8 -25" stroke="#3d7a44" stroke-width="4" fill="none"/></g>`;
  }
  // árvore frutífera redonda
  const fr = [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${f1(-45 + rnd(seed + i) * 90 + sw)}" cy="${f1(-140 + rnd(seed * 3 + i) * 70)}" r="6" fill="${seed % 2 ? '#e2442f' : '#f0a020'}"/>`).join('');
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-9 0 Q-4 -50 -6 -95 L6 -95 Q4 -50 9 0Z" fill="#7a5532"/><path d="M-4 -70 Q-20 -85 -30 -100" stroke="#7a5532" stroke-width="6" fill="none"/><circle cx="${f1(sw)}" cy="-130" r="58" fill="#3f8a3a"/><circle cx="${f1(-38 + sw)}" cy="-108" r="36" fill="#367a33"/><circle cx="${f1(40 + sw)}" cy="-110" r="38" fill="#45963f"/><circle cx="${f1(-10 + sw)}" cy="-165" r="34" fill="#4ea347"/>${fr}</g>`;
}
function figLeaf(x, y, s, rot, col = '#3f8f3b') {
  return `<g transform="translate(${f1(x)},${f1(y)}) rotate(${f1(rot)}) scale(${f1(s)})"><path d="M0 0 C-6 -6 -14 -4 -16 -12 C-10 -14 -8 -18 -10 -24 C-4 -22 -2 -26 0 -32 C2 -26 4 -22 10 -24 C8 -18 10 -14 16 -12 C14 -4 6 -6 0 0Z" fill="${col}"/><path d="M0 0 L0 -28 M0 -12 L-10 -18 M0 -12 L10 -18" stroke="${shade(col, -0.3)}" stroke-width="1.2" fill="none"/></g>`;
}
function water(t, y, col1, col2, amp = 6, sp = 1, extra = '') {
  let s = `<rect x="-400" y="${y}" width="${W + 800}" height="${H + 600}" fill="${col1}"/>`;
  for (let k = 0; k < 6; k++) {
    let d = ''; const yy = y + k * 28 + 6;
    for (let x = -400; x <= W + 400; x += 24) d += (x === -400 ? 'M' : 'L') + x + ' ' + f1(yy + Math.sin(x * 0.03 + t * 1.6 * sp + k) * amp * (1 - k * .1));
    s += `<path d="${d}" stroke="${col2}" stroke-width="${3 - k * .3}" fill="none" opacity="${.7 - k * .08}"/>`;
  }
  return s + extra;
}
function reeds(t, x0, x1, y, n, seed, h = 120) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd(seed + i) * (x1 - x0), hh = h * (0.6 + rnd(seed + i * 2) * .6), sw = Math.sin(t * 1.2 + i * .7) * 7;
    s += `<path d="M${f1(x)} ${y} Q${f1(x + sw * .4)} ${f1(y - hh * .5)} ${f1(x + sw)} ${f1(y - hh)}" stroke="${i % 2 ? '#5d8a3a' : '#4b7a2f'}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    if (i % 3 === 0) s += `<g transform="translate(${f1(x + sw)},${f1(y - hh)})">${[-3, -1.5, 0, 1.5, 3].map(k => `<line x1="0" y1="0" x2="${f1(k * 6)}" y2="${f1(-12 + Math.abs(k) * 2)}" stroke="#7ba34a" stroke-width="1.6"/>`).join('')}</g>`;
  }
  return s;
}
function rays(cx, cy, n, len, col, op, t, w = 0.08) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = i * Math.PI * 2 / n + t * 0.05, a1 = a - w, a2 = a + w;
    s += `<path d="M${cx} ${cy} L${f1(cx + Math.cos(a1) * len)} ${f1(cy + Math.sin(a1) * len)} L${f1(cx + Math.cos(a2) * len)} ${f1(cy + Math.sin(a2) * len)}Z" fill="${col}" opacity="${op}"/>`;
  }
  return s;
}
function glow(cx, cy, r, col, op = 1) {
  const id = uid('gl');
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="url(#${id})"/>`;
}
function dunes(t, y, cols) {
  return cols.map((c, i) => {
    const yy = y + i * 70; let d = `M-400 ${yy + 60}`;
    for (let x = -400; x <= W + 400; x += 40) d += ` L${x} ${f1(yy + Math.sin(x * 0.006 + i * 2) * 40 + Math.sin(x * 0.017 + i) * 12)}`;
    return `<path d="${d} L${W + 400} ${H + 600} L-400 ${H + 600}Z" fill="${c}"/>`;
  }).join('');
}
function hills(y, cols, seed = 1) {
  return cols.map((c, i) => {
    const yy = y + i * 80; let d = `M-400 ${yy + 80}`;
    for (let x = -400; x <= W + 400; x += 40) d += ` L${x} ${f1(yy + Math.sin(x * 0.005 + i * 2 + seed) * 50 + Math.sin(x * 0.013 + i + seed) * 18)}`;
    return `<path d="${d} L${W + 400} ${H + 600} L-400 ${H + 600}Z" fill="${c}"/>`;
  }).join('');
}
function sheep(x, y, s, t, seed = 0) {
  const b = Math.sin(t * 2 + seed) * 1.2, hd = Math.sin(t * .8 + seed) * 4;
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})"><ellipse cx="0" cy="4" rx="22" ry="4" fill="rgba(0,0,0,.18)"/><rect x="-12" y="-8" width="4" height="12" fill="#3b3b3b"/><rect x="8" y="-8" width="4" height="12" fill="#3b3b3b"/>${[-14, -6, 2, 10].map((k, i) => `<circle cx="${k}" cy="${f1(-18 + b)}" r="9" fill="#f4f1ea"/>`).join('')}<ellipse cx="0" cy="${f1(-14 + b)}" rx="20" ry="11" fill="#f7f5ef"/><g transform="translate(20,${f1(-20 + b + hd * .3)})"><ellipse cx="0" cy="0" rx="7" ry="9" fill="#5b5048"/><ellipse cx="-6" cy="-4" rx="4" ry="2" fill="#5b5048"/><circle cx="2" cy="-2" r="1.3" fill="#111"/><circle cx="-1" cy="-8" r="5" fill="#f4f1ea"/></g></g>`;
}
function lamb(x, y, s, t, glowOn = false) {
  return `${glowOn ? glow(x, y - 20 * s, 70 * s, '#fff3c4', .8) : ''}${sheep(x, y, s, t, 3)}`;
}
function dove(x, y, s, t) {
  const fl = Math.sin(t * 8) * 10;
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})"><ellipse cx="0" cy="0" rx="16" ry="8" fill="#fbfbfb"/><circle cx="14" cy="-5" r="6" fill="#fbfbfb"/><path d="M19 -5 L25 -3 L19 -2Z" fill="#f0a020"/><circle cx="15" cy="-6" r="1.2" fill="#222"/><path d="M-4 -2 Q-10 ${f1(-20 - fl)} -24 ${f1(-26 - fl)} Q-12 -8 4 -2Z" fill="#eeeeee"/><path d="M-14 0 L-26 -4 L-26 6Z" fill="#eeeeee"/></g>`;
}
function ark(x, y, s, t, rock = 1) {
  const r = Math.sin(t * 1.1) * 2.5 * rock, b = Math.sin(t * 1.4) * 4 * rock;
  let planks = ''; for (let i = 1; i < 6; i++) planks += `<line x1="-150" y1="${-i * 12}" x2="150" y2="${-i * 12}" stroke="#5a3a1c" stroke-width="1.6" opacity=".6"/>`;
  return `<g transform="translate(${f1(x)},${f1(y + b)}) rotate(${f1(r)}) scale(${s})"><path d="M-170 -75 L170 -75 L150 0 Q0 18 -150 0Z" fill="#8b5a2b"/>${planks}<rect x="-110" y="-130" width="220" height="56" fill="#9c6a35"/><path d="M-125 -128 L0 -165 L125 -128Z" fill="#6e4520"/>${[-80, -40, 0, 40, 80].map(k => `<rect x="${k - 8}" y="-118" width="16" height="14" rx="2" fill="#3a2410"/>`).join('')}<rect x="-30" y="-100" width="40" height="26" fill="#5a3a1c"/><line x1="-170" y1="-75" x2="170" y2="-75" stroke="#5a3a1c" stroke-width="3"/></g>`;
}
function basket(x, y, s, t, baby = true, floatOn = true) {
  const b = floatOn ? Math.sin(t * 1.6) * 3 : 0, r = floatOn ? Math.sin(t * 1.1) * 3 : 0;
  let weave = ''; for (let i = -3; i <= 3; i++) weave += `<path d="M${i * 9} -22 Q${i * 9 + 3} -10 ${i * 9} 2" stroke="#8a5a22" stroke-width="1.5" fill="none"/>`;
  const by = baby ? `<ellipse cx="-6" cy="-24" rx="22" ry="9" fill="#f3ede0"/><circle cx="16" cy="-27" r="9" fill="#d9a77c"/><path d="M8 -32 Q16 -40 24 -32" fill="#4a2e1a"/><path d="M13 -26 q1.5 1.2 3 0 M18 -26 q1.5 1.2 3 0" stroke="#3b2616" stroke-width="1" fill="none"/>` : '';
  return `<g transform="translate(${f1(x)},${f1(y + b)}) rotate(${f1(r)}) scale(${s})"><ellipse cx="0" cy="2" rx="44" ry="8" fill="rgba(0,0,0,.2)"/>${by}<path d="M-40 -20 Q-44 2 -30 4 L30 4 Q44 2 40 -20Z" fill="#c08a3e"/>${weave}<path d="M-40 -20 Q0 -14 40 -20" stroke="#7a4e1c" stroke-width="3" fill="none"/><path d="M-40 -20 Q0 -26 40 -20" stroke="#d7a352" stroke-width="2" fill="none"/></g>`;
}
function tent(x, y, s, col = '#7a5a3e', col2 = '#5c4129') {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-110 0 L-80 -90 L80 -90 L110 0Z" fill="${col}"/><path d="M-80 -90 L80 -90" stroke="${col2}" stroke-width="5"/>${[-60, -30, 0, 30, 60].map(k => `<line x1="${k}" y1="-90" x2="${k * 1.35}" y2="0" stroke="${col2}" stroke-width="2" opacity=".6"/>`).join('')}<path d="M-20 0 L0 -60 L20 0Z" fill="#2a1d12"/><line x1="-80" y1="-90" x2="-130" y2="6" stroke="#5c4129" stroke-width="2"/><line x1="80" y1="-90" x2="130" y2="6" stroke="#5c4129" stroke-width="2"/></g>`;
}
function bibleBook(x, y, s, t, glowAmt = 1, pageTurn = 0, text = '') {
  const g = 0.75 + 0.15 * Math.sin(t * 1.2);
  let lines = '';
  for (let i = 0; i < 9; i++) { lines += `<line x1="-120" y1="${-70 + i * 14}" x2="-24" y2="${-74 + i * 14}" stroke="#a08b6a" stroke-width="2" opacity=".55"/><line x1="24" y1="${-74 + i * 14}" x2="120" y2="${-70 + i * 14}" stroke="#a08b6a" stroke-width="2" opacity=".55"/>`; }
  const pt = pageTurn ? `<path d="M0 -92 Q${f1(70 - 140 * pageTurn)} ${f1(-110 + 30 * Math.sin(pageTurn * Math.PI))} ${f1(135 - 270 * pageTurn)} -88 L${f1(135 - 270 * pageTurn)} 62 Q${f1(70 - 140 * pageTurn)} ${f1(52 + 10 * Math.sin(pageTurn * Math.PI))} 0 68Z" fill="#f6ecd3" stroke="#d8c39a"/>` : '';
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})">${glowAmt ? glow(0, -20, 260, '#ffe9a8', glowAmt * g) + rays(0, -20, 14, 330, '#ffe7a0', glowAmt * 0.12, t) : ''}<path d="M-150 -80 L0 -96 L150 -80 L150 80 L0 70 L-150 80Z" fill="#5a1f22"/><path d="M-140 -88 Q-70 -104 0 -92 L0 68 Q-70 56 -140 72Z" fill="#fbf3de"/><path d="M140 -88 Q70 -104 0 -92 L0 68 Q70 56 140 72Z" fill="#f7eed5"/>${lines}<line x1="0" y1="-92" x2="0" y2="68" stroke="#c9b48a" stroke-width="2"/>${pt}${text ? `<text x="-72" y="-72" font-family="Liberation Serif, Times New Roman, serif" font-size="17" fill="#7a2131" text-anchor="middle" font-weight="bold">${text}</text>` : ''}<path d="M10 66 L10 110 L18 100 L26 110 L26 66" fill="#9e1b2c"/></g>`;
}
function candle(x, y, s, t) {
  const fl = Math.sin(t * 9) * 1.5 + Math.sin(t * 5.3) * 1;
  return `<g transform="translate(${x},${y}) scale(${s})">${glow(0, -70, 70, '#ffd27a', .55)}<rect x="-10" y="-50" width="20" height="50" rx="3" fill="#f3e6c8"/><path d="M-2 -50 L2 -50 L1 -56 L-1 -56Z" fill="#333"/><path d="M0 ${f1(-78 + fl)} Q8 -62 0 -54 Q-8 -62 0 ${f1(-78 + fl)}Z" fill="#ffb230"/><path d="M0 ${f1(-70 + fl * .5)} Q4 -60 0 -56 Q-4 -60 0 ${f1(-70 + fl * .5)}Z" fill="#fff2b0"/></g>`;
}
function crossHill(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-9" y="-260" width="18" height="260" fill="#5d3b1f"/><rect x="-75" y="-210" width="150" height="16" fill="#5d3b1f"/><rect x="-9" y="-260" width="5" height="260" fill="#7a5130"/><rect x="-75" y="-210" width="150" height="5" fill="#7a5130"/></g>`;
}
function spring(x, y, s, t) {
  let rp = '';
  for (let i = 0; i < 3; i++) { const k = ((t * 0.5 + i / 3) % 1); rp += `<ellipse cx="0" cy="0" rx="${f1(10 + k * 70)}" ry="${f1(3 + k * 16)}" fill="none" stroke="#e6fbff" stroke-width="2" opacity="${f1(1 - k)}"/>`; }
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="95" ry="26" fill="#8a7a5c"/><ellipse cx="0" cy="-2" rx="84" ry="21" fill="#3fa7c9"/><ellipse cx="-10" cy="-6" rx="60" ry="10" fill="#6fd0ea" opacity=".6"/>${rp}${[-90, -60, 70, 95].map((k, i) => `<ellipse cx="${k}" cy="${4 + i % 2 * 4}" rx="16" ry="9" fill="#9b8a69"/>`).join('')}</g>`;
}
function pyramid(x, y, s, col = '#d8b46a') {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-120 0 L0 -110 L120 0Z" fill="${col}"/><path d="M0 -110 L120 0 L30 0Z" fill="${shade(col, -0.18)}"/></g>`;
}

function acacia(x, y, s, t) {
  const sw = Math.sin(t * .8) * 2;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-6 0 Q-2 -50 -30 -90 M-2 -40 Q10 -70 40 -95 M-4 -60 Q-4 -80 0 -100" stroke="#6b4826" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="${f1(sw)}" cy="-104" rx="90" ry="20" fill="#5f7d3a"/><ellipse cx="${f1(-20 + sw)}" cy="-114" rx="60" ry="14" fill="#708f45"/></g>`;
}
function rocks(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40 0 Q-36 -30 -10 -34 Q14 -38 24 -18 Q40 -14 38 0Z" fill="#a58a6a"/><path d="M-10 -34 Q14 -38 24 -18 L4 -16Z" fill="#c0a582"/><path d="M30 0 Q34 -16 50 -16 Q64 -12 62 0Z" fill="#94795a"/></g>`;
}
