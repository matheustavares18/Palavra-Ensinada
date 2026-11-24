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
function figLeaf(x, y, s, rot, col = '#3f8f3b') {
  return `<g transform="translate(${f1(x)},${f1(y)}) rotate(${f1(rot)}) scale(${f1(s)})"><path d="M0 0 C-6 -6 -14 -4 -16 -12 C-10 -14 -8 -18 -10 -24 C-4 -22 -2 -26 0 -32 C2 -26 4 -22 10 -24 C8 -18 10 -14 16 -12 C14 -4 6 -6 0 0Z" fill="${col}"/><path d="M0 0 L0 -28 M0 -12 L-10 -18 M0 -12 L10 -18" stroke="${shade(col, -0.3)}" stroke-width="1.2" fill="none"/></g>`;
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
function lamb(x, y, s, t, glowOn = false) {
  return `${glowOn ? glow(x, y - 20 * s, 70 * s, '#fff3c4', .8) : ''}${sheep(x, y, s, t, 3)}`;
}
function dove(x, y, s, t) {
  const fl = Math.sin(t * 8) * 10;
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})"><ellipse cx="0" cy="0" rx="16" ry="8" fill="#fbfbfb"/><circle cx="14" cy="-5" r="6" fill="#fbfbfb"/><path d="M19 -5 L25 -3 L19 -2Z" fill="#f0a020"/><circle cx="15" cy="-6" r="1.2" fill="#222"/><path d="M-4 -2 Q-10 ${f1(-20 - fl)} -24 ${f1(-26 - fl)} Q-12 -8 4 -2Z" fill="#eeeeee"/><path d="M-14 0 L-26 -4 L-26 6Z" fill="#eeeeee"/></g>`;
}
function candle(x, y, s, t) {
  const fl = Math.sin(t * 9) * 1.5 + Math.sin(t * 5.3) * 1;
  return `<g transform="translate(${x},${y}) scale(${s})">${glow(0, -70, 70, '#ffd27a', .55)}<rect x="-10" y="-50" width="20" height="50" rx="3" fill="#f3e6c8"/><path d="M-2 -50 L2 -50 L1 -56 L-1 -56Z" fill="#333"/><path d="M0 ${f1(-78 + fl)} Q8 -62 0 -54 Q-8 -62 0 ${f1(-78 + fl)}Z" fill="#ffb230"/><path d="M0 ${f1(-70 + fl * .5)} Q4 -60 0 -56 Q-4 -60 0 ${f1(-70 + fl * .5)}Z" fill="#fff2b0"/></g>`;
}
function acacia(x, y, s, t) {
  const sw = Math.sin(t * .8) * 2;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-6 0 Q-2 -50 -30 -90 M-2 -40 Q10 -70 40 -95 M-4 -60 Q-4 -80 0 -100" stroke="#6b4826" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="${f1(sw)}" cy="-104" rx="90" ry="20" fill="#5f7d3a"/><ellipse cx="${f1(-20 + sw)}" cy="-114" rx="60" ry="14" fill="#708f45"/></g>`;
}
function rocks(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40 0 Q-36 -30 -10 -34 Q14 -38 24 -18 Q40 -14 38 0Z" fill="#a58a6a"/><path d="M-10 -34 Q14 -38 24 -18 L4 -16Z" fill="#c0a582"/><path d="M30 0 Q34 -16 50 -16 Q64 -12 62 0Z" fill="#94795a"/></g>`;
}
