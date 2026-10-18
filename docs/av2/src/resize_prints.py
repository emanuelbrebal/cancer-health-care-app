"""Gera cópias JPEG reduzidas (1x, 390 px) dos prints para embutir no DOCX.
Uso: python docs/av2/src/resize_prints.py"""
from pathlib import Path
from PIL import Image

base = Path(__file__).resolve().parent.parent / 'prints'
for stage in ('antes', 'depois'):
    out = base / 'docx' / stage
    out.mkdir(parents=True, exist_ok=True)
    for png in sorted((base / stage).glob('*.png')):
        im = Image.open(png).convert('RGB')
        im = im.resize((390, round(im.height * 390 / im.width)), Image.LANCZOS)
        im.save(out / (png.stem + '.jpg'), quality=82, optimize=True)
print('ok')
