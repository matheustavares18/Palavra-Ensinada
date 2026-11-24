"""Alinhamento forçado (palavra a palavra, por trecho de legenda) entre o texto e a narração real.
Método: cada trecho de legenda é falado por uma voz sintética local (espeak-ng, pt-BR), com fronteiras conhecidas;
depois o DTW (librosa) compara os coeficientes MFCC da voz sintética com a narração e transfere os tempos.
uso (importado por alinhar.py): forced_group(wav_alvo, lista_de_falas_com_trechos) -> [(ini, fim, [(c_ini, c_fim), ...]), ...]"""
import subprocess, tempfile, pathlib, numpy as np, librosa, hashlib

SR = 16000; HOP = 160  # 10 ms
CACHE = pathlib.Path(tempfile.gettempdir()) / 'espeak_cache'; CACHE.mkdir(exist_ok=True)

def speak(text):
    h = hashlib.md5(text.encode()).hexdigest(); f = CACHE / f'{h}.wav'
    if not f.exists():
        subprocess.run(['espeak-ng', '-v', 'pt-br', '-s', '175', '-w', str(f), text], check=True, capture_output=True)
    y, _ = librosa.load(str(f), sr=SR)
    # tira silêncio das pontas do trecho
    nz = np.where(np.abs(y) > 0.01)[0]
    return y[nz[0]:nz[-1] + 1] if len(nz) else y

def feats(y):
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=21, n_fft=512, hop_length=HOP)[1:]
    e = librosa.feature.rms(y=y, frame_length=512, hop_length=HOP)
    e = np.log(e + 1e-4); m = np.vstack([m, e * 3])
    m = (m - m.mean(1, keepdims=True)) / (m.std(1, keepdims=True) + 1e-6)
    return m

def silences(y, thr_db=-38, min_d=.12):
    r = librosa.feature.rms(y=y, frame_length=512, hop_length=HOP)[0]; db = 20 * np.log10(r + 1e-9)
    s = db < thr_db; out = []; i = 0; n = len(s)
    while i < n:
        if s[i]:
            j = i
            while j < n and s[j]: j += 1
            if (j - i) * HOP / SR >= min_d: out.append((i * HOP / SR, j * HOP / SR))
            i = j
        else: i += 1
    return out

def forced_group(target_wav, lines):
    """lines: lista de falas; cada fala = lista de trechos de legenda (texto)."""
    y, _ = librosa.load(str(target_wav), sr=SR)
    ref = []; bounds = []; t = 0.0
    gap_c, gap_l = np.zeros(int(.06 * SR)), np.zeros(int(.32 * SR))
    ref.append(np.zeros(int(.2 * SR))); t = .2
    for li, chunks in enumerate(lines):
        lb = []
        for ci, c in enumerate(chunks):
            a = speak(c); lb.append((t, t + len(a) / SR)); ref.append(a); t += len(a) / SR
            g = gap_c if ci < len(chunks) - 1 else gap_l; ref.append(g); t += len(g) / SR
        bounds.append(lb)
    r = np.concatenate(ref)
    X, Y = feats(r), feats(y)
    _, wp = librosa.sequence.dtw(X=X, Y=Y, metric='euclidean', step_sizes_sigma=np.array([[1, 1], [0, 1], [1, 0]]),
                                 weights_add=np.array([0, .15, .15]), backtrack=True)
    wp = wp[::-1]
    # ref frame -> tempo alvo (mediana dos pares, monotônico)
    nR = X.shape[1]; mp = np.zeros(nR); cnt = np.zeros(nR)
    acc = {}
    for i, j in wp: acc.setdefault(i, []).append(j)
    for i in range(nR): mp[i] = np.median(acc[i]) if i in acc else (mp[i - 1] if i else 0)
    mp = np.maximum.accumulate(mp) * HOP / SR
    def tmap(sec): k = min(nR - 1, max(0, int(round(sec * SR / HOP)))); return float(mp[k])
    sil = silences(y)
    def snap(tt, kind, rad=.22):
        # início de trecho: fim do silêncio mais próximo; fim de trecho: começo do silêncio mais próximo
        best = tt; bd = rad
        for a, b in sil:
            p = b if kind == 'start' else a
            if abs(p - tt) < bd: bd = abs(p - tt); best = p
        return best
    out = []
    for lb in bounds:
        cs = []
        for (a, b) in lb:
            cs.append([snap(tmap(a), 'start'), snap(tmap(b), 'end')])
        for k in range(1, len(cs)):  # coerência
            if cs[k][0] < cs[k - 1][1]: m = (cs[k][0] + cs[k - 1][1]) / 2; cs[k - 1][1] = m; cs[k][0] = m
        for c in cs:
            if c[1] < c[0] + .2: c[1] = c[0] + .2
        out.append((cs[0][0], cs[-1][1], cs))
    return out, len(y) / SR, sil
