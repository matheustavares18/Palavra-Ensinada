"""Gera a miniatura do YouTube: python3 tools/thumb.py  → miniatura-youtube.png (1280x720)"""
import pathlib, base64, subprocess
d = pathlib.Path(__file__).resolve().parent.parent
js = '\n'.join((d / 'src' / f).read_text() for f in ['lib.js', 'person.js', 'env.js', 'icons.js']) + '\n' + (d / 'tools' / 'thumb_scene.js').read_text()
b64 = base64.b64encode((d / 'fonts' / 'cinzel-latin-900-normal.woff2').read_bytes()).decode()
html = f'''<!doctype html><html><head><meta charset="utf-8"><style>@font-face{{font-family:Cinzel;font-weight:900;src:url(data:font/woff2;base64,{b64}) format("woff2")}}body{{margin:0;background:#000}}</style></head><body><span style="font-family:Cinzel;font-weight:900;position:absolute;opacity:0">Á</span><div id="s"></div><script>{js}
document.fonts.load('900 40px Cinzel').then(()=>{{document.getElementById('s').innerHTML=thumbSVG();document.title='ok'}});</script></body></html>'''
tmp = d / 'tools' / '_thumb.html'; tmp.write_text(html)
subprocess.run(['node', '-e', f"""const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1280,height:720}}}});await p.goto('file://{tmp}');await p.waitForFunction(()=>document.title==='ok');await p.screenshot({{path:'{d / 'miniatura-youtube.png'}'}});await b.close()}})()"""], check=True)
tmp.unlink(); print('ok miniatura-youtube.png')
