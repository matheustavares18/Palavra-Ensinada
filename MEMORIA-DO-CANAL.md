# Memória do canal Palavra Ensinada

Regras registradas a partir das correções do usuário. Todo vídeo novo já nasce seguindo isto.

## Voz / narração
- **A voz só é gerada na versão final, depois que o vídeo for aprovado.** Antes disso, as prévias saem
  sem voz, com legendas e tempos estimados (≈14,5 caracteres por segundo). Nada de gastar créditos
  gerando voz em versões que ainda vão mudar.
- Ferramenta de voz preferida: **Google AI Studio (Gemini TTS, gratuito)**. ElevenLabs só se o usuário pedir
  (a conta conectada é do plano gratuito, ~10 mil caracteres/mês, não dá para um vídeo longo).
- Na versão final: o texto inteiro numa gravação só; as legendas são realinhadas pelo áudio real
  (ffmpeg silencedetect).
- Chave do Google AI Studio: o usuário já forneceu (guardada fora do repositório, em `~/.config/palavra/env`,
  nunca commitada nem repetida nas respostas). Modelos de voz disponíveis na conta: `gemini-3.8-flash-tts`,
  `gemini-2.5-pro-preview-tts` e outros. Usar só na versão final aprovada.
