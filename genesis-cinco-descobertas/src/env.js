// ===== Cenários v2: volume, profundidade atmosférica, detalhes vivos =====
function sky(id, stops) {
  id = id + stops.map(x => hid(x[1])).join('');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs>
  <rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#${id})"/>`;
}
function haze(y, col = '#ffffff', op = .45, h = 160) {
  const id = 'hz' + hid(col) + Math.round(op * 100);
  def(id, `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset=".6" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient>`);
  return `<rect x="-400" y="${y - h}" width="${W + 800}" height="${h * 1.4}" fill="url(#${id})"/>`;
}
function motes(t, n, seed, col = '#fff6cf', x0 = -50, x1 = 620, y0 = 100, y1 = 900) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const k = (t * (0.02 + rnd(seed + i) * .03) + rnd(seed + i * 3)) % 1;
    const x = x0 + rnd(seed + i * 7) * (x1 - x0) + Math.sin(t * .6 + i) * 12, y = y1 - k * (y1 - y0);
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1 + rnd(i) * 1.8)}" fill="${col}" opacity="${f1(Math.sin(k * Math.PI) * .7)}"/>`;
  }
  return s;
}
function hills(y, cols, seed = 1, opts = {}) {
  return cols.map((c, i) => {
    const yy = y + i * 80; let d = `M-400 ${yy + 80}`;
    for (let x = -400; x <= W + 400; x += 30) d += ` L${x} ${f1(yy + Math.sin(x * 0.005 + i * 2 + seed) * 50 + Math.sin(x * 0.013 + i + seed) * 18)}`;
    let s = `<path d="${d} L${W + 400} ${H + 600} L-400 ${H + 600}Z" fill="${gVert(c, .14, -.22)}"/>`;
    // borda iluminada
    s += `<path d="${d}" stroke="${shade(c, .25)}" stroke-width="3" fill="none" opacity=".5"/>`;
    if (i === cols.length - 1 && !opts.bare) for (let k = 0; k < 40; k++) { const x = -300 + rnd(seed * 9 + k) * 1200, y2 = yy + 60 + rnd(k * 3 + seed) * 300; s += `<path d="M${f1(x)} ${f1(y2)} l-3 -9 M${f1(x + 4)} ${f1(y2)} l1 -11 M${f1(x + 8)} ${f1(y2)} l3 -8" stroke="${shade(c, -.25)}" stroke-width="1.6" opacity=".55"/>`; }
    return s;
  }).join('');
}
function dunes(t, y, cols) {
  return cols.map((c, i) => {
    const yy = y + i * 70; let d = `M-400 ${yy + 60}`, ridge = '';
    for (let x = -400; x <= W + 400; x += 30) { const yv = yy + Math.sin(x * 0.006 + i * 2) * 40 + Math.sin(x * 0.017 + i) * 12; d += ` L${x} ${f1(yv)}`; }
    let s = `<path d="${d} L${W + 400} ${H + 600} L-400 ${H + 600}Z" fill="${gVert(c, .12, -.2)}"/><path d="${d}" stroke="${shade(c, .35)}" stroke-width="2.5" fill="none" opacity=".7"/>`;
    // ondulações do vento
    for (let k = 0; k < 6; k++) { const x = -200 + rnd(i * 13 + k) * 900, y2 = yy + 40 + rnd(k + i) * 50; s += `<path d="M${f1(x)} ${f1(y2)} q20 -5 40 0 t40 0" stroke="${shade(c, -.15)}" stroke-width="1.5" fill="none" opacity=".5"/>`; }
    return s;
  }).join('');
}
function water(t, y, col1, col2, amp = 6, sp = 1, extra = '') {
  let s = `<rect x="-400" y="${y}" width="${W + 800}" height="${H + 600}" fill="${gVert(col1, .12, -.35)}"/>`;
  for (let k = 0; k < 7; k++) {
    let d = ''; const yy = y + k * 26 + 6;
    for (let x = -400; x <= W + 400; x += 22) d += (x === -400 ? 'M' : 'L') + x + ' ' + f1(yy + Math.sin(x * 0.03 + t * 1.6 * sp + k) * amp * (1 - k * .08));
    s += `<path d="${d}" stroke="${col2}" stroke-width="${f1(3 - k * .3)}" fill="none" opacity="${f1(.7 - k * .07)}"/>`;
  }
  for (let i = 0; i < 22; i++) { const x = rnd(i * 5) * 700 - 60, yy = y + 10 + rnd(i * 9) * 200, tw = Math.max(0, Math.sin(t * 2.2 + i * 1.7)); s += `<path d="M${f1(x - 5 * tw)} ${f1(yy)} L${f1(x + 5 * tw)} ${f1(yy)} M${f1(x)} ${f1(yy - 3 * tw)} L${f1(x)} ${f1(yy + 3 * tw)}" stroke="#fff" stroke-width="1.4" opacity="${f1(tw * .8)}"/>`; }
  return s + extra;
}
function tree(x, y, s, t, kind = 'round', seed = 1) {
  const sw = Math.sin(t * 0.9 + seed) * 2;
  const trunk = gLin('#7a5532', .15, -.35);
  if (kind === 'palm') {
    let fr = '';
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI - .2 + i * (Math.PI + .4) / 8 + Math.sin(t * 1.1 + i) * 0.05;
      const ex = Math.cos(a) * 76, ey = Math.sin(a) * 40 + 30;
      fr += `<path d="M0 0 Q${f1(ex * .5)} ${f1(ey - 36)} ${f1(ex)} ${f1(ey)}" stroke="${i % 2 ? '#2f7a3b' : '#3d8f45'}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M0 0 Q${f1(ex * .5)} ${f1(ey - 36)} ${f1(ex)} ${f1(ey)}" stroke="#7cc46e" stroke-width="2" fill="none" opacity=".6"/>`;
      for (let k = 1; k < 6; k++) { const q = k / 6, px = 2 * (1 - q) * q * ex * .5 + q * q * ex, py = 2 * (1 - q) * q * (ey - 36) + q * q * ey; fr += `<path d="M${f1(px)} ${f1(py)} l${f1(-4 + q * 2)} 9 M${f1(px)} ${f1(py)} l${f1(4 - q * 2)} 9" stroke="#2a6a33" stroke-width="2"/>`; }
    }
    return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-7 0 Q${f1(6 + sw)} -80 ${f1(sw * 3)} -160 L${f1(sw * 3 + 9)} -160 Q${f1(17 + sw)} -80 7 0Z" fill="${gLin('#94693d', .15, -.35)}"/>${[...Array(9)].map((_, i) => `<path d="M${f1(-5 + sw * i / 9 * 3)} ${-i * 18} q7 -3 14 0" stroke="#6b4826" stroke-width="2" fill="none"/>`).join('')}<g transform="translate(${f1(sw * 3 + 4)},-160)">${fr}<circle cx="-6" cy="8" r="6.5" fill="${gRad('#7a5424')}"/><circle cx="6" cy="9" r="6.5" fill="${gRad('#7a5424')}"/><circle cx="0" cy="12" r="6" fill="${gRad('#6b4a1f')}"/></g></g>`;
  }
  if (kind === 'fig') {
    let lv = '';
    for (let i = 0; i < 22; i++) {
      const a = rnd(seed + i) * Math.PI * 2, r = 20 + rnd(seed + i * 3) * 58;
      lv += figLeaf(Math.cos(a) * r * 1.2 + sw, Math.sin(a) * r * .8 - 125, 1 + rnd(i) * .5, a * 57 + Math.sin(t + i) * 6, i % 3 ? '#3f8f3b' : '#5aa84e');
    }
    return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-10 0 Q-4 -60 -18 -110 M10 0 Q4 -60 20 -105" stroke="#7a5532" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-12 0 Q0 -50 0 -90 Q0 -50 12 0Z" fill="${trunk}"/><ellipse cx="0" cy="-125" rx="88" ry="64" fill="${gRad('#2f7232', .18, -.3)}"/>${lv}${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${f1(-55 + i * 22 + sw)}" cy="${f1(-108 + rnd(i) * 32)}" r="6" fill="${gRad('#7b3f73', .3)}"/>`).join('')}</g>`;
  }
  if (kind === 'cypress') {
    return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-4" y="-20" width="8" height="20" fill="${trunk}"/><path d="M0 -155 Q${f1(28 + sw)} -80 19 -18 L-19 -18 Q${f1(-28 + sw)} -80 0 -155Z" fill="${gLin('#2d5e34', .2, -.35)}"/><path d="M-2 -140 Q${f1(10 + sw)} -90 6 -30" stroke="#4d8a52" stroke-width="3" fill="none" opacity=".6"/></g>`;
  }
  if (kind === 'olive') {
    const leaves = gRad('#7f9a6a', .2, -.3);
    return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-12 0 Q-20 -40 -4 -70 Q8 -90 -6 -110 M8 0 Q14 -40 6 -80" stroke="#6b5a46" stroke-width="10" fill="none" stroke-linecap="round"/>${[[-40, -120, 46], [30, -126, 50], [-4, -150, 46], [-60, -96, 30], [56, -100, 32]].map(([a, b, r]) => `<ellipse cx="${f1(a + sw)}" cy="${b}" rx="${r}" ry="${r * .62}" fill="${leaves}"/>`).join('')}${[...Array(12)].map((_, i) => `<circle cx="${f1(-60 + rnd(seed + i) * 120 + sw)}" cy="${f1(-150 + rnd(i * 4) * 70)}" r="2.6" fill="#3d4a2a"/>`).join('')}</g>`;
  }
  // frutífera redonda com volume
  const fr = [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${f1(-48 + rnd(seed + i) * 96 + sw)}" cy="${f1(-145 + rnd(seed * 3 + i) * 72)}" r="6.5" fill="${gRad(seed % 2 ? '#e2442f' : '#f0a020', .35, -.25)}"/>`).join('');
  const L = c => gRad(c, .25, -.3);
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="40" ry="8" fill="#000" opacity=".15"/><path d="M-10 0 Q-4 -50 -6 -95 L6 -95 Q4 -50 10 0Z" fill="${trunk}"/><path d="M-4 -70 Q-20 -85 -30 -100" stroke="#7a5532" stroke-width="6" fill="none"/><circle cx="${f1(sw)}" cy="-130" r="60" fill="${L('#3f8a3a')}"/><circle cx="${f1(-40 + sw)}" cy="-106" r="38" fill="${L('#367a33')}"/><circle cx="${f1(42 + sw)}" cy="-108" r="40" fill="${L('#45963f')}"/><circle cx="${f1(-10 + sw)}" cy="-168" r="36" fill="${L('#55a94b')}"/><circle cx="${f1(20 + sw)}" cy="-150" r="22" fill="${L('#5db552')}" opacity=".8"/>${fr}</g>`;
}
function deer(x, y, s, t, seed = 0) {
  const hd = Math.sin(t * .7 + seed) * 6;
  const b = gLin('#b8783e', .2, -.3);
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})"><ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity=".15"/>${[-18, -10, 12, 20].map(k => `<rect x="${k - 2}" y="-30" width="4" height="30" fill="#8a5a2c"/>`).join('')}<ellipse cx="0" cy="-36" rx="28" ry="14" fill="${b}"/><ellipse cx="-24" cy="-40" rx="5" ry="6" fill="#f3efe6"/><g transform="translate(22,${f1(-46 + hd * .3)}) rotate(${f1(-20 + hd)})"><rect x="-4" y="-22" width="9" height="24" rx="4" fill="${b}"/><ellipse cx="4" cy="-26" rx="10" ry="7" fill="${b}"/><circle cx="7" cy="-28" r="1.4" fill="#111"/><circle cx="13" cy="-24" r="1.6" fill="#222"/><ellipse cx="-3" cy="-33" rx="3" ry="6" fill="#a8683a" transform="rotate(-30 -3 -33)"/></g>${[-12, -4, 6, 14].map(k => `<circle cx="${k}" cy="-40" r="1.8" fill="#f3e6d0" opacity=".8"/>`).join('')}</g>`;
}
function rabbit(x, y, s, t, seed = 0) {
  const hop = Math.max(0, Math.sin(t * 3 + seed)) * 6;
  return `<g transform="translate(${f1(x)},${f1(y - hop)}) scale(${s})"><ellipse cx="0" cy="-8" rx="11" ry="8" fill="${gRad('#c9b8a0')}"/><circle cx="9" cy="-14" r="6" fill="${gRad('#c9b8a0')}"/><ellipse cx="7" cy="-25" rx="2.4" ry="7" fill="#b8a68c"/><ellipse cx="11" cy="-25" rx="2.4" ry="7" fill="#b8a68c"/><circle cx="11" cy="-15" r="1" fill="#111"/><circle cx="-11" cy="-8" r="3" fill="#fff"/></g>`;
}
function sheep(x, y, s, t, seed = 0) {
  const b = Math.sin(t * 2 + seed) * 1.2, hd = Math.sin(t * .8 + seed) * 4;
  const wool = gRad('#f7f5ef', .1, -.18);
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})"><ellipse cx="0" cy="4" rx="24" ry="4.5" fill="#000" opacity=".18"/><rect x="-12" y="-8" width="4" height="12" fill="#3b3b3b"/><rect x="8" y="-8" width="4" height="12" fill="#3b3b3b"/>${[-15, -7, 1, 9, -11, 5].map((k, i) => `<circle cx="${k}" cy="${f1((i > 3 ? -24 : -17) + b)}" r="9.5" fill="${wool}"/>`).join('')}<ellipse cx="0" cy="${f1(-14 + b)}" rx="20" ry="11" fill="${wool}"/><g transform="translate(20,${f1(-20 + b + hd * .3)})"><ellipse cx="0" cy="0" rx="7" ry="9" fill="${gRad('#5b5048')}"/><ellipse cx="-6" cy="-4" rx="4.5" ry="2.2" fill="#4b4038"/><circle cx="2.4" cy="-2" r="1.4" fill="#111"/><circle cx="2.8" cy="-2.4" r=".5" fill="#fff"/><circle cx="-1" cy="-8" r="5.5" fill="${wool}"/></g></g>`;
}
function ark(x, y, s, t, rock = 1) {
  const r = Math.sin(t * 1.1) * 2.5 * rock, b = Math.sin(t * 1.4) * 4 * rock;
  const wood = gVert('#8b5a2b', .15, -.3);
  let planks = ''; for (let i = 1; i < 6; i++) planks += `<path d="M-160 ${-i * 12} L160 ${-i * 12}" stroke="#4a2e14" stroke-width="1.6" opacity=".55"/>`;
  for (let i = 0; i < 12; i++) planks += `<line x1="${-140 + i * 25}" y1="${-12 * (1 + i % 5)}" x2="${-140 + i * 25}" y2="${-12 * (2 + i % 5)}" stroke="#4a2e14" stroke-width="1.2" opacity=".5"/>`;
  return `<g transform="translate(${f1(x)},${f1(y + b)}) rotate(${f1(r)}) scale(${s})"><path d="M-172 -76 L172 -76 L152 0 Q0 18 -152 0Z" fill="${wood}"/>${planks}<path d="M-152 0 Q0 18 152 0" stroke="#2e1a0a" stroke-width="5" fill="none"/><rect x="-112" y="-132" width="224" height="58" fill="${gVert('#a06c36', .12, -.25)}"/>${[-90, -60, -30, 0, 30, 60, 90].map(k => `<line x1="${k}" y1="-132" x2="${k}" y2="-74" stroke="#5a3a1c" stroke-width="1.2" opacity=".6"/>`).join('')}<path d="M-128 -130 L0 -168 L128 -130Z" fill="${gVert('#6e4520', .1, -.3)}"/>${[0, 1, 2, 3].map(k => `<path d="M${-110 + k * 10} ${-134 + k * -9} L${110 - k * 10} ${-134 + k * -9}" stroke="#4a2e14" stroke-width="1.2" opacity=".6"/>`).join('')}<rect x="-120" y="-122" width="240" height="10" fill="#2a1a0a" opacity=".55"/><rect x="40" y="-112" width="38" height="38" fill="#4a2e14"/><rect x="44" y="-108" width="30" height="34" fill="#5d3b1f"/><circle cx="68" cy="-90" r="2" fill="#c9a14a"/><line x1="-172" y1="-76" x2="172" y2="-76" stroke="#4a2e14" stroke-width="3"/></g>`;
}
function basket(x, y, s, t, baby = true, floatOn = true) {
  const b = floatOn ? Math.sin(t * 1.6) * 3 : 0, r = floatOn ? Math.sin(t * 1.1) * 3 : 0;
  let weave = ''; for (let i = -4; i <= 4; i++) weave += `<path d="M${i * 8} -22 Q${i * 8 + 3} -12 ${i * 8} -4" stroke="#8a5a22" stroke-width="1.5" fill="none"/>`;
  for (let j = 0; j < 3; j++) weave += `<path d="M-38 ${-18 + j * 5} Q0 ${-13 + j * 5} 38 ${-18 + j * 5}" stroke="#d7a352" stroke-width="1.1" fill="none" opacity=".7"/>`;
  const by = baby ? `<ellipse cx="-6" cy="-24" rx="22" ry="9" fill="${gRad('#f3ede0')}"/><circle cx="16" cy="-28" r="9.5" fill="${gRad('#d9a77c')}"/><path d="M8 -33 Q16 -41 24 -33" fill="#4a2e1a"/><path d="M12.5 -27.5 q1.6 1.2 3.2 0 M18.5 -27.5 q1.6 1.2 3.2 0" stroke="#3b2616" stroke-width="1" fill="none"/><path d="M15 -23.5 q1.5 1 3 0" stroke="#a0524a" stroke-width="1" fill="none"/><circle cx="12" cy="-25" r="1.6" fill="#e27c6a" opacity=".4"/>` : '';
  // Êx 2:3: calafetado com betume e piche (base escura)
  return `<g transform="translate(${f1(x)},${f1(y + b)}) rotate(${f1(r)}) scale(${s})"><ellipse cx="0" cy="3" rx="46" ry="8" fill="#000" opacity=".2"/>${by}<path d="M-40 -20 Q-44 2 -30 4 L30 4 Q44 2 40 -20Z" fill="${gLin('#c08a3e', .15, -.3)}"/>${weave}<path d="M-41 -6 Q-40 3 -30 4 L30 4 Q40 3 41 -6 Q0 0 -41 -6Z" fill="#2a1e14" opacity=".9"/><path d="M-40 -20 Q0 -14 40 -20" stroke="#7a4e1c" stroke-width="3.5" fill="none"/><path d="M-40 -21 Q0 -26 40 -21" stroke="#e0b060" stroke-width="2" fill="none"/></g>`;
}
function tent(x, y, s) {
  // tenda de pelo de cabra, com listras
  let st = ''; for (let i = 0; i < 6; i++) st += `<path d="M${-104 + i * 2} ${-14 - i * 15} L${104 - i * 2} ${-14 - i * 15}" stroke="${i % 2 ? '#2e241c' : '#5a4636'}" stroke-width="6" opacity=".7"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="4" rx="130" ry="10" fill="#000" opacity=".18"/><path d="M-112 0 L-82 -92 L82 -92 L112 0Z" fill="${gLin('#4a3a2e', .15, -.3)}"/>${st}<path d="M-82 -92 L82 -92" stroke="#2a1d12" stroke-width="5"/><path d="M-22 0 L0 -62 L22 0Z" fill="#1a120a"/><path d="M0 -62 L22 0 L34 0 Z" fill="#6b5640"/><line x1="-82" y1="-92" x2="-134" y2="6" stroke="#5c4129" stroke-width="2"/><line x1="82" y1="-92" x2="134" y2="6" stroke="#5c4129" stroke-width="2"/>${[[-60, 8], [70, 6]].map(([a, b]) => `<g transform="translate(${a},${b})"><path d="M-10 0 Q-12 -20 0 -22 Q12 -20 10 0Z" fill="${gLin('#b5603a')}"/><ellipse cx="0" cy="-22" rx="6" ry="2" fill="#7a3a20"/></g>`).join('')}</g>`;
}
function house(x, y, w, h, col, seed) {
  const c = gLin(col, .12, -.25);
  return `<g transform="translate(${x},${y})"><rect x="0" y="${-h}" width="${w}" height="${h}" fill="${c}"/><rect x="-4" y="${-h - 8}" width="${w + 8}" height="10" fill="${shade(col, -.2)}"/><rect x="${w * .38}" y="-44" width="${w * .26}" height="44" rx="${w * .13}" fill="#4a3624"/>${h > 90 ? `<rect x="${w * .18}" y="${-h + 26}" width="16" height="16" fill="#3a2a1a"/><rect x="${w * .62}" y="${-h + 26}" width="16" height="16" fill="#3a2a1a"/>` : ''}<path d="M${w} ${-h + 10} l18 ${h - 10} l-18 0Z" fill="${shade(col, -.3)}" opacity=".6"/>${[...Array(5)].map((_, i) => `<line x1="${4 + rnd(seed + i) * (w - 8)}" y1="${-h + 10 + rnd(i * 3 + seed) * (h - 20)}" x2="${14 + rnd(seed + i) * (w - 8)}" y2="${-h + 10 + rnd(i * 3 + seed) * (h - 20)}" stroke="${shade(col, -.15)}" stroke-width="1.5"/>`).join('')}</g>`;
}
function stall(x, y, col, t) {
  return `<g transform="translate(${x},${y})"><rect x="-50" y="-36" width="100" height="36" fill="${gVert('#8a5a2c')}"/><path d="M-60 -90 L60 -90 L52 -70 L-52 -70Z" fill="${col}"/>${[-45, -30, -15, 0, 15, 30, 45].map((k, i) => `<path d="M${k} -70 l8 0 l-4 8Z" fill="${col}"/>`).join('')}<line x1="-50" y1="-70" x2="-50" y2="0" stroke="#5a3a1c" stroke-width="3"/><line x1="50" y1="-70" x2="50" y2="0" stroke="#5a3a1c" stroke-width="3"/>${[-30, -14, 2, 18, 32].map((k, i) => `<circle cx="${k}" cy="-42" r="7" fill="${gRad(['#e2442f', '#f0a020', '#7b3f73', '#9bc34a', '#f0d040'][i], .3)}"/>`).join('')}${[-34, 24].map(k => `<g transform="translate(${k},-36)"><path d="M-9 0 Q-11 -18 0 -20 Q11 -18 9 0Z" fill="${gLin('#b5603a')}"/></g>`).join('')}</g>`;
}
function bibleBook(x, y, s, t, glowAmt = 1, pageTurn = 0, text = '', inner = 0) {
  const g = 0.8 + 0.12 * Math.sin(t * 1.2);
  let lines = '';
  for (let i = 0; i < 9; i++) { lines += `<path d="M-122 ${-68 + i * 14} Q-70 ${-76 + i * 14} -24 ${-70 + i * 14}" stroke="#a08b6a" stroke-width="2" fill="none" opacity=".5"/><path d="M24 ${-70 + i * 14} Q70 ${-76 + i * 14} 122 ${-68 + i * 14}" stroke="#a08b6a" stroke-width="2" fill="none" opacity=".5"/>`; }
  const pt = pageTurn ? `<path d="M0 -92 Q${f1(70 - 140 * pageTurn)} ${f1(-110 + 30 * Math.sin(pageTurn * Math.PI))} ${f1(135 - 270 * pageTurn)} -88 L${f1(135 - 270 * pageTurn)} 62 Q${f1(70 - 140 * pageTurn)} ${f1(52 + 10 * Math.sin(pageTurn * Math.PI))} 0 68Z" fill="#f6ecd3" stroke="#d8c39a"/>` : '';
  const pageL = gLin('#fbf3de', .05, -.12), pageR = def('pgR', `<linearGradient id="pgR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2d4b2"/><stop offset=".25" stop-color="#f7eed5"/><stop offset="1" stop-color="#fbf5e2"/></linearGradient>`);
  // luz saindo de dentro das páginas
  let inn = '';
  if (inner) {
    inn += glow(0, -30, 230 * inner, '#fff4c8', .95 * g) + rays(0, -30, 18, 520 * inner, '#fff2b8', .16 * inner, t * 1.5, .06) + rays(0, -30, 9, 420 * inner, '#ffffff', .1 * inner, -t, .03);
    for (let i = 0; i < 26; i++) { const k = (t * .25 + rnd(i)) % 1, a = rnd(i * 7) * 6.28; inn += `<circle cx="${f1(Math.cos(a) * k * 260)}" cy="${f1(-30 + Math.sin(a) * k * 220 - k * 60)}" r="${f1(1.5 + rnd(i) * 2)}" fill="#fff6cf" opacity="${f1((1 - k) * .9)}"/>`; }
  }
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})">${glowAmt ? glow(0, -20, 260, '#ffe9a8', glowAmt * g) + rays(0, -20, 14, 330, '#ffe7a0', glowAmt * 0.12, t) : ''}<ellipse cx="0" cy="92" rx="170" ry="16" fill="#000" opacity=".35"/><path d="M-156 -80 L0 -96 L156 -80 L156 84 L0 74 L-156 84Z" fill="${gLin('#6a2226', .15, -.35)}"/><path d="M-150 -78 L-150 80" stroke="#c9a14a" stroke-width="2"/><path d="M150 -78 L150 80" stroke="#c9a14a" stroke-width="2"/><path d="M-146 -88 Q-70 -104 0 -92 L0 68 Q-70 56 -146 74Z" fill="${pageL}"/><path d="M146 -88 Q70 -104 0 -92 L0 68 Q70 56 146 74Z" fill="${pageR}"/><path d="M-146 74 Q-70 56 0 68 Q70 56 146 74 L146 80 Q70 62 0 74 Q-70 62 -146 80Z" fill="#d9b562"/>${lines}<line x1="0" y1="-92" x2="0" y2="68" stroke="#bfa77a" stroke-width="2.5"/>${pt}${text ? `<text x="-72" y="-70" font-family="Liberation Serif, Times New Roman, serif" font-size="17" fill="#7a2131" text-anchor="middle" font-weight="bold">${text}</text>` : ''}<path d="M10 66 L10 112 L18 102 L26 112 L26 66" fill="#9e1b2c"/>${inn}</g>`;
}
function crossHill(x, y, s) {
  const w = gLin('#5d3b1f', .2, -.35);
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-10" y="-262" width="20" height="262" fill="${w}"/><rect x="-78" y="-212" width="156" height="18" fill="${gVert('#5d3b1f', .2, -.3)}"/>${[-60, -30, 30, 60].map(k => `<line x1="${k}" y1="-210" x2="${k + 6}" y2="-197" stroke="#3a2410" stroke-width="1" opacity=".5"/>`).join('')}${[-200, -150, -90, -40].map(k => `<line x1="-6" y1="${k}" x2="4" y2="${k + 14}" stroke="#3a2410" stroke-width="1" opacity=".5"/>`).join('')}<path d="M-30 0 L-20 -16 L20 -16 L30 0Z" fill="#6b5a46"/></g>`;
}
function spring(x, y, s, t) {
  let rp = '';
  for (let i = 0; i < 3; i++) { const k = ((t * 0.5 + i / 3) % 1); rp += `<ellipse cx="0" cy="0" rx="${f1(10 + k * 70)}" ry="${f1(3 + k * 16)}" fill="none" stroke="#e6fbff" stroke-width="2" opacity="${f1(1 - k)}"/>`; }
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="2" rx="98" ry="28" fill="${gVert('#8a7a5c')}"/><ellipse cx="0" cy="-2" rx="85" ry="21" fill="${gRad('#3fa7c9', .3, -.25)}"/><ellipse cx="-14" cy="-7" rx="52" ry="8" fill="#a8e6f5" opacity=".55"/>${rp}${[-92, -62, 72, 96, -30, 40].map((k, i) => `<ellipse cx="${k}" cy="${i > 3 ? 20 : 4 + i % 2 * 4}" rx="${i > 3 ? 10 : 16}" ry="${i > 3 ? 6 : 9}" fill="${gRad('#a8987a')}"/>`).join('')}${reeds(t, -100, -60, 0, 5, 3, 50)}${reeds(t, 60, 100, 0, 5, 9, 45)}</g>`;
}
function pyramid(x, y, s, col = '#d8b46a') {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-120 0 L0 -110 L120 0Z" fill="${col}"/><path d="M0 -110 L120 0 L30 0Z" fill="${shade(col, -0.2)}"/>${[1, 2, 3, 4, 5].map(k => `<line x1="${-120 + k * 20}" y1="${-k * 18}" x2="${120 - k * 20}" y2="${-k * 18}" stroke="${shade(col, -.12)}" stroke-width="1" opacity=".6"/>`).join('')}</g>`;
}
function mountains(y, col, seed = 1, h = 140) {
  let d = `M-400 ${y}`;
  for (let x = -400; x <= W + 400; x += 60) d += ` L${x} ${f1(y - h * (0.4 + 0.6 * Math.abs(Math.sin(x * .007 + seed))) - rnd(x + seed) * 30)}`;
  return `<path d="${d} L${W + 400} ${y} L${W + 400} ${y + 600} L-400 ${y + 600}Z" fill="${gVert(col, .1, -.1)}"/>`;
}
function lotus(x, y, s, t) {
  return `<g transform="translate(${f1(x)},${f1(y + Math.sin(t * 1.5 + x) * 1.5)}) scale(${s})"><ellipse cx="0" cy="2" rx="16" ry="5" fill="#3f7a3a"/>${[-2, -1, 0, 1, 2].map(k => `<ellipse cx="${k * 4}" cy="-5" rx="3.4" ry="8" fill="${gVert('#f6c6d8', .2, -.1)}" transform="rotate(${k * 22} ${k * 4} 0)"/>`).join('')}<circle cx="0" cy="-3" r="2.2" fill="#f2c23b"/></g>`;
}
function ibis(x, y, s, t) {
  const p = Math.sin(t * .9) * 4;
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})"><line x1="-3" y1="0" x2="-4" y2="-22" stroke="#333" stroke-width="2"/><line x1="4" y1="0" x2="3" y2="-22" stroke="#333" stroke-width="2"/><ellipse cx="0" cy="-30" rx="14" ry="9" fill="${gRad('#f2f2ee')}"/><path d="M-12 -30 l-8 6 l6 -1Z" fill="#222"/><path d="M8 -34 Q14 -50 12 ${f1(-56 + p)}" stroke="#222" stroke-width="3" fill="none"/><path d="M12 ${f1(-56 + p)} Q24 ${f1(-52 + p)} 28 ${f1(-40 + p)}" stroke="#222" stroke-width="2" fill="none"/></g>`;
}
