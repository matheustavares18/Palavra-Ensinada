#!/bin/bash
# mixar.sh <narracao.wav> <trilha.wav> <saida.wav>: voz na frente, trilha abaixando sob a voz, volume final -14 LUFS (YouTube)
# Os dois loudnorm (modo dinâmico) seguram ~3 s de áudio no fim: por isso as entradas recebem 6 s de silêncio extra
# (apad) e a saída é cortada no tamanho certo. Sem isso, os últimos segundos da voz sumiam.
set -e
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
ffmpeg -y -v error -i "$1" -i "$2" -filter_complex "\
[0:a]aresample=48000,aformat=channel_layouts=stereo,apad=pad_dur=6,loudnorm=I=-16:TP=-2:LRA=9,asplit=2[v][vs];\
[1:a]aresample=48000,apad=pad_dur=6,volume=0.5[m];\
[m][vs]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=500:makeup=1[md];\
[v][md]amix=inputs=2:normalize=0:duration=longest,apad=pad_dur=6,loudnorm=I=-14:TP=-1.5:LRA=11[out]" -map "[out]" -ar 48000 -t $(python3 -c "print($DUR+2.5)") "$3"
