/* ============================================================
   aluguel.js — o formulário da Despesa de aluguel
   ------------------------------------------------------------
   A pendência que o Motor Fiscal SN abre no passo 1 da Apuração de IRRF sobre Aluguel. No
   miolo dela, este formulário ocupa o lugar da resolução de anomalia; o resto da tela é o
   chassi da versão que carrega o arquivo.

   Os campos são os ef* do núcleo, os mesmos da Admissão em edição. O rascunho mora aqui e o
   núcleo escreve nele: a cada render, state._editDraft[id].aluguel aponta pro mesmo objeto.
   Não passa pelo modo de edição do núcleo, então não há "Ver alterações" nem barra de edição.

   A versão que carrega este arquivo fornece: _lab.t, labRender, labPosse, labPodeAgir,
   labVisitando e labDevolverAoMotor.
   ============================================================ */

const ALU_TAB = 'aluguel';
const ALU_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const _alu = { rascunho: {}, ui: {} };

function aluEhAluguel(t) { return !!t && t.typeCode === 'despesa_aluguel' && !!t.aluguel; }

function aluRascunho(t) {
  const r = _alu.rascunho[t.id] || (_alu.rascunho[t.id] = { locador: {}, pagamento: {}, deducoes: {} });
  if (!state._editDraft) state._editDraft = {};
  state._editDraft[t.id] = { [ALU_TAB]: r };
  return r;
}
function aluUi(t) {
  return _alu.ui[t.id] || (_alu.ui[t.id] = { tentou: false, deducoesAberto: false, anexos: {} });
}
function aluExcecao(r) { return r.locador.residente === 'Não'; }
function aluVazio(v) { return !String(v == null ? '' : v).trim(); }

function aluFaltando(r) {
  const falta = [];
  [['locador', 'residente'], ['locador', 'cpf'], ['locador', 'nome'], ['pagamento', 'data'], ['pagamento', 'valorBruto']]
    .forEach(([s, c]) => { if (aluVazio(r[s][c])) falta.push(`${s}.${c}`); });
  if (!aluExcecao(r)) {
    if (aluVazio(r.pagamento.viaIntermediario)) falta.push('pagamento.viaIntermediario');
    else if (r.pagamento.viaIntermediario === 'Sim' && aluVazio(r.pagamento.intermediario)) falta.push('pagamento.intermediario');
  }
  return falta;
}

/* ---------- campos ----------
   O campo obrigatório é o ef* do núcleo com o asterisco no rótulo e a mensagem de erro no fim do
   mesmo .ef-field — sem embrulho, porque o grid e o alinhamento do toggle miram o .ef-field. */
function aluRotulo(label, obrigatorio) {
  return obrigatorio ? `${esc(label)} <span style="color:var(--brand-pink);">*</span>` : esc(label);
}
function aluObrigatorio(html, chave, erro) {
  return html
    .replace('<div class="ef-field"', `<div class="ef-field alu-campo${erro ? ' alu-erro' : ''}" data-alu-campo="${chave}"`)
    .replace(/<\/div>\s*$/, '<div class="alu-erro-msg"><i data-lucide="alert-circle"></i>Campo obrigatório.</div></div>');
}
function aluCampo(ctx, tipo, label, secao, campo, opts) {
  const o = opts || {};
  const chave = `${secao}.${campo}`;
  const valor = ctx.r[secao][campo] || '';
  const rotulo = aluRotulo(label, o.obrigatorio);
  let html;
  if (tipo === 'toggle') html = efToggle(rotulo, valor, ALU_TAB, secao, campo, ['Sim', 'Não']);
  else if (tipo === 'data') html = efDate(rotulo, valor, ALU_TAB, secao, campo);
  else if (tipo === 'moeda') html = efCurrency(rotulo, valor, ALU_TAB, secao, campo);
  else html = efText(rotulo, valor, ALU_TAB, secao, campo);
  if (o.obrigatorio) html = aluObrigatorio(html, chave, ctx.erros.includes(chave));
  // A nota do campo mora dentro dele, embaixo do input — e do erro, quando há.
  if (o.nota) html = html.replace(/<\/div>\s*$/, `<p class="alu-nota" style="margin-top:2px;">${o.nota}</p></div>`);
  return html;
}

/* ---------- a faixa do alto ----------
   O que situa a tarefa no calendário fiscal. O caminho pro processo que gerou a pendência fica
   no Histórico, como em toda pendência do HITL. */
function aluFaixaHTML(t) {
  const a = t.aluguel || {};
  const item = (rotulo, valor) => `<div><div class="field-label">${rotulo}</div><div class="alu-faixa-v">${esc(valor || '—')}</div></div>`;
  return `<div class="alu-faixa">
    ${item('Competência', t.competencia)}
    ${item('Disparada em', a.disparadaEm)}
    ${item('Prazo interno de preenchimento', a.prazoInterno)}
  </div>`;
}

function aluAvisoExcecao() {
  return `<div class="alu-aviso">
    <i data-lucide="alert-triangle"></i>
    <div>
      <div style="font-weight:600;">Locador não residente no Brasil — o motor não retém.</div>
      <div style="margin-top:4px;">A retenção do IRRF é dever do procurador do locador no Brasil, mesmo quando o próprio cliente é o procurador. A despesa é registrada pelo valor integral, sem o evento R-4010, e o motor abre uma anomalia para tratativa.</div>
      <ul>
        <li>Retenção definitiva de 15% sobre o rendimento (25% se o país tiver tributação favorecida)</li>
        <li>Sem tabela progressiva, sem redutor e sem faixa de isenção</li>
        <li>Recolhimento no próprio dia do pagamento, em DARF 9478</li>
      </ul>
    </div>
  </div>`;
}

/* ---------- revelar ----------
   O que uma resposta abre ou fecha está sempre no formulário e desliza, como uma sanfona: quem
   responde vê o bloco nascer embaixo da pergunta em vez de a tela trocar de uma vez. Fechado, o
   bloco fica `inert` — não recebe foco nem clique. */
function aluVisivel(r) {
  const excecao = aluExcecao(r);
  return { excecao, residente: !excecao, intermediario: !excecao && r.pagamento.viaIntermediario === 'Sim' };
}
function aluRevela(aberto, html, quando) {
  const dado = quando ? ` data-alu-quando="${quando}"` : '';
  return `<div class="alu-revela${aberto ? ' aberto assentado' : ''}"${dado}${aberto ? '' : ' inert'}><div class="alu-revela-in">${html}</div></div>`;
}
// Célula de grid não desliza: some e aparece no lugar, sem mexer na linha.
function aluCelula(aberto, html, quando) {
  return `<div class="alu-cel${aberto ? '' : ' fechado'}" data-alu-quando="${quando}"${aberto ? '' : ' inert'}>${html}</div>`;
}
function aluAbrir(el, aberto) {
  el.inert = !aberto;
  if (el.classList.contains('alu-cel')) { el.classList.toggle('fechado', !aberto); return; }
  el.classList.toggle('aberto', aberto);
  el.classList.remove('assentado');
  if (aberto && ALU_SEM_MOVIMENTO) el.classList.add('assentado');
}
function aluAplicarLayout(t) {
  const vis = aluVisivel(aluRascunho(t));
  document.querySelectorAll('[data-alu-quando]').forEach((el) => aluAbrir(el, !!vis[el.dataset.aluQuando]));
  aluAtualizarErros(t);
}
const ALU_SEM_MOVIMENTO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Aberto e parado, o bloco para de cortar o que passa da borda (anel de foco, calendário).
document.addEventListener('transitionend', (e) => {
  const el = e.target;
  if (e.propertyName === 'grid-template-rows' && el.classList && el.classList.contains('alu-revela') && el.classList.contains('aberto')) el.classList.add('assentado');
});

function aluDeducoesHTML(ctx) {
  const aberto = aluUi(ctx.t).deducoesAberto;
  const corpo = `<div class="exec-ref-content">
      <div class="field-group">
        ${aluCampo(ctx, 'moeda', 'IPTU', 'deducoes', 'iptu')}
        ${aluCampo(ctx, 'moeda', 'Condomínio', 'deducoes', 'condominio')}
        ${aluCampo(ctx, 'moeda', 'Taxa de cobrança/administração', 'deducoes', 'taxa')}
        ${aluCampo(ctx, 'moeda', 'Sublocação', 'deducoes', 'sublocacao')}
      </div>
      <p class="alu-nota">Essas deduções só reduzem o valor tributável quando o custo foi pago pelo próprio locador.</p>
    </div>`;
  return `<div class="exec-ref-card" style="margin-top:24px;">
    <div class="exec-ref-item">
      <button type="button" class="exec-ref-trigger${aberto ? ' open' : ''}" onclick="aluDeducoes(this)">
        <span>Deduções<span class="exec-ref-badge">(opcional)</span></span>
        <i data-lucide="chevron-down" class="exec-ref-chevron" style="width:16px;height:16px;"></i>
      </button>
      ${aluRevela(aberto, corpo)}
    </div>
  </div>`;
}

const ALU_ANEXOS = [
  { slot: 'recibo', rotulo: 'Recibo de locação', arraste: 'Arraste o recibo aqui' },
  { slot: 'comprovante', rotulo: 'Comprovante de pagamento', arraste: 'Arraste o comprovante aqui' },
];

/* Cada anexo é uma área de soltar — a .upload-area do núcleo, a mesma do passo de envio ao
   GDocs. Um arquivo por área: anexado, a área vira o chip dele. */
function aluAnexosHTML(t) {
  const anexos = aluUi(t).anexos;
  const slots = ALU_ANEXOS.map((a) => {
    const f = anexos[a.slot];
    const corpo = f
      ? renderFileItem(f, { removable: true, removeFn: `aluAnexoRemover('${a.slot}')` })
      : `<div class="upload-area" style="margin-top:4px;" onclick="document.getElementById('alu-arq-${a.slot}').click()" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="aluSoltar('${a.slot}', event)">
          <div class="upload-area-icon"><i data-lucide="upload-cloud" style="width:20px;height:20px;"></i></div>
          <div class="upload-area-title">${a.arraste}</div>
          <div class="upload-area-hint">ou <strong>selecione do computador</strong></div>
        </div>`;
    return `<div class="ef-field"><div class="ef-label">${a.rotulo}</div>
      <input type="file" id="alu-arq-${a.slot}" style="display:none;" onchange="aluAnexar('${a.slot}', event)" />
      ${corpo}
    </div>`;
  }).join('');
  return `<div class="subsection-title">Anexos <span class="alu-sub-opc">(opcional)</span></div>
    <div class="field-group field-group-2">${slots}</div>
    <p class="alu-nota">Se não anexar o recibo ou o comprovante agora, o envio continua liberado — só fica um alerta registrado para revisão depois.</p>`;
}

/* ---------- o formulário ----------
   Antes de responder a residência vale o layout de residente, que é o caso comum: o formulário
   só muda quando a resposta é "Não". */
function aluFormHTML(t) {
  const r = aluRascunho(t);
  const ui = aluUi(t);
  const ctx = { t, r, erros: ui.tentou ? aluFaltando(r) : [] };
  const vis = aluVisivel(r);

  let corpo = `<div class="subsection-title">Locador</div>
    <div class="field-group field-group-3">
      ${aluCampo(ctx, 'toggle', 'Locador é residente no Brasil?', 'locador', 'residente', { obrigatorio: true })}
      ${aluCampo(ctx, 'texto', 'CPF do locador', 'locador', 'cpf', { obrigatorio: true })}
      ${aluCampo(ctx, 'texto', 'Nome do locador', 'locador', 'nome', { obrigatorio: true })}
    </div>`;

  corpo += aluRevela(vis.excecao, `<div style="padding-top:20px;">${aluAvisoExcecao()}</div>
      <div class="subsection-title">País e procurador <span class="alu-sub-opc">(quando conhecidos)</span></div>
      <div class="field-group field-group-2">
        ${aluCampo(ctx, 'texto', 'País de residência', 'locador', 'pais')}
        ${aluCampo(ctx, 'texto', 'Procurador designado no Brasil', 'locador', 'procurador')}
      </div>`, 'excecao');

  corpo += `<div class="subsection-title">Pagamento</div>
    <div class="field-group field-group-3">
      ${aluCampo(ctx, 'data', 'Data do pagamento', 'pagamento', 'data', { obrigatorio: true })}
      ${aluCampo(ctx, 'moeda', 'Valor bruto pago no mês', 'pagamento', 'valorBruto', { obrigatorio: true })}
      ${aluCelula(vis.residente, aluCampo(ctx, 'toggle', 'Pagamento via imobiliária/procurador?', 'pagamento', 'viaIntermediario', { obrigatorio: true }), 'residente')}
    </div>`;

  corpo += aluRevela(vis.intermediario, `<div class="field-group field-group-3" style="padding-top:20px;">
      ${aluCampo(ctx, 'texto', 'Nome da imobiliária/procurador', 'pagamento', 'intermediario', {
        obrigatorio: true,
        nota: 'Muda a data considerada como fato gerador quando o repasse é feito por intermediário (art. 31, §2º).',
      })}
    </div>`, 'intermediario');

  corpo += aluRevela(vis.residente, aluDeducoesHTML(ctx), 'residente');
  corpo += aluAnexosHTML(t);
  corpo += `<div class="alu-rodape">
    <span>Campos com <strong style="color:var(--brand-pink);">*</strong> são obrigatórios.</span>
    <button type="button" class="btn btn-primary btn-lg" onclick="aluEnviar()"><i data-lucide="send" class="w-4 h-4"></i>Confirmar e seguir</button>
  </div>`;

  if (!labPodeAgir(t)) {
    const motivo = labPosse(t) === 'ninguem'
      ? 'A tarefa não tem dono — atribua a você para preencher'
      : 'Só quem está com a tarefa preenche e devolve ao Motor Fiscal';
    corpo = `<div title="${motivo}" style="cursor:not-allowed;"><fieldset disabled style="border:none;margin:0;padding:0;opacity:0.5;">${corpo}</fieldset></div>`;
  }
  return aluFaixaHTML(t) + corpo;
}

/* ---------- o registro (leitura) ---------- */
function aluRegistroHTML(t) {
  const e = (t.aluguel && t.aluguel.enviado) || null;
  if (!e) return aluFaixaHTML(t) + '<div class="lab-vazio">Os dados ainda não foram enviados.</div>';
  const L = e.locador || {}, P = e.pagamento || {}, D = e.deducoes || {};
  const moeda = (v) => (aluVazio(v) ? '' : `R$ ${v}`);
  const campo = (rotulo, valor) => roField(esc(rotulo), esc(valor || '—'));
  const excecao = L.residente === 'Não';

  let html = `<div class="subsection-title">Locador</div>
    <div class="field-group field-group-3">
      ${campo('Locador é residente no Brasil?', L.residente)}${campo('CPF do locador', L.cpf)}${campo('Nome do locador', L.nome)}
    </div>`;
  if (excecao) {
    html += `<div style="margin-top:20px;">${aluAvisoExcecao()}</div>
      <div class="subsection-title">País e procurador</div>
      <div class="field-group field-group-2">${campo('País de residência', L.pais)}${campo('Procurador designado no Brasil', L.procurador)}</div>`;
  }
  html += `<div class="subsection-title">Pagamento</div>
    <div class="field-group field-group-3">
      ${campo('Data do pagamento', P.data)}${campo('Valor bruto pago no mês', moeda(P.valorBruto))}
      ${excecao ? '' : campo('Pagamento via imobiliária/procurador?', P.viaIntermediario)}
      ${!excecao && P.viaIntermediario === 'Sim' ? campo('Nome da imobiliária/procurador', P.intermediario) : ''}
    </div>`;
  if (!excecao && Object.values(D).some((v) => !aluVazio(v))) {
    html += `<div class="subsection-title">Deduções</div>
      <div class="field-group">
        ${campo('IPTU', moeda(D.iptu))}${campo('Condomínio', moeda(D.condominio))}${campo('Taxa de cobrança/administração', moeda(D.taxa))}${campo('Sublocação', moeda(D.sublocacao))}
      </div>`;
  }
  const anexos = e.anexos || {};
  const slots = ALU_ANEXOS.map((a) => `<div><div class="field-label">${a.rotulo}</div>${anexos[a.slot]
    ? renderFileItem(anexos[a.slot], { removable: false })
    : `<div class="lab-espera-aviso" style="margin-top:4px;"><i data-lucide="alert-triangle"></i>Não anexado — alerta registrado para revisão.</div>`}</div>`).join('');
  html += `<div class="subsection-title">Anexos</div><div class="field-group field-group-2">${slots}</div>`;
  return aluFaixaHTML(t) + injectCopyButtons(html);
}

/* ---------- reação aos campos ----------
   Nada redesenha a tela: quem digita não perde o foco, e o que os dois toggles abrem ou fecham
   desliza no lugar. Depois da primeira tentativa de envio, cada mudança acerta os erros. */
function aluAtualizarErros(t) {
  if (!aluUi(t).tentou) return;
  const falta = aluFaltando(aluRascunho(t));
  document.querySelectorAll('[data-alu-campo]').forEach((el) => el.classList.toggle('alu-erro', falta.includes(el.dataset.aluCampo)));
}
function aluCampoMudou(secao, campo) {
  const t = _lab.t;
  if (!aluEhAluguel(t)) return;
  if (campo === 'residente' || campo === 'viaIntermediario') aluAplicarLayout(t);
  else aluAtualizarErros(t);
}

const _aluCampoDepoisCore = window.onFieldEditAfter;
window.onFieldEditAfter = function (tab, secao, campo) {
  if (tab === ALU_TAB) return aluCampoMudou(secao, campo);
  if (typeof _aluCampoDepoisCore === 'function') return _aluCampoDepoisCore.apply(this, arguments);
};
const _aluToggleCore = window.onToggleEdit;
window.onToggleEdit = function (btn, tab, secao, campo) {
  _aluToggleCore.apply(this, arguments);
  if (tab === ALU_TAB) aluCampoMudou(secao, campo);
};
/* O calendário do núcleo abre no mês de hoje. A data do pagamento cai no mês da competência,
   então, com o campo vazio, ele abre lá. */
const _aluCalendarioCore = window.toggleDatePicker;
window.toggleDatePicker = function (id) {
  _aluCalendarioCore.apply(this, arguments);
  const t = _lab.t;
  if (String(id).indexOf(`dp-${ALU_TAB}-`) !== 0 || !aluEhAluguel(t)) return;
  const input = document.querySelector(`#${id} .ef-datepicker-input`);
  const popup = document.querySelector(`#${id} .ef-cal-popup`);
  const m = /^(\w{3})\/(\d{4})$/.exec(t.competencia || '');
  if (!input || input.value || !popup || !popup.classList.contains('open') || !m) return;
  popup.dataset.month = Math.max(0, ALU_MESES.indexOf(m[1]));
  popup.dataset.year = m[2];
  renderCalGrid(id);
};

function aluDeducoes(btn) {
  const ui = aluUi(_lab.t);
  ui.deducoesAberto = !ui.deducoesAberto;
  btn.classList.toggle('open', ui.deducoesAberto);
  aluAbrir(btn.nextElementSibling, ui.deducoesAberto);
}

/* ---------- anexos ---------- */
function aluArquivo(f) {
  const kb = f.size / 1024;
  return { name: f.name, size: kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(kb)) + ' KB' };
}
function aluGuardarAnexo(slot, f) {
  if (!f) return;
  aluUi(_lab.t).anexos[slot] = aluArquivo(f);
  labRender();
}
function aluAnexar(slot, e) {
  const f = e.target.files && e.target.files[0];
  e.target.value = '';
  aluGuardarAnexo(slot, f);
}
function aluSoltar(slot, e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  if (!labPodeAgir(_lab.t)) return;
  aluGuardarAnexo(slot, e.dataTransfer.files && e.dataTransfer.files[0]);
}
function aluAnexoRemover(slot) {
  const anexos = aluUi(_lab.t).anexos;
  const f = anexos[slot];
  if (!f) return;
  confirmRemoveAttachment(f.name, () => { delete anexos[slot]; labRender(); });
}

/* ---------- o envio ----------
   Vai só o que o layout respondido mostra: quem trocou de "Não" pra "Sim" no meio do caminho
   não manda país e procurador junto. */
function aluAgora() {
  const d = new Date();
  return `${_dmyFromDaysAgo(0).slice(0, 5)} · ${_pad2(d.getHours())}:${_pad2(d.getMinutes())}`;
}
function aluEnviar() {
  const t = _lab.t;
  if (!aluEhAluguel(t) || !labPodeAgir(t)) return;
  const r = aluRascunho(t);
  const ui = aluUi(t);
  ui.tentou = true;
  if (aluFaltando(r).length) {
    labRender();
    showAlertModal({ title: 'Campos obrigatórios pendentes', message: 'Ainda há campos obrigatórios para preencher antes de enviar.' });
    return;
  }
  const excecao = aluExcecao(r);
  const L = Object.assign({}, r.locador), P = Object.assign({}, r.pagamento);
  if (excecao) { delete P.viaIntermediario; delete P.intermediario; } else { delete L.pais; delete L.procurador; }
  if (P.viaIntermediario !== 'Sim') delete P.intermediario;
  t.aluguel.enviado = {
    locador: L, pagamento: P, deducoes: excecao ? {} : Object.assign({}, r.deducoes),
    anexos: Object.assign({}, ui.anexos), quando: aluAgora(),
  };
  t.apAtuacoes = (t.apAtuacoes || []).concat([{ naEtapa: t.apDone || 0, nome: OPERATOR_NAME + ' · operadora', aluguel: true }]);
  labDevolverAoMotor(t);
  if (excecao) flash('Despesa registrada pelo valor integral — o motor abre uma anomalia para tratativa.', 'warning');
  else flash('Dados enviados ao Motor Fiscal.', 'success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- estilo ---------- */
(function aluEstilo() {
  const css = `
    .alu-faixa { display:flex; align-items:center; gap:28px; flex-wrap:wrap; padding:12px 16px; background:var(--surface-subtle); border:1px solid var(--border); border-radius:10px; margin-bottom:24px; }
    .alu-faixa .field-label { margin-bottom:2px; }
    .alu-faixa-v { font-size:14px; font-weight:600; color:var(--text-primary); }
    .alu-sub-opc { text-transform:none; letter-spacing:0; font-weight:400; color:var(--text-secondary); }
    .alu-nota { font-size:12.5px; color:var(--text-secondary); line-height:1.5; margin:12px 0 0; }
    .alu-aviso { display:flex; gap:10px; align-items:flex-start; padding:12px 14px; background:var(--warning-soft); border:1px solid #f59e0b; border-radius:10px; font-size:13px; line-height:1.55; color:#92400e; }
    .alu-aviso > svg { width:16px; height:16px; flex-shrink:0; margin-top:2px; color:var(--warning); stroke:var(--warning); }
    .alu-aviso ul { list-style:disc; margin:8px 0 0; padding-left:18px; }
    .alu-aviso li { margin-bottom:2px; }
    .alu-campo:has(> .ef-toggle-group) { align-self:start; }
    .alu-revela { display:grid; grid-template-rows:0fr; opacity:0; transition:grid-template-rows .32s ease, opacity .26s ease; }
    .alu-revela.aberto { grid-template-rows:1fr; opacity:1; }
    .alu-revela-in { min-height:0; overflow:hidden; }
    .alu-revela.assentado > .alu-revela-in { overflow:visible; }
    .alu-cel { transition:opacity .26s ease, visibility .26s; }
    .alu-cel.fechado { opacity:0; visibility:hidden; }
    @media (prefers-reduced-motion: reduce) { .alu-revela, .alu-cel { transition:none; } }
    fieldset[disabled] .upload-area { pointer-events:none; }
    .alu-campo.alu-erro .ef-input, .alu-campo.alu-erro .ef-toggle-group { border-color:var(--danger); }
    .alu-erro-msg { display:none; align-items:center; gap:4px; font-size:11.5px; font-weight:500; color:var(--danger); }
    .alu-erro-msg svg { width:12px; height:12px; flex-shrink:0; }
    .alu-erro .alu-erro-msg { display:flex; }
    .alu-rodape { display:flex; flex-direction:column; align-items:flex-end; gap:10px; margin-top:28px; padding-top:20px; border-top:1px solid var(--border); font-size:12.5px; color:var(--text-secondary); }
  `;
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
})();
