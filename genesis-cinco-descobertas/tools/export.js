// node tools/export.js <previa.html> <modo> <saida.json>  — exporta a linha do tempo (para áudio, legenda, capítulos)
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [html, mode, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + require('path').resolve(html) + '?render=1&part=' + mode);
  const d = await p.evaluate(() => ({
    total: TL.total,
    blocks: TL.blocks.map(b => ({ sc: b.sc, p: b.p, s: b.s, e: b.e })),
    segs: TL.segs.map(s => ({ t: s.t, sec: s.sec, sc: s.sc, s: s.s, e: s.e, banner: s.banner, card: s.card, badge: s.p && s.p.badge, chunks: s.chunks.map(c => ({ text: c.text, s: c.s, e: c.e })) })),
  }));
  fs.writeFileSync(out, JSON.stringify(d)); await b.close();
})();
