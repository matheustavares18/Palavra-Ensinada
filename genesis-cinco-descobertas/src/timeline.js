// ===== Roteiro → linha do tempo (v2)
// O corpo (5 partes) é o texto do usuário, sem alterações. Gancho e fechamento foram refeitos a pedido dele.
// card: {ref} = só a referência na tela (o narrador fala o que a passagem diz) | {impact} = frase de impacto
// banner: título da descoberta sobreposto no início da parte
const SCRIPT = [];
let _sec = 'hook';
const sec = s => (_sec = s);
const L = (t, sc, p = {}, card = null, banner = null) => SCRIPT.push({ t, sc, p, card, banner, sec: _sec });
const R = ref => ({ ref });

// ---------- GANCHO (curto e provocativo) ----------
sec('hook');
L('Você já leu Gênesis. Mas aposto que passou direto por estes detalhes.', 'bibleIntro', { lens: 1, turn: 1 });
L('Uma frase de meia linha que esconde bilhões de estrelas.', 'stars', { sweep: 1, emo: 'awe' });
L('Um homem que foi tomado por Deus, sem o registro de sua morte.', 'enoch', { taken: 1 });
L('Uma palavra hebraica que liga a arca de Noé ao cesto de Moisés.', 'hebrew', {});
L('Uma serva que deu nome ao próprio Deus.', 'hagar', { spring: 1, angel: 1, emo: 'surprise', pose: 'surprise' });
L('E um gesto de Deus, logo depois do primeiro pecado, que antecipa algo revelado só no Novo Testamento.', 'eden', { give: 1, lookUp: 1, emo: 'surprise', pose: 'surprise' });
L('Cinco coisas que você talvez nunca percebeu em Gênesis.', 'themeTitle', {});

// ---------- 1. AS ESTRELAS ----------
sec(1);
const B1 = { n: 1, name: 'As estrelas' };
L('Em Gênesis, capítulo 1, versículo 16, a Bíblia apresenta dois grandes luzeiros: um para governar o dia e outro para governar a noite.', 'luminaries', {}, R('GÊNESIS 1:16'), B1);
L('Mas existe um detalhe interessante nessa descrição.', 'luminaries', { k: 2 });
L('O texto não os identifica pelos nomes que conhecemos hoje: sol e lua. Ele os apresenta simplesmente como o maior e o menor dos luzeiros.', 'luminaries', { labels: 1 });
L('E isso pode ter um significado ainda mais profundo.', 'luminaries', { labels: 1, k: 2 });
L('Na cultura de muitos povos antigos, os astros eram associados a divindades e recebiam adoração.', 'idols', {});
L('Mas Gênesis apresenta uma perspectiva completamente diferente: o sol e a lua não são deuses, não possuem poder independente e não são dignos de adoração.', 'idols', { fall: 1 });
L('São apenas parte da criação, obras daquele que é o verdadeiro Deus.', 'luminaries', { k: 3 }, { impact: 'Criação, não *divindade*.' });
L('Mas espere, porque existe outro detalhe nesse mesmo versículo.', 'stars', { who: 'none' });
L('Depois de descrever os dois grandes luzeiros, o texto acrescenta uma expressão aparentemente simples: "e fez também as estrelas".', 'stars', { sweep: 1, look: -.3, emo: 'surprise' }, R('GÊNESIS 1:16'));
L('É como se toda a imensidão do céu noturno fosse mencionada em apenas uma frase.', 'stars', { px: 200, emo: 'awe' });
L('Hoje, sabemos que o universo é muito maior do que os olhos humanos conseguem contemplar.', 'galaxy', {});
L('Existem bilhões de galáxias, cada uma com incontáveis estrelas.', 'galaxy', { count: 1 });
L('E tudo isso nos leva a uma reflexão impressionante: aquele que criou a imensidão dos céus não se esqueceu de uma de suas criaturas.', 'stars', { heart: 1, pose: 'open', emo: 'happy' });
L('No Salmo 8, Davi contempla os céus e faz uma pergunta: diante de tamanha grandeza, o que é o homem para que Deus se lembre dele?', 'david', {}, R('SALMOS 8:3-4'));
L('Às vezes, nos sentimos pequenos demais diante da imensidão do universo.', 'stars', { px: 380, look: -.5, emo: 'sad', lookY: -.6 });
L('Mas nunca devemos confundir nossa pequenez diante da criação com nossa falta de importância diante do Criador.', 'stars', { px: 288, pose: 'pray', emo: 'pray' });
L('O Deus que sustenta a imensidão do universo também se importa com você.', 'stars', { heart: 1, pose: 'open', emo: 'joy', k: 2 }, { impact: 'Ele também se *importa* com você.' });

// ---------- 2. O HOMEM QUE ANDOU COM DEUS ----------
sec(2);
const GEN = [
  { a: 'Adão', b: 'viveu 930 anos… e morreu' }, { a: 'Sete', b: 'viveu 912 anos… e morreu' }, { a: 'Enos', b: 'viveu 905 anos… e morreu' },
  { a: 'Cainã', b: 'viveu 910 anos… e morreu' }, { a: 'Maalalel', b: 'viveu 895 anos… e morreu' }, { a: 'Jarede', b: 'viveu 962 anos… e morreu' },
];
const ENOQUE = { a: 'Enoque', b: 'andou com Deus… e já não era', hl: 1 };
const B2 = { n: 2, name: 'O homem que andou com Deus' };
L('Gênesis, capítulo 5, parece, à primeira vista, apenas uma sequência de nomes, idades e descendências.', 'scroll', { rows: GEN }, R('GÊNESIS 5'), B2);
L('Mas existe algo muito interessante escondido nesse capítulo.', 'scroll', { rows: GEN, k: 2 });
L('Ao longo de toda a genealogia, uma expressão se repete: viveu tantos anos... gerou filhos e filhas... e morreu.', 'scroll', { rows: GEN.map(r => ({ ...r, b: r.b.replace('… e morreu', '… gerou filhos… e morreu') })) });
L('Adão viveu 930 anos... e morreu. Sete viveu 912 anos... e morreu.', 'scroll', { rows: GEN.slice(0, 2).map(r => ({ ...r, hl: 1 })) });
L('E assim o texto segue, geração após geração, como se quisesse nos lembrar de uma realidade: a morte havia entrado na história humana.', 'scroll', { rows: GEN, k: 3 });
L('Mas, quando chegamos a Enoque, algo inesperado acontece.', 'scroll', { rows: [...GEN.slice(3), ENOQUE] });
L('A Bíblia interrompe esse padrão e apresenta uma descrição completamente diferente: "Andou Enoque com Deus; e já não era, porque Deus o tomou para si."', 'enoch', { taken: 1 }, R('GÊNESIS 5:24'));
L('Perceba a diferença: enquanto os outros homens são lembrados por seus anos de vida e pelo registro de sua morte, Enoque é lembrado por sua caminhada com Deus.', 'enoch', { steps: 1 });
L('E o mais impressionante é que essa caminhada não foi passageira.', 'enoch', { emo: 'peace' });
L('Gênesis 5, versículo 22, revela que Enoque andou com Deus durante trezentos anos.', 'enoch', { counter: 1 }, R('GÊNESIS 5:22'));
L('Não temos no relato grandes batalhas, conquistas ou feitos extraordinários.', 'enoch', { k: 2 });
L('O destaque das Escrituras está em algo muito mais profundo: ele viveu em comunhão com Deus.', 'enoch', { pose: 'pray', emo: 'pray', steps: 1 });
L('E Hebreus, capítulo 11, versículo 5, acrescenta que Enoque recebeu o testemunho de haver agradado a Deus.', 'enoch', { k: 3, emo: 'joy' }, R('HEBREUS 11:5'));
L('Isso nos ensina algo que não podemos esquecer: uma vida extraordinária diante de Deus não é necessariamente aquela marcada por grandes acontecimentos aos olhos dos homens, mas aquela que aprende a caminhar diariamente em Sua presença.', 'enoch', { steps: 1, k: 2 });
L('Podemos realizar muitas coisas em nome de Deus, ocupar posições, assumir responsabilidades e até conquistar reconhecimento.', 'enoch', { tasks: 1, emo: 'neutral' });
L('Mas nada disso deve substituir o mais importante: caminhar com Ele.', 'enoch', { k: 4, emo: 'peace' });
L('Porque, no fim das contas, mais importante do que aquilo que você realiza para Deus é a maneira como você vive diante dEle.', 'enoch', { steps: 1, k: 5 }, { impact: 'Como você *vive* diante dEle.' });

// ---------- 3. A PALAVRA QUE APARECE DUAS VEZES ----------
sec(3);
const B3 = { n: 3, name: 'A palavra que aparece duas vezes' };
L('Todo mundo conhece a história da arca de Noé.', 'ark', { noah: 1 }, null, B3);
L('Mas existe um detalhe no texto original que conecta essa história a outra narrativa muito conhecida da Bíblia.', 'ark', { k: 2 });
L('A palavra hebraica utilizada para descrever a arca de Noé é Tebá.', 'hebrew', {}, R('GÊNESIS 6:14'));
L('E sabe o que torna isso interessante?', 'hebrew', { k: 2 });
L('Essa mesma palavra aparece em outro momento das Escrituras: em Êxodo, capítulo 2, para descrever o cesto no qual o pequeno Moisés foi colocado por sua mãe.', 'nile', { mother: 1, emo: 'worried' }, R('ÊXODO 2:3'));
L('À primeira vista, são histórias completamente diferentes. Mas existe uma conexão impressionante entre elas.', 'hebrew', { k: 3 });
L('Em Gênesis, Deus preserva Noé e sua família das águas do dilúvio por meio de uma arca.', 'ark', { noah: 1, k: 3, emo: 'pray' });
L('Em Êxodo, uma mãe coloca seu bebê em um cesto e o deixa entre os juncos, às margens do rio Nilo, para tentar preservar sua vida diante de uma ordem cruel de Faraó.', 'nile', { mother: 1, release: 1, palace: 1, miriam: 1 }, R('ÊXODO 2:3'));
L('Em ambas as histórias, encontramos uma pequena estrutura que serve como instrumento de preservação em meio às águas.', 'hebrew', { k: 4 });
L('E existe algo ainda mais interessante: em Gênesis, depois de toda a tragédia do dilúvio, o texto declara que Deus se lembrou de Noé.', 'ark', { calm: 1, noah: 1 }, R('GÊNESIS 8:1'));
L('Já em Êxodo, embora o relato não diga expressamente que Deus interveio naquele exato momento, sabemos, pelo desenrolar da história, que aquele bebê seria preservado para se tornar o instrumento de Deus na libertação de Israel.', 'nile', { float: 1, miriam: 1 });
L('Perceba a dimensão disso: aquele que seria usado para conduzir uma nação inteira para fora do Egito', 'exodusCrowd', {});
L('começou sua história dentro de um pequeno cesto, à margem de um rio.', 'nile', { float: 1, k: 2 });
L('Isso nos ensina que nem sempre conseguimos enxergar a dimensão daquilo que Deus está fazendo a partir das circunstâncias que estamos vivendo.', 'tinyBig', {});
L('Às vezes, aquilo que parece pequeno aos nossos olhos está inserido em algo muito maior do que conseguimos imaginar.', 'tinyBig', { k: 2 });
L('Deus não precisa de grandes cenários para realizar grandes propósitos.', 'nile', { float: 1, k: 3 }, { impact: 'Pequenos começos, *grandes* propósitos.' });

// ---------- 4. A SERVA QUE FOI VISTA ----------
sec(4);
const B4 = { n: 4, name: 'A serva que foi vista' };
L('Em Gênesis, capítulo 16, encontramos a história de Agar, uma mulher egípcia que era serva de Sarai.', 'tent', { talk: 0 }, R('GÊNESIS 16'), B4);
L('Depois de ser maltratada por sua senhora, Agar foge para o deserto.', 'tent', { leave: 1 });
L('Imagine a situação: uma mulher estrangeira, grávida, sozinha e sem saber o que aconteceria com seu futuro.', 'hagar', { flee: 1 });
L('Mas é justamente nesse cenário que algo extraordinário acontece.', 'hagar', { spring: 1, sit: 1, emo: 'sad' });
L('Perto de uma fonte de água, o Anjo do Senhor a encontra e a chama pelo nome: "Agar, serva de Sarai, de onde vens e para onde vais?"', 'hagar', { spring: 1, angel: 1, talk: 1, emo: 'surprise', pose: 'surprise' }, R('GÊNESIS 16:8'));
L('Perceba algo: Deus não a encontra por acaso. Ele a chama pelo nome.', 'hagar', { spring: 1, angel: 1, emo: 'awe', pose: 'chest' });
L('Antes de qualquer orientação, Agar é identificada. Sua história, sua condição e seu sofrimento não passaram despercebidos.', 'hagar', { spring: 1, angel: 1, emo: 'cry', pose: 'chest' });
L('O Anjo do Senhor anuncia que ela terá um filho, que deverá se chamar Ismael.', 'hagar', { spring: 1, angel: 1, talk: 1, emo: 'happy', pose: 'belly' }, R('GÊNESIS 16:11'));
L('E existe um significado muito especial nesse nome: "Deus ouve".', 'hagar', { spring: 1, emo: 'happy', names: [{ ic: 'ear', a: 'Ismael', b: 'Deus ouve' }] });
L('O próprio texto explica o motivo: o Senhor ouviu a aflição de Agar.', 'hagar', { spring: 1, angel: 1, emo: 'peace', pose: 'belly' }, R('GÊNESIS 16:11'));
L('Mas a história não termina aí.', 'hagar', { spring: 1, emo: 'happy' });
L('Depois desse encontro, Agar dá ao Senhor que lhe havia falado um nome: El Roi, que significa "Deus que vê".', 'hagar', { spring: 1, lookUp: 1, pose: 'raise', emo: 'joy' }, R('GÊNESIS 16:13'));
L('Pense na profundidade desse momento: uma mulher estrangeira, sem posição de destaque, vivendo uma situação de sofrimento,', 'hagar', { spring: 1, emo: 'sad', sit: 1 });
L('tem uma experiência com Deus tão marcante que reconhece algo sobre o caráter dEle: Deus vê e Deus ouve.', 'hagar', { spring: 1, emo: 'joy', names: [{ ic: 'eye', a: 'El Roi', b: 'Deus que vê' }, { ic: 'ear', a: 'Ismael', b: 'Deus ouve' }] });
L('E existe uma aplicação muito preciosa aqui.', 'crowdAlone', {});
L('Às vezes, as pessoas não percebem nossas dores. Algumas não conhecem nossas histórias, outras simplesmente não se importam.', 'crowdAlone', { k: 2, emo: 'cry' });
L('Mas a falta de reconhecimento humano nunca significou ausência de atenção da parte de Deus.', 'crowdAlone', { light: 1, emo: 'surprise' });
L('Você pode passar despercebido aos olhos de muitas pessoas, mas nunca deve confundir o silêncio dos homens com a ausência de Deus.', 'crowdAlone', { light: 1, k: 2 });
L('Aquele que vê também ouve.', 'hagar', { spring: 1, emo: 'joy', names: [{ ic: 'eye', a: 'El Roi', b: 'Deus que vê' }, { ic: 'ear', a: 'Ismael', b: 'Deus ouve' }], k: 2 }, { impact: 'Aquele que *vê* também *ouve*.' });

// ---------- 5. A COBERTURA ----------
sec(5);
const B5 = { n: 5, name: 'A cobertura' };
L('Em Gênesis, capítulo 3, versículo 21, encontramos um detalhe que talvez passe despercebido durante a leitura.', 'eden', { fig: 1, emo: 'neutral', pose: 'cover' }, R('GÊNESIS 3:21'), B5);
L('Depois que Adão e Eva desobedeceram a Deus, perceberam que estavam nus e tentaram cobrir sua vergonha utilizando folhas de figueira.', 'eden', { fig: 1, pick: 1, emo: 'shame' });
L('Mas existe algo interessante no que acontece em seguida.', 'eden', { fig: 1, emo: 'worried', k: 2 });
L('O texto diz que Deus fez vestimentas de peles para Adão e sua mulher e os vestiu.', 'eden', { give: 1, lookUp: 1, pose: 'surprise', emo: 'surprise' }, R('GÊNESIS 3:21'));
L('Perceba o contraste: o homem tentou produzir sua própria cobertura,', 'eden', { fig: 1, pick: 1, emo: 'shame', k: 3 });
L('mas foi Deus quem providenciou aquilo de que ele realmente precisava.', 'eden', { skins: 1, give: 1, lookUp: 1, emo: 'happy', pose: 'chest' });
L('E aqui existe um detalhe que merece nossa atenção: para que aquelas vestimentas de pele existissem, um animal precisou morrer.', 'eden', { skins: 1, emo: 'sad', k: 2 });
L('Gênesis não explica diretamente como essas peles foram obtidas, nem afirma que aquele animal foi oferecido como sacrifício pelo pecado.', 'bibleIntro', { lens: 1, glow: .5, label: 'GÊNESIS 3' }, { impact: 'O texto *não* detalha.' });
L('Mas essa cena nos permite refletir sobre algo muito maior.', 'eden', { skins: 1, emo: 'peace', k: 3 });
L('O pecado havia introduzido uma realidade que o próprio homem não conseguia resolver.', 'eden', { after: 1, fig: 1, emo: 'cry' });
L('Adão e Eva tentaram cobrir sua condição com aquilo que suas próprias mãos produziram, mas a cobertura definitiva veio da iniciativa de Deus.', 'eden', { skins: 1, give: 1, emo: 'joy', pose: 'raise', k: 2 });
L('E essa imagem nos conduz a uma das maiores verdades de toda a Bíblia.', 'cross', { dawn: 1 });
L('Séculos depois, João Batista olha para Jesus e declara: "Eis o Cordeiro de Deus, que tira o pecado do mundo!"', 'jordan', { talk: 1, lamb: 1 }, R('JOÃO 1:29'));
L('Aquilo que encontramos nas primeiras páginas de Gênesis nos ajuda a compreender a grandeza daquilo que Cristo realizaria na cruz.', 'cross', { k: 2 });
L('O ser humano não poderia resolver sozinho o problema do pecado.', 'crowdAlone', { emo: 'sad' });
L('Não seriam seus próprios esforços, suas obras ou suas tentativas de justiça que poderiam reconciliá-lo com Deus.', 'crowdAlone', { k: 2, emo: 'worried' });
L('Era necessário que o próprio Deus providenciasse a redenção.', 'cross', { icon: 'key' });
L('E foi exatamente isso que aconteceu em Jesus.', 'jordan', { walk: 1 });
L('No Éden, Deus providenciou uma cobertura para a vergonha do homem.', 'eden', { skins: 1, emo: 'happy', k: 4 });
L('Na cruz, Cristo entregou sua própria vida para nos oferecer a redenção.', 'cross', { dawn: 1, k: 3 });
L('O homem tentou cobrir seu pecado com aquilo que suas mãos produziram.', 'eden', { fig: 1, pick: 1, emo: 'shame', k: 5 });
L('Mas a salvação nunca seria uma obra das mãos humanas. Ela sempre dependeria da graça e da provisão de Deus.', 'cross', { icon: 'gift' }, { impact: 'Tudo pela *graça* de Deus.' });

// ---------- FECHAMENTO PADRÃO ----------
sec('end');
L('Cinco detalhes. Cinco descobertas. Mas uma mesma mensagem atravessa todas essas histórias: Deus não é um Deus distante.', 'recap', { upto: 5, all: 1 }, { impact: 'Deus *não* é distante.' });
L('Ele é o Deus que cria, que se relaciona, que vê, que ouve, que preserva e que provê.', 'attributes', {});
L('Qual dessas cinco descobertas você nunca tinha percebido? Conta pra gente nos comentários. Inscreva-se no canal e ative as notificações.', 'comment', {});
L('Aqui é o Palavra Ensinada. Que a Palavra continue sendo ensinada e, acima de tudo, que ela te aproxime cada vez mais de Jesus.', 'end', {});

// ---------- CORTES (Shorts/TikTok): abertura própria + parte + chamada curta ----------
const SHORTS = {
  1: { open: ['Uma única frase da Bíblia esconde bilhões de estrelas.', 'galaxy', { count: 1 }] },
  2: { open: ['Na lista mais repetitiva da Bíblia, um homem quebra o padrão.', 'scroll', { rows: [...GEN.slice(4), ENOQUE] }] },
  3: { open: ['A arca de Noé e o cesto de Moisés têm a mesma palavra em hebraico.', 'hebrew', {}] },
  4: { open: ['Uma serva estrangeira, sozinha no deserto, deu um nome a Deus.', 'hagar', { flee: 1 }] },
  5: { open: ['Depois do primeiro pecado, Deus fez roupas. E isso diz muito.', 'eden', { give: 1, lookUp: 1, pose: 'surprise', emo: 'surprise' }], skipFirst: 1 },
};
const SHORT_CTA = ['Vídeo completo no canal Palavra Ensinada.', 'end', {}];
