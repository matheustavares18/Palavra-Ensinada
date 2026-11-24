"""Alinha cada fala do roteiro à narração real (detecção de silêncio) e monta os áudios finais.
uso: python3 tools/alinhar.py <pasta_narracao_final> <timeline_full.json>
Saídas: src/timings.js (tempos de cada fala por modo) e narração montada para o vídeo completo e cada Short."""
import json, re, subprocess, sys, pathlib, wave, numpy as np

ND = pathlib.Path(sys.argv[1]); TL = json.load(open(sys.argv[2])); ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
LEAD, GAP_G, TAIL = 0.5, 0.7, 2.2
MAX_SHORT = 119.0

def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(f), '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

def save(x, f):
    x = np.clip(x, -1, 1); st = (x * 32767).astype(np.int16)
    with wave.open(str(f), 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())

def pauses(x, thr_db=-40, min_d=.16):
    win = int(.01 * SR); n = len(x) // win
    rms = np.sqrt(np.mean(x[:n * win].reshape(n, win) ** 2, 1) + 1e-12); db = 20 * np.log10(rms)
    sil = db < thr_db; out = []; i = 0
    while i < n:
        if sil[i]:
            j = i
            while j < n and sil[j]: j += 1
            if (j - i) * .01 >= min_d: out.append((i * .01, j * .01))
            i = j
        else: i += 1
    return out

def align(x, lines):
    """Alinhamento por pontuação: cada pausa da voz é ligada a uma vírgula/ponto/fim de fala do texto (DP monotônica),
    mantendo a velocidade da fala coerente. Devolve [(ini, fim)] de cada fala."""
    P = pauses(x); dur = len(x) / SR
    s0 = P[0][1] if P and P[0][0] < .05 else 0.0
    e0 = P[-1][0] if P and P[-1][1] > dur - .05 else dur
    Q = [p for p in P if p[0] > s0 + .15 and p[1] < e0 - .15]
    text = ''; ends = []
    for l in lines:
        text += l.replace('"', '') + ' '; ends.append(len(text) - 1)
    C = len(text)
    # âncoras: pontuação e fim de fala
    A = []
    for m in re.finditer(r'[.,:;?!…]+', text):
        A.append((m.end(), 'S' if re.search(r'[.?!…]', m.group()) else 'W'))
    endset = set(ends[:-1])
    A = sorted({a: t for a, t in A}.items())
    A = [(c, ('L' if any(abs(c - e) <= 1 for e in endset) else t)) for c, t in A if c < C - 2]
    for e in ends[:-1]:
        if not any(abs(c - e) <= 1 for c, _ in A): A.append((e, 'L'))
    A.sort()
    I, K = len(A), len(Q)
    speech = (e0 - s0) - sum(b - a for a, b in Q); r0 = C / max(speech, 1)
    skipP = {'L': 3.0, 'S': 1.6, 'W': .5}
    INF = 1e18
    # nós: 0 = início; 1..I*K = (i,k); fim = virtual
    best = {}; back = {}
    def tcost(c1, t1, c2, t2, skipped_len):
        d = max(t2 - t1 - skipped_len, .05); r = (c2 - c1) / d
        return 6 * np.log(max(r, 1e-3) / r0) ** 2
    starts = [(-1, -1, 0, s0)]
    best[(-1, -1)] = 0
    order = [(i, k) for i in range(I) for k in range(K)]
    for (i, k) in order:
        ci = A[i][0]; tk0, tk1 = Q[k]
        bc = INF; bb = None
        for (pi, pk), val in list(best.items()):
            if pi >= i or pk >= k or i - pi > 10 or k - pk > 7: continue
            cpi = 0 if pi < 0 else A[pi][0]; tpe = s0 if pk < 0 else Q[pk][1]
            sk = sum(Q[q][1] - Q[q][0] for q in range(pk + 1, k))
            c = val + tcost(cpi, tpe, ci, tk0, sk) + sum(skipP[A[q][1]] for q in range(pi + 1, i)) + sum(3 * (Q[q][1] - Q[q][0]) for q in range(pk + 1, k))
            c -= min(Q[k][1] - Q[k][0], .8) * (2.5 if A[i][1] == 'L' else 1.5 if A[i][1] == 'S' else .8)
            if c < bc: bc, bb = c, (pi, pk)
        if bb is not None: best[(i, k)] = bc; back[(i, k)] = bb
    # fechamento
    bc = INF; last = None
    for (pi, pk), val in best.items():
        cpi = 0 if pi < 0 else A[pi][0]; tpe = s0 if pk < 0 else Q[pk][1]
        sk = sum(Q[q][1] - Q[q][0] for q in range(pk + 1, K))
        c = val + tcost(cpi, tpe, C, e0, sk) + sum(skipP[A[q][1]] for q in range(pi + 1, I)) + sum(3 * (Q[q][1] - Q[q][0]) for q in range(pk + 1, K))
        if c < bc: bc, last = c, (pi, pk)
    match = {}; node = last
    while node and node[0] >= 0: match[node[0]] = node[1]; node = back[node]
    # pontos de ancoragem char→tempo
    pts = [(0, s0, s0)] + sorted((A[i][0], Q[k][0], Q[k][1]) for i, k in match.items()) + [(C, e0, e0)]
    def t_at(c, which):
        for (c1, a1, b1), (c2, a2, b2) in zip(pts, pts[1:]):
            if c1 <= c <= c2:
                if c == c1: return a1 if which == 'end' else b1
                if c == c2: return a2 if which == 'end' else b2
                return b1 + (a2 - b1) * (c - c1) / max(c2 - c1, 1)
        return e0
    res = []; st = s0
    for j, e in enumerate(ends):
        if j == len(ends) - 1: res.append((st, e0)); break
        ai = min(range(I), key=lambda q: abs(A[q][0] - e))
        if ai in match: en, nx = Q[match[ai]]
        else: en = nx = t_at(A[ai][0], 'end')
        res.append((st, en)); st = nx
    return res

# ---------- vídeo completo ----------
groups = ['g1', 'g2', 'g3', 'g4', 'g5']
full = [np.zeros(int(LEAD * SR))]; t = LEAD; T_full = []; audio_line = []  # audio_line: (amostra_ini, amostra_fim) de cada fala
for g in groups:
    x = load(ND / f'{g}.wav'); lines = json.load(open(ND / f'{g}.json'))
    al = align(x, lines)
    for (a, b) in al:
        T_full.append([round(t + a, 3), round(t + b, 3)]); audio_line.append((g, a, b))
    full.append(x); t += len(x) / SR + GAP_G; full.append(np.zeros(int(GAP_G * SR)))
assert len(T_full) == len(TL['segs']), (len(T_full), len(TL['segs']))
narr_full = np.concatenate(full)
save(narr_full, ND / 'narracao_full.wav')
print('completo:', round(len(narr_full) / SR + TAIL, 1), 's')

# ---------- Shorts: abertura + trecho da parte + chamada ----------
ex = load(ND / 'extras.wav'); ex_lines = json.load(open(ND / 'extras.json')); ex_al = align(ex, ex_lines)
gx = {g: load(ND / f'{g}.wav') for g in groups}
secs = [s['sec'] for s in TL['segs']]
timings = {'full': T_full}
skip = {5: 1}
for n in (1, 2, 3, 4, 5):
    idx = [i for i, s in enumerate(secs) if s == n][skip.get(n, 0):]
    g = audio_line[idx[0]][0]; assert all(audio_line[i][0] == g for i in idx)
    x = gx[g]; a0 = max(0, audio_line[idx[0]][1] - .05); b0 = audio_line[idx[-1]][2] + .08
    oa, ob = ex_al[n - 1]; ca, cb = ex_al[5]
    pieces = [np.zeros(int(.35 * SR)), ex[int(oa * SR):int(ob * SR)], np.zeros(int(.35 * SR)), x[int(a0 * SR):int(b0 * SR)], np.zeros(int(.45 * SR)), ex[int(ca * SR):int(cb * SR)]]
    y = np.concatenate(pieces)
    T = [[.35, .35 + ob - oa]]; base = .35 + (ob - oa) + .35
    for i in idx: T.append([round(base + audio_line[i][1] - a0, 3), round(base + audio_line[i][2] - a0, 3)])
    cst = base + (b0 - a0) + .45; T.append([round(cst, 3), round(cst + cb - ca, 3)])
    total = len(y) / SR + TAIL
    f = 1.0
    if total > MAX_SHORT:  # Shorts: ritmo um pouco mais ágil para caber em 2 min
        f = (len(y) / SR) / (MAX_SHORT - TAIL)
        tmp = ND / f'_s{n}.wav'; save(y, tmp)
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(tmp), '-af', f'atempo={f:.4f}', str(ND / f'_s{n}b.wav')], check=True)
        y = load(ND / f'_s{n}b.wav'); tmp.unlink(); (ND / f'_s{n}b.wav').unlink()
        T = [[round(a / f, 3), round(b / f, 3)] for a, b in T]
    save(y, ND / f'narracao_{n}.wav'); timings[str(n)] = T
    print(f'short {n}:', round(len(y) / SR + TAIL, 1), 's', f'(acelerado {f:.2f}x)' if f > 1 else '')

(ROOT / 'src' / 'timings.js').write_text('// Tempos reais de cada fala (gerado por tools/alinhar.py a partir da narração final)\nwindow.TIMINGS = ' + json.dumps(timings) + ';\n')
print('ok src/timings.js')
