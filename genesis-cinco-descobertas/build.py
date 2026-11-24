import pathlib
d = pathlib.Path(__file__).parent
js = '\n'.join((d/'src'/f).read_text() for f in ['lib.js','person.js','icons.js','scenes.js','timeline.js','main.js'])
html = (d/'src'/'page.html').read_text().replace('/*JS*/', js)
(d/'previa.html').write_text(html)
print('ok', len(html))
