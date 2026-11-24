// Miniatura 1280x720 do vídeo "5 coisas que você talvez nunca percebeu em Gênesis"
function thumbSVG() {
  DEFS = {}; _uid = 0;
  const t = 1.3; let s = '';
  s += `<defs><linearGradient id="tb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a0f2e"/><stop offset=".55" stop-color="#3a1f3a"/><stop offset="1" stop-color="#7a3a1a"/></linearGradient></defs><rect width="1280" height="720" fill="url(#tb)"/>`;
  s += glow(860, 600, 420, '#ffcf6a', .5) + rays(860, 470, 22, 900, '#ffe7a0', .06, 0, .05);
  s += `<g opacity=".8">${starsField(0, 90, 5, 0, 300)}</g>`.replace(/cx="(-?[\d.]+)"/g, (m, x) => `cx="${(+x + 300) * 1.4}"`);
  // arca com animais sobre as águas calmas
  s += `<g transform="translate(640,0)">${water(0, 560, '#2f6f9a', '#bfe6ff', 5, .6).replace(/-400/g, '-700').replace(new RegExp('width="1376"'), 'width="1400"')}</g>`;
  s += ark(860, 560, 1.25, 0, 0, { animals: 1, calm: 1 });
  // Bíblia aberta brilhando na frente
  s += bibleBook(850, 640, 1.05, t, .6, 0, 'GÊNESIS', .9);
  // Noé surpreso, grande, à direita
  s += person({ who: 'noe', x: 1160, y: 1010, s: 2.9, t, look: -.6, emo: 'surprise', pose: 'surprise', staff: 0 });
  // Agar à esquerda da Bíblia, menor
  s += person({ who: 'agar', x: 610, y: 860, s: 1.7, t, look: .6, lookY: -1, emo: 'awe', pose: 'chest' });
  // texto
  const gold = def('impG', '<linearGradient id="impG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#ffd84d"/><stop offset="1" stop-color="#d79a20"/></linearGradient>');
  s += `<defs><linearGradient id="lf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".75" stop-color="#000" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect x="0" y="0" width="720" height="720" fill="url(#lf)"/>`;
  s += `<g font-family="Cinzel, serif" font-weight="900" stroke="#1a0d00" stroke-linejoin="round" paint-order="stroke">
    <text x="46" y="200" font-size="190" fill="${gold}" stroke-width="12">5</text>
    <text x="180" y="150" font-size="70" fill="${gold}" stroke-width="10">COISAS</text>
    <text x="180" y="200" font-family="Liberation Sans, Arial" font-weight="bold" font-size="34" fill="#fff" stroke-width="8">QUE VOCÊ</text>
    <text x="46" y="300" font-family="Liberation Sans, Arial" font-weight="bold" font-size="58" fill="#fff" stroke-width="10">NUNCA PERCEBEU</text>
    <text x="46" y="360" font-family="Liberation Sans, Arial" font-weight="bold" font-size="44" fill="#fff" stroke-width="9">EM</text>
    <text x="40" y="490" font-size="118" fill="${gold}" stroke-width="14">GÊNESIS</text></g>`;
  s += `<g transform="translate(60,560)" font-family="Liberation Sans, Arial" font-weight="bold">${['star', 'steps', 'hebrew', 'eye', 'fur'].map((ic, i) => `<g transform="translate(${i * 92},40)"><circle r="38" fill="#fff6cf" stroke="#ffd84d" stroke-width="5"/><g transform="scale(1)">${ICONS[ic]().replace(/#ffd84d/g, ic === 'hebrew' ? '#8a1c2b' : '#e0a820')}</g></g>`).join('')}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs>${Object.values(DEFS).join('')}<filter id="tsh"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity=".8"/></filter></defs>${s}</svg>`;
}
