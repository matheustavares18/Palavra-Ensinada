// ===== Ícones/adesivos de palavra-chave (desenhados em caixa 64x64, centro 0,0) =====
const ICONS = {
  star: () => starShape(0, 0, 24, '#ffd84d'),
  sun: () => `<circle r="15" fill="#ffb627"/>${rays(0, 0, 10, 28, '#ffb627', 1, 0, .12)}<circle r="13" fill="#ffd84d"/>`,
  moon: () => `<path d="M8 -22 A22 22 0 1 0 8 22 A16 16 0 1 1 8 -22Z" fill="#f3efd6"/><circle cx="-6" cy="-4" r="3" fill="#d8d2b4"/><circle cx="-2" cy="9" r="2" fill="#d8d2b4"/>`,
  galaxy: () => `<g>${[0, 1, 2].map(i => `<path d="M0 0 Q${14} ${-20} 26 ${-4}" transform="rotate(${i * 120})" stroke="#c9b6ff" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}<circle r="7" fill="#fff6c9"/></g>`,
  idol: () => `<rect x="-14" y="-6" width="28" height="22" fill="#b8862f"/><circle cy="-14" r="12" fill="#f0c04a"/>${rays(0, -14, 8, 20, '#f0c04a', 1, 0, .1)}<path d="M-24 -26 L24 22 M24 -26 L-24 22" stroke="#d64545" stroke-width="6" stroke-linecap="round"/>`,
  heart: () => `<path d="M0 18 C-26 0 -22 -20 -10 -20 C-4 -20 0 -14 0 -10 C0 -14 4 -20 10 -20 C22 -20 26 0 0 18Z" fill="#e0475b"/>`,
  person: () => `<circle cy="-12" r="9" fill="#d9a77c"/><path d="M-14 18 Q-14 0 0 0 Q14 0 14 18Z" fill="#7d8fa3"/>`,
  steps: () => `<g fill="#c9a26b"><ellipse cx="-9" cy="10" rx="6" ry="10"/><ellipse cx="9" cy="-8" rx="6" ry="10"/><circle cx="-13" cy="-4" r="2"/><circle cx="-6" cy="-4" r="2"/><circle cx="5" cy="-22" r="2"/><circle cx="12" cy="-22" r="2"/></g>`,
  hourglass: () => `<path d="M-14 -22 L14 -22 L2 0 L14 22 L-14 22 L-2 0Z" fill="#f3e6c8" stroke="#8b5a2b" stroke-width="3"/><path d="M-8 16 L8 16 L0 6Z" fill="#d7a352"/><path d="M-6 -16 L6 -16 L0 -8Z" fill="#d7a352"/>`,
  scroll: () => `<rect x="-16" y="-20" width="32" height="40" fill="#f3e6c8"/><rect x="-20" y="-24" width="40" height="8" rx="4" fill="#c9a26b"/><rect x="-20" y="16" width="40" height="8" rx="4" fill="#c9a26b"/><path d="M-10 -8 H10 M-10 0 H10 M-10 8 H6" stroke="#8b5a2b" stroke-width="2"/>`,
  light: () => `${glow(0, 0, 30, '#fff3c4', 1)}<circle r="9" fill="#fff8de"/>`,
  ark: () => `<path d="M-26 0 L26 0 L20 12 L-20 12Z" fill="#8b5a2b"/><rect x="-16" y="-12" width="32" height="12" fill="#9c6a35"/><path d="M-19 -12 L0 -20 L19 -12Z" fill="#6e4520"/><path d="M-30 18 Q-15 12 0 18 Q15 24 30 18" stroke="#58a6d6" stroke-width="3" fill="none"/>`,
  basket: () => `<path d="M-24 -6 Q-26 12 -16 14 L16 14 Q26 12 24 -6Z" fill="#c08a3e"/><path d="M-24 -6 Q0 -2 24 -6" stroke="#7a4e1c" stroke-width="3" fill="none"/><circle cx="8" cy="-8" r="6" fill="#d9a77c"/><path d="M-30 20 Q-15 14 0 20 Q15 26 30 20" stroke="#58a6d6" stroke-width="3" fill="none"/>`,
  wave: () => `<path d="M-26 0 Q-13 -12 0 0 Q13 12 26 0" stroke="#58a6d6" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-26 12 Q-13 0 0 12 Q13 24 26 12" stroke="#3b88c2" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  hebrew: () => `<text y="12" font-family="DejaVu Sans, sans-serif" font-size="30" text-anchor="middle" fill="#ffd84d" font-weight="bold">תבה</text>`,
  crown: () => `<path d="M-22 12 L-22 -10 L-11 2 L0 -16 L11 2 L22 -10 L22 12Z" fill="#e3b13b"/><rect x="-22" y="10" width="44" height="6" fill="#c9962a"/>`,
  dune: () => `<path d="M-28 14 Q-10 -12 6 4 Q16 -6 28 14Z" fill="#e0b56a"/><circle cx="12" cy="-14" r="7" fill="#ffb627"/>`,
  baby: () => `<ellipse cx="-4" cy="6" rx="16" ry="10" fill="#f3ede0"/><circle cx="12" cy="-4" r="10" fill="#d9a77c"/><path d="M8 -4 q1.5 1.2 3 0 M14 -4 q1.5 1.2 3 0" stroke="#3b2616" stroke-width="1.2" fill="none"/>`,
  drop: () => `<path d="M0 -22 Q16 0 12 10 Q8 20 0 20 Q-8 20 -12 10 Q-16 0 0 -22Z" fill="#4fb6e0"/><ellipse cx="-4" cy="6" rx="3" ry="5" fill="#bdeaff"/>`,
  tag: () => `<path d="M-24 -12 L12 -12 L24 0 L12 12 L-24 12Z" fill="#f3e6c8" stroke="#c9a26b" stroke-width="2"/><circle cx="12" cy="0" r="3" fill="#c9a26b"/><path d="M-16 0 H4" stroke="#7a2131" stroke-width="3"/>`,
  ear: () => `<path d="M-4 -20 Q16 -22 16 -2 Q16 8 6 12 Q2 14 2 20 Q0 26 -8 22" stroke="#d9a77c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M2 -8 Q8 -8 8 -2 Q8 2 4 4" stroke="#b9876a" stroke-width="3" fill="none"/><path d="M-20 -6 q-4 6 0 12 M-26 -10 q-6 10 0 20" stroke="#ffd84d" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  eye: () => `<path d="M-26 0 Q0 -22 26 0 Q0 22 -26 0Z" fill="#fff"/><circle r="9" fill="#6b4a2a"/><circle r="4" fill="#1b1b1b"/><circle cx="3" cy="-3" r="2" fill="#fff"/>`,
  tear: () => `<path d="M0 -16 Q10 0 8 8 Q4 16 0 16 Q-4 16 -8 8 Q-10 0 0 -16Z" fill="#7cc6ef"/>`,
  leaf: () => figLeaf(0, 22, 1.5, 0, '#4f9b45'),
  fur: () => `<path d="M-22 -16 L22 -16 L26 16 L14 10 L4 18 L-6 10 L-16 18 L-26 14Z" fill="#a8743f"/><path d="M-12 -6 q3 4 0 8 M4 -8 q3 4 0 8 M12 4 q3 4 0 8" stroke="#7d5126" stroke-width="2" fill="none"/>`,
  chain: () => `<g fill="none" stroke="#9aa3ad" stroke-width="5"><ellipse cx="-14" cy="0" rx="10" ry="7"/><ellipse cx="0" cy="0" rx="10" ry="7" stroke="#c3cad1"/><ellipse cx="14" cy="0" rx="10" ry="7"/></g>`,
  lamb: () => sheep(-4, 16, .8, 0),
  cross: () => `<rect x="-4" y="-24" width="8" height="48" fill="#8b5a2b"/><rect x="-16" y="-14" width="32" height="7" fill="#8b5a2b"/>`,
  gift: () => `<rect x="-18" y="-6" width="36" height="24" fill="#e0475b"/><rect x="-21" y="-14" width="42" height="9" fill="#c73a4d"/><rect x="-3" y="-14" width="6" height="32" fill="#ffd84d"/><path d="M0 -14 Q-14 -28 -12 -16 M0 -14 Q14 -28 12 -16" stroke="#ffd84d" stroke-width="3" fill="none"/>`,
  key: () => `<circle cx="-12" cy="0" r="10" fill="none" stroke="#ffd84d" stroke-width="5"/><path d="M-2 0 H24 M16 0 V8 M22 0 V6" stroke="#ffd84d" stroke-width="5" stroke-linecap="round"/>`,
  hands: () => `<path d="M-20 10 Q-22 -10 -12 -20 L-8 -8 L-2 -22 L2 -8 L-4 12Z" fill="#d9a77c"/><path d="M20 10 Q22 -10 12 -20 L8 -8 L2 -22 L-2 -8 L4 12Z" fill="#c99064" opacity=".9"/>`,
  book: () => `<path d="M-24 -14 L0 -10 L24 -14 L24 14 L0 18 L-24 14Z" fill="#5a1f22"/><path d="M-21 -14 L0 -11 L0 16 L-21 12Z" fill="#fbf3de"/><path d="M21 -14 L0 -11 L0 16 L21 12Z" fill="#f2e7cb"/>`,
  bell: () => `<path d="M-16 10 Q-16 -16 0 -18 Q16 -16 16 10 L20 14 L-20 14Z" fill="#ffd84d"/><circle cy="18" r="4" fill="#e3b13b"/>`,
  harp: () => `<path d="M-14 16 Q-22 -16 0 -22 L14 -18 L14 16Z" fill="none" stroke="#e3b13b" stroke-width="4"/><path d="M-6 -14 V14 M0 -16 V14 M6 -16 V14" stroke="#f3e2b0" stroke-width="1.5"/>`,
  sparkle: () => starShape(0, 0, 22, '#fff3c4', 0) + starShape(16, -14, 8, '#ffd84d'),
  bigsmall: () => `<circle cx="-8" cy="0" r="16" fill="#ffb627"/><circle cx="16" cy="6" r="8" fill="#f3efd6"/>`,
  candleOut: () => `<rect x="-6" y="-6" width="12" height="26" rx="2" fill="#f3e6c8"/><path d="M0 -8 q-6 -8 2 -14 q-2 6 4 10" stroke="#aaa" stroke-width="2" fill="none"/>`,
  dove: () => dove(-4, 4, 1, 0),
  rain: () => `<ellipse cx="0" cy="-8" rx="22" ry="11" fill="#9aa8b8"/><path d="M-12 8 l-3 10 M0 8 l-3 10 M12 8 l-3 10" stroke="#58a6d6" stroke-width="3" stroke-linecap="round"/>`,
  pyramid: () => pyramid(0, 18, .3),
  seed: () => `<ellipse cx="0" cy="8" rx="7" ry="10" fill="#8b5a2b"/><path d="M0 -2 Q-4 -18 -16 -20 Q-6 -8 0 -2 Q4 -18 16 -22 Q6 -8 0 -2" fill="#4f9b45"/>`,
  people: () => `<circle cx="-12" cy="-8" r="7" fill="#c98f62"/><circle cx="12" cy="-8" r="7" fill="#d9a77c"/><circle cy="-12" r="8" fill="#b97d55"/><path d="M-24 18 Q-24 0 -12 0 Q0 0 0 18 M0 18 Q0 0 12 0 Q24 0 24 18" fill="#5b7a8c"/><path d="M-12 18 Q-12 -4 0 -4 Q12 -4 12 18Z" fill="#a86b3c"/>`,
};
// palavra-chave → ícone (sem acento, minúsculas; casa início de palavra)
const KEYWORDS = [
  ['estrelas', 'star'], ['estrela', 'star'], ['sol', 'sun'], ['lua', 'moon'], ['luzeiros', 'bigsmall'], ['luzeiro', 'bigsmall'],
  ['divindades', 'idol'], ['deuses', 'idol'], ['adoracao', 'idol'], ['galaxias', 'galaxy'], ['universo', 'galaxy'], ['ceus', 'galaxy'],
  ['criador', 'sparkle'], ['criacao', 'sparkle'], ['importa', 'heart'], ['davi', 'harp'], ['salmo', 'harp'],
  ['morreu', 'candleOut'], ['morte', 'candleOut'], ['genealogia', 'scroll'], ['nomes', 'scroll'], ['trezentos', 'hourglass'],
  ['caminhada', 'steps'], ['caminhar', 'steps'], ['andou', 'steps'], ['comunhao', 'heart'], ['agradado', 'heart'], ['testemunho', 'scroll'],
  ['presenca', 'light'], ['tomou', 'light'], ['arca', 'ark'], ['teba', 'hebrew'], ['hebraica', 'hebrew'], ['cesto', 'basket'],
  ['diluvio', 'rain'], ['aguas', 'wave'], ['nilo', 'wave'], ['rio', 'wave'], ['farao', 'crown'], ['egito', 'pyramid'],
  ['lembrou', 'dove'], ['nacao', 'people'], ['pequeno', 'seed'], ['deserto', 'dune'], ['gravida', 'baby'], ['filho', 'baby'],
  ['fonte', 'drop'], ['nome', 'tag'], ['ouve', 'ear'], ['ouviu', 'ear'], ['ve', 'eye'], ['via', 'eye'], ['el roi', 'eye'],
  ['aflicao', 'tear'], ['dores', 'tear'], ['sofrimento', 'tear'], ['folhas', 'leaf'], ['figueira', 'leaf'], ['peles', 'fur'], ['vestimentas', 'fur'],
  ['pecado', 'chain'], ['animal', 'lamb'], ['cordeiro', 'lamb'], ['cruz', 'cross'], ['graca', 'gift'], ['redencao', 'key'], ['salvacao', 'key'],
  ['maos', 'hands'], ['biblia', 'book'], ['escrituras', 'book'], ['genesis', 'book'], ['inscreva', 'bell'], ['notificacoes', 'bell'],
  ['jornada', 'steps'], ['provisao', 'gift'], ['provê', 'gift'], ['prove', 'gift'], ['ismael', 'ear'],
];
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function findKeyword(text) {
  const n = norm(text);
  let best = null;
  for (const [k, ic] of KEYWORDS) {
    const re = new RegExp('(^|[^a-z])' + k.replace(' ', '\\s') + '([^a-z]|$)');
    const m = re.exec(n);
    if (m && (!best || m.index < best.idx)) best = { k, ic, idx: m.index };
  }
  return best;
}
