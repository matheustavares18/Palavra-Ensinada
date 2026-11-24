"""Narração final com Gemini TTS (voz padrão do canal: Sadaltager).
uso: python3 tools/narrar.py <timeline_full.json> <pasta_saida> [modelo]
Gera poucos pedidos (cota gratuita pequena): gancho+parte 1 · parte 2 · parte 3 · parte 4 · parte 5+fechamento ·
falas extras dos Shorts (aberturas + chamada). Pula grupos já gerados."""
import json, os, sys, base64, subprocess, urllib.request, pathlib, time
VOICE = 'Sadaltager'
STYLE = ("Leia em português do Brasil, como narrador de um canal cristão no YouTube: voz acolhedora e reverente, "
         "porém em ritmo ágil e dinâmico, um pouco mais rápido que o normal, sem arrastar as palavras e com pausas curtas")
key = [l.split('=', 1)[1].strip() for l in open(os.path.expanduser('~/.config/palavra/env')) if l.startswith('GEMINI_API_KEY')][0]

def tts_text(t):
    return t.replace('dEle', 'dele').replace('"', '')

def say(text, model, out):
    body = {"contents": [{"parts": [{"text": STYLE + ":\n\n" + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                                 data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key})
    d = json.load(urllib.request.urlopen(req, timeout=600))
    part = d['candidates'][0]['content']['parts'][0]['inlineData']; mt = part.get('mimeType', '')
    pcm = base64.b64decode(part['data'])
    inp = ['-i', '-'] if 'wav' in mt else ['-f', 's16le', '-ar', (mt.split('rate=')[1].split(';')[0] if 'rate=' in mt else '24000'), '-ac', '1', '-i', '-']
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *inp, '-ar', '48000', out], input=pcm, check=True)

def groups(tl, shorts):
    segs = tl['segs']; G = []
    by = lambda f: [s['t'] for s in segs if f(s['sec'])]
    G.append(('g1', by(lambda x: x in ('hook', 1))))
    for n in (2, 3, 4): G.append((f'g{n}', by(lambda x, n=n: x == n)))
    G.append(('g5', by(lambda x: x == 5)))
    G.append(('g6', by(lambda x: x == 'end')))  # fechamento separado: pedidos longos perdem qualidade no fim
    G.append(('extras', shorts))
    return G

if __name__ == '__main__':
    tl = json.load(open(sys.argv[1])); outd = pathlib.Path(sys.argv[2]); outd.mkdir(exist_ok=True)
    model = sys.argv[3] if len(sys.argv) > 3 else 'gemini-2.5-flash-preview-tts'
    shorts = json.load(open(outd / 'extras.json')) if (outd / 'extras.json').exists() else []
    for name, lines in groups(tl, shorts):
        f = outd / f'{name}.wav'
        if f.exists() or not lines: continue
        json.dump(lines, open(outd / f'{name}.json', 'w'), ensure_ascii=False)
        text = '\n\n'.join(tts_text(l) for l in lines)
        t0 = time.time()
        for tent in range(4):
            try: say(text, model, str(f)); break
            except urllib.error.HTTPError as e:
                msg = e.read()[:300].decode(errors='ignore')
                if e.code == 429 and tent < 3: print('limite por minuto, aguardando 65 s'); time.sleep(65); continue
                print('ERRO', name, e.code, msg); sys.exit(1)
        dur = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(f)], capture_output=True, text=True).stdout.strip()
        print('ok', name, len(text), 'caracteres →', dur, 's', f'({time.time() - t0:.0f}s)', flush=True)
        time.sleep(25)
