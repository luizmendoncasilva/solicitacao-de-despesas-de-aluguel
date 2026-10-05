/* ============================================================
   dados.js — dados do laboratório da TELA DE TAREFA
   ------------------------------------------------------------
   A linha de execução é ROTEIRO FIXO: a tarefa declara todos os passos e os que
   faltam aparecem como "Aguardando". Os dois mundos leem a fonte que o protótipo
   JÁ TEM — este arquivo não inventa passo nenhum:

   - Autopilot → AP_FLUXOS (dp-wizard.js)
   - DP / Hub  → EXEC_STEP_PRESETS (cockpit-core.js), os mesmos passos das telas de
                 fluxo. Mudou lá, muda aqui.

   Cada passo vira { nome, desc, tipo, acao, autoConclui, refAberto, painelId } — TUDO o que o
   preset declara, não só o nome. Antes vinha só { nome, desc, ref } e o resto se perdia: os
   passos do DP apareciam com um botão só ("Marcar como feito") enquanto no projeto o primeiro
   tem "Baixar TXT", o do Gestta tem o painel do nome sugerido + "Abrir Gestta" e o último tem o
   card de conclusão + anexar. Quem via a tela lia a versão pobre como se fosse o desenho
   proposto — o mesmo tipo de mal-entendido que já aconteceu com a Validação.
   ============================================================ */

/* Qual preset do núcleo cada processo usa. Espelha o que a tela de fluxo declara em
   FLOW_CONFIG.EXEC_STEPS; a Admissão CLT não declara nada e cai no DEFAULT_EXEC_STEPS,
   que é o mesmo do preset 'admissao'.
   Hoje TODOS os casos de DP do lab são Admissão CLT, então só a primeira linha está em uso
   — as outras ficam porque o mapa é a fonte da conversão e um caso novo pode voltar a precisar.

   LIMITAÇÃO CONHECIDA daqui: a conversão abaixo só reconhece o passo de conferência
   ('form-reference'). Os outros tipos que o núcleo tem — 'client-reply' (que no projeto carrega o
   bloco "O que o cliente pediu", com assunto, descrição e anexos), 'final-message', as ações de
   passo — chegam sem corpo. Foi por isso que a Solicitação Geral perdia os dados no Processamento
   DESTE lab; na tela do projeto ela não perde. Sem efeito hoje, porque nenhum caso usa esses
   presets — mas quem trouxer um passo de outro tipo pra cá precisa mexer aqui primeiro. */
const LAB_PRESET_POR_PROCESSO = {
  admissao_clt: 'admissao',
  admissao_estagiario: 'admissao',
  rescisao_calculo: 'rescisao',
  ferias_calculo: 'ferias',
  solicitacao_geral: 'solicitacao_geral',
};

function labPassosDoProcesso(typeCode) {
  const preset = LAB_PRESET_POR_PROCESSO[typeCode];
  const passos = (typeof EXEC_STEP_PRESETS !== 'undefined' && EXEC_STEP_PRESETS[preset]) || [];
  return passos.map((s) => ({
    nome: s.title,
    desc: s.desc,
    tipo: s.type || '',
    ref: s.type === 'form-reference',
    refAberto: !!s.defaultOpen,
    painelId: !!s.showTaskId,
    // A ação EXTERNA do passo (baixar o TXT, abrir o Gestta): o operador sai da tela pra fazer.
    acao: s.action ? { label: s.action.label, icon: s.action.icon } : null,
    // Quando a ação já É a conclusão do passo (baixar o TXT), não existe "Marcar como feito".
    autoConclui: !!s.autoCompleteOnAction,
  }));
}

/* ============================================================
   Estado do roteiro por tarefa (só DP/Hub — o Autopilot já tem apDone/apHitl).
   Os PASSOS não vivem aqui: vêm de EXEC_STEP_PRESETS pelo typeCode da tarefa. Aqui
   fica só o estado de cada caso, e os índices abaixo se referem àquele preset.
   - labDone: quantos passos já foram concluídos
   - labFalha: { naEtapa, texto } — anomalia ATIVA, bloqueando agora (fica aberta na tela)
   - labHist / labComent: eventos e comentários por passo. **Por ora só nas tarefas do
     Autopilot**: no robô o módulo nasceu de necessidade real — falha do motor,
     reexecução, quem destravou. Nos fluxos de DP ainda não se declara nada, mas todo passo executado ganha o evento "Concluído" que falta, gerado pela tela.
   - labClienteRespondeu: liga a bolinha no botão de Conversa (a bolinha não existe no
     painel de gestão por decisão — aqui na tela ela faz sentido)
   - messages: sobrescreve a conversa do mock quando o caso precisa de algo que o publicado
     não tem (uma resposta do cliente com anexo, por exemplo) — o dado novo nasce aqui, no
     arquivo do lab; tarefas.js não recebe caso novo
   - labQuando: horário de passos que não deixam registro (senão vale o relógio sintético)
   - labBlocos: blocos extras por passo ('arquivos', 'destino') — a tarefa declara, o passo
     renderiza. É por aqui que entra material novo sem redesenhar o passo.

   Preset 'admissao' (4 passos): 0 gerar TXT · 1 subir na Domínio · 2 Gestta · 3 conclusão
   Presets 'ferias'/'rescisao' (3): 0 processar na Domínio · 1 Gestta · 2 conclusão
   Preset 'solicitacao_geral' (1): 0 responder ao cliente
   ============================================================ */
const LAB_ESTADO = {
  // Minha · em processamento — o caso central da tela nova.
  // TXT gerado e subido na Domínio; o Gestta é o passo atual.
  'T-2104': { labDone: 2 },

  // De outra pessoa · ainda na validação (nada do roteiro rodou)
  'T-2102': { labDone: 0 },

  // Sem dono · na fila
  'T-2101': { labDone: 0 },

  /* Minha · em espera (aguardando cliente) + cliente respondeu → bolinha na Conversa.
     A resposta do cliente VEM COM ANEXO. O ponto do Gabriel:
     hoje o arquivo que chega numa conversa se desliga dela e vai pra pilha geral de anexos da
     tarefa — quem lê a conversa depois não vê o que veio junto com aquela mensagem. Aqui o
     anexo mora DENTRO da mensagem que o trouxe; a pilha geral continua existindo pra quem
     procura "todos os arquivos desta tarefa". A tarefa segue em espera de propósito: o cliente
     respondeu e ninguém abriu ainda (é o que a bolinha na Conversa está dizendo). */
  'T-2103': {
    labDone: 0, labClienteRespondeu: true,
    messages: [
      { from: 'client', text: 'Admissão da auxiliar de cozinha, ela começa dia 09.', timestamp: 'ontem 09:05' },
      { from: 'operator', text: 'Oi, Beatriz! Pra fechar o cadastro preciso do número do PIS e do comprovante de escolaridade. Pode enviar?', timestamp: 'ontem 09:20' },
      { from: 'client', text: 'O PIS é 138.55071.24-8. Segue a carteira de trabalho digital e o certificado do ensino médio da Juliana.', timestamp: 'hoje 08:12', attachments: [
        { name: 'CTPS-digital-Juliana.pdf', size: '212 KB' },
        { name: 'Certificado-ensino-medio.pdf', size: '96 KB' },
      ] },
    ],
  },

  // Concluída · os 4 passos feitos (+ log de alterações no acordeon de dados)
  'T-2049': { labDone: 4 },

  // Cancelada — sem fases e sem roteiro (só a tarja de motivo)
  'T-2105': { labDone: 0 },

  /* Autopilot concluído — o MESMO conteúdo da versão em modal
     (`../lab-timeline/timeline-autopilot.html`): o fechamento de folha do Fernando, com
     dois ciclos de reexecução (cálculo × histórico de 12 meses e transmissão ao eSocial).
     Ali era um log corrido; aqui cada registro entra DENTRO do passo a que pertence.
     Índices seguem AP_FLUXOS.folha. Quando a tarefa declara `labHist`, é ele que vale —
     a tela não deriva mais nada das atuações. */
  'T-5015': {
    /* labHist = os EVENTOS de cada passo. Passo e evento
       são entidades diferentes: o evento é um ESTADO com hora (falhou / concluído), e a tela
       nomeia a linha pelo estado — o texto daqui é só o que o motor acrescentou.
       Passo que rodou limpo NÃO precisa declarar nada: a tela gera o evento "Concluído" que
       falta, porque todo passo executado tem pelo menos um. */
    labHist: {
      // 1 · Processar cálculo da folha — rodou de novo depois da correção
      1: [
        { tipo: 'ok', quando: '14/05 · 10:41', texto: 'Cálculo gerado de novo — versão 2, com os dados corrigidos · líquido R$ 52.180,00' },
      ],
      // 2 · Verificar resultado com histórico do cliente — falhou e foi refeito
      2: [
        { tipo: 'erro', quando: '14/05 · 09:18', texto: 'Cálculo divergente do histórico do cliente. A média dos últimos 12 meses é de R$ 50.000,00 e a folha desta competência calculou R$ 80.140,00. Verifique, por favor.' },
        { tipo: 'ok', quando: '14/05 · 10:47', texto: 'Cálculo dentro da faixa esperada para o histórico do cliente' },
      ],
      // 3 · Enviar folha para o eSocial — rejeição do órgão, correção do CBO e retransmissão.
      // No doc de engenharia envio e retorno são UM passo só, então os dois ciclos moram aqui.
      3: [
        { tipo: 'erro', quando: '14/05 · 10:59', texto: 'O eSocial rejeitou um evento na transmissão: o CBO do colaborador está divergente da tabela oficial do órgão. A folha fica pendente até o cadastro ser corrigido e o evento retransmitido.' },
        { tipo: 'ok', quando: '14/05 · 11:31', texto: 'Eventos retransmitidos e aceitos pelo eSocial — protocolo e recibos retornados' },
      ],
    },
    /* Comentário mora sempre num EVENTO, nunca no passo (consenso do refinamento): solto no
       passo ele perdia a referência de qual tentativa explicava. `lanc` é o índice do evento
       dentro do labHist daquele passo — nos dois casos de falha, o comentário explica a falha
       (evento 0), não o sucesso que veio depois. */
    labComent: {
      0: [{ autor: 'Rodrigo Bio · operador', quando: '14/05 · 09:20', lanc: 0, texto: 'As rubricas de insalubridade desse cliente vêm de uma planilha à parte — vale conferir sempre que a folha importar insumo novo.' }],
      2: [{ autor: 'Daniele Ribeiro · operadora', quando: '14/05 · 10:22', lanc: 0, texto: 'Parte da variação é real: reajuste coletivo de maio + 2 admissões. Mas achei uma rubrica lançada em duplicidade. Corrigi e pedi reprocessamento pro time do Autopilot.', anexos: [{ name: 'conferencia-folha-jun.xlsx', size: '84 KB' }] }],
      3: [{ autor: 'Lucas Pereira · operador', quando: '14/05 · 11:20', lanc: 0, texto: 'Ajustei o CBO no cadastro do colaborador. Liberado pra retransmitir.' }],
    },
    /* Horário dos passos que não deixam registro. Sem isso o passo herda o relógio sintético do
       protótipo (_apTime: 09:00 + 6min por passo) e a cauda da folha aparecia ANTES do histórico
       que está no meio dela — os relatórios saindo às 09:24 depois de um eSocial aceito às 11:31.
       O último passo fecha em 11:40, que é o finishedAt declarado na tarefa. */
    labQuando: { 0: '14/05 · 09:12', 4: '14/05 · 11:34', 5: '14/05 · 11:37', 6: '14/05 · 11:40' },
    /* Blocos extras por passo. Mesma "casca" que o passo já usa pra anomalia e dados da
       solicitação: a tarefa declara, o passo renderiza. Aqui entram os DOIS passos que o doc de
       engenharia separa — o motor GERA os arquivos num passo e o GDocs os GUARDA no seguinte. */
    labBlocos: {
      // 4 · Gerar relatórios de folha e holerites via motor — o material nasce aqui
      4: [{ tipo: 'arquivos', label: 'Gerado neste passo', itens: [
        { name: 'Resumo-da-folha-jun-2026.pdf', tag: 'Relatório' },
        { name: 'Holerites-jun-2026.pdf', tag: 'Relatório' },
        { name: 'Liquidos-por-colaborador-jun-2026.xlsx', tag: 'Relatório' },
        { name: 'Resumo-de-encargos-jun-2026.pdf', tag: 'Relatório' },
      ] }],
      // 5 · Salvar documentos no GDocs — responde "onde isso foi parar", que foi a pergunta do
      // Arthur no design sync de 04/08 ("o robô gerou, aquilo tá no hub. Ah, não tá. Onde que tá?")
      // Sem repetir "publicados no Hub": a descrição do passo já diz isso. Aqui vai só o que
      // ela não diz — a pasta e o caminho até ela.
      5: [{ tipo: 'destino', onde: 'GDocs', pasta: 'Metalúrgica Força Total · Folha Jun/2026', n: 4 }],
    },
  },
};

if (typeof AC_TAREFAS !== 'undefined') {
  Object.keys(LAB_ESTADO).forEach((id) => {
    const t = AC_TAREFAS.find((x) => x.id === id);
    if (t) Object.assign(t, LAB_ESTADO[id]);
  });
}

/* MOCKS QUE NASCEM NO LAB — caso novo entra aqui, não em tarefas.js.

   T-2106 — DP MINHA, na etapa de Dados da solicitação, fluxo limpo. É o caso da matriz em que o
   operador puxou a tarefa e está DECIDINDO os dados — cartão de decisão ativo, formulário
   editável. A T-2103 também passa por essa etapa, mas suja de espera/resposta do cliente; este
   é o caminho limpo. */
if (typeof AC_TAREFAS !== 'undefined' && !AC_TAREFAS.some((t) => t.id === 'T-2106')) {
  AC_TAREFAS.push({
    id: 'T-2106', operatorId: 'o1', clientName: 'Padaria Vila Nova ME', cnpj: '33.412.877/0001-90',
    familia: 'FAMILY_1', origem: 'BR Experts', typeCode: 'admissao_clt', type: 'Admissão CLT',
    status: 'active', sla: '4h', slaStatus: 'normal', receivedAt: '08:45', createdDaysAgo: 0,
    timelineStep: 1, labDone: 0,
    clientMessage: 'Admissão da confeiteira nova, ela começa dia 22.', colaborador: 'Renata Souza Lima',
    senderName: 'Paulo Cézar Andrade', senderScopes: ['RH'],
    secoes: labAdmissaoCLT({
      nome: 'Renata Souza Lima', cpf: '318.442.906-55', cargo: 'Confeiteira', matricula: '0512',
      depto: 'Produção', cc: 'CC 01 — Produção', sindicato: 'Sind. Trab. Ind. de Panificação',
      admissao: '22/06/2026', salario: 'R$ 2.460,00', fimExperiencia: '21/07/2026', fimProrrogacao: '19/09/2026',
      jornada: '05:00 às 13:20, seg a sáb', cbo: '8483-15',
      nascimento: '27/02/1994', civil: 'Solteira', sexo: 'Feminino', instrucao: 'Ensino médio completo',
      mae: 'Sônia Souza Lima', cep: '03108-020', logradouro: 'Rua do Oratório, 88', bairro: 'Mooca', cidade: 'São Paulo',
      telefone: '(11) 96233-8107', email: 'renata.slima@email.com',
      rg: '39.221.508-2', ctps: '7710244 / 011-SP', pis: '127.48335.90-6', eleitor: '2233 4455 6677',
      dependentes: [],
      obs: 'A padaria abre às 5h — o cliente pediu que a admissão fique pronta antes do dia 22 pra escala da madrugada já sair com ela.',
    }),
    attachments: labAnexosAdmissao('renata', [{ name: 'exame-admissional.pdf', size: '980 KB' }]),
    messages: [
      { from: 'client', text: 'Admissão da confeiteira nova, ela começa dia 22.', timestamp: '08:45' },
      { from: 'operator', text: 'Recebido! Já estou conferindo os dados pra registrar a admissão.', timestamp: '08:52' },
    ],
  });
}

/* T-2107 e T-2108 — DP DE OUTRA PESSOA em Processamento e em espera. Nasceram quando o
   `?ro=1` morreu: "tarefa sua em leitura" não existe (a posse determina o modo), mas os ESTADOS
   que aquele truque deixava ver — o roteiro em leitura, a espera em leitura — continuam telas
   reais. Agora eles são o que sempre deveriam ter sido: tarefas de outros operadores. */
if (typeof AC_TAREFAS !== 'undefined' && !AC_TAREFAS.some((t) => t.id === 'T-2107')) {
  AC_TAREFAS.push({
    id: 'T-2107', operatorId: 'o3', clientName: 'Oficina do Pedal LTDA', cnpj: '58.904.216/0001-44',
    familia: 'CORP', origem: 'Partwork', typeCode: 'admissao_clt', type: 'Admissão CLT',
    status: 'processing', sla: '5h', slaStatus: 'normal', receivedAt: '07:20', createdDaysAgo: 0,
    timelineStep: 2, labDone: 2,
    clientMessage: 'Admissão do montador de bicicletas, começa dia 16.', colaborador: 'Thiago Ramos Dias',
    senderName: 'Vanessa Ribeiro', senderScopes: ['RH'],
    secoes: labAdmissaoCLT({
      nome: 'Thiago Ramos Dias', cpf: '274.881.335-02', cargo: 'Montador', matricula: '0331',
      depto: 'Oficina', cc: 'CC 02 — Serviços', sindicato: 'Sind. Trab. no Comércio',
      admissao: '16/06/2026', salario: 'R$ 2.320,00', fimExperiencia: '15/07/2026', fimProrrogacao: '13/09/2026',
      jornada: '09:00 às 18:00, seg a sex', cbo: '9192-05',
      nascimento: '11/12/1998', civil: 'Solteiro', sexo: 'Masculino', instrucao: 'Ensino médio completo',
      mae: 'Rosana Ramos Dias', cep: '04726-001', logradouro: 'Av. Santo Amaro, 4550', bairro: 'Brooklin', cidade: 'São Paulo',
      telefone: '(11) 95412-7789', email: 'thiago.rdias@email.com',
      rg: '44.108.772-9', ctps: '8821345 / 014-SP', pis: '204.66158.31-7', eleitor: '3344 5566 7788',
      dependentes: [],
      obs: 'Vaga com bônus por produção — conferir a rubrica variável no cadastro antes de subir o TXT.',
    }),
    attachments: labAnexosAdmissao('thiago', []),
    messages: [
      { from: 'client', text: 'Admissão do montador de bicicletas, começa dia 16.', timestamp: '07:20' },
      { from: 'operator', text: 'Recebido, já estou processando a admissão.', timestamp: '07:31' },
    ],
  });
  AC_TAREFAS.push({
    id: 'T-2108', operatorId: 'o2', clientName: 'Clínica Bem Viver ME', cnpj: '71.335.480/0001-27',
    familia: 'FAMILY_1', origem: 'BR Experts', typeCode: 'admissao_clt', type: 'Admissão CLT',
    status: 'stationed', clientResponded: false, sla: '6h', slaStatus: 'normal', receivedAt: '10:15',
    createdDaysAgo: 1, timelineStep: 1, labDone: 0,
    stationedAt: 'ontem 16:20', stationedReason: 'Aguardando a CTPS digital e o comprovante de endereço',
    clientMessage: 'Admissão da recepcionista nova, ela começa dia 12.', colaborador: 'Larissa Prado Nunes',
    senderName: 'Dr. Otávio Sales', senderScopes: ['RH'],
    secoes: labAdmissaoCLT({
      nome: 'Larissa Prado Nunes', cpf: '390.556.812-40', cargo: 'Recepcionista', matricula: '0207',
      depto: 'Atendimento', cc: 'CC 01 — Administrativo', sindicato: 'Sind. Empregados em Estab. de Saúde',
      admissao: '12/06/2026', salario: 'R$ 2.050,00', fimExperiencia: '11/07/2026', fimProrrogacao: '09/09/2026',
      jornada: '07:00 às 16:00, seg a sex', cbo: '4221-05',
      nascimento: '05/06/1999', civil: 'Solteira', sexo: 'Feminino', instrucao: 'Ensino superior incompleto',
      mae: 'Regina Prado Nunes', cep: '01327-000', logradouro: 'Rua Treze de Maio, 980', bairro: 'Bela Vista', cidade: 'São Paulo',
      telefone: '(11) 93318-4402', email: 'larissa.pnunes@email.com',
      rg: '41.887.203-6', ctps: '—', pis: '188.02347.55-9', eleitor: '4455 6677 8899',
      dependentes: [],
      obs: 'A CTPS digital ainda não chegou — a admissão fica travada até o documento vir.',
    }),
    attachments: labAnexosAdmissao('larissa', []),
    messages: [
      { from: 'client', text: 'Admissão da recepcionista nova, ela começa dia 12.', timestamp: 'ontem 10:15' },
      { from: 'operator', text: 'Pra fechar o cadastro preciso da CTPS digital e do comprovante de endereço, pode enviar?', timestamp: 'ontem 16:20' },
    ],
  });
}

/* ============================================================
   APURAÇÃO DE IRRF SOBRE ALUGUEL — o processo do Motor Fiscal SN
   ------------------------------------------------------------
   O motor dispara no dia 01, para a competência do mês anterior, só nas empresas com locação
   cadastrada. O passo 1 é de uma pessoa: o motor abre uma pendência "Despesa de aluguel" e
   espera o formulário (../aluguel.js). Do passo 2 em diante, é o motor.
   A pendência carrega `aluguel`: as datas da competência e, depois do envio, o que foi enviado.
   Competência Abr/2026, disparada em 01/05, prazo interno 15/05.
   ============================================================ */
if (typeof AP_FLUXOS !== 'undefined' && !AP_FLUXOS.aluguel) {
  AP_FLUXOS.aluguel = [
    ['Solicitação', 'Criar solicitação de Despesa de Aluguel', 'Dados do aluguel preenchidos pelo operador'],
    ['Verificação Inicial', 'Validar dados da solicitação', 'Dados conferidos — locador residente, sem pendências'],
    ['Processamento e Cálculo', 'Calcular o IRRF sobre aluguel', 'IRRF calculado pela tabela progressiva mensal'],
    ['Transmissão Obrigações', 'Enviar dados IRRF para EFD-Reinf (evento R-4010)', 'Evento R-4010 transmitido — recibo retornado'],
    ['Transmissão Obrigações', 'Gerar guia (DARF 3208)', 'DARF 3208 gerado'],
    ['Entrega ao Cliente', 'Salvar documentos no GDocs', 'Documentos salvos na pasta da competência'],
    ['Entrega ao Cliente', 'Criar tarefa no GPC', 'Tarefa criada no GPC'],
    ['Entrega ao Cliente', 'Notificar disponibilização de documentos ao cliente', 'Cliente notificado por e-mail'],
  ];
}

/* O caso do roteiro: a pendência chega na fila sem dono, a pessoa atribui a si e preenche.
   A mãe vem primeiro — o filtro de Processo do painel nomeia o typeCode pela primeira tarefa. */
if (typeof AC_TAREFAS !== 'undefined' && !AC_TAREFAS.some((t) => t.id === 'T-5501')) {
  const base = {
    typeCode: 'despesa_aluguel', motor: 'Fiscal', competencia: 'Abr/2026', origin: 'autopilot',
    senderName: 'Autopilot · Motor Fiscal SN', apFluxo: 'aluguel', createdDaysAgo: 13, sla: '1d', slaStatus: 'risk',
    clientName: 'Café Grão Nobre LTDA', cnpj: '27.418.903/0001-66', familia: 'FAMILY_1', origem: 'BR Experts', erpOperado: 'DOMINIO_111057',
  };
  AC_TAREFAS.push(
    Object.assign({}, base, {
      id: 'T-5501', operatorId: 'ap', type: 'Apuração de IRRF sobre Aluguel', receivedAt: '06:00',
      status: 'active', hitl: true, apDone: 0,
      apPendencia: { label: 'Ir para a tarefa gerada', to: 'T-5502' },
    }),
    Object.assign({}, base, {
      id: 'T-5502', operatorId: null, type: 'Despesa de aluguel', receivedAt: '06:01',
      status: 'queue', apDone: 0,
      aluguel: { disparadaEm: '01/05/2026', prazoInterno: '15/05/2026', enviado: null },
      apExecucao: { label: 'Ir para o processo que gerou', to: 'T-5501' },
    }),
  );
}

