// ===== Cenas. Cada cena: (t = tempo local, p = parâmetros) => { svg, shots }
// shots: lista de enquadramentos {fx, fy, z, sy}: o ponto (fx,fy) do mundo vai para (288, sy) na tela, com zoom z.
const WIDE = { fx: 288, fy: 512, z: 1, sy: 512 };
const S = {};

S.bibleIntro = (t, p) => {
  let s = sky('bi', [[0, '#1d1410'], [1, '#3a2418']]);
  s += `<rect x="-400" y="640" width="1400" height="800" fill="#5a3a22"/><rect x="-400" y="640" width="1400" height="10" fill="#7a5130"/>`;
  for (let i = 0; i < 18; i++) s += `<line x1="-400" y1="${660 + i * 22}" x2="1000" y2="${660 + i * 22}" stroke="#4a2f1a" stroke-width="2"/>`;
  s += candle(90, 640, 1.2, t) + candle(480, 640, 1, t + 1);
  for (let i = 0; i < 14; i++) { const k = (t * .08 + rnd(i)) % 1; s += `<circle cx="${f1(80 + rnd(i * 3) * 420)}" cy="${f1(640 - k * 520)}" r="${f1(1 + rnd(i) * 2)}" fill="#ffe7a0" opacity="${f1((1 - k) * .7)}"/>`; }
  const turn = p.turn ? ((t * .45) % 1) : 0;
  s += bibleBook(288, 560, 1.35, t, p.glow ?? .7, turn, p.label || 'GÊNESIS');
  if (p.lens) { const lx = 230 + Math.sin(t * .7) * 70, ly = 520 + Math.cos(t * .5) * 30; s += `<g transform="translate(${f1(lx)},${f1(ly)})"><circle r="52" fill="#ffffff" opacity=".18" stroke="#c9a14a" stroke-width="9"/><rect x="34" y="34" width="16" height="70" rx="7" fill="#5a3a22" transform="rotate(-45 42 42)"/></g>`; }
  return { svg: s, shots: [WIDE, { fx: 288, fy: 520, z: 1.35, sy: 470 }, { fx: 230, fy: 520, z: 1.7, sy: 430 }, { fx: 330, fy: 540, z: 1.2, sy: 500 }] };
};

S.stars = (t, p) => {
  let s = sky('st', [[0, '#05061a'], [.5, '#14184a'], [1, '#2c2a5e']]);
  s += `<g opacity=".55"><ellipse cx="300" cy="200" rx="520" ry="80" fill="#6b5fb5" opacity=".25" transform="rotate(-25 300 200)"/><ellipse cx="300" cy="200" rx="420" ry="40" fill="#b9a8ff" opacity=".18" transform="rotate(-25 300 200)"/></g>`;
  s += starsField(t, 220, 3, -300, 760);
  for (let i = 0; i < 12; i++) s += starShape(-100 + rnd(i * 7) * 780, -100 + rnd(i * 13) * 620, 4 + rnd(i) * 5, '#fff7d0', 0, f1(.6 + .4 * Math.sin(t * 1.3 + i)));
  if (p.sweep) { const k = clamp(t / 6, 0, 1); for (let i = 0; i < 60; i++) { const a = rnd(i * 5) * 6.28, r = rnd(i * 2) * 500 * easeOut(k); s += `<circle cx="${f1(288 + Math.cos(a) * r)}" cy="${f1(300 + Math.sin(a) * r * .6)}" r="2.2" fill="#fff6c9" opacity="${f1(k)}"/>`; } }
  s += hills(700, ['#1b2140', '#141832', '#0d1024']);
  s += tree(60, 760, .9, t, 'cypress', 2) + tree(520, 740, 1, t, 'cypress', 3);
  if (p.who !== 'none') s += person({ who: p.who || 'homem', x: p.px || 300, y: 790, s: 1.2, t, look: p.look ?? .3, lookY: -1, pose: p.pose || 'default' });
  if (p.heart) { const k = easeOut(t / 1.5), hx = p.px || 300, hb = Math.sin(t * 2.4) * 4; s += glow(hx, 600, 190 * k, '#ffd27a', .55); s += `<g transform="translate(${hx},${f1(478 + hb)}) scale(${f1(k * 1.2)})">${ICONS.heart()}</g>`; }
  const face = { fx: p.px || 300, fy: 790 - 210, z: 1.8, sy: 440 };
  return { svg: s, shots: [WIDE, { fx: 288, fy: 300, z: 1.25, sy: 400 }, face, { fx: 288, fy: 600, z: 1.3, sy: 512 }] };
};

S.luminaries = (t, p) => {
  // metade dia (esquerda) e metade noite (direita), sem nomes "sol"/"lua" quando p.noNames
  let s = `<defs><linearGradient id="lmD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb4ff"/><stop offset="1" stop-color="#cfeaff"/></linearGradient><linearGradient id="lmN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d2a"/><stop offset="1" stop-color="#2b2f63"/></linearGradient></defs>`;
  s += `<rect x="-400" y="-400" width="688" height="1600" fill="url(#lmD)"/><rect x="288" y="-400" width="700" height="1600" fill="url(#lmN)"/>`;
  s += `<clipPath id="cN"><rect x="288" y="-400" width="700" height="1600"/></clipPath><g clip-path="url(#cN)">${starsField(t, 80, 9, -300, 700)}</g>`;
  s += clouds(t, 120, 4, 2, '#fff', .9, 8, .8).replace(/<g /g, '<g clip-path="url(#cD)" ') ;
  s += `<clipPath id="cD"><rect x="-400" y="-400" width="688" height="1600"/></clipPath>`;
  const sy = 260 + Math.sin(t * .6) * 6;
  s += glow(150, sy, 170, '#fff2a8', .9) + rays(150, sy, 12, 130, '#ffd84d', .25, t) + `<circle cx="150" cy="${f1(sy)}" r="62" fill="#ffc531"/><circle cx="150" cy="${f1(sy)}" r="52" fill="#ffdb4d"/>`;
  s += glow(430, 270, 120, '#e9f0ff', .5) + `<circle cx="430" cy="270" r="40" fill="#f3efd6"/><circle cx="416" cy="258" r="7" fill="#d8d2b4"/><circle cx="440" cy="285" r="5" fill="#d8d2b4"/><circle cx="447" cy="255" r="4" fill="#d8d2b4"/>`;
  s += hills(690, ['#5aa04a', '#3f8a3a', '#2e6e2c']);
  s += `<rect x="288" y="600" width="700" height="800" fill="#0a0d2a" opacity=".45"/>`;
  s += birds(t, 4, 1, 380).replace(/<path /g, '<path clip-path="url(#cD)" ');
  s += sheep(120, 780, 1, t) + sheep(200, 800, .9, t, 2) + tree(60, 740, .8, t, 'round', 3) + tree(510, 750, .8, t, 'round', 4);
  if (p.labels) {
    const k = easeOut(t / .8);
    s += `<g opacity="${f1(k)}" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" text-anchor="middle"><text x="150" y="372" font-size="22" fill="#5a3a00">LUZEIRO MAIOR</text><text x="430" y="352" font-size="22" fill="#f3efd6">LUZEIRO MENOR</text></g>`;
  }
  return { svg: s, shots: [WIDE, { fx: 150, fy: 280, z: 1.5, sy: 380 }, { fx: 430, fy: 280, z: 1.5, sy: 380 }, { fx: 288, fy: 420, z: 1.15, sy: 460 }] };
};

S.idols = (t, p) => {
  let s = sky('id', [[0, '#e9a65a'], [1, '#f6d7a0']]);
  s += glow(288, 200, 260, '#fff0b0', .7);
  s += dunes(t, 640, ['#d9a35c', '#c88d48', '#b57a3a']);
  s += pyramid(60, 640, .9, '#d8b46a') + pyramid(520, 650, .7, '#cfa75c');
  // templo e ídolo-disco solar
  s += `<g transform="translate(288,640)"><rect x="-150" y="-30" width="300" height="30" fill="#c9b08a"/><rect x="-170" y="-10" width="340" height="14" fill="#b39a74"/>${[-120, -60, 60, 120].map(x => `<rect x="${x - 12}" y="-250" width="24" height="220" fill="#e3d2b0"/><rect x="${x - 16}" y="-256" width="32" height="10" fill="#c9b08a"/>`).join('')}<rect x="-170" y="-280" width="340" height="28" fill="#c9b08a"/><path d="M-180 -280 L0 -330 L180 -280Z" fill="#b39a74"/>`;
  const fall = p.fall ? easeOut(t / 1.4) : 0;
  s += `<g transform="translate(0,${f1(-100 + fall * 70)}) rotate(${f1(fall * 25)})" opacity="${f1(1 - fall * .55)}"><rect x="-22" y="-10" width="44" height="80" fill="#b8862f"/>${rays(0, -50, 12, 66, '#f0c04a', .9, t, .07)}<circle cx="0" cy="-50" r="40" fill="#f0c04a"/><circle cx="0" cy="-50" r="28" fill="#ffd866"/></g></g>`;
  if (p.fall) s += `<g transform="translate(288,450) scale(${f1(pop(t / .5) * 2.4)})">${`<path d="M-24 -26 L24 22 M24 -26 L-24 22" stroke="#d64545" stroke-width="7" stroke-linecap="round"/>`}</g>`;
  // adoradores ajoelhados
  s += crowd(t, 790, 5, 3, 1, { x0: 50, gap: 115, pose: p.fall ? 'default' : 'bow', look: p.fall ? 0 : 0, }).replace(/lookY/g, '');
  return { svg: s, shots: [WIDE, { fx: 288, fy: 440, z: 1.5, sy: 380 }, { fx: 170, fy: 620, z: 1.6, sy: 470 }, { fx: 400, fy: 560, z: 1.3, sy: 470 }] };
};

S.galaxy = (t, p) => {
  let s = sky('gx', [[0, '#020210'], [1, '#0d0b2a']]);
  s += starsField(t, 260, 11, -300, 1300, .9);
  const z = 1 + t * .04;
  s += `<g transform="translate(288,420) scale(${f1(z)}) translate(-288,-420)">`;
  const gals = [[288, 380, 1.4, '#c9b6ff'], [110, 180, .6, '#ffc9a8'], [470, 560, .7, '#a8e1ff'], [90, 700, .5, '#ffe0f0'], [480, 160, .45, '#d6ffd0']];
  gals.forEach(([x, y, sc, c], j) => {
    let g = glow(x, y, 120 * sc, c, .5);
    for (let a = 0; a < 2; a++) for (let i = 0; i < 70; i++) { const r = i * 1.6 * sc, th = i * .17 + a * Math.PI + t * .15 * (j % 2 ? -1 : 1); g += `<circle cx="${f1(x + Math.cos(th) * r)}" cy="${f1(y + Math.sin(th) * r * .55)}" r="${f1(1.6 * sc + rnd(i) * 1.2)}" fill="${c}" opacity="${f1(1 - i / 80)}"/>`; }
    g += `<circle cx="${x}" cy="${y}" r="${f1(9 * sc)}" fill="#fffbe6"/>`;
    s += g;
  });
  s += `</g>`;
  let ov = '';
  if (p.count) ov += `<text x="288" y="${f1(250)}" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="34" fill="#fff" opacity="${f1(easeOut(t))}">BILHÕES DE GALÁXIAS</text>`;
  return { svg: s, ov, shots: [WIDE, { fx: 288, fy: 380, z: 1.5, sy: 430 }, { fx: 200, fy: 300, z: 1.25, sy: 450 }] };
};

S.david = (t, p) => {
  let s = sky('dv', [[0, '#070a24'], [.6, '#1c2356'], [1, '#2f3a70']]);
  s += starsField(t, 200, 21, -300, 720);
  s += glow(470, 170, 90, '#e9f0ff', .5) + `<circle cx="470" cy="170" r="26" fill="#f3efd6"/>`;
  s += hills(640, ['#23305a', '#1b2648', '#131b36']);
  s += sheep(110, 800, 1, t) + sheep(450, 815, 1, t, 4) + sheep(520, 790, .9, t, 7);
  s += grassTufts(t, 780, 30, 4, '#2c3d5a');
  s += person({ who: 'davi', x: 288, y: 800, s: 1.25, t, look: .4, lookY: -1.2, pose: p.pose || 'default', harp: p.harp !== false });
  return { svg: s, shots: [WIDE, { fx: 288, fy: 560, z: 1.8, sy: 430 }, { fx: 288, fy: 300, z: 1.2, sy: 380 }, { fx: 288, fy: 650, z: 1.35, sy: 512 }] };
};

S.scroll = (t, p) => {
  let s = sky('sc', [[0, '#2a1d14'], [1, '#4a3322']]);
  s += candle(70, 900, 1, t) + candle(510, 910, .9, t + 2);
  s += `<g transform="translate(288,480)"><rect x="-210" y="-330" width="420" height="680" fill="#f1e2bf"/><rect x="-210" y="-330" width="420" height="680" fill="none" stroke="#c9a26b" stroke-width="4"/><rect x="-232" y="-356" width="464" height="34" rx="17" fill="#8b5a2b"/><rect x="-232" y="342" width="464" height="34" rx="17" fill="#8b5a2b"/></g>`;
  const rows = p.rows || [];
  rows.forEach((r, i) => {
    const k = easeOut((t - i * .7) / .6);
    if (k <= 0) return;
    const y = 215 + i * 82;
    const hl = r.hl;
    s += `<g opacity="${f1(k)}" font-family="Liberation Serif, Times New Roman, serif" text-anchor="middle">`;
    if (hl) s += `<rect x="86" y="${y - 40}" width="404" height="74" rx="10" fill="#ffe7a0" opacity=".8"/>`;
    s += `<text x="288" y="${y}" font-size="32" fill="#3a2414" font-weight="bold">${r.a}</text><text x="288" y="${y + 25}" font-size="21" fill="${hl ? '#7a2131' : '#6b4a2a'}" font-style="italic">${r.b}</text></g>`;
  });
  if (p.walker) s += person({ who: 'enoque', x: 288 + Math.sin(t * .5) * 120, y: 880, s: .9, t, walk: .8, look: Math.cos(t * .5) > 0 ? 1 : -1, flip: Math.cos(t * .5) < 0 });
  return { svg: s, shots: [WIDE, { fx: 288, fy: 330, z: 1.35, sy: 380 }, { fx: 288, fy: 470, z: 1.3, sy: 450 }] };
};

S.enoch = (t, p) => {
  let s = sky('en', [[0, '#7ec4f2'], [.6, '#f7d9a2'], [1, '#f2b47a']]);
  s += glow(288, 140, 320, '#fff3c4', .9) + rays(288, 140, 16, 700, '#fff3c4', .12, t);
  s += clouds(t, 80, 5, 7, '#fff', .8, 5);
  s += hills(560, ['#9cc979', '#7fb35f', '#64994a']);
  // caminho sinuoso
  s += `<path d="M260 1100 Q180 900 300 800 Q420 700 300 620 Q240 585 290 560" stroke="#e7cf9b" stroke-width="60" fill="none" stroke-linecap="round" opacity=".95"/><path d="M260 1100 Q180 900 300 800 Q420 700 300 620 Q240 585 290 560" stroke="#d8b97c" stroke-width="4" fill="none" stroke-dasharray="4 14"/>`;
  s += tree(70, 700, .8, t, 'round', 5) + tree(500, 680, .7, t, 'cypress', 2) + tree(530, 860, 1, t, 'round', 6);
  s += flowers(t, 800, 18, 3) + grassTufts(t, 860, 30, 9, '#4d8a3a');
  s += butterflies(t, 4, 2, 60, 600, 460, 180) + birds(t, 5, 3, 260);
  const taken = p.taken ? clamp(t / 4, 0, 1) : 0;
  if (p.taken) s += `<path d="M230 -300 L346 -300 L380 ${f1(820)} L196 ${f1(820)}Z" fill="#fff8de" opacity="${f1(.15 + .35 * easeOut(t / 2))}"/>` + glow(288, 640, 200, '#fff6d2', .7 * easeOut(t / 2));
  const x = p.taken ? 288 : 288 + Math.sin(t * .35) * 18;
  s += person({ who: 'enoque', x, y: 800 - taken * 40, s: 1.25, t, walk: p.taken ? 0 : .9, look: p.taken ? 0 : .2, lookY: p.taken ? -1.2 : 0, pose: p.taken ? 'raise' : (p.pose || 'default'), op: f1(1 - taken * .85) });
  if (p.steps) { for (let i = 0; i < 8; i++) { const k = clamp(t * 1.5 - i * .4, 0, 1); if (k > 0) s += `<g transform="translate(${f1(260 + (i % 2) * 40)},${f1(990 - i * 50)}) scale(.6)" opacity="${f1(k * .8)}">${ICONS.steps()}</g>`; } }
  let ov = '';
  if (p.counter) { const n = Math.min(300, Math.floor(easeOut(t / 3) * 300)); ov += `<g font-family="Liberation Sans, Arial" font-weight="bold" text-anchor="middle"><text x="288" y="270" font-size="96" fill="#fff" stroke="#7a4e1c" stroke-width="5" paint-order="stroke">${n}</text><text x="288" y="312" font-size="30" fill="#fff" stroke="#7a4e1c" stroke-width="5" paint-order="stroke">ANOS COM DEUS</text></g>`; }
  if (p.tasks) {
    const items = ['crown', 'scroll', 'tag', 'people'];
    items.forEach((ic, i) => { const a = t * .6 + i * Math.PI / 2; const k = easeOut((t - i * .3) / .5); s += `<g transform="translate(${f1(288 + Math.cos(a) * 150)},${f1(560 + Math.sin(a) * 60)}) scale(${f1(k * 1.1)})"><circle r="30" fill="#fff" opacity=".85"/>${ICONS[ic]()}</g>`; });
  }
  return { svg: s, ov, shots: [WIDE, { fx: x, fy: 800 - 1.25 * 175, z: 1.8, sy: 430 }, { fx: 288, fy: 640, z: 1.3, sy: 512 }, { fx: 288, fy: 420, z: 1.15, sy: 420 }] };
};

S.ark = (t, p) => {
  const calm = p.calm;
  let s = calm ? sky('ak', [[0, '#7ec4f2'], [1, '#dff1ff']]) : sky('ak', [[0, '#2a3140'], [1, '#56657a']]);
  if (calm) s += glow(460, 160, 200, '#fff3c4', .9) + `<circle cx="460" cy="160" r="44" fill="#ffd84d"/>` + clouds(t, 90, 4, 3, '#fff', .9, 6);
  else { s += clouds(t, 40, 6, 5, '#3b4454', .95, 12, 1.4); for (let i = 0; i < 90; i++) { const x = rnd(i) * 1000 - 200, y = ((rnd(i * 3) * 1100 + t * 600) % 1100) - 100; s += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - 6)}" y2="${f1(y + 22)}" stroke="#b8c7da" stroke-width="1.6" opacity=".55"/>`; } }
  if (calm) s += `<path d="M-200 640 Q60 520 200 600 L320 640Z" fill="#6b8f5a"/>`;
  s += ark(288, 650, 1.15, t, calm ? .4 : 1.2);
  if (p.noah) s += `<g transform="translate(288,${f1(650 + Math.sin(t * 1.4) * 4 * (calm ? .4 : 1.2))}) rotate(${f1(Math.sin(t * 1.1) * 2.5 * (calm ? .4 : 1.2))}) scale(1.15)"><clipPath id="nw"><rect x="-26" y="-118" width="46" height="42"/></clipPath><rect x="-26" y="-118" width="46" height="42" fill="#2a1a0a"/><g clip-path="url(#nw)">${person({ who: 'noe', x: -3, y: -12, s: .5, t, look: .5, lookY: -1, pose: calm ? 'raise' : 'default' })}</g><rect x="-26" y="-118" width="46" height="42" fill="none" stroke="#5a3a1c" stroke-width="3"/></g>`;
  s += water(t, 655, calm ? '#3d8fc4' : '#2c4b66', calm ? '#bfe6ff' : '#8fb0c8', calm ? 5 : 12, calm ? .6 : 1.6);
  if (p.dove) s += dove(150 + t * 25, 300 + Math.sin(t) * 20, 1.4, t);
  s += birds(t, calm ? 3 : 0, 4, 230, '#334');
  return { svg: s, shots: [WIDE, { fx: 288, fy: 560, z: 1.5, sy: 450 }, { fx: 296, fy: 520, z: 2.1, sy: 420 }, { fx: 288, fy: 420, z: 1.2, sy: 430 }] };
};

S.hebrew = (t, p) => {
  let s = sky('hb', [[0, '#1a1530'], [1, '#3a2c55']]);
  s += starsField(t, 60, 31, -300, 1200, .7);
  const k = easeOut(t / .9);
  s += glow(288, 300, 200, '#ffe7a0', .5 * k);
  s += `<g text-anchor="middle" opacity="${f1(k)}"><text x="288" y="${f1(330 - (1 - k) * 30)}" font-family="DejaVu Sans, sans-serif" font-size="120" font-weight="bold" fill="#ffd84d">תֵּבָה</text><text x="288" y="390" font-family="Liberation Serif, Times New Roman" font-size="40" font-style="italic" fill="#f3e6c8">Tebá</text></g>`;
  const k2 = easeOut((t - 1.2) / .8), k3 = easeOut((t - 2) / .8);
  s += `<g opacity="${f1(k2)}" transform="translate(150,560)"><circle r="92" fill="#2c4b66"/><clipPath id="hc1"><circle r="88"/></clipPath><g clip-path="url(#hc1)">${ark(0, 22, .42, t, .5)}${water(t, 24, '#2c6b96', '#9fd0f0', 3, 1).replace(/-400/g, '-200').replace(new RegExp(`width="${W + 800}"`), 'width="400"')}</g><text y="130" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="22" fill="#fff">ARCA · Gn 6</text></g>`;
  s += `<g opacity="${f1(k3)}" transform="translate(426,560)"><circle r="92" fill="#2f6f74"/><clipPath id="hc2"><circle r="88"/></clipPath><g clip-path="url(#hc2)">${reeds(t, -90, 90, 30, 12, 5, 80)}${water(t, 20, '#3a8a92', '#b9ecef', 3, 1).replace(/-400/g, '-200').replace(new RegExp(`width="${W + 800}"`), 'width="400"')}${basket(0, 24, .9, t)}</g><text y="130" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="22" fill="#fff">CESTO · Êx 2</text></g>`;
  if (k3 > 0) s += `<path d="M242 560 Q288 ${f1(520 - 10 * Math.sin(t * 2))} 334 560" stroke="#ffd84d" stroke-width="4" fill="none" stroke-dasharray="${f1(120 * k3)} 200"/>`;
  return { svg: s, shots: [WIDE, { fx: 288, fy: 330, z: 1.4, sy: 340 }, { fx: 288, fy: 560, z: 1.2, sy: 500 }] };
};

S.nile = (t, p) => {
  let s = sky('nl', [[0, '#8fd0f5'], [.7, '#fbe3b5'], [1, '#f2c98a']]);
  s += glow(470, 160, 160, '#fff3c4', .8) + `<circle cx="470" cy="160" r="38" fill="#ffd84d"/>` + clouds(t, 80, 4, 8, '#fff', .8, 5);
  s += pyramid(120, 520, .8) + pyramid(230, 525, .5, '#cfa75c');
  if (p.palace) s += `<g transform="translate(430,520)"><rect x="-90" y="-120" width="180" height="120" fill="#e3d2b0"/>${[-70, -35, 0, 35, 70].map(x => `<rect x="${x - 7}" y="-110" width="14" height="110" fill="#c9b08a"/>`).join('')}<rect x="-100" y="-132" width="200" height="16" fill="#b39a74"/></g>`;
  s += `<path d="M-400 520 Q288 500 1000 520 L1000 600 L-400 600Z" fill="#c9b07a"/>`;
  s += tree(40, 560, .8, t, 'palm', 1) + tree(540, 570, .7, t, 'palm', 2);
  s += water(t, 590, '#3a8a92', '#b9ecef', 5, .6);
  s += reeds(t, -100, 200, 760, 26, 3, 160) + reeds(t, 400, 700, 770, 22, 7, 150);
  s += birds(t, 3, 9, 260, '#3a3a3a');
  const bx = p.float ? 300 + Math.sin(t * .3) * 30 : 330;
  if (p.mother) s += person({ who: 'joquebede', x: 200, y: 820, s: 1.2, t, look: .8, lookY: .6, pose: p.release ? 'offer' : 'hold', sad: true });
  s += basket(bx, p.mother ? 790 : 760, 1.4, t);
  s += reeds(t, 230, 420, 880, 12, 11, 110);
  return { svg: s, shots: [WIDE, { fx: bx, fy: 740, z: 1.9, sy: 440 }, { fx: 200, fy: 820 - 210, z: 1.8, sy: 430 }, { fx: 288, fy: 600, z: 1.25, sy: 470 }] };
};

S.exodusCrowd = (t, p) => {
  let s = sky('ex', [[0, '#f2b47a'], [1, '#fbe3b5']]);
  s += glow(100, 220, 200, '#fff3c4', .8) + `<circle cx="100" cy="220" r="40" fill="#ffd27a"/>`;
  s += dunes(t, 620, ['#e0b56a', '#d4a258', '#c38f48']);
  s += crowd(t, 760, 6, 1, .7, { x0: -120, gap: 70, walk: .8, speed: 14, look: 1 });
  s += crowd(t, 830, 6, 5, .85, { x0: -160, gap: 85, walk: .8, speed: 16, look: 1 });
  s += person({ who: 'moises', x: 400, y: 840, s: 1.2, t, walk: .7, look: 1, pose: 'default' });
  return { svg: s, shots: [WIDE, { fx: 400, fy: 630, z: 1.7, sy: 430 }, { fx: 200, fy: 650, z: 1.3, sy: 480 }] };
};

S.tinyBig = (t, p) => {
  // semente pequena → algo grande (aplicação)
  let s = sky('tb', [[0, '#9fd8ff'], [1, '#e9f7ff']]);
  s += clouds(t, 100, 5, 4, '#fff', .9, 6) + hills(620, ['#8cc56b', '#6fae55', '#55943f']);
  const k = clamp(t / 5, 0, 1);
  s += tree(288, 800, .35 + 1.3 * easeOut(k), t, 'round', 3);
  s += basket(120, 860, .9, t, true, false);
  s += flowers(t, 820, 22, 5) + butterflies(t, 3, 3, 100, 520, 380, 200);
  return { svg: s, shots: [WIDE, { fx: 288, fy: 600, z: 1.4, sy: 470 }, { fx: 150, fy: 800, z: 1.6, sy: 480 }] };
};

S.tent = (t, p) => {
  let s = sky('tn', [[0, '#f0b070'], [1, '#fbe3b5']]);
  s += glow(470, 200, 170, '#fff3c4', .8);
  s += dunes(t, 600, ['#e0b56a', '#d4a258', '#c38f48']);
  s += tent(160, 720, 1.4) + tree(520, 700, .8, t, 'palm', 3) + sheep(500, 820, .9, t, 1);
  s += person({ who: 'sarai', x: 230, y: 830, s: 1.2, t, look: 1, pose: 'point', talk: true });
  s += person({ who: 'agar', x: 420, y: 840, s: 1.2, t, look: -1, pose: 'belly', sad: true, walk: p.leave ? .6 : 0, flip: !!p.leave });
  return { svg: s, shots: [WIDE, { fx: 230, fy: 620, z: 1.8, sy: 430 }, { fx: 420, fy: 630, z: 1.8, sy: 430 }, { fx: 330, fy: 640, z: 1.35, sy: 480 }] };
};

S.hagar = (t, p) => {
  let s = sky('hg', [[0, '#f5a35a'], [.6, '#fbd59a'], [1, '#fbe8c4']]);
  s += glow(288, 260, 260, '#fff0b0', .8) + `<circle cx="288" cy="260" r="54" fill="#ffd27a" opacity=".9"/>`;
  s += `<path d="M-400 560 L-200 470 L-60 530 L80 440 L220 520 L360 450 L520 520 L700 460 L1000 560Z" fill="#c98e6a" opacity=".55"/>`;
  s += dunes(t, 580, ['#e8bd74', '#dcaa60', '#cd9a50', '#bf8a44']);
  s += acacia(-10, 700, .9, t) + acacia(560, 690, .7, t + 2) + rocks(60, 760, 1) + rocks(500, 790, .8) + rocks(330, 900, .7);
  s += `<g opacity=".7">${[0, 1, 2].map(i => { const x = ((t * 6 + i * 26) % 700) - 60; return `<g transform="translate(${f1(x)},556) scale(.35)"><ellipse cx="0" cy="-40" rx="30" ry="16" fill="#8a5a32"/><circle cx="-6" cy="-58" r="12" fill="#8a5a32"/><path d="M26 -46 Q44 -70 40 -86" stroke="#8a5a32" stroke-width="9" fill="none"/><rect x="-24" y="-30" width="5" height="30" fill="#7a4a28"/><rect x="18" y="-30" width="5" height="30" fill="#7a4a28"/></g>`; }).join('')}</g>`;
  for (let i = 0; i < 4; i++) { const k = (t * .15 + i * .25) % 1; s += `<path d="M${-50 + i * 160} ${f1(560 - k * 40)} q20 -6 40 0 t40 0" stroke="#fff" stroke-width="2" fill="none" opacity="${f1(.25 * (1 - k))}"/>`; }
  s += birds(t, 3, 12, 300, '#6b4a2a');
  if (p.spring) { s += tree(120, 760, .9, t, 'palm', 1) + tree(470, 750, .8, t, 'palm', 2) + spring(288, 830, 1.1, t); }
  const flee = p.flee;
  const hx = flee ? 140 + (t * 22) % 300 : (p.spring ? 190 : 288);
  if (p.angel) { const k = easeOut(t / 1.2); s += `<g opacity="${f1(k)}">` + person({ who: 'anjo', x: 400, y: 810, s: 1.22, t, look: -1, pose: 'open', talk: !!p.talk }) + `</g>`; }
  s += person({ who: 'agar', x: hx, y: 820, s: 1.2, t, walk: flee ? .7 : 0, look: p.angel ? 1 : (p.lookUp ? 0 : .4), lookY: p.lookUp ? -1 : 0, pose: p.pose || (p.sit ? 'sit' : 'belly'), sad: !!p.sad, closed: !!p.closed });
  let ov = '';
  if (p.names) {
    const k = easeOut(t / .8);
    ov += `<g opacity="${f1(k)}" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold">${p.names.map((n, i) => `<g transform="translate(${f1(p.names.length > 1 ? 150 + i * 276 : 288)},${f1(240)})"><circle r="52" fill="#fff8e6" stroke="#d7a84a" stroke-width="4"/><g transform="translate(0,-8) scale(1.3)">${ICONS[n.ic]()}</g><text y="86" font-size="30" fill="#fff" stroke="#3a1a00" stroke-width="5" paint-order="stroke">${n.a}</text><text y="118" font-size="22" fill="#ffd84d" stroke="#3a1a00" stroke-width="4" paint-order="stroke">“${n.b}”</text></g>`).join('')}</g>`;
  }
  return { svg: s, ov, shots: [WIDE, { fx: hx, fy: 820 - 210, z: 1.85, sy: 430 }, { fx: 330, fy: 640, z: 1.35, sy: 470 }, p.angel ? { fx: 400, fy: 600, z: 1.8, sy: 430 } : { fx: 288, fy: 400, z: 1.2, sy: 420 }] };
};

S.crowdAlone = (t, p) => {
  let s = sky('ca', [[0, '#a7b6c8'], [1, '#d8dee6']]);
  s += `<g fill="#c5b8a2">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-120 + i * 140}" y="${380 - rnd(i) * 120}" width="120" height="400"/><rect x="${-100 + i * 140}" y="${420 - rnd(i) * 120}" width="22" height="30" fill="#7a6a52"/>`).join('')}</g>`;
  s += `<g>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-110 + i * 140}" y="${f1(560 - rnd(i) * 60)}" width="40" height="70" rx="20" fill="#6b5640"/><path d="M${-130 + i * 140} ${f1(500 - rnd(i) * 120)} l120 0 l-10 26 l-100 0Z" fill="${['#b5523b', '#3d6f8a', '#c9a14a'][i % 3]}"/>`).join('')}</g>` + tree(30, 740, .7, t, 'palm', 1) + tree(540, 740, .6, t, 'palm', 2) + birds(t, 4, 7, 200, '#4a4a55');
  s += `<rect x="-400" y="740" width="1400" height="700" fill="#b9a688"/>${[...Array(12)].map((_, i) => `<line x1="${-200 + i * 90}" y1="740" x2="${-260 + i * 110}" y2="1100" stroke="#a8946f" stroke-width="2"/>`).join('')}`;
  s += crowd(t, 800, 7, 2, 1, { x0: -200, gap: 110, walk: .9, speed: 40, look: 1 });
  const lit = p.light ? easeOut(t / 1.5) : 0;
  if (lit) s += `<path d="M240 -300 L340 -300 L380 900 L200 900Z" fill="#fff6d2" opacity="${f1(.4 * lit)}"/>` + glow(288, 600, 230, '#fff3c4', .7 * lit);
  s += person({ who: 'homem', x: 288, y: 870, s: 1.25, t, look: 0, lookY: p.light ? -1 : .5, sad: !p.light, pose: p.light ? 'open' : 'default' });
  return { svg: s, shots: [WIDE, { fx: 288, fy: 870 - 220, z: 1.8, sy: 430 }, { fx: 288, fy: 650, z: 1.3, sy: 490 }] };
};

S.eden = (t, p) => {
  let s = sky('ed', p.after ? [[0, '#8fb4d6'], [1, '#e4ecef']] : [[0, '#7fd0ff'], [1, '#e4f7ff']]);
  s += glow(470, 140, 200, '#fff3c4', .8) + clouds(t, 70, 5, 6, '#fff', .9, 5);
  s += hills(560, ['#8ed06c', '#6cbb54', '#57a346']);
  s += `<path d="M-300 690 Q100 640 300 700 Q500 760 900 700 L900 740 Q500 800 300 740 Q100 680 -300 730Z" fill="#5fb7e0"/><path d="M-300 700 Q100 652 300 712" stroke="#c9f0ff" stroke-width="3" fill="none" opacity=".7"/>`;
  s += tree(40, 700, 1.1, t, 'round', 1) + tree(520, 690, 1.1, t, 'round', 2) + tree(p.fig ? 460 : 150, 640, .8, t, p.fig ? 'fig' : 'round', 3);
  if (p.fig) s += tree(110, 650, .9, t, 'fig', 7);
  s += flowers(t, 780, 26, 2) + grassTufts(t, 840, 40, 3);
  s += butterflies(t, 5, 4, 40, 520, 480, 220) + birds(t, 4, 5, 200);
  s += `<g transform="translate(70,900) scale(.9)">${sheep(0, 0, 1, t, 1)}</g>`;
  const garment = p.skins ? 'skins' : 'leaves';
  const lit = p.give ? easeOut(t / 1.5) : 0;
  if (p.give) s += `<path d="M200 -300 L376 -300 L420 900 L156 900Z" fill="#fff6d2" opacity="${f1(.35 * lit)}"/>` + glow(288, 520, 220, '#fff3c4', .8 * lit);
  if (p.give && !p.skins) { const k = easeOut((t - .5) / 2); s += `<g transform="translate(288,${f1(200 + k * 380)}) scale(1.4)" opacity="${f1(clamp(2 - k * 2, 0, 1) + .2)}">${ICONS.fur()}</g>`; }
  if (!p.noPeople) {
    s += person({ who: 'adao', x: 220, y: 860, s: 1.2, t, garment, look: p.look ?? .5, lookY: p.lookUp ? -1 : 0, pose: p.pose || (p.skins ? 'default' : 'cover'), sad: !!p.sad });
    s += person({ who: 'eva', x: 360, y: 860, s: 1.2, t, garment, look: -(p.look ?? .5), lookY: p.lookUp ? -1 : 0, pose: p.pose || (p.skins ? 'default' : 'cover'), sad: !!p.sad, seed: 2 });
  }
  if (p.pick) { const k = (t * .5) % 1; s += figLeaf(240 + k * 40, 560 + k * 220, 1.6, k * 200, '#4f9b45'); }
  return { svg: s, shots: [WIDE, { fx: 220, fy: 640, z: 1.9, sy: 430 }, { fx: 360, fy: 640, z: 1.9, sy: 430 }, { fx: 290, fy: 660, z: 1.4, sy: 480 }] };
};

S.jordan = (t, p) => {
  let s = sky('jd', [[0, '#8fd0f5'], [1, '#eaf7ff']]);
  s += glow(130, 150, 160, '#fff3c4', .8) + clouds(t, 80, 4, 9, '#fff', .9, 5);
  s += hills(520, ['#b7c98a', '#9fb877', '#86a264']);
  s += water(t, 700, '#4a9ec4', '#c9f0ff', 4, .6);
  s += reeds(t, -100, 120, 720, 14, 2, 110) + reeds(t, 470, 700, 720, 14, 6, 110);
  s += `<path d="M-400 840 Q288 800 1000 840 L1000 1400 L-400 1400Z" fill="#c9b07a"/>`;
  s += crowd(t, 690, 4, 4, .7, { x0: 330, gap: 60, look: -1 });
  s += person({ who: 'joao', x: 170, y: 900, s: 1.25, t, look: 1, pose: 'point', talk: !!p.talk });
  s += person({ who: 'jesus', x: 420, y: 900, s: 1.25, t, look: -.5, walk: p.walk ? .5 : 0, pose: 'default' });
  if (p.lamb) s += `<g transform="translate(420,540) scale(${f1(pop(t / .6))})">${glow(0, -10, 80, '#fff3c4', .7)}${sheep(-4, 14, 1.2, t)}</g>`;
  return { svg: s, shots: [WIDE, { fx: 170, fy: 900 - 220, z: 1.8, sy: 430 }, { fx: 420, fy: 900 - 220, z: 1.8, sy: 430 }, { fx: 300, fy: 700, z: 1.3, sy: 500 }] };
};

S.cross = (t, p) => {
  let s = sky('cr', [[0, '#3a2a5e'], [.5, '#e98a5a'], [1, '#fbd59a']]);
  const k = p.dawn ? easeOut(t / 4) : .5;
  s += glow(288, 560, 300 + k * 120, '#fff0b0', .6 + .3 * k) + rays(288, 560, 16, 800, '#fff3c4', .08 + .08 * k, t);
  s += clouds(t, 120, 5, 12, '#f7c9a8', .7, 4);
  s += `<path d="M-400 700 Q288 520 1000 700 L1000 1400 L-400 1400Z" fill="#6b4a3a"/><path d="M-400 760 Q288 640 1000 760 L1000 1400 L-400 1400Z" fill="#553828"/>`;
  s += crossHill(288, 640, 1.3);
  s += grassTufts(t, 760, 30, 5, '#4a3a2a');
  if (p.icon) s += `<g transform="translate(288,250) scale(${f1(pop(t / .5) * 1.8)})"><circle r="34" fill="#fff" opacity=".9"/>${ICONS[p.icon]()}</g>`;
  return { svg: s, shots: [WIDE, { fx: 288, fy: 440, z: 1.5, sy: 400 }, { fx: 288, fy: 560, z: 1.2, sy: 480 }] };
};

S.recap = (t, p) => {
  let s = sky('rc', [[0, '#1a1530'], [1, '#3a2c55']]);
  s += starsField(t, 120, 41, -300, 1300, .8);
  const items = [['star', 'Estrelas'], ['steps', 'Enoque'], ['hebrew', 'Tebá'], ['eye', 'El Roi'], ['fur', 'Cobertura']];
  const n = p.upto ?? 5;
  items.forEach(([ic, lb], i) => {
    if (i >= n) return;
    const k = p.all ? easeOut((t - .25 * i) / .5) : (i < n - 1 ? 1 : pop(t / .6)); if (k <= 0) return;
    const x = i < 3 ? 148 + i * 140 : 218 + (i - 3) * 140, y = i < 3 ? 250 : 405;
    s += `<g transform="translate(${x},${y}) scale(${f1(k * .76)})">${glow(0, 0, 90, '#ffe7a0', .35)}<circle r="58" fill="#fff8e6"/><circle r="58" fill="none" stroke="#d7a84a" stroke-width="4"/><g transform="scale(1.25)">${ICONS[ic]()}</g><text y="88" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="22" fill="#ffd84d">${lb}</text></g>`;
  });
  return { svg: s, shots: [WIDE, { fx: 288, fy: 400, z: 1.15, sy: 430 }] };
};

S.attributes = (t, p) => {
  let s = sky('at', [[0, '#14183a'], [1, '#3a2c55']]);
  s += starsField(t, 100, 51, -300, 1300, .8) + glow(288, 420, 260, '#ffe7a0', .35);
  const words = [['sparkle', 'CRIA'], ['heart', 'SE RELACIONA'], ['eye', 'VÊ'], ['ear', 'OUVE'], ['ark', 'PRESERVA'], ['gift', 'PROVÊ']];
  words.forEach(([ic, w], i) => {
    const k = easeOut((t - i * .55) / .4); if (k <= 0) return;
    const x = 160 + (i % 2) * 256, y = 230 + Math.floor(i / 2) * 140;
    s += `<g transform="translate(${x},${y}) scale(${f1(k)})"><circle r="40" fill="#fff8e6"/><g>${ICONS[ic]()}</g><text y="68" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="22" fill="#fff">${w}</text></g>`;
  });
  return { svg: s, shots: [WIDE, { fx: 288, fy: 380, z: 1.15, sy: 420 }] };
};

S.subscribe = (t, p) => {
  let s = sky('sb', [[0, '#2a1d14'], [1, '#4a3322']]);
  s += bibleBook(288, 760, 1.1, t, .5, (t * .4) % 1, 'ÊXODO');
  const k = pop(t / .6), r = Math.sin(t * 6) * 10 * Math.max(0, 1 - ((t % 2.5) / .8));
  s += `<g transform="translate(288,330) scale(${f1(k)})"><rect x="-150" y="-36" width="300" height="72" rx="36" fill="#c4302b"/><text y="12" text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" font-size="32" fill="#fff">INSCREVA-SE</text></g>`;
  s += `<g transform="translate(288,450) rotate(${f1(r)}) scale(${f1(k * 1.6)})">${ICONS.bell()}</g>`;
  return { svg: s, shots: [WIDE, { fx: 288, fy: 420, z: 1.2, sy: 430 }] };
};

S.end = (t, p) => {
  let s = sky('ee', [[0, '#120c08'], [1, '#2a1a10']]);
  for (let i = 0; i < 30; i++) { const k = (t * .06 + rnd(i)) % 1; s += `<circle cx="${f1(rnd(i * 3) * 576)}" cy="${f1(900 - k * 900)}" r="${f1(1 + rnd(i) * 2.4)}" fill="#ffe7a0" opacity="${f1((1 - k) * .8)}"/>`; }
  s += bibleBook(288, 620, 1.25, t, 1.2, 0, '');
  const k = easeOut(t / 1.2);
  s += `<g opacity="${f1(k)}" text-anchor="middle"><text x="288" y="${f1(380 - (1 - k) * 20)}" font-family="Liberation Serif, Times New Roman, serif" font-weight="bold" font-size="54" fill="#ffd84d" stroke="#5a3a00" stroke-width="1.5" paint-order="stroke">Palavra</text><text x="288" y="${f1(440 - (1 - k) * 20)}" font-family="Liberation Serif, Times New Roman, serif" font-weight="bold" font-size="54" fill="#ffd84d" stroke="#5a3a00" stroke-width="1.5" paint-order="stroke">Ensinada</text></g>`;
  return { svg: s, shots: [WIDE, { fx: 288, fy: 470, z: 1.12, sy: 470 }] };
};

S.title = (t, p) => {
  // abertura de cada descoberta: número grande + título, sobre cena temática desfocada
  const bg = S[p.bg](t, p.bgp || {}).svg;
  const k = easeOut(t / .7);
  let s = `<g filter="url(#blur)">${bg}</g><rect x="-400" y="-400" width="1400" height="1800" fill="#0b0a14" opacity=".45"/>`;
  s += `<g text-anchor="middle" font-family="Liberation Sans, Arial" font-weight="bold" transform="translate(288,${f1(400 - (1 - k) * 30)})" opacity="${f1(k)}"><text y="-60" font-size="24" fill="#f3e6c8" letter-spacing="3">${p.n}ª DESCOBERTA</text><text y="60" font-size="150" fill="#ffd84d" stroke="#5a3a00" stroke-width="3" paint-order="stroke">${p.n}</text>${wrapLines(p.name, 17).map((l, i) => `<text y="${130 + i * 42}" font-size="36" fill="#fff" stroke="#000" stroke-width="5" paint-order="stroke">${l}</text>`).join('')}</g>`;
  return { svg: s, shots: [WIDE, { fx: 288, fy: 420, z: 1.1, sy: 430 }] };
};
