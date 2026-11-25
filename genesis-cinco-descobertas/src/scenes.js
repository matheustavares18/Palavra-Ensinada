// ===== Cenas v2. Cada cena: (t, p) => { svg, ov?, shots }
// shots: {fx, fy, z, sy}: o ponto (fx,fy) do mundo vai para (288, sy) na tela, com zoom z.
const WIDE = { fx: 288, fy: 512, z: 1, sy: 512 };
const S = {};
const FACE = (x, feetY, s = 1.2, z = 1.85) => ({ fx: x, fy: feetY - 176 * s, z, sy: 430 });

S.bibleIntro = (t, p) => {
  let s = sky('bi', [[0, '#1d1410'], [1, '#3a2418']]);
  s += `<rect x="-1100" y="640" width="2800" height="800" fill="${gVert('#6a4428', .1, -.35)}"/><rect x="-1100" y="640" width="2800" height="8" fill="#8a6038"/>`;
  for (let i = 0; i < 18; i++) s += `<path d="M-1100 ${662 + i * 22} Q288 ${656 + i * 22} 1700 ${662 + i * 22}" stroke="#4a2f1a" stroke-width="1.6" fill="none" opacity=".6"/>`;
  s += candle(90, 640, 1.2, t) + candle(480, 640, 1, t + 1);
  s += `<g transform="translate(470,636)"><path d="M-14 0 L-10 -30 L10 -30 L14 0Z" fill="${gLin('#3a2a1e')}"/><path d="M4 -28 Q30 -90 60 -120" stroke="#f3ead8" stroke-width="3" fill="none"/><path d="M40 -100 Q60 -128 64 -126 Q56 -100 40 -100Z" fill="#f3ead8"/></g>`;
  s += motes(t, 24, 3, '#ffe7a0', 40, 540, 120, 640);
  const turn = p.turn ? ((t * .45) % 1) : 0;
  s += bibleBook(288, 560, 1.35, t, p.glow ?? .7, turn, p.label || 'GÊNESIS');
  if (p.lens) { const lx = 230 + Math.sin(t * .7) * 70, ly = 520 + Math.cos(t * .5) * 30; s += `<g transform="translate(${f1(lx)},${f1(ly)})"><circle r="54" fill="#ffffff" opacity=".16" stroke="${gLin('#d7a84a')}" stroke-width="9"/><path d="M-30 -24 Q-20 -36 -6 -40" stroke="#fff" stroke-width="4" fill="none" opacity=".6"/><rect x="34" y="34" width="16" height="72" rx="7" fill="${gLin('#5a3a22')}" transform="rotate(-45 42 42)"/></g>`; }
  return { svg: s, shots: [WIDE, { fx: 288, fy: 520, z: 1.35, sy: 470 }, { fx: 230, fy: 520, z: 1.7, sy: 430 }, { fx: 330, fy: 540, z: 1.2, sy: 500 }] };
};

S.themeTitle = (t, p) => {
  let s = sky('tt', [[0, '#120c08'], [1, '#2a1a10']]);
  s += motes(t, 40, 9, '#ffe7a0', 0, 576, 0, 1024);
  s += bibleBook(288, 720, 1.05, t, .4, 0, 'GÊNESIS', .7);
  const k = easeOut(t / .8), k2 = pop((t - .5) / .6);
  let ov = `<g text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold"><g opacity="${f1(k)}" transform="translate(288,${f1(250 - (1 - k) * 20)})"><text y="0" font-size="58" fill="#ffd84d" stroke="#3a2000" stroke-width="6" paint-order="stroke">5 COISAS</text><text y="44" font-size="27" fill="#fff" stroke="#000" stroke-width="5" paint-order="stroke">que você talvez nunca</text><text y="76" font-size="27" fill="#fff" stroke="#000" stroke-width="5" paint-order="stroke">percebeu em</text></g><g transform="translate(288,${f1(398)}) scale(${f1(Math.max(0, k2))})"><text font-family="Liberation Serif, Times New Roman, serif" font-size="74" fill="#ffd84d" stroke="#3a2000" stroke-width="6" paint-order="stroke">GÊNESIS</text></g></g>`;
  return { svg: s, ov, shots: [WIDE, { fx: 288, fy: 600, z: 1.12, sy: 560 }] };
};

S.stars = (t, p) => {
  let s = sky('st', [[0, '#04051a'], [.45, '#121845'], [1, '#2c2a5e']]);
  s += glow(120, 120, 260, '#6a3fa0', .35) + glow(470, 300, 220, '#2f6aa8', .3);
  s += `<g opacity=".6"><ellipse cx="300" cy="220" rx="560" ry="90" fill="#7a6ac5" opacity=".22" transform="rotate(-25 300 220)"/><ellipse cx="300" cy="220" rx="440" ry="42" fill="#d4c8ff" opacity=".18" transform="rotate(-25 300 220)"/></g>`;
  s += starsField(t, 240, 3, -300, 760);
  for (let i = 0; i < 14; i++) { const x = -100 + rnd(i * 7) * 780, y = -100 + rnd(i * 13) * 620, o = .6 + .4 * Math.sin(t * 1.3 + i); s += starShape(x, y, 4 + rnd(i) * 5, '#fff7d0', 0, f1(o)) + `<path d="M${f1(x - 12)} ${f1(y)} L${f1(x + 12)} ${f1(y)} M${f1(x)} ${f1(y - 12)} L${f1(x)} ${f1(y + 12)}" stroke="#fff" stroke-width=".8" opacity="${f1(o * .5)}"/>`; }
  { const k = (t * .12) % 1; if (k < .25) { const q = k / .25; s += `<path d="M${f1(-50 + q * 400)} ${f1(40 + q * 160)} l-60 -24" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${f1(Math.sin(q * Math.PI) * .7)}"/>`; } }
  if (p.sweep) { const k = clamp(t / 6, 0, 1); for (let i = 0; i < 70; i++) { const a = rnd(i * 5) * 6.28, r = rnd(i * 2) * 520 * easeOut(k); s += `<circle cx="${f1(288 + Math.cos(a) * r)}" cy="${f1(300 + Math.sin(a) * r * .6)}" r="2.2" fill="#fff6c9" opacity="${f1(k)}"/>`; } }
  s += haze(690, '#4a4a8a', .35);
  s += hills(700, ['#1b2140', '#141832', '#0d1024'], 1, { bare: 1 });
  s += [[40, 690], [90, 700], [500, 700]].map(([x, y], i) => `<rect x="${x}" y="${y - 14}" width="14" height="10" fill="#3a3020"/><rect x="${x + 4}" y="${y - 11}" width="5" height="5" fill="#ffcf6a" opacity="${f1(.6 + .3 * Math.sin(t * 2 + i))}"/>`).join('');
  s += tree(60, 770, .9, t, 'cypress', 2) + tree(520, 750, 1, t, 'cypress', 3) + sheep(450, 800, .8, t, 2) + sheep(130, 815, .7, t, 5);
  // fogueira
  s += `<g transform="translate(410,805)">${glow(0, -10, 70, '#ff9a3c', .5)}<path d="M-14 0 L14 -4 M-12 -4 L12 0" stroke="#5a3a1c" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M${-6 + i * 6} 0 Q${f1(-10 + i * 6 + Math.sin(t * 7 + i) * 3)} -18 ${-6 + i * 6} ${f1(-28 - Math.sin(t * 9 + i) * 5)} Q${f1(i * 6 + 2)} -12 ${-6 + i * 6} 0Z" fill="${i === 1 ? '#ffd25a' : '#ff8a2a'}"/>`).join('')}</g>`;
  const px = p.px || 300;
  if (p.who !== 'none') s += person({ who: p.who || 'homem', x: px, y: 790, s: 1.2, t, look: p.look ?? .2, lookY: p.lookY ?? -1.1, pose: p.pose || 'default', emo: p.emo || 'awe' });
  if (p.heart) { const k = easeOut(t / 1.5), hb = Math.sin(t * 2.4) * 4; s += glow(px, 600, 190 * k, '#ffd27a', .55); s += `<g transform="translate(${px},${f1(478 + hb)}) scale(${f1(k * 1.2)})">${ICONS.heart()}</g>`; }
  return { svg: s, shots: [WIDE, { fx: 288, fy: 300, z: 1.25, sy: 400 }, FACE(px, 790), { fx: 288, fy: 600, z: 1.3, sy: 512 }] };
};

S.luminaries = (t, p) => {
  let s = `<defs><linearGradient id="lmD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fa8f5"/><stop offset="1" stop-color="#d8f0ff"/></linearGradient><linearGradient id="lmN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a26"/><stop offset="1" stop-color="#2b2f63"/></linearGradient><clipPath id="cN"><rect x="288" y="-400" width="1500" height="1600"/></clipPath><clipPath id="cD"><rect x="-1100" y="-400" width="1388" height="1600"/></clipPath></defs>`;
  s += `<rect x="-1100" y="-400" width="1388" height="1600" fill="url(#lmD)"/><rect x="288" y="-400" width="1500" height="1600" fill="url(#lmN)"/>`;
  s += `<g clip-path="url(#cN)">${starsField(t, 90, 9, -300, 700)}</g><g clip-path="url(#cD)">${clouds(t, 120, 4, 2, '#fff', .9, 8, .8)}${birds(t, 4, 1, 380)}</g>`;
  const sy = 260 + Math.sin(t * .6) * 6;
  s += glow(150, sy, 180, '#fff2a8', .9) + rays(150, sy, 12, 130, '#ffd84d', .25, t) + `<circle cx="150" cy="${f1(sy)}" r="62" fill="${gRad('#ffc531', .3, -.1)}"/>`;
  s += glow(430, 270, 130, '#e9f0ff', .5) + `<circle cx="430" cy="270" r="40" fill="${gRad('#f3efd6', .1, -.2)}"/><circle cx="416" cy="258" r="7" fill="#d8d2b4"/><circle cx="440" cy="285" r="5" fill="#d8d2b4"/><circle cx="447" cy="255" r="4" fill="#d8d2b4"/>`;
  s += haze(640, '#ffffff', .3);
  s += hills(690, ['#5aa04a', '#3f8a3a', '#2e6e2c']);
  s += `<rect x="288" y="600" width="1500" height="800" fill="#0a0d2a" opacity=".5"/>`;
  s += sheep(120, 780, 1, t) + sheep(200, 800, .9, t, 2) + tree(60, 740, .8, t, 'round', 3) + tree(510, 750, .8, t, 'olive', 4) + flowers(t, 820, 10, 4, -50, 280);
  s += `<g transform="translate(470,640)"><ellipse cx="0" cy="0" rx="9" ry="12" fill="#6b5640"/><circle cx="0" cy="-12" r="8" fill="#7a6450"/><circle cx="-3" cy="-13" r="2.6" fill="#ffd84d"/><circle cx="3" cy="-13" r="2.6" fill="#ffd84d"/></g>`;
  let ov = '';
  if (p.labels) { const k = easeOut(t / .8); ov = `<g opacity="${f1(k)}" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" text-anchor="middle" font-size="22" stroke="#000" stroke-width="5" paint-order="stroke"><text x="150" y="200" fill="#ffd84d">LUZEIRO</text><text x="150" y="226" fill="#ffd84d">MAIOR</text><text x="420" y="200" fill="#f3efd6">LUZEIRO</text><text x="420" y="226" fill="#f3efd6">MENOR</text></g>`; }
  return { svg: s, ov, shots: [WIDE, { fx: 150, fy: 280, z: 1.5, sy: 380 }, { fx: 430, fy: 280, z: 1.5, sy: 380 }, { fx: 288, fy: 420, z: 1.15, sy: 460 }] };
};

S.idols = (t, p) => {
  let s = sky('id', [[0, '#e9a65a'], [1, '#f6d7a0']]);
  s += glow(288, 200, 260, '#fff0b0', .7) + mountains(600, '#c98e6a', 3, 120);
  s += dunes(t, 640, ['#d9a35c', '#c88d48', '#b57a3a']);
  s += pyramid(40, 650, .9, '#d8b46a') + pyramid(540, 655, .7, '#cfa75c');
  s += `<g transform="translate(288,640)"><rect x="-150" y="-30" width="300" height="30" fill="${gVert('#c9b08a')}"/><rect x="-170" y="-10" width="340" height="14" fill="#b39a74"/>${[-120, -60, 60, 120].map(x => `<rect x="${x - 13}" y="-250" width="26" height="220" fill="${gLin('#e3d2b0', .1, -.25)}"/>${[0, 1, 2].map(k => `<line x1="${x - 6 + k * 6}" y1="-244" x2="${x - 6 + k * 6}" y2="-36" stroke="#c9b08a" stroke-width="1.4"/>`).join('')}<rect x="${x - 17}" y="-258" width="34" height="12" fill="#c9b08a"/>`).join('')}<rect x="-170" y="-282" width="340" height="30" fill="${gVert('#c9b08a')}"/>${[...Array(8)].map((_, i) => `<path d="M${-150 + i * 40} -270 l10 -6 l10 6 l-10 6Z" fill="#a8743f"/>`).join('')}<path d="M-180 -282 L0 -332 L180 -282Z" fill="${gVert('#b39a74')}"/>`;
  const fall = p.fall ? easeOut(t / 1.4) : 0;
  s += `<g transform="translate(0,${f1(-100 + fall * 70)}) rotate(${f1(fall * 25)})" opacity="${f1(1 - fall * .55)}"><rect x="-22" y="-10" width="44" height="80" fill="${gLin('#b8862f')}"/>${rays(0, -50, 12, 66, '#f0c04a', .9, t, .07)}<circle cx="0" cy="-50" r="40" fill="${gRad('#f0c04a', .3)}"/><circle cx="0" cy="-50" r="26" fill="#ffd866"/></g>`;
  // braseiros com fumaça de incenso
  s += [-110, 110].map(x => `<g transform="translate(${x},-30)"><path d="M-12 0 L12 0 L8 -14 L-8 -14Z" fill="#7a5a32"/>${[0, 1, 2].map(i => `<path d="M${-4 + i * 4} -14 Q${f1(-8 + i * 4 + Math.sin(t * 8 + i) * 2)} -26 ${-4 + i * 4} ${f1(-34 - Math.sin(t * 9 + i) * 4)}Z" fill="${i === 1 ? '#ffd25a' : '#ff8a2a'}"/>`).join('')}${[0, 1, 2].map(i => { const k = (t * .3 + i / 3) % 1; return `<circle cx="${f1(Math.sin(t + i * 2) * 10)}" cy="${f1(-40 - k * 120)}" r="${f1(6 + k * 14)}" fill="#ffffff" opacity="${f1((1 - k) * .3)}"/>`; }).join('')}</g>`).join('') + `</g>`;
  if (p.fall) s += `<g transform="translate(288,450) scale(${f1(pop(t / .5) * 2.4)})"><path d="M-24 -26 L24 22 M24 -26 L-24 22" stroke="#d64545" stroke-width="7" stroke-linecap="round"/></g>`;
  s += crowd(t, 790, 5, 3, 1, { x0: 50, gap: 115, pose: p.fall ? 'surprise' : 'bow', emo: p.fall ? 'surprise' : 'pray', look: 0 });
  return { svg: s, shots: [WIDE, { fx: 288, fy: 440, z: 1.5, sy: 380 }, { fx: 170, fy: 620, z: 1.6, sy: 470 }, { fx: 400, fy: 560, z: 1.3, sy: 470 }] };
};

S.galaxy = (t, p) => {
  let s = sky('gx', [[0, '#020210'], [1, '#0d0b2a']]);
  s += glow(120, 700, 300, '#5a2a8a', .35) + glow(480, 200, 260, '#1f4a8a', .35);
  s += starsField(t, 280, 11, -300, 1300, .9);
  const z = 1 + t * .04;
  s += `<g transform="translate(288,420) scale(${f1(z * 100) / 100}) translate(-288,-420)">`;
  const gals = [[288, 380, 1.4, '#c9b6ff'], [110, 180, .6, '#ffc9a8'], [470, 560, .7, '#a8e1ff'], [90, 700, .5, '#ffe0f0'], [480, 160, .45, '#d6ffd0']];
  gals.forEach(([x, y, sc, c], j) => {
    let g = glow(x, y, 130 * sc, c, .55);
    for (let a = 0; a < 2; a++) for (let i = 0; i < 70; i++) { const r = i * 1.6 * sc, th = i * .17 + a * Math.PI + t * .15 * (j % 2 ? -1 : 1); g += `<circle cx="${f1(x + Math.cos(th) * r)}" cy="${f1(y + Math.sin(th) * r * .55)}" r="${f1(1.6 * sc + rnd(i) * 1.2)}" fill="${c}" opacity="${f1(1 - i / 80)}"/>`; }
    s += g + glow(x, y, 16 * sc, '#fffbe6', 1);
  });
  s += `</g>`;
  let ov = '';
  if (p.count) ov = `<g text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" opacity="${f1(easeOut(t))}" stroke="#000" stroke-width="5" paint-order="stroke"><text x="288" y="230" font-size="40" fill="#ffd84d">BILHÕES</text><text x="288" y="270" font-size="28" fill="#fff">DE GALÁXIAS</text></g>`;
  return { svg: s, ov, shots: [WIDE, { fx: 288, fy: 380, z: 1.5, sy: 430 }, { fx: 200, fy: 300, z: 1.25, sy: 450 }] };
};

S.david = (t, p) => {
  let s = sky('dv', [[0, '#060922'], [.6, '#1c2356'], [1, '#2f3a70']]);
  s += glow(140, 160, 240, '#5a3a9a', .3) + starsField(t, 220, 21, -300, 720);
  s += glow(470, 170, 100, '#e9f0ff', .5) + `<circle cx="470" cy="170" r="26" fill="${gRad('#f3efd6')}"/>`;
  s += haze(630, '#5a5aa0', .3) + hills(640, ['#23305a', '#1b2648', '#131b36']);
  s += sheep(100, 800, 1, t) + sheep(460, 815, 1, t, 4) + sheep(530, 790, .9, t, 7) + sheep(40, 830, .9, t, 2);
  s += `<g transform="translate(410,830)">${glow(0, -10, 80, '#ff9a3c', .55)}<path d="M-14 0 L14 -4 M-12 -4 L12 0" stroke="#5a3a1c" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M${-6 + i * 6} 0 Q${f1(-10 + i * 6 + Math.sin(t * 7 + i) * 3)} -18 ${-6 + i * 6} ${f1(-28 - Math.sin(t * 9 + i) * 5)} Q${f1(i * 6 + 2)} -12 ${-6 + i * 6} 0Z" fill="${i === 1 ? '#ffd25a' : '#ff8a2a'}"/>`).join('')}</g>`;
  s += grassTufts(t, 780, 30, 4, '#2c3d5a');
  s += person({ who: 'davi', x: 270, y: 800, s: 1.25, t, look: .3, lookY: -1.3, pose: p.pose || 'default', harp: p.harp ?? 1, staff: 0, emo: p.emo || 'awe' });
  return { svg: s, shots: [WIDE, FACE(270, 800, 1.25), { fx: 288, fy: 300, z: 1.2, sy: 380 }, { fx: 288, fy: 650, z: 1.35, sy: 512 }] };
};

S.scroll = (t, p) => {
  let s = sky('sc', [[0, '#2a1d14'], [1, '#4a3322']]);
  s += candle(70, 900, 1, t) + candle(510, 910, .9, t + 2) + motes(t, 16, 5, '#ffe7a0', 0, 576, 300, 900);
  s += `<g transform="translate(288,480)"><rect x="-212" y="-332" width="424" height="684" fill="${gLin('#f1e2bf', .06, -.12)}"/>${[...Array(10)].map((_, i) => `<path d="M-200 ${-300 + i * 64} q100 6 200 -2 t200 4" stroke="#d9c49a" stroke-width="1" fill="none" opacity=".6"/>`).join('')}<rect x="-212" y="-332" width="424" height="684" fill="none" stroke="#c9a26b" stroke-width="4"/><rect x="-234" y="-358" width="468" height="36" rx="18" fill="${gVert('#8b5a2b', .2, -.3)}"/><rect x="-234" y="340" width="468" height="36" rx="18" fill="${gVert('#8b5a2b', .2, -.3)}"/><circle cx="-238" cy="-340" r="12" fill="#6b4423"/><circle cx="238" cy="-340" r="12" fill="#6b4423"/><circle cx="-238" cy="358" r="12" fill="#6b4423"/><circle cx="238" cy="358" r="12" fill="#6b4423"/></g>`;
  (p.rows || []).forEach((r, i) => {
    const k = easeOut((t - i * .5) / .6); if (k <= 0) return;
    const y = 215 + i * 82, hl = r.hl;
    s += `<g opacity="${f1(k)}" font-family="Liberation Serif, Times New Roman, serif" text-anchor="middle">`;
    if (hl) s += glow(288, y - 6, 160, '#ffe7a0', .8) + `<rect x="86" y="${y - 40}" width="404" height="74" rx="10" fill="#ffe7a0" opacity=".7"/>`;
    s += `<text x="288" y="${y}" font-size="32" fill="#3a2414" font-weight="bold">${r.a}</text><text x="288" y="${y + 25}" font-size="21" fill="${hl ? '#7a2131' : '#6b4a2a'}" font-style="italic">${r.b}</text></g>`;
    if (r.dim) s += `<path d="M120 ${y + 18} L456 ${y + 18}" stroke="#7a2131" stroke-width="1.5" opacity=".0"/>`;
  });
  return { svg: s, shots: [WIDE, { fx: 288, fy: 330, z: 1.35, sy: 380 }, { fx: 288, fy: 470, z: 1.3, sy: 450 }] };
};

S.enoch = (t, p) => {
  let s = sky('en', [[0, '#74bdf0'], [.55, '#f7d9a2'], [1, '#f2b47a']]);
  s += glow(288, 140, 330, '#fff3c4', .9) + rays(288, 140, 16, 700, '#fff3c4', .12, t);
  s += clouds(t, 80, 5, 7, '#fff', .8, 5);
  s += mountains(540, '#a8b8c8', 2, 90) + haze(540, '#fff4dc', .5);
  s += [[60, 540], [100, 548], [130, 536]].map(([x, y]) => house(x, y, 22, 18, '#d9c09a', x)).join('');
  s += hills(560, ['#9cc979', '#7fb35f', '#64994a']);
  s += `<path d="M260 1100 Q180 900 300 800 Q420 700 300 620 Q240 585 290 560" stroke="${gVert('#ead3a0', .1, -.1)}" stroke-width="62" fill="none" stroke-linecap="round"/><path d="M260 1100 Q180 900 300 800 Q420 700 300 620 Q240 585 290 560" stroke="#d1b075" stroke-width="3" fill="none" stroke-dasharray="3 16"/>`;
  s += tree(70, 700, .8, t, 'olive', 5) + tree(500, 680, .7, t, 'cypress', 2) + tree(535, 860, 1, t, 'round', 6);
  s += sheep(420, 640, .55, t, 1) + sheep(455, 650, .5, t, 3) + sheep(390, 655, .5, t, 6) + deer(110, 640, .55, t, 2);
  s += flowers(t, 800, 22, 3) + grassTufts(t, 860, 34, 9, '#4d8a3a');
  s += butterflies(t, 4, 2, 60, 600, 460, 180) + birds(t, 5, 3, 260) + motes(t, 14, 8, '#fff6cf', 0, 576, 300, 800);
  const taken = p.taken ? clamp(t / 4, 0, 1) : 0;
  if (p.taken) s += `<path d="M230 -300 L346 -300 L384 820 L192 820Z" fill="#fff8de" opacity="${f1(.15 + .35 * easeOut(t / 2))}"/>` + glow(288, 640, 220, '#fff6d2', .7 * easeOut(t / 2));
  const x = p.taken ? 288 : 288 + Math.sin(t * .35) * 18;
  { const ay = 800 - taken * 40 - 110 * 1.25, pulse = .85 + .15 * Math.sin(t * 1.6);
    s += glow(x, ay, 170 * pulse, '#fff1b8', .9) + rays(x, ay, 14, 210, '#fff6d2', .1, t * .6, .06);
    for (let i = 0; i < 10; i++) { const a = t * .7 + i * .628, r = 70 + Math.sin(t * 1.3 + i) * 12; s += starShape(x + Math.cos(a) * r * .8, ay + Math.sin(a) * r * 1.2, 3 + (i % 3), '#fffbe0', t, f1(.5 + .4 * Math.sin(t * 2 + i))); } }
  s += person({ who: 'enoque', x, y: 800 - taken * 40, s: 1.25, t, walk: p.taken ? 0 : .9, look: p.taken ? 0 : .2, pose: p.taken ? 'raise' : (p.pose || undefined), op: f1(1 - taken * .85), emo: p.emo || (p.taken ? 'joy' : 'happy') });
  if (p.steps) { for (let i = 0; i < 8; i++) { const k = clamp(t * 1.5 - i * .4, 0, 1); if (k > 0) s += `<g transform="translate(${f1(260 + (i % 2) * 40)},${f1(990 - i * 50)}) scale(.6)" opacity="${f1(k * .8)}">${ICONS.steps()}</g>`; } }
  let ov = '';
  if (p.counter) { const n = Math.min(300, Math.floor(easeOut(t / 3) * 300)); ov += `<g font-family="Liberation Sans, Arial" font-weight="bold" text-anchor="middle"><text x="288" y="262" font-size="96" fill="#fff" stroke="#7a4e1c" stroke-width="6" paint-order="stroke">${n}</text><text x="288" y="302" font-size="30" fill="#fff" stroke="#7a4e1c" stroke-width="5" paint-order="stroke">ANOS COM DEUS</text></g>`; }
  if (p.tasks) ['crown', 'scroll', 'tag', 'people'].forEach((ic, i) => { const a = t * .6 + i * Math.PI / 2, k = easeOut((t - i * .3) / .5); s += `<g transform="translate(${f1(288 + Math.cos(a) * 150)},${f1(560 + Math.sin(a) * 60)}) scale(${f1(k * 1.1)})"><circle r="30" fill="#fff" opacity=".9"/>${ICONS[ic]()}</g>`; });
  return { svg: s, ov, shots: [WIDE, FACE(x, 800, 1.25), { fx: 288, fy: 640, z: 1.3, sy: 512 }, { fx: 288, fy: 420, z: 1.15, sy: 420 }] };
};

S.ark = (t, p) => {
  if (p.board) return S.arkBoard(t, p);
  const calm = p.calm;
  let s = calm ? sky('ak', [[0, '#7ec4f2'], [1, '#e6f4ff']]) : sky('ak', [[0, '#1f2633'], [1, '#4d5b70']]);
  if (calm) s += glow(460, 160, 220, '#fff3c4', .9) + `<circle cx="460" cy="160" r="44" fill="${gRad('#ffd84d', .3)}"/>` + rays(460, 160, 14, 300, '#fff3c4', .12, t) + clouds(t, 90, 4, 3, '#fff', .9, 6);
  else { s += clouds(t, 30, 7, 5, '#2e3644', .95, 12, 1.5) + clouds(t, 160, 5, 9, '#3b4454', .9, 16, 1.2); for (let i = 0; i < 110; i++) { const x = rnd(i) * 1700 - 200, y = ((rnd(i * 3) * 1100 + t * 620) % 1100) - 100; s += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - 6)}" y2="${f1(y + 24)}" stroke="#b8c7da" stroke-width="1.5" opacity=".5"/>`; } }
  if (calm) s += `<path d="M-200 640 Q60 520 200 600 L320 640Z" fill="${gVert('#6b8f5a')}"/>`;
  s += ark(288, 650, 1.15, t, calm ? .4 : 1.2, { animals: 1, calm });
  if (p.noah) s += `<g transform="translate(288,${f1(650 + Math.sin(t * 1.4) * 4 * (calm ? .4 : 1.2))}) rotate(${f1(Math.sin(t * 1.1) * 2.5 * (calm ? .4 : 1.2))}) scale(1.15)"><clipPath id="nw"><rect x="-26" y="-118" width="46" height="42"/></clipPath><rect x="-26" y="-118" width="46" height="42" fill="#1a0f05"/><g clip-path="url(#nw)">${person({ who: 'noe', x: -3, y: -12, s: .5, t, look: .5, pose: calm ? 'raise' : 'pray', staff: 0, emo: p.emo || (calm ? 'joy' : 'worried') })}</g><rect x="-26" y="-118" width="46" height="42" fill="none" stroke="#4a2e14" stroke-width="3"/></g>`;
  if (calm) s += `<g transform="translate(288,${f1(650 + Math.sin(t * 1.4) * 1.6)}) scale(1.15)"><g transform="translate(-92,-122)"><path d="M0 0 L4 -30 Q8 -40 16 -36" stroke="#d9a54a" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="16" cy="-36" r="2" fill="#222"/></g><g transform="translate(110,-112)"><ellipse cx="0" cy="0" rx="12" ry="9" fill="#8a8a8a"/><path d="M-10 4 Q-16 14 -12 20" stroke="#8a8a8a" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-4" cy="-2" r="1.4" fill="#222"/></g></g>`;
  s += water(t, 655, calm ? '#3d8fc4' : '#26445e', calm ? '#bfe6ff' : '#8fb0c8', calm ? 5 : 13, calm ? .6 : 1.6);
  if (!calm) for (let i = 0; i < 8; i++) { const x = (rnd(i) * 800 + t * 40) % 800 - 100; s += `<path d="M${f1(x)} ${f1(700 + rnd(i * 3) * 120)} q14 -12 28 0" stroke="#e6f0f8" stroke-width="3" fill="none" opacity=".6"/>`; }
  s += birds(t, calm ? 3 : 0, 4, 230, '#334');
  return { svg: s, shots: [WIDE, { fx: 288, fy: 560, z: 1.5, sy: 450 }, { fx: 285, fy: 520, z: 2.1, sy: 420 }, { fx: 288, fy: 420, z: 1.2, sy: 430 }] };
};

// Antes do dilúvio: os animais entram na arca, aos pares (Gn 7:8-9)
S.arkBoard = (t, p) => {
  let s = sky('ab', [[0, '#8fb8d8'], [1, '#e8eef2']]);
  s += clouds(t, 60, 5, 4, '#c8d2dc', .9, 6, 1.2) + mountains(560, '#9fb0bf', 3, 110) + haze(560, '#fff', .4);
  s += hills(600, ['#8cb86a', '#73a456', '#5e8c45'], 3);
  s += tree(30, 640, .8, t, 'olive', 2) + tree(545, 660, .9, t, 'cypress', 5);
  // arca em terra firme, com a porta lateral (Gn 6:16) e uma rampa
  s += `<g transform="translate(330,640) scale(1.05)">${ark(0, 0, 1, 0, 0, { animals: 0 }).replace(/^<g transform="[^"]*">/, '<g>')}</g>`;
  s += `<path d="M376 560 L120 760 L150 772 L400 590Z" fill="${gVert('#8b5a2b', .15, -.25)}"/>${[...Array(9)].map((_, i) => `<line x1="${f1(372 - i * 28)}" y1="${f1(566 + i * 21.5)}" x2="${f1(394 - i * 28)}" y2="${f1(592 + i * 20)}" stroke="#5a3a1c" stroke-width="1.6"/>`).join('')}`;
  // fila de pares subindo a rampa
  const pairs = [['lion', 0], ['lion', 1], ['ele', 0], ['ele', 1], ['gir', 0], ['gir', 1], ['zeb', 0], ['zeb', 1], ['cam', 0], ['cam', 1], ['ox', 0], ['ox', 1], ['sheep', 0], ['sheep', 1]];
  pairs.forEach(([k, j], i) => {
    const u = ((t * .045) + (pairs.length - i) * .065) % 1;
    const x = 40 + u * 330 + j * 18, y = 800 - u * 230 + j * 8, sc2 = .78 - u * .22, op = u > .9 ? (1 - u) * 10 : 1;
    const g = k === 'lion' ? lion(0, 0, 1, t, j === 1, i, 1) : k === 'ele' ? elephant(0, 0, .9, t, i, 1) : k === 'gir' ? giraffe(0, 0, .8, t, i, 1) : k === 'zeb' ? zebra(0, 0, 1, t, i, 1) : k === 'cam' ? camel(0, 0, .85, t, i, 1) : k === 'ox' ? ox(0, 0, .9, t, i, 1) : sheep(0, 0, 1.1, t, i);
    s += `<g transform="translate(${f1(x)},${f1(y)}) scale(${f1(sc2)})" opacity="${f1(op)}">${g}</g>`;
  });
  s += birds(t, 6, 3, 220, '#3a3a4a') + flowers(t, 830, 16, 6, -50, 300) + grassTufts(t, 860, 30, 2);
  s += [[60, 900, 'r'], [100, 905, 'r'], [520, 920, 'd'], [-10, 820, 'd']].map(([x, y, k], i) => k === 'r' ? rabbit(x, y, 1, t, i) : deer(x, y, .55, t, i)).join('');
  s += birdPerched(250, 850, 1.3, '#e0475b', t, 1) + birdPerched(270, 852, 1.3, '#e0475b', t, 2);
  s += person({ who: 'noe', x: 470, y: 860, s: 1.2, t, look: -1, pose: 'open', emo: 'happy', staff: 0 });
  return { svg: s, first: 0, shots: [WIDE, { fx: 200, fy: 650, z: 1.5, sy: 470 }, FACE(470, 860), { fx: 300, fy: 560, z: 1.3, sy: 460 }] };
};

S.hebrew = (t, p) => {
  let s = sky('hb', [[0, '#1a1530'], [1, '#3a2c55']]);
  s += starsField(t, 60, 31, -300, 1200, .7) + motes(t, 20, 4, '#ffe7a0', 0, 576, 100, 900);
  const k = easeOut(t / .9);
  s += glow(288, 300, 220, '#ffe7a0', .5 * k);
  s += `<g text-anchor="middle" opacity="${f1(k)}"><text x="288" y="${f1(330 - (1 - k) * 30)}" font-family="DejaVu Sans, sans-serif" font-size="120" font-weight="bold" fill="#ffd84d" stroke="#5a3a00" stroke-width="3" paint-order="stroke">תֵּבָה</text><text x="288" y="390" font-family="Liberation Serif, Times New Roman" font-size="40" font-style="italic" fill="#f3e6c8">Tebá</text></g>`;
  const k2 = easeOut((t - 1.2) / .8), k3 = easeOut((t - 2) / .8);
  const sub = (y, c1, c2) => water(t, y, c1, c2, 3, 1).replace(/-1100/g, '-200').replace(new RegExp(`width="${W + 800}"`), 'width="400"');
  s += `<g opacity="${f1(k2)}" transform="translate(150,520)"><circle r="96" fill="#d7a84a"/><circle r="92" fill="#2c4b66"/><clipPath id="hc1"><circle r="88"/></clipPath><g clip-path="url(#hc1)">${sky('hcs1', [[0, '#4d5b70'], [1, '#8fa0b8']])}${ark(0, 22, .42, t, .5)}${sub(24, '#2c6b96', '#9fd0f0')}</g><text y="128" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="22" fill="#fff" stroke="#000" stroke-width="4" paint-order="stroke">ARCA · Gn 6</text></g>`;
  s += `<g opacity="${f1(k3)}" transform="translate(426,520)"><circle r="96" fill="#d7a84a"/><circle r="92" fill="#2f6f74"/><clipPath id="hc2"><circle r="88"/></clipPath><g clip-path="url(#hc2)">${sky('hcs2', [[0, '#8fd0f5'], [1, '#fbe3b5']])}${reeds(t, -90, 90, 30, 12, 5, 80)}${sub(20, '#3a8a92', '#b9ecef')}${basket(0, 24, .9, t)}</g><text y="128" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="22" fill="#fff" stroke="#000" stroke-width="4" paint-order="stroke">CESTO · Êx 2</text></g>`;
  if (k3 > 0) s += `<path d="M246 520 Q288 ${f1(480 - 10 * Math.sin(t * 2))} 330 520" stroke="#ffd84d" stroke-width="4" fill="none" stroke-dasharray="${f1(120 * k3)} 200"/>`;
  return { svg: s, shots: [WIDE, { fx: 288, fy: 330, z: 1.4, sy: 340 }, { fx: 288, fy: 560, z: 1.2, sy: 500 }] };
};

S.nile = (t, p) => {
  let s = sky('nl', [[0, '#86ccf5'], [.7, '#fbe3b5'], [1, '#f2c98a']]);
  s += glow(470, 160, 170, '#fff3c4', .8) + `<circle cx="470" cy="160" r="38" fill="${gRad('#ffd84d', .3)}"/>` + clouds(t, 80, 4, 8, '#fff', .8, 5);
  s += haze(520, '#fff4dc', .5) + pyramid(120, 520, .8) + pyramid(230, 525, .5, '#cfa75c');
  if (p.palace) s += `<g transform="translate(440,522)"><rect x="-90" y="-120" width="180" height="120" fill="${gLin('#e3d2b0', .1, -.2)}"/>${[-70, -35, 0, 35, 70].map(x => `<rect x="${x - 7}" y="-110" width="14" height="110" fill="${gLin('#c9b08a')}"/>`).join('')}<rect x="-100" y="-132" width="200" height="16" fill="#b39a74"/><rect x="-100" y="-132" width="200" height="4" fill="#2a6a9a"/><path d="M-14 -150 L0 -170 L14 -150Z" fill="#d7a84a"/></g>`;
  s += `<path d="M-1100 520 Q288 500 1700 520 L1700 600 L-1100 600Z" fill="${gVert('#c9b07a')}"/>`;
  s += tree(40, 560, .8, t, 'palm', 1) + tree(545, 572, .7, t, 'palm', 2) + tree(300, 540, .45, t, 'palm', 3);
  s += water(t, 590, '#3a8a92', '#b9ecef', 5, .6);
  s += lotus(120, 690, 1, t) + lotus(470, 720, .9, t) + lotus(380, 660, .7, t);
  s += reeds(t, -100, 200, 760, 28, 3, 160) + reeds(t, 400, 700, 770, 24, 7, 150);
  s += ibis(520, 640, .8, t) + birds(t, 3, 9, 260, '#3a3a3a');
  // Miriã observa de longe (Êx 2:4)
  if (p.miriam) s += person({ who: 'povo4', x: 520, y: 700, s: .72, t, look: -1, pose: 'chest', emo: 'worried', h: .8 });
  const bx = p.float ? 300 + Math.sin(t * .3) * 30 : 330;
  if (p.mother) s += person({ who: 'joquebede', x: 200, y: 820, s: 1.2, t, look: .8, lookY: .6, pose: p.release ? 'offer' : 'hold', emo: p.emo || (p.release ? 'cry' : 'worried') });
  if (p.glowB) { const k = easeOut(t / 2); s += `<path d="M${bx - 50} -300 L${bx + 50} -300 L${bx + 95} 780 L${bx - 95} 780Z" fill="#fff6d2" opacity="${f1(.3 * k)}"/>` + glow(bx, 750, 150 * k, '#fff3c4', .85) + motes(t, 16, 5, '#fff6cf', bx - 90, bx + 90, 400, 780); }
  s += basket(bx, p.mother ? 790 : 760, 1.4, t);
  s += reeds(t, 230, 420, 880, 12, 11, 110);
  const shots = p.mother ? [WIDE, { fx: bx, fy: 740, z: 1.9, sy: 440 }, FACE(200, 820), { fx: 288, fy: 600, z: 1.25, sy: 470 }] : [WIDE, { fx: bx, fy: 740, z: 1.9, sy: 440 }, { fx: 288, fy: 600, z: 1.25, sy: 470 }, { fx: 460, fy: 560, z: 1.5, sy: 420 }];
  return { svg: s, first: p.wide ? 0 : undefined, shots };
};

S.exodusCrowd = (t, p) => {
  let s = sky('ex', [[0, '#f2b47a'], [1, '#fbe3b5']]);
  s += glow(100, 220, 200, '#fff3c4', .8) + `<circle cx="100" cy="220" r="40" fill="${gRad('#ffd27a')}"/>` + mountains(610, '#c98e6a', 5, 110) + haze(600, '#fff0d0', .45);
  s += dunes(t, 620, ['#e0b56a', '#d4a258', '#c38f48']);
  s += `<g opacity=".8">${[0, 1, 2, 3].map(i => sheep(-60 + ((t * 14 + i * 60) % 700), 690 + i * 6, .45, t, i)).join('')}</g>`;
  s += crowd(t, 760, 6, 1, .7, { x0: -120, gap: 70, walk: .8, speed: 14, look: 1, emo: 'happy' });
  s += crowd(t, 830, 6, 5, .85, { x0: -160, gap: 85, walk: .8, speed: 16, look: 1, emo: 'joy' });
  s += person({ who: 'moises', x: 400, y: 840, s: 1.2, t, walk: .7, look: 1, emo: 'happy' });
  return { svg: s, shots: [WIDE, FACE(400, 840), { fx: 200, fy: 650, z: 1.3, sy: 480 }] };
};

S.tinyBig = (t, p) => {
  let s = sky('tb', [[0, '#8fd2ff'], [1, '#eaf8ff']]);
  s += glow(470, 150, 200, '#fff3c4', .8) + clouds(t, 100, 5, 4, '#fff', .9, 6) + haze(620, '#fff', .35) + hills(620, ['#8cc56b', '#6fae55', '#55943f']);
  const k = clamp(t / 6, 0, 1);
  s += glow(288, 660, 180 * easeOut(k), '#fff3c4', .5);
  s += tree(288, 800, .3 + 1.3 * easeOut(k), t, 'round', 3);
  s += basket(120, 860, .9, t, true, false);
  s += rabbit(420, 860, 1, t) + rabbit(470, 880, .8, t, 2) + flowers(t, 820, 24, 5) + butterflies(t, 4, 3, 100, 520, 380, 200) + birds(t, 4, 6, 220);
  return { svg: s, shots: [WIDE, { fx: 288, fy: 600, z: 1.4, sy: 470 }, { fx: 150, fy: 800, z: 1.6, sy: 480 }] };
};

S.tent = (t, p) => {
  let s = sky('tn', [[0, '#f0b070'], [1, '#fbe3b5']]);
  s += glow(470, 200, 180, '#fff3c4', .8) + mountains(600, '#c98e6a', 7, 110) + haze(600, '#fff0d0', .45);
  s += dunes(t, 600, ['#e0b56a', '#d4a258', '#c38f48']);
  s += tent(150, 720, 1.4) + tree(525, 700, .8, t, 'palm', 3) + sheep(495, 822, .9, t, 1) + sheep(440, 840, .8, t, 4);
  s += `<g transform="translate(330,660)"><path d="M0 0 L-10 30 M0 0 L10 30 M0 0 L0 30" stroke="#5a3a1c" stroke-width="3"/><path d="M-12 0 L12 0 L8 -10 L-8 -10Z" fill="#7a3a20"/></g>`;
  s += person({ who: 'sarai', x: 225, y: 830, s: 1.2, t, look: 1, pose: 'point', talk: false, emo: 'stern' });
  s += person({ who: 'agar', x: 420, y: 840, s: 1.2, t, look: -1, pose: p.leave ? 'wipe' : 'belly', emo: p.leave ? 'cry' : 'sad', walk: p.leave ? .6 : 0, flip: !!p.leave });
  return { svg: s, shots: [WIDE, FACE(225, 830), FACE(420, 840), { fx: 330, fy: 640, z: 1.35, sy: 480 }] };
};

S.hagar = (t, p) => {
  let s = sky('hg', [[0, '#f29a52'], [.6, '#fbd59a'], [1, '#fbe8c4']]);
  s += glow(288, 260, 270, '#fff0b0', .8) + `<circle cx="288" cy="260" r="54" fill="${gRad('#ffd27a', .3)}" opacity=".9"/>`;
  s += mountains(565, '#c48a6a', 4, 100) + haze(560, '#fff0d0', .5);
  s += dunes(t, 580, ['#e8bd74', '#dcaa60', '#cd9a50', '#bf8a44']);
  s += acacia(-10, 700, .9, t) + acacia(560, 690, .7, t + 2) + rocks(60, 760, 1) + rocks(500, 790, .8) + rocks(330, 900, .7);
  s += `<g opacity=".7">${[0, 1, 2].map(i => { const x = ((t * 6 + i * 26) % 700) - 60; return `<g transform="translate(${f1(x)},556) scale(.35)"><ellipse cx="0" cy="-40" rx="30" ry="16" fill="#8a5a32"/><circle cx="-6" cy="-58" r="12" fill="#8a5a32"/><path d="M26 -46 Q44 -70 40 -86" stroke="#8a5a32" stroke-width="9" fill="none"/><rect x="-24" y="-30" width="5" height="30" fill="#7a4a28"/><rect x="18" y="-30" width="5" height="30" fill="#7a4a28"/></g>`; }).join('')}</g>`;
  for (let i = 0; i < 4; i++) { const k = (t * .15 + i * .25) % 1; s += `<path d="M${-50 + i * 160} ${f1(560 - k * 40)} q20 -6 40 0 t40 0" stroke="#fff" stroke-width="2" fill="none" opacity="${f1(.25 * (1 - k))}"/>`; }
  s += birds(t, 3, 12, 300, '#6b4a2a');
  if (p.spring) s += tree(120, 760, .9, t, 'palm', 1) + tree(470, 750, .8, t, 'palm', 2) + spring(288, 830, 1.1, t);
  const flee = p.flee;
  const hx = flee ? 140 + (t * 22) % 300 : (p.spring ? 190 : 288);
  if (p.angel) { const k = easeOut(t / 1.2); s += `<g opacity="${f1(k)}">` + person({ who: 'anjo', x: 400, y: 810, s: 1.22, t, look: -1, pose: 'open', talk: !!p.talk && SPEAK }) + `</g>`; }
  s += person({ who: 'agar', x: hx, y: 820, s: 1.2, t, walk: flee ? .7 : 0, look: p.angel ? 1 : .4, lookY: p.lookUp ? -1 : undefined, pose: p.pose || (p.sit ? 'sit' : 'belly'), emo: p.emo || (flee ? 'cry' : 'sad') });
  let ov = '';
  if (p.names) { const k = easeOut(t / .8); ov += `<g opacity="${f1(k)}" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold">${p.names.map((n, i) => `<g transform="translate(${f1(p.names.length > 1 ? 150 + i * 276 : 288)},240)">${glow(0, 0, 80, '#fff3c4', .6)}<circle r="52" fill="#fff8e6" stroke="#d7a84a" stroke-width="4"/><g transform="translate(0,-4) scale(1.3)">${ICONS[n.ic]()}</g><text y="86" font-size="30" fill="#fff" stroke="#3a1a00" stroke-width="5" paint-order="stroke">${n.a}</text><text y="116" font-size="22" fill="#ffd84d" stroke="#3a1a00" stroke-width="4" paint-order="stroke">“${n.b}”</text></g>`).join('')}</g>`; }
  return { svg: s, ov, shots: [WIDE, FACE(hx, 820), { fx: 330, fy: 640, z: 1.35, sy: 470 }, p.angel ? FACE(400, 810, 1.22) : { fx: 288, fy: 400, z: 1.2, sy: 420 }] };
};

S.crowdAlone = (t, p) => {
  let s = sky('ca', [[0, '#9fb3c9'], [1, '#e2e7ec']]);
  s += mountains(470, '#b4bccb', 3, 90) + haze(470, '#fff', .4);
  s += [0, 1, 2, 3, 4, 5].map(i => house(-150 + i * 135, 742, 118, 210 + rnd(i) * 120, ['#d8c4a0', '#cdb48a', '#e0cfae'][i % 3], i)).join('');
  s += tree(30, 742, .7, t, 'palm', 1) + tree(545, 742, .6, t, 'palm', 2) + birds(t, 4, 7, 200, '#4a4a55');
  s += `<rect x="-1100" y="740" width="2800" height="700" fill="${gVert('#c2ae8c', .05, -.2)}"/>${[...Array(12)].map((_, i) => `<line x1="${-200 + i * 90}" y1="740" x2="${-260 + i * 110}" y2="1100" stroke="#a8946f" stroke-width="2"/>`).join('')}`;
  s += stall(80, 760, '#b5523b', t) + stall(500, 765, '#3d6f8a', t);
  s += crowd(t, 800, 7, 2, 1, { x0: -200, gap: 110, walk: .9, speed: 40, look: 1, talk: 1, emo: 'neutral' });
  const lit = p.light ? easeOut(t / 1.5) : 0;
  if (lit) s += `<path d="M240 -300 L340 -300 L384 900 L196 900Z" fill="#fff6d2" opacity="${f1(.4 * lit)}"/>` + glow(288, 600, 230, '#fff3c4', .7 * lit) + motes(t, 20, 6, '#fff6cf', 200, 380, 300, 880);
  s += person({ who: 'homem', x: 288, y: 870, s: 1.25, t, look: 0, lookY: p.light ? -1 : .8, emo: p.emo || (p.light ? 'peace' : 'sad'), pose: p.light ? 'open' : 'default' });
  return { svg: s, shots: [WIDE, FACE(288, 870, 1.25), { fx: 288, fy: 650, z: 1.3, sy: 490 }] };
};

S.eden = (t, p) => {
  let s = sky('ed', p.after ? [[0, '#8fb4d6'], [1, '#e4ecef']] : [[0, '#6ec8ff'], [1, '#e6f8ff']]);
  s += glow(470, 140, 210, '#fff3c4', .8) + clouds(t, 70, 5, 6, '#fff', .9, 5);
  s += mountains(540, '#9cc7d8', 6, 110) + haze(540, '#ffffff', .5);
  s += hills(560, ['#8ed06c', '#6cbb54', '#57a346']);
  s += `<path d="M-300 690 Q100 640 300 700 Q500 760 900 700 L900 742 Q500 802 300 742 Q100 682 -300 732Z" fill="${gVert('#5fb7e0', .2, -.15)}"/><path d="M-300 700 Q100 652 300 712 Q500 770 900 712" stroke="#d6f4ff" stroke-width="3" fill="none" opacity=".75"/>${[...Array(8)].map((_, i) => { const x = (rnd(i) * 900 + t * 30) % 900 - 150; return `<path d="M${f1(x)} ${f1(712 + Math.sin(x * .01) * 20)} l12 0" stroke="#fff" stroke-width="2" opacity=".7"/>`; }).join('')}`;
  s += tree(40, 700, 1.1, t, 'round', 1) + tree(525, 690, 1.1, t, 'round', 2) + tree(p.fig ? 460 : 150, 640, .8, t, p.fig ? 'fig' : 'round', 3) + tree(300, 610, .5, t, 'cypress', 4);
  if (p.fig) s += tree(110, 650, .9, t, 'fig', 7);
  s += deer(420, 660, .6, t, 1) + deer(170, 655, .5, t, 4) + rabbit(500, 880, 1, t) + rabbit(80, 900, .9, t, 3);
  s += flowers(t, 780, 30, 2) + grassTufts(t, 840, 44, 3);
  s += butterflies(t, 6, 4, 40, 520, 480, 220) + birds(t, 4, 5, 200) + motes(t, 12, 3, '#fffbe0', 0, 576, 300, 800);
  const garment = p.skins ? 'skins' : 'leaves';
  const lit = p.give ? easeOut(t / 1.5) : 0;
  if (p.give) s += `<path d="M200 -300 L376 -300 L424 900 L152 900Z" fill="#fff6d2" opacity="${f1(.35 * lit)}"/>` + glow(288, 520, 230, '#fff3c4', .8 * lit) + motes(t, 18, 9, '#fff6cf', 180, 400, 200, 860);
  if (p.give && !p.skins) { const k = easeOut((t - .5) / 2); s += `<g transform="translate(288,${f1(200 + k * 380)}) scale(1.5)" opacity="${f1(clamp(2 - k * 2, 0, 1) + .2)}">${ICONS.fur()}</g>`; }
  if (!p.noPeople) {
    const ea = p.ea || p.emo || (p.skins ? 'happy' : 'shame'), ee = p.ee || p.emo || ea;
    s += person({ who: 'adao', x: 220, y: 860, s: 1.2, t, garment, look: p.look ?? .5, lookY: p.lookUp ? -1 : undefined, pose: p.pose || (p.skins ? undefined : 'cover'), emo: ea });
    s += person({ who: 'eva', x: 360, y: 860, s: 1.2, t, garment, look: -(p.look ?? .5), lookY: p.lookUp ? -1 : undefined, pose: p.pose || (p.skins ? undefined : 'cover'), emo: ee, seed: 2 });
  }
  if (p.pick) { const k = (t * .5) % 1; s += figLeaf(240 + k * 40, 560 + k * 220, 1.6, k * 200, '#4f9b45'); }
  return { svg: s, shots: [WIDE, FACE(220, 860), FACE(360, 860), { fx: 290, fy: 660, z: 1.4, sy: 480 }] };
};

S.jordan = (t, p) => {
  let s = sky('jd', [[0, '#86ccf5'], [1, '#eef9ff']]);
  s += glow(130, 150, 170, '#fff3c4', .8) + clouds(t, 80, 4, 9, '#fff', .9, 5);
  s += mountains(520, '#b9a98a', 8, 120) + haze(520, '#fff4dc', .45);
  s += hills(520, ['#b7c98a', '#9fb877', '#86a264'], 2, { bare: 1 });
  s += water(t, 700, '#4a9ec4', '#c9f0ff', 4, .6);
  s += reeds(t, -100, 120, 720, 14, 2, 110) + reeds(t, 470, 700, 720, 14, 6, 110);
  s += `<path d="M-1100 840 Q288 800 1700 840 L1700 2800 L-1100 2800Z" fill="${gVert('#c9b07a')}"/>` + rocks(520, 880, .8) + rocks(40, 900, .7);
  s += crowd(t, 690, 4, 4, .7, { x0: 330, gap: 60, look: -1, emo: 'awe' });
  s += person({ who: 'joao', x: 170, y: 900, s: 1.25, t, look: 1, pose: 'point', talk: !!p.talk && SPEAK, emo: p.talk ? 'joy' : 'awe' });
  s += person({ who: 'jesus', x: 420, y: 900, s: 1.25, t, look: -.5, walk: p.walk ? .5 : 0, emo: 'peace' });
  if (p.lamb) s += `<g transform="translate(420,540) scale(${f1(pop(t / .6))})">${glow(0, -10, 80, '#fff3c4', .7)}${sheep(-4, 14, 1.2, t)}</g>`;
  return { svg: s, shots: [WIDE, FACE(170, 900, 1.25), FACE(420, 900, 1.25), { fx: 300, fy: 700, z: 1.3, sy: 500 }] };
};

S.cross = (t, p) => {
  let s = sky('cr', [[0, '#3a2a5e'], [.5, '#e98a5a'], [1, '#fbd59a']]);
  const k = p.dawn ? easeOut(t / 4) : .5;
  s += glow(288, 560, 300 + k * 120, '#fff0b0', .6 + .3 * k) + rays(288, 560, 16, 800, '#fff3c4', .08 + .08 * k, t);
  s += clouds(t, 120, 5, 12, '#f7c9a8', .7, 4) + birds(t, 3, 2, 240, '#3a2a3a');
  s += `<path d="M-1100 700 Q288 520 1700 700 L1700 2800 L-1100 2800Z" fill="${gVert('#6b4a3a', .1, -.3)}"/><path d="M-1100 760 Q288 640 1700 760 L1700 2800 L-1100 2800Z" fill="${gVert('#553828', .05, -.3)}"/>`;
  s += crossHill(288, 640, 1.3) + rocks(150, 700, .9) + rocks(430, 720, .8) + grassTufts(t, 760, 30, 5, '#4a3a2a') + motes(t, 16, 4, '#fff3c4', 100, 480, 200, 700);
  if (p.icon) s += `<g transform="translate(430,500) scale(${f1(pop(t / .5) * 1.5)})"><circle r="34" fill="#fff" opacity=".9"/>${ICONS[p.icon]()}</g>`;
  return { svg: s, shots: [WIDE, { fx: 288, fy: 440, z: 1.5, sy: 400 }, { fx: 288, fy: 560, z: 1.2, sy: 480 }] };
};

S.recap = (t, p) => {
  let s = sky('rc', [[0, '#1a1530'], [1, '#3a2c55']]);
  s += starsField(t, 120, 41, -300, 1300, .8) + motes(t, 20, 3, '#ffe7a0', 0, 576, 100, 900);
  const items = [['star', 'Estrelas'], ['steps', 'Enoque'], ['hebrew', 'Tebá'], ['eye', 'El Roi'], ['fur', 'Cobertura']];
  const n = p.upto ?? 5;
  items.forEach(([ic, lb], i) => {
    if (i >= n) return;
    const k = p.all ? easeOut((t - .25 * i) / .5) : (i < n - 1 ? 1 : pop(t / .6)); if (k <= 0) return;
    const x = i < 3 ? 148 + i * 140 : 218 + (i - 3) * 140, y = i < 3 ? 330 : 480;
    s += `<g transform="translate(${x},${y}) scale(${f1(k * .76)})">${glow(0, 0, 90, '#ffe7a0', .35)}<circle r="58" fill="${gRad('#fff8e6')}"/><circle r="58" fill="none" stroke="#d7a84a" stroke-width="4"/><g transform="scale(1.25)">${ICONS[ic]()}</g><text y="88" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="22" fill="#ffd84d">${lb}</text></g>`;
  });
  return { svg: s, shots: [WIDE, { fx: 288, fy: 400, z: 1.15, sy: 430 }] };
};

S.attributes = (t, p) => {
  let s = sky('at', [[0, '#14183a'], [1, '#3a2c55']]);
  s += starsField(t, 100, 51, -300, 1300, .8) + glow(288, 420, 260, '#ffe7a0', .35);
  const words = [['sparkle', 'CRIA'], ['heart', 'SE RELACIONA'], ['eye', 'VÊ'], ['ear', 'OUVE'], ['ark', 'PRESERVA'], ['gift', 'PROVÊ']];
  words.forEach(([ic, w], i) => {
    const k = easeOut((t - i * .55) / .4); if (k <= 0) return;
    const x = 160 + (i % 2) * 256, y = 215 + Math.floor(i / 2) * 135;
    s += `<g transform="translate(${x},${y}) scale(${f1(k)})"><circle r="40" fill="${gRad('#fff8e6')}"/><g>${ICONS[ic]()}</g><text y="66" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="22" fill="#fff" stroke="#000" stroke-width="4" paint-order="stroke">${w}</text></g>`;
  });
  return { svg: s, shots: [WIDE, { fx: 288, fy: 380, z: 1.12, sy: 420 }] };
};

S.comment = (t, p) => {
  // os 5 símbolos das descobertas + a pergunta (sem balão)
  let s = sky('cm', [[0, '#1a1530'], [1, '#3a2c55']]);
  s += starsField(t, 80, 61, -300, 1300, .7) + motes(t, 20, 7, '#ffe7a0', 0, 576, 100, 900) + glow(288, 330, 260, '#ffe7a0', .3);
  const items = [['star', 'Estrelas'], ['steps', 'Enoque'], ['hebrew', 'Tebá'], ['eye', 'El Roi'], ['fur', 'Cobertura']];
  items.forEach(([ic, lb], i) => {
    const k = pop((t - .15 * i) / .5); if (k <= 0) return;
    const x = 288 + (i - 2) * 92, y = 300 + Math.sin(t * 1.6 + i) * 4;
    s += `<g transform="translate(${x},${f1(y)}) scale(${f1(k * .62)})">${glow(0, 0, 80, '#ffe7a0', .3)}<circle r="58" fill="${gRad('#fff8e6')}"/><circle r="58" fill="none" stroke="#d7a84a" stroke-width="5"/><g transform="scale(1.25)">${ICONS[ic]().replace(/#ffd84d/g, ic === 'hebrew' ? '#8a1c2b' : '#e0a820')}</g><text y="92" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="24" fill="#ffd84d">${lb}</text></g>`;
  });
  const kq = easeOut((t - .9) / .6);
  const ov = `<g opacity="${f1(kq)}" text-anchor="middle" font-family="Cinzel, 'Liberation Serif', serif" font-weight="900" font-size="34" stroke="#1a0d00" stroke-width="7" stroke-linejoin="round" paint-order="stroke" fill="#fffaf0"><text x="288" y="${f1(430 + (1 - kq) * 10)}">Qual delas você</text><text x="288" y="${f1(472 + (1 - kq) * 10)}">nunca <tspan fill="#ffd84d">percebeu</tspan>?</text></g>`;
  return { svg: s, ov, shots: [WIDE, { fx: 288, fy: 400, z: 1.06, sy: 420 }] };
};

// Fechamento padrão do canal: Bíblia aberta no centro, luz de dentro para fora, "Palavra Ensinada"
S.end = (t, p) => {
  let s = sky('ee', [[0, '#0e0906'], [1, '#24160c']]);
  s += glow(288, 470, 520, '#5a3a10', .5);
  const k = easeOut(t / 1.6);
  s += bibleBook(288, 520, 1.25, t, 0, 0, '', .5 + .5 * k);
  const k2 = easeOut((t - .6) / 1.2);
  let ov = `<g opacity="${f1(k2)}" text-anchor="middle" font-family="Liberation Serif, Times New Roman, serif" font-weight="bold" stroke="#3a2000" stroke-width="3" paint-order="stroke"><text x="288" y="${f1(268 - (1 - k2) * 14)}" font-size="60" fill="#ffd84d">Palavra</text><text x="288" y="${f1(330 - (1 - k2) * 14)}" font-size="60" fill="#ffd84d">Ensinada</text></g>`;
  return { svg: s, ov, shots: [{ fx: 288, fy: 512, z: 1, sy: 512 }, { fx: 288, fy: 500, z: 1.04, sy: 500 }] };
};
