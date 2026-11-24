"""Conferência de sincronia antes de renderizar.
uso: python3 tools/conferir.py <pasta_narracao_final> <pasta_tl>  (tl_<modo>.json exportados da previa.html já montada)
Falha (código 1) se: os tempos da página diferirem de src/timings.js, ou se legendas aparecerem sem voz."""
import json, sys, pathlib, re, numpy as np, librosa
ND, TD = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
root = pathlib.Path(__file__).resolve().parent.parent
TIM = json.loads((root / 'src' / 'timings.js').read_text().split('= ', 1)[1].rstrip().rstrip(';'))
html = (root / 'previa.html').read_text(); emb = json.loads(re.search(r'window\.TIMINGS = (\{.*?\});\n', html).group(1))
ok = True
if emb != TIM: print('ERRO: previa.html não tem os tempos atuais (rode build.py)'); ok = False
for mode in ['full', '1', '2', '3', '4', '5']:
    tl = json.load(open(TD / f'tl_{mode}.json')); T = TIM[mode]
    y, sr = librosa.load(str(ND / f'narracao_{mode}.wav'), sr=16000)
    r = librosa.feature.rms(y=y, frame_length=400, hop_length=160)[0]; db = 20 * np.log10(r + 1e-9)
    voiced = db > (np.percentile(db, 95) - 30)
    def has_voice(a, b): i, j = int(a * 100), max(int(a * 100) + 1, int(b * 100)); return voiced[i:j].mean() if j <= len(voiced) else 0
    bad_t = 0; bad_v = 0; n = 0
    for i, s in enumerate(tl['segs']):
        if abs(s['s'] - T[i][0]) > .005 or abs(s['e'] - T[i][1]) > .005: bad_t += 1
        for c in s['chunks']:
            n += 1
            if has_voice(c['s'], min(c['e'], c['s'] + .6)) < .5: bad_v += 1
    tot_audio = len(y) / 16000
    print(f"{mode:>4}: falas={len(tl['segs'])} trechos={n} tempo≠narração={bad_t} legenda sem voz={bad_v} | vídeo {tl['total']:.1f}s, voz {tot_audio:.1f}s")
    if bad_t or bad_v > max(1, n * .03): ok = False
print('SINCRONIA OK' if ok else 'SINCRONIA COM PROBLEMA'); sys.exit(0 if ok else 1)
