// ===== Personagens v2: volume (gradientes), roupas detalhadas, expressões =====
// DEFS: gradientes/clipPaths acumulados por quadro (main.js injeta no SVG)
let DEFS = {};
function def(id, body) { if (!DEFS[id]) DEFS[id] = body; return `url(#${id})`; }
const hid = c => c.replace('#', '');
function gLin(c, a = .2, b = -.32) { // luz da esquerda → sombra à direita
  return def('gl' + hid(c) + a + b, `<linearGradient id="gl${hid(c)}${a}${b}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(c, a)}"/><stop offset=".42" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, b)}"/></linearGradient>`);
}
function gVert(c, a = .18, b = -.25) {
  return def('gv' + hid(c) + a + b, `<linearGradient id="gv${hid(c)}${a}${b}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c, a)}"/><stop offset="1" stop-color="${shade(c, b)}"/></linearGradient>`);
}
function gRad(c, a = .16, b = -.18) {
  return def('gr' + hid(c) + a + b, `<radialGradient id="gr${hid(c)}${a}${b}" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="${shade(c, a)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, b)}"/></radialGradient>`);
}

// Elenco (aparências baseadas no texto bíblico quando ele descreve)
const CAST = {
  // referência enviada pelo usuário
  jesus: { skin: '#d6a27a', robe: '#7d8fa3', under: '#e9e1cf', sash: '#7a2131', trim: '#5f6f82', hair: '#5b3a22', hairStyle: 'wavy', beard: 'short', beardColor: '#3d2616', iris: '#5a3a1e', emo: 'peace' },
  // Gn 2–3: jovens, no jardim
  adao: { skin: '#c98f62', hair: '#3a2212', hairStyle: 'short', beard: 'short', beardColor: '#2e1a0c', garment: 'leaves', iris: '#4a2e17', build: 1.05 },
  eva: { skin: '#dcae86', hair: '#4a2814', hairStyle: 'longF', female: true, garment: 'leaves', iris: '#5a3a1e', flower: '#f6a3b8' },
  // Gn 5: Enoque, 365 anos ao ser tomado (homem maduro), andou com Deus
  enoque: { skin: '#cf9e72', robe: '#d9c8a2', under: '#efe6d2', sash: '#8b5a2b', trim: '#8b5a2b', cloak: '#7a5a3e', hair: '#8f877c', hairStyle: 'wavy', beard: 'medium', beardColor: '#a39b90', age: 'mid', staff: 1, iris: '#4a2e17' },
  // Gn 7:6: Noé tinha 600 anos no dilúvio
  noe: { skin: '#d2a07a', robe: '#8b6a48', under: '#d8c9a8', sash: '#4c6a3a', trim: '#c9a14a', cloak: '#5b4630', hair: '#f2f1ec', hairStyle: 'bald', beard: 'long', beardColor: '#f4f3ee', age: 'old', staff: 1, iris: '#5a4a3a' },
  // Êx 2:1-3: mulher levita, mãe de Moisés
  joquebede: { skin: '#c98f62', robe: '#c48a3d', under: '#efe2c4', sash: '#5b3a6e', trim: '#5b3a6e', hair: '#2e1c10', hairStyle: 'veil', veil: '#e9dcc0', female: true, iris: '#3a2412' },
  // Gn 16:1: serva egípcia, grávida
  agar: { skin: '#9a6643', robe: '#f1ebdd', under: '#f1ebdd', sash: '#2a9d8f', trim: '#2a9d8f', hair: '#120c08', hairStyle: 'braid', female: true, pregnant: true, kohl: true, necklace: '#2a9d8f', earring: '#e3b13b', iris: '#2a1a0e' },
  // Gn 12:11; 17:17: bela, ~75 anos nesta época
  sarai: { skin: '#d6a47c', robe: '#6c4a7d', under: '#e8dcc8', sash: '#d7a84a', trim: '#d7a84a', hair: '#a8a097', hairStyle: 'veil', veil: '#cbb9d6', female: true, age: 'old', earring: '#e3b13b', bracelet: '#e3b13b', iris: '#4a2e17' },
  // Anjo do Senhor: aparece como homem (Gn 16), veste branca e luz suave
  anjo: { skin: '#e0b48c', robe: '#fbf8ef', under: '#ffffff', sash: '#e8c66a', trim: '#e8c66a', hair: '#d8b878', hairStyle: 'short', beard: 'none', angel: true, iris: '#6a5030', emo: 'peace' },
  // 1Sm 16:12; 17:42: ruivo, de belos olhos e boa aparência, jovem pastor
  davi: { skin: '#e2b28a', robe: '#6f8f4e', under: '#e6dcc2', sash: '#a0522d', trim: '#c98a3a', hair: '#b4471d', hairStyle: 'curly', beard: 'light', beardColor: '#b4471d', iris: '#3f7a4a', ruddy: true, bag: true, staff: 1, h: .97 },
  // Mt 3:4: veste de pelos de camelo e cinto de couro
  joao: { skin: '#b97d52', hair: '#2a180b', hairStyle: 'wild', beard: 'long', beardColor: '#2a180b', garment: 'camel', build: .92, staff: 1, iris: '#3a2412' },
  // Êx 7:7: 80 anos ao falar com Faraó
  moises: { skin: '#cf9a6e', robe: '#8a3b2a', under: '#e6dcc2', sash: '#d7a84a', trim: '#d7a84a', cloak: '#5e2a1e', hair: '#ecebe6', hairStyle: 'wavy', beard: 'long', beardColor: '#eeede8', age: 'old', staff: 1, iris: '#4a2e17' },
  povo1: { skin: '#c98f62', robe: '#a86b3c', under: '#e6dcc2', sash: '#2f4f6f', trim: '#2f4f6f', hair: '#2b1a0e', hairStyle: 'short', beard: 'short', beardColor: '#2b1a0e' },
  povo2: { skin: '#b97d55', robe: '#5b7a8c', under: '#e6dcc2', sash: '#c9a14a', trim: '#c9a14a', hair: '#1f140c', hairStyle: 'veil', veil: '#d8c9a8', female: true },
  povo3: { skin: '#d3a27a', robe: '#7d5a7a', under: '#e6dcc2', sash: '#e0c070', trim: '#e0c070', hair: '#3a2414', hairStyle: 'curly', beard: 'medium', beardColor: '#3a2414', age: 'mid' },
  povo4: { skin: '#a8714a', robe: '#c7b48a', under: '#efe6d2', sash: '#8b2f2f', trim: '#8b2f2f', hair: '#1a110a', hairStyle: 'braid', female: true },
  povo5: { skin: '#c48a60', robe: '#4f6d4a', under: '#e6dcc2', sash: '#b5523b', trim: '#b5523b', hair: '#e8e6e0', hairStyle: 'bald', beard: 'long', beardColor: '#e8e6e0', age: 'old' },
  homem: { skin: '#d6a27a', robe: '#4f6d8a', under: '#e6dcc2', sash: '#c9a14a', trim: '#c9a14a', hair: '#3a2414', hairStyle: 'short', beard: 'light', beardColor: '#3a2414', iris: '#4a2e17' },
};

// Expressões
const EMO = {
  neutral: { bi: 0, bo: 0, eo: 1, mouth: 'soft', blush: .22 },
  peace: { bi: -.5, bo: -.5, eo: .85, mouth: 'smile', blush: .25 },
  happy: { bi: -1.2, bo: -1, eo: .9, squint: .35, mouth: 'smile', blush: .35 },
  joy: { bi: -2.2, bo: -1.8, eo: 1, arcs: 1, mouth: 'open', blush: .45 },
  sad: { bi: -2.6, bo: 1.2, eo: .7, mouth: 'frown', blush: .15, tilt: 1 },
  cry: { bi: -2.8, bo: 1.4, eo: .6, mouth: 'frown', blush: .3, tilt: 1, tears: 1 },
  surprise: { bi: -3.8, bo: -3.4, eo: 1.4, mouth: 'O', blush: .2 },
  fear: { bi: -3, bo: -.5, eo: 1.25, mouth: 'flat', blush: .1 },
  worried: { bi: -2.4, bo: .4, eo: 1, mouth: 'flat', blush: .15 },
  awe: { bi: -2.6, bo: -2.2, eo: 1.2, mouth: 'o', blush: .3, up: 1 },
  shame: { bi: -2, bo: 1, eo: .65, mouth: 'flat', blush: .6, tilt: 1.4, down: 1 },
  stern: { bi: 2.4, bo: -1.2, eo: .85, mouth: 'flat', blush: .3 },
  pray: { bi: -.8, bo: -.4, eo: 0, closed: 1, mouth: 'soft', blush: .25 },
};

function person(o) {
  const c = Object.assign({}, CAST[o.who] || {}, o);
  const t = c.t || 0, s = (c.s || 1) * (c.h || (c.female ? .96 : 1)), seed = c.seed || 0;
  const skin = c.skin || '#d9a77c', skinS = shade(skin, -0.22);
  const robe = c.robe || '#7d8fa3', robeS = shade(robe, -0.3);
  const trim = c.trim || shade(robe, -.35);
  const e = EMO[c.emo || 'neutral'] || EMO.neutral;
  const ph = c.walk ? t * c.walk * Math.PI * 2 : 0;
  const wv = c.walk ? Math.sin(ph) : 0;
  const breathe = Math.sin(t * 1.7 + seed);
  const bob = c.walk ? -Math.abs(Math.sin(ph)) * 3 : breathe * 1.1;
  const lx = (c.look || 0) * 5, ly = (c.lookY ?? (e.down ? 1.2 : e.up ? -1.1 : 0)) * 3;
  const kneel = c.pose === 'kneel' || c.pose === 'bow';
  const sit = c.pose === 'sit';
  const bw = c.build || 1;
  const old = c.age === 'old';
  let out = `<g transform="translate(${f1(c.x)},${f1(c.y)}) scale(${f1(s * (c.flip ? -1 : 1) * 100) / 100},${f1(s * 100) / 100})"${c.op != null ? ` opacity="${c.op}"` : ''}>`;
  if (c.angel) out += glow(0, -110, 160, '#fff6d2', .95);
  out += `<ellipse cx="0" cy="0" rx="${sit || kneel ? 50 : 38}" ry="7" fill="${def('shd', '<radialGradient id="shd"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>')}"/>`;
  let g = `<g transform="translate(0,${f1(bob + (kneel ? 42 : 0) + (sit ? 40 : 0))})">`;
  const garment = c.garment || 'robe';
  const short = garment !== 'robe';
  // pernas e sandálias
  if (!kneel && !sit) {
    if (short) g += `<rect x="${f1(-15 + wv * 6)}" y="-62" width="12" height="60" rx="6" fill="${gLin(skin, .1, -.2)}"/><rect x="${f1(3 - wv * 6)}" y="-62" width="12" height="60" rx="6" fill="${gLin(skin, 0, -.3)}"/>`;
    g += foot(-10 + wv * 7, -3, skin) + foot(10 - wv * 7, -3, skin);
  } else g += `<ellipse cx="-24" cy="-6" rx="15" ry="7" fill="${short ? skin : robeS}"/><ellipse cx="24" cy="-6" rx="15" ry="7" fill="${short ? skin : robeS}"/>`;
  const hem = kneel || sit ? -40 : (short ? -52 : -10);
  const hw = (kneel || sit ? 46 : 36) * bw;
  const sway = wv * 3;
  const sh = 30 * bw; // ombro
  const arms = armPose(c, t);
  if (c.staff && !c.pose) { arms.R = [40, -96]; arms.hR = 'grip'; arms.aR = 180; }
  // capa por trás
  if (c.cloak && garment === 'robe') g += `<path d="M${-sh - 2} -138 Q${-hw - 14} -60 ${f1(-hw - 8 + sway)} ${hem + 2} L${f1(hw + 8 + sway)} ${hem + 2} Q${hw + 14} -60 ${sh + 2} -138Z" fill="${gLin(c.cloak, .12, -.35)}"/>`;
  if (garment === 'robe') {
    const belly = c.pregnant ? 1 : 0;
    g += `<path d="M-14 -150 Q${-sh + 1} -148 ${-sh - 1} -134 L${f1(-hw + sway)} ${hem} Q0 ${hem + 9} ${f1(hw + sway)} ${hem} L${sh + 1} -134 Q${sh - 1} -148 14 -150Z" fill="${gLin(robe)}"/>`;
    // dobras
    g += `<path d="M-12 -92 Q-16 -50 ${f1(-22 + sway)} ${hem + 3} M7 -88 Q12 -50 ${f1(16 + sway)} ${hem + 3} M-1 -62 L${f1(-2 + sway)} ${hem + 5} M${f1(24 + sway)} -60 Q${f1(28 + sway)} -30 ${f1(30 + sway)} ${hem + 2}" stroke="${robeS}" stroke-width="2.6" fill="none" opacity=".5" stroke-linecap="round"/>`;
    g += `<path d="M-6 -86 Q-8 -50 ${f1(-10 + sway)} ${hem}" stroke="${shade(robe, .3)}" stroke-width="2" fill="none" opacity=".35"/>`;
    // barra bordada
    g += `<path d="M${f1(-hw + 1 + sway)} ${hem - 6} Q0 ${hem + 3} ${f1(hw - 1 + sway)} ${hem - 6}" stroke="${trim}" stroke-width="5" fill="none"/><path d="M${f1(-hw + 1 + sway)} ${hem - 6} Q0 ${hem + 3} ${f1(hw - 1 + sway)} ${hem - 6}" stroke="${shade(trim, .45)}" stroke-width="1.6" fill="none" stroke-dasharray="2 3"/>`;
    if (belly) g += `<path d="M6 -104 Q46 -96 42 -66 Q38 -44 10 -46Z" fill="${gLin(robe, .25, -.25)}"/><path d="M16 -98 Q40 -90 38 -68" stroke="${robeS}" stroke-width="2.2" fill="none" opacity=".5"/>`;
    // túnica de baixo e gola
    g += `<path d="M-13 -150 L0 -128 L13 -150Z" fill="${c.under || '#e6dcc2'}"/><path d="M-13 -150 L0 -128 L13 -150" fill="none" stroke="${trim}" stroke-width="3" stroke-linejoin="round"/>`;
    if (c.necklace) g += `<path d="M-12 -147 Q0 -134 12 -147" stroke="${c.necklace}" stroke-width="3.5" fill="none"/>${[-8, -4, 0, 4, 8].map(k => `<circle cx="${k}" cy="${f1(-140 + Math.abs(k) * -.45)}" r="1.6" fill="#e3b13b"/>`).join('')}`;
    // faixa com franjas
    const sy = belly ? -102 : -96, sc = c.sash || '#7a2131';
    g += `<path d="M${-sh} ${sy} Q0 ${sy + 5} ${sh + belly * 6} ${sy} L${sh + belly * 6} ${sy + 10} Q0 ${sy + 15} ${-sh - 1} ${sy + 10}Z" fill="${gVert(sc, .2, -.25)}"/>`;
    if (!kneel && !sit) { g += `<path d="M6 ${sy + 12} L${f1(2 + sway)} ${sy + 44} M12 ${sy + 12} L${f1(14 + sway)} ${sy + 40}" stroke="${sc}" stroke-width="5" stroke-linecap="round"/>`; g += [0, 1, 2].map(k => `<line x1="${f1(-1 + k * 2 + sway)}" y1="${sy + 44}" x2="${f1(-1 + k * 2 + sway)}" y2="${sy + 50}" stroke="${shade(sc, .2)}" stroke-width="1"/>`).join(''); }
    // alça da bolsa de pastor
    if (c.bag) g += `<path d="M-24 -144 L22 -70" stroke="#6b4423" stroke-width="4"/><path d="M14 -76 q14 -4 22 6 q-2 18 -18 16 q-10 -6 -4 -22Z" fill="${gLin('#8a5a2c')}"/>`;
  } else if (garment === 'leaves') {
    g += `<path d="M-14 -150 Q${-sh + 1} -148 ${-sh + 1} -134 L-30 -60 L30 -60 L${sh - 1} -134 Q${sh - 1} -148 14 -150Z" fill="${gLin(skin, .12, -.22)}"/>`;
    if (!c.female) g += `<path d="M-10 -128 Q0 -120 10 -128" stroke="${skinS}" stroke-width="1.5" fill="none" opacity=".5"/>`;
    let lv = c.female ? `<path d="M-14 -150 Q-29 -148 -30 -134 L-32 -52 L32 -52 L30 -134 Q29 -148 14 -150Z" fill="#2f7a2f"/>` : `<path d="M-30 -102 L30 -102 L32 -52 L-32 -52Z" fill="#2f7a2f"/>`;
    for (let yy = (c.female ? -140 : -100); yy <= -50; yy += 11) for (let xx = -30; xx <= 30; xx += 12) lv += figLeaf(xx + (yy % 22 ? 6 : 0), yy + 18, .72, 180 + Math.sin(xx * 3 + yy) * 25, (xx * 7 + yy) % 3 ? '#4f9b45' : (xx % 2 ? '#3d8a3a' : '#62ad52'));
    g += lv + `<path d="M-31 -100 Q0 -94 31 -100" stroke="#6b4a1f" stroke-width="2.5" fill="none"/>`;
  } else if (garment === 'skins') {
    g += `<path d="M-14 -150 Q${-sh + 1} -148 ${-sh - 1} -134 L-34 -50 L-24 -44 L-14 -52 L-2 -44 L10 -52 L22 -44 L34 -50 L${sh + 1} -134 Q${sh - 1} -148 14 -150Z" fill="${gLin('#a8743f', .15, -.3)}"/>`;
    for (let i = 0; i < 22; i++) g += `<path d="M${f1(-26 + rnd(i + 3) * 52)} ${f1(-142 + rnd(i * 5) * 88)} q${f1(-2 + rnd(i) * 4)} 4 0 8" stroke="#6d4520" stroke-width="1.6" fill="none" opacity=".8"/>`;
    g += `<ellipse cx="-12" cy="-110" rx="9" ry="6" fill="#8a5a2c" opacity=".6"/><ellipse cx="14" cy="-80" rx="10" ry="6" fill="#8a5a2c" opacity=".55"/><ellipse cx="-6" cy="-70" rx="6" ry="4" fill="#c9965a" opacity=".5"/><path d="M-12 -150 L0 -138 L12 -150" fill="${skin}"/><path d="M-31 -98 Q0 -93 31 -98" stroke="#4a2c14" stroke-width="5" fill="none"/><path d="M-31 -98 Q0 -93 31 -98" stroke="#7a5130" stroke-width="1.4" fill="none" stroke-dasharray="3 3"/>`;
  } else if (garment === 'camel') {
    g += `<path d="M-14 -150 Q${-sh + 1} -148 ${-sh - 1} -134 L-34 -50 L-26 -46 L-18 -52 L-8 -45 L4 -52 L14 -45 L24 -52 L34 -48 L${sh + 1} -134 Q${sh - 1} -148 14 -150Z" fill="${gLin('#b8925a', .15, -.3)}"/>`;
    for (let i = 0; i < 40; i++) { const xx = -28 + rnd(i + 9) * 56, yy = -146 + rnd(i * 7) * 94; g += `<path d="M${f1(xx)} ${f1(yy)} l${f1(-2 + rnd(i) * 4)} 7" stroke="${i % 3 ? '#8c6a37' : '#d9b77c'}" stroke-width="1.5"/>`; }
    g += `<path d="M-33 -97 Q0 -90 33 -97 L33 -88 Q0 -81 -33 -88Z" fill="${gVert('#5b3a1e')}"/><rect x="-5" y="-97" width="10" height="10" rx="1.5" fill="none" stroke="#c9a14a" stroke-width="2.2"/>`;
  }
  // pescoço com sombra
  g += `<rect x="-6.5" y="-162" width="13" height="16" fill="${skinS}"/><ellipse cx="0" cy="-153" rx="9" ry="4" fill="#000" opacity=".12"/>`;
  // braços
  const staffOn = c.staff && (!c.pose || c.pose === 'default' || c.pose === 'staff');
  g += arm(c, -sh + 2, -138, arms.L, skin, garment, robe, robeS, trim, arms.hL, arms.aL);
  if (staffOn) g += `<line x1="${arms.R[0] + 1}" y1="${arms.R[1] - 92}" x2="${arms.R[0] + 3}" y2="-2" stroke="${gLin('#7a5130')}" stroke-width="5.5" stroke-linecap="round"/><path d="M${arms.R[0] + 1} ${arms.R[1] - 92} q-8 -6 -4 -16" stroke="#7a5130" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  g += arm(c, sh - 2, -138, arms.R, skin, garment, robe, robeS, trim, arms.hR, arms.aR);
  if (c.harp) g += `<g transform="translate(-2,-100)"><path d="M-14 0 Q-20 -36 0 -44 L14 -40 L14 4Z" fill="none" stroke="${gLin('#c08a32')}" stroke-width="5"/>${[0, 1, 2, 3].map(k => `<line x1="${-10 + k * 6}" y1="-36" x2="${-10 + k * 6}" y2="0" stroke="#f3e2b0" stroke-width="1"/>`).join('')}</g>`;
  // cabeça
  const tilt = (e.tilt || 0) * 2.5 + (old ? 2 : 0);
  g += `<g transform="translate(0,${f1(tilt)})">${head(c, t, lx, ly, seed, e)}</g>`;
  g += `</g>`;
  return out + g + `</g>`;
}
function foot(x, y, skin) {
  return `<g transform="translate(${f1(x)},${f1(y)})"><ellipse cx="0" cy="1" rx="11" ry="5" fill="#4a2e17"/><ellipse cx="0" cy="-.5" rx="10" ry="5" fill="${gRad(skin)}"/><path d="M-6 -3 L4 2 M6 -3 L-4 2" stroke="#6b4423" stroke-width="1.8"/><circle cx="-7" cy="-1" r="1.4" fill="${shade(skin, -.15)}"/></g>`;
}
// Braços com anatomia: ombro, braço, cotovelo (IK de dois ossos), antebraço afinando até o punho, mão com dedos.
// Cada pose devolve o alvo do PUNHO e o estado de cada mão.
function armPose(c, t) {
  const sw = c.walk ? Math.sin(t * c.walk * Math.PI * 2) * 9 : 0;
  const g = Math.sin(t * 2.2 + (c.seed || 0)) * 5;
  const P = (L, R, hL = 'relax', hR = 'relax', aL = null, aR = null) => ({ L, R, hL, hR, aL, aR });
  switch (c.pose) {
    case 'raise': return P([-50, -196 + g * .3], [50, -196 - g * .3], 'open', 'open', -100, -80);
    case 'open': return P([-62, -104 + g * .2], [62, -104 - g * .2], 'open', 'open', 200, -20);
    case 'pray': return P([-3, -112], [3, -112], 'pray', 'pray', -90, -90);
    case 'point': return P([-30 - sw * .3, -80], [72, -134 + g * .2], 'relax', 'point', null, -12);
    case 'pointUp': return P([-30, -80], [40, -196], 'relax', 'point', null, -80);
    case 'hold': return P([-18, -96], [18, -96], 'grip', 'grip', 20, 160);
    case 'belly': return P([-6, -90], [30, -78], 'flat', 'flat', 10, 170);
    case 'face': return P([-12, -150], [12, -150], 'open', 'open', -80, -100);
    case 'chest': return P([-6, -118], [8, -122], 'flat', 'flat', 0, 180);
    case 'talk': return P([-30, -80], [52 + g, -112 - g], 'relax', 'open', null, -40);
    case 'offer': return P([-40, -100], [40, -100], 'open', 'open', 180, 0);
    case 'kneel': case 'bow': return P([-12, -104], [12, -104], 'flat', 'flat', 0, 180);
    case 'sit': return P([-28, -78], [28, -78], 'relax', 'relax');
    case 'cover': return P([-10, -100], [12, -116], 'flat', 'flat', 0, 180);
    case 'surprise': return P([-30, -128], [30, -128], 'open', 'open', -110, -70);
    case 'wipe': return P([-30, -80], [8, -160], 'relax', 'flat', null, -120);
    default: return P([-33 - sw, -74], [33 + sw, -74], c.staff ? 'relax' : 'relax', c.staff ? 'grip' : 'relax');
  }
}
function limb(x1, y1, x2, y2, w1, w2, fill) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  // laterais levemente curvas (músculo)
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, b = (w1 + w2) * .08;
  return `<path d="M${f1(x1 + nx * w1 / 2)} ${f1(y1 + ny * w1 / 2)} Q${f1(mx + nx * (w1 + w2) / 4 + nx * b)} ${f1(my + ny * (w1 + w2) / 4 + ny * b)} ${f1(x2 + nx * w2 / 2)} ${f1(y2 + ny * w2 / 2)} L${f1(x2 - nx * w2 / 2)} ${f1(y2 - ny * w2 / 2)} Q${f1(mx - nx * (w1 + w2) / 4 - nx * b * .4)} ${f1(my - ny * (w1 + w2) / 4 - ny * b * .4)} ${f1(x1 - nx * w1 / 2)} ${f1(y1 - ny * w1 / 2)}Z" fill="${fill}"/>`;
}
function hand(state, skin, side, ang) {
  // coordenadas locais: o punho em (0,0), a mão cresce para +y. side: -1 esquerda, 1 direita (lado do polegar)
  const sk = gRad(skin, .12, -.18), ln = shade(skin, -.3), nail = shade(skin, .25);
  const th = side; // polegar para o lado de dentro do corpo
  const finger = (x, len, a, w = 2.9) => `<g transform="translate(${f1(x)},11) rotate(${f1(a)})"><rect x="${f1(-w / 2)}" y="-1" width="${f1(w)}" height="${f1(len)}" rx="${f1(w / 2)}" fill="${skin}"/><path d="M${f1(-w / 2 + .4)} ${f1(len * .5)} l${f1(w - .8)} 0" stroke="${ln}" stroke-width=".45" opacity=".7"/><ellipse cx="0" cy="${f1(len - 1.8)}" rx="${f1(w * .3)}" ry=".9" fill="${nail}" opacity=".7"/></g>`;
  let s = `<g transform="rotate(${f1(ang)})">`;
  if (state === 'point') {
    s += `<path d="M-5.5 0 Q-6.5 7 -5 13 Q0 15.5 5 13 Q6.5 7 5.5 0Z" fill="${sk}"/>` + finger(-3.6, 10, 0) + `<g transform="translate(0,12)"><path d="M-2 0 q2 4 5 2 M1 0 q2 4 5 1" stroke="${ln}" stroke-width=".7" fill="none"/></g>`;
    s += `<ellipse cx="${f1(2.6)}" cy="13" rx="4.6" ry="2.8" fill="${skin}"/><path d="M-1 14.5 q2.5 1 5 0" stroke="${ln}" stroke-width=".6" fill="none"/>`;
    s += `<g transform="translate(${f1(th * 5)},6) rotate(${f1(th * -35)})"><rect x="-1.6" y="0" width="3.2" height="7.5" rx="1.6" fill="${skin}"/></g>`;
  } else if (state === 'grip') {
    s += `<path d="M-5.8 0 Q-6.8 7 -5.6 12 Q0 14 5.6 12 Q6.8 7 5.8 0Z" fill="${sk}"/><path d="M-6 9 Q-7 16 -2 17 L4 17 Q7.5 16 6.2 9Z" fill="${skin}"/>${[-3.6, -1.2, 1.2, 3.6].map(x => `<path d="M${f1(x)} 10 q.4 3.5 0 6.4" stroke="${ln}" stroke-width=".6" fill="none"/>`).join('')}<g transform="translate(${f1(th * 5.5)},5) rotate(${f1(th * -50)})"><rect x="-1.6" y="0" width="3.2" height="8" rx="1.6" fill="${skin}"/></g>`;
  } else {
    // relax (dedos juntos, levemente curvos) · open (abertos) · flat (espalmada) · pray (para cima, juntos)
    const spread = state === 'open' ? 1 : 0, curl = state === 'relax' ? 1 : 0;
    s += `<path d="M-5.8 0 Q-6.8 6 -5.8 12 L5.8 12 Q6.8 6 5.8 0Z" fill="${sk}"/>`;
    const fx = [-4.2, -1.4, 1.4, 4.2], fl = [8.2, 10, 9.6, 7.6].map(l => l * (curl ? .82 : 1)), fa = spread ? [16, 6, -4, -14] : (curl ? [3, 1, -1, -3] : [2, .5, -.5, -2]);
    fx.forEach((x, i) => { s += finger(x * -th, fl[i], fa[i] * -th); });
    if (curl) s += `<path d="M-5.4 16 Q0 18.5 5.4 16" stroke="${ln}" stroke-width=".6" fill="none" opacity=".7"/>`;
    s += `<path d="M-3 5 Q0 7 3 5" stroke="${ln}" stroke-width=".5" fill="none" opacity=".5"/>`;
    const ta = spread ? -62 : -28;
    s += `<g transform="translate(${f1(th * 5.4)},3) rotate(${f1(th * ta)})"><rect x="-1.75" y="0" width="3.5" height="9.5" rx="1.75" fill="${skin}"/><ellipse cx="0" cy="8" rx="1" ry=".8" fill="${nail}" opacity=".7"/></g>`;
  }
  return s + '</g>';
}
function arm(c, sx, sy, h, skin, garment, robe, robeS, trim, state = 'relax', handAng = null) {
  const side = Math.sign(sx) || 1;
  const U = 31 * (c.build || 1), F = 29 * (c.build || 1);
  let [hx, hy] = h;
  let dx = hx - sx, dy = hy - sy, d = Math.hypot(dx, dy) || 1;
  const dc = clamp(d, Math.abs(U - F) + 4, U + F - .6);
  hx = sx + dx / d * dc; hy = sy + dy / d * dc; d = dc;
  const a = Math.atan2(dy, dx), A = Math.acos(clamp((U * U + d * d - F * F) / (2 * U * d), -1, 1));
  const e1 = [sx + U * Math.cos(a + A), sy + U * Math.sin(a + A)], e2 = [sx + U * Math.cos(a - A), sy + U * Math.sin(a - A)];
  // cotovelo para fora do corpo (e um pouco para trás/baixo)
  const score = hy > sy - 10 ? (e => e[0] * side * .35 + e[1]) : (e => e[0] * side + e[1] * .15);
  const [ex, ey] = score(e1) > score(e2) ? e1 : e2;
  const isRobe = garment === 'robe';
  const skF = gLin(skin, .14, -.24);
  const fa = Math.atan2(hy - ey, hx - ex) * 57.3 - 90; // direção do antebraço
  const ha = handAng == null ? fa : handAng - 90;
  let s = '';
  if (isRobe) {
    const rf = gLin(robe, .18, -.3);
    s += `<circle cx="${sx}" cy="${sy + 2}" r="9.5" fill="${rf}"/>` + limb(sx, sy + 2, ex, ey, 17, 15, rf) + `<circle cx="${f1(ex)}" cy="${f1(ey)}" r="7.5" fill="${rf}"/>`;
    // mão aparece saindo da manga larga
    s += `<g transform="translate(${f1(hx)},${f1(hy)})">${hand(state, skin, -side, ha)}</g>`;
    const wx = hx - (hx - ex) * .08, wy = hy - (hy - ey) * .08;
    s += limb(ex, ey, wx, wy, 15, 21, rf);
    const L = Math.hypot(wx - ex, wy - ey) || 1, nx = -(wy - ey) / L, ny = (wx - ex) / L;
    s += `<path d="M${f1(wx + nx * 10.5)} ${f1(wy + ny * 10.5)} L${f1(wx - nx * 10.5)} ${f1(wy - ny * 10.5)}" stroke="${trim}" stroke-width="4.5" stroke-linecap="round"/><path d="M${f1(wx + nx * 9)} ${f1(wy + ny * 9)} L${f1(wx - nx * 9)} ${f1(wy - ny * 9)}" stroke="${shade(trim, .45)}" stroke-width="1.2" stroke-dasharray="2 2.5"/>`;
    s += `<path d="M${f1(ex)} ${f1(ey)} L${f1(wx * .6 + ex * .4 + nx * 4)} ${f1(wy * .6 + ey * .4 + ny * 4)}" stroke="${robeS}" stroke-width="1.6" opacity=".45"/>`;
  } else {
    s += `<ellipse cx="${sx + side * 1}" cy="${sy + 3}" rx="8.5" ry="9.5" fill="${skF}"/>` + limb(sx, sy + 3, ex, ey, 13.5, 10.5, skF) + `<circle cx="${f1(ex)}" cy="${f1(ey)}" r="5.3" fill="${skin}"/>` + limb(ex, ey, hx, hy, 10.5, 7.4, skF);
    s += `<path d="M${f1(sx + side * 3)} ${sy + 8} q${side * 2} 8 ${f1((ex - sx) * .5)} ${f1((ey - sy) * .55)}" stroke="${shade(skin, -.2)}" stroke-width=".8" fill="none" opacity=".5"/>`;
    s += `<g transform="translate(${f1(hx)},${f1(hy)})">${hand(state, skin, -side, ha)}</g>`;
  }
  if (c.bracelet) s += `<ellipse cx="${f1(hx - (hx - ex) * .1)}" cy="${f1(hy - (hy - ey) * .1)}" rx="5.5" ry="2.4" fill="none" stroke="${c.bracelet}" stroke-width="2" transform="rotate(${f1(fa)} ${f1(hx - (hx - ex) * .1)} ${f1(hy - (hy - ey) * .1)})"/>`;
  return s;
}
function eye(ex, ey, lx, ly, c, e, t, seed) {
  const blink = !e.closed && !e.arcs && ((t + seed * 1.7) % 4.3) < 0.11;
  let eo = e.eo; if (blink) eo = 0;
  const lid = '#2a1a10';
  if (e.closed || eo === 0) return `<path d="M${f1(ex - 3.8)} ${ey} Q${ex} ${f1(ey + 2.2)} ${f1(ex + 3.8)} ${ey}" stroke="${lid}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  if (e.arcs) return `<path d="M${f1(ex - 3.8)} ${f1(ey + .8)} Q${ex} ${f1(ey - 3)} ${f1(ex + 3.8)} ${f1(ey + .8)}" stroke="${lid}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  const ry = 2.7 * eo, id = 'ec' + Math.round(eo * 10);
  def(id, `<clipPath id="${id}"><ellipse cx="0" cy="0" rx="3.9" ry="${f1(ry)}"/></clipPath>`);
  const ix = lx * .26, iy = ly * .25;
  const irisC = c.iris || '#4a2e17';
  let s = `<g transform="translate(${f1(ex)},${f1(ey)})"><ellipse cx="0" cy="0" rx="3.9" ry="${f1(ry)}" fill="#fbf8f2"/><g clip-path="url(#${id})"><circle cx="${f1(ix)}" cy="${f1(iy)}" r="2.3" fill="${gRad(irisC, .35, -.3)}"/><circle cx="${f1(ix)}" cy="${f1(iy)}" r="1.05" fill="#120a05"/><circle cx="${f1(ix + .8)}" cy="${f1(iy - .9)}" r=".65" fill="#fff"/><circle cx="${f1(ix - .7)}" cy="${f1(iy + .8)}" r=".3" fill="#fff" opacity=".8"/><rect x="-4" y="${f1(-ry)}" width="8" height="1.3" fill="#000" opacity=".12"/></g>`;
  if (e.squint) s += `<path d="M-4.2 ${f1(ry * .95)} Q0 ${f1(ry * (1 - e.squint * 2.4))} 4.2 ${f1(ry * .95)}Z" fill="${c.skin}"/>`;
  const kw = c.kohl ? 2.1 : 1.35;
  s += `<path d="M-4.2 ${f1(.3)} Q0 ${f1(-ry - 1.3)} 4.2 ${f1(.3)}" stroke="${lid}" stroke-width="${kw}" fill="none" stroke-linecap="round"/>`;
  if (c.kohl) s += `<path d="M${ex < 0 ? '-4' : '4'} 0 l${ex < 0 ? -2.4 : 2.4} -1.2 M-3.5 ${f1(ry * .7)} Q0 ${f1(ry + .8)} 3.5 ${f1(ry * .7)}" stroke="${lid}" stroke-width="1" fill="none"/>`;
  if (c.female) s += [0, 1, 2].map(k => { const sx = (ex < 0 ? -1 : 1) * (2.2 + k * .9); return `<line x1="${f1(sx)}" y1="${f1(-ry - .2 + k * .5)}" x2="${f1(sx * 1.25)}" y2="${f1(-ry - 1.8 + k * .5)}" stroke="${lid}" stroke-width=".7"/>`; }).join('');
  s += `<path d="M-3.6 ${f1(-ry - 2.4)} Q0 ${f1(-ry - 3.6)} 3.6 ${f1(-ry - 2.4)}" stroke="${shade(c.skin, -.25)}" stroke-width=".7" fill="none" opacity=".7"/>`;
  return s + '</g>';
}
function head(c, t, lx, ly, seed, e) {
  const skin = c.skin || '#d9a77c', skinS = shade(skin, -0.22), hairC = c.hair || '#4a2c17';
  const hs = c.hairStyle || 'short';
  const old = c.age === 'old', mid = c.age === 'mid';
  let s = '';
  const hairF = gVert(hairC, .22, -.2);
  // cabelo de trás
  if (hs === 'longF') s += `<path d="M-25 -184 Q-34 -140 -26 -110 Q-10 -104 0 -108 Q10 -104 26 -110 Q34 -140 25 -184Z" fill="${hairF}"/>${[-20, -12, 12, 20].map(k => `<path d="M${k} -170 Q${k * 1.3} -140 ${k * 1.1} -114" stroke="${shade(hairC, .2)}" stroke-width="1.2" fill="none" opacity=".6"/>`).join('')}`;
  if (hs === 'wavy') s += `<path d="M-22 -180 Q-28 -150 -21 -138 Q-14 -142 -14 -150 L14 -150 Q14 -142 21 -138 Q28 -150 22 -180Z" fill="${hairF}"/>`;
  if (hs === 'veil') s += `<path d="M-27 -192 Q-36 -140 -33 -114 L33 -114 Q36 -140 27 -192Z" fill="${gLin(c.veil, .15, -.25)}"/><path d="M-30 -150 Q-32 -130 -31 -116 M30 -150 Q32 -130 31 -116" stroke="${shade(c.veil, -.2)}" stroke-width="1.5" fill="none"/>`;
  if (hs === 'braid') s += `<path d="M14 -170 Q25 -150 21 -116" stroke="${hairC}" stroke-width="9" fill="none" stroke-linecap="round"/>${[0, 1, 2, 3].map(i => `<ellipse cx="${20 + i * .4}" cy="${-152 + i * 10}" rx="5" ry="4" fill="${shade(hairC, .18)}"/>`).join('')}<circle cx="21" cy="-112" r="2.8" fill="${c.necklace || '#2a9d8f'}"/>`;
  if (hs === 'wild') s += `<path d="M-27 -188 Q-38 -160 -28 -132 L28 -132 Q38 -160 27 -188Z" fill="${hairF}"/>`;
  if (hs === 'curly') s += [[-20, -168], [20, -168], [-22, -158], [22, -158]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${hairC}"/>`).join('');
  // orelhas e rosto com volume
  s += `<ellipse cx="-19.5" cy="-172" rx="4.2" ry="6.2" fill="${skinS}"/><ellipse cx="19.5" cy="-172" rx="4.2" ry="6.2" fill="${skinS}"/><path d="M-20 -175 q-2 3 0 6 M20 -175 q2 3 0 6" stroke="${shade(skin, -.35)}" stroke-width=".8" fill="none"/>`;
  if (c.earring) s += `<circle cx="-20" cy="-164" r="2.2" fill="${c.earring}"/><circle cx="20" cy="-164" r="2.2" fill="${c.earring}"/>`;
  s += `<path d="M-19 -182 Q-20 -158 -10 -152 Q0 -146.5 10 -152 Q20 -158 19 -182 Q18 -198 0 -198 Q-18 -198 -19 -182Z" fill="${gRad(skin, .14, -.16)}"/>`;
  s += `<path d="M13 -186 Q19 -172 14 -158 Q18 -170 16 -186Z" fill="${skinS}" opacity=".35"/>`;
  const bl = (e.blush || .2) + (c.ruddy ? .25 : 0);
  s += `<ellipse cx="${f1(-9.5 + lx * .3)}" cy="-164" rx="4.4" ry="2.6" fill="#e2675a" opacity="${f1(bl)}"/><ellipse cx="${f1(9.5 + lx * .3)}" cy="-164" rx="4.4" ry="2.6" fill="#e2675a" opacity="${f1(bl)}"/>`;
  if (c.ruddy) s += [[-11, -167], [-8, -165], [-10, -163], [9, -167], [11, -164], [8, -163]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="#a85a3a" opacity=".6"/>`).join('');
  // rugas
  if (old) s += `<path d="M-9 -191 q9 -2.4 18 0 M-7 -187.5 q7 -1.8 14 0 M-15 -176 l-3 -1.5 M-15 -174 l-3 .5 M15 -176 l3 -1.5 M15 -174 l3 .5 M-7 -166 q-3 5 -1 9 M7 -166 q3 5 1 9" stroke="${shade(skin, -.3)}" stroke-width=".9" fill="none" opacity=".85"/>`;
  if (mid) s += `<path d="M-7 -190 q7 -2 14 0 M-15 -175 l-2.5 -1 M15 -175 l2.5 -1" stroke="${shade(skin, -.28)}" stroke-width=".8" fill="none" opacity=".7"/>`;
  // barba
  const bc = c.beardColor || hairC, bf = gVert(bc, .15, -.2);
  const beardStrands = (y0, y1) => [-12, -6, 0, 6, 12].map(k => `<path d="M${k} ${y0} Q${k * .8} ${(y0 + y1) / 2} ${k * .5} ${y1}" stroke="${shade(bc, -.2)}" stroke-width=".9" fill="none" opacity=".6"/>`).join('');
  if (c.beard === 'short') s += `<path d="M-18.5 -172 Q-18.5 -151 -8 -147 Q0 -143.5 8 -147 Q18.5 -151 18.5 -172 Q16 -160 8 -158 Q0 -156 -8 -158 Q-16 -160 -18.5 -172Z" fill="${bf}"/>`;
  if (c.beard === 'medium') s += `<path d="M-18.5 -174 Q-19.5 -146 -6 -139 Q0 -136 6 -139 Q19.5 -146 18.5 -174 Q15 -160 8 -158 Q0 -156 -8 -158 Q-15 -160 -18.5 -174Z" fill="${bf}"/>` + beardStrands(-156, -140);
  if (c.beard === 'long') s += `<path d="M-19.5 -176 Q-23 -140 -6 -116 Q0 -112 6 -116 Q23 -140 19.5 -176 Q16 -160 8 -158 Q0 -156 -8 -158 Q-16 -160 -19.5 -176Z" fill="${bf}"/>` + beardStrands(-156, -118);
  if (c.beard === 'light') s += `<path d="M-17 -170 Q-14 -150 0 -148 Q14 -150 17 -170 Q12 -156 0 -155 Q-12 -156 -17 -170Z" fill="${bc}" opacity=".35"/>`;
  // olhos
  const eyeY = -175 + ly * .5;
  s += eye(-7 + lx, eyeY, lx, ly, c, e, t, seed) + eye(7 + lx, eyeY, lx, ly, c, e, t, seed);
  if (e.tears) { const k = (t * .35) % 1; s += `<path d="M${f1(-8 + lx)} ${f1(-171 + k * 12)} q1.6 2.4 0 3.4 q-1.6 -1 0 -3.4Z" fill="#9fdcff" opacity="${f1(.9 - k * .5)}"/>`; }
  // sobrancelhas
  const browC = old ? '#e2ded6' : shade(hairC, -0.18), bw = old ? 2.6 : 1.9;
  const by = -182.5 + ly * .4;
  s += `<path d="M${f1(-11.5 + lx)} ${f1(by + e.bo)} Q${f1(-7 + lx)} ${f1(by - 2 + (e.bo + e.bi) / 2)} ${f1(-3 + lx)} ${f1(by + e.bi)}" stroke="${browC}" stroke-width="${bw}" fill="none" stroke-linecap="round"/><path d="M${f1(3 + lx)} ${f1(by + e.bi)} Q${f1(7 + lx)} ${f1(by - 2 + (e.bo + e.bi) / 2)} ${f1(11.5 + lx)} ${f1(by + e.bo)}" stroke="${browC}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`;
  // nariz com luz e sombra
  s += `<path d="M${f1(lx * 1.1 + .5)} -175 q2.6 6.5 -1.2 8.4" stroke="${shade(skin, -.3)}" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="${f1(lx * 1.1 - 1)}" cy="-171" rx=".9" ry="2.6" fill="#fff" opacity=".22"/>`;
  // boca
  const mX = lx * .6, mY = -159.5;
  const mus = c.beard === 'long' || c.beard === 'medium' || c.beard === 'short';
  const talk = c.talk ? Math.abs(Math.sin(t * 10.5 + seed)) : 0;
  const lip = shade(skin, -.32), dark = '#5a1e18';
  let m = e.mouth;
  if (c.talk && talk > .25) m = m === 'frown' ? 'talkSad' : 'talk';
  if (m === 'soft') s += `<path d="M${f1(mX - 4.5)} ${mY} Q${f1(mX)} ${mY + 2.6} ${f1(mX + 4.5)} ${mY}" stroke="${lip}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  if (m === 'smile') s += `<path d="M${f1(mX - 6)} ${mY - .6} Q${f1(mX)} ${mY + 4.4} ${f1(mX + 6)} ${mY - .6}" stroke="${lip}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  if (m === 'open') s += `<path d="M${f1(mX - 6.5)} ${mY - 1} Q${f1(mX)} ${mY + 8} ${f1(mX + 6.5)} ${mY - 1}Z" fill="${dark}"/><path d="M${f1(mX - 5.5)} ${mY - .6} L${f1(mX + 5.5)} ${mY - .6} L${f1(mX + 4.5)} ${mY + 1.2} L${f1(mX - 4.5)} ${mY + 1.2}Z" fill="#fff"/><ellipse cx="${f1(mX)}" cy="${mY + 4.6}" rx="2.6" ry="1.2" fill="#d9706a"/>`;
  if (m === 'frown') s += `<path d="M${f1(mX - 4.5)} ${mY + 2} Q${f1(mX)} ${mY - 1} ${f1(mX + 4.5)} ${mY + 2}" stroke="${lip}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
  if (m === 'flat') s += `<path d="M${f1(mX - 4)} ${mY + .6} Q${f1(mX)} ${mY + .1} ${f1(mX + 4)} ${mY + .9}" stroke="${lip}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  if (m === 'O') s += `<ellipse cx="${f1(mX)}" cy="${mY + 1.5}" rx="2.8" ry="3.8" fill="${dark}"/><ellipse cx="${f1(mX)}" cy="${mY + 3.2}" rx="1.6" ry="1" fill="#d9706a"/>`;
  if (m === 'o') s += `<ellipse cx="${f1(mX)}" cy="${mY + 1}" rx="2" ry="2.5" fill="${dark}"/>`;
  if (m === 'talk') s += `<path d="M${f1(mX - 4.6)} ${mY} Q${f1(mX)} ${f1(mY + 1.5 + talk * 4.2)} ${f1(mX + 4.6)} ${mY}Z" fill="${dark}"/><path d="M${f1(mX - 3.8)} ${mY + .2} L${f1(mX + 3.8)} ${mY + .2}" stroke="#fff" stroke-width="1" opacity="${f1(talk)}"/>`;
  if (m === 'talkSad') s += `<ellipse cx="${f1(mX)}" cy="${f1(mY + 1.2)}" rx="3.2" ry="${f1(.8 + talk * 2)}" fill="${dark}"/>`;
  if (mus) s += `<path d="M${f1(-8.5 + mX)} -161.5 Q${f1(mX)} -165.5 ${f1(8.5 + mX)} -161.5" stroke="${shade(c.beardColor || hairC, -.05)}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  // cabelo da frente (com mechas)
  const str = (arr) => arr.map(d => `<path d="${d}" stroke="${shade(hairC, .3)}" stroke-width="1" fill="none" opacity=".55"/>`).join('');
  if (hs === 'short') s += `<path d="M-20 -178 Q-22 -203 0 -204 Q22 -203 20 -178 Q16 -193 4 -192 Q-6 -197 -12 -190 Q-16 -186 -20 -178Z" fill="${hairF}"/>` + str(['M-10 -200 Q-4 -196 2 -198', 'M4 -201 Q10 -196 14 -194']);
  if (hs === 'wavy') s += `<path d="M-21 -176 Q-24 -205 0 -206 Q24 -205 21 -176 Q19 -190 12 -194 Q6 -190 2 -195 Q-4 -190 -10 -194 Q-18 -190 -21 -176Z" fill="${hairF}"/><path d="M-21 -176 Q-23 -166 -20 -156 M21 -176 Q23 -166 20 -156" stroke="${hairC}" stroke-width="5" fill="none" stroke-linecap="round"/>` + str(['M-14 -200 Q-8 -194 -4 -198', 'M6 -202 Q10 -196 16 -194']);
  if (hs === 'curly') s += [[-16, -190], [-8, -199], [2, -201], [11, -198], [18, -188], [-20, -180], [20, -178], [-3, -195]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 7 ? 5 : 7.5}" fill="${hairF}"/><path d="M${x - 3} ${y} q3 -3 6 0" stroke="${shade(hairC, .3)}" stroke-width="1" fill="none" opacity=".7"/>`).join('');
  if (hs === 'wild') s += `<path d="M-22 -178 L-29 -190 L-20 -192 L-25 -205 L-12 -200 L-8 -213 L0 -203 L8 -213 L12 -200 L25 -205 L20 -192 L29 -190 L22 -178 Q12 -194 0 -194 Q-12 -194 -22 -178Z" fill="${hairF}"/>`;
  if (hs === 'longF') s += `<path d="M-22 -170 Q-25 -205 0 -205 Q25 -205 22 -170 Q18 -190 6 -194 Q0 -188 -6 -194 Q-18 -190 -22 -170Z" fill="${hairF}"/>` + str(['M-16 -198 Q-12 -190 -6 -193', 'M6 -199 Q12 -192 18 -186']) + (c.flower ? `<g transform="translate(-17,-192)">${[0, 1, 2, 3, 4].map(k => `<circle cx="${f1(Math.cos(k * 1.256) * 3)}" cy="${f1(Math.sin(k * 1.256) * 3)}" r="2.4" fill="${c.flower}"/>`).join('')}<circle r="1.6" fill="#f2c23b"/></g>` : '');
  if (hs === 'braid') s += `<path d="M-21 -176 Q-22 -204 0 -205 Q22 -204 21 -176 Q14 -195 0 -196 Q-14 -195 -21 -176Z" fill="${hairF}"/><path d="M-20 -186 Q0 -192 20 -186" stroke="${c.necklace || '#2a9d8f'}" stroke-width="2.6" fill="none"/>${[-12, -4, 4, 12].map(k => `<circle cx="${k}" cy="${f1(-189.5 - Math.abs(k) * -.1)}" r="1.2" fill="#e3b13b"/>`).join('')}`;
  if (hs === 'bald') s += `<path d="M-21 -170 Q-24 -188 -18 -192 Q-13 -182 -16 -167Z M21 -170 Q24 -188 18 -192 Q13 -182 16 -167Z" fill="${hairF}"/><ellipse cx="-6" cy="-194" rx="7" ry="2.6" fill="#fff" opacity=".3"/><path d="M-6 -199 q6 -2 12 0" stroke="${shade(skin, -.25)}" stroke-width=".7" fill="none" opacity=".6"/>`;
  if (hs === 'veil') s += `<path d="M-25 -170 Q-28 -208 0 -209 Q28 -208 25 -170 Q20 -197 0 -198 Q-20 -197 -25 -170Z" fill="${gLin(c.veil, .2, -.2)}"/><path d="M-14 -194 Q0 -199 14 -194 Q10 -188 0 -189 Q-10 -188 -14 -194Z" fill="${hairF}"/><path d="M-24 -184 Q0 -200 24 -184" stroke="${shade(c.veil, -.22)}" stroke-width="1.2" fill="none"/>`;
  return s;
}
// multidão (mesma escala, cada um com sua expressão)
function crowd(t, y, n, seed, s = 1, opts = {}) {
  const who = ['povo1', 'povo2', 'povo3', 'povo4', 'povo5'];
  let r = '';
  for (let i = 0; i < n; i++) {
    const x = (opts.x0 ?? -40) + i * (opts.gap ?? 70) + rnd(seed + i) * 20 + (opts.walk ? (t * (opts.speed || 20)) % (opts.gap ?? 70) : 0);
    r += person({ who: who[(i + seed) % 5], x, y: y + rnd(seed + i * 2) * 16, s: s * (0.95 + rnd(i) * .1), t, seed: i + seed, walk: opts.walk || 0, look: opts.look ?? (rnd(i) - .5), pose: opts.pose, flip: opts.flip, emo: opts.emo || (i % 3 ? 'neutral' : 'happy'), talk: opts.talk && i % 2 === 0 });
  }
  return r;
}
