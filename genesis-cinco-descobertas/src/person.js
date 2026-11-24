// ===== Personagens padronizados (base: referência de Jesus), cada um com individualidade =====
const CAST = {
  jesus: { skin: '#d9a77c', robe: '#7d8fa3', sash: '#7a2131', hair: '#5b3a22', hairStyle: 'wavy', beard: 'short', beardColor: '#3d2616' },
  adao: { skin: '#cf9a6e', hair: '#4a2c17', hairStyle: 'short', beard: 'short', beardColor: '#3a2212', garment: 'leaves' },
  eva: { skin: '#d8a982', hair: '#3a2112', hairStyle: 'longF', female: true, garment: 'leaves' },
  enoque: { skin: '#cf9e72', robe: '#d8c7a3', sash: '#8b5a2b', hair: '#6b6258', hairStyle: 'wavy', beard: 'medium', beardColor: '#7a7066', age: 'mid' },
  noe: { skin: '#d4a27a', robe: '#8b6a48', sash: '#4c6a3a', hair: '#ecebe6', hairStyle: 'bald', beard: 'long', beardColor: '#f2f1ec', age: 'old' },
  joquebede: { skin: '#c98f62', robe: '#c48a3d', sash: '#5b3a6e', hair: '#2e1c10', hairStyle: 'veil', veil: '#e9dcc0', female: true },
  agar: { skin: '#9c6a45', robe: '#efe7d6', sash: '#2a9d8f', hair: '#17110c', hairStyle: 'braid', female: true, pregnant: true },
  sarai: { skin: '#d6a47c', robe: '#6c4a7d', sash: '#d7a84a', hair: '#8c8278', hairStyle: 'veil', veil: '#cbb9d6', female: true, age: 'old' },
  anjo: { skin: '#e3b891', robe: '#fbf8ef', sash: '#e8c66a', hair: '#c9a46a', hairStyle: 'short', beard: 'none', angel: true },
  davi: { skin: '#dcaa80', robe: '#5f7f4a', sash: '#a0522d', hair: '#8a3b1c', hairStyle: 'curly', beard: 'light', beardColor: '#8a3b1c' },
  joao: { skin: '#c99064', hair: '#2f1d10', hairStyle: 'wild', beard: 'long', beardColor: '#2f1d10', garment: 'camel' },
  moises: { skin: '#cf9a6e', robe: '#8a3b2a', sash: '#d7a84a', hair: '#ecebe6', hairStyle: 'wavy', beard: 'long', beardColor: '#e8e6e0', age: 'old', staff: true },
  povo1: { skin: '#c98f62', robe: '#a86b3c', sash: '#2f4f6f', hair: '#2b1a0e', hairStyle: 'short', beard: 'short', beardColor: '#2b1a0e' },
  povo2: { skin: '#b97d55', robe: '#5b7a8c', sash: '#c9a14a', hair: '#1f140c', hairStyle: 'veil', veil: '#d8c9a8', female: true },
  povo3: { skin: '#d3a27a', robe: '#7d5a7a', sash: '#e0c070', hair: '#3a2414', hairStyle: 'curly', beard: 'medium', beardColor: '#3a2414' },
  povo4: { skin: '#a8714a', robe: '#c7b48a', sash: '#8b2f2f', hair: '#1a110a', hairStyle: 'braid', female: true },
  homem: { skin: '#d9a77c', robe: '#4f6d8a', sash: '#c9a14a', hair: '#3a2414', hairStyle: 'short', beard: 'light', beardColor: '#3a2414', modern: true },
};

function person(o) {
  const c = Object.assign({}, CAST[o.who] || {}, o);
  const t = c.t || 0, s = c.s || 1, seed = c.seed || 0;
  const skin = c.skin || '#d9a77c', skinS = shade(skin, -0.2);
  const robe = c.robe || '#7d8fa3', robeS = shade(robe, -0.22), robeL = shade(robe, 0.15);
  const hairC = c.hair || '#4a2c17';
  const ph = c.walk ? t * c.walk * Math.PI * 2 : 0;
  const wv = c.walk ? Math.sin(ph) : 0;
  const bob = c.walk ? -Math.abs(Math.sin(ph)) * 3 : Math.sin(t * 1.7 + seed) * 1.1;
  const lx = (c.look || 0) * 5, ly = (c.lookY || 0) * 3;
  const kneel = c.pose === 'kneel' || c.pose === 'bow';
  const bow = c.pose === 'bow';
  const sit = c.pose === 'sit';
  let out = `<g transform="translate(${f1(c.x)},${f1(c.y)}) scale(${f1(s * (c.flip ? -1 : 1))},${f1(s)})"${c.op != null ? ` opacity="${c.op}"` : ''}>`;
  if (c.angel) out += glow(0, -110, 150, '#fff6d2', .9);
  out += `<ellipse cx="0" cy="0" rx="${sit || kneel ? 46 : 34}" ry="6" fill="rgba(0,0,0,.22)"/>`;
  let g = `<g transform="translate(0,${f1(bob + (kneel ? 42 : 0) + (sit ? 40 : 0))})${bow ? ' rotate(0)' : ''}">`;
  const garment = c.garment || 'robe';
  const short = garment !== 'robe';
  // pés / pernas
  if (!kneel && !sit) {
    if (short) g += `<rect x="${f1(-15 + wv * 6)}" y="-60" width="11" height="58" rx="5" fill="${skin}"/><rect x="${f1(4 - wv * 6)}" y="-60" width="11" height="58" rx="5" fill="${skinS}"/>`;
    g += foot(-10 + wv * 7, -3, skin) + foot(10 - wv * 7, -3, skin);
  } else {
    g += `<ellipse cx="-24" cy="-6" rx="14" ry="6" fill="${short ? skin : robeS}"/><ellipse cx="24" cy="-6" rx="14" ry="6" fill="${short ? skin : robeS}"/>`;
  }
  // corpo
  const hem = kneel || sit ? -40 : (short ? -52 : -10);
  const hw = kneel || sit ? 46 : 36;
  const sway = wv * 3;
  const belly = c.pregnant ? 10 : 0;
  const bodyPath = `M-14 -150 Q-29 -148 -31 -134 L${f1(-hw + sway)} ${hem} Q0 ${hem + 9} ${f1(hw + sway)} ${hem} L${31 + belly * .3} -110 Q${31 + belly} -80 31 -60 L31 -134 Q29 -148 14 -150Z`;
  // braço de trás (esquerdo) antes do corpo
  const arms = armPose(c, t);
  if (garment === 'robe') {
    g += `<path d="${bodyPath}" fill="${robe}"/>`;
    g += `<path d="M-12 -95 L${f1(-20 + sway)} ${hem + 4} M8 -90 L${f1(16 + sway)} ${hem + 4} M-2 -60 L${f1(-2 + sway)} ${hem + 6}" stroke="${robeS}" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>`;
    g += `<path d="M-28 -132 L-30 -100" stroke="${robeL}" stroke-width="3" opacity=".5"/>`;
    if (c.cloak) g += `<path d="M-30 -140 Q-40 -60 ${f1(-hw - 4 + sway)} ${hem} L-18 ${hem} Q-22 -80 -16 -146Z" fill="${c.cloak}"/>`;
    g += `<path d="M-12 -150 L0 -131 L12 -150" fill="${skin}" stroke="${robeS}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const sy = c.pregnant ? -100 : -96;
    g += `<path d="M-30 ${sy} Q0 ${sy + 5} ${30 + belly * .6} ${sy} L${30 + belly * .6} ${sy + 10} Q0 ${sy + 15} -31 ${sy + 10}Z" fill="${c.sash || '#7a2131'}"/>`;
    if (!kneel && !sit) g += `<path d="M6 ${sy + 12} L${f1(2 + sway)} ${sy + 46} M12 ${sy + 12} L${f1(14 + sway)} ${sy + 42}" stroke="${c.sash || '#7a2131'}" stroke-width="5" stroke-linecap="round"/>`;
    if (c.pregnant) g += `<path d="M6 -104 Q46 -96 42 -66 Q38 -44 10 -46Z" fill="${robe}"/><path d="M14 -98 Q40 -90 38 -68" stroke="${robeS}" stroke-width="2.4" fill="none" opacity=".6"/><ellipse cx="22" cy="-80" rx="10" ry="12" fill="#fff" opacity=".25"/>`;
  } else if (garment === 'leaves') {
    g += `<path d="M-14 -150 Q-29 -148 -29 -134 L-30 -60 L30 -60 L29 -134 Q29 -148 14 -150Z" fill="${skin}"/>`;
    let lv = '';
    const tunic = c.female ? [[-150, -60]] : [[-100, -50]];
    for (let yy = (c.female ? -140 : -100); yy <= -50; yy += 12) for (let xx = -30; xx <= 30; xx += 13) lv += figLeaf(xx + (yy % 24 ? 6 : 0), yy + 18, .75, 180 + Math.sin(xx + yy) * 25, (xx + yy) % 3 ? '#4f9b45' : '#3d8a3a');
    if (!c.female) lv = `<path d="M-30 -102 L30 -102 L32 -52 L-32 -52Z" fill="#3f8f3b"/>` + lv;
    else lv = `<path d="M-14 -150 Q-29 -148 -30 -134 L-32 -52 L32 -52 L30 -134 Q29 -148 14 -150Z" fill="#3f8f3b"/>` + lv;
    g += lv;
  } else if (garment === 'skins') {
    g += `<path d="M-14 -150 Q-29 -148 -31 -134 L-34 -50 L-24 -44 L-14 -52 L-2 -44 L10 -52 L22 -44 L34 -50 L31 -134 Q29 -148 14 -150Z" fill="#a8743f"/>`;
    for (let i = 0; i < 14; i++) g += `<path d="M${f1(-26 + rnd(i + 3) * 52)} ${f1(-140 + rnd(i * 5) * 85)} q3 4 0 8" stroke="#7d5126" stroke-width="2" fill="none"/>`;
    g += `<ellipse cx="-12" cy="-110" rx="8" ry="5" fill="#8a5a2c" opacity=".6"/><ellipse cx="14" cy="-80" rx="9" ry="6" fill="#8a5a2c" opacity=".6"/><path d="M-12 -150 L0 -138 L12 -150" fill="${skin}"/><path d="M-31 -98 L31 -98" stroke="#6b4423" stroke-width="5"/>`;
  } else if (garment === 'camel') {
    g += `<path d="M-14 -150 Q-29 -148 -31 -134 L-34 -50 L-26 -46 L-18 -52 L-8 -45 L4 -52 L14 -45 L24 -52 L34 -48 L31 -134 Q29 -148 14 -150Z" fill="#b8925a"/>`;
    for (let i = 0; i < 26; i++) { const xx = -28 + rnd(i + 9) * 56, yy = -145 + rnd(i * 7) * 92; g += `<path d="M${f1(xx)} ${f1(yy)} l${f1(-2 + rnd(i) * 4)} 7" stroke="#8c6a37" stroke-width="1.6"/>`; }
    g += `<path d="M-32 -96 Q0 -90 32 -96 L32 -88 Q0 -82 -32 -88Z" fill="#5b3a1e"/><rect x="-4" y="-96" width="9" height="9" fill="#c9a14a"/>`;
  }
  // pescoço
  g += `<rect x="-6" y="-160" width="12" height="14" fill="${skinS}"/>`;
  // braços
  g += arm(c, -28, -138, arms.L, skin, garment, robe, robeS);
  g += arm(c, 28, -138, arms.R, skin, garment, robe, robeS);
  if (c.staff) g += `<line x1="${arms.R[0] + 4}" y1="${arms.R[1] - 70}" x2="${arms.R[0] + 4}" y2="${hem + 10}" stroke="#6b4826" stroke-width="5" stroke-linecap="round"/>`;
  if (c.harp) g += `<g transform="translate(-2,-100)"><path d="M-14 0 Q-20 -36 0 -44 L14 -40 L14 4Z" fill="none" stroke="#b07a2a" stroke-width="5"/>${[0, 1, 2, 3].map(k => `<line x1="${-10 + k * 6}" y1="-36" x2="${-10 + k * 6}" y2="0" stroke="#f3e2b0" stroke-width="1"/>`).join('')}</g>`;
  // cabeça
  g += head(c, t, lx, ly, seed);
  g += `</g>`;
  out += g + `</g>`;
  return out;
}
function foot(x, y, skin) {
  return `<g transform="translate(${f1(x)},${f1(y)})"><ellipse cx="0" cy="0" rx="10" ry="5" fill="${skin}"/><path d="M-10 3 L10 3" stroke="#5a3a1c" stroke-width="2.5" stroke-linecap="round"/><path d="M-6 -3 L4 2 M6 -3 L-4 2" stroke="#7a5130" stroke-width="1.6"/></g>`;
}
function armPose(c, t) {
  const sw = c.walk ? Math.sin(t * c.walk * Math.PI * 2) * 10 : 0;
  const g = Math.sin(t * 2.2 + (c.seed || 0)) * 6;
  switch (c.pose) {
    case 'raise': return { L: [-52, -205 + g * .3], R: [52, -205 - g * .3] };
    case 'open': return { L: [-66, -120], R: [66, -120] };
    case 'pray': return { L: [-5, -112], R: [5, -112] };
    case 'point': return { L: [-34 - sw * .3, -62], R: [78, -150 + g * .2] };
    case 'pointUp': return { L: [-34, -62], R: [44, -215] };
    case 'hold': return { L: [-20, -84], R: [20, -84] };
    case 'belly': return { L: [-12, -78], R: [32, -64] };
    case 'face': return { L: [-12, -158], R: [12, -158] };
    case 'talk': return { L: [-34, -62], R: [54 + g, -110 - g] };
    case 'offer': return { L: [-40, -100], R: [40, -100] };
    case 'kneel': case 'bow': return { L: [-14, -104], R: [14, -104] };
    case 'sit': return { L: [-30, -70], R: [30, -70] };
    case 'cover': return { L: [-16, -96], R: [16, -112] };
    default: return { L: [-34 - sw, -60], R: [34 + sw, -60] };
  }
}
function arm(c, sx, sy, h, skin, garment, robe, robeS) {
  const [hx, hy] = h; const mx = (sx + hx) / 2, my = (sy + hy) / 2;
  const dx = hx - sx, dy = hy - sy, len = Math.hypot(dx, dy) || 1;
  const bend = Math.max(0, 62 - len) * 0.6 + 6;
  const ex = mx + (-dy / len) * bend * Math.sign(sx), ey = my + (dx / len) * bend * Math.sign(sx);
  const sleeve = garment === 'robe' ? robe : skin;
  let s = `<path d="M${sx} ${sy} Q${f1(ex)} ${f1(ey)} ${f1(hx)} ${f1(hy)}" stroke="${sleeve}" stroke-width="${garment === 'robe' ? 15 : 10}" fill="none" stroke-linecap="round"/>`;
  if (garment === 'robe') s += `<path d="M${sx} ${sy} Q${f1(ex)} ${f1(ey)} ${f1(hx)} ${f1(hy)}" stroke="${robeS}" stroke-width="2" fill="none" opacity=".35" transform="translate(${Math.sign(sx) * 4},0)"/>`;
  // mão com dedos
  const a = Math.atan2(hy - ey, hx - ex);
  s += `<g transform="translate(${f1(hx)},${f1(hy)}) rotate(${f1(a * 57.3 - 90)})"><ellipse cx="0" cy="3" rx="6" ry="7" fill="${skin}"/>${[-3.5, -1.2, 1.2, 3.5].map(k => `<rect x="${f1(k - 1.1)}" y="6" width="2.2" height="${k === -3.5 || k === 3.5 ? 4 : 5.5}" rx="1.1" fill="${skin}"/>`).join('')}<ellipse cx="${-6 * Math.sign(sx)}" cy="2" rx="2" ry="3.4" fill="${skin}" transform="rotate(${-30 * Math.sign(sx)} ${-6 * Math.sign(sx)} 2)"/><path d="M-3 9 L-3 6 M0 9.5 L0 6 M3 9 L3 6" stroke="${shade(skin, -.25)}" stroke-width=".6"/></g>`;
  return s;
}
function head(c, t, lx, ly, seed) {
  const skin = c.skin || '#d9a77c', skinS = shade(skin, -0.2), hairC = c.hair || '#4a2c17';
  const hs = c.hairStyle || 'short';
  let s = '';
  // cabelo de trás
  if (hs === 'longF') s += `<path d="M-24 -182 Q-30 -130 -22 -112 L22 -112 Q30 -130 24 -182Z" fill="${hairC}"/>`;
  if (hs === 'wavy') s += `<path d="M-22 -180 Q-27 -150 -20 -140 Q-14 -144 -14 -150 L14 -150 Q14 -144 20 -140 Q27 -150 22 -180Z" fill="${hairC}"/>`;
  if (hs === 'veil') s += `<path d="M-26 -190 Q-34 -140 -32 -116 L32 -116 Q34 -140 26 -190Z" fill="${c.veil}"/>`;
  if (hs === 'braid') s += `<path d="M14 -170 Q24 -150 20 -122" stroke="${hairC}" stroke-width="9" fill="none" stroke-linecap="round"/>${[0, 1, 2].map(i => `<ellipse cx="${20 + i * 0.5}" cy="${-150 + i * 10}" rx="5" ry="4" fill="${shade(hairC, .15)}"/>`).join('')}`;
  if (hs === 'wild') s += `<path d="M-26 -186 Q-36 -160 -26 -138 L26 -138 Q36 -160 26 -186Z" fill="${hairC}"/>`;
  // orelhas e rosto
  s += `<ellipse cx="-19" cy="-172" rx="4" ry="6" fill="${skinS}"/><ellipse cx="19" cy="-172" rx="4" ry="6" fill="${skinS}"/>`;
  s += `<path d="M-19 -182 Q-20 -158 -10 -152 Q0 -147 10 -152 Q20 -158 19 -182 Q18 -198 0 -198 Q-18 -198 -19 -182Z" fill="${skin}"/>`;
  s += `<ellipse cx="${f1(-9 + lx * .3)}" cy="-163" rx="4" ry="2.4" fill="#e27c6a" opacity=".22"/><ellipse cx="${f1(9 + lx * .3)}" cy="-163" rx="4" ry="2.4" fill="#e27c6a" opacity=".22"/>`;
  // barba
  const bc = c.beardColor || hairC;
  if (c.beard === 'short') s += `<path d="M-18 -172 Q-18 -152 -8 -148 Q0 -144 8 -148 Q18 -152 18 -172 Q16 -160 8 -158 Q0 -156 -8 -158 Q-16 -160 -18 -172Z" fill="${bc}"/>`;
  if (c.beard === 'medium') s += `<path d="M-18 -174 Q-19 -146 -6 -140 Q0 -137 6 -140 Q19 -146 18 -174 Q15 -160 8 -158 Q0 -156 -8 -158 Q-15 -160 -18 -174Z" fill="${bc}"/>`;
  if (c.beard === 'long') s += `<path d="M-19 -176 Q-22 -140 -4 -122 Q0 -119 4 -122 Q22 -140 19 -176 Q16 -160 8 -158 Q0 -156 -8 -158 Q-16 -160 -19 -176Z" fill="${bc}"/>`;
  if (c.beard === 'light') s += `<path d="M-17 -170 Q-14 -150 0 -148 Q14 -150 17 -170 Q12 -156 0 -155 Q-12 -156 -17 -170Z" fill="${bc}" opacity=".55"/>`;
  // olhos naturais
  const blink = ((t + seed * 1.7) % 4.1) < 0.12;
  const eyeY = -175 + ly;
  if (c.closed || blink) s += `<path d="M${f1(-10 + lx)} ${eyeY} q3 2 6 0 M${f1(4 + lx)} ${eyeY} q3 2 6 0" stroke="#3b2616" stroke-width="1.3" fill="none"/>`;
  else {
    for (const ex of [-7, 7]) {
      s += `<ellipse cx="${f1(ex + lx)}" cy="${eyeY}" rx="3.4" ry="2.4" fill="#fff"/><circle cx="${f1(ex + lx * 1.15)}" cy="${f1(eyeY + ly * .3)}" r="1.9" fill="#3b2616"/><circle cx="${f1(ex + lx * 1.15 + .6)}" cy="${f1(eyeY - .7)}" r=".55" fill="#fff"/><path d="M${f1(ex + lx - 3.6)} ${eyeY - .6} Q${f1(ex + lx)} ${eyeY - 3.4} ${f1(ex + lx + 3.6)} ${eyeY - .6}" stroke="#3b2616" stroke-width="1.1" fill="none"/>`;
    }
  }
  const browC = c.age === 'old' ? '#d8d4cc' : shade(hairC, -0.15);
  const browUp = c.sad ? 2 : 0;
  s += `<path d="M${f1(-11 + lx)} ${-181 + ly} Q${f1(-7 + lx)} ${-183 + ly - browUp} ${f1(-3 + lx)} ${-181 + ly + browUp}" stroke="${browC}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M${f1(3 + lx)} ${-181 + ly + browUp} Q${f1(7 + lx)} ${-183 + ly - browUp} ${f1(11 + lx)} ${-181 + ly}" stroke="${browC}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M${f1(lx * 1.1)} -173 q2 6 -1.5 7.5" stroke="${skinS}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  if (c.age === 'old') s += `<path d="M-8 -190 q8 -2 16 0 M-6 -186 q6 -1.5 12 0" stroke="${skinS}" stroke-width=".9" fill="none"/>`;
  // boca
  const talk = c.talk ? Math.abs(Math.sin(t * 11 + seed)) * 2.6 : 0;
  const mY = -159;
  if (c.beard === 'long' || c.beard === 'medium' || c.beard === 'short') s += `<path d="M${f1(-8 + lx * .6)} -161 Q${f1(lx * .6)} -165 ${f1(8 + lx * .6)} -161" stroke="${shade(c.beardColor || hairC, -.1)}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  if (talk > .4) s += `<ellipse cx="${f1(lx * .6)}" cy="${mY + 1}" rx="3.6" ry="${f1(talk)}" fill="#6a2a22"/>`;
  else if (c.sad) s += `<path d="M${f1(-4 + lx * .6)} ${mY + 2} Q${f1(lx * .6)} ${mY} ${f1(4 + lx * .6)} ${mY + 2}" stroke="#7a3a2a" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M${f1(-5 + lx * .6)} ${mY} Q${f1(lx * .6)} ${mY + 3.2} ${f1(5 + lx * .6)} ${mY}" stroke="#7a3a2a" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  // cabelo da frente
  if (hs === 'short') s += `<path d="M-20 -178 Q-22 -202 0 -203 Q22 -202 20 -178 Q16 -192 4 -192 Q-6 -196 -12 -190 Q-16 -186 -20 -178Z" fill="${hairC}"/>`;
  if (hs === 'wavy') s += `<path d="M-21 -176 Q-24 -204 0 -205 Q24 -204 21 -176 Q19 -190 12 -194 Q6 -190 2 -195 Q-4 -190 -10 -194 Q-18 -190 -21 -176Z" fill="${hairC}"/><path d="M-21 -176 Q-23 -166 -20 -158 M21 -176 Q23 -166 20 -158" stroke="${hairC}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (hs === 'curly') s += [[-16, -190], [-8, -199], [2, -201], [11, -198], [18, -188], [-20, -180], [20, -178]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7.5" fill="${hairC}"/>`).join('');
  if (hs === 'wild') s += `<path d="M-22 -178 L-28 -190 L-20 -192 L-24 -204 L-12 -200 L-8 -212 L0 -202 L8 -212 L12 -200 L24 -204 L20 -192 L28 -190 L22 -178 Q12 -194 0 -194 Q-12 -194 -22 -178Z" fill="${hairC}"/>`;
  if (hs === 'longF') s += `<path d="M-22 -172 Q-24 -204 0 -204 Q24 -204 22 -172 Q18 -190 6 -194 Q0 -188 -6 -194 Q-18 -190 -22 -172Z" fill="${hairC}"/>`;
  if (hs === 'braid') s += `<path d="M-21 -176 Q-22 -203 0 -204 Q22 -203 21 -176 Q14 -194 0 -195 Q-14 -194 -21 -176Z" fill="${hairC}"/><path d="M-20 -186 Q0 -192 20 -186" stroke="#2a9d8f" stroke-width="2.5" fill="none"/>`;
  if (hs === 'bald') s += `<path d="M-21 -170 Q-23 -186 -18 -190 Q-14 -180 -16 -168Z M21 -170 Q23 -186 18 -190 Q14 -180 16 -168Z" fill="${hairC}"/><ellipse cx="-6" cy="-194" rx="6" ry="2.5" fill="#fff" opacity=".25"/>`;
  if (hs === 'veil') s += `<path d="M-24 -170 Q-27 -207 0 -208 Q27 -207 24 -170 Q20 -196 0 -197 Q-20 -196 -24 -170Z" fill="${c.veil}"/><path d="M-14 -194 Q0 -199 14 -194 Q10 -188 0 -189 Q-10 -188 -14 -194Z" fill="${hairC}"/>`;
  if (c.angel) s += '';
  return s;
}
// multidão simples (mesma escala)
function crowd(t, y, n, seed, s = 1, opts = {}) {
  const who = ['povo1', 'povo2', 'povo3', 'povo4'];
  let r = '';
  for (let i = 0; i < n; i++) {
    const x = (opts.x0 ?? -40) + i * (opts.gap ?? 70) + rnd(seed + i) * 20 + (opts.walk ? (t * (opts.speed || 20)) % (opts.gap ?? 70) : 0);
    r += person({ who: who[(i + seed) % 4], x, y: y + rnd(seed + i * 2) * 16, s: s * (0.95 + rnd(i) * .1), t, seed: i + seed, walk: opts.walk || 0, look: opts.look ?? (rnd(i) - .5), pose: opts.pose, flip: opts.flip });
  }
  return r;
}
