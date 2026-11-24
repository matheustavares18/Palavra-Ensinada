"""Capítulos (descrição do YouTube) e legenda .srt a partir da linha do tempo exportada.
uso: python3 tools/youtube.py <timeline_full.json>   (refazer quando a voz final existir)"""
import sys, json, pathlib
d = json.load(open(sys.argv[1])); out = pathlib.Path(__file__).resolve().parent.parent
def mmss(t): t = int(t); return f'{t // 60}:{t % 60:02d}'
def srt_t(t): h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}'
caps = [('0:00', 'Introdução')]
for s in d['segs']:
    if s.get('banner'): caps.append((mmss(s['s'] - .3), f"{s['banner']['n']}. {s['banner']['name']}"))
    if s['sec'] == 'end' and caps[-1][1] != 'Conclusão': caps.append((mmss(s['s'] - .2), 'Conclusão'))
(out / 'youtube-capitulos.txt').write_text('\n'.join(f'{a} {b}' for a, b in caps) + '\n')
lines = []; i = 1
for s in d['segs']:
    for c in s['chunks']:
        lines.append(f"{i}\n{srt_t(c['s'])} --> {srt_t(c['e'])}\n{c['text']}\n"); i += 1
(out / 'legenda.srt').write_text('\n'.join(lines))
print('\n'.join(f'{a} {b}' for a, b in caps))
