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

## Duração
- Vídeo completo: **no máximo 10 min**. Shorts: **entre 1 e 2 min**.
- O corpo do roteiro do usuário não é alterado; para caber no tempo, encurtar gancho/fechamento, ritmo ágil de
  narração (~170 palavras/min), respiros curtos e títulos das partes só na tela (sem narração).
- Shorts: a mesma voz ~6% mais rápida; se ainda passar de 2 min, a frase de abertura do corte pode substituir a
  primeira frase da parte.

## Abertura e fechamento (padrão)
- Abertura curta e **provocativa**: desafio ao espectador + as 5 curiosidades em uma frase cada + título
  "5 coisas que você talvez nunca percebeu em [LIVRO]".
- Fechamento padrão: resumo ("Cinco detalhes. Cinco descobertas…"), atributos de Deus, convite para comentar e
  se inscrever, despedida do canal. **Não falar do próximo vídeo.** Imagem final: Bíblia aberta no centro, luz saindo
  de dentro dela, "Palavra Ensinada" centralizado.

## Tela
- Legendas: centralizadas na **parte de baixo** (≈75% da altura), com fundo escuro arredondado para leitura.
- Versículos: **só a referência na tela** (ex.: GÊNESIS 3:21); o narrador fala o que a passagem diz.
- Ilustração caprichada: aparência dos personagens tirada do texto bíblico quando ele descreve (Davi ruivo e de
  belos olhos, 1Sm 16:12; Noé com 600 anos, Gn 7:6; Agar egípcia, Gn 16:1; João com pelos de camelo, Mt 3:4),
  roupas com bordados, faixas e dobras, cenários com profundidade e vida, e reações faciais de acordo com cada fala
  (alegria, tristeza, choro, surpresa, vergonha, admiração, oração).
