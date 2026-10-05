/* ============================================================
   tarefas.js — MOCKS do laboratório da tela da tarefa
   ------------------------------------------------------------
   Nasceu como CÓPIA dos mocks do painel de acompanhamento, trazida pra dentro do
   lab de propósito: o painel oficial (`../acompanhamento.html`) fica intocado, então
   nada que a gente experimente aqui pode bagunçar o protótipo publicado.
   O preço é sabido: se os mocks de lá mudarem, esta cópia não acompanha.

   O que já divergiu do original, de propósito:
   - a T-2104 está com a Daniele (o1) em vez da Beatriz (o3) — é o que dá ao lab um
     caso de "tarefa de DP em processamento que é minha", com os controles ativos;
   - todos os casos de DP têm ANEXOS do cliente;
   - todos os casos de DP são ADMISSÃO CLT e o formulário sai de um molde
     único — ver labAdmissaoCLT, abaixo.
   ============================================================ */

const AC_OPERADORES = [
  { id: 'o1', nome: 'Daniele Ribeiro', cor: '#f25461' },
  { id: 'o2', nome: 'Lucas Pereira', cor: '#0171e4' },
  { id: 'o3', nome: 'Beatriz Santos', cor: '#16a34a' },
  { id: 'o4', nome: 'Felipe Oliveira', cor: '#9333ea' },
  // Autopilot entra como "mais um operador": quando o robô está executando a
  // tarefa sozinho, ele é o responsável. Vira opção no filtro Operador. (robo:true)
  { id: 'ap', nome: 'Autopilot', cor: '#4f46e5', robo: true },
];
function acOp(id) { return AC_OPERADORES.find(o => o.id === id) || null; }

// status: active | queue | stationed(+clientResponded) | completed | cancelled
// createdDaysAgo / finishedDaysAgo / cancelledDaysAgo: relativos ao "hoje" do protótipo
/* ============================================================
   O FORMULÁRIO DE ADMISSÃO CLT — molde único dos casos de DP
   ------------------------------------------------------------
   TODOS os casos de DP do lab usam Admissão CLT. É o processo mais
   complexo que existe hoje — 6 abas, dependentes, documentos — então cobre qualquer caso de uso
   sem que o formulário seja o fator limitante. Antes cada estado usava um processo diferente
   (solicitação geral, férias, rescisão), e foi navegando na Solicitação Geral que apareceu uma
   falha DO LAB: ao entrar em Processamento, o formulário e os anexos desapareciam da tela. Na tela
   do projeto isso não acontece — o passo "Responder ao cliente" carrega o bloco "O que o cliente
   pediu" com assunto, descrição e anexos. O que falta é aqui: ver a limitação em dados.js.

   O molde é uma função e não seis blocos copiados: mesma estrutura em todos, valores por caso.
   Assim nenhum caso divergir do outro por descuido. Só o que é do caso vem por parâmetro.
   ============================================================ */
function labAdmissaoCLT(d) {
  const abas = [
    { titulo:'1. Geral', subsecoes:[
      { titulo:'Dados básicos', campos:{ 'Nome':d.nome, 'Nome social':d.nomeSocial || '—', 'CPF':d.cpf, 'Cargo':d.cargo, 'Matrícula':d.matricula, 'Serviço (sede)':d.sede || 'Matriz', 'Departamento':d.depto, 'Centro de custo':d.cc, 'Sindicato':d.sindicato } },
      { titulo:'Admissão', campos:{ 'Primeiro emprego':d.primeiroEmprego || 'Não', 'Categoria':'Mensalista', 'Vínculo empregatício':'Celetista', 'Data da admissão':d.admissao, 'Salário':d.salario } },
      { titulo:'Contrato de experiência', campos:{ 'Contrato de experiência':'30 dias', 'Dias de prorrogação':'60', 'Data fim da experiência':d.fimExperiencia, 'Data fim da prorrogação':d.fimProrrogacao } },
      { titulo:'Horário', campos:{ 'Jornada':d.jornada, 'Carga horária':d.cargaMes || '220h', 'Horas por semana':d.horasSemana || '44', 'Horas por dia':d.horasDia || '8,8' } },
    ] },
    { titulo:'2. Profissional', subsecoes:[
      { titulo:'Função', campos:{ 'CBO':d.cbo, 'Função':d.funcao || d.cargo, 'Insalubridade':d.insalubridade || 'Não', 'Periculosidade':d.periculosidade || 'Não', 'Grau de risco':d.risco || '2' } },
    ] },
    { titulo:'3. Pessoal', subsecoes:[
      { titulo:'Dados pessoais', campos:{ 'Data de nascimento':d.nascimento, 'Estado civil':d.civil, 'Sexo':d.sexo, 'Nacionalidade':'Brasileira', 'Grau de instrução':d.instrucao, 'Nome da mãe':d.mae, 'Nome do pai':d.pai || '—' } },
      { titulo:'Endereço', campos:{ 'CEP':d.cep, 'Logradouro':d.logradouro, 'Bairro':d.bairro, 'Cidade':d.cidade, 'UF':d.uf || 'SP' } },
      { titulo:'Contato', campos:{ 'Telefone':d.telefone, 'E-mail':d.email } },
    ] },
    { titulo:'4. Documentos', subsecoes:[
      { titulo:'Documentos', campos:{ 'RG':d.rg, 'Órgão emissor':d.orgao || 'SSP/SP', 'CTPS':d.ctps, 'PIS/PASEP':d.pis, 'Título de eleitor':d.eleitor, 'Reservista':d.reservista || '—' } },
    ] },
  ];
  // Sem dependentes a aba não existe — melhor do que uma aba que abre vazia.
  if (d.dependentes && d.dependentes.length) {
    abas.push({ titulo:'5. Dependentes', subsecoes:d.dependentes.map((dep, i) => ({ titulo:`Dependente ${i + 1}`, campos:dep })) });
  }
  abas.push({ titulo:`${d.dependentes && d.dependentes.length ? 6 : 5}. Observações`, subsecoes:[
    { titulo:'Observações', campos:{ 'Observações':d.obs } },
  ] });
  return abas;
}

// Os documentos que o cliente anexa numa admissão. `extras` entra no fim, pro caso que precisar.
function labAnexosAdmissao(primeiroNome, extras) {
  const base = [
    { name:`documentos-${primeiroNome}.pdf`, size:'2,3 MB' },
    { name:'ctps-digital.pdf', size:'740 KB' },
    { name:'comprovante-residencia.pdf', size:'150 KB' },
  ];
  return extras ? base.concat(extras) : base;
}

// origem: base do cliente (silver_customers_origin.name) — vira filtro e aparece na linha
const AC_TAREFAS = [
  // ================================================================
  // 1 exemplo por CASO DE USO.
  // Solicitação Cliente/Outras (varia o tipo p/ testar formulários) · Autopilot
  // executando (robô) · HITL (pendência robô→pessoa). Enxuto de propósito: 1 por caso,
  // pra nenhum mock ficar desatualizado.
  // ================================================================
  // ===== SOLICITAÇÃO CLIENTE / OUTRAS — 1 por estado, TODOS em Admissão CLT =====
  // O que varia entre eles é o ESTADO da tarefa (na fila · em execução · em espera · em
  // processamento · cancelada · concluída), que é o eixo dos casos. O processo é o mesmo de
  // propósito: ver labAdmissaoCLT, acima.

  // Na fila — sem dono, ninguém pegou ainda
  { id:'T-2101', operatorId:null, clientName:'Mercearia Central ME', cnpj:'19.772.640/0001-08', familia:'DEFAULT', origem:'Quality', typeCode:'admissao_clt', type:'Admissão CLT', status:'queue', sla:'8h', slaStatus:'normal', receivedAt:'10:35', createdDaysAgo:23,
    clientMessage:'Admissão da nova auxiliar de loja, ela começa dia 08.', colaborador:'Sônia Ramos de Lima', senderName:'Rita Alves', senderScopes:['Financeiro'],
    secoes:labAdmissaoCLT({
      nome:'Sônia Ramos de Lima', cpf:'318.774.902-15', cargo:'Auxiliar de loja', matricula:'0812',
      depto:'Loja', cc:'CC 01 — Comercial', sindicato:'Sind. Empregados no Comércio',
      admissao:'08/06/2026', salario:'R$ 1.720,00', fimExperiencia:'07/07/2026', fimProrrogacao:'05/09/2026',
      jornada:'08:00 às 17:20, seg a sex', cbo:'5211-10',
      nascimento:'14/02/1995', civil:'Solteira', sexo:'Feminino', instrucao:'Ensino médio completo',
      mae:'Vera Ramos de Lima', cep:'08420-100', logradouro:'Rua das Palmeiras, 88', bairro:'Itaquera', cidade:'São Paulo',
      telefone:'(11) 98123-4477', email:'sonia.lima@email.com',
      rg:'41.229.774-2', ctps:'7712043 / 004-SP', pis:'128.44521.09-3', eleitor:'4455 6677 8899',
      obs:'Primeira admissão deste cliente pelo Hub. O RH pediu que o vale-transporte já entre na folha do primeiro mês.',
    }),
    attachments:labAnexosAdmissao('sonia'),
    messages:[ { from:'client', text:'Admissão da nova auxiliar de loja, ela começa dia 08.', timestamp:'10:35' } ] },

  // Em execução — de outra pessoa (Lucas), ainda na validação
  { id:'T-2102', operatorId:'o2', clientName:'Auto Center Norte LTDA', cnpj:'45.221.118/0001-02', familia:'CORP', origem:'Partwork', typeCode:'admissao_clt', type:'Admissão CLT', status:'active', sla:'3h', slaStatus:'risk', receivedAt:'07:50', createdDaysAgo:41, timelineStep:1,
    clientMessage:'Admissão do mecânico novo, ele entra dia 15.', colaborador:'João Batista Ferreira', senderName:'Marcelo Nunes', senderScopes:['RH'],
    secoes:labAdmissaoCLT({
      nome:'João Batista Ferreira', cpf:'507.213.884-70', cargo:'Mecânico', matricula:'0455',
      depto:'Oficina', cc:'CC 03 — Serviços', sindicato:'Sind. Trab. Metalúrgicos',
      admissao:'15/06/2026', salario:'R$ 2.940,00', fimExperiencia:'14/07/2026', fimProrrogacao:'12/09/2026',
      jornada:'08:00 às 18:00, seg a sex', cbo:'9144-05', insalubridade:'Sim — 20%', risco:'3',
      nascimento:'03/07/1986', civil:'Casado', sexo:'Masculino', instrucao:'Ensino técnico completo',
      mae:'Célia Batista Ferreira', pai:'Nelson Ferreira',
      cep:'07190-320', logradouro:'Avenida Industrial, 1230', bairro:'Cumbica', cidade:'Guarulhos',
      telefone:'(11) 97455-2210', email:'joao.ferreira@email.com',
      rg:'28.774.331-5', ctps:'6620117 / 009-SP', pis:'163.72290.44-1', eleitor:'1122 3344 5566', reservista:'9988776655',
      dependentes:[
        { 'Nome':'Miguel Batista Ferreira', 'Parentesco':'Filho', 'Data de nascimento':'22/05/2015', 'Dep. IR':'Sim', 'Dep. salário-família':'Sim' },
      ],
      obs:'Colaborador com adicional de insalubridade (20%) por atuar na área de pintura. O cliente pediu urgência: o contrato começa na semana que vem.',
    }),
    attachments:labAnexosAdmissao('joao', [{ name:'exame-admissional.pdf', size:'1,1 MB' }]),
    messages:[ { from:'client', text:'Admissão do mecânico novo, ele entra dia 15.', timestamp:'07:50' }, { from:'operator', text:'Recebido! Vou conferir a documentação e registrar a admissão.', timestamp:'07:58' } ] },

  // Em espera — aguardando resposta do cliente (falta documento pra fechar a admissão)
  { id:'T-2103', operatorId:'o1', clientName:'Restaurante Bella Massa', cnpj:'62.443.997/0001-18', familia:'FAMILY_1', origem:'BR Experts', typeCode:'admissao_clt', type:'Admissão CLT', status:'stationed', clientResponded:false, sla:'6h', slaStatus:'normal', receivedAt:'09:05', createdDaysAgo:1, stationedAt:'ontem 15:40', stationedReason:'Aguardando o número do PIS e o comprovante de escolaridade',
    clientMessage:'Admissão da auxiliar de cozinha, ela começa dia 09.', colaborador:'Juliana Prado Martins', senderName:'Beatriz Campos', senderScopes:['RH'],
    secoes:labAdmissaoCLT({
      nome:'Juliana Prado Martins', cpf:'429.660.117-38', cargo:'Auxiliar de cozinha', matricula:'0298',
      depto:'Cozinha', cc:'CC 02 — Operações', sindicato:'Sind. Trab. em Hotéis e Restaurantes',
      admissao:'09/06/2026', salario:'R$ 2.180,00', fimExperiencia:'08/07/2026', fimProrrogacao:'06/09/2026',
      jornada:'11:00 às 20:20, ter a sáb', cbo:'5132-20',
      nascimento:'19/09/1992', civil:'Solteira', sexo:'Feminino', instrucao:'Ensino médio completo',
      mae:'Marta Prado Martins', cep:'05033-070', logradouro:'Rua Cotoxó, 512', bairro:'Perdizes', cidade:'São Paulo',
      telefone:'(11) 96522-8890', email:'juliana.martins@email.com',
      rg:'33.908.514-6', ctps:'5541908 / 002-SP', pis:'A confirmar', eleitor:'7788 9900 1122',
      dependentes:[
        { 'Nome':'Antônia Prado Martins', 'Parentesco':'Filha', 'Data de nascimento':'04/11/2020', 'Dep. IR':'Sim', 'Dep. salário-família':'Sim' },
      ],
      obs:'Faltam o número do PIS e o comprovante de escolaridade — pedido ao cliente. Sem o PIS o cadastro na Domínio não fecha.',
    }),
    attachments:[ { name:'documentos-juliana.pdf', size:'1,8 MB' }, { name:'comprovante-residencia.pdf', size:'150 KB' } ],
    messages:[
      { from:'client', text:'Admissão da auxiliar de cozinha, ela começa dia 09.', timestamp:'09:05' },
      { from:'operator', text:'Oi, Beatriz! Pra fechar o cadastro preciso do número do PIS e do comprovante de escolaridade. Pode enviar?', timestamp:'09:20' },
    ] },

  // Em processamento — minha, roteiro andando (o caso central da tela nova)
  { id:'T-2104', operatorId:'o1', clientName:'Café da Esquina ME', cnpj:'51.882.004/0001-66', familia:'FAMILY_2', origem:'CTZ', typeCode:'admissao_clt', type:'Admissão CLT', status:'processing', sla:'2h', slaStatus:'normal', receivedAt:'10:10', createdDaysAgo:9,
    clientMessage:'Admissão da nova atendente, ela começa na segunda.', colaborador:'Letícia Gomes Souza', senderName:'André Prado', senderScopes:['RH'],
    secoes:labAdmissaoCLT({
      nome:'Letícia Gomes Souza', cpf:'456.789.123-00', cargo:'Atendente de cafeteria', matricula:'0733',
      depto:'Salão', cc:'CC 02 — Operações', sindicato:'Sind. Trab. em Hotéis e Restaurantes',
      primeiroEmprego:'Sim', admissao:'02/06/2026', salario:'R$ 1.980,00', fimExperiencia:'01/07/2026', fimProrrogacao:'30/08/2026',
      jornada:'07:00 às 16:20, seg a sex', cbo:'5134-25',
      nascimento:'25/08/2004', civil:'Solteira', sexo:'Feminino', instrucao:'Ensino médio completo',
      mae:'Rosana Gomes Souza', cep:'03164-000', logradouro:'Rua Serra de Bragança, 420', bairro:'Tatuapé', cidade:'São Paulo',
      telefone:'(11) 97654-3210', email:'leticia.souza@email.com',
      rg:'45.221.883-7', ctps:'8123774 / 001-SP', pis:'201.55890.12-7', eleitor:'3344 5566 7788',
      obs:'Primeiro emprego: a CTPS foi emitida agora e o número do PIS saiu junto do cadastro. O cliente pediu o vale-refeição no primeiro mês.',
    }),
    attachments:labAnexosAdmissao('leticia', [{ name:'rg-leticia.jpg', size:'1,4 MB' }]),
    messages:[ { from:'client', text:'Admissão da nova atendente, ela começa na segunda.', timestamp:'10:10' }, { from:'operator', text:'Recebido! Já registrei e estou processando a admissão.', timestamp:'10:22' } ] },

  // Cancelada — só a tarja de motivo, sem fases e sem roteiro
  { id:'T-2105', operatorId:'o3', clientName:'Salão Beleza Pura', cnpj:'70.119.552/0001-33', familia:'FAMILY_3', origem:'São Lucas', typeCode:'admissao_clt', type:'Admissão CLT', status:'cancelled', sla:'4h', slaStatus:'normal', receivedAt:'08:20', createdDaysAgo:0, cancelledDaysAgo:0, cancelledAt:'hoje 09:10', cancelReason:'Cliente desistiu — a candidata não compareceu para assinar o contrato e a vaga foi reaberta.',
    clientMessage:'Admissão da recepcionista nova, entrada dia 10.', colaborador:'Bianca Souza Lima', senderName:'Cláudia Reis', senderScopes:['RH'],
    secoes:labAdmissaoCLT({
      nome:'Bianca Souza Lima', cpf:'611.048.293-54', cargo:'Recepcionista', matricula:'0140',
      depto:'Recepção', cc:'CC 01 — Atendimento', sindicato:'Sind. Empregados no Comércio',
      admissao:'10/06/2026', salario:'R$ 1.860,00', fimExperiencia:'09/07/2026', fimProrrogacao:'07/09/2026',
      jornada:'09:00 às 18:20, ter a sáb', cbo:'4221-05',
      nascimento:'30/01/1998', civil:'Solteira', sexo:'Feminino', instrucao:'Ensino médio completo',
      mae:'Sandra Souza Lima', cep:'02412-090', logradouro:'Rua Voluntários da Pátria, 2210', bairro:'Santana', cidade:'São Paulo',
      telefone:'(11) 95410-7723', email:'bianca.lima@email.com',
      rg:'39.114.207-8', ctps:'6690341 / 003-SP', pis:'147.30028.55-9', eleitor:'2233 4455 6677',
      obs:'Admissão cancelada antes do registro na Domínio — nada foi lançado.',
    }),
    attachments:[ { name:'documentos-bianca.pdf', size:'1,6 MB' } ] },

  // Concluída — Admissão CLT completa (formulário grande: 6 abas, dependentes + log)
  { id:'T-2049', operatorId:'o1', clientName:'Marmoraria Pedra Nobre', cnpj:'44.552.671/0001-23', familia:'FAMILY_4', origem:'Partwork', typeCode:'admissao_clt', type:'Admissão CLT', status:'completed', sla:'3h', slaStatus:'normal', receivedAt:'08:15', createdDaysAgo:0, finishedDaysAgo:0, finishedAt:'hoje 11:20',
    clientMessage:'Admissão do novo encarregado de produção, começar dia 02.', colaborador:'Rafael Nogueira Dias', senderName:'Patrícia Gomes', senderScopes:['RH'],
    secoes:labAdmissaoCLT({
      nome:'Rafael Nogueira Dias', cpf:'284.559.170-33', cargo:'Encarregado de produção', matricula:'0731',
      depto:'Produção', cc:'CC 02 — Produção', sindicato:'Sind. Trab. Mármores e Granitos',
      admissao:'02/06/2026', salario:'R$ 3.180,00', fimExperiencia:'01/07/2026', fimProrrogacao:'30/08/2026',
      jornada:'07:00 às 16:00, seg a sex', cbo:'7152-10', insalubridade:'Sim — 20%', risco:'3',
      nascimento:'08/11/1988', civil:'Casado', sexo:'Masculino', instrucao:'Ensino médio completo',
      mae:'Sônia Nogueira Dias', pai:'Antônio Dias',
      cep:'13480-200', logradouro:'Rua das Pedreiras, 145', bairro:'Jardim Industrial', cidade:'Limeira',
      telefone:'(19) 99745-1120', email:'rafael.dias@email.com',
      rg:'34.887.221-0', ctps:'8841220 / 012-SP', pis:'170.98342.11-5', eleitor:'2233 4455 6677', reservista:'1122334455',
      dependentes:[
        { 'Nome':'Helena Nogueira Dias', 'Parentesco':'Filha', 'Data de nascimento':'12/03/2019', 'Dep. IR':'Sim', 'Dep. salário-família':'Sim' },
        { 'Nome':'Tomás Nogueira Dias', 'Parentesco':'Filho', 'Data de nascimento':'27/09/2022', 'Dep. IR':'Sim', 'Dep. salário-família':'Sim' },
      ],
      obs:'Colaborador com adicional de insalubridade (20%) por atuar na área de corte. Documentação completa anexada pelo cliente.',
    }),
    messages:[
      { from:'client', text:'Admissão do novo encarregado de produção, começar dia 02.', timestamp:'08:15' },
      { from:'operator', text:'Recebido! Vou conferir a documentação e registrar a admissão.', timestamp:'08:22' },
      { from:'operator', text:'Admissão concluída. Ajustei o adicional de insalubridade conforme a função.', timestamp:'11:18' },
    ],
    attachments:[
      { name:'documentos-rafael.pdf', size:'2,3 MB' },
      { name:'ctps-digital.pdf', size:'740 KB' },
      { name:'certidao-nascimento-helena.pdf', size:'320 KB' },
      { name:'certidao-nascimento-tomas.pdf', size:'318 KB' },
      { name:'comprovante-residencia.pdf', size:'150 KB' },
    ],
    log:[
      { field:'Adicional de insalubridade', before:'—', after:'20%', by:'Daniele Ribeiro', at:'hoje 10:40' },
      { field:'Grau de risco', before:'2', after:'3', by:'Daniele Ribeiro', at:'hoje 10:44' },
      { field:'Data da admissão', before:'01/06/2026', after:'02/06/2026', by:'Daniele Ribeiro', at:'hoje 10:50' },
    ] },

  // ===== AUTOPILOT EXECUTANDO (tarefa do robô, operatorId 'ap') =====
  // Em execução — robô rodando (Apuração DAS / Fiscal)
  { id:'T-5003', operatorId:'ap', clientName:'Mercado União LTDA', cnpj:'28.654.012/0001-44', familia:'FAMILY_5', origem:'Efforts', erpOperado:'DOMINIO_111057', typeCode:'das', type:'Apuração DAS', motor:'Fiscal', competencia:'Jun/2026', status:'active', sla:'10h', slaStatus:'normal', receivedAt:'11:50', createdDaysAgo:0, origin:'autopilot', senderName:'Autopilot · Motor Fiscal',
    apFluxo:'das', apDone:6, apRun:true },
  // Aguardando operador — robô travou (Folha / DP) → gera a pendência T-5002
  { id:'T-5001', operatorId:'ap', hitl:true, clientName:'Transportadora Rota Sul LTDA', cnpj:'41.207.633/0001-58', familia:'FAMILY_5_SILVER', origem:'ContJet', erpOperado:'DOMINIO_141935', typeCode:'folha', type:'Fechamento de folha mensal', motor:'DP', competencia:'Jun/2026', status:'active', sla:'6h', slaStatus:'risk', receivedAt:'11:58', createdDaysAgo:0, origin:'autopilot', senderName:'Autopilot · Motor de Pessoal',
    apFluxo:'folha', apDone:2, apHitl:{ det:'Cálculo fora da faixa histórica: variação +23,3% vs. média de 3 meses (limite ±5%). Pode ser real (reajuste, 13º, novas admissões) ou lançamento duplicado — precisa de um operador pra confirmar antes de liberar.', comparativo:{ aLabel:'Folha calculada (jun)', aVal:'R$ 48.320,00', bLabel:'Média dos últimos 3 meses', bVal:'R$ 39.200,00' }, need:'A folha fica bloqueada até um operador validar o cálculo.' }, apPendencia:{ label:'Ir para a tarefa gerada', to:'T-5002' } },
  // Concluído — robô ponta a ponta com atuações do operador no meio (Folha / DP)
  { id:'T-5015', operatorId:'ap', clientName:'Metalúrgica Força Total LTDA', cnpj:'33.882.417/0001-05', familia:'FAMILY_5_GOLD', origem:'Partwork', erpOperado:'DOMINIO_141935', typeCode:'folha', type:'Fechamento de folha mensal', motor:'DP', competencia:'Jun/2026', status:'completed', sla:'6h', slaStatus:'normal', receivedAt:'08:00', createdDaysAgo:0, finishedDaysAgo:0, finishedAt:'hoje 11:40', origin:'autopilot', senderName:'Autopilot · Motor de Pessoal',
    apFluxo:'folha', apDone:7, apAtuacoes:[
      { naEtapa:0, divergencia:'Quantidade de colaboradores ativos fora do esperado: 48 apurados vs. 47 esperados (base 45 + 3 admissões − 1 rescisão · diferença +1). Pode ser uma admissão ou rescisão não lançada, ou movimento do mês ainda não refletido no cadastro — confira antes de seguir com o cálculo.', comparativo:{ aLabel:'Ativos apurados', aVal:'48', bLabel:'Ativos esperados', bVal:'47' }, nome:'Carlos Menezes · operador', resposta:'nao', obs:'Conferi as admissões e rescisões contra os documentos; o que foi informado está correto.' },
      { naEtapa:2, divergencia:'Cálculo fora da faixa histórica: variação +23,3% vs. média de 3 meses. Pode ser real (reajuste salarial, 13º, novas admissões) ou lançamento duplicado — confira antes de liberar a folha.', comparativo:{ aLabel:'Folha calculada (jun)', aVal:'R$ 48.320,00', bLabel:'Média dos últimos 3 meses', bVal:'R$ 39.200,00' }, nome:'Daniele Ribeiro · operadora', resposta:'sim', obs:'A variação era real (reajuste salarial de maio + 2 admissões), mas havia uma rubrica lançada em duplicidade. Corrigi e liberei o cálculo.', anexos:[{ name:'conferencia-folha-jun.xlsx', size:'84 KB' }] },
      { naEtapa:3, divergencia:'eSocial rejeitou um evento na transmissão: CBO divergente entre o cadastro do colaborador e a tabela oficial do órgão. A folha fica pendente até o cadastro ser corrigido e o evento retransmitido.', nome:'Lucas Pereira · operador', resposta:'sim', obs:'Ajustei o CBO no cadastro do colaborador e retransmiti; o eSocial aceitou.' },
    ] },

  // ===== HITL (pendência gerada pro operador — origin autopilot, operatorId != 'ap') =====
  // Na fila — pendência sem dono (Validar cálculo da folha) ⇄ execução T-5001
  { id:'T-5002', operatorId:null, clientName:'Transportadora Rota Sul LTDA', cnpj:'41.207.633/0001-58', familia:'FAMILY_5_SILVER', origem:'ContJet', erpOperado:'DOMINIO_141935', typeCode:'folha', type:'Validar cálculo da folha', motor:'DP', competencia:'Jun/2026', status:'queue', sla:'3h', slaStatus:'risk', receivedAt:'11:59', createdDaysAgo:0, origin:'autopilot', senderName:'Autopilot · Motor de Pessoal', flowHref:'dp-validacao-calculos.html',
    apFluxo:'folha', apDone:2, apHitl:{ det:'Cálculo fora da faixa histórica: variação +23,3% vs. média de 3 meses (limite ±5%). Pode ser real (reajuste, 13º, novas admissões) ou lançamento duplicado — confira antes de liberar.', comparativo:{ aLabel:'Folha calculada (jun)', aVal:'R$ 48.320,00', bLabel:'Média dos últimos 3 meses', bVal:'R$ 39.200,00' }, need:'Confirmar se a variação é real ou corrigir o lançamento e reprocessar.' }, apExecucao:{ label:'Ir para o processo que gerou', to:'T-5001' } },
  // Em execução — operador resolvendo (Divergência de colaboradores / DP)
  { id:'T-5007', operatorId:'o1', clientName:'Construções Sólidas LTDA', cnpj:'81.557.220/0001-90', familia:'FAMILY_WISE', origem:'Partwork', erpOperado:'DOMINIO_143257', typeCode:'folha', type:'Divergência de colaboradores ativos', motor:'DP', competencia:'Jun/2026', status:'active', sla:'4h', slaStatus:'normal', receivedAt:'09:40', createdDaysAgo:0, origin:'autopilot', senderName:'Autopilot · Motor de Pessoal', flowHref:'dp-conferencia-dados.html',
    apFluxo:'folha', apDone:0, apHitl:{ det:'Divergência na quantidade de ativos: esperado 47 (base 45 + 3 admissões − 1 rescisão) · apurado 48 · diferença +1. Verifique admissões/rescisões não lançadas.', need:'Confirmar o ajuste e devolver ao Autopilot para seguir com o cálculo.' },
    apOperador:{ nome:'Daniele Ribeiro · operadora', resposta:'sim', obs:'Havia uma rescisão de maio não lançada; ajustei o quadro.' }, apExecucao:{ label:'Ir para o processo que gerou', to:'T-5006' } },
  // Concluído — operador resolveu e o robô seguiu (Validar faturamento / Fiscal)
  { id:'T-5012', operatorId:'o2', clientName:'Padaria Trigo Dourado ME', cnpj:'37.665.201/0001-49', familia:'BPO_FINANCEIRO', origem:'Efforts', erpOperado:'DOMINIO_111057', typeCode:'das', type:'Validar faturamento — variação +28%', motor:'Fiscal', competencia:'Mai/2026', status:'completed', sla:'4h', slaStatus:'normal', receivedAt:'08:30', createdDaysAgo:0, finishedDaysAgo:0, finishedAt:'hoje 11:00', origin:'autopilot', senderName:'Autopilot · Motor Fiscal', flowHref:'fiscal-validacao-calculos.html',
    apFluxo:'das', apDone:10, apAtuacoes:[
      { naEtapa:4, divergencia:'Faturamento fora da faixa histórica: +28% vs. média de 12 meses. Pode ser sazonalidade ou nota lançada em duplicidade — precisa de um operador confirmar antes de transmitir.', comparativo:{ aLabel:'Faturamento (mai)', aVal:'R$ 205.120,00', bLabel:'Média dos últimos 12 meses', bVal:'R$ 160.000,00' }, nome:'Lucas Pereira · operador', resposta:'nao', obs:'Confirmei com o cliente: houve um evento grande no mês (venda sazonal). Faturamento real, sem duplicidade — liberei a apuração.' },
    ], apExecucao:{ label:'Ir para o processo que gerou', to:'T-5008' } },

  // ===== Execuções do robô que geraram as HITL (pares dos cross-links) =====
  // Par de T-5007 (HITL em execução): a execução do robô continua aguardando o operador.
  { id:'T-5006', operatorId:'ap', hitl:true, clientName:'Construções Sólidas LTDA', cnpj:'81.557.220/0001-90', familia:'FAMILY_WISE', origem:'Partwork', erpOperado:'DOMINIO_143257', typeCode:'folha', type:'Fechamento de folha mensal', motor:'DP', competencia:'Jun/2026', status:'active', sla:'4h', slaStatus:'normal', receivedAt:'09:38', createdDaysAgo:0, origin:'autopilot', senderName:'Autopilot · Motor de Pessoal',
    apFluxo:'folha', apDone:0, apHitl:{ det:'Divergência na quantidade de ativos: esperado 47 (base 45 + 3 admissões − 1 rescisão) · apurado 48 · diferença +1. Pode ser uma admissão ou rescisão não lançada.', comparativo:{ aLabel:'Ativos apurados', aVal:'48', bLabel:'Ativos esperados', bVal:'47' }, need:'A folha fica bloqueada até um operador conferir o quadro de colaboradores.' }, apPendencia:{ label:'Ir para a tarefa gerada', to:'T-5007' } },
  // Par de T-5012 (HITL concluída): a execução do robô seguiu e concluiu após a validação.
  { id:'T-5008', operatorId:'ap', clientName:'Padaria Trigo Dourado ME', cnpj:'37.665.201/0001-49', familia:'BPO_FINANCEIRO', origem:'Efforts', erpOperado:'DOMINIO_111057', typeCode:'das', type:'Apuração DAS', motor:'Fiscal', competencia:'Mai/2026', status:'completed', sla:'10h', slaStatus:'normal', receivedAt:'08:00', createdDaysAgo:0, finishedDaysAgo:0, finishedAt:'hoje 11:05', origin:'autopilot', senderName:'Autopilot · Motor Fiscal',
    apFluxo:'das', apDone:10, apAtuacoes:[
      { naEtapa:4, divergencia:'Faturamento fora da faixa histórica: +28% vs. média de 12 meses. Pode ser sazonalidade ou nota lançada em duplicidade — precisa de um operador confirmar antes de transmitir.', comparativo:{ aLabel:'Faturamento (mai)', aVal:'R$ 205.120,00', bLabel:'Média dos últimos 12 meses', bVal:'R$ 160.000,00' }, nome:'Lucas Pereira · operador', resposta:'nao', obs:'Confirmei com o cliente: houve um evento grande no mês (venda sazonal). Faturamento real, sem duplicidade — liberei a apuração.' },
    ], apPendencia:{ label:'Ir para a tarefa gerada', to:'T-5012' } },
];

// Monta o autopilot:{timeline,problem,need} de cada tarefa do robô a partir de AP_FLUXOS.
AC_TAREFAS.forEach(t => { if (t.origin === 'autopilot' && t.apFluxo) t.autopilot = apBuildMiolo(t); });
