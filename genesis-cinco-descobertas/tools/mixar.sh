#!/bin/bash
# mixar.sh <narracao.wav> <trilha.wav> <saida.wav>: voz na frente, trilha abaixando sob a voz, volume final -14 LUFS (YouTube)
set -e
ffmpeg -y -v error -i "$1" -i "$2" -filter_complex "\
[0:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-16:TP=-2:LRA=9,asplit=2[v][vs];\
[1:a]aresample=48000,volume=0.5[m];\
[m][vs]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=500:makeup=1[md];\
[v][md]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=11[out]" -map "[out]" -ar 48000 "$3"
