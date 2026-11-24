"""Trilha instrumental original + efeitos sonoros sintetizados (sem material de terceiros).
uso: python3 trilha.py <timeline.json> <saida.wav>
Tudo é gerado por síntese (numpy): música livre de direitos, feita para o canal."""
import sys, json, wave, numpy as np

SR = 32000
rng = np.random.default_rng(7)

def env_ar(n, a, r):
    e = np.ones(n); a = min(int(a * SR), n // 2); r = min(int(r * SR), n // 2)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.linspace(1, 0, r)
    return e

def band(x, lo, hi, soft=0.15):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.clip((f - lo * (1 - soft)) / (lo * soft + 1e-9), 0, 1) * np.clip((hi * (1 + soft) - f) / (hi * soft + 1e-9), 0, 1)
    return np.fft.irfft(X * m, len(x))

def norm(x, peak=1.0):
    m = np.max(np.abs(x)) or 1
    return x / m * peak

def midi(n): return 440 * 2 ** ((n - 69) / 12)

# ---------------- MÚSICA ----------------
def music(total):
    n = int(total * SR); L = np.zeros(n); R = np.zeros(n)
    # Ré maior, contemplativa: D - Bm - G - A / D - F#m - G - A (6 s por acorde)
    prog = [[50, 57, 62, 66, 69], [47, 54, 62, 66, 71], [43, 55, 62, 67, 71], [45, 57, 61, 64, 69],
            [50, 57, 62, 66, 69], [42, 54, 61, 66, 69], [43, 55, 59, 62, 67], [45, 57, 61, 64, 69]]
    dur = 6.0
    t = 0.0; k = 0
    while t < total:
        ch = prog[k % len(prog)]; ns = int(t * SR); m = int(min(dur + 2.0, total - t) * SR)
        if m <= 0: break
        tt = np.arange(m) / SR; e = env_ar(m, 1.6, 2.2)
        for j, note in enumerate(ch):
            f = midi(note); amp = (.22 if j == 0 else .12) * (1 + .15 * np.sin(2 * np.pi * .1 * tt + j))
            v = (np.sin(2 * np.pi * f * tt) + .35 * np.sin(2 * np.pi * 2 * f * tt) + .12 * np.sin(2 * np.pi * 3 * f * tt)) * amp * e
            v2 = np.sin(2 * np.pi * f * 1.003 * tt) * amp * .6 * e
            pan = .5 + (j - 2) * .12
            L[ns:ns + m] += (v + v2 * .5) * (1 - pan); R[ns:ns + m] += (v * .8 + v2) * pan
        # arpejo de "piano" suave (notas do acorde, oitava acima)
        arp = [ch[2] + 12, ch[3] + 12, ch[4] + 12, ch[3] + 12]
        for i in range(int(dur / 1.5)):
            note = arp[i % 4]; s0 = ns + int(i * 1.5 * SR); mm = int(3.0 * SR)
            if s0 + mm > n: break
            tt2 = np.arange(mm) / SR; f = midi(note); vel = .07 * (0.8 + .4 * rng.random())
            p = (np.sin(2 * np.pi * f * tt2) + .5 * np.sin(2 * np.pi * 2 * f * tt2) * np.exp(-tt2 * 3) + .2 * np.sin(2 * np.pi * 3 * f * tt2) * np.exp(-tt2 * 5)) * np.exp(-tt2 * 1.6) * vel
            p[:80] *= np.linspace(0, 1, 80); pan = .3 + .4 * rng.random()
            L[s0:s0 + mm] += p * (1 - pan); R[s0:s0 + mm] += p * pan
        t += dur; k += 1
    return L, R

def reverb(x, secs=2.4, mix=.35):
    m = int(secs * SR); ir = rng.standard_normal(m) * np.exp(-np.arange(m) / SR * 3.2); ir = band(ir, 200, 6000); ir /= np.sqrt(np.sum(ir ** 2))
    out = np.zeros(len(x) + m); B = 1 << 18
    IR = np.fft.rfft(ir, B + m)
    for i in range(0, len(x), B):
        seg = x[i:i + B]; y = np.fft.irfft(np.fft.rfft(seg, B + m) * IR, B + m)
        out[i:i + len(seg) + m] += y[:len(seg) + m]
    return x * (1 - mix) + out[:len(x)] * mix

# ---------------- EFEITOS ----------------
def noise(n): return rng.standard_normal(n)
def brown(n):
    b = np.cumsum(rng.standard_normal(n)); b -= np.convolve(b, np.ones(4001) / 4001, 'same'); return b / (np.std(b) + 1e-9)

def bed(kind, n, tt):
    if kind == 'rain':
        r = band(noise(n), 1200, 9000) * .5; drops = np.zeros(n); idx = rng.integers(0, n, n // 300); drops[idx] = rng.random(len(idx))
        drops = band(drops, 2000, 8000) * 3; return r + drops + bed('waves', n, tt) * 1.2
    if kind == 'waves': return band(brown(n), 60, 900) * (.6 + .4 * np.sin(2 * np.pi * .14 * tt)) * .8
    if kind == 'calm': return band(brown(n), 80, 1200) * (.5 + .3 * np.sin(2 * np.pi * .12 * tt)) * .5
    if kind == 'river': return band(noise(n), 400, 3500) * (.8 + .2 * np.sin(2 * np.pi * 3.1 * tt) * np.sin(2 * np.pi * .7 * tt)) * .35
    if kind == 'wind': return band(noise(n), 250, 1400) * (.4 + .6 * (.5 + .5 * np.sin(2 * np.pi * .09 * tt + 1) * np.sin(2 * np.pi * .23 * tt))) * .6
    if kind == 'fire':
        c = np.zeros(n); idx = rng.integers(0, n, max(1, n // 2500)); c[idx] = rng.random(len(idx)) ** 2
        return band(c, 800, 7000) * 6 + band(brown(n), 40, 300) * .25
    if kind == 'crowd': return band(noise(n), 300, 2500) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 1.7 * tt) * np.sin(2 * np.pi * .9 * tt + 2))) * .35
    if kind == 'night':
        c = np.zeros(n); f = 4600
        for s0 in range(0, n, int(.9 * SR)):
            for k in range(3):
                a = s0 + int(k * .07 * SR); m = int(.04 * SR)
                if a + m < n: c[a:a + m] += np.sin(2 * np.pi * f * np.arange(m) / SR) * np.hanning(m) * .25
        return c + bed('wind', n, tt) * .3
    return np.zeros(n)

def birds(n):
    out = np.zeros(n); t = 0
    while True:
        t += rng.uniform(.6, 2.4); s0 = int(t * SR)
        if s0 >= n: break
        f0 = rng.uniform(2200, 4200)
        for k in range(rng.integers(2, 5)):
            m = int(rng.uniform(.05, .12) * SR); a = s0 + int(k * .13 * SR)
            if a + m >= n: break
            tt = np.arange(m) / SR; sweep = f0 * (1 + rng.uniform(-.3, .4) * tt / tt[-1])
            out[a:a + m] += np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.hanning(m) * rng.uniform(.2, .5)
    return out

def whoosh(d=.9):
    n = int(d * SR); x = noise(n); y = np.zeros(n)
    for i, k in enumerate(np.linspace(0, 1, 12)):
        a = int(i * n / 12); b = int((i + 1) * n / 12); y[a:b] = band(x[a:b], 200 + 2500 * k, 900 + 3500 * k)
    return y * np.sin(np.linspace(0, np.pi, n)) ** 2 * .9

def page_turn():
    n = int(.45 * SR); tt = np.arange(n) / SR; x = band(noise(n), 1500, 7000)
    return x * np.exp(-((tt - .15) / .09) ** 2) * (1 + .5 * np.sin(2 * np.pi * 37 * tt)) * .8

def chime():
    n = int(2.2 * SR); tt = np.arange(n) / SR; y = np.zeros(n)
    for f, d in [(1568, 0), (1976, .06), (2349, .12)]:
        a = int(d * SR); y[a:] += np.sin(2 * np.pi * f * tt[:n - a]) * np.exp(-tt[:n - a] * 2.6) * .3
    return y

BEDS = {'arkStorm': ['rain'], 'arkCalm': ['calm', 'birds'], 'arkBoard': ['birds', 'wind'], 'nile': ['river', 'birds'], 'jordan': ['river', 'birds'],
        'eden': ['river', 'birds'], 'enoch': ['birds', 'wind'], 'luminaries': ['birds'], 'hagar': ['wind'], 'tent': ['wind'], 'idols': ['wind', 'fire'],
        'exodusCrowd': ['wind', 'crowd'], 'crowdAlone': ['crowd'], 'stars': ['night', 'fire'], 'david': ['night', 'fire'], 'bibleIntro': ['fire'],
        'scroll': ['fire'], 'cross': ['wind']}
LEVEL = {'rain': .09, 'waves': .06, 'calm': .05, 'river': .05, 'wind': .05, 'fire': .035, 'crowd': .05, 'night': .022, 'birds': .05}

def main(js, out):
    d = json.load(open(js)); total = d['total']; n = int(total * SR) + SR
    L, R = music(total + 1)
    L = reverb(L); R = reverb(R)
    musL = norm(L, .32)[:n]; musR = norm(R, .32)[:n]
    fx = np.zeros((2, n))
    def add(sig, t0, gain, pan=.5):
        a = int(t0 * SR)
        if a < 0: sig = sig[-a:]; a = 0
        b = min(n, a + len(sig))
        if b > a: fx[0, a:b] += sig[:b - a] * gain * (1 - pan) * 2; fx[1, a:b] += sig[:b - a] * gain * pan * 2
    for bl in d['blocks']:
        sc = bl['sc']; p = bl['p'] or {}
        key = ('arkBoard' if p.get('board') else 'arkCalm' if p.get('calm') else 'arkStorm') if sc == 'ark' else sc
        kinds = BEDS.get(key, [])
        a = max(0, bl['s'] - .3); b = min(total, bl['e'] + .3); m = int((b - a) * SR)
        if m <= SR // 4: continue
        tt = np.arange(m) / SR; e = env_ar(m, .45, .45)
        for k in kinds:
            sig = (birds(m) if k == 'birds' else bed(k, m, tt)); sig = sig / (np.std(sig) + 1e-9) * LEVEL[k]
            pan = .5 + rng.uniform(-.15, .15); add(sig * e, a, 1, pan)
    add(page_turn(), .2, .5, .55)
    for s in d['segs']:
        if s.get('banner'): add(whoosh(), s['s'] - .35, .16, .5)
        c = s.get('card') or {}
        if c.get('impact'): add(chime(), s['s'] + .15, .1, .5)
        if s.get('badge'): add(chime(), s['s'] + .3, .06, .6)
        if s['sc'] == 'themeTitle': add(whoosh(1.2), s['s'] - .2, .2, .5); add(chime(), s['s'] + .4, .12, .5)
        if s['sc'] == 'end' and s['sec'] in ('end', 'cta'): add(chime(), s['s'] + .2, .12, .5)
    # fades gerais
    fade = np.ones(n); fi = int(.6 * SR); fo = int(2.5 * SR); fade[:fi] = np.linspace(0, 1, fi)
    endn = int(total * SR); fade[max(0, endn - fo):endn] *= np.linspace(1, 0, min(fo, endn)); fade[endn:] = 0
    Lm = (musL + fx[0]) * fade; Rm = (musR + fx[1]) * fade
    pk = max(np.max(np.abs(Lm)), np.max(np.abs(Rm)))
    if pk > .7: Lm *= .7 / pk; Rm *= .7 / pk
    st = (np.stack([Lm, Rm], 1) * 32767).astype(np.int16)
    with wave.open(out, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
    print('ok', out, round(total, 1), 's')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
