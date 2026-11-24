// ===== Roteiro → linha do tempo. Cada fala tem cena, parâmetros e (opcional) cartão.
// sec: 'hook' | 1..5 | 'end'.  card: {v: versículo, ref} | {impact: texto}
const SCRIPT = [];
let _sec = 'hook';
const sec = s => (_sec = s);
const L = (t, sc, p = {}, card = null) => SCRIPT.push({ t, sc, p, card, sec: _sec });

// ---------- GANCHO ----------
sec('hook');
L('Você já leu Gênesis. Talvez várias vezes.', 'bibleIntro', { turn: 1 });
L('Mas e se eu te dissesse que existem detalhes nesse livro que podem mudar a maneira como você enxerga histórias que já conhece?', 'bibleIntro', { lens: 1 });
L('Em apenas uma frase, a Bíblia revela algo impressionante sobre as estrelas...', 'stars', { sweep: 1 });
L('No deserto, uma mulher estrangeira viveu uma experiência tão profunda que deu um nome ao próprio Deus.', 'hagar', { flee: 1, sad: 1 });
L('E, logo depois do primeiro pecado, um gesto de Deus antecipa algo que só seria plenamente revelado no Novo Testamento.', 'eden', { fig: 1, sad: 1, pick: 1 });
L('Essas coisas sempre estiveram na Bíblia. A questão é: será que você já percebeu?', 'bibleIntro', { lens: 1, glow: 1 });
L('Aqui é o Palavra Ensinada. E hoje vamos abrir o livro de Gênesis com outros olhos.', 'end');
L('Vamos começar!', 'bibleIntro', { turn: 1, glow: 1.2 });

// ---------- 1. AS ESTRELAS ----------
sec(1);
L('Primeira descoberta: as estrelas.', 'title', { n: 1, name: 'AS ESTRELAS', bg: 'stars', bgp: { who: 'none' } });
L('Em Gênesis, capítulo 1, versículo 16, a Bíblia apresenta dois grandes luzeiros: um para governar o dia e outro para governar a noite.', 'luminaries', {}, { v: 'Fez Deus os dois grandes luzeiros: o maior para governar o dia, e o menor para governar a noite; e fez também as estrelas.', ref: 'GÊNESIS 1:16' });
L('Mas existe um detalhe interessante nessa descrição.', 'luminaries', { k: 2 });
L('O texto não os identifica pelos nomes que conhecemos hoje: sol e lua. Ele os apresenta simplesmente como o maior e o menor dos luzeiros.', 'luminaries', { labels: 1 });
L('E isso pode ter um significado ainda mais profundo.', 'luminaries', { labels: 1, k: 2 });
L('Na cultura de muitos povos antigos, os astros eram associados a divindades e recebiam adoração.', 'idols', {});
L('Mas Gênesis apresenta uma perspectiva completamente diferente: o sol e a lua não são deuses, não possuem poder independente e não são dignos de adoração.', 'idols', { fall: 1 });
L('São apenas parte da criação, obras daquele que é o verdadeiro Deus.', 'luminaries', { k: 3 }, { impact: 'Criação, não *divindade*.' });
L('Mas espere, porque existe outro detalhe nesse mesmo versículo.', 'stars', { who: 'none' });
L('Depois de descrever os dois grandes luzeiros, o texto acrescenta uma expressão aparentemente simples: "e fez também as estrelas".', 'stars', { sweep: 1, look: -.3 }, { v: '“…e fez também as estrelas.”', ref: 'GÊNESIS 1:16' });
L('É como se toda a imensidão do céu noturno fosse mencionada em apenas uma frase.', 'stars', { px: 200 });
L('Hoje, sabemos que o universo é muito maior do que os olhos humanos conseguem contemplar.', 'galaxy', {});
L('Existem bilhões de galáxias, cada uma com incontáveis estrelas.', 'galaxy', { count: 1 });
L('E tudo isso nos leva a uma reflexão impressionante: aquele que criou a imensidão dos céus não se esqueceu de uma de suas criaturas.', 'stars', { heart: 1, pose: 'open' });
L('No Salmo 8, Davi contempla os céus e faz uma pergunta: diante de tamanha grandeza, o que é o homem para que Deus se lembre dele?', 'david', {}, { v: 'Quando contemplo os teus céus, obra dos teus dedos, e a lua e as estrelas que estabeleceste, que é o homem, que dele te lembres?', ref: 'SALMOS 8:3-4' });
L('Às vezes, nos sentimos pequenos demais diante da imensidão do universo.', 'stars', { px: 380, look: -.5 });
L('Mas nunca devemos confundir nossa pequenez diante da criação com nossa falta de importância diante do Criador.', 'stars', { px: 288, pose: 'pray' });
L('O Deus que sustenta a imensidão do universo também se importa com você.', 'stars', { heart: 1, pose: 'open', k: 2 }, { impact: 'Ele também se *importa* com você.' });

// ---------- 2. O HOMEM QUE ANDOU COM DEUS ----------
sec(2);
const GEN = [
  { a: 'Adão', b: 'viveu 930 anos… e morreu' }, { a: 'Sete', b: 'viveu 912 anos… e morreu' }, { a: 'Enos', b: 'viveu 905 anos… e morreu' },
  { a: 'Cainã', b: 'viveu 910 anos… e morreu' }, { a: 'Maalalel', b: 'viveu 895 anos… e morreu' }, { a: 'Jarede', b: 'viveu 962 anos… e morreu' },
];
const ENOQUE = { a: 'Enoque', b: 'andou com Deus… e já não era', hl: 1 };
L('Segunda descoberta: o homem que andou com Deus.', 'title', { n: 2, name: 'O HOMEM QUE ANDOU COM DEUS', small: 1, bg: 'enoch', bgp: {} });
L('Gênesis, capítulo 5, parece, à primeira vista, apenas uma sequência de nomes, idades e descendências.', 'scroll', { rows: GEN });
L('Mas existe algo muito interessante escondido nesse capítulo.', 'scroll', { rows: GEN, k: 2 });
L('Ao longo de toda a genealogia, uma expressão se repete: viveu tantos anos... gerou filhos e filhas... e morreu.', 'scroll', { rows: GEN.map(r => ({ ...r, b: r.b.replace('… e morreu', '… gerou filhos… e morreu') })) });
L('Adão viveu 930 anos... e morreu. Sete viveu 912 anos... e morreu.', 'scroll', { rows: GEN.slice(0, 2).map(r => ({ ...r, hl: 1 })) });
L('E assim o texto segue, geração após geração, como se quisesse nos lembrar de uma realidade: a morte havia entrado na história humana.', 'scroll', { rows: GEN, k: 3 });
L('Mas, quando chegamos a Enoque, algo inesperado acontece.', 'scroll', { rows: [...GEN.slice(3), ENOQUE] });
L('A Bíblia interrompe esse padrão e apresenta uma descrição completamente diferente: "Andou Enoque com Deus; e já não era, porque Deus o tomou para si."', 'enoch', { taken: 1 }, { v: 'Andou Enoque com Deus e já não era, porque Deus o tomou para si.', ref: 'GÊNESIS 5:24' });
L('Perceba a diferença: enquanto os outros homens são lembrados por seus anos de vida e pelo registro de sua morte, Enoque é lembrado por sua caminhada com Deus.', 'enoch', { steps: 1 });
L('E o mais impressionante é que essa caminhada não foi passageira.', 'enoch', {});
L('Gênesis 5, versículo 22, revela que Enoque andou com Deus durante trezentos anos.', 'enoch', { counter: 1 });
L('Não temos no relato grandes batalhas, conquistas ou feitos extraordinários.', 'enoch', { k: 2 });
L('O destaque das Escrituras está em algo muito mais profundo: ele viveu em comunhão com Deus.', 'enoch', { pose: 'pray', steps: 1 });
L('E Hebreus, capítulo 11, versículo 5, acrescenta que Enoque recebeu o testemunho de haver agradado a Deus.', 'enoch', { k: 3 }, { v: '“…obteve testemunho de haver agradado a Deus.”', ref: 'HEBREUS 11:5' });
L('Isso nos ensina algo que não podemos esquecer: uma vida extraordinária diante de Deus não é necessariamente aquela marcada por grandes acontecimentos aos olhos dos homens, mas aquela que aprende a caminhar diariamente em Sua presença.', 'enoch', { steps: 1, k: 2 });
L('Podemos realizar muitas coisas em nome de Deus, ocupar posições, assumir responsabilidades e até conquistar reconhecimento.', 'enoch', { tasks: 1 });
L('Mas nada disso deve substituir o mais importante: caminhar com Ele.', 'enoch', { k: 4 });
L('Porque, no fim das contas, mais importante do que aquilo que você realiza para Deus é a maneira como você vive diante dEle.', 'enoch', { steps: 1, k: 5 }, { impact: 'Como você *vive* diante dEle.' });

// ---------- 3. A PALAVRA QUE APARECE DUAS VEZES ----------
sec(3);
L('Terceira descoberta: a palavra que aparece duas vezes.', 'title', { n: 3, name: 'A PALAVRA QUE APARECE DUAS VEZES', small: 1, bg: 'ark', bgp: { calm: 1 } });
L('Todo mundo conhece a história da arca de Noé.', 'ark', { noah: 1 });
L('Mas existe um detalhe no texto original que conecta essa história a outra narrativa muito conhecida da Bíblia.', 'ark', { k: 2 });
L('A palavra hebraica utilizada para descrever a arca de Noé é Tebá.', 'hebrew', {});
L('E sabe o que torna isso interessante?', 'hebrew', { k: 2 });
L('Essa mesma palavra aparece em outro momento das Escrituras: em Êxodo, capítulo 2, para descrever o cesto no qual o pequeno Moisés foi colocado por sua mãe.', 'nile', { mother: 1 });
L('À primeira vista, são histórias completamente diferentes. Mas existe uma conexão impressionante entre elas.', 'hebrew', { k: 3 });
L('Em Gênesis, Deus preserva Noé e sua família das águas do dilúvio por meio de uma arca.', 'ark', { noah: 1, k: 3 });
L('Em Êxodo, uma mãe coloca seu bebê em um cesto e o deixa entre os juncos, às margens do rio Nilo, para tentar preservar sua vida diante de uma ordem cruel de Faraó.', 'nile', { mother: 1, release: 1, palace: 1 }, { v: '“…tomou um cesto de junco… pondo nele o menino, largou-o no carriçal à beira do rio.”', ref: 'ÊXODO 2:3' });
L('Em ambas as histórias, encontramos uma pequena estrutura que serve como instrumento de preservação em meio às águas.', 'hebrew', { k: 4 });
L('E existe algo ainda mais interessante: em Gênesis, depois de toda a tragédia do dilúvio, o texto declara que Deus se lembrou de Noé.', 'ark', { calm: 1, noah: 1 }, { v: 'Lembrou-se Deus de Noé…', ref: 'GÊNESIS 8:1' });
L('Já em Êxodo, embora o relato não diga expressamente que Deus interveio naquele exato momento, sabemos, pelo desenrolar da história, que aquele bebê seria preservado para se tornar o instrumento de Deus na libertação de Israel.', 'nile', { float: 1 });
L('Perceba a dimensão disso: aquele que seria usado para conduzir uma nação inteira para fora do Egito', 'exodusCrowd', {});
L('começou sua história dentro de um pequeno cesto, à margem de um rio.', 'nile', { float: 1, k: 2 });
L('Isso nos ensina que nem sempre conseguimos enxergar a dimensão daquilo que Deus está fazendo a partir das circunstâncias que estamos vivendo.', 'tinyBig', {});
L('Às vezes, aquilo que parece pequeno aos nossos olhos está inserido em algo muito maior do que conseguimos imaginar.', 'tinyBig', { k: 2 });
L('Deus não precisa de grandes cenários para realizar grandes propósitos.', 'nile', { float: 1, k: 3 }, { impact: 'Pequenos começos, *grandes* propósitos.' });

// ---------- 4. A SERVA QUE FOI VISTA ----------
sec(4);
L('Quarta descoberta: a serva que foi vista.', 'title', { n: 4, name: 'A SERVA QUE FOI VISTA', bg: 'hagar', bgp: { spring: 1 } });
L('Em Gênesis, capítulo 16, encontramos a história de Agar, uma mulher egípcia que era serva de Sarai.', 'tent', {});
L('Depois de ser maltratada por sua senhora, Agar foge para o deserto.', 'tent', { leave: 1 });
L('Imagine a situação: uma mulher estrangeira, grávida, sozinha e sem saber o que aconteceria com seu futuro.', 'hagar', { flee: 1, sad: 1 });
L('Mas é justamente nesse cenário que algo extraordinário acontece.', 'hagar', { spring: 1, sit: 1, sad: 1 });
L('Perto de uma fonte de água, o Anjo do Senhor a encontra e a chama pelo nome: "Agar, serva de Sarai, de onde vens e para onde vais?"', 'hagar', { spring: 1, angel: 1, talk: 1 }, { v: 'Agar, serva de Sarai, donde vens e para onde vais?', ref: 'GÊNESIS 16:8' });
L('Perceba algo: Deus não a encontra por acaso. Ele a chama pelo nome.', 'hagar', { spring: 1, angel: 1, k: 2 });
L('Antes de qualquer orientação, Agar é identificada. Sua história, sua condição e seu sofrimento não passaram despercebidos.', 'hagar', { spring: 1, angel: 1, lookUp: 1, k: 3 });
L('O Anjo do Senhor anuncia que ela terá um filho, que deverá se chamar Ismael.', 'hagar', { spring: 1, angel: 1, talk: 1, k: 4 });
L('E existe um significado muito especial nesse nome: "Deus ouve".', 'hagar', { spring: 1, names: [{ ic: 'ear', a: 'Ismael', b: 'Deus ouve' }] });
L('O próprio texto explica o motivo: o Senhor ouviu a aflição de Agar.', 'hagar', { spring: 1, angel: 1, k: 5 }, { v: '“…porque o Senhor a ouviu em seu sofrimento.”', ref: 'GÊNESIS 16:11' });
L('Mas a história não termina aí.', 'hagar', { spring: 1, k: 6 });
L('Depois desse encontro, Agar dá ao Senhor que lhe havia falado um nome: El Roi, que significa "Deus que vê".', 'hagar', { spring: 1, lookUp: 1, pose: 'pray' }, { v: '“Tu és o Deus que me vê.”', ref: 'GÊNESIS 16:13' });
L('Pense na profundidade desse momento: uma mulher estrangeira, sem posição de destaque, vivendo uma situação de sofrimento,', 'hagar', { spring: 1, k: 7 });
L('tem uma experiência com Deus tão marcante que reconhece algo sobre o caráter dEle: Deus vê e Deus ouve.', 'hagar', { spring: 1, names: [{ ic: 'eye', a: 'El Roi', b: 'Deus que vê' }, { ic: 'ear', a: 'Ismael', b: 'Deus ouve' }] });
L('E existe uma aplicação muito preciosa aqui.', 'crowdAlone', {});
L('Às vezes, as pessoas não percebem nossas dores. Algumas não conhecem nossas histórias, outras simplesmente não se importam.', 'crowdAlone', { k: 2 });
L('Mas a falta de reconhecimento humano nunca significou ausência de atenção da parte de Deus.', 'crowdAlone', { light: 1 });
L('Você pode passar despercebido aos olhos de muitas pessoas, mas nunca deve confundir o silêncio dos homens com a ausência de Deus.', 'crowdAlone', { light: 1, k: 2 });
L('Aquele que vê também ouve.', 'hagar', { spring: 1, names: [{ ic: 'eye', a: 'El Roi', b: 'Deus que vê' }, { ic: 'ear', a: 'Ismael', b: 'Deus ouve' }], k: 2 }, { impact: 'Aquele que *vê* também *ouve*.' });

// ---------- 5. A COBERTURA ----------
sec(5);
L('Quinta descoberta: a cobertura.', 'title', { n: 5, name: 'A COBERTURA', bg: 'eden', bgp: { fig: 1 } });
L('Em Gênesis, capítulo 3, versículo 21, encontramos um detalhe que talvez passe despercebido durante a leitura.', 'eden', { fig: 1 });
L('Depois que Adão e Eva desobedeceram a Deus, perceberam que estavam nus e tentaram cobrir sua vergonha utilizando folhas de figueira.', 'eden', { fig: 1, sad: 1, pick: 1 });
L('Mas existe algo interessante no que acontece em seguida.', 'eden', { fig: 1, sad: 1, k: 2 });
L('O texto diz que Deus fez vestimentas de peles para Adão e sua mulher e os vestiu.', 'eden', { give: 1, lookUp: 1, pose: 'default' }, { v: 'Fez o SENHOR Deus vestimenta de peles para Adão e sua mulher e os vestiu.', ref: 'GÊNESIS 3:21' });
L('Perceba o contraste: o homem tentou produzir sua própria cobertura,', 'eden', { fig: 1, sad: 1, pick: 1, k: 3 });
L('mas foi Deus quem providenciou aquilo de que ele realmente precisava.', 'eden', { skins: 1, give: 1, lookUp: 1 });
L('E aqui existe um detalhe que merece nossa atenção: para que aquelas vestimentas de pele existissem, um animal precisou morrer.', 'eden', { skins: 1, k: 2 });
L('Gênesis não explica diretamente como essas peles foram obtidas, nem afirma que aquele animal foi oferecido como sacrifício pelo pecado.', 'bibleIntro', { lens: 1, glow: .5, label: 'GÊNESIS 3' }, { impact: 'O texto *não* detalha.' });
L('Mas essa cena nos permite refletir sobre algo muito maior.', 'eden', { skins: 1, k: 3 });
L('O pecado havia introduzido uma realidade que o próprio homem não conseguia resolver.', 'eden', { after: 1, sad: 1, fig: 1 });
L('Adão e Eva tentaram cobrir sua condição com aquilo que suas próprias mãos produziram, mas a cobertura definitiva veio da iniciativa de Deus.', 'eden', { skins: 1, give: 1, k: 2 });
L('E essa imagem nos conduz a uma das maiores verdades de toda a Bíblia.', 'cross', { dawn: 1 });
L('Séculos depois, João Batista olha para Jesus e declara: "Eis o Cordeiro de Deus, que tira o pecado do mundo!"', 'jordan', { talk: 1, lamb: 1 }, { v: 'Eis o Cordeiro de Deus, que tira o pecado do mundo!', ref: 'JOÃO 1:29' });
L('Aquilo que encontramos nas primeiras páginas de Gênesis nos ajuda a compreender a grandeza daquilo que Cristo realizaria na cruz.', 'cross', { k: 2 });
L('O ser humano não poderia resolver sozinho o problema do pecado.', 'crowdAlone', {});
L('Não seriam seus próprios esforços, suas obras ou suas tentativas de justiça que poderiam reconciliá-lo com Deus.', 'crowdAlone', { k: 2 });
L('Era necessário que o próprio Deus providenciasse a redenção.', 'cross', { icon: 'key' });
L('E foi exatamente isso que aconteceu em Jesus.', 'jordan', { walk: 1 });
L('No Éden, Deus providenciou uma cobertura para a vergonha do homem.', 'eden', { skins: 1, k: 4 });
L('Na cruz, Cristo entregou sua própria vida para nos oferecer a redenção.', 'cross', { dawn: 1, k: 3 });
L('O homem tentou cobrir seu pecado com aquilo que suas mãos produziram.', 'eden', { fig: 1, sad: 1, pick: 1, k: 5 });
L('Mas a salvação nunca seria uma obra das mãos humanas. Ela sempre dependeria da graça e da provisão de Deus.', 'cross', { icon: 'gift' }, { impact: 'Tudo pela *graça* de Deus.' });

// ---------- FECHAMENTO ----------
sec('end');
L('As estrelas, mencionadas em meia frase.', 'recap', { upto: 1 });
L('Um homem cuja vida foi marcada por caminhar com Deus.', 'recap', { upto: 2 });
L('Uma palavra que conecta duas grandes histórias.', 'recap', { upto: 3 });
L('Uma serva estrangeira que descobriu que Deus a via e ouvia.', 'recap', { upto: 4 });
L('E um Deus que cobriu o homem quando suas próprias mãos não podiam.', 'recap', { upto: 5 });
L('Cinco detalhes. Cinco descobertas. Mas uma mesma mensagem atravessa todas essas histórias: Deus não é um Deus distante.', 'stars', { heart: 1, pose: 'open', k: 9 }, { impact: 'Deus *não* é distante.' });
L('Ele é o Deus que cria, que se relaciona, que vê, que ouve, que preserva e que provê.', 'attributes', {});
L('E talvez a maior descoberta não seja aquilo que você ainda não tinha percebido em Gênesis, mas aquilo que essas histórias revelam sobre o próprio Deus.', 'bibleIntro', { glow: 1.2, turn: 1, k: 9 });
L('Agora conta pra gente: qual dessas cinco descobertas mais chamou sua atenção? Qual delas você nunca tinha percebido?', 'recap', { upto: 5, all: 1 });
L('Inscreva-se no canal e ative as notificações, porque no próximo vídeo continuaremos nossa jornada pelas Escrituras, agora em Êxodo.', 'subscribe', {});
L('Aqui é o Palavra Ensinada. Que a Palavra continue sendo ensinada e, acima de tudo, que ela te aproxime cada vez mais de Jesus.', 'end', { k: 2 });

// ---------- CORTES (Shorts/TikTok): abertura própria + parte + chamada ----------
const SHORTS = {
  1: { open: ['Uma única frase da Bíblia fala de bilhões de estrelas.', 'galaxy', { count: 1 }] },
  2: { open: ['Na lista mais repetitiva da Bíblia, um homem quebra o padrão.', 'scroll', { rows: [...GEN.slice(4), ENOQUE] }] },
  3: { open: ['A arca de Noé e o cesto de Moisés têm a mesma palavra em hebraico.', 'hebrew', {}] },
  4: { open: ['Uma serva estrangeira, sozinha no deserto, deu um nome a Deus.', 'hagar', { flee: 1, sad: 1 }] },
  5: { open: ['Depois do primeiro pecado, Deus fez roupas. E esse detalhe diz muito.', 'eden', { give: 1, lookUp: 1, pose: 'default' }] },
};
const SHORT_CTA = ['Essa é uma das cinco descobertas em Gênesis. Assista ao vídeo completo no canal Palavra Ensinada.', 'end', { k: 7 }];
