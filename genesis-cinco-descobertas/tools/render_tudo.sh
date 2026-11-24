#!/bin/bash
set -e
D=/home/user/Palavra-Ensinada/genesis-cinco-descobertas
H=$D/previa.html
OUT=$D/video
mkdir -p $OUT
cd /tmp/claude-0/pe
# 1) monta a página com os tempos atuais e confere a sincronia ANTES de renderizar
python3 $D/build.py
for m in full 1 2 3 4 5; do node $D/tools/export.js $H $m tl_$m.json; done
python3 $D/tools/conferir.py $D/narracao_final /tmp/claude-0/pe
for part in ${PARTS:-full 1 2 3 4 5}; do
  rm -rf fr_$part
  python3 $D/tools/trilha.py tl_$part.json trilha_$part.wav
  $D/tools/mixar.sh $D/narracao_final/narracao_$part.wav trilha_$part.wav mix_$part.wav
  for w in 0 1 2 3; do node render.js $H $part 24 1.875 $w 4 /tmp/claude-0/pe/fr_$part & done; wait
  name=$([ $part = full ] && echo "genesis-5-descobertas-completo" || echo "short-$part")
  ffmpeg -y -loglevel error -framerate 24 -i fr_$part/%06d.jpg -i mix_$part.wav -map 0:v -map 1:a -af apad -shortest -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart $OUT/$name-FINAL-v2.mp4
  rm -rf fr_$part
  echo "ok $part"
done
