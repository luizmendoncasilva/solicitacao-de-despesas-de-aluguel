/* ============================================================
   dp-wizard.js — comportamento compartilhado das telas do operador
   (DP, Fiscal, Contábil). Tudo roda sobre as funções globais do core
   (qs, state, showScreen, renderFileItem, etc.).

   Módulos reutilizáveis:
   - renderTimelineAtuacao(items): linha do tempo de atuação (robô/operador),
     agrupando ações consecutivas do mesmo ator sob um cabeçalho só.
   - Wizard de resposta: pergunta "Teve que corrigir alguma coisa?" Sim/Não,
     observação SEMPRE obrigatória; anexo opcional quando FLOW_CONFIG.comAnexo.
   ============================================================ */

/* ---- Tarefa atual ---- */
function _roboTask() {
  return (typeof getTaskById === 'function' && getTaskById(state.currentTaskId)) || state.active || (state.queue && state.queue[0]);
}

/* O link "Abrir página do cliente" no header da tarefa agora é fonte ÚNICA no
   cockpit-core.js (montarLinkCliente + renderTask), pra valer em toda tarefa
   (Hub e Autopilot). As telas do Autopilot que chamam montarLinkCliente() seguem
   funcionando — a função vive no core. */

/* ============================================================
   Linha do tempo de atuação (robô → operador → robô …)
   items: [{ ator:'robo'|'operador', nome?, texto, obs?, status?:'ok'|'trava' }]
   Ações consecutivas do mesmo ator ficam agrupadas sob um cabeçalho.
   ============================================================ */
function renderTimelineAtuacao(items, titulo) {
  if (!items || !items.length) return '';
  var grupos = [];
  items.forEach(function (it) {
    var ult = grupos[grupos.length - 1];
    if (ult && ult.ator === it.ator) { ult.acoes.push(it); }
    else { grupos.push({ ator: it.ator, nome: it.nome, acoes: [it] }); }
  });
  var atorIcon = { robo: 'bot', operador: 'user-round' };
  var linhas = grupos.map(function (g) {
    var nome = g.ator === 'robo' ? 'Autopilot' : (g.nome || 'Operador');
    var acoes = g.acoes.map(function (a) {
      var st = a.status === 'trava' ? 'trava' : (g.ator === 'operador' ? 'op' : 'ok');
      var ic = a.status === 'trava' ? 'circle-x' : (g.ator === 'operador' ? 'message-square-text' : 'circle-check');
      // Para o operador, replicamos a resposta do formulário (pergunta + Sim/Não),
      // em vez de criar texto novo. A observação é o que ele escreveu no campo.
      var texto = a.texto;
      if (g.ator === 'operador' && a.resposta) {
        var resp = a.resposta === 'sim' ? 'Sim' : 'Não, estava tudo certo';
        texto = 'Teve que corrigir alguma coisa? <strong>' + resp + '</strong>';
      }
      var obs = a.obs ? '<div class="ta-obs">“' + a.obs + '”</div>' : '';
      // Arquivos que o operador anexou ao responder (notas, extratos) — chips iguais aos Materiais
      var anexos = (a.anexos && a.anexos.length)
        ? '<div class="ta-anexos">' + a.anexos.map(function (x) { return materialChip(x); }).join('') + '</div>'
        : '';
      return '<div class="ta-acao ta-' + st + '"><i data-lucide="' + ic + '"></i>'
        + '<div class="ta-acao-body"><div class="ta-text">' + texto + '</div>' + obs + anexos + '</div></div>';
    }).join('');
    return '<div class="ta-group ta-' + g.ator + '">'
      + '<div class="ta-head"><div class="ta-dot"><i data-lucide="' + (atorIcon[g.ator] || 'dot') + '"></i></div>'
      + '<div class="ta-actor">' + nome + '</div></div>'
      + '<div class="ta-acoes">' + acoes + '</div></div>';
  }).join('');
  var head = titulo ? '<div class="ta-title">' + titulo + '</div>' : '';
  return '<div class="timeline-atuacao">' + head + linhas + '</div>';
}

/* ============================================================
   Blocos do miolo (FONTE ÚNICA) — o que já rodou / de onde parou /
   o que precisa ser feito. Usados na tela da tarefa (renderFormTab)
   E no preview (taskSummaryModal, no core). Mexeu aqui, muda nos dois.
   src = objeto com { timeline, problem:{head,text,detailHTML?,errorChips?}, need }.
   ============================================================ */
function apDoneBlock(timeline) {
  if (!timeline || !timeline.length) return '';
  return '<div class="done-block">'
    + '<div class="done-title">O que já foi feito</div>'
    + renderTimelineAtuacao(timeline)
    + '</div>';
}

function apStoppedBlock(problem) {
  if (!problem) return '';
  var detail = problem.detailHTML || '';
  var chips = (problem.errorChips && problem.errorChips.length)
    ? '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:' + (detail ? '12px' : '14px') + ';">'
      + problem.errorChips.map(function (a) { return materialChip(a); }).join('')
      + '</div>'
    : '';
  return '<div class="stopped-card">'
    + '<div class="problem-head"><i data-lucide="circle-x"></i>' + problem.head + '</div>'
    + '<div class="problem-text">' + problem.text + '</div>'
    + detail + chips
    + '</div>';
}

function apNeedBlock(need) {
  if (!need) return '';
  return '<div class="need-box">'
    + '<i data-lucide="hand-helping"></i>'
    + '<div><div class="need-label">O que precisa ser feito</div>'
    + '<div class="need-text">' + need + '</div></div>'
    + '</div>';
}

/* Materiais — só na tela da tarefa (fica fora do preview). */
function apMateriaisAccordion(anexos) {
  anexos = anexos || [];
  var items = anexos.map(function (a) { return materialChip(a); }).join('');
  return '<div class="materiais-accordion" id="materiais-accordion">'
    + '<div class="materiais-head" onclick="toggleMateriais()">'
    + '<i data-lucide="paperclip"></i>'
    + '<span class="materiais-title">Materiais · no GDocs</span>'
    + '<span class="materiais-count">' + anexos.length + '</span>'
    + '<i data-lucide="chevron-down" class="materiais-chevron"></i>'
    + '</div>'
    + '<div class="materiais-body" id="materiais-body">' + items + '</div>'
    + '</div>';
}

/* ============================================================
   Miolo AGRUPADO por macroetapa (FONTE ÚNICA — telas de tarefa E espiada)
   A "receita" do que o robô faz por processo vive em AP_FLUXOS. Cada tarefa
   declara apFluxo + apDone (onde travou) + a etapa atual (apHitl) + as atuações
   de operador (apAtuacoes). apBuildMiolo(t) monta {grupos, problem, need, futuras}
   e apMiolo() renderiza — robô e operador se intercalam DENTRO de cada macroetapa.
   Mexeu numa etapa em AP_FLUXOS, muda em todas as tarefas daquele processo.
   ============================================================ */
/* Conteúdo das etapas do robô, por processo. Cada linha: [macroetapa, nome, mensagem de sucesso].
   Mensagem '—' = etapa sem detalhe de sucesso. */
const AP_FLUXOS = {
  /* FOLHA — alinhada ao doc de engenharia "Steps do Cockpit · Detalhamento para Engenharia",
     workflow "Fechamento Folha Mensal · DP". Títulos e descrições são os PADRONIZADOS de lá,
     sem valor variável: nada de nº de recibo, % ou ID, que entram em runtime — valor concreto
     ("47 colaboradores · líquido R$ 48.320,00") é registro do passo, não título.

     A lista tem exatamente 7 passos porque só os componentes marcados com * no diagrama de
     sequência atualizam a tarefa RUN — e é essa atualização que o Cockpit mostra. O que o
     motor faz e não reporta não é passo. Foram embora, por não estarem no doc:
       · "Verificar elegibilidade e dados do cliente"
       · "Conferir quantidade de colaboradores ativos" → absorvido pelo passo 1, que é o
         anomaly-detector e cobre completude E divergências (é dele que nasce a HITL de
         divergência de quadro)
       · "Receber retorno e protocolo eSocial" → o passo 4 do doc já é envio + transmissão
       · "Gerar Guia de FGTS" → não aparece no doc; pergunta pendente pra engenharia
     E o GDocs deixou de dividir passo com o GPC: no doc de folha só existe o GDocs.
     Os agrupamentos (macroetapas) são nossos — o doc é lista corrida. */
  folha: [
    ['Verificação Inicial','Verificar completude de insumos e divergências','Insumos localizados — cadastros, rubricas e salários necessários à apuração foram encontrados'],
    ['Processamento e Cálculo','Processar cálculo da folha','Cálculo da folha processado'],
    ['Processamento e Cálculo','Verificar resultado com histórico do cliente','Cálculo dentro da faixa histórica do cliente'],
    ['Transmissão Obrigações','Enviar folha para o eSocial','Envio de eventos e transmissão para o eSocial realizada'],
    ['Entrega ao Cliente','Gerar relatórios de folha e holerites via motor','Relatórios de folha e holerites gerados via Motor'],
    ['Entrega ao Cliente','Salvar documentos no GDocs','Relatórios disponibilizados no Hub do Empreendedor'],
    ['Entrega ao Cliente','Notificar disponibilização de documentos ao cliente','Cliente notificado via email'],
  ],
  das: [
    ['Verificação Inicial','Verificar elegibilidade e dados do cliente','Dados confirmados — Apuração DAS iniciada'],
    ['Verificação Inicial','Importar notas fiscais da competência','Notas fiscais localizadas — 128 notas, R$ 214.500,00'],
    ['Processamento e Cálculo','Apurar a receita bruta','Receita bruta apurada (faturamento − devoluções)'],
    ['Processamento e Cálculo','Calcular DAS','Base e alíquota efetiva apuradas (PGDAS-D)'],
    ['Processamento e Cálculo','Verificar resultado com histórico do cliente','Receita dentro da faixa histórica'],
    ['Transmissão Obrigações','Enviar declaração PGDAS via Serpro','Declaração transmitida — recibo retornado'],
    ['Transmissão Obrigações','Gerar guia DAS via Serpro','Guia DAS gerada'],
    ['Transmissão Obrigações','Gerar relatório de faturamento','Relatório de faturamento gerado'],
    ['Entrega ao Cliente','Salvar documentos no GDocs e criar tarefa no GPC','DAS disponibilizado no Hub'],
    ['Entrega ao Cliente','Notificar disponibilização ao cliente','Cliente notificado via Hub'],
  ],
  conciliacao: [
    ['Importação','Importar extratos bancários do cliente','Extratos importados — 68 lançamentos de 2 contas'],
    ['Importação','Identificar informações-chave de cada lançamento','60 lançamentos identificados por Pix/boleto/DAS'],
    ['Matching Automático','Associar lançamentos com identificação exata (≥ 0,90)','32 lançamentos associados automaticamente'],
    ['Matching Automático','Associar por valor, data e contraparte (0,70–0,90)','16 lançamentos associados por regra'],
    ['Matching Automático','Associar usando o histórico do cliente (0,70–0,90)','8 lançamentos associados por histórico'],
    ['Matching Automático','Sugerir explicação para lançamentos sem match óbvio','IA sugeriu explicação para 4 lançamentos'],
    ['Verificação','Aprovar em lote lançamentos de alta confiança (≥ 0,90)','—'],
    ['Verificação','Revisar lançamentos de média confiança (0,70–0,90)','—'],
    ['Verificação','Resolver lançamentos sem correspondência (< 0,70)','—'],
    ['Lançamento','Registrar todos os lançamentos no razão contábil','—'],
  ],
  reinf: [
    ['Verificação Inicial','Verificar dados para apuração REINF','Consolidação de serviços tomados e prestados'],
    ['Processamento e Cálculo','Calcular e gerar eventos REINF','R-2010 e R-2020 conforme aplicável'],
    ['Processamento e Cálculo','Verificar consistência dos eventos','Retenções, valores e notas fiscais'],
    ['Transmissão Obrigações','Transmitir REINF ao eSocial','Eventos R-2010/R-2020 transmitidos'],
    ['Transmissão Obrigações','Receber protocolo de aceite','Protocolo aceito pelo eSocial'],
    ['Entrega ao Cliente','Disponibilizar comprovante ao cliente','Comprovante disponibilizado via Hub'],
  ],
  balancete: [
    ['Importação','Consolidar os lançamentos do mês','Lançamentos consolidados'],
    ['Processamento e Cálculo','Conferir contas e saldos','Contas conferidas'],
    ['Processamento e Cálculo','Fechar as contas de resultado','Contas de resultado encerradas'],
    ['Verificação','Validar saldos das contas transitórias','—'],
    ['Entrega ao Cliente','Gerar o balancete da competência','—'],
    ['Entrega ao Cliente','Disponibilizar ao cliente','—'],
  ],
};
const AP_ATOR_ICON = { robo: 'bot', operador: 'user-round' };
/* Relógio sintético dos passos do robô: 09:00 + 6min por passo, no DIA DE HOJE do protótipo.
   A data SEGUE o MOCK_TODAY, que é o mesmo que o cabeçalho da tarefa usa — fixá-la aqui faz os
   passos aparecerem em dia diferente do da abertura da tarefa. */
function _apTime(i) {
  var m = 540 + i * 6;
  var d = (typeof MOCK_TODAY !== 'undefined') ? MOCK_TODAY : { dia: 14, mes: 5 };
  return String(d.dia).padStart(2, '0') + '/' + String(d.mes).padStart(2, '0') + ' · '
    + String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}

/* Monta o miolo a partir de AP_FLUXOS: verde = etapas concluídas AGRUPADAS por macroetapa
   (título) + linha fina (detalhe) + hora; anomalia = etapa atual (apHitl); need = o que precisa.
   Nas tarefas HITL (não é o robô 'ap'), corta o histórico na atuação do operador e não lista
   futuras — só a jornada do robô (operatorId 'ap') mostra o que ainda falta. */
function apBuildMiolo(t) {
  var etapas = AP_FLUXOS[t.apFluxo]; if (!etapas) return null;
  var total = etapas.length, done = Math.min(t.apDone || 0, total);
  // Atuações de operador no meio da execução: apAtuacoes:[{naEtapa,divergencia,comparativo?,link?,nome,resposta,obs,anexos?}].
  // `naEtapa` = etapa em que o robô travou; `divergencia` = vira a linha de anomalia. Compat:
  // apOperador (objeto único, sem divergência) = uma atuação ancorada na última etapa concluída.
  var atuacoes = t.apAtuacoes ? t.apAtuacoes.slice() : [];
  if (!atuacoes.length && t.apOperador) atuacoes = [Object.assign({ naEtapa: done - 1 }, t.apOperador)];
  // Truncagem do histórico:
  // - HITL CONCLUÍDA (sem anomalia ativa): corta logo após a atuação — o que o robô rodou depois
  //   vive na tarefa DO robô, não aqui.
  // - HITL EM ABERTO (apHitl): mostra tudo até onde travou, com as atuações no meio (o histórico
  //   real da pendência que o operador vai resolver agora).
  // - Tarefa DO robô (ap): histórico completo.
  var doneMontagem = done;
  if (t.operatorId !== 'ap' && !t.apHitl && atuacoes.length) doneMontagem = Math.min(done, Math.max.apply(null, atuacoes.map(function (a) { return a.naEtapa; })) + 1);
  var ehRobo = t.operatorId === 'ap';
  // Cross-link SEMPRE conectado à anomalia (nunca solto). Robô → tarefa gerada (apPendencia),
  // só quando aguardando operador; HITL → processo que gerou (apExecucao), em qualquer status.
  var crosslink = (ehRobo ? t.apPendencia : t.apExecucao) || null;
  var crossBtn = crosslink ? '<button class="ap-crosslink" onclick="acNavModal(\'' + crosslink.to + '\')"><i data-lucide="external-link" style="width:15px;height:15px;"></i>' + esc(crosslink.label) + '</button>' : '';
  // Cada macroetapa vira um grupo com SEGMENTOS por ator — permite robô e operador se intercalarem
  // na mesma macroetapa. A etapa que gerou divergência é marcada como anomalia; o log do operador
  // que resolveu vem logo depois.
  var grupos = []; var curMacro = null, curSeg = null;
  var abreMacro = function (titulo) { if (!curMacro || curMacro.titulo !== titulo) { curMacro = { titulo: titulo, segmentos: [] }; grupos.push(curMacro); curSeg = null; } };
  etapas.slice(0, doneMontagem).forEach(function (e, i) {
    abreMacro(e[0]);
    var atu = atuacoes.find(function (a) { return a.naEtapa === i; });
    var ehAnomalia = !!(atu && atu.divergencia);
    if (!curSeg || curSeg.ator !== 'robo') { curSeg = { ator: 'robo', etapas: [] }; curMacro.segmentos.push(curSeg); }
    curSeg.etapas.push({
      nome: e[1],
      det: (atu && atu.divergencia) ? atu.divergencia : ((e[2] && e[2] !== '—') ? e[2] : ''),
      time: _apTime(i),
      anomalia: ehAnomalia,
      comparativo: (atu && atu.comparativo) || null,
      link: (ehAnomalia && !ehRobo) ? crosslink : null,
    });
    if (atu) {
      curMacro.segmentos.push({ ator: 'operador', nome: atu.nome, resposta: atu.resposta, obs: atu.obs, anexos: atu.anexos || [] });
      curSeg = null;
    }
  });
  var problem = null, need = '';
  if (t.apHitl) {
    var cur = etapas[done], h = t.apHitl;
    // Detalhe da anomalia: comparativo (valor × referência) OU lista de 1 coluna (h.detail,
    // HTML cru — dado em branco, sequência de notas, erro de órgão estruturado).
    var detalhe = apCmpHTML(h.comparativo) || h.detail || '';
    problem = { head: cur ? cur[1] : 'Anomalia identificada', text: h.det || '', detailHTML: detalhe + crossBtn, errorChips: h.errorChips || null };
    need = h.need || '';
  }
  // Próximas etapas (cinza): só na jornada do robô (operatorId 'ap'); nunca na pendência HITL.
  var iniFut = t.apHitl ? done + 1 : done;
  var futuras = ehRobo
    ? etapas.slice(iniFut).map(function (e, k) { return { grupo: e[0], nome: e[1], andamento: !!(t.apRun && k === 0) }; })
    : [];
  return { grupos: grupos, problem: problem, need: need, futuras: futuras };
}
/* Comparativo (valor × referência) — reusado no card de divergência da timeline E no card vermelho. */
function apCmpHTML(c) {
  if (!c) return '';
  return '<div class="div-row ta-cmp"><div class="div-cell"><div class="div-cell-label">' + esc(c.aLabel) + '</div><div class="div-cell-value">' + esc(c.aVal) + '</div></div><div class="div-sep">≠</div><div class="div-cell"><div class="div-cell-label">' + esc(c.bLabel) + '</div><div class="div-cell-value">' + esc(c.bVal) + '</div></div></div>';
}
/* Um segmento (robô ou operador) da timeline agrupada. Robô = check por etapa (ou card vermelho
   se anomalia); operador = pergunta/resposta + observação + anexos. */
function apSegmento(seg) {
  var nome = seg.ator === 'robo' ? 'Autopilot' : (seg.nome || 'Operador');
  var acoes;
  if (seg.ator === 'robo') {
    acoes = seg.etapas.map(function (e) {
      if (e.anomalia) {
        var cmp = apCmpHTML(e.comparativo);
        var crosslink = e.link ? '<button class="ap-crosslink" onclick="acNavModal(\'' + e.link.to + '\')"><i data-lucide="external-link" style="width:15px;height:15px;"></i>' + esc(e.link.label) + '</button>' : '';
        return '<div class="stopped-card ta-stopped"><div class="problem-head"><i data-lucide="circle-x"></i>' + esc(e.nome) + '</div><div class="problem-text">' + esc(e.det) + '</div>' + cmp + crosslink + '</div>';
      }
      return '<div class="ta-acao ta-ok"><i data-lucide="circle-check"></i><div class="ta-acao-body"><div class="ta-text">' + esc(e.nome) + '</div>' + (e.det ? '<div class="ta-det">' + esc(e.det) + '</div>' : '') + '</div>' + (e.time ? '<div class="ta-time">' + esc(e.time) + '</div>' : '') + '</div>';
    }).join('');
  } else {
    var resp = seg.resposta === 'sim' ? 'Sim' : 'Não, estava tudo certo';
    var obs = seg.obs ? '<div class="ta-obs">“' + esc(seg.obs) + '”</div>' : '';
    var anexos = (seg.anexos && seg.anexos.length) ? '<div class="ta-anexos">' + seg.anexos.map(function (x) { return materialChip(x); }).join('') + '</div>' : '';
    acoes = '<div class="ta-acao ta-op"><i data-lucide="message-square-text"></i><div class="ta-acao-body"><div class="ta-text">Teve que corrigir alguma coisa? <strong>' + resp + '</strong></div>' + obs + anexos + '</div></div>';
  }
  return '<div class="ta-group ta-' + seg.ator + '"><div class="ta-head"><div class="ta-dot"><i data-lucide="' + AP_ATOR_ICON[seg.ator] + '"></i></div><div class="ta-actor">' + esc(nome) + '</div></div><div class="ta-acoes">' + acoes + '</div></div>';
}
/* Bloco verde "O que já foi feito": título de macroetapa + timeline por ator dentro dela. */
function apDoneBlockGrouped(grupos) {
  if (!grupos || !grupos.length) return '';
  var body = grupos.map(function (g) {
    return '<div class="apg-macro"><div class="apg-group">' + esc(g.titulo) + '</div>' + g.segmentos.map(apSegmento).join('') + '</div>';
  }).join('');
  return '<div class="done-block"><div class="done-title">O que já foi feito</div><div class="timeline-atuacao">' + body + '</div></div>';
}
/* "Próximas etapas" (cinza) — o caminho que falta o robô percorrer (só na jornada do robô). */
function apFuturasBlock(futuras) {
  if (!futuras || !futuras.length) return '';
  var body = '', lastG = null;
  futuras.forEach(function (f) {
    if (f.grupo !== lastG) { body += '<div class="apf-group">' + esc(f.grupo) + '</div>'; lastG = f.grupo; }
    body += '<div class="apf-row"><div class="apf-check"></div><div class="apf-name">' + esc(f.nome) + (f.andamento ? '<span class="apf-andamento">em andamento</span>' : '') + '</div></div>';
  });
  return '<div class="apf-block"><div class="apf-title">Próximas etapas</div>' + body + '</div>';
}

/* Miolo completo: done agrupado + [stopped + (materiais) + need] + próximas etapas.
   opts.materiais:true inclui o accordion de Materiais (tela da tarefa; fora do preview do modal).
   src = { grupos, problem, need, futuras } (de apBuildMiolo). Nas tarefas HITL futuras vem vazio. */
function apMiolo(src, opts) {
  if (!src) return '';
  opts = opts || {};
  var materiais = opts.materiais ? apMateriaisAccordion(opts.anexos || []) : '';
  return apDoneBlockGrouped(src.grupos)
    + '<div class="problem-block">'
    + apStoppedBlock(src.problem)
    + materiais
    + apNeedBlock(src.need)
    + '</div>'
    + apFuturasBlock(src.futuras);
}

/* ============================================================
   Wizard de resposta
   ============================================================ */
var _correcao = null; // 'sim' | 'nao'

function _fcfg() { return (typeof window.FLOW_CONFIG !== 'undefined') ? window.FLOW_CONFIG : {}; }

function resolucaoHTML() {
  var cfg = _fcfg();
  var anexoBlock = cfg.comAnexo ? `
    <div id="wizard-anexo" style="display:none;margin-top:14px;">
      <input type="file" id="resolucao-file-input" style="display:none;" multiple onchange="anexarResolucao(event)" />
      <button class="btn-attach" onclick="document.getElementById('resolucao-file-input').click()"><i data-lucide="paperclip" style="width:14px;height:14px;"></i>${cfg.anexoLabel || 'Anexar documento'}</button>
      <span style="font-size:12px;color:var(--text-tertiary);margin-left:10px;">${cfg.anexoHint || ''}</span>
      <div id="resolucao-anexos" class="uploaded-files-list" style="margin-top:10px;"></div>
    </div>` : '';
  return `
    <div class="section-title"><i data-lucide="square-pen"></i>Resolução</div>
    <div class="resolucao-intro">Confira o que o Autopilot fez acima. Quando resolver, responda abaixo.</div>
    <div class="choice-q">Teve que corrigir alguma coisa?</div>
    <div class="choice-row">
      <button class="choice-btn" id="choice-sim" onclick="escolherCorrecao('sim')"><i data-lucide="pencil"></i>Sim</button>
      <button class="choice-btn" id="choice-nao" onclick="escolherCorrecao('nao')"><i data-lucide="check"></i>Não, estava tudo certo</button>
    </div>
    <div id="wizard-explica" style="display:none;margin-top:18px;">
      <div class="answer-label" id="wizard-label">Explique o que você fez</div>
      <div class="answer-hint" id="wizard-hint">Conte, com suas palavras, o que você ajustou. Fica registrado para auditoria e para a próxima vez.</div>
      <textarea class="answer-textarea" id="wizard-descricao" oninput="atualizarBotaoWizard()" placeholder="Ex.: descreva o que estava errado e o que você corrigiu."></textarea>
    </div>${anexoBlock}
    <div id="wizard-actions" style="display:none;justify-content:flex-end;margin-top:20px;">
      <button class="btn btn-primary btn-lg" id="btn-reprocessar" disabled onclick="enviarAoRobo()"><i data-lucide="send" class="w-4 h-4"></i>Confirmar e seguir</button>
    </div>
  `;
}

function escolherCorrecao(val) {
  _correcao = val;
  var cfg = _fcfg();
  var sim = qs('#choice-sim'), nao = qs('#choice-nao');
  if (sim) sim.classList.toggle('selected', val === 'sim');
  if (nao) nao.classList.toggle('selected', val === 'nao');

  // O campo de observação aparece nos DOIS caminhos (registro/histórico/auditoria);
  // o anexo (quando o fluxo tem) aparece só no caminho "Sim".
  var explica = qs('#wizard-explica');
  if (explica) explica.style.display = 'block';
  var anexo = qs('#wizard-anexo');
  if (anexo) anexo.style.display = (val === 'sim') ? 'block' : 'none';

  var label = qs('#wizard-label'), hint = qs('#wizard-hint'), txt = qs('#wizard-descricao');
  if (val === 'sim') {
    if (label) label.textContent = 'Explique o que você fez';
    if (hint) hint.textContent = cfg.comAnexo
      ? 'Conte o que você corrigiu e, se for o caso, anexe abaixo o que estava faltando. Fica registrado para auditoria.'
      : 'Conte, com suas palavras, o que você ajustou. Fica registrado para auditoria e para a próxima vez.';
    if (txt) txt.placeholder = 'Ex.: descreva o que estava errado e o que você corrigiu.';
  } else {
    if (label) label.textContent = 'Registre uma observação';
    if (hint) hint.textContent = 'Conte o que você conferiu para concluir que estava tudo certo. Fica no histórico para auditoria.';
    if (txt) txt.placeholder = 'Ex.: conferi tudo contra os documentos; estava correto, sem ajustes a fazer.';
  }

  var actions = qs('#wizard-actions');
  if (actions) actions.style.display = 'flex';
  var btn = qs('#btn-reprocessar');
  if (btn) {
    btn.innerHTML = (val === 'sim')
      ? '<i data-lucide="send" class="w-4 h-4"></i>Enviar e reprocessar'
      : '<i data-lucide="send" class="w-4 h-4"></i>' + (cfg.reproLabel || 'Confirmar e seguir');
  }
  atualizarBotaoWizard(); // observação é sempre obrigatória — botão só ativa com texto
  refreshIcons();
}

/* O botão de envio/reprocesso só ativa com a observação preenchida (obrigatória nos dois caminhos) */
function atualizarBotaoWizard() {
  var btn = qs('#btn-reprocessar');
  if (!btn) return;
  var txt = qs('#wizard-descricao');
  var temTexto = !!(txt && txt.value.trim());
  btn.disabled = !temTexto;
  btn.style.opacity = temTexto ? '' : '0.5';
  btn.style.cursor = temTexto ? '' : 'not-allowed';
}

/* ---- Anexo da resolução (upload de notas/extratos) — só nos fluxos com FLOW_CONFIG.comAnexo ---- */
window._resolucaoFiles = [];
function anexarResolucao(e) {
  var files = Array.prototype.slice.call(e.target.files || []);
  files.forEach(function (f) {
    var kb = Math.round(f.size / 1024);
    window._resolucaoFiles.push({ name: f.name, size: kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB' });
  });
  e.target.value = '';
  renderAnexosResolucao();
}
function renderAnexosResolucao() {
  var box = qs('#resolucao-anexos');
  if (!box) return;
  box.innerHTML = window._resolucaoFiles.map(function (f, i) {
    return renderFileItem(f, { removable: true, removeFn: 'removerAnexoResolucao(' + i + ')' });
  }).join('');
  refreshIcons();
}
function removerAnexoResolucao(i) {
  var arq = window._resolucaoFiles[i];
  if (!arq) return;
  confirmRemoveAttachment(arq.name, function () {
    window._resolucaoFiles.splice(i, 1);
    renderAnexosResolucao();
  });
}

/* ---- Bloco Resolução: separado de "Dados da solicitação", injetado logo abaixo (core fica intacto) ---- */
function montarResolucaoSeparada() {
  var form = qs('#form-content');
  if (!form) return;
  var dadosCard = form.closest('.section-card');
  if (!dadosCard) return;
  if (qs('#resolucao-card')) { refreshIcons(); return; }
  _correcao = null;
  window._resolucaoFiles = [];
  var card = document.createElement('div');
  card.className = 'section-card';
  card.id = 'resolucao-card';
  card.innerHTML = resolucaoHTML();
  dadosCard.parentNode.insertBefore(card, dadosCard.nextSibling);
  refreshIcons();
}

/* ---- Envio: devolve ao Autopilot e confirma "tarefa finalizada" (mesma tela genérica) ---- */
var _envioTimers = [];
function enviarAoRobo() {
  var task = _roboTask();
  if (task) {
    var a = qs('#exec-type-label'); if (a) a.textContent = task.type;
    var b = qs('#exec-client-label'); if (b) b.textContent = task.clientName;
    var c = qs('#exec-client-cnpj'); if (c) c.textContent = task.cnpj;
    var d = qs('#exec-solicitante'); if (d) d.textContent = (task.senderName || 'Autopilot');
    var dl = qs('#exec-solicitante-label'); if (dl) dl.textContent = 'Iniciado pelo';
  }
  renderTimelineHorizontal(qs('#exec-timeline'), 2, task);

  var stepsCard = qs('#exec-steps') && qs('#exec-steps').closest('.section-card');
  if (stepsCard) {
    Array.prototype.forEach.call(stepsCard.children, function (ch) { if (ch.id !== 'exec-steps') ch.style.display = 'none'; });
    var nota = stepsCard.nextElementSibling;
    if (nota && nota.classList && nota.classList.contains('section-card')) nota.style.display = 'none';
  }

  qs('#exec-steps').innerHTML =
    '<div class="proc-confirm">'
    + '<div class="proc-icon" id="proc-icon"><i data-lucide="loader-circle" class="spin"></i></div>'
    + '<div class="proc-headline" id="proc-headline">Reprocessando…</div>'
    + '<div class="proc-sub" id="proc-sub">Devolvendo a tarefa ao Autopilot…</div>'
    + '<button class="btn btn-primary btn-lg" id="proc-btn" disabled onclick="voltarParaTarefas()"><i data-lucide="arrow-left" class="w-4 h-4"></i>Voltar para minhas tarefas</button>'
    + '</div>';
  showScreen('execution');
  refreshIcons();

  _envioTimers.forEach(clearTimeout); _envioTimers = [];
  _envioTimers.push(setTimeout(concluirEnvio, 2100));
}
function concluirEnvio() {
  var task = _roboTask();
  var icon = qs('#proc-icon'); if (icon) { icon.classList.add('done'); icon.innerHTML = '<i data-lucide="circle-check"></i>'; }
  var h = qs('#proc-headline'); if (h) h.textContent = 'Tarefa finalizada';
  var sub = qs('#proc-sub'); if (sub) sub.textContent = 'Você fez sua parte.';
  var btn = qs('#proc-btn'); if (btn) btn.removeAttribute('disabled');
  renderTimelineHorizontal(qs('#exec-timeline'), 3, task);
  refreshIcons();
}
function voltarParaTarefas() {
  var id = state.currentTaskId;
  if (id && state.queue) {
    var i = state.queue.findIndex(function (t) { return t.id === id; });
    if (i > -1) { var done = state.queue.splice(i, 1)[0]; done.completedAt = 'agora mesmo'; state.completed.push(done); }
  }
  goHome();
}

/* ---- Sanfona dos Materiais ---- */
function toggleMateriais() {
  var acc = qs('#materiais-accordion');
  if (acc) acc.classList.toggle('open');
}
function materialChip(file) {
  var tag = file.tag || 'Documento';
  var tagCls = tag === 'Nota Fiscal' ? 'tag-nf'
    : (tag === 'Relatório' ? 'tag-rel'
    : (tag === 'Erro' ? 'tag-err' : 'tag-doc'));
  return `
    <div class="material-chip">
      <i data-lucide="file-text"></i>
      <span class="material-chip-name">${file.name}</span>
      <span class="material-chip-tag ${tagCls}">${tag}</span>
      <div class="material-chip-actions">
        <button class="material-chip-btn" title="Visualizar" onclick="event.stopPropagation();"><i data-lucide="eye"></i></button>
        <button class="material-chip-btn" title="Baixar" onclick="event.stopPropagation();"><i data-lucide="download"></i></button>
      </div>
    </div>
  `;
}
