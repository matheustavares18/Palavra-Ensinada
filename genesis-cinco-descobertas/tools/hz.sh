#!/bin/bash
set -e
D=/home/user/Palavra-Ensinada/genesis-cinco-descobertas; cd /tmp/claude-0/pe; rm -rf fr_h
for w in 0 1 2 3; do ORIENT=h node render_h.js $D/previa.html full 24 1.875 $w 4 /tmp/claude-0/pe/fr_h & done; wait
ffmpeg -y -loglevel error -framerate 24 -i fr_h/%06d.jpg -i $D/video/genesis-5-descobertas-completo-FINAL-v6.mp4 -map 0:v -map 1:a -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a copy -shortest -movflags +faststart $D/video/genesis-5-descobertas-HORIZONTAL-16x9.mp4
rm -rf fr_h; echo "ok horizontal"
