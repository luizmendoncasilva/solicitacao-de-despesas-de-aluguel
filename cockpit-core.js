/* ============================================================
   cockpit-core.js — Shell compartilhado para todos os protótipos de fluxo DP
   Cada fluxo define window.FLOW_CONFIG antes de incluir este script.
   ============================================================ */

/* ---- CSS injection ---- */
(function () {
  const style = document.createElement('style');
  style.textContent = `
  :root {
    --brand-pink: #f25461;
    --brand-pink-hover: #e83d4d;
    --brand-pink-soft: #fde7ea;
    --brand-blue: #0171e4;
    --brand-blue-soft: rgba(1, 113, 228, 0.10);
    --surface: #ffffff;
    --surface-muted: #f7f7f8;
    --surface-subtle: #fafafa;
    --text-primary: #18181b;
    --text-secondary: #52525b;
    --text-tertiary: #a1a1aa;
    --border: #e4e4e7;
    --border-strong: #d4d4d8;
    --success: #16a34a;
    --success-soft: #dcfce7;
    --danger: #dc2626;
    --danger-soft: #fee2e2;
    --warning: #d97706;
    --warning-soft: #fef3c7;
    --info: #2563eb;
    --info-soft: #dbeafe;
  }
  html, body { font-family: 'Inter', system-ui, sans-serif; background: var(--surface-muted); color: var(--text-primary); font-size: 14px; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  .main { margin-left: var(--cockpit-sidebar-w, 236px); min-height: 100vh; display: flex; flex-direction: column; }
  .topbar { background: transparent; display: flex; align-items: center; height: 44px; padding-right: 18px; position: sticky; top: 0; z-index: 30; }
  .topbar .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 14px; }
  .notif-btn { position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 8px; }
  .notif-btn:hover { background: var(--surface-muted); }
  .notif-btn .dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--brand-pink); border: 2px solid #fff; }
  .section-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px 28px; margin-bottom: 16px; }
  .section-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--brand-pink); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .section-title i[data-lucide] { width: 16px; height: 16px; }
  .field-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-tertiary); margin-bottom: 4px; }
  .field-value { font-size: 14px; color: var(--text-primary); font-weight: 500; }
  .field-value.empty { color: var(--text-tertiary); font-weight: 400; }
  .field-group { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px 24px; }
  .field-group-2 { grid-template-columns: repeat(2, 1fr); }
  .field-group-3 { grid-template-columns: repeat(3, 1fr); }
  #task-summary-backdrop .field-group { grid-template-columns: repeat(2, 1fr); gap: 14px 20px; }
  /* Campos do acordeon no modal: fonte densa, consistente com o miolo do Autopilot. */
  #task-summary-backdrop .field-label { font-size: 10.5px; margin-bottom: 3px; }
  #task-summary-backdrop .field-value { font-size: 12.5px; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }
  .badge-success { background: var(--success-soft); color: var(--success); }
  .badge-danger { background: var(--danger-soft); color: var(--danger); }
  .badge-warning { background: var(--warning-soft); color: var(--warning); }
  .badge-info { background: var(--info-soft); color: var(--info); }
  .badge-pink { background: var(--brand-pink-soft); color: var(--brand-pink); }
  .badge-neutral { background: var(--surface-muted); color: var(--text-secondary); border: 1px solid var(--border); }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; border: 1px solid transparent; }
  .btn-primary { background: var(--brand-pink); color: #fff; }
  .btn-primary:hover { background: var(--brand-pink-hover); }
  .btn-secondary { background: #fff; color: var(--text-primary); border-color: var(--border-strong); }
  .btn-secondary:hover { background: var(--surface-muted); }
  .btn-ghost { background: transparent; color: var(--text-secondary); }
  .btn-ghost:hover { background: var(--surface-muted); color: var(--text-primary); }
  .btn-danger { background: #fff; color: var(--danger); border-color: #fecaca; }
  .btn-danger:hover { background: var(--danger-soft); }
  .btn-lg { padding: 14px 28px; font-size: 14px; }
  .form-tabs { display: inline-flex; gap: 2px; padding: 4px; background: var(--surface-muted); border-radius: 10px; flex-wrap: wrap; }
  .form-tab { padding: 7px 16px; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-radius: 7px; display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; transition: all .15s; }
  .form-tab:hover:not(.disabled):not(.active) { color: var(--text-primary); }
  .form-tab.active { background: var(--surface); color: var(--text-primary); box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
  .form-tab.disabled { color: var(--text-tertiary); cursor: not-allowed; opacity: 0.5; }
  .file-item { display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; transition: border-color .15s; max-width: 100%; }
  .file-item:hover { border-color: var(--border-strong); }
  .file-item.highlighted { border-color: var(--brand-pink); background: var(--brand-pink-soft); }
  .file-item-icon { flex-shrink: 0; width: 22px; height: 26px; position: relative; }
  .file-icon-pdf { background: #ef4444; color: #fff; border-radius: 3px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 3px; font-size: 8px; font-weight: 800; letter-spacing: 0.3px; width: 100%; height: 100%; position: relative; }
  .file-icon-pdf::before { content: ''; position: absolute; top: 0; right: 0; border-left: 6px solid #fca5a5; border-bottom: 6px solid transparent; }
  .file-icon-img { background: #3b82f6; color: #fff; border-radius: 3px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 3px; font-size: 8px; font-weight: 800; width: 100%; height: 100%; position: relative; }
  .file-icon-img::before { content: ''; position: absolute; top: 0; right: 0; border-left: 6px solid #93c5fd; border-bottom: 6px solid transparent; }
  .file-icon-doc { background: #8b5cf6; color: #fff; border-radius: 3px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 3px; font-size: 8px; font-weight: 800; width: 100%; height: 100%; position: relative; }
  .file-icon-doc::before { content: ''; position: absolute; top: 0; right: 0; border-left: 6px solid #c4b5fd; border-bottom: 6px solid transparent; }
  .file-icon-xls { background: #16a34a; color: #fff; border-radius: 3px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 3px; font-size: 8px; font-weight: 800; width: 100%; height: 100%; position: relative; }
  .file-icon-xls::before { content: ''; position: absolute; top: 0; right: 0; border-left: 6px solid #86efac; border-bottom: 6px solid transparent; }
  .file-item-name { font-size: 13px; color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 360px; }
  .file-item-meta { font-size: 11px; color: var(--text-tertiary); margin-left: 4px; white-space: nowrap; }
  .file-item-response-tag { font-size: 10px; color: var(--brand-pink); font-weight: 600; margin-left: 4px; white-space: nowrap; }
  .file-item-actions { display: flex; align-items: center; gap: 2px; margin-left: 6px; padding-left: 8px; border-left: 1px solid var(--border); }
  .file-action-btn { width: 28px; height: 28px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; transition: all .12s; }
  .file-action-btn:hover { background: var(--surface-muted); color: var(--brand-pink); }
  .file-action-btn.danger:hover { background: var(--danger-soft); color: var(--danger); }
  .subsection-title { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 24px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .subsection-title:first-child { margin-top: 0; }
  .task-item { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
  .task-item:hover:not(.task-item-static) { border-color: var(--brand-pink); box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .task-item.highlight { border-color: var(--brand-pink); background: linear-gradient(to right, #fff5f6, #fff); box-shadow: 0 0 0 3px rgba(242,84,97,0.08); }
  .modal-backdrop { position: fixed; inset: 0; background: rgba(15,15,15,0.55); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
  .modal-backdrop.hidden { display: none; }
  .modal-panel { background: #fff; border-radius: 16px; width: 100%; max-width: 720px; max-height: 88vh; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.25); overflow: hidden; }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; background: var(--surface-subtle); }
  .message { padding: 12px 14px; border-radius: 12px; font-size: 13px; line-height: 1.55; margin-bottom: 10px; max-width: 92%; }
  .message-client { background: var(--surface-muted); border: 1px solid var(--border); }
  .message-operator { background: var(--brand-pink-soft); border: 1px solid #f9c5cb; margin-left: auto; }
  .notif-panel { position: absolute; top: 44px; right: 14px; width: 360px; background: #fff; border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 14px 30px rgba(0,0,0,0.12); overflow: hidden; z-index: 50; }
  .notif-panel.hidden { display: none; }
  .notif-item { padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; gap: 10px; cursor: pointer; }
  .notif-item:hover { background: var(--surface-muted); }
  .notif-item:last-child { border-bottom: none; }
  .notif-item .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand-pink); flex-shrink: 0; margin-top: 6px; }
  .exec-step { display: flex; align-items: flex-start; gap: 14px; padding: 18px; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 10px; background: #fff; transition: all .2s; }
  .exec-step.done { border-color: var(--success); background: linear-gradient(to right, #f0fdf4, #fff); }
  .exec-step.active { border-color: var(--brand-pink); box-shadow: 0 0 0 3px rgba(242,84,97,0.1); }
  .exec-step-header { display: flex; align-items: flex-start; gap: 14px; width: 100%; }
  .exec-step-header.collapsible { cursor: pointer; }
  .exec-step-chevron { width: 18px; height: 18px; color: var(--text-secondary); flex-shrink: 0; align-self: center; transition: transform 0.2s; }
  .exec-step-chevron.open { transform: rotate(180deg); }
  .exec-step .step-num { width: 28px; height: 28px; border-radius: 50%; background: var(--surface-muted); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0; }
  .exec-step.done .step-num { background: var(--success); color: #fff; }
  .exec-step.active .step-num { background: var(--brand-pink); color: #fff; }
  .exec-ref-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 0; overflow: hidden; }
  .exec-ref-card-header { padding: 16px 20px 14px; font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--border); color: var(--text-primary); }
  .exec-ref-item { border-bottom: 1px solid var(--border); }
  .exec-ref-item:last-child { border-bottom: none; }
  .exec-ref-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; font-size: 13.5px; font-weight: 600; background: none; border: none; cursor: pointer; text-align: left; color: var(--text-primary); gap: 8px; }
  .exec-ref-trigger:hover { background: var(--surface-subtle); }
  .exec-ref-chevron { flex-shrink: 0; transition: transform 0.2s; }
  .exec-ref-trigger.open .exec-ref-chevron { transform: rotate(180deg); }
  .exec-ref-content { padding: 4px 20px 24px; }
  .exec-ref-badge { font-size: 12px; font-weight: 400; color: var(--text-secondary); margin-left: 6px; }
  .exec-ref-copy-btn { padding: 2px 4px; border: none; background: none; cursor: pointer; color: var(--text-tertiary); border-radius: 4px; display: inline-flex; align-items: center; flex-shrink: 0; }
  .exec-ref-copy-btn:hover { background: var(--surface-muted); color: var(--text-secondary); }
  .empty-state { text-align: center; padding: 48px 24px; }
  .empty-state .icon-wrap { width: 64px; height: 64px; background: var(--brand-pink-soft); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: var(--brand-pink); margin-bottom: 20px; }
  .attachment { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--surface-subtle); border: 1px solid var(--border); border-radius: 8px; font-size: 13px; cursor: pointer; transition: border-color .15s; }
  .attachment:hover { border-color: var(--brand-pink); }
  .home-top-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px; align-items: stretch; }
  .stats-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .stats-row:last-child { border-bottom: none; }
  .stats-row.clickable { cursor: pointer; transition: background .12s; }
  .stats-row.clickable:hover { background: var(--surface-subtle); }
  .stats-row-label { font-size: 12px; color: var(--text-secondary); font-weight: 500; }
  .stats-row-sublabel { font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }
  .stats-row-value { font-size: 24px; font-weight: 700; color: var(--text-primary); line-height: 1; }
  .stats-row-value.warning { color: var(--warning); }
  .stats-row-value.brand { color: var(--brand-pink); }
  .lo-pager { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 12px; }
  .lo-pager-info { font-size: 12px; color: var(--text-tertiary); }
  .lo-pager .btn { padding: 6px 12px; font-size: 12.5px; }
  .lo-pager .btn[disabled] { opacity: 0.45; cursor: not-allowed; }
  .contact-tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; text-transform: lowercase; letter-spacing: 0.02em; background: var(--surface-muted); color: var(--text-secondary); border: 1px solid var(--border); white-space: nowrap; line-height: 1.6; }
  .contact-tag-client { background: #fde7ea; color: var(--brand-pink); border-color: #f9c5cb; }
  .hidden { display: none !important; }
  .container-wide { max-width: 1500px; margin: 0 auto; }
  .task-detail-grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; align-items: start; }
  .timeline-horizontal { display: flex; align-items: flex-start; gap: 0; padding: 4px 0 2px; }
  .tl-item-h { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; text-align: center; padding: 0 6px; min-width: 0; }
  .tl-item-h:not(:last-child)::after { content: ''; position: absolute; top: 13px; left: calc(50% + 18px); right: calc(-50% + 18px); height: 2px; background: var(--border); z-index: 0; }
  .tl-item-h.done:not(:last-child)::after { background: var(--success); }
  .tl-item-h.active:not(:last-child)::after { background: linear-gradient(to right, var(--success) 0%, var(--success) 40%, var(--border) 60%); }
  .tl-item-h .tl-dot { position: relative; z-index: 1; margin-bottom: 8px; }
  .tl-item-h .tl-step { font-size: 12px; font-weight: 600; color: var(--text-primary); line-height: 1.3; }
  .tl-item-h.pending .tl-step { color: var(--text-tertiary); font-weight: 500; }
  .tl-item-h .tl-meta { font-size: 10.5px; color: var(--text-tertiary); margin-top: 2px; line-height: 1.2; }
  .history-list { display: flex; flex-direction: column; }
  .history-msg { padding: 14px 14px; border-bottom: 1px solid var(--border); border-radius: 6px; }
  .history-msg:last-child { border-bottom: none; }
  .history-msg.operator { background: #fff5f6; border-bottom: 1px solid var(--border); }
  .history-msg-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
  .history-msg-avatar { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #64748b, #94a3b8); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; align-self: center; }
  .history-msg.operator .history-msg-avatar { background: linear-gradient(135deg, var(--brand-pink), #f97316); }
  .history-msg-author { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .history-msg.operator .history-msg-author { color: var(--brand-pink); }
  .history-msg-timestamp { font-size: 12px; color: var(--text-tertiary); margin-left: auto; }
  .history-msg-text { font-size: 13px; color: var(--text-primary); line-height: 1.6; padding-left: 32px; }
  .history-msg-attachments { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; padding-left: 32px; }
  .tl-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; position: relative; z-index: 1; }
  .tl-dot-done { background: var(--success-soft); color: var(--success); }
  .tl-dot-active { background: var(--brand-pink); color: #fff; box-shadow: 0 0 0 4px rgba(242,84,97,0.12); }
  .tl-dot-pending { background: var(--surface-muted); color: var(--text-tertiary); border: 2px solid var(--border); }
  .tl-dot-warn { background: var(--warning); color: #fff; box-shadow: 0 0 0 4px rgba(245,158,11,0.15); }
  .tl-item-h.warn:not(:last-child)::after { background: var(--success); }
  .decision-card { background: linear-gradient(to bottom, var(--surface-subtle), #fff); border: 2px solid var(--border); border-radius: 14px; padding: 24px 28px; margin-top: 16px; }
  .decision-card .decision-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
  .decision-card .decision-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.55; }
  .decision-card .decision-btns { display: flex; gap: 12px; flex-wrap: wrap; }
  .btn-decision-yes { background: var(--success); color: #fff; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 8px; transition: background .15s; }
  .btn-decision-yes:hover { background: #15803d; }
  .btn-decision-no { background: #fff; color: var(--text-primary); padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; border: 1.5px solid var(--border-strong); display: inline-flex; align-items: center; gap: 8px; transition: all .15s; }
  .btn-decision-no:hover { border-color: var(--brand-pink); color: var(--brand-pink); }
  /* Ação terciária da validação: devolver à fila (peso menor que os dois primários) */
  /* Ação "Devolver à fila" — no header da tarefa, alinhada à direita (mesmo lugar em validação e execução). Vermelho do projeto. */
  .btn-return-queue { background: none; border: none; color: var(--danger); font-size: 12.5px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; padding: 2px; text-underline-offset: 3px; white-space: nowrap; }
  .btn-return-queue:hover { color: #b91c1c; text-decoration: underline; }
  /* Botão primário destrutivo (vermelho do projeto) — confirmar da devolução */
  .btn-danger-solid { background: var(--danger); color: #fff; }
  .btn-danger-solid:hover { background: #b91c1c; }
  .btn-danger-solid:disabled { opacity: 0.5; cursor: not-allowed; }
  /* Bloco "De → Para" — reaproveitado do gerente.html para o modal de devolução */
  .from-to-block { display: flex; align-items: stretch; gap: 10px; margin: 4px 0 4px; }
  .ft-side { flex: 1; min-width: 0; }
  .ft-side .ft-label { font-size: 10px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  .ft-card { background: var(--surface-muted); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; min-height: 60px; }
  .ft-card .av { width: 34px; height: 34px; border-radius: 50%; color: #fff; font-weight: 700; font-size: 11.5px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: var(--brand-blue); }
  .ft-card .av.inbox { background: var(--brand-pink); }
  .ft-card .info { min-width: 0; }
  .ft-card .info .name { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.2; }
  .ft-card .info .role { font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }
  .ft-arrow { display: flex; align-items: center; color: var(--text-tertiary); padding-top: 22px; }
  .exec-step .step-action { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: #fff; border: 1px solid var(--border-strong); border-radius: 8px; font-size: 12.5px; font-weight: 500; color: var(--text-primary); cursor: pointer; transition: all .15s; white-space: nowrap; }
  .exec-step .step-action:hover { border-color: var(--brand-pink); color: var(--brand-pink); }
  .exec-step .step-mark-done { padding: 8px 14px; background: var(--brand-pink); color: #fff; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; transition: background .15s; }
  .exec-step .step-mark-done:hover { background: var(--brand-pink-hover); }
  .exec-step .step-buttons { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
  .success-hero { background: linear-gradient(135deg, #dcfce7, #f0fdf4); border: 2px solid #86efac; border-radius: 18px; padding: 48px 32px; text-align: center; margin-bottom: 20px; }
  .success-hero .icon-circle { width: 72px; height: 72px; border-radius: 50%; background: var(--success); color: #fff; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; }
  .success-hero h1 { font-size: 24px; font-weight: 700; color: var(--success); margin-bottom: 8px; }
  .success-hero p { font-size: 14px; color: #15803d; line-height: 1.55; max-width: 480px; margin: 0 auto; }
  .summary-list { background: #fff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-bottom: 1px solid var(--border); }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { font-size: 13px; color: var(--text-secondary); }
  .summary-value { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .upload-area { border: 2px dashed var(--border-strong); border-radius: 10px; padding: 22px 18px; text-align: center; background: var(--surface-subtle); cursor: pointer; transition: all .15s; margin-top: 12px; }
  .upload-area:hover, .upload-area.dragover { border-color: var(--brand-pink); background: var(--brand-pink-soft); }
  .upload-area-icon { width: 40px; height: 40px; border-radius: 50%; background: #fff; color: var(--brand-pink); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px; }
  .upload-area-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
  .upload-area-hint { font-size: 12px; color: var(--text-secondary); }
  .upload-area-hint strong { color: var(--brand-pink); text-decoration: underline; }
  .uploaded-files-list { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; }
  .step-edit-btn { padding: 6px 12px; background: #fff; color: var(--text-secondary); border: 1px solid var(--border-strong); border-radius: 7px; font-size: 12px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all .15s; }
  .step-edit-btn:hover { border-color: var(--brand-pink); color: var(--brand-pink); }
  .alert-banner { background: linear-gradient(to right, #fff5f6, #fff); border: 1px solid #f9c5cb; border-left: 4px solid var(--brand-pink); border-radius: 10px; padding: 14px 18px; display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  details > summary { list-style: none; cursor: pointer; }
  details > summary::-webkit-details-marker { display: none; }
  .editable-badge { font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 6px; background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; border-radius: 4px; font-weight: 600; vertical-align: middle; }
  .editable-edit-btn { background: none; border: 1px solid var(--border); border-radius: 5px; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-tertiary); transition: all .15s; padding: 0; flex-shrink: 0; }
  .editable-edit-btn:hover { border-color: var(--brand-pink); color: var(--brand-pink); background: var(--brand-pink-soft); }
  .ef-field { display: flex; flex-direction: column; gap: 4px; }
  .ef-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-tertiary); margin-bottom: 0; }
  .ef-input, .ef-select, .ef-textarea { font-size: 13.5px; font-weight: 400; color: var(--text-primary); border: 1px solid var(--border-strong); border-radius: 7px; padding: 7px 10px; background: #fff; outline: none; width: 100%; font-family: inherit; transition: border-color .15s, box-shadow .15s; }
  .ef-input:focus, .ef-select:focus, .ef-textarea:focus { border-color: var(--brand-pink); box-shadow: 0 0 0 3px var(--brand-pink-soft); }
  .ef-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
  .ef-textarea { resize: vertical; min-height: 80px; }
  .ef-toggle-group { display: inline-flex; border: 1px solid var(--border-strong); border-radius: 7px; padding: 3px; background: var(--surface-muted); width: fit-content; }
  .ef-field:has(> .ef-toggle-group) { width: max-content; justify-self: start; align-self: end; }
  .ef-toggle-btn { padding: 5px 12px; font-size: 12.5px; font-weight: 500; border-radius: 5px; border: none; cursor: pointer; background: transparent; color: var(--text-secondary); transition: all .12s; white-space: nowrap; }
  .ef-toggle-btn.active { background: #fff; color: var(--text-primary); box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
  .edit-mode-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: #fffbf0; border: 1px solid #fcd34d; border-radius: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .edit-mode-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 10px; background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; border-radius: 5px; }
  .ef-datepicker { position: relative; display: flex; }
  .ef-datepicker-input { flex: 1; cursor: pointer; padding-left: 34px !important; }
  .ef-datepicker-btn { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-tertiary); display: flex; align-items: center; padding: 0; transition: color .12s; }
  .ef-datepicker-btn:hover { color: var(--brand-pink); }
  .ef-cal-popup { display: none; position: absolute; top: calc(100% + 6px); left: 0; z-index: 200; background: #fff; border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 14px 16px 16px; min-width: 252px; }
  .ef-cal-popup.open { display: block; }
  .ef-cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .ef-cal-nav { background: none; border: 1px solid var(--border); border-radius: 6px; width: 26px; height: 26px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 15px; line-height: 1; transition: background .1s; }
  .ef-cal-nav:hover { background: var(--surface-muted); color: var(--text-primary); }
  .ef-cal-month-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .ef-cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 4px; }
  .ef-cal-weekdays span { text-align: center; font-size: 10.5px; font-weight: 500; color: var(--text-tertiary); padding: 3px 0; }
  .ef-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
  .ef-cal-day { text-align: center; padding: 6px 0; font-size: 12.5px; border-radius: 6px; cursor: pointer; color: var(--text-primary); transition: background .1s; }
  .ef-cal-day:hover:not(.empty) { background: var(--surface-muted); }
  .ef-cal-day.selected { background: var(--brand-pink); color: #fff; font-weight: 600; }
  .ef-cal-day.today:not(.selected) { font-weight: 700; color: var(--brand-pink); }
  .ef-cal-day.other-month { color: var(--text-tertiary); }
  .ef-cal-day.empty { cursor: default; }

  /* Tabela densa de tarefas (padrão V1 — admin do gerente + lista do operador + fila invisível dos fluxos) */
  .lo-table-wrap { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
  .lo-table-head, .lo-row { display: grid; grid-template-columns: 30px 12px minmax(140px, 1.8fr) minmax(104px, 1.2fr) minmax(124px, 1fr) minmax(138px, 1.1fr) 40px; align-items: center; gap: 12px; padding: 10px 14px; }
  .lo-table-head { background: var(--surface-muted); border-bottom: 1px solid var(--border); }
  .lo-table-head .h-cell { font-size: 11.5px; font-weight: 600; color: var(--text-secondary); }
  .lo-row { position: relative; background: #fff; transition: background .12s; }
  .lo-row + .lo-row { border-top: 1px solid var(--border); }
  .lo-row.clickable { cursor: pointer; }
  .lo-row.clickable:hover { background: var(--surface-subtle); }
  .lo-row.execucao      { box-shadow: inset 3px 0 0 var(--brand-pink); }
  .lo-row.stationed-row { box-shadow: inset 3px 0 0 var(--warning); }
  .lo-row.next-up       { box-shadow: inset 3px 0 0 var(--brand-pink); }
  .lo-row .type-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--brand-blue-soft); color: var(--brand-blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .lo-row .lo-solic { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .lo-row .lo-solic .client-name { font-size: 13.5px; font-weight: 600; color: var(--text-primary); line-height: 1.3; word-break: break-word; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  /* Bolinha de "cliente respondeu, ainda não aberto" (GDocs). Vive numa COLUNA fina entre o
     ícone e o nome (2ª coluna do grid) pra saltar aos olhos e alinhar entre as linhas, em vez
     de se perder colada ao nome. Azul de marca (--brand-blue) — consistente com a UI e
     distinto do ponto rosa do sino. Só na lista do operador. (COCKPIT-958) */
  .lo-table-head .lo-dot-cell, .lo-row .lo-dot-cell { display: flex; align-items: center; justify-content: center; }
  .lo-row .update-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand-blue); }
  .lo-row .lo-solic .client-cnpj { font-size: 11px; color: var(--text-tertiary); font-family: 'JetBrains Mono', monospace; }
  .lo-row .lo-solic .ctx-line { font-size: 11px; color: var(--text-tertiary); }
  .lo-row .lo-tipo { font-size: 12.5px; color: var(--text-primary); font-weight: 500; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .lo-row .lo-tipo .lo-proc { line-height: 1.3; word-break: break-word; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .lo-row .lo-tipo .lo-colab { color: var(--text-secondary); font-weight: 400; font-size: 11.5px; }
  /* Tag HITL na tarefa de origem Autopilot — mesmo selo/valores do acompanhamento
     (tarefa que o robô gerou pra uma pessoa resolver). Fonte única aqui.
     Fica num bloco ACIMA do nome do processo, igual ao acompanhamento (apt-proc-top). */
  .lo-row .lo-tipo .lo-proc-top { margin-bottom: 1px; }
  .tag-autopilot { display: inline-flex; align-items: center; font-size: 9.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: #6b7280; background: #f3f4f6; border-radius: 3px; padding: 1px 6px; white-space: nowrap; }
  /* Link "Abrir página do cliente" no header da tarefa (ao lado do CNPJ).
     Fonte única aqui — vale pra toda tarefa (Hub e Autopilot); os fluxos do Hub
     não carregam operador-ui.css, então o estilo precisa morar no core. */
  .client-link { display: inline-flex; align-items: center; margin-left: 10px; color: var(--brand-pink); text-decoration: none; vertical-align: middle; transition: opacity .12s; }
  .client-link:hover { opacity: 0.65; }
  .client-link svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2.25; }
  /* ERP operado + Origem — mesmo padrão de texto do Cockpit (rótulo neutro +
     valor em destaque). */
  .dom-meta { font-size: 11.5px; color: var(--text-primary); white-space: nowrap; }
  .dom-meta .dom-k { color: var(--text-tertiary); font-weight: 400; }
  .dom-meta .dom-v { font-weight: 600; }
  .dom-meta .dom-sep { color: var(--text-tertiary); margin: 0 5px; }
  /* Na lista, esses metadados são secundários: leves (peso médio + cinza) pra não
     competir com o nome do cliente. No header da tarefa seguem em preto/bold. */
  .lo-row .dom-meta { color: var(--text-secondary); }
  .lo-row .dom-meta .dom-v { font-weight: 500; color: var(--text-secondary); }
  .lo-row .icon-btn { width: 28px; height: 28px; border: 1px solid var(--border); border-radius: 6px; background: transparent; color: var(--text-secondary); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all .12s; }
  .lo-row .icon-btn:hover { border-color: var(--brand-blue); color: var(--brand-blue); background: #fff; }

  /* State pill outlined (compartilhado em todos os contextos) */
  .state-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 6px; font-size: 11.5px; font-weight: 500; background: #fff; border: 1px solid; white-space: nowrap; }
  .state-pill.em-execucao       { color: var(--brand-pink); border-color: var(--brand-pink); }
  .state-pill.na-fila           { color: var(--text-secondary); border-color: #c8ccd1; }
  .state-pill.proxima           { color: var(--brand-pink); border-color: var(--brand-pink); background: var(--brand-pink-soft); }
  .state-pill.em-espera         { color: #b45309; border-color: #f59e0b; }
  .state-pill.em-processamento  { color: var(--brand-blue); border-color: var(--brand-blue); }

  /* Prazo cell */
  .prazo-cell { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .prazo-when { font-size: 13px; color: var(--text-primary); font-weight: 500; white-space: nowrap; }
  .prazo-when.overdue { color: #b91c1c; font-weight: 600; }
  .prazo-when .sep { display: inline-block; margin: 0 4px; color: var(--text-tertiary); font-weight: 400; }
  .prazo-when.overdue .sep { color: rgba(185, 28, 28, 0.55); }
  .prazo-tag { font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: 5px; width: fit-content; }
  .prazo-tag.risk    { background: rgba(245, 158, 11, 0.15); color: #b45309; border: 1px solid #f59e0b; }
  .prazo-tag.overdue { background: rgba(220, 38, 38, 0.10); color: #b91c1c; border: 1px solid #ef4444; }

  /* Cabeçalho da seção (h2 fora do box + subtítulo) */
  .section-head { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; margin-top: 28px; }
  .section-head .sh-text { display: flex; flex-direction: column; min-width: 0; }
  .section-head .sh-title { font-size: 19px; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
  .section-head .sh-sub { font-size: 12px; color: var(--text-tertiary); margin-top: 2px; }
  /* Títulos das seções da fila do operador (Atribuídas a mim / Fila geral) um
     pouco menores — escopado por ID pra não afetar outras telas. */
  #ol-atribuidas .sh-title, #ol-list-head .sh-title { font-size: 15px; }

  /* Container "Em espera — aguardando cliente" (recolhível) */
  .espera-wrap { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 16px; background: #fff; }
  .espera-head { width: 100%; display: flex; align-items: center; gap: 9px; padding: 12px 16px; background: #fff; border: none; cursor: pointer; text-align: left; font-size: 13.5px; font-weight: 600; color: var(--text-primary); }
  .espera-head:hover { background: var(--surface-subtle); }
  .espera-head .esp-chev { margin-left: auto; color: var(--text-tertiary); transition: transform .15s; }
  .espera-head.open { border-bottom: 1px solid var(--border); }
  .espera-head.open .esp-chev { transform: rotate(180deg); }

  /* Filtros — dropdowns no estilo do cockpit (dhub: shadcn/Radix neutro) */
  .flt-bar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 0 0 12px; }
  .flt { position: relative; }
  .flt-trigger { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; background: #fff; border: 1px solid #ebebeb; border-radius: 10px; font-size: 14px; color: var(--text-primary); cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.05); white-space: nowrap; }
  .flt-trigger:hover { background: #fafafa; }
  .flt-trigger.has-val { border-color: var(--brand-blue); color: var(--brand-blue); font-weight: 500; }
  .flt-chev { color: #8d8d8d; }
  .flt-clear { display: inline-flex; color: #8d8d8d; }
  .flt-trigger.has-val .flt-chev, .flt-trigger.has-val .flt-clear { color: var(--brand-blue); }
  .flt-clear:hover { color: var(--brand-pink); }
  .flt-menu { position: absolute; top: calc(100% + 4px); left: 0; min-width: 230px; max-height: 300px; overflow-y: auto; background: #fff; border: 1px solid #ebebeb; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); z-index: 60; padding: 4px; }
  /* sticky: o menu rola, o campo de busca fica. Fundo opaco senão as opções passam por baixo. */
  .flt-search { position: sticky; top: 0; z-index: 1; width: 100%; box-sizing: border-box; height: 34px; padding: 0 10px; border: 1px solid #ebebeb; border-radius: 6px; font-size: 13.5px; outline: none; margin-bottom: 4px; background: #fff; }
  .flt-search:focus { border-color: var(--brand-blue); }
  .flt-item { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 4px; font-size: 14px; color: var(--text-primary); cursor: pointer; }
  .flt-item:hover { background: #f8f8f8; }
  .flt-item.on { background: #f2f7ff; }
  .flt-item .flt-check { margin-left: auto; color: var(--brand-blue); flex-shrink: 0; }
  .flt-item .flt-cnpj { font-size: 11px; color: #8d8d8d; font-family: 'JetBrains Mono', monospace; }
  /* Caixa de marcação: diz que o filtro aceita mais de um valor antes do primeiro clique. */
  .flt-box { flex-shrink: 0; width: 16px; height: 16px; border: 1.5px solid #c4c4c4; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; color: #fff; }
  .flt-item:hover .flt-box { border-color: #9a9a9a; }
  .flt-item.on .flt-box { background: var(--brand-blue); border-color: var(--brand-blue); }
  /* bottom negativo cobre o padding do menu: nenhuma opção vaza por baixo do rodapé. */
  .flt-foot { position: sticky; bottom: -4px; background: #fff; border-top: 1px solid #f0f0f0; margin-top: 4px; padding: 4px 0; }
  .flt-foot button { width: 100%; text-align: left; background: none; border: none; padding: 7px 8px; border-radius: 4px; font-size: 13px; color: var(--brand-blue); cursor: pointer; }
  .flt-foot button:hover { background: #f8f8f8; }
  .flt-limpar { background: none; border: none; color: var(--brand-blue); font-size: 13px; cursor: pointer; padding: 0 6px; height: 36px; }
  .flt-limpar:hover { text-decoration: underline; }

  /* Seletor de período (presets + calendário de range) — MÓDULO COMPARTILHADO
     (fila do operador "Solicitado em" + painel de acompanhamento). Espelha
     .flt-trigger (mesma altura/borda/fonte). */
  .pp-wrap { position: relative; display: inline-flex; }
  .pp-btn { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; border: 1px solid #ebebeb; border-radius: 10px; background: #fff; font-size: 14px; color: var(--text-primary); cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.05); white-space: nowrap; }
  .pp-btn:hover { background: var(--surface-subtle); }
  .pp-btn.open, .pp-btn.has-val { border-color: var(--brand-blue); color: var(--brand-blue); }
  .pp-btn.has-val { font-weight: 500; }
  .pp-pop { position: absolute; top: calc(100% + 6px); left: 0; z-index: 70; display: flex; background: #fff; border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 8px 28px rgba(0,0,0,0.16); overflow: hidden; }
  .pp-presets { display: flex; flex-direction: column; padding: 8px; border-right: 1px solid var(--border); min-width: 154px; background: var(--surface-subtle); }
  .pp-preset { text-align: left; padding: 8px 12px; font-size: 13px; color: var(--text-secondary); background: none; border: none; border-radius: 8px; cursor: pointer; white-space: nowrap; }
  .pp-preset:hover { background: #fff; color: var(--text-primary); }
  .pp-preset.active { background: var(--brand-blue-soft); color: var(--brand-blue); font-weight: 600; }
  .pp-preset.pp-clear { color: var(--brand-pink); margin-top: 4px; border-top: 1px solid var(--border); border-radius: 0; }
  .pp-cal { padding: 12px; width: 262px; }
  .pp-cal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .pp-cal-head span { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .pp-cal-head button { background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 4px; border-radius: 6px; display: inline-flex; }
  .pp-cal-head button:hover { background: var(--surface-subtle); color: var(--text-primary); }
  .pp-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .pp-cal-dow { font-size: 10.5px; color: var(--text-tertiary); text-align: center; padding: 4px 0; font-weight: 600; }
  .pp-cal-day { font-size: 12.5px; text-align: center; padding: 7px 0; border-radius: 7px; cursor: pointer; color: var(--text-primary); }
  .pp-cal-day:hover:not(.empty) { background: var(--surface-subtle); }
  .pp-cal-day.empty { cursor: default; }
  .pp-cal-day.in-range { background: var(--brand-blue-soft); border-radius: 0; }
  .pp-cal-day.range-start, .pp-cal-day.range-end { background: var(--brand-blue); color: #fff; }
  .pp-cal-day.range-start { border-radius: 7px 0 0 7px; }
  .pp-cal-day.range-end { border-radius: 0 7px 7px 0; }
  .pp-cal-day.range-start.range-end, .pp-cal-day.picked { border-radius: 7px; background: var(--brand-blue); color: #fff; }
  .pp-cal-day.today { box-shadow: inset 0 0 0 1.5px var(--brand-pink); font-weight: 700; }
  .pp-cal-hint { font-size: 11px; color: var(--text-tertiary); margin-top: 8px; text-align: center; }

  /* AVISOS (flash) — canto direito, um embaixo do outro. Empilhar é o que permite
     o canto: no centro dois avisos se sobrepunham. */
  .flash-stack { position: fixed; top: 60px; right: 20px; z-index: 300; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; pointer-events: none; }
  .flash-toast { pointer-events: auto; position: relative; overflow: hidden; display: flex; align-items: center; gap: 14px; min-width: 250px; max-width: min(430px, 90vw); padding: 11px 16px 14px; border-radius: 10px; border: 1px solid transparent; font-size: 13px; font-weight: 500; line-height: 1.45; box-shadow: 0 10px 30px rgba(0,0,0,0.12); transition: opacity .25s; }
  .flash-toast.success { background: #dcfce7; color: #166534; border-color: #86efac; }
  .flash-toast.info    { background: #dbeafe; color: #1e40af; border-color: #93c5fd; }
  .flash-toast.warning { background: #fef3c7; color: #92400e; border-color: #fcd34d; }
  .flash-txt { flex: 1; min-width: 0; }
  /* A barra é o relógio do aviso: sem ela ele desaparece sem avisar, e quem está
     lendo não sabe se ainda dá tempo de agir. Escala em vez de largura pra animar
     sem recalcular layout. */
  .flash-bar { position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; background: currentColor; opacity: 0.3; transform-origin: left center; animation: flash-bar linear forwards; }
  @keyframes flash-bar { from { transform: scaleX(1); } to { transform: scaleX(0); } }
  `;
  document.head.appendChild(style);
})();

/* ---- Menu lateral — espelho do microfrontend cockpit-platform-sidebar ----
   Escopo fechado de propósito: nomes no topo do arquivo viram propriedades
   não-configuráveis do global e estouram quando uma tela redeclara o mesmo
   nome. Só window.CockpitSidebar sai daqui. */
(function () {
  const CSS_VAR = '--cockpit-sidebar-w';
  const STORE_KEY = 'cockpit_sidebar_collapsed';
  const W = 236;
  const W_COLLAPSED = 64;
  const SLIDE = 200;
  const root = document.documentElement;

  const GROUPS = [
    { id: 'trabalho', label: 'Trabalho', items: [
      { id: 'clients', label: 'Clientes', icon: 'users' },
      { id: 'tasks-gto', label: 'Tarefas (GTO)', icon: 'circle-check-big' },
      { id: 'tasks-new', label: 'Tarefas (novo)', icon: 'list-checks' },
      // Absoluto: o shell roda dentro dos labs, e relativo resolveria pra
      // /lab-v3/lista-operador.html.
      { id: 'dp', label: 'Tarefas de DP', icon: 'list-todo', href: '/lista-operador.html' },
      { id: 'dispatcher', label: 'Solicitações', icon: 'send' },
      { id: 'gdocs', label: 'GDocs', icon: 'folder' },
    ] },
    { id: 'ferramentas', label: 'Ferramentas', items: [
      { id: 'tools', label: 'Ferramentas', icon: 'wrench', children: [
        { id: 'scheduler', label: 'Agendar pagamentos', icon: 'clock' },
        { id: 'extracts', label: 'Buscador de Extratos', icon: 'file-search' },
        { id: 'reconciler', label: 'Conciliador', icon: 'arrow-right-left' },
        { id: 'invoice-integrator', label: 'Integrador de notas fiscais', icon: 'receipt' },
      ] },
    ] },
    { id: 'fechamento', label: 'Fechamento', items: [
      { id: 'accounting', label: 'Contábil', icon: 'calculator' },
      { id: 'internal-billing', label: 'Faturamento interno', icon: 'dollar-sign' },
      { id: 'reports', label: 'Relatórios', icon: 'bar-chart-3' },
    ] },
  ];

  const LOGO = '<svg width="20" height="20" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BHub" style="flex-shrink:0;display:block;"><path d="M27.7557 0H3.26521C2.36377 0 1.54818.366052.955809.955166.366298 1.54714 0 2.36218 0 3.26301V27.737C0 28.6378.366298 29.4529.955809 30.0448 1.54532 30.6368 2.36377 31 3.26521 31H27.7557C28.6571 31 29.4727 30.6339 30.0651 30.0448 30.6574 29.4557 31.0209 28.6378 31.0209 27.737V3.26301C31.0209 2.36218 30.6546 1.54714 30.0651.955166 29.4756.366052 28.6571 0 27.7557 0ZM9.04871 23.3787C8.7282 23.699 8.30753 23.8591 7.88686 23.8591 7.46619 23.8591 7.04552 23.699 6.72501 23.3787L4.80194 21.4569 2.87888 19.5351C2.55836 19.2149 2.39811 18.7945 2.39811 18.3712 2.39811 17.948 2.55836 17.5304 2.87888 17.2101L5.38287 14.7078 7.88686 12.2055 10.9718 15.2884 14.0567 18.3712 11.5527 20.8735 9.04871 23.3758V23.3787ZM9.30626 10.8185L11.7902 8.33625 14.2742 5.85397C14.6061 5.52223 15.0411 5.35637 15.479 5.35637 15.9168 5.35637 16.3489 5.52223 16.6837 5.85397L19.1677 8.33625 21.6517 10.8185 18.5667 13.9014 15.4818 16.9842 12.3969 13.9014 9.31199 10.8185H9.30626ZM28.0819 19.4722L26.093 21.4598 24.1041 23.4473C23.8008 23.7505 23.403 23.902 23.0052 23.902 22.6075 23.902 22.2097 23.7505 21.9064 23.4473L19.368 20.9107 16.8297 18.3741 19.9146 15.2912 22.9995 12.2084 25.5379 14.745 28.0762 17.2816C28.3795 17.5848 28.5312 17.9823 28.5312 18.3798 28.5312 18.7773 28.3795 19.1748 28.0762 19.478L28.0819 19.4722Z" fill="currentColor"/></svg>';

  /* Telas que não pertencem à fila de DP: nelas nenhum item fica aceso. */
  const NAO_E_FILA = ['acompanhamento', 'painel', 'index', 'gerente', 'v0'];
  const pagina = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '');
  const dpAtivo = NAO_E_FILA.indexOf(pagina) === -1;

  let target = false;
  let collapsed = false;
  let frame = 0;
  let timer = 0;
  let memo = null;          // fallback quando localStorage está bloqueado
  let manualOpen = null;    // intenção do usuário no acordeão
  let flyoutFor = null;

  /* ---- fonte ---- */
  function ensureLato() {
    if (document.getElementById('bhub-sidebar-lato')) return;
    const l = document.createElement('link');
    l.id = 'bhub-sidebar-lato';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap';
    document.head.appendChild(l);
  }

  /* ---- estado ---- */
  function readPersisted() {
    try { return localStorage.getItem(STORE_KEY) === 'true'; } catch (e) { return !!memo; }
  }
  function persist(v) {
    memo = v;
    try { localStorage.setItem(STORE_KEY, String(v)); } catch (e) { /* modo privado */ }
  }
  function widthFor(c) { return c ? W_COLLAPSED : W; }
  function applyWidth(px) { root.style.setProperty(CSS_VAR, px + 'px'); }
  function syncClasses() {
    root.classList.toggle('cs-collapsed', collapsed);
    root.classList.toggle('cs-labels', !target && !collapsed);
  }
  function nav() { return document.querySelector('nav.cockpit-sidebar'); }
  function reduceMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function icons() { if (window.lucide) lucide.createIcons(); }

  /* ---- markup ---- */
  function iconHtml(name) { return '<i data-lucide="' + name + '"></i>'; }

  function itemHtml(item, o) {
    o = o || {};
    let cls = 'cs-item';
    if (o.sub) cls += ' is-sub';
    if (o.active) cls += ' is-active';
    let attrs = '';
    if (item.href) {
      attrs = 'href="' + item.href + '"' + (o.active ? ' aria-current="page"' : '');
    } else {
      // Sem href: href="#" gravaria hash e apagaria o modo de leitura dos labs.
      attrs = 'role="link" aria-disabled="true" tabindex="0"';
    }
    return '<a class="' + cls + '" data-cs-id="' + item.id + '" ' + attrs + '>'
      + '<span class="cs-ico">' + iconHtml(item.icon) + '</span>'
      + '<span class="cs-label">' + item.label + '</span>'
      + '</a>';
  }

  function parentHtml(item, ativo) {
    const filhoAtivo = item.children.some(function (c) { return c.id === ativo; });
    const kids = item.children.map(function (c) {
      return '<li>' + itemHtml(c, { sub: true, active: c.id === ativo }) + '</li>';
    }).join('');
    return '<button type="button" class="cs-item cs-parent' + (filhoAtivo ? ' is-active' : '') + '"'
      + ' data-cs-parent="' + item.id + '" aria-expanded="' + (filhoAtivo ? 'true' : 'false') + '">'
      + '<span class="cs-ico">' + iconHtml(item.icon) + '</span>'
      + '<span class="cs-label">' + item.label + '</span>'
      + '<span class="cs-chev">' + iconHtml('chevron-right') + '</span>'
      + '</button>'
      + '<div class="cs-sub-wrap"><div class="cs-sub-clip">'
      + '<ul class="cs-sub" aria-label="' + item.label + '">' + kids + '</ul>'
      + '</div></div>';
  }

  function markup(opts) {
    opts = opts || {};
    const ativo = ('ativo' in opts) ? opts.ativo : (dpAtivo ? 'dp' : null);
    const extras = opts.extraItens || [];
    const grupos = GROUPS.map(function (g, i) {
      const items = i === 0 ? g.items.concat(extras) : g.items;
      const lis = items.map(function (item) {
        return '<li>' + (item.children ? parentHtml(item, ativo)
                                       : itemHtml(item, { active: item.id === ativo })) + '</li>';
      }).join('');
      return '<ul class="cs-group" aria-label="' + g.label + '">' + lis + '</ul>';
    }).join('');

    return '<nav class="sidebar cockpit-sidebar" aria-label="Navegação principal">'
      + '<div class="cs-head">'
      + '<span class="cs-logo">' + LOGO + '</span>'
      + '<span class="cs-word">Cockpit<span>.</span></span>'
      + '<span class="cs-spacer"></span>'
      + '<button type="button" class="cs-toggle" aria-label="Retrair menu" aria-expanded="true">'
      + iconHtml('panel-left') + '</button>'
      + '</div>'
      + '<div class="cs-modules">' + grupos + '</div>'
      + '<div class="cs-foot">'
      + '<button type="button" class="cs-user" aria-haspopup="menu" aria-expanded="false">'
      + '<span class="avatar" title="Daniele Ribeiro">DR</span>'
      + '<span class="cs-label cs-user-name">Daniele Ribeiro</span>'
      + '</button>'
      + '</div>'
      + '</nav>';
  }

  /* ---- retração ---- */
  function syncAria() {
    const n = nav();
    if (!n) return;
    const t = n.querySelector('.cs-toggle');
    if (t) {
      t.setAttribute('aria-label', collapsed ? 'Expandir menu' : 'Retrair menu');
      t.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
    n.querySelectorAll('.cs-parent').forEach(function (p) {
      if (collapsed) {
        p.setAttribute('aria-haspopup', 'menu');
        p.setAttribute('aria-expanded', 'false');
      } else {
        p.removeAttribute('aria-haspopup');
      }
    });
  }

  function toggle() {
    target = !target;
    // No fechar os rótulos perdem a classe ANTES da largura mudar: travados em
    // nowrap, esvaecem junto com o deslize e encolher só os corta.
    root.classList.toggle('cs-labels', !target && !collapsed);
    persist(target);
    closeFlyout();
    closeUserMenu();
    hideTip();
    manualOpen = null;
    cancelAnimationFrame(frame);
    clearTimeout(timer);

    const to = widthFor(target);
    const from = parseFloat(getComputedStyle(root).getPropertyValue(CSS_VAR)) || widthFor(collapsed);
    const reduce = reduceMotion();

    // A largura é interpolada na própria custom property: quem depende dela
    // (.main, .lab-app, .mgr-main) acompanha quadro a quadro sem transition própria.
    if (reduce || from === to) {
      applyWidth(to);
    } else {
      const start = performance.now();
      const tick = function (now) {
        const t = Math.min((now - start) / SLIDE, 1);
        applyWidth(Math.round(from + (to - from) * t));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }

    timer = setTimeout(function () {
      collapsed = target;
      syncClasses();
      syncAria();
    }, reduce ? 0 : SLIDE);
  }

  /* ---- tooltip ---- */
  function tipEl() {
    let el = document.getElementById('cs-tip');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cs-tip';
      el.className = 'cs-tip cs-hidden';
      document.body.appendChild(el);
    }
    return el;
  }
  function hideTip() {
    const el = document.getElementById('cs-tip');
    if (el) el.classList.add('cs-hidden');
  }
  function showTip(anchor, text) {
    const n = nav();
    if (!n || !text) return;
    const el = tipEl();
    el.textContent = text;
    el.classList.remove('cs-hidden');
    const a = anchor.getBoundingClientRect();
    el.style.left = (n.getBoundingClientRect().right + 14) + 'px';
    el.style.top = Math.round(a.top + a.height / 2 - el.offsetHeight / 2) + 'px';
  }

  /* ---- flyout do submenu (estado retraído) ---- */
  function closeFlyout() {
    const el = document.getElementById('cs-flyout');
    if (el) el.remove();
    const n = nav();
    if (n && flyoutFor) {
      const btn = n.querySelector('[data-cs-parent="' + flyoutFor + '"]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
    flyoutFor = null;
  }

  function openFlyout(btn, id) {
    const n = nav();
    const grupo = GROUPS.reduce(function (acc, g) {
      return acc || g.items.filter(function (i) { return i.id === id; })[0];
    }, null);
    if (!n || !grupo) return;
    closeFlyout();

    const headId = 'cs-fly-head-' + id;
    const el = document.createElement('div');
    el.id = 'cs-flyout';
    el.setAttribute('role', 'menu');
    el.setAttribute('aria-labelledby', headId);
    el.innerHTML = '<div class="cs-fly-head" id="' + headId + '">' + grupo.label + '</div>'
      + grupo.children.map(function (c) { return itemHtml(c, { sub: true }); }).join('');

    const r = btn.getBoundingClientRect();
    el.style.top = Math.round(r.top) + 'px';
    el.style.left = Math.round(n.getBoundingClientRect().right + 8) + 'px';
    document.body.appendChild(el);
    icons();

    btn.setAttribute('aria-expanded', 'true');
    flyoutFor = id;
    const first = el.querySelector('.cs-item');
    if (first) first.focus();
  }

  /* ---- menu do usuário ---- */
  function closeUserMenu() {
    const el = document.getElementById('cs-usermenu');
    if (el) el.remove();
    const n = nav();
    const btn = n && n.querySelector('.cs-user');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function openUserMenu(btn) {
    closeUserMenu();
    const el = document.createElement('div');
    el.id = 'cs-usermenu';
    el.setAttribute('role', 'menu');
    el.innerHTML = '<button type="button" class="cs-usermenu-item" role="menuitem">Logout</button>';
    const r = btn.getBoundingClientRect();
    el.style.left = Math.round(r.left) + 'px';
    el.style.bottom = Math.round(window.innerHeight - r.top + 4) + 'px';
    document.body.appendChild(el);
    btn.setAttribute('aria-expanded', 'true');
    const first = el.querySelector('.cs-usermenu-item');
    if (first) first.focus();
  }

  /* ---- nome do rodapé segue o avatar ----
     Quatro painéis reescrevem .sidebar .avatar de fora (textContent + title);
     o observer espelha o title no nome, sem tocar naqueles arquivos. */
  function watchAvatar(n) {
    const av = n.querySelector('.avatar');
    const nome = n.querySelector('.cs-user-name');
    if (!av || !nome || !window.MutationObserver) return;
    const sync = function () {
      const t = av.getAttribute('title');
      if (t && t !== nome.textContent) nome.textContent = t;
    };
    new MutationObserver(sync).observe(av, {
      attributes: true, attributeFilter: ['title'],
      childList: true, characterData: true, subtree: true,
    });
    sync();
  }

  function setUser(iniciais, nome) {
    const n = nav();
    if (!n) return;
    const av = n.querySelector('.avatar');
    const lb = n.querySelector('.cs-user-name');
    if (av) { av.textContent = iniciais; av.setAttribute('title', nome || iniciais); }
    if (lb) lb.textContent = nome || iniciais;
  }

  /* ---- listeners ---- */
  function mount() {
    const n = nav();
    if (!n || n.dataset.csMounted) return;
    n.dataset.csMounted = '1';

    n.addEventListener('click', function (e) {
      const tgl = e.target.closest('.cs-toggle');
      if (tgl) { toggle(); return; }

      const pai = e.target.closest('.cs-parent');
      if (pai) {
        e.preventDefault();
        const id = pai.getAttribute('data-cs-parent');
        if (collapsed) {
          if (flyoutFor === id) closeFlyout(); else openFlyout(pai, id);
        } else {
          manualOpen = pai.getAttribute('aria-expanded') !== 'true';
          pai.setAttribute('aria-expanded', manualOpen ? 'true' : 'false');
        }
        return;
      }

      const usr = e.target.closest('.cs-user');
      if (usr) {
        if (document.getElementById('cs-usermenu')) closeUserMenu(); else openUserMenu(usr);
        return;
      }

      const inerte = e.target.closest('.cs-item[aria-disabled="true"]');
      if (inerte) e.preventDefault();
    });

    // Tooltip só no rail retraído; o toggle mostra nos dois estados.
    n.addEventListener('mouseover', function (e) {
      const alvo = e.target.closest('.cs-toggle, .cs-user, .cs-item');
      if (!alvo || alvo.closest('.cs-sub')) return;
      if (alvo.classList.contains('cs-toggle')) {
        showTip(alvo, alvo.getAttribute('aria-label'));
      } else if (collapsed) {
        showTip(alvo, alvo.classList.contains('cs-user')
          ? 'Configurações do Usuário'
          : alvo.querySelector('.cs-label').textContent);
      }
    });
    n.addEventListener('mouseout', hideTip);
    n.addEventListener('focusout', hideTip);

    watchAvatar(n);
    syncClasses();
    syncAria();
  }

  /* Listeners globais: gerente.html troca o body depois do shell, então tudo
     aqui checa se a barra ainda existe. */
  document.addEventListener('mousedown', function (e) {
    if (!nav()) return;
    if (!e.target.closest('#cs-flyout') && !e.target.closest('.cs-parent')) closeFlyout();
    if (!e.target.closest('#cs-usermenu') && !e.target.closest('.cs-user')) closeUserMenu();
  });
  document.addEventListener('click', function (e) {
    if (!nav()) return;
    if (e.target.closest('#cs-flyout .cs-item')) { e.preventDefault(); closeFlyout(); }
    if (e.target.closest('.cs-usermenu-item')) closeUserMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !nav()) return;
    const id = flyoutFor;
    if (id) {
      closeFlyout();
      const btn = nav().querySelector('[data-cs-parent="' + id + '"]');
      if (btn) btn.focus();
    }
    closeUserMenu();
    hideTip();
  });
  // Âncora congelada: fechar é mais honesto que reposicionar errado.
  window.addEventListener('resize', function () {
    if (!nav()) return;
    closeFlyout(); closeUserMenu(); hideTip();
  });
  window.addEventListener('scroll', function () {
    if (!nav()) return;
    closeFlyout(); closeUserMenu(); hideTip();
  }, true);

  /* ---- CSS ---- */
  (function () {
    const style = document.createElement('style');
    style.textContent = `
  :root {
    --cockpit-sidebar-w: ${W}px;
    --cs-bg: #0F1727;
    --cs-fg: #A6A6A6;
    --cs-accent: rgba(255,255,255,0.07);
    --cs-accent-fg: #F9F9F9;
    --cs-primary: #F25461;
    --cs-border: rgba(255,255,255,0.08);
    --cs-ring: #0171E4;
    --cs-muted: #69727D;
    --cs-elevated: #1C2739;
  }
  .cockpit-sidebar, .cockpit-sidebar *, #cs-flyout, #cs-flyout *, #cs-usermenu, #cs-usermenu *, .cs-tip {
    font-family: 'Lato', system-ui, sans-serif;
  }
  .cs-hidden { display: none !important; }

  nav.cockpit-sidebar {
    position: fixed; top: 0; left: 0; z-index: 40;
    box-sizing: border-box;
    width: var(--cockpit-sidebar-w, ${W}px);
    height: 100vh;
    background: var(--cs-bg);
    /* inset: uma borda somaria 1px por fora da largura e invadiria o conteúdo. */
    box-shadow: inset -1px 0 0 var(--cs-border);
    display: flex; flex-direction: column; justify-content: space-between;
    overflow: hidden;
  }

  /* Header — logo e toggle caem no mesmo eixo x=32 dos ícones. */
  .cs-head { display: flex; align-items: center; gap: 12px; padding: 24px 16px 40px; }
  html.cs-collapsed .cockpit-sidebar .cs-head { flex-direction: column; align-items: flex-start; padding-bottom: 4px; }
  .cs-logo { display: flex; flex-shrink: 0; color: var(--cs-accent-fg); margin-left: 6px; }
  html.cs-collapsed .cockpit-sidebar .cs-logo { margin-top: 4px; }
  .cs-word { font-size: 1.2rem; font-weight: 700; color: #FFF; white-space: nowrap; opacity: 0; transition: opacity 250ms ease-out; }
  .cs-word span { color: var(--cs-primary); }
  html.cs-labels .cockpit-sidebar .cs-word { opacity: 1; }
  .cs-spacer { flex: 1; }
  html.cs-collapsed .cockpit-sidebar .cs-word,
  html.cs-collapsed .cockpit-sidebar .cs-spacer { display: none; }

  .cs-toggle {
    width: 28px; height: 28px; flex-shrink: 0; padding: 0;
    display: inline-flex; align-items: center; justify-content: center;
    border: none; background: none; cursor: pointer;
    border-radius: 8px; color: var(--cs-muted);
    transition: background-color 150ms ease-out, color 150ms ease-out;
  }
  .cs-toggle:hover { background: var(--cs-accent); color: var(--cs-accent-fg); }
  .cs-toggle:focus-visible { outline: 2px solid var(--cs-ring); outline-offset: -2px; }
  .cs-toggle svg { width: 16px; height: 16px; transition: transform 200ms ease-out; }
  html.cs-collapsed .cockpit-sidebar .cs-toggle { margin-left: 2px; }
  html.cs-collapsed .cockpit-sidebar .cs-toggle svg { transform: scaleX(-1); }

  .cs-modules {
    flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.16) transparent;
  }
  .cs-modules::-webkit-scrollbar { width: 6px; }
  .cs-modules::-webkit-scrollbar-track { background: transparent; }
  .cs-modules::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0); border-radius: 8px; }
  .cs-modules:hover::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.16); }
  .cs-modules::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.28); }

  /* Grupos não têm cabeçalho visível: o nome vive no aria-label, a separação é o filete. */
  .cs-group { list-style: none; margin: 0; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
  .cs-group:first-child { padding-top: 8px; }
  .cs-group:last-child { padding-bottom: 8px; }
  .cs-group:not(:last-child) { border-bottom: 1px solid var(--cs-border); }
  .cs-group > li, .cs-sub > li { display: block; }

  .cs-item {
    position: relative; box-sizing: border-box; width: 100%; min-width: 0; min-height: 32px;
    display: flex; justify-content: flex-start; align-items: flex-start; gap: 8px;
    padding: 8px 10px; border: none; background: transparent; border-radius: 8px;
    text-align: left; text-decoration: none; text-transform: none; cursor: pointer;
    color: var(--cs-fg); font-size: 14px;
    transition: background-color 150ms ease-out, color 150ms ease-out;
  }
  .cs-item.is-sub { min-height: 28px; }
  .cs-item[aria-disabled="true"] { cursor: default; }
  .cs-item:hover { background: var(--cs-accent); color: var(--cs-accent-fg); }
  .cs-item:hover .cs-ico { transform: scale(1.1) rotate(-6deg); }
  .cs-item:focus-visible { outline: 2px solid var(--cs-ring); outline-offset: -2px; }
  .cs-item.is-active { background: var(--cs-accent); color: var(--cs-accent-fg); }
  .cs-item.is-active > .cs-label { font-weight: 700; }
  .cs-item.is-active:not(.is-sub)::before {
    content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 16px; border-radius: 999px; background: var(--cs-primary);
  }
  .cs-ico { display: inline-flex; flex-shrink: 0; transition: transform 200ms ease-out; }
  .cs-item svg { width: 16px; height: 16px; color: inherit; flex-shrink: 0; margin-top: 2px; }

  /* Clamp de 2 linhas, não elipse: meia palavra não deixa decidir onde clicar. */
  .cs-label {
    font-size: 14px; line-height: 20px; font-weight: 400; color: inherit;
    overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden; text-align: left;
    flex: 1; opacity: 0; transition: opacity 250ms ease-out;
  }
  html.cs-labels .cockpit-sidebar .cs-label { opacity: 1; }
  html:not(.cs-labels) .cockpit-sidebar .cs-label { white-space: nowrap; }
  html.cs-collapsed .cockpit-sidebar .cs-label { flex: 0 0 0px; }

  .cs-chev { display: inline-flex; flex-shrink: 0; color: var(--cs-muted); opacity: 0; transition: transform 200ms ease-out, opacity 250ms ease-out; }
  html.cs-labels .cockpit-sidebar .cs-chev { opacity: 1; }
  .cs-parent[aria-expanded="true"] .cs-chev { transform: rotate(90deg); }
  html.cs-collapsed .cockpit-sidebar .cs-chev { display: none; }

  .cs-sub-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 200ms ease-out; }
  .cs-parent[aria-expanded="true"] + .cs-sub-wrap { grid-template-rows: 1fr; }
  .cs-sub-clip { overflow: hidden; min-height: 0; }
  .cs-sub {
    list-style: none; margin: 4px 0 0 14px; padding-left: 10px;
    border-left: 1px solid var(--cs-border);
    display: flex; flex-direction: column; gap: 4px;
    opacity: 0; transition: opacity 250ms ease-out;
  }
  html.cs-labels .cockpit-sidebar .cs-sub { opacity: 1; }
  html.cs-collapsed .cockpit-sidebar .cs-sub-wrap { display: none; }

  .cs-foot { flex-grow: 0; display: flex; align-items: center; padding: 8px 14px; border-top: 1px solid var(--cs-border); }
  .cs-user {
    width: 100%; min-height: 56px; display: flex; align-items: center; justify-content: flex-start;
    gap: 8px; padding: 8px 2px; border: none; background: none; cursor: pointer;
    border-radius: 8px; color: var(--cs-fg);
    transition: background-color 150ms ease-out, color 150ms ease-out;
  }
  .cs-user:hover { background: var(--cs-accent); color: var(--cs-accent-fg); }
  .cs-user:focus-visible { outline: 2px solid var(--cs-ring); outline-offset: -2px; }
  .cs-user-name { font-weight: 700; }
  /* O title do avatar é o canal por onde os painéis trocam o usuário; sem
     pointer-events o tooltip nativo brigaria com o .cs-tip. */
  nav.cockpit-sidebar .avatar {
    width: 32px; height: 32px; flex-shrink: 0; margin: 0; border: none; border-radius: 50%;
    background: linear-gradient(135deg, #f25461, #f97316);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 600; font-size: 12px; pointer-events: none;
  }

  /* Flyout e tooltip vivem no body: as regras de estado do <html> não os alcançam. */
  #cs-flyout {
    position: fixed; z-index: 90; min-width: 224px; padding-bottom: 6px;
    background: var(--cs-bg); border: 1px solid var(--cs-border); border-radius: 8px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,.5);
  }
  #cs-flyout .cs-fly-head {
    font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--cs-fg); padding: 8px 12px 4px;
  }
  #cs-flyout .cs-item { width: auto; margin: 2px 6px; }
  #cs-flyout .cs-label { opacity: 1; flex: 1; }

  #cs-usermenu {
    position: fixed; z-index: 95; min-width: 180px; padding: 4px;
    background: var(--cs-elevated); border: 1px solid var(--cs-border); border-radius: 8px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,.5);
  }
  .cs-usermenu-item {
    width: 100%; text-align: left; padding: 8px 12px; border: none; background: none;
    border-radius: 6px; color: var(--cs-accent-fg); font-size: 14px; cursor: pointer;
  }
  .cs-usermenu-item:hover { background: var(--cs-accent); }
  .cs-usermenu-item:focus-visible { outline: 2px solid var(--cs-ring); outline-offset: -2px; }

  .cs-tip {
    position: fixed; z-index: 96; max-width: 300px; white-space: nowrap; pointer-events: none;
    background: var(--cs-elevated); color: var(--cs-accent-fg);
    font-size: 12px; font-weight: 400; border-radius: 8px; padding: 6px 10px;
  }
  `;
    document.head.appendChild(style);
  })();

  ensureLato();
  collapsed = readPersisted();
  target = collapsed;
  applyWidth(widthFor(collapsed));
  syncClasses();

  window.CockpitSidebar = { markup: markup, mount: mount, setUser: setUser };
})();

/* ---- HTML Shell injection ---- */
function _buildShell() {
  const cfg = window.FLOW_CONFIG;
  document.body.innerHTML = `
${window.CockpitSidebar.markup()}

<div class="main">
  <div class="topbar">
    <div class="topbar-right">
      <div class="notif-btn" id="notif-toggle">
        <i data-lucide="bell" class="w-5 h-5" style="color: var(--text-secondary)"></i>
        <span class="dot" id="notif-dot"></span>
      </div>
      <div class="notif-panel hidden" id="notif-panel">
        <div style="padding: 14px 16px; border-bottom: 1px solid var(--border); font-weight: 600;">Notificações</div>
        <div id="notif-list"></div>
        <div style="border-top: 1px solid var(--border); background: #3f3f46; padding: 10px 16px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #fff; font-weight: 600; margin-bottom: 8px;">🛠 Controles do protótipo</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <button onclick="simularRespostaCliente()" style="text-align: left; font-size: 12px; color: var(--text-primary); background: #fff; border: 1px solid var(--border); padding: 7px 10px; border-radius: 6px; cursor: pointer;">↩︎ Simular resposta do cliente</button>
            <button onclick="resetDemo()" style="text-align: left; font-size: 12px; color: var(--text-primary); background: #fff; border: 1px solid var(--border); padding: 7px 10px; border-radius: 6px; cursor: pointer;">⟲ Resetar demo</button>
            <!-- Caminho a partir da RAIZ, não relativo: o app é servido na raiz e este shell
                 roda também em páginas dentro de subpasta (os labs), onde "index.html" caía
                 no index da subpasta (ou em 404) em vez do menu de protótipos.
                 A raiz é a porta das versões (v0 · v1 · v3) — e é pra lá que este
                 link vai, de QUALQUER tela: o mesmo shell roda dentro do v1 e do v3, então
                 mandar pro v0 jogaria quem está numa versão dentro de outra. -->
            <a href="/" style="text-align: left; font-size: 12px; color: var(--text-primary); background: #fff; border: 1px solid var(--border); padding: 7px 10px; border-radius: 6px; cursor: pointer; text-decoration: none; display: block;">← Voltar ao menu de protótipos</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex-1 p-8" id="screens-container">

    <!-- Home do operador: preenchida pelo módulo compartilhado (olMount) via renderHome -->
    <section class="screen" id="screen-home"></section>

    <section class="screen hidden" id="screen-task">
      <div class="container-wide">
        <div class="section-card" style="padding: 20px 28px;">
          <div class="flex items-center gap-3" style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;">
            <span class="cursor-pointer hover:text-rose-500" onclick="goHome()">← Voltar ao cockpit</span>
            <span>/</span>
            <span>Tarefa #<span id="task-id-label">—</span></span>
          </div>
          <div class="flex items-start gap-4" style="flex-wrap: wrap;">
            <div id="task-client-logo" style="display:none;">—</div>
            <div style="min-width: 0; flex: 1;">
              <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 4px;" id="task-type-label">—</h1>
              <div style="font-size: 13px;"><strong id="task-client-name" style="font-weight: 600; color: var(--text);">—</strong><span style="color: var(--text-tertiary);"> · </span><span style="color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;" id="task-client-cnpj">—</span></div>
              <div id="task-meta-strip" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:12px;color:var(--text-tertiary);"></div>
            </div>
          </div>
          <div style="border-top: 1px solid var(--border); margin: 12px 0;"></div>
          <div style="font-size: 13px; color: var(--text-secondary); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0;">
              <span><span id="task-solicitante-label">Solicitado por</span> <strong style="color: var(--text-primary); font-weight: 600;" id="task-solicitante">—</strong></span>
              <span id="task-solicitante-tags" style="display: inline-flex; gap: 4px;"></span>
              <span style="color: var(--text-tertiary);">·</span>
              <span id="task-timestamp" style="color: var(--text-tertiary);">—</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span>Atribuído a <strong style="color: var(--text-primary); font-weight: 600;" id="task-assignee">—</strong></span>
              <button class="btn-return-queue" onclick="openReturnQueueModal()"><i data-lucide="corner-up-left" class="w-4 h-4"></i>Devolver à fila</button>
            </div>
          </div>
        </div>
        <div class="section-card" style="padding: 20px 28px;">
          <div class="timeline-horizontal" id="task-timeline"></div>
        </div>
        <div class="section-card hidden" id="activity-block">
          <div class="section-title"><i data-lucide="message-square"></i>Conversa com o cliente</div>
          <div class="activity-messages" id="activity-messages"></div>
          <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end;">
            <button onclick="openAskClientModal()" style="font-size: 12.5px; color: var(--brand-pink); background: none; border: 1px solid var(--brand-pink); padding: 6px 14px; border-radius: 8px; cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>Responder ao cliente
            </button>
          </div>
        </div>
        <div class="section-card">
          <div class="section-title"><i data-lucide="file-text"></i>Dados da solicitação</div>
          <div id="form-collab-strip"></div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
            <div class="form-tabs" id="form-tabs"></div>
            <div id="form-edit-btn"></div>
          </div>
          <div id="form-content"></div>
        </div>
        <div class="section-card hidden" id="attachments-block">
          <div class="section-title"><i data-lucide="paperclip"></i>Anexos enviados pelo cliente<span id="attachments-count-badge" class="badge badge-neutral" style="margin-left: 8px; font-size: 10px;">0</span></div>
          <div class="flex flex-wrap gap-2" id="attachments-list"></div>
        </div>
        <div class="decision-card">
          <div class="decision-title">Validação — tem tudo que é necessário para processar?</div>
          <div class="decision-desc">Confira se os dados do formulário e os anexos do cliente estão completos e corretos para prosseguir com o processamento.</div>
          <div class="decision-btns">
            <button class="btn-decision-yes" onclick="aceitarTarefa()"><i data-lucide="check" class="w-4 h-4"></i>Sim, processar</button>
            <button class="btn-decision-no" onclick="openAskClientModal()"><i data-lucide="message-circle" class="w-4 h-4"></i>Não, pedir algo ao cliente</button>
          </div>
        </div>
      </div>
    </section>

    <section class="screen hidden" id="screen-execution">
      <div class="container-wide">
        <div class="section-card" style="padding: 20px 28px;">
          <div class="flex items-center gap-3" style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;">
            <span id="exec-bc-backs" style="display:contents;">
              <span class="cursor-pointer hover:text-rose-500" onclick="goHome()">← Voltar ao cockpit</span>
              <span>/</span>
              <span class="cursor-pointer hover:text-rose-500" onclick="voltarParaConferencia()">← Voltar para validação</span>
              <span>/</span>
            </span>
            <span>Processamento</span>
          </div>
          <div class="flex items-start gap-4" style="flex-wrap: wrap;">
            <div style="min-width: 0; flex: 1;">
              <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 4px;" id="exec-type-label">—</h1>
              <div style="font-size: 13px;"><strong id="exec-client-label" style="font-weight: 600; color: var(--text);">—</strong><span style="color: var(--text-tertiary);"> · </span><span style="color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;" id="exec-client-cnpj">—</span></div>
              <div id="exec-meta-strip" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:12px;color:var(--text-tertiary);"></div>
            </div>
          </div>
          <div style="border-top: 1px solid var(--border); margin: 12px 0;"></div>
          <div style="font-size: 13px; color: var(--text-secondary); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0;">
              <span><span id="exec-solicitante-label">Solicitado por</span> <strong style="color: var(--text-primary); font-weight: 600;" id="exec-solicitante">—</strong></span>
              <span id="exec-solicitante-tags" style="display: inline-flex; gap: 4px;"></span>
              <span style="color: var(--text-tertiary);">·</span>
              <span id="exec-timestamp" style="color: var(--text-tertiary);">—</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span>Atribuído a <strong style="color: var(--text-primary); font-weight: 600;" id="exec-assignee">—</strong></span>
              <button class="btn-return-queue" onclick="openReturnQueueModal()"><i data-lucide="corner-up-left" class="w-4 h-4"></i>Devolver à fila</button>
            </div>
          </div>
        </div>
        <div class="section-card" style="padding: 20px 28px;">
          <div class="timeline-horizontal" id="exec-timeline"></div>
        </div>
        <div class="section-card">
          <div class="section-title"><i data-lucide="list-checks"></i>Passos de execução</div>
          <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px;">Execute cada passo e marque como feito para avançar. Ao concluir o último, o cliente será notificado.</p>
          <div id="exec-steps"></div>
        </div>
        <div class="section-card" style="background: var(--surface-subtle);">
          <div class="flex items-start gap-3">
            <i data-lucide="info" class="w-5 h-5" style="color: var(--info); flex-shrink: 0; margin-top: 2px;"></i>
            <div style="font-size: 13px; color: var(--text-secondary);"><strong style="color: var(--text-primary);">Dica:</strong> as ações abrem em nova aba / simulam o arquivo. O botão <strong>Marcar como feito</strong> é o que avança o fluxo.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="screen hidden" id="screen-success">
      <div class="container-wide" style="max-width: 720px;">
        <div class="success-hero">
          <div class="icon-circle"><i data-lucide="check" style="width: 36px; height: 36px;"></i></div>
          <h1>Solicitação concluída</h1>
        </div>
        <div class="summary-list" id="success-summary"></div>
        <div class="flex justify-center gap-3">
          <button class="btn btn-primary btn-lg" onclick="goHome()"><i data-lucide="arrow-left" class="w-4 h-4"></i>Voltar às minhas tarefas</button>
        </div>
      </div>
    </section>

  </div>
</div>

<!-- Modal: Pedir info ao cliente -->
<div class="modal-backdrop hidden" id="modal-ask-client">
  <div class="modal-panel">
    <div class="modal-header">
      <div>
        <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500;">Comunicação</div>
        <div style="font-size: 16px; font-weight: 600; margin-top: 2px;">Pedir informação ao cliente</div>
      </div>
      <button class="btn btn-ghost" onclick="closeAskClientModal()" style="padding: 6px;"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <div class="modal-body">
      <div style="background: var(--surface-subtle); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; margin-bottom: 20px; font-size: 13px;" id="modal-task-context">—</div>
      <div class="field-label mb-2">Histórico da conversa</div>
      <div id="modal-history" style="max-height: 280px; overflow-y: auto; padding: 8px; background: var(--surface-subtle); border-radius: 10px; border: 1px solid var(--border); margin-bottom: 20px;"></div>
      <div class="field-label mb-2">Sua mensagem</div>
      <textarea id="modal-message-text" placeholder="Descreva o que você precisa do cliente…" style="width: 100%; min-height: 120px; padding: 12px; border: 1px solid var(--border-strong); border-radius: 10px; font-family: inherit; font-size: 13px; resize: vertical; outline: none;" onfocus="this.style.borderColor='var(--brand-pink)'" onblur="this.style.borderColor='var(--border-strong)'"></textarea>
      <input type="file" id="ask-client-file-input" style="display:none;" multiple onchange="handleAskClientFileSelect(event)" />
      <div id="ask-client-files" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;"></div>
      <div style="margin-top:12px;"><button type="button" onclick="document.getElementById('ask-client-file-input').click()" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;border:1px solid var(--border-strong);border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;color:var(--text-primary);"><i data-lucide="paperclip" style="width:14px;height:14px;"></i> Anexar documento (opcional)</button></div>
      <div class="mt-4 p-3" style="background: var(--warning-soft); border-radius: 8px; font-size: 12px; color: var(--warning); display: flex; gap: 8px; align-items: flex-start;">
        <i data-lucide="alert-triangle" class="w-4 h-4" style="flex-shrink: 0; margin-top: 1px;"></i>
        <div>Ao enviar, a tarefa será <strong>colocada em espera</strong> aguardando resposta do cliente.</div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeAskClientModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="enviarPendenciaCliente()"><i data-lucide="send" class="w-4 h-4"></i>Enviar e colocar em espera</button>
    </div>
  </div>
</div>

<!-- Modal: Drawer -->
<div class="modal-backdrop hidden" id="modal-drawer">
  <div class="modal-panel" style="max-width: 620px;">
    <div class="modal-header">
      <div>
        <div style="font-size: 16px; font-weight: 600;" id="drawer-title">—</div>
        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;" id="drawer-subtitle">—</div>
      </div>
      <button class="btn btn-ghost" onclick="closeDrawer()" style="padding: 6px;"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <div class="modal-body" id="drawer-body"></div>
  </div>
</div>

<!-- Modal: Confirmar finalização -->
<div class="modal-backdrop hidden" id="modal-confirm-finish">
  <div class="modal-panel" style="max-width: 520px;">
    <div class="modal-header">
      <div>
        <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500;">Confirmação</div>
        <div style="font-size: 16px; font-weight: 600; margin-top: 2px;">Finalizar solicitação</div>
      </div>
      <button class="btn btn-ghost" onclick="closeConfirmFinish()" style="padding: 6px;"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <div class="modal-body">
      <div style="display: flex; gap: 14px; align-items: flex-start; margin-bottom: 18px;">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--success-soft); color: var(--success); display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i data-lucide="check-circle-2" class="w-6 h-6"></i></div>
        <div>
          <div style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">Você concluiu todas as etapas?</div>
          <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.55;" id="confirm-finish-detail">Ao confirmar, a tarefa será marcada como finalizada no Cockpit.</div>
        </div>
      </div>
      <div style="background: var(--info-soft); border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px; display: flex; gap: 10px; align-items: flex-start;">
        <i data-lucide="bell" class="w-4 h-4" style="color: var(--info); flex-shrink: 0; margin-top: 2px;"></i>
        <div style="font-size: 13px; color: #1e40af; line-height: 1.5;"><strong>O cliente será notificado</strong> automaticamente pelo HUB do empreendedor.</div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeConfirmFinish()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmarFinalizacao()"><i data-lucide="check" class="w-4 h-4"></i>Confirmar e notificar cliente</button>
    </div>
  </div>
</div>

<!-- Modal: Devolver tarefa à fila -->
<div class="modal-backdrop hidden" id="modal-return-queue" onclick="closeReturnQueueModal(event)">
  <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="return-queue-title" onclick="event.stopPropagation()" style="max-width: 600px;">
    <div class="modal-header">
      <div>
        <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500;">Atribuição</div>
        <div id="return-queue-title" style="font-size: 16px; font-weight: 600; margin-top: 2px;">Devolver tarefa à fila?</div>
      </div>
      <button class="btn btn-ghost" onclick="closeReturnQueueModal()" style="padding: 6px;" aria-label="Fechar"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <div class="modal-body">
      <div class="from-to-block">
        <div class="ft-side">
          <div class="ft-label">De</div>
          <div class="ft-card">
            <div class="av" id="return-queue-from-av">—</div>
            <div class="info">
              <div class="name" id="return-queue-from-name">—</div>
              <div class="role">Responsável atual</div>
            </div>
          </div>
        </div>
        <div class="ft-arrow"><i data-lucide="arrow-right" class="w-5 h-5"></i></div>
        <div class="ft-side">
          <div class="ft-label">Para</div>
          <div class="ft-card">
            <div class="av inbox"><i data-lucide="inbox" class="w-4 h-4"></i></div>
            <div class="info">
              <div class="name">Na fila</div>
              <div class="role">Sem responsável</div>
            </div>
          </div>
        </div>
      </div>
      <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.55; margin: 16px 0 0;">Ela perde a atribuição e fica disponível pra qualquer operador pegar.</p>
      <div style="background: var(--info-soft); border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start; margin-top: 14px;">
        <i data-lucide="shield-check" class="w-4 h-4" style="color: var(--info); flex-shrink: 0; margin-top: 2px;"></i>
        <div id="return-queue-keep-text" style="font-size: 13px; color: #1e40af; line-height: 1.5;">Tudo que já foi salvo e editado, além das mensagens trocadas com o cliente, fica do jeito que está — nada é desfeito.</div>
      </div>
      <div id="return-queue-unsaved" class="hidden" style="background: var(--warning-soft); border: 1px solid #f59e0b; border-radius: 10px; padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start; margin-top: 12px;">
        <i data-lucide="alert-triangle" class="w-4 h-4" style="color: var(--warning); flex-shrink: 0; margin-top: 2px;"></i>
        <div style="font-size: 13px; color: var(--warning); line-height: 1.5;"><strong>Há alterações não salvas no formulário.</strong> Elas <strong>não</strong> serão mantidas — é preciso salvar antes para preservá-las.</div>
      </div>
      <div style="margin-top: 18px; display: flex; flex-direction: column; gap: 12px;">
        <div class="ef-field">
          <div class="ef-label">Motivo da devolução</div>
          <select class="ef-select" id="return-queue-reason" onchange="onReturnReasonChange(this)">
            <option value="">— Selecione —</option>
            <option value="Peguei por engano">Peguei por engano</option>
            <option value="Fora da minha alçada">Fora da minha alçada</option>
            <option value="Redistribuição">Redistribuição</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        <div class="ef-field">
          <div class="ef-label" id="return-queue-detail-label">Observações (opcional)</div>
          <textarea class="ef-textarea" id="return-queue-reason-detail" rows="2" style="resize: none; overflow: hidden;" oninput="autoGrowField(this); updateReturnConfirmState()" placeholder="Ex.: o que já foi feito nesta tarefa até aqui, pra quem pegar continuar"></textarea>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeReturnQueueModal()">Cancelar</button>
      <button class="btn btn-danger-solid" id="return-queue-confirm" onclick="devolverParaFila()" disabled><i data-lucide="corner-up-left" class="w-4 h-4"></i>Devolver à fila</button>
    </div>
  </div>
</div>
`;
}

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */
let state = {};
const OPERATOR_NAME = 'Daniele Ribeiro';

function _initState() {
  const cfg = window.FLOW_CONFIG;
  const fresh = cfg.getInitialState();
  state = {
    currentScreen: 'home',
    currentTaskId: null,
    active: null,
    queue: fresh.queue || [],
    stationed: fresh.stationed || [],
    completed: fresh.completed || [],
    messages: fresh.messages || {},
    notifications: fresh.notifications || [],
    _execProgress: {},
    _execStepExpanded: {},
    _gdocsFiles: {},
    _askClientFiles: [],
    _gdocsSkipped: {},
    _editMode: {},
    _editDraft: {},
    _editLog: {},
  };
}

/* ============================================================
   HELPERS
   ============================================================ */
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
function refreshIcons() { if (window.lucide) lucide.createIcons(); }

function slaBadge(status, sla) {
  if (status === 'risk') return `<span class="badge badge-warning"><i data-lucide="alert-triangle" class="w-3 h-3"></i> SLA em risco · ${sla}</span>`;
  if (status === 'overdue') return `<span class="badge badge-danger"><i data-lucide="alert-octagon" class="w-3 h-3"></i> SLA estourado</span>`;
  return `<span class="badge badge-neutral"><i data-lucide="clock" class="w-3 h-3"></i> ${sla}</span>`;
}

function deadlineBadge(status, deadline) {
  if (status === 'overdue') return `<span class="badge badge-danger"><i data-lucide="timer-off" class="w-3 h-3"></i> prazo ${deadline}</span>`;
  if (status === 'risk')    return `<span class="badge badge-warning"><i data-lucide="timer" class="w-3 h-3"></i> prazo ${deadline}</span>`;
  return `<span class="badge badge-info"><i data-lucide="timer" class="w-3 h-3"></i> prazo ${deadline}</span>`;
}

function getTaskById(id) {
  if (state.active && state.active.id === id) return state.active;
  return state.queue.find(t => t.id === id) ||
         state.stationed.find(t => t.id === id) ||
         state.completed.find(t => t.id === id);
}

function slaToMinutes(sla) {
  if (!sla) return Infinity;
  let total = 0;
  const hMatch = sla.match(/(\d+)\s*h/i);
  const mMatch = sla.match(/(\d+)\s*min/i);
  if (hMatch) total += parseInt(hMatch[1], 10) * 60;
  if (mMatch) total += parseInt(mMatch[1], 10);
  return total || Infinity;
}

function computeDeadline(receivedAt, sla) {
  if (!receivedAt || !sla) return '—';
  const [h, m] = receivedAt.split(':').map(Number);
  const mins = slaToMinutes(sla);
  if (!isFinite(mins)) return '—';
  const total = h * 60 + m + mins;
  const dh = Math.floor(total / 60) % 24;
  const dm = total % 60;
  return `${String(dh).padStart(2, '0')}:${String(dm).padStart(2, '0')}`;
}

function sortQueueBySLA() {
  state.queue.sort((a, b) => slaToMinutes(a.sla) - slaToMinutes(b.sla));
}

// Ordenação padrão das listas (regra fechada): por data de recebimento, mais nova
// no topo. createdDaysAgo ascendente (0 = hoje = mais recente); desempate pela hora
// de recebimento (receivedAt) mais tarde primeiro. Fonte única — usada pela fila do
// operador e pelo painel de acompanhamento. Sem pins (nada forçado no topo).
function _receivedMinutes(t) {
  const m = String(t.receivedAt || '').match(/(\d{1,2}):(\d{2})/);
  return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : 0;
}
function sortByRecebimento(list) {
  return list.sort((a, b) =>
    (a.createdDaysAgo || 0) - (b.createdDaysAgo || 0) || _receivedMinutes(b) - _receivedMinutes(a));
}

function getTypeMeta(typeCode) {
  const meta = window.FLOW_CONFIG.TYPE_METADATA;
  return (meta && meta[typeCode]) || { icon: 'file-text', label: 'Solicitação', desc: '—', color: '#64748b' };
}

/* ---- Helpers da tabela densa V1 (compartilhados com lista-operador / gerente) ---- */
const TYPE_ICONS = {
  admissao_clt:          'user-plus',
  admissao_rpa:          'briefcase',
  admissao_estagiario:   'graduation-cap',
  admissao_rpa_planilha: 'clipboard-list',
  ferias:                'calendar-check',
  ferias_aviso_previo:   'calendar-check',
  ferias_calculo:        'calculator',
  rescisao:              'receipt',
  rescisao_aviso_previo: 'calendar-x',
  rescisao_calculo:      'receipt',
  afastamento_empregado: 'user-x',
  apontamentos_folha:    'file-spreadsheet',
  solicitacao_geral:     'inbox',
};
function getTypeIcon(typeCode) { return TYPE_ICONS[typeCode] || 'file-text'; }

function esc(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// "Hoje" do protótipo (data fixa pra demos consistentes)
const MOCK_TODAY = { dia: 14, mes: 5, ano: 2026 };

function _pad2(n) { return String(n).padStart(2, '0'); }

function computePrazo(t) {
  const [rh, rm] = (t.receivedAt || '09:00').split(':').map(Number);
  const slaMin = slaToMinutes(t.sla) || 0;
  let dia = MOCK_TODAY.dia, mes = MOCK_TODAY.mes, ano = MOCK_TODAY.ano;
  let totalMin = rh * 60 + rm + slaMin;
  if (totalMin >= 24 * 60) { totalMin -= 24 * 60; dia += 1; }
  if (t.slaStatus === 'overdue') { dia -= 1; if (dia < 1) { dia = 30; mes -= 1; } }
  const dh = Math.floor(totalMin / 60) % 24;
  const dm = totalMin % 60;
  return { dateStr: `${_pad2(dia)}/${_pad2(mes)}/${ano}`, timeStr: `${_pad2(dh)}:${_pad2(dm)}`, status: t.slaStatus || 'normal' };
}

// Data dd/mm/aa a partir de "quantos dias atrás", relativo a MOCK_TODAY. Rollback
// simples de mês (protótipo: no máx. 1 dia atrás nos mocks).
function _dmyFromDaysAgo(daysAgo) {
  let dia = MOCK_TODAY.dia - (daysAgo || 0), mes = MOCK_TODAY.mes, ano = MOCK_TODAY.ano;
  while (dia < 1) { mes -= 1; if (mes < 1) { mes = 12; ano -= 1; } dia += 30; }
  return `${_pad2(dia)}/${_pad2(mes)}/${String(ano).slice(-2)}`;
}
// Header: "Solicitado em dd/mm/aa hh:mm" (data derivada de createdDaysAgo + receivedAt).
function solicitadoEmLabel(t) {
  return `${_dmyFromDaysAgo(t.createdDaysAgo)} ${t.receivedAt || ''}`.trim();
}
// Header (concluída): "Concluído em dd/mm/aa hh:mm" (data de finishedDaysAgo, hora extraída de finishedAt).
function concluidoEmLabel(t) {
  const hora = String(t.finishedAt || '').match(/\d{1,2}:\d{2}/);
  return `${_dmyFromDaysAgo(t.finishedDaysAgo)}${hora ? ' ' + hora[0] : ''}`;
}
// Célula "Solicitado em" das TABELAS de lista: data em cima, horário embaixo (2 linhas,
// coluna estreita). Fonte única — fila do operador e painel de acompanhamento.
function solicitadoEmCellHtml(t) {
  const data = _dmyFromDaysAgo(t.createdDaysAgo);
  const hora = t.receivedAt || '';
  return `<div class="prazo-cell"><div class="prazo-when">${esc(data)}</div>${hora ? `<div class="prazo-when" style="color:var(--text-secondary);font-weight:400;">${esc(hora)}</div>` : ''}</div>`;
}

/* ============================================================
   Seletor de período (presets + calendário de range) — MÓDULO
   COMPARTILHADO. Fonte única: usado pelo painel de acompanhamento e
   pela fila do operador (filtro "Solicitado em"). Mudou aqui, muda nos
   dois. Cada tela cria uma instância (ppCreate) com seu estado/callback.
   "Hoje" gira em torno do MOCK_TODAY do protótipo.
   ============================================================ */
const PP_MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const PP_DOWS = ['S','T','Q','Q','S','S','D']; // semana começa na segunda
function ppToday() { return new Date(MOCK_TODAY.ano, MOCK_TODAY.mes - 1, MOCK_TODAY.dia); }
function _ppStrip(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function _ppAddDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function _ppDaysAgo(n) { return _ppAddDays(ppToday(), -(n || 0)); }
function _ppSameDay(a, b) { return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function _ppFmt(d) { return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0'); }
const PP_PRESETS = [
  { id:'hoje', label:'Hoje', range:() => ({ from:ppToday(), to:ppToday() }) },
  { id:'ontem', label:'Ontem', range:() => ({ from:_ppDaysAgo(1), to:_ppDaysAgo(1) }) },
  { id:'7d', label:'Últimos 7 dias', range:() => ({ from:_ppDaysAgo(6), to:ppToday() }) },
  { id:'30d', label:'Últimos 30 dias', range:() => ({ from:_ppDaysAgo(29), to:ppToday() }) },
  { id:'mes', label:'Este mês', range:() => ({ from:new Date(MOCK_TODAY.ano, MOCK_TODAY.mes - 1, 1), to:ppToday() }) },
  { id:'mespassado', label:'Mês passado', range:() => ({ from:new Date(MOCK_TODAY.ano, MOCK_TODAY.mes - 2, 1), to:new Date(MOCK_TODAY.ano, MOCK_TODAY.mes - 1, 0) }) },
];

const _pp = {}; // registry: id -> instância
function ppCreate(id, cfg) {
  const init = cfg.initialRange || null;
  const base = (init ? init.to : ppToday());
  _pp[id] = {
    mount: cfg.mount, range: init, calMonth: new Date(base.getFullYear(), base.getMonth(), 1),
    calPick: null, open: false, onChange: cfg.onChange || function () {}, onOpen: cfg.onOpen || null,
    emptyLabel: cfg.emptyLabel || 'Período', allowEmpty: cfg.allowEmpty !== false,
  };
  return _pp[id];
}
function ppGetRange(id) { return _pp[id] ? _pp[id].range : null; }
function ppLabel(inst) {
  const r = inst.range;
  if (!r) return inst.emptyLabel;
  for (const p of PP_PRESETS) { const pr = p.range(); if (_ppSameDay(pr.from, r.from) && _ppSameDay(pr.to, r.to)) return p.label; }
  return _ppSameDay(r.from, r.to) ? _ppFmt(r.from) : `${_ppFmt(r.from)} – ${_ppFmt(r.to)}`;
}
function ppRender(id) {
  const inst = _pp[id]; if (!inst) return;
  const el = document.getElementById(inst.mount); if (!el) return;
  // "Ver todos" (só quando o filtro pode ficar vazio, ex.: fila) — 1º da lista e
  // destacado quando não há período aplicado; clicar volta a mostrar tudo.
  const verTodos = inst.allowEmpty ? `<button class="pp-preset ${!inst.range ? 'active' : ''}" onclick="event.stopPropagation(); ppClear('${id}')">Ver todos</button>` : '';
  const presets = PP_PRESETS.map(p => {
    const pr = p.range();
    const active = inst.range && !inst.calPick && _ppSameDay(pr.from, inst.range.from) && _ppSameDay(pr.to, inst.range.to);
    return `<button class="pp-preset ${active ? 'active' : ''}" onclick="event.stopPropagation(); ppApplyPreset('${id}','${p.id}')">${p.label}</button>`;
  }).join('');
  const pop = inst.open
    ? `<div class="pp-pop"><div class="pp-presets">${verTodos}${presets}</div><div class="pp-cal">${_ppCalHtml(id)}<div class="pp-cal-hint">${inst.calPick ? 'Escolha a data final' : 'Clique pra escolher um intervalo'}</div></div></div>`
    : '';
  el.innerHTML = `<button class="pp-btn ${inst.open ? 'open' : ''} ${inst.range ? 'has-val' : ''}" onclick="event.stopPropagation(); ppToggle('${id}')"><i data-lucide="calendar" style="width:15px;height:15px;"></i><span>${esc(ppLabel(inst))}</span><i data-lucide="chevron-down" style="width:15px;height:15px;"></i></button>${pop}`;
  refreshIcons();
}
function _ppCalHtml(id) {
  const inst = _pp[id], m = inst.calMonth, y = m.getFullYear(), mo = m.getMonth();
  const startDow = (new Date(y, mo, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(y, mo + 1, 0).getDate();
  const from = inst.range ? _ppStrip(inst.range.from) : null, to = inst.range ? _ppStrip(inst.range.to) : null, pick = inst.calPick ? _ppStrip(inst.calPick) : null;
  let cells = '';
  for (let i = 0; i < startDow; i++) cells += `<div class="pp-cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = new Date(y, mo, d); let cls = '';
    if (pick) { if (_ppSameDay(ds, pick)) cls = 'picked'; }
    else if (from && to) { if (ds >= from && ds <= to) cls = 'in-range'; if (_ppSameDay(ds, from)) cls += ' range-start'; if (_ppSameDay(ds, to)) cls += ' range-end'; }
    if (_ppSameDay(ds, ppToday())) cls += ' today';
    cells += `<div class="pp-cal-day ${cls}" onclick="event.stopPropagation(); ppCalPick('${id}',${y},${mo},${d})">${d}</div>`;
  }
  return `<div class="pp-cal-head"><button onclick="event.stopPropagation(); ppCalNav('${id}',-1)"><i data-lucide="chevron-left" style="width:16px;height:16px;"></i></button><span>${PP_MONTHS[mo]} ${y}</span><button onclick="event.stopPropagation(); ppCalNav('${id}',1)"><i data-lucide="chevron-right" style="width:16px;height:16px;"></i></button></div><div class="pp-cal-grid">${PP_DOWS.map(d => `<div class="pp-cal-dow">${d}</div>`).join('')}${cells}</div>`;
}
function ppToggle(id) {
  const inst = _pp[id]; if (!inst) return;
  inst.open = !inst.open; inst.calPick = null;
  if (inst.open) { const b = inst.range ? inst.range.to : ppToday(); inst.calMonth = new Date(b.getFullYear(), b.getMonth(), 1); if (inst.onOpen) inst.onOpen(); }
  ppRender(id);
}
function ppApplyPreset(id, pid) {
  const inst = _pp[id], p = PP_PRESETS.find(x => x.id === pid); if (!inst || !p) return;
  inst.range = p.range(); inst.calPick = null; inst.open = false; inst.onChange(); ppRender(id);
}
function ppClear(id) {
  const inst = _pp[id]; if (!inst) return;
  inst.range = null; inst.calPick = null; inst.open = false; inst.onChange(); ppRender(id);
}
function ppCalNav(id, delta) {
  const inst = _pp[id]; if (!inst) return;
  inst.calMonth = new Date(inst.calMonth.getFullYear(), inst.calMonth.getMonth() + delta, 1); ppRender(id);
}
function ppCalPick(id, y, mo, d) {
  const inst = _pp[id]; if (!inst) return;
  const date = new Date(y, mo, d);
  if (!inst.calPick) { inst.calPick = date; ppRender(id); return; }
  let from = inst.calPick, to = date; if (to < from) { const tmp = from; from = to; to = tmp; }
  inst.range = { from, to }; inst.calPick = null; inst.open = false; inst.onChange(); ppRender(id);
}
function ppCloseIfOutside(id, target, selector) {
  const inst = _pp[id];
  if (inst && inst.open && !target.closest(selector)) { inst.open = false; inst.calPick = null; ppRender(id); }
}
// Filtro: a data de recebimento da tarefa (createdDaysAgo) cai no range da instância?
function ppInRange(id, t) {
  const r = ppGetRange(id); if (!r) return true;
  const d = _ppStrip(_ppDaysAgo(t.createdDaysAgo));
  return d >= _ppStrip(r.from) && d <= _ppStrip(r.to);
}

function prazoCellHtml(t) {
  if (t.status === 'completed') return `<div class="prazo-cell"><div class="prazo-when" style="color:var(--success);font-weight:600;">Entregue</div>${t.finishedAt?`<div class="client-cnpj">${esc(t.finishedAt)}</div>`:''}</div>`;
  if (t.status === 'cancelled') return `<div class="prazo-cell"><div class="prazo-when" style="color:var(--danger);font-weight:600;">Cancelada</div>${t.cancelledAt?`<div class="client-cnpj">${esc(t.cancelledAt)}</div>`:''}</div>`;
  const p = computePrazo(t);
  let tag = '';
  if (p.status === 'risk') {
    tag = `<span class="prazo-tag risk"><i data-lucide="alert-triangle" class="w-3 h-3"></i>Em risco</span>`;
  } else if (p.status === 'overdue') {
    tag = `<span class="prazo-tag overdue"><i data-lucide="alert-octagon" class="w-3 h-3"></i>Estourado</span>`;
  }
  const whenCls = p.status === 'overdue' ? 'prazo-when overdue' : 'prazo-when';
  return `<div class="prazo-cell"><div class="${whenCls}">${p.dateStr}<span class="sep">·</span>${p.timeStr}</div>${tag}</div>`;
}

// ── ERP operado + Origem: FONTE ÚNICA pra TODOS os protótipos ───────────────
// São dados POR CLIENTE (não por tarefa). Os protótipos são mocks, então
// simulamos com valores REAIS do Cockpit: ERP de silver_customers_customer.operations_erp
// e origem de silver_customers_origin.name.
// resolveClientOps(): se a tarefa já traz erpOperado/origem (clientes curados da
// lista), usa esses; senão gera um par real ESTÁVEL por CNPJ a partir dos pools.
// Assim qualquer protótipo — atual ou novo — já mostra dado coerente sem editar
// tarefa por tarefa. Mudou aqui (pools), mudou em todos os protótipos.
const ERP_POOL = ['DOMINIO_141935','DOMINIO_141935','DOMINIO_111057','DOMINIO_85223','DOMINIO_115398','DOMINIO_143257','DOMINIO_95072','DOMINIO_165133','DOMINIO_178895','OUTROS_ERP_PARCEIRO','TOTVS_PROPRIO','NA'];
const ORIGEM_POOL = ['ContJet','Efforts','Partwork','BR Experts','BHub','CTZ','São Lucas','Quality','Accord','Carnevale','SERAC','Valor'];
// Clientes curados (por CNPJ) — garante que o MESMO cliente mostre o MESMO ERP/origem
// em qualquer protótipo (lista, fluxos…). Licença 141935 repetida = mesmo login.
const CLIENT_OPS_OVERRIDE = {
  '18452771000109': { erpOperado: 'DOMINIO_141935',     origem: 'ContJet' },    // Padaria Bom Dia ME
  '40221099000144': { erpOperado: 'DOMINIO_111057',     origem: 'Efforts' },    // Tech Studio Criativo
  '12998301000122': { erpOperado: 'DOMINIO_141935',     origem: 'ContJet' },    // Mercearia Central
  '07119554000187': { erpOperado: 'DOMINIO_143257',     origem: 'Partwork' },   // Construtora Solo Firme
  '23880041000112': { erpOperado: 'DOMINIO_115398',     origem: 'BR Experts' }, // Restaurante Bella Vista
  '55401778000150': { erpOperado: 'DOMINIO_141935',     origem: 'ContJet' },    // Logística Express
  '60118220000109': { erpOperado: 'OUTROS_ERP_PARCEIRO',origem: 'Quality' },    // Doce Lar Confeitaria
  '88553107000167': { erpOperado: 'DOMINIO_85223',      origem: 'BHub' },       // Auto Center Roda Solta
  '15220881000130': { erpOperado: 'DOMINIO_95072',      origem: 'CTZ' },        // Café da Esquina
  '33011997000155': { erpOperado: 'DOMINIO_165133',     origem: 'São Lucas' },  // Salão Beleza Pura
  '21448770000115': { erpOperado: 'NA',                 origem: 'BHub' },       // Padaria São Pedro (ERP vazio → "-")
  '07882115000109': { erpOperado: 'TOTVS_PROPRIO',      origem: 'Efforts' },    // Indústria Alfa
};
function cnpjDigits(c) { return (c || '').replace(/\D/g, ''); }
function resolveClientOps(task) {
  const d = cnpjDigits(task && task.cnpj);
  if (CLIENT_OPS_OVERRIDE[d]) return CLIENT_OPS_OVERRIDE[d];
  if (task && (task.erpOperado || task.origem)) {
    return { erpOperado: task.erpOperado || '', origem: task.origem || '' };
  }
  let h = 0; for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) >>> 0;
  return { erpOperado: ERP_POOL[h % ERP_POOL.length], origem: ORIGEM_POOL[Math.floor(h / 7) % ORIGEM_POOL.length] };
}

// Deixa o ERP operado legível, no MESMO texto que o Cockpit mostra. O valor cru
// vem do Cockpit (cockpit.silver_customers_customer.operations_erp), ex.:
// "DOMINIO_141935" → "Domínio - Licença 141935". Vazio/NA → "-".
// A licença (nº) é o eixo de agrupamento: mesma licença Domínio = mesmo login.
function formatErp(raw) {
  if (!raw || raw === 'NA' || raw === 'PENDENTE_TOMBAMENTO' || raw === 'NAO_TOMBADO_CONTRATO_ENCERRADO') return '-';
  const m = raw.match(/^DOMINIO_(\d+)$/);
  if (m) return 'Domínio - Licença ' + m[1];
  const map = {
    DOMINIO_PARCEIRO: 'Domínio - Parceiro',
    DOMINIO_FRANQUEADO: 'Domínio - Franqueado',
    OUTROS_ERP_PARCEIRO: "Outros ERP's do Parceiro",
    TOTVS_PROPRIO: 'TOTVS Próprio',
    BPO_FINANCEIRO_SEM_ERP: 'BPO Financeiro (sem ERP)',
    SENIOR: 'Senior',
  };
  return map[raw] || raw;
}

// ERP operado e Origem, no padrão de texto do Cockpit (rótulo neutro + valor em
// destaque). Reaproveitado na lista e no header da tarefa. ERP sempre aparece
// (mostra "-" quando não há), igual ao Cockpit.
function domMetaParts(t) {
  const ops = resolveClientOps(t);
  // ERP e Origem SEMPRE aparecem; vazio vira "-" (igual ao Cockpit).
  const erp = `<span class="dom-meta"><span class="dom-k">ERP operado:</span> <span class="dom-v">${esc(formatErp(ops.erpOperado))}</span></span>`;
  const origem = `<span class="dom-meta"><span class="dom-k">Origem:</span> <span class="dom-v">${esc(ops.origem || '-')}</span></span>`;
  return { erp, origem };
}

// Colaborador da solicitação: na tarefa (lista) ou no formData (fluxos).
// Só aparece em processos que têm o campo de EMPREGADO (nome + CPF no início do
// form): admissão CLT/estagiário, férias, rescisão, afastamento. Ficam de fora:
// RPA (é prestador, não empregado), apontamentos em folha (vários, sem nome único)
// e solicitação geral (sem vínculo a 1 colaborador). Ver handoff colaborador-origem-erp.md.
const TIPOS_SEM_COLABORADOR = ['admissao_rpa', 'admissao_rpa_planilha', 'apontamentos_folha', 'solicitacao_geral'];
function taskColaborador(t) {
  if (!t || TIPOS_SEM_COLABORADOR.includes(t.typeCode)) return '';
  return t.colaborador || (t.formData && t.formData.colaborador && t.formData.colaborador.nome) || '';
}

function statePillHtml(t, opts) {
  opts = opts || {};
  // Concluída / Cancelada não aparecem na fila, mas aparecem no painel de
  // acompanhamento (mesma fonte de linha). Additivo — não muda a fila.
  if (t.status === 'completed') return `<span class="state-pill" style="color:var(--success);border-color:var(--success);"><i data-lucide="check-circle-2" class="w-3 h-3"></i>Concluída</span>`;
  if (t.status === 'cancelled') return `<span class="state-pill" style="color:var(--danger);border-color:var(--danger);"><i data-lucide="x-circle" class="w-3 h-3"></i>Cancelada</span>`;
  let cls, icon, label;
  // Tarefa cujo cliente já respondeu volta a ser uma atribuída normal: exibe
  // "Em execução" como qualquer ativa (COCKPIT-959). O sinal de que o cliente
  // respondeu deixa de ser estado e passa pra tarja dentro da tarefa / bolinha.
  if (t.status === 'processing') { cls = 'em-processamento'; icon = 'refresh-cw'; label = 'Em processamento'; }
  else if (t.status === 'active' || (t.status === 'stationed' && t.clientResponded)) { cls = 'em-execucao'; icon = 'play-circle'; label = 'Em execução'; }
  else if (t.status === 'stationed') { cls = 'em-espera'; icon = 'pause-circle'; label = 'Em espera'; }
  else if (opts.isNext) { cls = 'proxima'; icon = 'play-circle'; label = 'Próxima'; }
  else { cls = 'na-fila'; icon = 'list'; label = 'Na fila'; }
  return `<span class="state-pill ${cls}"><i data-lucide="${icon}" class="w-3 h-3"></i>${label}</span>`;
}

function _taskTableHead() {
  return `
    <div class="lo-table-head">
      <div></div>
      <div class="lo-dot-cell"></div>
      <div class="h-cell">Cliente</div>
      <div class="h-cell">Processo</div>
      <div class="h-cell">Estado</div>
      <div class="h-cell">Solicitado em</div>
      <div></div>
    </div>
  `;
}

function _renderTaskRow(t, opts) {
  opts = opts || {};
  const isNext = !!opts.isNext;
  const clickable = !!opts.clickable;
  const withEye = !!opts.withEye;
  const onClick = opts.onClick || '';

  let cls = 'lo-row';
  if (clickable) cls += ' clickable';
  if (t.status === 'active' || (t.status === 'stationed' && t.clientResponded)) cls += ' execucao';
  else if (t.status === 'stationed') cls += ' stationed-row';
  else if (isNext) cls += ' next-up';

  const eyeAction = opts.eyeClick || onClick;
  const eyeBtn = withEye && eyeAction
    ? `<button class="icon-btn" title="Ver detalhes" onclick="event.stopPropagation(); ${eyeAction}"><i data-lucide="eye" class="w-3.5 h-3.5"></i></button>`
    : '';

  const onClickAttr = clickable && onClick ? ` onclick="${onClick}"` : '';

  return `
    <div class="${cls}"${onClickAttr}>
      <div class="type-icon" title="${esc(t.type || '')}"><i data-lucide="${getTypeIcon(t.typeCode)}" class="w-4 h-4"></i></div>
      <div class="lo-dot-cell">${(t.status === 'stationed' && t.clientResponded) ? '<span class="update-dot" title="Cliente respondeu — você ainda não abriu"></span>' : ''}</div>
      <div class="lo-solic">
        <span class="client-name">${esc(t.clientName || '')}</span>
        ${(() => { const m = domMetaParts(t); return `<span style="display:flex;flex-wrap:wrap;align-items:center;gap:0 6px;"><span class="client-cnpj">${esc(t.cnpj || '')}</span>${m.origem ? `<span class="dom-sep" style="margin:0;">·</span>${m.origem}` : ''}</span>${m.erp}`; })()}
      </div>
      <div class="lo-tipo">${t.origin === 'autopilot' ? '<div class="lo-proc-top"><span class="tag-autopilot">HITL</span></div>' : ''}<span class="lo-proc">${esc(t.type || '')}</span>${(() => { const c = taskColaborador(t); return c ? `<span class="lo-colab">${esc(c)}</span>` : ''; })()}</div>
      <div>${statePillHtml(t, { isNext })}</div>
      <div>${solicitadoEmCellHtml(t)}</div>
      <div style="display: flex; justify-content: flex-end;">${eyeBtn}</div>
    </div>
  `;
}

/* ============================================================
   NAVEGAÇÃO
   ============================================================ */
function showScreen(name) {
  qsa('.screen').forEach(s => s.classList.add('hidden'));
  qs('#screen-' + name).classList.remove('hidden');
  state.currentScreen = name;
  // No Processamento, o breadcrumb NÃO tem "voltar" nos fluxos do Autopilot.
  // HUB: o operador processa por passos, pode voltar ao cockpit ou à validação.
  // Autopilot: a tarefa foi devolvida ao motor; a única saída é o botão de baixo
  // ("Voltar para minhas tarefas"), liberado ao fim do reprocessamento — deixar um
  // "voltar" no topo daria uma saída paralela indevida. Ver autopilot.md.
  if (name === 'execution') {
    const t = getTaskById(state.currentTaskId);
    const backs = qs('#exec-bc-backs');
    if (backs) backs.style.display = (t && t.origin === 'autopilot') ? 'none' : 'contents';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  refreshIcons();
  if (typeof _syncAcompanhamentoBtn === 'function') _syncAcompanhamentoBtn();
}

function _checkEditGuard(onProceed) {
  const taskId = state.currentTaskId;
  if (!taskId || !state._editMode[taskId]) { onProceed(); return; }
  showConfirmModal({
    title: 'Modificações não salvas',
    message: 'Sair agora vai descartar as alterações feitas no formulário. Deseja continuar?',
    confirmLabel: 'Sair sem salvar',
    danger: true,
    onConfirm: onProceed,
  });
}

function goHome() {
  _checkEditGuard(() => {
    if (state.currentTaskId) { state._editMode[state.currentTaskId] = false; delete state._editDraft[state.currentTaskId]; }
    state.currentTaskId = null;
    renderHome();
    showScreen('home');
  });
}

/* ============================================================
   RENDER: HOME
   ============================================================ */
/* ============================================================
   LISTA DO OPERADOR — módulo compartilhado (home dos fluxos + hub)
   FONTE ÚNICA: editar aqui reflete nos 11 fluxos E no lista-operador.html.
   Recebe dados (array flat com `status`) + um handler de clique.
   ============================================================ */

// typeCode → arquivo do fluxo (navegação, path B). Cobre vocabulário fino
// (lista-operador) e grosso (mocks dos fluxos).
const OL_FLOW_HREF = {
  admissao_clt: 'admissao-clt.html', admissao_rpa: 'admissao-rpa.html',
  admissao_estagiario: 'admissao-estagiario.html', admissao_rpa_planilha: 'admissao-rpa-planilha.html',
  ferias: 'ferias-aviso-previo.html', ferias_aviso_previo: 'ferias-aviso-previo.html', ferias_calculo: 'ferias-calculo.html',
  rescisao: 'rescisao-calculo.html', rescisao_aviso_previo: 'rescisao-aviso-previo.html', rescisao_calculo: 'rescisao-calculo.html',
  afastamento: 'afastamento.html', afastamento_empregado: 'afastamento.html',
  apontamentos: 'apontamentos.html', apontamentos_folha: 'apontamentos.html',
  geral: 'solicitacao-geral.html', solicitacao_geral: 'solicitacao-geral.html',
};
function olFlowHref(t) { return (t && (t.flowHref || OL_FLOW_HREF[t.typeCode])) || null; }
function olFamily(typeCode) {
  const c = String(typeCode || '');
  if (c.indexOf('admissao') === 0) return 'admissao';
  if (c.indexOf('ferias') === 0) return 'ferias';
  if (c.indexOf('rescisao') === 0) return 'rescisao';
  if (c.indexOf('afastamento') === 0) return 'afastamento';
  if (c.indexOf('apontamentos') === 0) return 'apontamentos';
  return 'geral';
}

const _ol = { tarefas: [], onOpenTask: null, filtros: { cliente: null, tipo: null, estado: null }, openFlt: null, atribuidasOpen: true, entregues: 0, page: 1 };

// Navegação padrão (path B): abre o fluxo certo daquela tarefa.
function _olNavigate(id) {
  const t = _ol.tarefas.find(x => x.id === id), href = olFlowHref(t);
  if (href) window.location.href = `${href}?ref=lista&taskId=${encodeURIComponent(id)}`;
}
function olOpenTask(id) { (_ol.onOpenTask || _olNavigate)(id); }
// Clique na linha → sempre espiar (mesmo gesto do olho), qualquer estado. Entrar
// na tarefa é só pelo botão do modal. Padronizado em todo o projeto. (modal-espiada.md)
function olRowClick(id) { olVerDetalhes(id); }

function olMount(containerEl, opts) {
  if (!containerEl) return;
  opts = opts || {};
  _ol.tarefas = opts.tarefas || [];
  _ol.onOpenTask = opts.onOpenTask || _olNavigate;
  _ol.filtros = { cliente: null, origem: null, tipo: null, estado: null };
  _ol.openFlt = null;
  _ol.atribuidasOpen = true;
  _ol.entregues = opts.entregues || 0;
  _ol.page = 1;
  containerEl.innerHTML = `
    <div class="container-wide" style="min-width: 800px;">
      <div class="home-top-grid" style="grid-template-columns: 1fr;">
        <div class="section-card" id="ol-header" style="margin-bottom: 0;"></div>
        <!-- COCKPIT-957: card de stats da fila ocultado (foco/enxugar; SLA em risco já aparece por linha). Ocultar ≠ remover — pode voltar. -->
        <!-- <div class="section-card" id="ol-stats" style="margin-bottom: 0; padding: 0;"></div> -->
      </div>
      <div class="flt-bar"><div class="pp-wrap" id="ol-period"></div><div id="ol-filtros" style="display:contents;"></div></div>
      <div id="ol-atribuidas"></div>
      <div class="section-head" id="ol-list-head"></div>
      <div id="ol-list"></div>
      <div style="text-align:center; font-size:12px; color:var(--text-tertiary); padding:16px 0;">
        <i data-lucide="info" class="w-3 h-3" style="display:inline; vertical-align:-2px;"></i>
        Os filtros valem para as duas listas. Ordenadas por data de recebimento, mais novas no topo.
      </div>
    </div>`;
  // Filtro "Solicitado em" — mesmo módulo de calendário do acompanhamento (ppCreate).
  // Default sem filtro (mostra tudo); recorta por data de recebimento quando escolhido.
  ppCreate('ol', {
    mount: 'ol-period', emptyLabel: 'Solicitado em', allowEmpty: true, initialRange: null,
    onChange: () => { _ol.page = 1; olRenderAtribuidas(); olRenderList(); },
    onOpen: () => { if (_ol.openFlt) { _ol.openFlt = null; olRenderFiltros(); } },
  });
  olRenderHeader(); olRenderStats(); olRenderFiltros(); olRenderAtribuidas(); olRenderList(); ppRender('ol');
  refreshIcons();
  if (typeof _syncAcompanhamentoBtn === 'function') _syncAcompanhamentoBtn();
}

// --- derivações ---
function olEstadoDe(t) {
  // Cliente respondeu deixou de ser estado (COCKPIT-959): a tarefa volta a
  // contar como "Em execução", então o filtro de Estado a pega como ativa.
  if (t.status === 'active' || (t.status === 'stationed' && t.clientResponded)) return 'active';
  if (t.status === 'stationed') return 'espera';
  return 'fila';
}
function olGetAtiva() { return _ol.tarefas.find(t => t.status === 'active') || null; }
function olGetProxima() {
  const w = _ol.tarefas.filter(t => t.status === 'queue');
  w.sort((a, b) => slaToMinutes(a.sla) - slaToMinutes(b.sla));
  return w[0] || null;
}
// Atribuídas a mim = TODAS as tarefas do operador, em qualquer status aberto
// (em execução — incluindo as cujo cliente respondeu — e aguardando cliente).
// O status vira pill na linha e é filtrável pelo filtro "Estado". Ordenação por
// data de recebimento, mais nova no topo (sortByRecebimento) — sem pins.
function olGetAtribuidas() {
  return sortByRecebimento(_ol.tarefas.filter(t => t.status === 'active' || t.status === 'stationed'));
}
// Fila geral = tarefas não atribuídas a ninguém (status 'queue').
function olBaseList() {
  return sortByRecebimento(_ol.tarefas.filter(t => t.status === 'queue'));
}
const OL_PAGE_SIZE = 20;
const OL_ESTADO_OPTS = [{ v: 'active', label: 'Em execução' }, { v: 'espera', label: 'Em espera' }, { v: 'fila', label: 'Na fila' }];
// Opções de Cliente/Tipo cobrem as DUAS listas (atribuídas + fila geral),
// já que os filtros do topo valem para ambas.
function olClienteOpts() {
  const seen = new Set(), out = [];
  _ol.tarefas.forEach(t => { if (!seen.has(t.cnpj)) { seen.add(t.cnpj); out.push({ v: t.cnpj, label: t.clientName, cnpj: t.cnpj }); } });
  return out.sort((a, b) => a.label.localeCompare(b.label));
}
function olTipoOpts() {
  const seen = new Set(), out = [];
  _ol.tarefas.forEach(t => { if (!seen.has(t.typeCode)) { seen.add(t.typeCode); out.push({ v: t.typeCode, label: t.type }); } });
  return out.sort((a, b) => a.label.localeCompare(b.label));
}
// Origem: lista COMPLETA das origens da BHub (não só as presentes na fila) — no
// protótipo, o pool de origens reais (ORIGEM_POOL); na produção, o cadastro de
// parceiros de origem. Dedupe + ordem A→Z. (COCKPIT-1005)
function olOrigemOpts() {
  return [...new Set(ORIGEM_POOL)].sort((a, b) => a.localeCompare(b)).map(o => ({ v: o, label: o }));
}
function olTemFiltro() { return Object.values(_ol.filtros).some(Boolean) || !!ppGetRange('ol'); }
function olPassa(t) {
  const f = _ol.filtros;
  if (f.cliente && t.cnpj !== f.cliente) return false;
  // Origem é dado POR CLIENTE (resolveClientOps), não fica na tarefa — mesmo dado
  // que a coluna Cliente exibe (COCKPIT-685).
  if (f.origem && resolveClientOps(t).origem !== f.origem) return false;
  if (f.tipo && t.typeCode !== f.tipo) return false;
  if (f.estado && olEstadoDe(t) !== f.estado) return false;
  if (!ppInRange('ol', t)) return false; // filtro "Solicitado em" (data de recebimento)
  return true;
}

// --- render ---
function olRenderHeader() {
  const el = document.getElementById('ol-header'); if (!el) return;
  const ativa = olGetAtiva(), proxima = olGetProxima(), alvo = ativa || proxima, cont = !!ativa;
  let btn;
  if (alvo) {
    const ic = cont ? 'arrow-right' : 'play', lb = cont ? 'Continuar tarefa atual' : 'Pegar próxima tarefa';
    btn = `<button class="btn btn-primary btn-lg" onclick="olOpenTask('${alvo.id}')"><i data-lucide="${ic}" class="w-4 h-4"></i>${lb}</button>`;
  } else {
    btn = `<button class="btn btn-primary btn-lg" disabled title="Nada na fila pra pegar agora" style="opacity:0.5;cursor:not-allowed;"><i data-lucide="play" class="w-4 h-4"></i>Pegar próxima tarefa</button>`;
  }
  let prev = '';
  if (alvo) {
    prev = `<div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
      <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">${cont ? 'Em execução' : 'Próxima'}</div>
      <div style="font-size:13.5px;color:var(--text-primary);font-weight:600;line-height:1.3;">${esc(alvo.clientName)}</div>
      <div style="font-size:12px;color:var(--text-secondary);">${esc(alvo.type)} · Solicitado em ${esc(solicitadoEmLabel(alvo))}</div></div>`;
  }
  el.innerHTML = `<div>
    <div style="font-size:12px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;font-weight:500;margin-bottom:6px;">Operação DP</div>
    <h1 style="font-size:24px;font-weight:700;margin-bottom:6px;">Olá, Daniele</h1>
    <p style="color:var(--text-secondary);font-size:14px;">Sua fila do dia. Deixe o sistema pegar a próxima pela prioridade ou escolha manualmente na lista.</p>
    <div style="margin-top:16px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">${btn}${prev}</div></div>`;
}
function olRenderStats() {
  const el = document.getElementById('ol-stats'); if (!el) return;
  const ts = _ol.tarefas;
  const fila = ts.filter(t => t.status === 'active' || t.status === 'queue').length;
  const risco = ts.filter(t => (t.status === 'active' || t.status === 'queue') && (t.slaStatus === 'risk' || t.slaStatus === 'overdue')).length;
  const espera = ts.filter(t => t.status === 'stationed').length;
  const resp = ts.filter(t => t.status === 'stationed' && t.clientResponded).length;
  const entregues = _ol.entregues || 0;
  const row = (label, sub, val, cls) => `<div class="stats-row"><div><div class="stats-row-label">${label}</div><div class="stats-row-sublabel">${sub}</div></div><div class="stats-row-value ${cls || ''}">${val}</div></div>`;
  // Total na fila e Entregues sempre; SLA em risco e Em espera só quando > 0.
  let html = row('Total na fila', 'ativa + próximas', fila);
  if (risco > 0) html += row('SLA em risco', 'priorize estas', risco, 'warning');
  if (espera > 0) html += row('Em espera', resp > 0 ? `${resp} já com resposta` : 'aguardando cliente', espera);
  html += row('Entregues', 'concluídas hoje', entregues, 'brand');
  el.innerHTML = html;
}
// Bloco "Atribuídas a mim" — componente recolhível (.espera-wrap, reaproveitado
// do antigo bloco de espera). Nasce expandido: é o conjunto de trabalho do
// operador, pra ele transitar entre as próprias tarefas. Clique na linha abre
// a tarefa no ponto/etapa em que ela está (olOpenTask). Respeita os filtros do
// topo (olPassa), que valem para as duas listas.
function olRenderAtribuidas() {
  const el = document.getElementById('ol-atribuidas'); if (!el) return;
  const ts = olGetAtribuidas().filter(olPassa);
  if (!ts.length) { el.innerHTML = ''; return; }
  // Olho E clique → sempre espiar (olVerDetalhes, aba Resumo). Igual à fila e ao
  // acompanhamento: o gesto de espiar é o mesmo em todo o projeto. Entrar na tarefa
  // é só pelo botão do modal.
  const rows = ts.map(t => _renderTaskRow(t, { clickable: true, onClick: `olVerDetalhes('${t.id}')`, withEye: true })).join('');
  el.innerHTML = `<div class="section-head"><div class="sh-text"><div class="sh-title">Atribuídas a mim (${ts.length})</div><div class="sh-sub">Suas tarefas em andamento, aguardando cliente ou já respondidas · ordenadas por data de recebimento</div></div></div>
    <div class="lo-table-wrap">${_taskTableHead()}${rows}</div>`;
  refreshIcons();
}

// Olho → resumo da tarefa (contexto + mensagem do cliente), sem entrar.
function olVerDetalhes(id) {
  const t = _ol.tarefas.find(x => x.id === id);
  if (!t) return;
  const isQueue = t.status === 'queue';
  // Resumo da tarefa unificado (3 abas) — fonte única, mesmo modal do painel.
  taskSummaryModal(t, { context: 'fila', primary: { label: isQueue ? 'Atribuir a mim e executar' : 'Abrir tarefa', icon: isQueue ? 'play' : 'arrow-right', onClick: `closeTaskSummary(); olOpenTask('${id}')` } });
}

// Clique numa atribuída EM ESPERA → modal com a conversa com o cliente (mesmo
// modelo de chat dos fluxos: history-list + renderHistoryMessage). Como o hub
// não roda o state de um fluxo, a conversa vem de state.messages (se houver) ou
// é montada a partir da clientMessage da tarefa.
function olAbrirConversa(id) {
  const t = _ol.tarefas.find(x => x.id === id);
  if (!t) return;
  // Atribuída → mesmo modal de resumo, abrindo já na aba Conversa.
  taskSummaryModal(t, { context: 'atribuida', tab: 'conversa', primary: { label: 'Abrir tarefa', icon: 'arrow-right', onClick: `closeTaskSummary(); _olNavigate('${id}')` } });
}

/* ============================================================
   MODAL ÚNICO "RESUMO DA TAREFA" (3 abas) — FONTE ÚNICA
   Reusado na fila do operador E no painel de acompanhamento. É o resumo
   da tarefa que qualquer pessoa (gestor) ou o próprio operador consulta.
   Abas: Resumo · Conversa · O que foi feito. (COCKPIT-179 / COCKPIT-956)
   opts: { context, tab, primary:{label,icon,onClick}|null }
   ============================================================ */
let _tsmTask = null;

// Normaliza os dados da solicitação em seções colapsáveis {titulo, campos:[{l,v,changed}]}.
// Campos por PROCESSO (definidos uma vez, valem pra toda tarefa daquele tipo —
// igual o que a Admissão CLT já fazia, estendido aos demais). No real, é onde o
// modal lê os campos do formulário daquele processo. Mesmas seções/subseções do form.
function secoesPorTipo(t) {
  const colab = t.colaborador || '—';
  const S = (titulo, campos) => ({ titulo, campos });
  const MAP = {
    admissao_clt: [
      { titulo: '1. Geral', subsecoes: [
        S('Dados básicos', { 'Nome': colab, 'Nome social': '—', 'CPF': '123.456.789-00', 'Cargo': 'Analista', 'Matrícula': '0318', 'Serviço (sede onde ficará alocado)': 'Matriz', 'Departamento': 'Administrativo', 'Centro de custo': 'CC 01 — Matriz', 'Sindicato': 'Sindicato dos Comerciários' }),
        S('Admissão', { 'Primeiro Emprego': 'NÃO', 'Categoria': 'Mensalista', 'Vínculo Empregatício': 'Celetista', 'Data da admissão': '15/05/2026', 'Salário': 'R$ 2.800,00' }),
        S('Contrato de Experiência', { 'Contrato de Experiência': '45', 'Dias de Prorrogação': '45', 'Data fim da experiência': '29/06/2026', 'Data fim da prorrogação': '13/08/2026' }),
        S('Horário', { 'Jornada': '09:00 AS 18:00 DE SEGUNDA A SEXTA', 'Carga Horária': '220' }),
      ]},
      { titulo: '2. Profissional', subsecoes: [
        S('CTPS', { 'Número': '5518234', 'Série': '0034-SP', 'Data de Expedição': '10/02/2021', 'UF': 'SP' }),
        S('PIS', { 'Número': '120.4567.89-0', 'Data de cadastro': '10/02/2021' }),
        S('Pagamento', { 'Forma de Pagamento': 'Crédito em conta', 'Banco': '237 — Bradesco', 'Agência': '1582', 'Conta': '00112345-6' }),
      ]},
      { titulo: '3. Pessoal', subsecoes: [
        S('Endereço', { 'CEP': '01310-100', 'Logradouro': 'Av. Paulista, 1000', 'Bairro': 'Bela Vista', 'Cidade/UF': 'São Paulo/SP' }),
        S('Dados pessoais', { 'Data de nascimento': '12/03/1996', 'Estado civil': 'Solteiro(a)', 'Nacionalidade': 'Brasileira' }),
      ]},
    ],
    admissao_estagiario: [
      { titulo: '1. Geral', subsecoes: [
        S('Dados básicos', { 'Nome': colab, 'CPF': '456.789.123-00', 'Cargo': 'Estagiário', 'Centro de custo': 'CC 02 — Operações' }),
        S('Instituição de ensino', { 'Instituição': 'Universidade Anhembi', 'Curso': 'Gastronomia', 'Nível': 'Superior', 'Previsão de conclusão': '12/2027' }),
      ]},
      { titulo: '2. Estágio', subsecoes: [
        S('Contrato', { 'Bolsa-auxílio': 'R$ 1.200,00', 'Auxílio-transporte': 'R$ 220,00', 'Carga horária': '6h/dia', 'Início': '02/06/2026', 'Término previsto': '02/06/2027' }),
      ]},
    ],
    admissao_rpa: [
      { titulo: '1. Prestador', subsecoes: [
        S('Dados', { 'Prestador': colab || 'Prestador de serviço', 'CPF/CNPJ': '987.654.321-00', 'Serviço': 'Consultoria de design', 'ISS retido': 'Sim' }),
      ]},
      { titulo: '2. Pagamento', subsecoes: [
        S('Valores', { 'Valor bruto': 'R$ 3.500,00', 'INSS': 'R$ 385,00', 'IRRF': 'R$ 262,50', 'Valor líquido': 'R$ 2.852,50', 'Competência': '05/2026' }),
      ]},
    ],
    ferias_calculo: [
      { titulo: '1. Férias', subsecoes: [
        S('Cálculo', { 'Colaborador': colab, 'Período aquisitivo': '2024/2025', 'Dias de férias': '30', 'Abono pecuniário': 'Não', 'Adiantamento 13º': 'Não', 'Início do gozo': '10/06/2026', 'Fim do gozo': '09/07/2026' }),
      ]},
    ],
    ferias_aviso_previo: [
      { titulo: '1. Férias', subsecoes: [
        S('Aviso de férias', { 'Colaborador': colab, 'Período aquisitivo': '2024/2025', 'Início do gozo': '10/06/2026', 'Fim do gozo': '09/07/2026', 'Dias': '30', 'Abono pecuniário': 'Não' }),
      ]},
    ],
    rescisao_calculo: [
      { titulo: '1. Rescisão', subsecoes: [
        S('Cálculo', { 'Colaborador': colab, 'Tipo de rescisão': 'Sem justa causa', 'Data do aviso': '01/05/2026', 'Data do desligamento': '31/05/2026', 'Aviso prévio': 'Indenizado', 'Saldo de FGTS': 'R$ 4.120,00' }),
      ]},
    ],
    rescisao_aviso_previo: [
      { titulo: '1. Rescisão', subsecoes: [
        S('Aviso prévio', { 'Colaborador': colab, 'Tipo de rescisão': 'Sem justa causa', 'Data do aviso': '01/05/2026', 'Data do desligamento': '31/05/2026', 'Aviso prévio': 'Indenizado' }),
      ]},
    ],
    afastamento_empregado: [
      { titulo: '1. Afastamento', subsecoes: [
        S('Dados', { 'Colaborador': colab, 'Motivo': 'Auxílio-doença (INSS)', 'Início': '05/05/2026', 'Previsão de retorno': '05/07/2026', 'CID': 'M54.5', 'Médico responsável': 'Dr. Paulo Menezes — CRM 123456' }),
      ]},
    ],
    apontamentos_folha: [
      { titulo: '1. Apontamentos', subsecoes: [
        S('Competência', { 'Competência': '05/2026', 'Tipo de apontamento': 'Horas extras + faltas', 'Horas extras': '12h50', 'Faltas': '2', 'Adicional noturno': 'Conferir', 'Observação': 'Planilha enviada pelo cliente' }),
      ]},
    ],
    solicitacao_geral: [
      { titulo: 'Solicitação', subsecoes: [ S('Detalhes', { 'Assunto': 'Declaração de vínculo', 'Descrição': t.clientMessage || 'Emissão de documento solicitada pelo cliente.' }) ]},
    ],
  };
  return MAP[t.typeCode] || [{ titulo: 'Dados da solicitação', subsecoes: [ S('Dados', { 'Colaborador': colab }) ] }];
}
// Rótulos amigáveis para as chaves do formData (abas e subseções). Dicionário
// para as mais comuns; o resto cai no humanizador (camelCase/snake → Título).
const _TSM_LABELS = {
  geral: 'Geral', profissional: 'Profissional', pessoal: 'Pessoal', dependentes: 'Dependentes', documentos: 'Documentos', anexos: 'Anexos',
  dadosBasicos: 'Dados básicos', admissao: 'Admissão', contratoExperiencia: 'Contrato de experiência', horario: 'Horário',
  ctps: 'CTPS', pis: 'PIS', pagamento: 'Pagamento', sindicais: 'Dados sindicais',
  endereco: 'Endereço', pessoais: 'Dados pessoais', contato: 'Contato', deficiencia: 'Deficiência',
  calculo: 'Cálculo', ferias: 'Férias', rescisao: 'Rescisão', afastamento: 'Afastamento', apontamentos: 'Apontamentos',
  valores: 'Valores', competencia: 'Competência', dados: 'Dados', detalhes: 'Detalhes', servico: 'Serviço', contrato: 'Contrato',
};
function _tsmHumanize(key) {
  if (_TSM_LABELS[key]) return _TSM_LABELS[key];
  const s = String(key).replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : key;
}
function _tsmTabLabels(t) {
  const map = {};
  try {
    const tabs = window.FLOW_CONFIG && window.FLOW_CONFIG.FORM_TABS_BY_TYPE && window.FLOW_CONFIG.FORM_TABS_BY_TYPE[t.typeCode];
    if (Array.isArray(tabs)) tabs.forEach(tab => { map[tab.id] = tab.label; });
  } catch (e) { /* sem FLOW_CONFIG (telas de lista) → usa humanizador */ }
  return map;
}
// Converte o formData.abas da tarefa (a MESMA fonte que o formulário do fluxo lê)
// em seções/subseções read-only pro modal. Type-agnóstico: funciona pra qualquer
// processo, em qualquer tela — o modal reflete os campos reais da tarefa.
function _tsmAbasSecoes(t) {
  const abas = t.formData && t.formData.abas;
  if (!abas || typeof abas !== 'object') return null;
  const tabLabels = _tsmTabLabels(t);
  const out = [];
  Object.entries(abas).forEach(([abaId, abaData]) => {
    if (!abaData || typeof abaData !== 'object' || abaData.disabled) return;
    const subsecoes = [];
    const diretos = {};
    Object.entries(abaData).forEach(([subKey, subVal]) => {
      if (subKey === 'disabled' || subKey === 'reason') return;
      if (subVal && typeof subVal === 'object' && !Array.isArray(subVal)) {
        const campos = {};
        Object.entries(subVal).forEach(([k, v]) => { if (v == null || typeof v !== 'object') campos[k] = v; });
        if (Object.keys(campos).length) subsecoes.push({ titulo: _tsmHumanize(subKey), campos });
      } else if (subVal != null && typeof subVal !== 'object') {
        diretos[_tsmHumanize(subKey)] = subVal;
      }
    });
    if (Object.keys(diretos).length) subsecoes.unshift({ titulo: '', campos: diretos });
    if (subsecoes.length) out.push({ titulo: tabLabels[abaId] || _tsmHumanize(abaId), subsecoes });
  });
  return out.length ? out : null;
}
function _tsmSecoes(t) {
  if (Array.isArray(t.secoes) && t.secoes.length) return t.secoes;
  if (Array.isArray(t.feito) && t.feito.length) return [{ titulo: 'Dados da solicitação', campos: t.feito }];
  if (Array.isArray(t.campos) && t.campos.length) return [{ titulo: 'Dados da solicitação', campos: t.campos }];
  const fromAbas = _tsmAbasSecoes(t); // fonte real da tarefa (mesma do formulário)
  if (fromAbas) return fromAbas;
  return secoesPorTipo(t); // fallback por processo — só quando a tarefa não tem dados próprios
}
function _tsmMsgs(t) {
  const real = (state.messages && state.messages[t.id] && state.messages[t.id].length) ? state.messages[t.id] : null;
  if (real) return real;
  if (Array.isArray(t.messages) && t.messages.length) return t.messages;
  // Em espera (stationed, aguardando cliente) sempre teve troca: o cliente pediu,
  // o operador respondeu pedindo um complemento — então a ÚLTIMA é do operador.
  // Coerência do estado; vale em qualquer tela (mesmo modal). (modal-espiada.md)
  if (t.status === 'stationed' && !t.clientResponded) {
    return [
      { from: 'client', text: t.clientMessage || 'Segue a solicitação.', timestamp: t.receivedAt || '' },
      { from: 'operator', text: 'Recebi a solicitação. Para dar sequência, preciso de um complemento — deixei o detalhe na tarefa. Fico no aguardo do retorno.', timestamp: t.receivedAt || '' },
    ];
  }
  return [];
}
function _tsmLog(t) {
  if (Array.isArray(t.log) && t.log.length) return t.log;
  return ((state._editLog && state._editLog[t.id]) || []).map(e => ({ field: e.field, before: e.before, after: e.after, by: e.changedBy, at: e.changedAt }));
}
function _tsmStepIdx(t) {
  if (t.status === 'completed') return TIMELINE_STEPS.length;
  if (t.status === 'queue') return 1; // só "recebida" concluída; sem etapa ativa (na fila)
  if (t.status === 'processing') return 2; // passo "Processamento" da timeline
  return (typeof t.timelineStep === 'number') ? t.timelineStep : 1;
}
function _tsmEmpty(icon, title, desc) {
  return `<div style="text-align:center;padding:30px 16px;"><div style="width:50px;height:50px;border-radius:14px;background:var(--surface-muted);color:var(--text-tertiary);display:inline-flex;align-items:center;justify-content:center;margin-bottom:10px;"><i data-lucide="${icon}" style="width:25px;height:25px;"></i></div><div style="font-size:14px;font-weight:600;color:var(--text-primary);">${esc(title)}</div><div style="font-size:12.5px;color:var(--text-secondary);margin-top:3px;">${esc(desc)}</div></div>`;
}
// Campo read-only = MESMO componente do formulário (roField → .field-label/.field-value).
// Campo alterado (vista original×feito) reusa as mesmas classes + destaque "alterado".
function _tsmFieldRO(c) {
  if (!c.changed) return roField(c.l, c.v);
  return `<div><div class="field-label">${esc(c.l)}</div><div class="field-value" style="color:#92400e;font-weight:600;">${esc(c.v)} <span style="font-size:9.5px;font-weight:700;color:#b45309;background:rgba(245,158,11,0.15);border:1px solid #f59e0b;border-radius:4px;padding:0 4px;vertical-align:middle;">alterado</span></div></div>`;
}
// Item de acordeon CONECTADO — mesmo padrão da etapa de processamento: cada seção é um
// .exec-ref-item empilhado dentro de UM .exec-ref-card só (borda compartilhada), não um card
// por seção. Economiza espaço e fica consistente com a tela da tarefa.
function _tsmRefItem(s, openByDefault) {
  let body, alt = 0;
  if (Array.isArray(s.subsecoes)) {
    // Seções com subseções → reusa renderSubsection (mesmo .subsection-title + .field-group do form).
    body = s.subsecoes.map(ss => renderSubsection(ss.titulo, ss.campos)).join('');
  } else {
    const campos = s.campos || [];
    alt = campos.filter(c => c.changed).length;
    body = `<div class="field-group">${campos.map(_tsmFieldRO).join('')}</div>`;
  }
  // Sem contagem de campos no título; só o aviso de "alterados" (vista original × feito).
  const altTag = alt ? ` <span style="color:var(--text-tertiary);font-weight:500;">· ${alt} alterado${alt > 1 ? 's' : ''}</span>` : '';
  return `<div class="exec-ref-item">
    <button class="exec-ref-trigger ${openByDefault ? 'open' : ''}" onclick="toggleExecRefItem(this)"><span>${esc(s.titulo)}${altTag}</span><i data-lucide="chevron-down" class="exec-ref-chevron" style="width:16px;height:16px;"></i></button>
    <div class="exec-ref-content" style="display:${openByDefault ? 'block' : 'none'};">${body}</div>
  </div>`;
}
function tsmAcc(btn) { btn.classList.toggle('open'); const b = btn.nextElementSibling; if (b) b.style.display = (b.style.display === 'none') ? 'block' : 'none'; }

function taskSummaryModal(t, opts) {
  if (!t) return;
  opts = opts || {};
  _tsmTask = t;
  _tsmTab = opts.tab || 'resumo';
  let bd = document.getElementById('task-summary-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.id = 'task-summary-backdrop'; bd.className = 'modal-backdrop hidden'; bd.onclick = (e) => { if (e.target === bd) closeTaskSummary(); }; document.body.appendChild(bd); }

  const cancelled = t.status === 'cancelled';
  const completed = t.status === 'completed';
  const op = (typeof acOp === 'function') ? acOp(t.operatorId) : null;
  const quem = op ? op.nome : (t.assignee || (t.operatorId ? '' : ''));
  const isAutopilot = t.origin === 'autopilot';
  const senderName = t.senderName || t.colaborador || '—';
  const senderTags = isAutopilot
    ? `<span class="contact-tag">robô</span>`
    : `<span class="contact-tag contact-tag-client">cliente</span>${(t.senderScopes || []).map(s => `<span class="contact-tag">${esc(s)}</span>`).join('')}`;
  const atribTxt = quem ? `Atribuído a <strong style="color:var(--text-primary);font-weight:600;">${esc(quem)}</strong>` : `<span style="color:var(--text-tertiary);">Não atribuída ainda</span>`;
  let deadlineHtml;
  if (completed) deadlineHtml = `<span style="color:var(--success);font-weight:600;">Concluído em ${esc(concluidoEmLabel(t))}</span>`;
  else if (cancelled) deadlineHtml = `<span style="color:var(--danger);font-weight:600;">Cancelada ${esc(t.cancelledAt || '')}</span>`;
  else deadlineHtml = ''; // Prazo removido do modal (por enquanto) — colunas de prazo das tabelas ficam pra outra tarefa

  // Cancelamento: mesmo acabamento suave do card de erro do Autopilot (.stopped-card),
  // título "Cancelada" + "Justificativa:". Vai no CORPO (depois da linha do header), não no header.
  const cancelNote = cancelled
    ? `<div class="stopped-card" style="margin-bottom:16px;"><div class="problem-head"><i data-lucide="x-circle"></i>Cancelada</div><div class="problem-text">Justificativa: ${esc(t.cancelReason || '—')}</div></div>`
    : '';

  // Log de alterações (antes→depois). O botão fica DENTRO da aba Resumo (não abaixo do
  // progresso) — aparece quando há histórico (tarefa concluída/em execução).
  const log = _tsmLog(t);
  const logBtn = log.length
    ? `<button class="btn btn-secondary" style="margin-top:16px;" onclick="taskLogModal()"><i data-lucide="list" class="w-4 h-4"></i>Ver alterações (${log.length})</button>`
    : '';

  // ---- Aba Resumo ----
  // Tarefa do Autopilot: espelha o miolo da tela (o que já rodou / de onde parou /
  // o que precisa ser feito), pela MESMA fonte usada em renderFormTab (apMiolo).
  let resumoPane;
  if (isAutopilot && typeof apMiolo === 'function') {
    // t.autopilot já vem pronto no acompanhamento; nas telas de tarefa monta na hora a partir
    // do processo (apFluxo). Fallback FLOW_CONFIG mantém compat.
    const apSrc = t.autopilot || (t.apFluxo && typeof apBuildMiolo === 'function' ? apBuildMiolo(t) : (window.FLOW_CONFIG || {}));
    resumoPane = apMiolo(apSrc);
  } else {
    // Miolo do Resumo = o MESMO componente da etapa de checagem (renderFormReference):
    // todas as abas do formulário, todos os campos (vazios inclusos), dependentes como
    // cards, anexos. Quando a tela tem o renderizador de campos do fluxo, usa ele; senão
    // (telas de lista sem o renderizador) cai no resumo por processo. (modal-espiada.md)
    const _FC = window.FLOW_CONFIG;
    const temCheckComp = t.formData && _FC && typeof _FC.renderFormTab === 'function'
      && _FC.FORM_TABS_BY_TYPE && _FC.FORM_TABS_BY_TYPE[t.typeCode] && typeof renderFormReference === 'function';
    let dados;
    if (temCheckComp) {
      dados = renderFormReference(t, false); // acordeons fechados por padrão
    } else {
      const secoes = _tsmSecoes(t);
      dados = secoes.length
        ? `<div class="exec-ref-card">${secoes.map(s => _tsmRefItem(s, false)).join('')}</div>`
        : `<div style="font-size:12.5px;color:var(--text-tertiary);padding:4px 0;">Sem dados de formulário registrados nesta tarefa.</div>`;
    }
    // Sem bloco "Mensagem do cliente" no Resumo — a mensagem vive na aba Conversa.
    // O acordeon traz os DADOS DA SOLICITAÇÃO ORIGINAL (o que o cliente pediu); as mudanças
    // que o operador fez ficam no "Ver alterações" (log). (modal-espiada.md)
    resumoPane = `
      <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:10px;">Dados da solicitação original</div>
      ${dados}
      ${logBtn}`;
  }

  // ---- Aba Conversa ----
  const msgs = _tsmMsgs(t);
  const conversaPane = msgs.length
    ? `<div class="history-list">${msgs.map(m => renderHistoryMessage(m, t)).join('')}</div>`
    : _tsmEmpty('messages-square', 'Nenhuma mensagem ainda', 'Não houve troca de mensagens com o cliente nesta tarefa.');

  // ---- Progresso ("em que etapa está") ----
  // Vai pro TOPO do corpo (não é mais uma aba) — visível em TODOS os modais, igual ao robô.
  // Tarefa do robô: o acompanhamento troca a timeline pelo stepper de fases (apRoboModalAjusta).
  const progressoTop = cancelled ? '' : `
    <div class="tsm-progress" id="tsm-progress">
      <div class="timeline-horizontal" id="tsm-timeline"></div>
    </div>`;

  const tab = (id, label) => `<button class="form-tab tsm-tab" data-tab="${id}" onclick="tsmShowTab('${id}')">${label}</button>`;
  const pane = (id, html) => `<div class="tsm-pane" data-pane="${id}" style="display:none;">${html}</div>`;

  // Tarefa encerrada (concluída/cancelada) não abre nem se repassa: sem "Copiar link" nem
  // botão primário — só "Fechar".
  const encerrada = completed || cancelled;
  const _dl = encerrada ? null : taskDeepLink(t);
  const copyBtn = _dl ? `<button class="btn btn-ghost" style="margin-right:auto;" onclick="copyTaskLink(this)"><i data-lucide="link" class="w-4 h-4"></i>Copiar link</button>` : '';
  const primaryBtn = (!encerrada && opts.primary) ? `<button class="btn btn-primary" onclick="${opts.primary.onClick}">${opts.primary.icon ? `<i data-lucide="${opts.primary.icon}" class="w-4 h-4"></i>` : ''}${esc(opts.primary.label)}</button>` : '';
  const footer = `${copyBtn}<button class="btn btn-secondary" onclick="closeTaskSummary()">Fechar</button>${primaryBtn}`;

  bd.innerHTML = `<div class="modal-panel" onclick="event.stopPropagation()" style="max-width:720px;">
    <div class="modal-header" style="display:block;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
        <div style="min-width:0;flex:1;">
          <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:500;">${esc(t.type || '')}</div>
          <h1 style="font-size:20px;font-weight:700;line-height:1.15;margin:2px 0 4px;">${esc(t.clientName || '')}</h1>
          <div style="font-size:13px;color:var(--text-secondary);font-family:'JetBrains Mono',monospace;">${esc(t.cnpj || '')}</div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:12px;color:var(--text-tertiary);">${olMetaStripHtml(t)}<span style="color:var(--text-tertiary);">·</span><span>${atribTxt}</span></div>
        </div>
        <button class="btn btn-ghost" style="padding:8px;flex-shrink:0;" onclick="closeTaskSummary()"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div style="border-top:1px solid var(--border);margin:12px 0;"></div>
      <div style="font-size:12.5px;color:var(--text-secondary);display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span>${isAutopilot ? 'Iniciado pelo' : 'Solicitado por'} <strong style="color:var(--text-primary);font-weight:600;">${esc(senderName)}</strong></span>
        <span style="display:inline-flex;gap:4px;">${senderTags}</span>
        <span style="color:var(--text-tertiary);">·</span>
        <span style="color:var(--text-tertiary);">Solicitado em ${esc(solicitadoEmLabel(t))}</span>
        ${statePillHtml(t)}
        ${deadlineHtml}
      </div>
    </div>
    <div class="modal-body" style="padding-top:18px;">
      ${cancelNote}
      ${progressoTop}
      ${isAutopilot
        ? `<div${progressoTop ? ' style="margin-top:20px;"' : ''}>${resumoPane}</div>`
        : `<div class="form-tabs"${progressoTop ? ' style="margin-top:20px;"' : ''}>${tab('resumo', 'Resumo')}${tab('conversa', 'Mensagens')}</div>
           <div style="padding-top:16px;">${pane('resumo', resumoPane)}${pane('conversa', conversaPane)}</div>`}
    </div>
    <div class="modal-footer">${footer}</div>
  </div>`;
  bd.classList.remove('hidden');
  if (t.status !== 'cancelled') { const tl = document.getElementById('tsm-timeline'); if (tl) renderTimelineHorizontal(tl, _tsmStepIdx(t), t, { noActive: t.status === 'queue' }); }
  tsmShowTab(_tsmTab);
  refreshIcons();
}
function tsmShowTab(tabId) {
  _tsmTab = tabId;
  document.querySelectorAll('#task-summary-backdrop .tsm-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  document.querySelectorAll('#task-summary-backdrop .tsm-pane').forEach(p => { p.style.display = (p.dataset.pane === tabId) ? 'block' : 'none'; });
}
function closeTaskSummary() { const bd = document.getElementById('task-summary-backdrop'); if (bd) bd.classList.add('hidden'); }

// Link direto da tarefa — o gestor copia e repassa pra outro operador finalizar,
// sem reatribuição pelo sistema (caso: operador adoece, tarefa fica parada).
function taskDeepLink(t) {
  const href = (typeof olFlowHref === 'function') ? olFlowHref(t) : null;
  if (!href || !t) return null;
  const base = location.href.replace(/[^/]*(\?.*)?$/, '');
  return base + href + '?ref=acompanhamento&taskId=' + encodeURIComponent(t.id);
}
function tsmAbrirTarefa() {
  const t = _tsmTask; if (!t) return;
  const u = taskDeepLink(t);
  const go = () => { closeTaskSummary(); if (u) window.location.href = u; else alert('No protótipo: abriria a tela da tarefa.'); };
  // Tarefa sem operador → abrir atribui a quem está abrindo (igual a pegar na fila). Avisa antes.
  const semDono = !t.operatorId && t.status !== 'completed' && t.status !== 'cancelled';
  if (semDono && typeof showConfirmModal === 'function') {
    showConfirmModal({
      title: 'Atribuir a você?',
      message: 'Esta tarefa ainda não tem operador. Ao abrir, ela será <strong>atribuída a você</strong> — o mesmo que pegar uma tarefa na fila.',
      confirmLabel: 'Atribuir e abrir',
      onConfirm: go,
    });
  } else { go(); }
}
function _copyFeedback(btn) { if (!btn) return; const old = btn.innerHTML; btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>Copiado!'; refreshIcons(); setTimeout(() => { btn.innerHTML = old; refreshIcons(); }, 1600); }
function copyLinkUrl(url, btn) {
  if (!url) return;
  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => _copyFeedback(btn)).catch(() => {
    try { const ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); _copyFeedback(btn); }
    catch (e) { prompt('Copie o link da tarefa:', url); }
  });
}
function copyTaskLink(btn) { copyLinkUrl(taskDeepLink(_tsmTask), btn); }

// Log de alterações — modal à parte (mesmo papel do "Histórico de alterações"
// de dentro da tarefa), reusado a partir do modal de resumo.
function taskLogModal() {
  const t = _tsmTask; if (!t) return;
  const log = _tsmLog(t);
  let bd = document.getElementById('task-log-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.id = 'task-log-backdrop'; bd.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:300;display:flex;align-items:center;justify-content:center;'; bd.onclick = (e) => { if (e.target === bd) bd.remove(); }; }
  else bd.style.display = 'flex';
  const rows = log.length
    ? log.map(e => `<div style="padding:12px 0;border-top:1px solid var(--border);font-size:13px;">
        <div style="font-weight:600;color:var(--text-primary);">${esc(e.field || '')}</div>
        <div style="margin-top:4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><span style="text-decoration:line-through;color:var(--text-tertiary);">${esc(e.before || '—')}</span><i data-lucide="arrow-right" style="width:14px;height:14px;color:var(--text-tertiary);"></i><span style="color:#92400e;font-weight:600;">${esc(e.after || '—')}</span></div>
        ${(e.by || e.at) ? `<div style="margin-top:3px;font-size:11px;color:var(--text-tertiary);">${esc(e.by || '')}${e.by && e.at ? ' · ' : ''}${esc(e.at || '')}</div>` : ''}
      </div>`).join('')
    : `<div style="padding:18px 0;font-size:13px;color:var(--text-tertiary);">Nenhuma alteração registrada.</div>`;
  bd.innerHTML = `<div class="modal-panel" onclick="event.stopPropagation()" style="max-width:560px;">
    <div class="modal-header"><div style="font-size:15px;font-weight:700;">Histórico de alterações</div><button class="btn btn-ghost" style="padding:8px;" onclick="document.getElementById('task-log-backdrop').remove()"><i data-lucide="x" class="w-4 h-4"></i></button></div>
    <div class="modal-body">${rows}</div>
  </div>`;
  document.body.appendChild(bd);
  refreshIcons();
}

// Hub (lista-operador): ENTRAR na tarefa é sempre navegar pro fluxo dela. Espiar
// (olho/clique na linha) é o modal de resumo; entrar é o botão do modal e os
// botões do header ("Continuar/Pegar próxima"). Sem desvio por estado. A conversa
// com o cliente segue acessível pela aba Conversa do modal. (modal-espiada.md)
function olHubOpenTask(id) { _olNavigate(id); }
function _olFltLabel(k) {
  if (k === 'cliente') { const o = olClienteOpts().find(o => o.v === _ol.filtros.cliente); return o ? o.label : 'Cliente'; }
  if (k === 'origem') { const o = olOrigemOpts().find(o => o.v === _ol.filtros.origem); return o ? o.label : 'Origem'; }
  if (k === 'tipo') { const o = olTipoOpts().find(o => o.v === _ol.filtros.tipo); return o ? o.label : 'Processo'; }
  const o = OL_ESTADO_OPTS.find(o => o.v === _ol.filtros.estado); return o ? o.label : 'Estado';
}
function _olFltTrigger(k) {
  const has = !!_ol.filtros[k];
  const clear = has ? `<span class="flt-clear" onclick="event.stopPropagation(); olLimparFiltro('${k}')"><i data-lucide="x" style="width:14px;height:14px;"></i></span>` : '';
  return `<button class="flt-trigger ${has ? 'has-val' : ''}" onclick="event.stopPropagation(); olToggleFlt('${k}')"><span>${esc(_olFltLabel(k))}</span>${clear}<i data-lucide="chevron-down" class="flt-chev" style="width:16px;height:16px;"></i></button>`;
}
function _olFltMenu(k) {
  if (_ol.openFlt !== k) return '';
  const chk = (v) => _ol.filtros[k] === v ? '<i data-lucide="check" class="flt-check" style="width:16px;height:16px;"></i>' : '';
  if (k === 'cliente') {
    const items = olClienteOpts().map(o => `<div class="flt-item" data-search="${esc((o.label + ' ' + o.cnpj).toLowerCase())}" onclick="olSetFiltro('cliente','${esc(o.v)}')"><div style="display:flex;flex-direction:column;min-width:0;"><span>${esc(o.label)}</span><span class="flt-cnpj">${esc(o.cnpj)}</span></div>${chk(o.v)}</div>`).join('');
    return `<div class="flt-menu"><input class="flt-search" id="ol-flt-cliente-search" placeholder="Buscar nome ou CNPJ…" oninput="olFiltraCliente(this)">${items}</div>`;
  }
  if (k === 'origem') {
    const items = olOrigemOpts().map(o => `<div class="flt-item" data-search="${esc(o.label.toLowerCase())}" onclick="olSetFiltro('origem','${esc(o.v)}')"><span>${esc(o.label)}</span>${chk(o.v)}</div>`).join('');
    return `<div class="flt-menu"><input class="flt-search" id="ol-flt-origem-search" placeholder="Buscar origem…" oninput="olFiltraCliente(this)">${items}</div>`;
  }
  const opts = k === 'tipo' ? olTipoOpts() : OL_ESTADO_OPTS;
  const items = opts.map(o => `<div class="flt-item" onclick="olSetFiltro('${k}','${esc(o.v)}')"><span>${esc(o.label)}</span>${chk(o.v)}</div>`).join('');
  return `<div class="flt-menu">${items}</div>`;
}
function olRenderFiltros() {
  const el = document.getElementById('ol-filtros'); if (!el) return;
  const keys = ['cliente', 'origem', 'tipo', 'estado'];
  el.innerHTML = keys.map(k => `<div class="flt">${_olFltTrigger(k)}${_olFltMenu(k)}</div>`).join('') + (olTemFiltro() ? `<button class="flt-limpar" onclick="olLimparTodos()">Limpar filtros</button>` : '');
  refreshIcons();
  if (_ol.openFlt === 'cliente') { const s = document.getElementById('ol-flt-cliente-search'); if (s) setTimeout(() => s.focus(), 0); }
  if (_ol.openFlt === 'origem') { const s = document.getElementById('ol-flt-origem-search'); if (s) setTimeout(() => s.focus(), 0); }
}
function olToggleFlt(k) { _ol.openFlt = (_ol.openFlt === k) ? null : k; if (_ol.openFlt && _pp.ol && _pp.ol.open) { _pp.ol.open = false; ppRender('ol'); } olRenderFiltros(); }
function olSetFiltro(k, v) { _ol.filtros[k] = v; _ol.openFlt = null; _ol.page = 1; olRenderFiltros(); olRenderAtribuidas(); olRenderList(); }
function olLimparFiltro(k) { _ol.filtros[k] = null; _ol.openFlt = null; _ol.page = 1; olRenderFiltros(); olRenderAtribuidas(); olRenderList(); }
function olLimparTodos() { Object.keys(_ol.filtros).forEach(k => _ol.filtros[k] = null); _ol.openFlt = null; _ol.page = 1; if (_pp.ol) { _pp.ol.range = null; _pp.ol.calPick = null; ppRender('ol'); } olRenderFiltros(); olRenderAtribuidas(); olRenderList(); }
function olFiltraCliente(inp) { const q = inp.value.toLowerCase().trim(); inp.parentElement.querySelectorAll('.flt-item').forEach(it => { it.style.display = (!q || (it.dataset.search || '').includes(q)) ? '' : 'none'; }); }
function olRenderList() {
  const head = document.getElementById('ol-list-head'), mount = document.getElementById('ol-list'); if (!mount) return;
  const ts = olBaseList().filter(olPassa);
  if (head) head.innerHTML = `<div class="sh-text"><div class="sh-title">Fila geral (${ts.length})</div><div class="sh-sub">Não atribuídas · escolha manualmente ou deixe o sistema pegar a próxima · ordenadas por data de recebimento, mais novas no topo</div></div>`;
  if (!ts.length) { mount.innerHTML = `<div class="lo-table-wrap"><div style="padding:28px 16px;text-align:center;color:var(--text-tertiary);font-size:13px;">${olTemFiltro() ? 'Nenhuma tarefa com esses filtros.' : 'Nenhuma tarefa na fila geral agora.'}</div></div>`; refreshIcons(); return; }
  const pages = Math.max(1, Math.ceil(ts.length / OL_PAGE_SIZE));
  if (_ol.page > pages) _ol.page = pages;
  const start = (_ol.page - 1) * OL_PAGE_SIZE;
  const pageItems = ts.slice(start, start + OL_PAGE_SIZE);
  const rows = pageItems.map(t => _renderTaskRow(t, { clickable: true, onClick: `olVerDetalhes('${t.id}')`, withEye: true })).join('');
  const from = start + 1, to = start + pageItems.length;
  const hasPrev = _ol.page > 1, hasNext = to < ts.length;
  const pager = `<div class="lo-pager">
    <button class="btn btn-secondary" ${hasPrev ? '' : 'disabled'} onclick="olGoPage(${_ol.page - 1})"><i data-lucide="chevron-left" class="w-4 h-4"></i>Anterior</button>
    <span class="lo-pager-info">Mostrando ${from}–${to} de ${ts.length}</span>
    <button class="btn btn-secondary" ${hasNext ? '' : 'disabled'} onclick="olGoPage(${_ol.page + 1})">Próxima<i data-lucide="chevron-right" class="w-4 h-4"></i></button>
  </div>`;
  mount.innerHTML = `<div class="lo-table-wrap">${_taskTableHead()}${rows}</div>${pager}`;
  refreshIcons();
}
function olGoPage(p) { _ol.page = p; olRenderList(); }

// fecha o dropdown de filtro aberto ao clicar fora
document.addEventListener('click', (e) => { if (_ol.openFlt && !e.target.closest('.flt')) { _ol.openFlt = null; olRenderFiltros(); } ppCloseIfOutside('ol', e.target, '#ol-period'); });

/* ---- Contexto FLUXO: deriva do state + abre in-page (ativa) ou navega (B) ---- */
function _olTasksFromState() {
  const out = [];
  if (state.active) out.push({ ...state.active, status: 'active' });
  (state.queue || []).forEach(t => out.push({ ...t, status: 'queue' }));
  (state.stationed || []).forEach(t => out.push({ ...t, status: 'stationed' }));
  return out;
}
function _flowOpenTask(id) {
  // ENTRAR na tarefa (chamado pelo botão do modal de espiada e pelos botões do
  // header). Espiar é olVerDetalhes (olho/clique na linha). Mesma regra da outra
  // porta do hub (olHubOpenTask): entrar sempre navega pro fluxo da tarefa; a
  // conversa segue acessível pela aba Conversa do modal. (modal-espiada.md)
  _olNavigate(id);
}

// Abre uma tarefa específica da fila/estacionadas in-page (deep-link de chegada).
function openTaskById(id) {
  let task = (state.queue || []).find(t => t.id === id);
  if (task) { state.queue = state.queue.filter(t => t.id !== id); }
  else { task = (state.stationed || []).find(t => t.id === id); if (task) { state.stationed = state.stationed.filter(t => t.id !== id); if (task.clientResponded) task.clientResponded = false; } }
  if (!task) { pegarProximaTarefa(); return; }
  if (state.active && state.active.id !== id) state.queue.unshift(state.active);
  state.active = task; state.currentTaskId = id;
  renderTask(task); showScreen('task');
}

// Ao chegar de uma lista (?ref=lista), abre uma tarefa DO TIPO deste fluxo.
function _olOpenOnArrival() {
  const fam = olFamily(window.FLOW_CONFIG && window.FLOW_CONFIG.typeCode);
  const resp = (state.stationed || []).find(t => t.clientResponded && olFamily(t.typeCode) === fam);
  const fila = (state.queue || []).find(t => olFamily(t.typeCode) === fam);
  const alvo = resp || fila;
  if (alvo) openTaskById(alvo.id); else pegarProximaTarefa();
}

function renderHome() {
  olMount(qs('#screen-home'), { tarefas: _olTasksFromState(), onOpenTask: _flowOpenTask, entregues: (state.completed || []).length });
}

/* ============================================================
   RENDER: FORMULÁRIO
   ============================================================ */
function getFormTabs(typeCode) {
  const tabs = window.FLOW_CONFIG.FORM_TABS_BY_TYPE;
  return (tabs && tabs[typeCode]) || [{ id: 'geral', label: '1. Geral' }];
}

function _getActiveFormTabId() {
  const el = qs('.form-tab.active[data-tab]');
  return el ? el.dataset.tab : null;
}

function renderForm(task, preferredTabId) {
  const tabsEl = qs('#form-tabs');
  const contentEl = qs('#form-content');

  if (!task.formData) {
    tabsEl.innerHTML = '';
    contentEl.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; color: var(--text-tertiary); font-size: 13px;">
        <i data-lucide="file-question" class="w-10 h-10 mx-auto mb-3" style="color: var(--text-tertiary);"></i>
        <div>Formulário não disponível para esta solicitação neste protótipo.</div>
      </div>
    `;
    refreshIcons();
    return;
  }

  const data = task.formData;
  const tabs = getFormTabs(task.typeCode);

  const preferredTab = tabs.find(t => t.id === preferredTabId);
  const preferredEnabled = preferredTab && !(data.abas && data.abas[preferredTab.id] && data.abas[preferredTab.id].disabled);
  const initialTabId = preferredEnabled ? preferredTab.id : tabs[0].id;

  tabsEl.innerHTML = tabs.map(tab => {
    const tabData = data.abas && data.abas[tab.id];
    const disabled = tabData && tabData.disabled;
    return `<div class="form-tab ${tab.id === initialTabId ? 'active' : ''} ${disabled ? 'disabled' : ''}"
         data-tab="${tab.id}"
         ${disabled ? `title="${tabData.reason}"` : `onclick="switchFormTab('${tab.id}')"`}>
      ${tab.label}
      ${disabled ? '<i data-lucide="lock" style="width:12px;height:12px;opacity:0.6;"></i>' : ''}
    </div>`;
  }).join('');

  const stripEl = qs('#form-collab-strip');
  if (stripEl) {
    if (data.colaborador) {
      const initials = data.colaborador.nome.split(' ').map(n => n[0]).slice(0, 2).join('');
      const contextLabel = data.colaborador.contextLabel;
      const contextValue = data.colaborador.contextValue || data.colaborador.dataAdmissao;
      const contextBlock = contextLabel && contextValue ? `
        <div style="margin-left: auto; text-align: right;">
          <div class="field-label">${contextLabel}</div>
          <div style="font-weight: 600;">${contextValue}</div>
        </div>` : '';
      stripEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: var(--surface-subtle); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 20px;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #64748b, #94a3b8); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">${initials}</div>
          <div>
            <div style="font-size: 15px; font-weight: 600;">${data.colaborador.nome}</div>
            <div style="font-size: 12px; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">CPF ${data.colaborador.cpf} · Cód. ${data.colaborador.codigo}</div>
          </div>
          ${contextBlock}
        </div>
      `;
    } else {
      stripEl.innerHTML = '';
    }
  }

  const isEditing = !!(task.id && state._editMode[task.id]);

  const logCount = (state._editLog[task.id] || []).length;
  const editBtnEl = qs('#form-edit-btn');
  if (editBtnEl) {
    editBtnEl.innerHTML = isEditing ? '' : `
      <div style="display:flex;align-items:center;gap:8px;">
        ${logCount > 0 ? `<button onclick="showEditLog()" style="display:inline-flex;align-items:center;gap:5px;padding:7px 12px;background:#fff;border:1px solid var(--border-strong);border-radius:8px;font-size:12.5px;font-weight:500;cursor:pointer;color:var(--text-secondary);" onmouseover="this.style.borderColor='var(--brand-pink)';this.style.color='var(--brand-pink)'" onmouseout="this.style.borderColor='var(--border-strong)';this.style.color='var(--text-secondary)'"><i data-lucide="list" style="width:13px;height:13px;"></i> Ver alterações (${logCount})</button>` : ''}
        <button onclick="enterEditMode()" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:#fff;border:1px solid var(--border-strong);border-radius:8px;font-size:12.5px;font-weight:500;cursor:pointer;color:var(--text-secondary);transition:all .15s;" onmouseover="this.style.borderColor='var(--brand-pink)';this.style.color='var(--brand-pink)'" onmouseout="this.style.borderColor='var(--border-strong)';this.style.color='var(--text-secondary)'"><i data-lucide="pencil" style="width:13px;height:13px;"></i> Editar</button>
      </div>`;
  }

  const editBar = `<div class="edit-mode-bar">
      <span class="edit-mode-badge">✏ Em edição</span>
      ${logCount > 0 ? `<button onclick="showEditLog()" style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;background:#fff;border:1px solid var(--border-strong);border-radius:7px;font-size:12.5px;font-weight:500;cursor:pointer;"><i data-lucide="list" style="width:13px;height:13px;"></i> Ver alterações (${logCount})</button>` : ''}
      <div style="margin-left:auto;display:flex;gap:8px;">
        <button onclick="cancelEdits()" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:#fff;border:1px solid var(--border-strong);border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;">Cancelar</button>
        <button onclick="saveEdits()" style="display:inline-flex;align-items:center;gap:6px;padding:7px 16px;background:var(--brand-pink);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;"><i data-lucide="check" style="width:14px;height:14px;"></i> Salvar alterações</button>
      </div>
    </div>`;

  contentEl.innerHTML = (isEditing ? editBar : '') + '<div id="form-tab-body"></div>' + (isEditing ? `<div style="margin-top:8px;">${editBar}</div>` : '');
  switchFormTab(initialTabId);
}

function switchFormTab(tabId) {
  qsa('.form-tab').forEach(t => t.classList.remove('active'));
  const tabEl = qs(`.form-tab[data-tab="${tabId}"]`);
  if (tabEl && !tabEl.classList.contains('disabled')) tabEl.classList.add('active');

  const task = getTaskById(state.currentTaskId);
  if (!task || !task.formData) return;
  const isEditing = !!(state._editMode && state._editMode[task.id]);
  const abas = isEditing && state._editDraft[task.id] ? state._editDraft[task.id] : task.formData.abas;
  const abaData = abas && abas[tabId];
  const bodyEl = qs('#form-tab-body');
  if (!bodyEl) return;

  if (abaData && abaData.disabled) {
    bodyEl.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; background: var(--surface-subtle); border-radius: 10px;">
        <i data-lucide="lock" class="w-8 h-8 mx-auto mb-3" style="color: var(--text-tertiary);"></i>
        <div style="color: var(--text-secondary); font-size: 13px;">${abaData.reason}</div>
      </div>
    `;
    refreshIcons();
    return;
  }

  const html = window.FLOW_CONFIG.renderFormTab(tabId, abaData || {});
  bodyEl.innerHTML = html;
  refreshIcons();
}

function roField(label, value) {
  const isEmpty = !value || value === '—';
  return `<div><div class="field-label">${label}</div><div class="field-value ${isEmpty ? 'empty' : ''}">${value || '—'}</div></div>`;
}

function renderSubsection(title, obj) {
  if (!obj) return '';
  const fields = Object.entries(obj).map(([k, v]) => roField(k, v)).join('');
  return `<div class="subsection-title">${title}</div><div class="field-group">${fields}</div>`;
}

function renderAttachments(title, list) {
  if (!list || !list.length) return '';
  return `<div class="subsection-title">${title}</div>
    <div class="flex flex-wrap gap-2">
      ${list.map(a => `
        <div class="attachment">
          <i data-lucide="paperclip" class="w-4 h-4" style="color: var(--text-tertiary);"></i>
          <span>${a.nome}</span>
          <span style="color: var(--text-tertiary); font-size: 11px;">· ${a.tipo}</span>
        </div>
      `).join('')}
    </div>`;
}

/* ============================================================
   EDIT MODE — helpers de campo editável
   ============================================================ */
function efText(label, value, tab, section, field) {
  return `<div class="ef-field"><div class="ef-label">${label}</div><input class="ef-input" type="text" value="${(value || '').replace(/"/g, '&quot;')}" data-tab="${tab}" data-section="${section}" data-field="${field}" oninput="onFieldEdit(this)"/></div>`;
}
function efDate(label, value, tab, section, field) {
  const id = ('dp-' + tab + '-' + section + '-' + field).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '_');
  const calIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  return `<div class="ef-field"><div class="ef-label">${label}</div><div class="ef-datepicker" id="${id}"><input class="ef-input ef-datepicker-input" type="text" placeholder="dd/mm/aaaa" value="${(value || '').replace(/"/g, '&quot;')}" readonly data-tab="${tab}" data-section="${section}" data-field="${field}" onclick="toggleDatePicker('${id}')"/><button type="button" class="ef-datepicker-btn" onclick="toggleDatePicker('${id}')">${calIcon}</button><div class="ef-cal-popup" data-year="" data-month=""></div></div></div>`;
}
function efNumber(label, value, tab, section, field) {
  return `<div class="ef-field"><div class="ef-label">${label}</div><input class="ef-input" type="number" value="${value || ''}" data-tab="${tab}" data-section="${section}" data-field="${field}" oninput="onFieldEdit(this)"/></div>`;
}
function efCurrency(label, value, tab, section, field) {
  return `<div class="ef-field"><div class="ef-label">${label}</div><div style="position:relative;"><span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--text-secondary);">R$</span><input class="ef-input" type="text" style="padding-left:28px;" value="${(value || '').replace('R$ ', '').replace(/"/g, '&quot;')}" data-tab="${tab}" data-section="${section}" data-field="${field}" oninput="onFieldEdit(this)"/></div></div>`;
}
function efSelect(label, value, tab, section, field, options) {
  const opts = options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return `<option value="${v}" ${(v === value || l === value) ? 'selected' : ''}>${l}</option>`;
  }).join('');
  return `<div class="ef-field"><div class="ef-label">${label}</div><select class="ef-select" data-tab="${tab}" data-section="${section}" data-field="${field}" onchange="onFieldEdit(this)"><option value="">— Selecione —</option>${opts}</select></div>`;
}
function efToggle(label, value, tab, section, field, opts) {
  const btns = opts.map(o => `<button type="button" class="ef-toggle-btn ${o === value ? 'active' : ''}" onclick="onToggleEdit(this,'${tab}','${section}','${field}','${o}')">${o}</button>`).join('');
  return `<div class="ef-field"><div class="ef-label">${label}</div><div class="ef-toggle-group">${btns}</div></div>`;
}
function efTextarea(label, value, tab, section, field) {
  return `<div class="ef-field" style="grid-column:1/-1;"><div class="ef-label">${label}</div><textarea class="ef-textarea" data-tab="${tab}" data-section="${section}" data-field="${field}" oninput="onFieldEdit(this)">${value || ''}</textarea></div>`;
}

/* ── Helpers para campos dentro de itens de lista (ex.: dependentes) ── */
const DEPENDENTE_TIPO_OPTIONS = [
  '01 - Cônjuge ou companheiro(a) com o(a) qual tenha filho ou viva há mais de 5 anos',
  '02 - Filho(a) ou enteado(a) até 21 anos',
  '04 - Filho(a) ou enteado(a) em qualquer idade, quando incapacitado física e/ou mentalmente para o trabalho',
  '05 - Irmão(ã), neto(a) ou bisneto(a) sem arrimo dos pais, do qual detenha guarda judicial, até 21 anos',
  '07 - Irmão(ã), neto(a) ou bisneto(a) sem arrimo dos pais, do(a) qual detenha guarda judicial, em qualquer idade, quando incapacitado física e/ou mentalmente para o trabalho',
  '08 - Pais, avós e bisavós',
  '09 - Menor pobre, até 21 anos, que crie e eduque e do qual detenha guarda judicial',
  '10 - Pessoa absolutamente incapaz, da qual seja tutor ou curador',
  'Outros',
];

const DEPENDENTE_DEFAULTS = {
  'Nome': '',
  'Data de nascimento': '',
  'CPF': '',
  'Local de nascimento': '',
  'Tipo de dependência': '',
  'Matrícula': '',
  'Cartório': '',
  'Número registro': '',
  'Número livro': '',
  'Número folha': '',
  'Número da DNV': '',
  'Data de entrega do documento': '',
  'Pensão alimentícia': 'NAO',
  'Determinar fim da pensão': '',
  'Salário família': 'NAO',
  'Vencimento do atestado de frequência escolar para o salário família': '',
  'Vencimento da carteira de vacinação para o salário família': '',
  'IRRF': 'NAO',
  'Determinar fim IRRF': '',
  'Idade até': '',
};

const UF_OPTIONS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];

/* ---- Cache de municípios (IBGE) usado pelos formulários ---- */
const __municipiosCache = new Map();
const __municipiosInflight = new Map();
function getMunicipiosForUf(uf) {
  if (!uf) return [];
  return __municipiosCache.get(uf) || [];
}
function ensureMunicipiosForUf(uf, onDone) {
  if (!uf) return;
  if (__municipiosCache.has(uf)) { onDone && onDone(__municipiosCache.get(uf)); return; }
  if (__municipiosInflight.has(uf)) { __municipiosInflight.get(uf).then(onDone || (()=>{})); return; }
  const promise = fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      const names = Array.isArray(data) ? data.map(d => d.nome).sort((a,b) => a.localeCompare(b, 'pt-BR')) : [];
      __municipiosCache.set(uf, names);
      __municipiosInflight.delete(uf);
      return names;
    })
    .catch(() => { __municipiosInflight.delete(uf); return []; });
  __municipiosInflight.set(uf, promise);
  if (onDone) promise.then(onDone);
}

const DEPENDENTES_DISABLED_REASON = 'Colaborador não declarou dependentes. Esta aba só é habilitada quando houver dependentes informados.';

const ESTRANGEIRO_CONDICAO_OPTIONS = ['Temporário','Permanente','Refugiado','Asilado'];

const ESTRANGEIRO_DEFAULTS = {
  'Condição': '',
  'Data de Chegada': '',
  'Processo MTE': '',
  'Carteira de Trabalho - Validade': '',
  'RNE - Número': '',
  'RNE - Data de Expedição': '',
  'RNE - Órgão Emissor': '',
  'RNE - Data de Validade': '',
  'Casado com Brasileiro': 'NAO',
  'Filhos com Brasileiro': 'NAO',
};

function _getPaisNacionalidade() {
  const taskId = state.currentTaskId;
  const editing = !!(state._editMode && state._editMode[taskId]);
  if (editing && state._editDraft[taskId] && state._editDraft[taskId].pessoal && state._editDraft[taskId].pessoal.pessoais) {
    return state._editDraft[taskId].pessoal.pessoais['País de nacionalidade'] || 'Brasil';
  }
  const task = getTaskById(taskId);
  const pess = task && task.formData && task.formData.abas && task.formData.abas.pessoal && task.formData.abas.pessoal.pessoais;
  return (pess && pess['País de nacionalidade']) || 'Brasil';
}

function renderEstrangeiroSection(estrangeiroData, editing) {
  const pais = _getPaisNacionalidade();
  const isBrasileiro = pais === 'Brasil';
  if (isBrasileiro) {
    return `<div class="subsection-title">Documentos de estrangeiro</div>`
      + `<div style="display:flex;gap:10px;align-items:flex-start;padding:14px 16px;background:var(--surface-subtle);border:1px solid var(--border);border-radius:10px;font-size:13px;color:var(--text-secondary);"><i data-lucide="info" style="width:16px;height:16px;flex-shrink:0;margin-top:2px;color:var(--text-tertiary);"></i><div>Você informou o país de nacionalidade <strong>Brasil</strong>, então essa seção não precisa ser preenchida.</div></div>`;
  }
  const e = estrangeiroData || {};
  if (!editing) {
    return `<div class="subsection-title">Documentos de estrangeiro</div>`
      + `<div class="field-group" style="margin-bottom:24px;">`
      +   roField('Condição', e['Condição'])
      +   roField('Data de Chegada', e['Data de Chegada'])
      +   roField('Processo MTE', e['Processo MTE'])
      +   roField('Carteira de Trabalho - Validade', e['Carteira de Trabalho - Validade'])
      +   roField('RNE - Número', e['RNE - Número'])
      +   roField('RNE - Data de Expedição', e['RNE - Data de Expedição'])
      +   roField('RNE - Órgão Emissor', e['RNE - Órgão Emissor'])
      +   roField('RNE - Data de Validade', e['RNE - Data de Validade'])
      +   roField('Casado com Brasileiro', e['Casado com Brasileiro'])
      +   roField('Filhos com Brasileiro', e['Filhos com Brasileiro'])
      + `</div>`;
  }
  return `
    <div class="subsection-title" style="margin-bottom:16px;">Documentos de estrangeiro</div>
    <div class="field-group field-group-2" style="margin-bottom:24px;">
      ${efSelect('Condição', e['Condição'], 'documentos', 'estrangeiro', 'Condição', ESTRANGEIRO_CONDICAO_OPTIONS)}
      ${efDate('Data de Chegada', e['Data de Chegada'], 'documentos', 'estrangeiro', 'Data de Chegada')}
      ${efText('Processo MTE', e['Processo MTE'], 'documentos', 'estrangeiro', 'Processo MTE')}
      ${efDate('Carteira de Trabalho - Validade', e['Carteira de Trabalho - Validade'], 'documentos', 'estrangeiro', 'Carteira de Trabalho - Validade')}
      ${efText('RNE - Número', e['RNE - Número'], 'documentos', 'estrangeiro', 'RNE - Número')}
      ${efDate('RNE - Data de Expedição', e['RNE - Data de Expedição'], 'documentos', 'estrangeiro', 'RNE - Data de Expedição')}
      ${efText('RNE - Órgão Emissor', e['RNE - Órgão Emissor'], 'documentos', 'estrangeiro', 'RNE - Órgão Emissor')}
      ${efDate('RNE - Data de Validade', e['RNE - Data de Validade'], 'documentos', 'estrangeiro', 'RNE - Data de Validade')}
      ${efToggle('Casado com Brasileiro', e['Casado com Brasileiro'], 'documentos', 'estrangeiro', 'Casado com Brasileiro', ['NAO','SIM'])}
      ${efToggle('Filhos com Brasileiro', e['Filhos com Brasileiro'], 'documentos', 'estrangeiro', 'Filhos com Brasileiro', ['NAO','SIM'])}
    </div>
  `;
}

function efMonthYear(label, value, tab, section, field) {
  let nativeValue = '';
  const m = (value || '').match(/^(\d{2})\/(\d{4})$/);
  if (m) nativeValue = `${m[2]}-${m[1]}`;
  return `<div class="ef-field"><div class="ef-label">${label}</div><input class="ef-input" type="month" value="${nativeValue}" data-tab="${tab}" data-section="${section}" data-field="${field}" onchange="onMonthYearEdit(this)"/></div>`;
}

function onMonthYearEdit(el) {
  const m = (el.value || '').match(/^(\d{4})-(\d{2})$/);
  const formatted = m ? `${m[2]}/${m[1]}` : '';
  const { tab, section, field } = el.dataset;
  const taskId = state.currentTaskId;
  if (!state._editDraft[taskId] || !state._editDraft[taskId][tab]) return;
  if (!state._editDraft[taskId][tab][section]) state._editDraft[taskId][tab][section] = {};
  state._editDraft[taskId][tab][section][field] = formatted;
}

function efListText(label, value, tab, listKey, depId, field, opts) {
  opts = opts || {};
  const dis = opts.disabled ? 'disabled style="opacity:0.5;"' : '';
  return `<div class="ef-field"><div class="ef-label">${label}</div><input class="ef-input" type="text" value="${(value||'').replace(/"/g,'&quot;')}" data-tab="${tab}" data-list-key="${listKey}" data-dep-id="${depId}" data-field="${field}" oninput="onListFieldEdit(this)" ${dis}/></div>`;
}
function efListDate(label, value, tab, listKey, depId, field, opts) {
  opts = opts || {};
  const id = ('dpl-' + tab + '-' + listKey + '-' + depId + '-' + field).replace(/\s+/g,'-').replace(/[^a-zA-Z0-9\-]/g,'_');
  const calIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  const disabled = opts.disabled;
  const inputClick = disabled ? '' : `onclick="toggleDatePicker('${id}')"`;
  const btnClick = disabled ? '' : `onclick="toggleDatePicker('${id}')"`;
  const dim = disabled ? 'opacity:0.5;pointer-events:none;' : '';
  return `<div class="ef-field"><div class="ef-label">${label}</div><div class="ef-datepicker" id="${id}" style="${dim}"><input class="ef-input ef-datepicker-input" type="text" placeholder="dd/mm/aaaa" value="${(value||'').replace(/"/g,'&quot;')}" readonly data-tab="${tab}" data-list-key="${listKey}" data-dep-id="${depId}" data-field="${field}" ${inputClick} ${disabled?'disabled':''}/><button type="button" class="ef-datepicker-btn" ${btnClick}>${calIcon}</button><div class="ef-cal-popup" data-year="" data-month=""></div></div></div>`;
}
function efListSelect(label, value, tab, listKey, depId, field, options) {
  const opts = options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return `<option value="${v}" ${(v === value || l === value) ? 'selected' : ''}>${l}</option>`;
  }).join('');
  return `<div class="ef-field"><div class="ef-label">${label}</div><select class="ef-select" data-tab="${tab}" data-list-key="${listKey}" data-dep-id="${depId}" data-field="${field}" onchange="onListFieldEdit(this)"><option value="">— Selecione —</option>${opts}</select></div>`;
}
function efListToggle(label, value, tab, listKey, depId, field, opts) {
  const btns = opts.map(o => `<button type="button" class="ef-toggle-btn ${o === value ? 'active' : ''}" onclick="onListToggleEdit(this,'${tab}','${listKey}','${depId}','${field}','${o}')">${o}</button>`).join('');
  return `<div class="ef-field"><div class="ef-label">${label}</div><div class="ef-toggle-group">${btns}</div></div>`;
}

function onListFieldEdit(el) {
  const { tab, listKey, depId, field } = el.dataset;
  const taskId = state.currentTaskId;
  const list = state._editDraft[taskId] && state._editDraft[taskId][tab] && state._editDraft[taskId][tab][listKey];
  if (!Array.isArray(list)) return;
  const dep = list.find(d => d.id === depId);
  if (!dep) return;
  dep[field] = el.value;
  const item = el.closest('.exec-ref-item');
  if (!item) return;
  if (field === 'Nome') {
    const nameEl = item.querySelector('.exec-ref-trigger [data-role="nome"]');
    if (nameEl) nameEl.textContent = el.value || '(sem nome)';
  } else if (field === 'Tipo de dependência') {
    const tipoEl = item.querySelector('.exec-ref-trigger [data-role="tipo"]');
    if (tipoEl) tipoEl.textContent = el.value ? `· ${el.value}` : '';
  }
}

function onListToggleEdit(btn, tab, listKey, depId, field, value) {
  btn.closest('.ef-toggle-group').querySelectorAll('.ef-toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const taskId = state.currentTaskId;
  const list = state._editDraft[taskId] && state._editDraft[taskId][tab] && state._editDraft[taskId][tab][listKey];
  if (!Array.isArray(list)) return;
  const dep = list.find(d => d.id === depId);
  if (!dep) return;
  dep[field] = value;
  if (field === 'IRRF' || field === 'Pensão alimentícia' || field === 'Salário família') {
    switchFormTab('dependentes');
    setTimeout(() => {
      const item = document.querySelector(`.exec-ref-item[data-dep-id="${depId}"]`);
      if (item) {
        const trigger = item.querySelector('.exec-ref-trigger');
        const content = item.querySelector('.exec-ref-content');
        if (trigger && content) { content.style.display = 'block'; trigger.classList.add('open'); }
      }
      if (window.lucide) lucide.createIcons();
    }, 0);
  }
}

function toggleDependenteAccordion(btn) {
  const item = btn.closest('.exec-ref-item');
  if (!item) return;
  const content = item.querySelector('.exec-ref-content');
  if (!content) return;
  const isOpen = content.style.display !== 'none';
  content.style.display = isOpen ? 'none' : 'block';
  btn.classList.toggle('open', !isOpen);
  if (window.lucide) lucide.createIcons();
}

function addDependente() {
  const taskId = state.currentTaskId;
  const draft = state._editDraft[taskId];
  if (!draft) return;
  if (!draft.dependentes || draft.dependentes.disabled) {
    draft.dependentes = { lista: [] };
  }
  if (!Array.isArray(draft.dependentes.lista)) draft.dependentes.lista = [];
  const id = 'dep-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  draft.dependentes.lista.push({ ...DEPENDENTE_DEFAULTS, id, _isNew: true });
  switchFormTab('dependentes');
  setTimeout(() => {
    const item = document.querySelector(`.exec-ref-item[data-dep-id="${id}"]`);
    if (item) {
      const trigger = item.querySelector('.exec-ref-trigger');
      const content = item.querySelector('.exec-ref-content');
      if (trigger && content) { content.style.display = 'block'; trigger.classList.add('open'); }
      const nameInput = item.querySelector('input[data-field="Nome"]');
      if (nameInput) nameInput.focus();
    }
    if (window.lucide) lucide.createIcons();
  }, 0);
}

function removeDependente(depId) {
  const taskId = state.currentTaskId;
  const draft = state._editDraft[taskId];
  if (!draft || !draft.dependentes || !Array.isArray(draft.dependentes.lista)) return;
  const dep = draft.dependentes.lista.find(d => d.id === depId);
  const nome = dep ? (dep['Nome'] || 'sem nome') : 'sem nome';
  showConfirmModal({
    title: 'Remover dependente?',
    message: `O dependente <strong>${nome}</strong> será removido da lista.`,
    confirmLabel: 'Remover',
    danger: true,
    onConfirm: () => {
      const d = state._editDraft[taskId];
      if (!d || !d.dependentes || !Array.isArray(d.dependentes.lista)) return;
      d.dependentes.lista = d.dependentes.lista.filter(x => x.id !== depId);
      switchFormTab('dependentes');
    }
  });
}

function syncDependentesTabAvailability(value, originBtn) {
  const taskId = state.currentTaskId;
  const draft = state._editDraft[taskId];
  if (!draft) return;
  const cur = draft.dependentes || {};
  const lista = Array.isArray(cur.lista) ? cur.lista : [];

  const updateToggleVisual = (val) => {
    if (!originBtn) return;
    const grp = originBtn.closest('.ef-toggle-group');
    if (grp) grp.querySelectorAll('.ef-toggle-btn').forEach(b => b.classList.toggle('active', b.textContent.trim() === val));
  };

  const apply = (val) => {
    draft.pessoal.pessoais['Possui Dependentes'] = val;
    if (val === 'SIM') {
      draft.dependentes = { lista: lista };
    } else {
      draft.dependentes = { disabled: true, reason: DEPENDENTES_DISABLED_REASON };
    }
    const tabEl = document.querySelector('.form-tab[data-tab="dependentes"]');
    if (tabEl) {
      if (val === 'SIM') {
        tabEl.classList.remove('disabled');
        tabEl.removeAttribute('title');
        tabEl.setAttribute('onclick', "switchFormTab('dependentes')");
        const lock = tabEl.querySelector('i[data-lucide="lock"]');
        if (lock) lock.remove();
      } else {
        tabEl.classList.add('disabled');
        tabEl.setAttribute('title', DEPENDENTES_DISABLED_REASON);
        tabEl.removeAttribute('onclick');
        if (!tabEl.querySelector('i[data-lucide="lock"]')) {
          const lock = document.createElement('i');
          lock.setAttribute('data-lucide', 'lock');
          lock.style.cssText = 'width:12px;height:12px;opacity:0.6;';
          tabEl.appendChild(lock);
          if (window.lucide) lucide.createIcons();
        }
        if (tabEl.classList.contains('active')) switchFormTab('pessoal');
      }
    }
  };

  if (value === 'NAO' && lista.length > 0) {
    // Reverte visualmente para SIM enquanto o modal está aberto
    draft.pessoal.pessoais['Possui Dependentes'] = 'SIM';
    updateToggleVisual('SIM');
    showConfirmModal({
      title: 'Remover dependentes cadastrados?',
      message: `Marcar "Possui Dependentes" como NÃO vai remover os <strong>${lista.length} dependente(s)</strong> já cadastrados.`,
      confirmLabel: 'Remover',
      danger: true,
      onConfirm: () => {
        apply('NAO');
        updateToggleVisual('NAO');
      }
    });
    return;
  }
  apply(value);
}

function renderDependentesTab(d, editing) {
  const lista = (d && Array.isArray(d.lista)) ? d.lista : [];
  if (!editing) {
    if (lista.length === 0) {
      return `<div style="color:var(--text-tertiary);font-size:13px;padding:20px 0;">Nenhum dependente cadastrado.</div>`;
    }
    return `<div class="subsection-title">Dependentes cadastrados (${lista.length})</div>`
      + `<div class="exec-ref-card" style="margin-top:0;">`
      + lista.map(dep => _renderDependenteAccordionRO(dep)).join('')
      + `</div>`;
  }
  const headerCount = `<div class="subsection-title">Dependentes cadastrados (${lista.length})</div>`;
  const accordions = lista.length > 0
    ? `<div class="exec-ref-card" style="margin-top:0;margin-bottom:16px;">` + lista.map(dep => _renderDependenteAccordionEdit(dep)).join('') + `</div>`
    : `<div style="color:var(--text-tertiary);font-size:13px;padding:8px 0 16px;">Nenhum dependente cadastrado. Clique em "Adicionar dependente" para começar.</div>`;
  const addBtn = `<button onclick="addDependente()" style="display:inline-flex;align-items:center;gap:6px;padding:9px 16px;background:#fff;color:var(--text-primary);border:1px solid var(--border-strong);border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;"><i data-lucide="plus" style="width:14px;height:14px;"></i> Adicionar dependente</button>`;
  return headerCount + accordions + `<div style="display:flex;justify-content:flex-end;margin-bottom:24px;">${addBtn}</div>`;
}

function _renderDependenteAccordionRO(dep) {
  const nome = dep['Nome'] || '(sem nome)';
  const tipo = dep['Tipo de dependência'] || '';
  const tipoBadge = tipo ? `<span class="exec-ref-badge">· ${tipo}</span>` : '';
  const pensaoSim = dep['Pensão alimentícia'] === 'SIM';
  const salarioFamiliaSim = dep['Salário família'] === 'SIM';
  return `
    <div class="exec-ref-item" data-dep-id="${dep.id || ''}">
      <button class="exec-ref-trigger" onclick="toggleExecRefItem(this)">
        <span>${nome}${tipoBadge}</span>
        <i data-lucide="chevron-down" class="exec-ref-chevron" style="width:16px;height:16px;"></i>
      </button>
      <div class="exec-ref-content" style="display:none;">
        <div class="subsection-title" style="margin-top:8px;">Identificação</div>
        <div class="field-group" style="margin-bottom:20px;">
          ${roField('Nome', dep['Nome'])}
          ${roField('Data de nascimento', dep['Data de nascimento'])}
          ${roField('CPF', dep['CPF'])}
          ${roField('Local de nascimento', dep['Local de nascimento'])}
          ${roField('Tipo de dependência', dep['Tipo de dependência'])}
          ${roField('Matrícula', dep['Matrícula'])}
        </div>
        <div class="subsection-title">Documentos / Registro</div>
        <div class="field-group" style="margin-bottom:20px;">
          ${roField('Cartório', dep['Cartório'])}
          ${roField('Número registro', dep['Número registro'])}
          ${roField('Número livro', dep['Número livro'])}
          ${roField('Número folha', dep['Número folha'])}
          ${roField('Número da DNV', dep['Número da DNV'])}
          ${roField('Data de entrega do documento', dep['Data de entrega do documento'])}
        </div>
        <div class="subsection-title">Pensão alimentícia</div>
        <div class="field-group" style="margin-bottom:20px;">
          ${roField('Pensão alimentícia', dep['Pensão alimentícia'])}
          ${pensaoSim ? roField('Determinar fim da pensão', dep['Determinar fim da pensão']) : ''}
        </div>
        <div class="subsection-title">Salário família</div>
        <div class="field-group" style="margin-bottom:20px;">
          ${roField('Salário família', dep['Salário família'])}
          ${salarioFamiliaSim ? roField('Vencimento do atestado de frequência escolar para o salário família', dep['Vencimento do atestado de frequência escolar para o salário família']) : ''}
          ${salarioFamiliaSim ? roField('Vencimento da carteira de vacinação para o salário família', dep['Vencimento da carteira de vacinação para o salário família']) : ''}
        </div>
        <div class="subsection-title">Tributação e prazos</div>
        <div class="field-group">
          ${roField('IRRF', pensaoSim ? 'SIM' : dep['IRRF'])}
          ${(pensaoSim || dep['IRRF'] === 'SIM') ? roField('Determinar fim IRRF', dep['Determinar fim IRRF']) : ''}
          ${(pensaoSim || dep['IRRF'] === 'SIM') ? roField('Idade até', dep['Idade até']) : ''}
        </div>
      </div>
    </div>`;
}

function _renderDependenteAccordionEdit(dep) {
  const nome = dep['Nome'] || '(sem nome)';
  const tipo = dep['Tipo de dependência'] || '';
  const tipoBadge = tipo ? `<span class="exec-ref-badge" data-role="tipo">· ${tipo}</span>` : '<span class="exec-ref-badge" data-role="tipo"></span>';
  const id = dep.id;
  const tab = 'dependentes', listKey = 'lista';
  const pensaoSim = dep['Pensão alimentícia'] === 'SIM';
  const salarioFamiliaSim = dep['Salário família'] === 'SIM';
  const irrfAtivo = pensaoSim || dep['IRRF'] === 'SIM';
  const irrfToggleHtml = pensaoSim
    ? `<div class="ef-field"><div class="ef-label">IRRF</div><div class="ef-toggle-group" style="opacity:0.5;pointer-events:none;">${['NAO','SIM'].map(o => `<button type="button" class="ef-toggle-btn ${o === 'SIM' ? 'active' : ''}" disabled>${o}</button>`).join('')}</div></div>`
    : efListToggle('IRRF', dep['IRRF'], 'dependentes', 'lista', dep.id, 'IRRF', ['NAO','SIM']);
  return `
    <div class="exec-ref-item" data-dep-id="${id}">
      <div style="display:flex;align-items:stretch;">
        <button class="exec-ref-trigger" onclick="toggleDependenteAccordion(this)" style="flex:1;">
          <span><span data-role="nome">${nome}</span>${tipoBadge}</span>
          <i data-lucide="chevron-down" class="exec-ref-chevron" style="width:16px;height:16px;"></i>
        </button>
        <button onclick="removeDependente('${id}')" title="Remover dependente" style="padding:0 18px;border:none;background:none;cursor:pointer;color:var(--danger);display:flex;align-items:center;border-left:1px solid var(--border);">
          <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
        </button>
      </div>
      <div class="exec-ref-content" style="display:none;">
        <div class="subsection-title" style="margin-top:8px;">Identificação</div>
        <div class="field-group field-group-2" style="margin-bottom:20px;">
          ${efListText('Nome', dep['Nome'], tab, listKey, id, 'Nome')}
          ${efListDate('Data de nascimento', dep['Data de nascimento'], tab, listKey, id, 'Data de nascimento')}
          ${efListText('CPF', dep['CPF'], tab, listKey, id, 'CPF')}
          ${efListSelect('Local de nascimento', dep['Local de nascimento'], tab, listKey, id, 'Local de nascimento', UF_OPTIONS)}
          ${efListSelect('Tipo de dependência', dep['Tipo de dependência'], tab, listKey, id, 'Tipo de dependência', DEPENDENTE_TIPO_OPTIONS)}
          ${efListText('Matrícula', dep['Matrícula'], tab, listKey, id, 'Matrícula')}
        </div>
        <div class="subsection-title">Documentos / Registro</div>
        <div class="field-group field-group-2" style="margin-bottom:20px;">
          ${efListText('Cartório', dep['Cartório'], tab, listKey, id, 'Cartório')}
          ${efListText('Número registro', dep['Número registro'], tab, listKey, id, 'Número registro')}
          ${efListText('Número livro', dep['Número livro'], tab, listKey, id, 'Número livro')}
          ${efListText('Número folha', dep['Número folha'], tab, listKey, id, 'Número folha')}
          ${efListText('Número da DNV', dep['Número da DNV'], tab, listKey, id, 'Número da DNV')}
          ${efListDate('Data de entrega do documento', dep['Data de entrega do documento'], tab, listKey, id, 'Data de entrega do documento')}
        </div>
        <div class="subsection-title">Pensão alimentícia</div>
        <div class="field-group field-group-2" style="margin-bottom:20px;">
          ${efListToggle('Pensão alimentícia', dep['Pensão alimentícia'], tab, listKey, id, 'Pensão alimentícia', ['NAO','SIM'])}
          ${pensaoSim ? efListDate('Determinar fim da pensão', dep['Determinar fim da pensão'], tab, listKey, id, 'Determinar fim da pensão') : ''}
        </div>
        <div class="subsection-title">Salário família</div>
        <div class="field-group field-group-2" style="margin-bottom:20px;">
          ${efListToggle('Salário família', dep['Salário família'], tab, listKey, id, 'Salário família', ['NAO','SIM'])}
          ${salarioFamiliaSim ? efListDate('Vencimento do atestado de frequência escolar para o salário família', dep['Vencimento do atestado de frequência escolar para o salário família'], tab, listKey, id, 'Vencimento do atestado de frequência escolar para o salário família') : ''}
          ${salarioFamiliaSim ? efListDate('Vencimento da carteira de vacinação para o salário família', dep['Vencimento da carteira de vacinação para o salário família'], tab, listKey, id, 'Vencimento da carteira de vacinação para o salário família') : ''}
        </div>
        <div class="subsection-title">Tributação e prazos</div>
        <div class="field-group field-group-2">
          ${irrfToggleHtml}
          ${irrfAtivo ? efListDate('Determinar fim IRRF', dep['Determinar fim IRRF'], tab, listKey, id, 'Determinar fim IRRF') : ''}
          ${irrfAtivo ? efListText('Idade até', dep['Idade até'], tab, listKey, id, 'Idade até') : ''}
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:24px;padding-top:16px;border-top:1px solid var(--border);">
          <button onclick="cancelDependente('${id}')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:#fff;border:1px solid var(--border-strong);border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;color:var(--text-primary);">Cancelar</button>
          <button onclick="confirmDependente('${id}')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 18px;background:var(--brand-pink);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">Adicionar</button>
        </div>
      </div>
    </div>`;
}

function confirmDependente(depId) {
  const taskId = state.currentTaskId;
  const draft = state._editDraft[taskId];
  if (!draft || !draft.dependentes || !Array.isArray(draft.dependentes.lista)) return;
  const dep = draft.dependentes.lista.find(d => d.id === depId);
  if (!dep) return;
  if (dep._isNew) delete dep._isNew;
  const item = document.querySelector(`.exec-ref-item[data-dep-id="${depId}"]`);
  if (item) {
    const trigger = item.querySelector('.exec-ref-trigger');
    const content = item.querySelector('.exec-ref-content');
    if (trigger && content) { content.style.display = 'none'; trigger.classList.remove('open'); }
  }
}

function cancelDependente(depId) {
  const taskId = state.currentTaskId;
  const draft = state._editDraft[taskId];
  if (!draft || !draft.dependentes || !Array.isArray(draft.dependentes.lista)) return;
  const dep = draft.dependentes.lista.find(d => d.id === depId);
  if (!dep) return;
  if (dep._isNew) {
    showConfirmModal({
      title: 'Descartar dependente?',
      message: 'Os dados preenchidos para este novo dependente serão perdidos.',
      confirmLabel: 'Descartar',
      danger: true,
      onConfirm: () => {
        const d = state._editDraft[taskId];
        if (d && d.dependentes && Array.isArray(d.dependentes.lista)) {
          d.dependentes.lista = d.dependentes.lista.filter(x => x.id !== depId);
        }
        switchFormTab('dependentes');
      }
    });
    return;
  }
  const task = getTaskById(taskId);
  const origLista = (task && task.formData && task.formData.abas && task.formData.abas.dependentes && Array.isArray(task.formData.abas.dependentes.lista))
    ? task.formData.abas.dependentes.lista : [];
  const orig = origLista.find(d => d.id === depId);
  if (!orig) return;
  const hasChanges = Object.keys(orig).some(k => k !== 'id' && String(orig[k] || '') !== String(dep[k] || ''));
  const doRestore = () => {
    const d = state._editDraft[taskId];
    const idx = d.dependentes.lista.findIndex(x => x.id === depId);
    if (idx >= 0) d.dependentes.lista[idx] = JSON.parse(JSON.stringify(orig));
    switchFormTab('dependentes');
  };
  if (!hasChanges) { doRestore(); return; }
  showConfirmModal({
    title: 'Descartar alterações?',
    message: 'As alterações feitas neste dependente serão revertidas para o estado original.',
    confirmLabel: 'Descartar',
    danger: true,
    onConfirm: doRestore
  });
}

function onFieldEdit(el) {
  if (el.dataset && el.dataset.listKey) { onListFieldEdit(el); return; }
  const { tab, section, field } = el.dataset;
  const taskId = state.currentTaskId;
  if (!state._editDraft[taskId] || !state._editDraft[taskId][tab]) return;
  if (!state._editDraft[taskId][tab][section]) state._editDraft[taskId][tab][section] = {};
  state._editDraft[taskId][tab][section][field] = el.value;
  if (tab === 'pessoal' && section === 'pessoais' && field === 'País de nacionalidade') {
    const docTab = qs('.form-tab.active[data-tab="documentos"]');
    if (docTab) switchFormTab('documentos');
  }
  if (typeof window.onFieldEditAfter === 'function') {
    try { window.onFieldEditAfter(tab, section, field, el.value); } catch (e) { /* noop */ }
  }
}

/* ============================================================
   DATE PICKER
   ============================================================ */
const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                   'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function toggleDatePicker(id) {
  const popup = document.querySelector('#' + id + ' .ef-cal-popup');
  if (!popup) return;
  if (popup.classList.contains('open')) { popup.classList.remove('open'); return; }
  document.querySelectorAll('.ef-cal-popup.open').forEach(p => p.classList.remove('open'));
  const input = document.querySelector('#' + id + ' .ef-datepicker-input');
  const parts = (input.value || '').split('/');
  const today = new Date();
  popup.dataset.year  = parts.length === 3 ? parseInt(parts[2]) : today.getFullYear();
  popup.dataset.month = parts.length === 3 ? parseInt(parts[1]) - 1 : today.getMonth();
  renderCalGrid(id);
  popup.classList.add('open');
}

function navCalMonth(id, delta) {
  const popup = document.querySelector('#' + id + ' .ef-cal-popup');
  let month = parseInt(popup.dataset.month) + delta;
  let year  = parseInt(popup.dataset.year);
  if (month < 0)  { month = 11; year--; }
  if (month > 11) { month = 0;  year++; }
  popup.dataset.month = month;
  popup.dataset.year  = year;
  renderCalGrid(id);
}

function renderCalGrid(id) {
  const popup  = document.querySelector('#' + id + ' .ef-cal-popup');
  const year   = parseInt(popup.dataset.year);
  const month  = parseInt(popup.dataset.month);
  const input  = document.querySelector('#' + id + ' .ef-datepicker-input');
  const parts  = (input.value || '').split('/');
  const selDay = parts.length === 3 ? parseInt(parts[0]) : -1;
  const selMon = parts.length === 3 ? parseInt(parts[1]) - 1 : -1;
  const selYr  = parts.length === 3 ? parseInt(parts[2]) : -1;
  const today  = new Date();
  const first  = new Date(year, month, 1).getDay();
  const days   = new Date(year, month + 1, 0).getDate();
  let html = `<div class="ef-cal-header"><button class="ef-cal-nav" onclick="navCalMonth('${id}',-1)">&#8249;</button><span class="ef-cal-month-label">${MONTHS_PT[month]} ${year}</span><button class="ef-cal-nav" onclick="navCalMonth('${id}',1)">&#8250;</button></div><div class="ef-cal-weekdays"><span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span></div><div class="ef-cal-grid">`;
  for (let i = 0; i < first; i++) html += `<div class="ef-cal-day empty"></div>`;
  for (let d = 1; d <= days; d++) {
    const isSel   = d === selDay && month === selMon && year === selYr;
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const cls = 'ef-cal-day' + (isSel ? ' selected' : '') + (isToday ? ' today' : '');
    html += `<div class="${cls}" onclick="selectCalDate('${id}',${d},${month},${year})">${d}</div>`;
  }
  html += `</div>`;
  popup.innerHTML = html;
}

function selectCalDate(id, day, month, year) {
  const input = document.querySelector('#' + id + ' .ef-datepicker-input');
  input.value = String(day).padStart(2,'0') + '/' + String(month + 1).padStart(2,'0') + '/' + year;
  onFieldEdit(input);
  document.querySelector('#' + id + ' .ef-cal-popup').classList.remove('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.ef-datepicker')) {
    document.querySelectorAll('.ef-cal-popup.open').forEach(p => p.classList.remove('open'));
  }
});

function onToggleEdit(btn, tab, section, field, value) {
  btn.closest('.ef-toggle-group').querySelectorAll('.ef-toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const taskId = state.currentTaskId;
  if (!state._editDraft[taskId] || !state._editDraft[taskId][tab]) return;
  if (!state._editDraft[taskId][tab][section]) state._editDraft[taskId][tab][section] = {};
  state._editDraft[taskId][tab][section][field] = value;
  if (tab === 'pessoal' && section === 'pessoais' && field === 'Possui Dependentes') {
    syncDependentesTabAvailability(value, btn);
  }
}

function onCheckboxEdit(el, tab, section, field, option) {
  const taskId = state.currentTaskId;
  if (!state._editDraft[taskId] || !state._editDraft[taskId][tab]) return;
  if (!state._editDraft[taskId][tab][section]) state._editDraft[taskId][tab][section] = {};
  let arr = Array.isArray(state._editDraft[taskId][tab][section][field]) ? [...state._editDraft[taskId][tab][section][field]] : [];
  if (el.checked) { if (!arr.includes(option)) arr.push(option); }
  else { arr = arr.filter(o => o !== option); }
  state._editDraft[taskId][tab][section][field] = arr;
}

function enterEditMode() {
  const task = getTaskById(state.currentTaskId);
  if (!task || !task.formData) return;
  const currentTab = _getActiveFormTabId();
  state._editMode[task.id] = true;
  state._editDraft[task.id] = JSON.parse(JSON.stringify(task.formData.abas));
  renderForm(task, currentTab);
}

function cancelEdits() {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  const currentTab = _getActiveFormTabId();
  const draft = state._editDraft[task.id];
  const hasChanges = draft && JSON.stringify(draft) !== JSON.stringify(task.formData.abas);
  const doCancelEdits = () => { state._editMode[task.id] = false; delete state._editDraft[task.id]; renderForm(task, currentTab); };
  if (!hasChanges) { doCancelEdits(); return; }
  showConfirmModal({
    title: 'Descartar alterações?',
    message: 'Há modificações não salvas. Descartar e sair do modo de edição?',
    confirmLabel: 'Descartar',
    danger: true,
    onConfirm: doCancelEdits,
  });
}

function saveEdits() {
  const task = getTaskById(state.currentTaskId);
  const draft = state._editDraft && state._editDraft[task.id];
  if (!draft) return;
  if (!state._editLog[task.id]) state._editLog[task.id] = [];
  const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const original = task.formData.abas;

  Object.keys(draft).forEach(tabId => {
    const origTab = original[tabId] || {};
    const draftTab = draft[tabId] || {};
    if (tabId === 'observacoes') {
      if (String(origTab.texto || '') !== String(draftTab.texto || '')) {
        state._editLog[task.id].push({ tabId, section: 'observacoes', field: 'Comentário', before: origTab.texto || '—', after: draftTab.texto || '—', changedBy: OPERATOR_NAME, changedAt: now });
      }
      return;
    }
    if (tabId === 'dependentes') {
      const origLista = (origTab && Array.isArray(origTab.lista)) ? origTab.lista : [];
      const draftLista = (draftTab && Array.isArray(draftTab.lista)) ? draftTab.lista : [];
      origLista.forEach(orig => {
        if (!draftLista.find(d => d.id === orig.id)) {
          state._editLog[task.id].push({ tabId, section: 'dependentes', field: 'Dependente removido', before: orig['Nome'] || '—', after: '—', changedBy: OPERATOR_NAME, changedAt: now });
        }
      });
      draftLista.forEach(d => {
        const orig = origLista.find(o => o.id === d.id);
        if (!orig) {
          state._editLog[task.id].push({ tabId, section: 'dependentes', field: 'Dependente adicionado', before: '—', after: d['Nome'] || '(sem nome)', changedBy: OPERATOR_NAME, changedAt: now });
        } else {
          Object.keys(d).forEach(k => {
            if (k === 'id' || k.startsWith('_')) return;
            if (String(orig[k] || '') !== String(d[k] || '')) {
              state._editLog[task.id].push({ tabId, section: 'dependentes', field: `${d['Nome'] || 'dep'} → ${k}`, before: orig[k] || '—', after: d[k] || '—', changedBy: OPERATOR_NAME, changedAt: now });
            }
          });
        }
      });
      return;
    }
    Object.keys(draftTab).forEach(sectionKey => {
      const origSection = origTab[sectionKey] || {};
      const draftSection = draftTab[sectionKey] || {};
      if (typeof draftSection !== 'object' || Array.isArray(draftSection)) return;
      Object.keys(draftSection).forEach(field => {
        if (String(origSection[field] || '') !== String(draftSection[field] || '')) {
          state._editLog[task.id].push({ tabId, section: sectionKey, field, before: origSection[field] || '—', after: draftSection[field] || '—', changedBy: OPERATOR_NAME, changedAt: now });
        }
      });
    });
  });

  const currentTab = _getActiveFormTabId();
  task.formData.abas = JSON.parse(JSON.stringify(draft));
  state._editMode[task.id] = false;
  delete state._editDraft[task.id];
  renderForm(task, currentTab);
  flash('Alterações salvas com sucesso.', 'success');
}

function showEditLog() {
  const task = getTaskById(state.currentTaskId);
  const log = (state._editLog && state._editLog[task.id]) || [];
  const existing = qs('#modal-edit-log');
  if (existing) existing.remove();

  const TAB = { geral: 'Geral', profissional: 'Profissional', pessoal: 'Pessoal', documentos: 'Documentos', dependentes: 'Dependentes', observacoes: 'Observações', solicitacao: 'Solicitação' };
  const SEC = { dadosBasicos: 'Dados Básicos', admissao: 'Admissão', contratoExperiencia: 'Contrato de Experiência', horario: 'Horário', ctps: 'Carteira Profissional', pis: 'PIS', pagamento: 'Pagamento', sindicais: 'Sindicais', endereco: 'Endereço', pessoais: 'Informações Pessoais', deficiencia: 'Portador de Deficiência', documentosProfissionais: 'Documentos Profissionais', documentos: 'Documentos', estrangeiro: 'Documentos de estrangeiro', dependentes: 'Dependentes', observacoes: 'Observações', campos: 'Campos', descricao: 'Descrição', anexos: 'Anexos' };

  const content = log.length === 0
    ? `<div style="color:var(--text-tertiary);text-align:center;padding:32px;">Nenhuma alteração registrada ainda.</div>`
    : log.map(e => `
      <div style="padding:14px 0;border-bottom:1px solid var(--border);">
        <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.04em;">${TAB[e.tabId] || e.tabId} · ${SEC[e.section] || e.section}</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:8px;">${e.field}</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <span style="background:var(--danger-soft);color:var(--danger);padding:3px 9px;border-radius:5px;font-size:12px;">${e.before}</span>
          <i data-lucide="arrow-right" style="width:12px;height:12px;color:var(--text-tertiary);flex-shrink:0;"></i>
          <span style="background:var(--success-soft);color:var(--success);padding:3px 9px;border-radius:5px;font-size:12px;">${e.after}</span>
        </div>
        <div style="font-size:11px;color:var(--text-tertiary);margin-top:6px;">operador: ${e.changedBy} · ${e.changedAt}</div>
      </div>`).join('');

  const el = document.createElement('div');
  el.id = 'modal-edit-log';
  el.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)closeEditLog()">
      <div style="background:#fff;border-radius:14px;width:520px;max-width:95vw;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.15);">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--border);">
          <div style="font-size:15px;font-weight:700;">Histórico de alterações</div>
          <button onclick="closeEditLog()" style="background:none;border:none;cursor:pointer;color:var(--text-tertiary);padding:4px;border-radius:6px;display:flex;align-items:center;"><i data-lucide="x" style="width:18px;height:18px;"></i></button>
        </div>
        <div style="overflow-y:auto;padding:4px 24px 24px;">${content}</div>
      </div>
    </div>`;
  document.body.appendChild(el);
  refreshIcons();
}

function closeEditLog() { const m = qs('#modal-edit-log'); if (m) m.remove(); }

/* ---- Modais genéricos de confirmação e alerta ---- */
function showConfirmModal({ title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', danger = false, onConfirm }) {
  const existing = qs('#modal-confirm');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'modal-confirm';
  el.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:300;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)_closeConfirmModal()">
      <div style="background:#fff;border-radius:14px;width:400px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.15);">
        <div style="padding:24px 24px 0;">
          <div style="font-size:15px;font-weight:700;margin-bottom:8px;">${title}</div>
          <div style="font-size:13.5px;color:var(--text-secondary);line-height:1.55;">${message}</div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;padding:20px 24px;">
          <button onclick="_closeConfirmModal()" style="padding:8px 16px;border:1px solid var(--border-strong);border-radius:8px;background:#fff;font-size:13px;font-weight:500;cursor:pointer;">${cancelLabel}</button>
          <button id="modal-confirm-ok" style="padding:8px 18px;border:none;border-radius:8px;background:${danger ? 'var(--danger)' : 'var(--brand-pink)'};color:#fff;font-size:13px;font-weight:600;cursor:pointer;">${confirmLabel}</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(el);
  qs('#modal-confirm-ok').onclick = () => { _closeConfirmModal(); onConfirm && onConfirm(); };
}
function _closeConfirmModal() { const m = qs('#modal-confirm'); if (m) m.remove(); }

/* Confirmação única pra TODO "X" de anexo do produto (passo final, conversa com o cliente,
   comentário interno, anexo de resolução). Remover é destrutivo e sem desfazer, e o X fica
   encostado no nome do arquivo — um clique errado apaga o anexo certo sem aviso.
   O NOME DO ARQUIVO VAI NO TEXTO: com três anexos na lista, é a única coisa que diz qual deles
   vai sumir. Quem chamar isto passa só o nome e o que fazer no "Remover". */
function confirmRemoveAttachment(fileName, onConfirm) {
  showConfirmModal({
    title: 'Remover este anexo?',
    message: esc(fileName || 'Este arquivo'),
    confirmLabel: 'Remover',
    danger: true,
    onConfirm,
  });
}

function showAlertModal({ title, message }) {
  const existing = qs('#modal-alert');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'modal-alert';
  el.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:300;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)qs('#modal-alert').remove()">
      <div style="background:#fff;border-radius:14px;width:380px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.15);">
        <div style="padding:24px 24px 0;">
          <div style="font-size:15px;font-weight:700;margin-bottom:8px;">${title}</div>
          <div style="font-size:13.5px;color:var(--text-secondary);line-height:1.55;">${message}</div>
        </div>
        <div style="display:flex;justify-content:flex-end;padding:20px 24px;">
          <button onclick="qs('#modal-alert').remove()" style="padding:8px 18px;border:none;border-radius:8px;background:var(--brand-pink);color:#fff;font-size:13px;font-weight:600;cursor:pointer;">Entendi</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(el);
}

/* ============================================================
   TIMELINE
   ============================================================ */
const TIMELINE_STEPS = [
  { id: 'received',   label: 'Solicitação recebida' },
  { id: 'validation', label: 'Validação do operador' },
  { id: 'processing', label: 'Processamento' },
  { id: 'done',       label: 'Concluída' },
];

// Componente ÚNICO de linha do tempo (dots + linha + label + sub). Usado pela timeline do
// cliente (estados da tarefa) E pelo stepper do Autopilot (macroetapas do fluxo) — muda só a
// lista de passos, o visual é sempre o mesmo. Mexeu aqui, muda em todos.
// steps: [{ label, meta, state }], state ∈ 'done' | 'active' | 'warn' (travou) | 'pending'.
function tlStepperHTML(steps) {
  const dotCls = { done: 'tl-dot-done', active: 'tl-dot-active', warn: 'tl-dot-warn', pending: 'tl-dot-pending' };
  return steps.map((s, i) => {
    const dot = s.state === 'done' ? '<i data-lucide="check" class="w-3 h-3"></i>' : String(i + 1);
    return `<div class="tl-item-h ${s.state}"><div class="tl-dot ${dotCls[s.state] || 'tl-dot-pending'}">${dot}</div><div class="tl-step">${esc(s.label)}</div><div class="tl-meta">${esc(s.meta || '')}</div></div>`;
  }).join('');
}

function renderTimelineHorizontal(targetEl, currentStepIdx, task, opts) {
  // Um fluxo pode sobrescrever os rótulos das etapas (ex.: Autopilot usa
  // "Atuação do operador" no lugar de "Validação do operador"). Sem override,
  // usa o padrão do DP. Mesmo mecanismo dos demais overrides do FLOW_CONFIG.
  // noActive: sem etapa "em andamento" — usado quando a tarefa está na fila
  // (só "recebida" concluída, o resto aguardando; ninguém está tocando ainda).
  const noActive = !!(opts && opts.noActive);
  const steps = (window.FLOW_CONFIG && FLOW_CONFIG.timelineSteps) || TIMELINE_STEPS;
  const mapped = steps.map((step, i) => {
    if (i < currentStepIdx) return { label: step.label, meta: 'Concluído', state: 'done' };
    if (i === currentStepIdx && !noActive) return { label: step.label, meta: 'Em andamento', state: 'active' };
    return { label: step.label, meta: 'Aguardando', state: 'pending' };
  });
  targetEl.innerHTML = tlStepperHTML(mapped);
}

/* ============================================================
   RENDER: TASK ANALYSIS
   ============================================================ */
// Faixa de identificação do header (base da Domínio, origem e colaborador).
// Mesmo conjunto que aparece na lista, pra o operador reconhecer a solicitação
// pelos mesmos âncoras. Campos vêm do mock (ver TAREFAS em lista-operador.html).
// Faixa abaixo do nome no header: Origem · ERP operado (origem primeiro). O
// colaborador NÃO entra aqui — já aparece no miolo (Dados da solicitação).
function olMetaStripHtml(task) {
  const sep = '<span style="color:var(--text-tertiary);">·</span>';
  const m = domMetaParts(task);
  return [m.origem, m.erp].join(sep);
}

/* Link "Abrir página do cliente" — injetado no header da tarefa, ao lado do CNPJ.
   Fonte única: vale pra QUALQUER tarefa (Hub e Autopilot), já que o header é o
   mesmo (renderTask). Idempotente — a tela de execução é reusada entre tarefas. */
function montarLinkCliente() {
  const cnpj = qs('#task-client-cnpj');
  if (!cnpj || qs('#client-page-link')) { refreshIcons(); return; }
  const a = document.createElement('a');
  a.id = 'client-page-link';
  a.className = 'client-link';
  a.href = 'https://app.bhub.ai/clientes/exemplo'; // link fake — abre em nova aba
  a.target = '_blank';
  a.rel = 'noopener';
  a.title = 'Abrir página do cliente';
  a.setAttribute('aria-label', 'Abrir página do cliente');
  a.innerHTML = '<i data-lucide="external-link"></i>'; // só o ícone; rótulo vai no tooltip
  cnpj.parentNode.appendChild(a);
  refreshIcons();
}

function renderTask(task) {
  qs('#task-id-label').textContent = task.id;
  qs('#task-type-label').textContent = task.type;
  qs('#task-client-name').textContent = task.clientName;
  qs('#task-client-cnpj').textContent = task.cnpj;
  qs('#task-meta-strip').innerHTML = olMetaStripHtml(task);
  qs('#task-client-logo').textContent = task.logoText;
  montarLinkCliente(); // botão "Abrir página do cliente" no header — toda tarefa
  qs('#task-solicitante').textContent = task.senderName;
  // Header alinhado ao modal de espiada: tarefa do robô = "Iniciado pelo … robô";
  // solicitação de cliente = "Solicitado por … cliente" + escopos.
  const isAP = task.origin === 'autopilot';
  qs('#task-solicitante-label').textContent = isAP ? 'Iniciado pelo' : 'Solicitado por';
  const scopes = task.senderScopes || [];
  qs('#task-solicitante-tags').innerHTML = isAP
    ? `<span class="contact-tag">robô</span>`
    : [`<span class="contact-tag contact-tag-client">cliente</span>`, ...scopes.map(s => `<span class="contact-tag">${s}</span>`)].join('');
  qs('#task-timestamp').textContent = `Solicitado em ${solicitadoEmLabel(task)}`;
  qs('#task-assignee').textContent = OPERATOR_NAME;
  renderTimelineHorizontal(qs('#task-timeline'), 1, task);
  renderClientAttachments(task);

  const msgs = state.messages[task.id] || [];
  const activityBlock = qs('#activity-block');
  if (msgs.length > 1) {
    activityBlock.classList.remove('hidden');
    qs('#activity-messages').innerHTML = `<div class="history-list">${msgs.map(m => renderHistoryMessage(m, task)).join('')}</div>`;
  } else {
    activityBlock.classList.add('hidden');
  }

  renderForm(task);
  refreshIcons();
}

function renderClientAttachments(task) {
  const block = qs('#attachments-block');
  if (!block) return;
  const all = (task.attachments || []).map(a => ({ name: a.name, size: a.size, source: 'initial' }));
  block.classList.remove('hidden');
  qs('#attachments-count-badge').textContent = all.length;
  if (all.length === 0) {
    qs('#attachments-list').innerHTML = `<div style="font-size:13px;color:var(--text-tertiary);padding:8px 0;">Nenhum anexo enviado pelo cliente.</div>`;
  } else {
    qs('#attachments-list').innerHTML = all.map(f => renderFileItem(f)).join('');
  }
  refreshIcons();
}

function getFileIconClass(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (['pdf'].includes(ext)) return { cls: 'file-icon-pdf', label: 'PDF' };
  if (['jpg', 'jpeg', 'png'].includes(ext)) return { cls: 'file-icon-img', label: 'IMG' };
  if (['xlsx', 'xls', 'csv'].includes(ext)) return { cls: 'file-icon-xls', label: 'XLS' };
  return { cls: 'file-icon-doc', label: 'DOC' };
}

function renderFileItem(file, options) {
  const opts = options || {};
  const removable = opts.removable || false;
  const removeFn = opts.removeFn || null;
  const icon = getFileIconClass(file.name);
  const isResponse = file.source === 'response';
  return `
    <div class="file-item ${isResponse ? 'highlighted' : ''}">
      <div class="file-item-icon"><div class="${icon.cls}">${icon.label}</div></div>
      <div style="min-width: 0; display: flex; align-items: baseline; flex-wrap: wrap;">
        <span class="file-item-name">${file.name}</span>
        <span class="file-item-meta">· ${file.size || '—'}</span>
        ${isResponse ? `<span class="file-item-response-tag">resposta · ${file.when}</span>` : ''}
      </div>
      <div class="file-item-actions">
        <button class="file-action-btn" title="Visualizar" onclick="event.stopPropagation();"><i data-lucide="eye" style="width:16px;height:16px;"></i></button>
        <button class="file-action-btn" title="Baixar" onclick="event.stopPropagation();"><i data-lucide="download" style="width:16px;height:16px;"></i></button>
        ${removable ? `<button class="file-action-btn danger" title="Remover" onclick="${removeFn}"><i data-lucide="x" style="width:16px;height:16px;"></i></button>` : ''}
      </div>
    </div>
  `;
}

function renderHistoryMessage(m, task) {
  const isOperator = m.from === 'operator';
  const author = isOperator ? (typeof OPERATOR_NAME !== 'undefined' && OPERATOR_NAME ? OPERATOR_NAME : 'Operador') : (task.senderName || task.colaborador || 'Cliente');
  const initials = (author || '?').trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('');
  const scopes = task.senderScopes || [];
  const tagsHtml = isOperator
    ? `<span class="contact-tag" style="background:#fff5f6;color:var(--brand-pink);border-color:#f9c5cb;">operador</span>`
    : `<span class="contact-tag contact-tag-client">cliente</span>${scopes.map(s => `<span class="contact-tag">${s}</span>`).join('')}`;
  return `
    <div class="history-msg ${isOperator ? 'operator' : 'client'}">
      <div class="history-msg-header">
        <div class="history-msg-avatar">${initials}</div>
        <span class="history-msg-author">${author}</span>
        <span style="display:inline-flex;gap:4px;">${tagsHtml}</span>
        <span class="history-msg-timestamp">${m.timestamp}</span>
      </div>
      <div class="history-msg-text">${m.text}</div>
      ${(m.attachments && m.attachments.length) ? `<div class="history-msg-attachments">${m.attachments.map(f => renderFileItem(f)).join('')}</div>` : ''}
    </div>
  `;
}

function renderHistoryInto(targetEl, task) {
  const msgs = state.messages[task.id] || [];
  if (msgs.length === 0) {
    targetEl.innerHTML = `<div style="color: var(--text-tertiary); font-size: 12px; text-align: center; padding: 12px;">Primeira mensagem desta conversa.</div>`;
    return;
  }
  targetEl.innerHTML = `<div class="history-list">${msgs.map(m => renderHistoryMessage(m, task)).join('')}</div>`;
}

/* ============================================================
   AÇÕES DO OPERADOR
   ============================================================ */
function pegarProximaTarefa() {
  if (state.active) {
    state.currentTaskId = state.active.id;
    renderTask(state.active);
    showScreen('task');
    return;
  }
  const responded = state.stationed.find(t => t.clientResponded);
  let task;
  if (responded) {
    state.stationed = state.stationed.filter(t => t.id !== responded.id);
    task = responded;
    task.clientResponded = false;
  } else {
    if (state.queue.length === 0) { flash('Fila vazia! 🎉', 'success'); return; }
    task = state.queue.shift();
  }
  state.active = task;
  state.currentTaskId = task.id;
  renderTask(task);
  showScreen('task');
}

function abrirEstacionada(id) {
  const task = state.stationed.find(t => t.id === id);
  if (!task) return;
  if (task.clientResponded) {
    showConfirmModal({
      title: 'Cliente respondeu',
      message: 'O cliente respondeu essa tarefa. Deseja abri-la para continuar a execução?',
      confirmLabel: 'Abrir tarefa',
      onConfirm: () => pegarProximaTarefa(),
    });
    return;
  }
  qs('#drawer-title').textContent = `${task.type} — ${task.clientName}`;
  qs('#drawer-subtitle').textContent = `Aguardando cliente desde ${task.stationedAt}`;
  qs('#drawer-body').innerHTML = `
    <div style="background: var(--warning-soft); border-radius: 10px; padding: 12px 14px; font-size: 13px; color: var(--warning); display: flex; gap: 10px; align-items: flex-start; margin-bottom: 16px;">
      <i data-lucide="clock" class="w-4 h-4" style="flex-shrink: 0; margin-top: 2px;"></i>
      <div><div style="font-weight: 600; margin-bottom: 2px;">${task.stationedReason}</div></div>
    </div>
    <div class="section-title" style="font-size: 11px; margin-bottom: 10px;"><i data-lucide="message-square"></i>Histórico</div>
    <div class="history-list" id="drawer-history"></div>
    <div style="margin-top: 18px; display: flex; justify-content: flex-end;">
      <button class="btn btn-primary" onclick="retomarEstacionada('${task.id}')"><i data-lucide="play" class="w-4 h-4"></i>Retomar tarefa</button>
    </div>
  `;
  renderHistoryInto(qs('#drawer-history'), task);
  qs('#modal-drawer').classList.remove('hidden');
  refreshIcons();
}

// Retoma uma tarefa em espera sem precisar da resposta do cliente — abre a
// partir do estágio atual.
function retomarEstacionada(id) {
  qs('#modal-drawer').classList.add('hidden');
  openTaskById(id);
}

function aceitarTarefa() {
  _checkEditGuard(() => {
    const task = getTaskById(state.currentTaskId);
    if (!task) return;
    state._editMode[task.id] = false;
    delete state._editDraft[task.id];
    task.timelineStep = 2; // entra em Processamento (reflete no acompanhamento do cliente)
    renderExecution(task);
    showScreen('execution');
  });
}

/* ------------------------------------------------------------
   Voltar pra conferência de dados — do Processamento, o operador
   volta um passo pra ajustar algo que já conferiu (descobriu algo na
   Domínio, precisa corrigir um dado). NÃO é troca de tela silenciosa:
   regride a etapa da tarefa, o que reflete pro cliente e pro operador.
   Por isso passa por confirmação.
   ------------------------------------------------------------ */
function voltarParaConferencia() {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  showConfirmModal({
    title: 'Voltar para validação?',
    message: `
      <p style="margin:0 0 10px;">A tarefa volta pra etapa de <strong>Validação</strong>.</p>
      <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;">
        <li>O status muda pra <strong>"Em andamento"</strong> — pro cliente e pra você.</li>
        <li>Os passos de <strong>Processamento</strong> que você já marcou serão <strong>desmarcados</strong>; você refaz ao reavançar.</li>
      </ul>`,
    confirmLabel: 'Voltar para validação',
    cancelLabel: 'Cancelar',
    onConfirm: () => _doVoltarParaConferencia(task),
  });
}

function _doVoltarParaConferencia(task) {
  // Zera o processamento — editar a conferência pode invalidar o que já rodou,
  // então é mais seguro refazer do que arrastar estado possivelmente inconsistente.
  state._execProgress[task.id] = 0;
  if (state._execStepExpanded) state._execStepExpanded[task.id] = {};
  // Regride a etapa (a timeline do acompanhamento do cliente lê task.timelineStep).
  task.timelineStep = 1;
  // Volta pra conferência em leitura — o operador clica em "Editar" quando/se quiser
  // mexer. Evita edição acidental e aviso de "não salvo" pra quem só quer reler.
  state._editMode[task.id] = false;
  delete state._editDraft[task.id];
  renderTask(task);
  showScreen('task');
  flash('Tarefa voltou para validação — status "Em andamento".', 'info');
}

/* ------------------------------------------------------------
   Devolver à fila — operador abre mão da atribuição (troca interna,
   invisível pro cliente). A tarefa volta pra fila geral com tudo que
   já foi feito preservado; outro operador continua de onde parou.
   ------------------------------------------------------------ */
let _returnReason = null;

function _attribInitials(name) {
  return String(name || '').trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

// Cresce o textarea conforme o conteúdo (sem barra de rolagem).
function autoGrowField(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

// Motivo (obrigatório) via dropdown. Em "Outro", as observações também viram obrigatórias.
function onReturnReasonChange(sel) {
  _returnReason = sel.value || null;
  const lbl = qs('#return-queue-detail-label');
  if (lbl) lbl.textContent = _returnReason === 'Outro' ? 'Observações (obrigatório)' : 'Observações (opcional)';
  updateReturnConfirmState();
}

// Habilita o confirmar: precisa de motivo; se for "Outro", precisa também de observações.
function updateReturnConfirmState() {
  const detail = ((qs('#return-queue-reason-detail') || {}).value || '').trim();
  const ok = !!_returnReason && (_returnReason !== 'Outro' || detail.length > 0);
  const btn = qs('#return-queue-confirm');
  if (btn) btn.disabled = !ok;
}

function openReturnQueueModal() {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  qs('#return-queue-from-av').textContent = _attribInitials(OPERATOR_NAME);
  qs('#return-queue-from-name').textContent = OPERATOR_NAME;
  // Avisa se há rascunho de edição não salvo (será descartado ao devolver).
  const hasUnsaved = !!(task.id && state._editMode[task.id]);
  qs('#return-queue-unsaved').classList.toggle('hidden', !hasUnsaved);
  // Reforço extra quando a devolução vem da execução (já há progresso nos passos).
  const fromExec = !qs('#screen-execution').classList.contains('hidden');
  qs('#return-queue-keep-text').textContent = fromExec
    ? 'Tudo que já foi salvo e editado, as mensagens com o cliente e o progresso dos passos já concluídos ficam do jeito que estão — nada é desfeito.'
    : 'Tudo que já foi salvo e editado, além das mensagens trocadas com o cliente, fica do jeito que está — nada é desfeito.';
  // Reset do motivo a cada abertura (motivo é obrigatório).
  _returnReason = null;
  const sel = qs('#return-queue-reason'); if (sel) sel.value = '';
  const detail = qs('#return-queue-reason-detail'); if (detail) { detail.value = ''; detail.style.height = ''; }
  const lbl = qs('#return-queue-detail-label'); if (lbl) lbl.textContent = 'Observações (opcional)';
  updateReturnConfirmState();
  qs('#modal-return-queue').classList.remove('hidden');
  refreshIcons();
}

function closeReturnQueueModal(ev) {
  if (ev && ev.target && !ev.target.classList.contains('modal-backdrop')) return;
  const m = qs('#modal-return-queue');
  if (m) m.classList.add('hidden');
}

function devolverParaFila() {
  if (!_returnReason) return; // motivo é obrigatório
  const task = state.active;
  const detail = ((qs('#return-queue-reason-detail') || {}).value || '').trim();
  closeReturnQueueModal();
  if (!task) return;
  // Trilha de auditoria da devolução (quem/quando/motivo/transição). No protótipo
  // fica no objeto da tarefa; no real vai pro audit log (ver handoff §6/§7).
  task._returnLog = { by: OPERATOR_NAME, at: 'agora mesmo', reason: _returnReason, detail, from: OPERATOR_NAME, to: null };
  // Descarta apenas o rascunho de edição não salvo; tudo que foi salvo (formulário,
  // anexos, conversa, progresso dos passos de execução) é preservado no objeto.
  state._editMode[task.id] = false;
  delete state._editDraft[task.id];
  // A tarefa sai da atribuição (active) e volta pra fila geral (queue),
  // reordenada por SLA como qualquer tarefa não atribuída.
  state.active = null;
  state.currentTaskId = null;
  state.queue.push(task);
  state.queue.sort((a, b) => slaToMinutes(a.sla) - slaToMinutes(b.sla));
  _returnReason = null;
  renderHome();
  showScreen('home');
  flash('Tarefa devolvida à fila — disponível pra outro operador', 'success');
}

function openAskClientModal() {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  qs('#modal-task-context').innerHTML = `
    <div style="display: flex; gap: 10px; align-items: center;">
      <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #f25461, #f97316); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">${task.logoText}</div>
      <div><div style="font-weight: 600;">${task.type} · ${task.clientName}</div><div style="font-size: 12px; color: var(--text-secondary);">Tarefa ${task.id}</div></div>
    </div>
  `;
  renderHistoryInto(qs('#modal-history'), task);
  qs('#modal-message-text').value = '';
  state._askClientFiles = [];
  renderAskClientFiles();
  qs('#modal-ask-client').classList.remove('hidden');
  refreshIcons();
  setTimeout(() => qs('#modal-message-text').focus(), 100);
}

function closeAskClientModal() { qs('#modal-ask-client').classList.add('hidden'); }

function renderAskClientFiles() {
  const el = qs('#ask-client-files');
  if (!el) return;
  const files = state._askClientFiles || [];
  el.innerHTML = files.map((f, idx) => renderFileItem(f, { removable: true, removeFn: `removeAskClientFile(${idx})` })).join('');
  refreshIcons();
}

function handleAskClientFileSelect(e) {
  Array.from(e.target.files).forEach(f => {
    const sizeKB = (f.size / 1024).toFixed(0);
    state._askClientFiles.push({ name: f.name, size: sizeKB > 1024 ? (sizeKB/1024).toFixed(1) + ' MB' : sizeKB + ' KB' });
  });
  e.target.value = '';
  renderAskClientFiles();
}

function removeAskClientFile(idx) {
  const arq = (state._askClientFiles || [])[idx];
  if (!arq) return;
  confirmRemoveAttachment(arq.name, () => { state._askClientFiles.splice(idx, 1); renderAskClientFiles(); });
}

function enviarPendenciaCliente() {
  const text = qs('#modal-message-text').value.trim();
  if (!text) { showAlertModal({ title: 'Campo obrigatório', message: 'Digite uma mensagem para o cliente antes de enviar.' }); return; }
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  if (!state.messages[task.id]) state.messages[task.id] = [];
  const attachments = (state._askClientFiles || []).slice();
  state.messages[task.id].push({ from: 'operator', text, timestamp: 'agora mesmo', attachments });
  state._askClientFiles = [];
  state.active = null;
  state.queue = state.queue.filter(t => t.id !== task.id);
  state.stationed.push({ ...task, stationedAt: 'agora mesmo', stationedReason: text.length > 80 ? text.substring(0, 80) + '...' : text, clientResponded: false, respondedAt: null });
  closeAskClientModal();
  goHome();
  flash('Tarefa colocada em espera — o cliente foi notificado.', 'success');
}

/* ============================================================
   EXEC_STEPS PADRÃO — backward compat para fluxos sem EXEC_STEPS declarado
   ============================================================ */
const DEFAULT_EXEC_STEPS = [
  {
    title: 'Gerar e baixar o arquivo TXT',
    desc: 'O TXT é gerado a partir dos dados da solicitação. Baixe para importar na Domínio.',
    action: { label: 'Baixar TXT', icon: 'file-down', onClick: 'handleStepAction(0)' },
    timelineStep: 2,
    autoCompleteOnAction: true,
  },
  {
    title: 'Acessar a Domínio e subir o TXT',
    desc: 'Abra a Domínio e faça a importação do arquivo TXT. Marque como feito quando concluído.',
    timelineStep: 2,
    type: 'form-reference',
  },
  {
    title: 'Registrar no Gestta',
    desc: 'Copie o nome sugerido abaixo para garantir a correlação automática dos documentos.',
    action: { label: 'Abrir Gestta', icon: 'external-link', onClick: 'handleStepAction(2)' },
    timelineStep: 2,
    showTaskId: true,
  },
  {
    title: 'Conclusão da etapa',
    desc: 'O processamento segue na sequência e o que precisar ser gerado chega ao cliente assim que ficar pronto.',
    type: 'final-message',
    timelineStep: 2,
  },
];

/* ============================================================
   EXEC_STEP_PRESETS — presets nomeados compartilhados por todos os fluxos.
   Cada HTML pode declarar EXEC_STEPS: 'nome_do_preset' (string) em vez de
   um array inline. Mudança aqui propaga automaticamente para todos os fluxos
   que referenciam o preset.
   ============================================================ */
/* Passos compartilhados por todos os fluxos não-admissão.
   Idênticos à admissão, mas sem o 1º passo (gerar TXT). */
const NON_ADMISSION_STEPS = [
  {
    title: 'Acessar a Domínio e fazer o processamento',
    desc: 'Abra a Domínio, realize o processamento correspondente a esta solicitação e marque como feito quando concluído.',
    timelineStep: 2,
    type: 'form-reference',
    defaultOpen: true,
  },
  {
    title: 'Registrar no Gestta',
    desc: 'Copie o nome sugerido abaixo para garantir a correlação automática dos documentos.',
    action: { label: 'Abrir Gestta', icon: 'external-link', onClick: 'handleStepAction(1)' },
    timelineStep: 2,
    showTaskId: true,
  },
  {
    title: 'Conclusão da etapa',
    desc: 'O processamento segue na sequência e o que precisar ser gerado chega ao cliente assim que ficar pronto.',
    type: 'final-message',
    timelineStep: 2,
  },
];

/* Passos do fluxo de Afastamento.
   Registro na Domínio, SEM registro no Gestta — afastamento não gera documento
   correlacionado no Gestta hoje. Por isso tem preset próprio em vez de
   compartilhar o NON_ADMISSION_STEPS (que mantém o passo de Gestta). */
const AFASTAMENTO_STEPS = [
  {
    title: 'Acessar a Domínio e fazer o processamento',
    desc: 'Abra a Domínio, registre o afastamento e marque como feito quando concluído.',
    timelineStep: 2,
    type: 'form-reference',
    defaultOpen: true,
  },
  {
    title: 'Conclusão da etapa',
    desc: 'O processamento segue na sequência e o que precisar ser gerado chega ao cliente assim que ficar pronto.',
    type: 'final-message',
    timelineStep: 2,
  },
];

/* Passos do fluxo de Apontamentos em folha.
   Mesma estrutura da admissão, mas o passo 1 baixa a planilha enviada pelo cliente
   em vez de gerar TXT, e o passo 2 sobe essa planilha na Domínio. */
const APONTAMENTOS_STEPS = [
  {
    title: 'Baixar a planilha enviada pelo cliente',
    desc: 'Baixe a planilha de apontamentos enviada pelo cliente para subir na Domínio.',
    action: { label: 'Baixar planilha', icon: 'file-down', onClick: 'handleStepAction(0)' },
    timelineStep: 2,
    autoCompleteOnAction: true,
  },
  {
    title: 'Acessar a Domínio e subir a planilha',
    desc: 'Abra a Domínio, suba a planilha no módulo de apontamentos e confira o processamento. Marque como feito quando concluído.',
    timelineStep: 2,
    type: 'form-reference',
    defaultOpen: true,
  },
  {
    title: 'Conclusão da etapa',
    desc: 'O processamento segue na sequência e o que precisar ser gerado chega ao cliente assim que ficar pronto.',
    type: 'final-message',
    timelineStep: 2,
  },
];

/* Passos do fluxo de Admissão RPA via Planilha.
   Operador baixa a planilha, cadastra contribuintes novos na Domínio
   e faz o espelhamento/processamento dos valores do RPA. */
const ADMISSAO_PLANILHA_STEPS = [
  {
    title: 'Baixar a planilha enviada pelo cliente',
    desc: 'Baixe a planilha de admissões de RPA enviada pelo cliente para processar na Domínio.',
    action: { label: 'Baixar planilha', icon: 'file-down', onClick: 'handleStepAction(0)' },
    timelineStep: 2,
    autoCompleteOnAction: true,
  },
  {
    title: 'Cadastrar na Domínio os contribuintes que ainda não estão na base',
    desc: 'Abra a Domínio, cadastre os prestadores listados na planilha que ainda não constam na base do cliente. Marque como feito quando concluído.',
    timelineStep: 2,
    type: 'form-reference',
    defaultOpen: true,
  },
  {
    title: 'Espelhar e processar os valores do RPA na Domínio',
    desc: 'Faça o espelhamento dos valores dos RPAs conforme a planilha e processe na Domínio. Marque como feito quando concluído.',
    timelineStep: 2,
    type: 'form-reference',
  },
  {
    title: 'Registrar no Gestta',
    desc: 'Copie o nome sugerido abaixo para garantir a correlação automática dos documentos.',
    action: { label: 'Abrir Gestta', icon: 'external-link', onClick: 'handleStepAction(3)' },
    timelineStep: 2,
    showTaskId: true,
  },
  {
    title: 'Conclusão da etapa',
    desc: 'O processamento segue na sequência e o que precisar ser gerado chega ao cliente assim que ficar pronto.',
    type: 'final-message',
    timelineStep: 2,
  },
];

/* Passos do fluxo de Solicitação Geral.
   Não há Domínio nem Gestta: o operador apenas redige a resposta que será
   enviada ao cliente e conclui. Passo único do tipo 'client-reply'. */
const SOLICITACAO_GERAL_STEPS = [
  {
    title: 'Responder ao cliente',
    desc: 'Descreva o que você fez nesta solicitação. Este texto será enviado ao cliente como resposta quando você concluir.',
    timelineStep: 2,
    type: 'client-reply',
  },
];

const EXEC_STEP_PRESETS = {
  admissao:          DEFAULT_EXEC_STEPS,
  admissao_planilha: ADMISSAO_PLANILHA_STEPS,
  solicitacao_geral: SOLICITACAO_GERAL_STEPS,
  ferias:            NON_ADMISSION_STEPS,
  rescisao:          NON_ADMISSION_STEPS,
  afastamento:       AFASTAMENTO_STEPS,
  geral:             NON_ADMISSION_STEPS,
  apontamentos:      APONTAMENTOS_STEPS,
};

function getExecSteps() {
  const raw = window.FLOW_CONFIG.EXEC_STEPS || DEFAULT_EXEC_STEPS;
  if (typeof raw === 'string') return EXEC_STEP_PRESETS[raw] || DEFAULT_EXEC_STEPS;
  return raw;
}

/* ============================================================
   RENDER: EXECUÇÃO
   ============================================================ */
function renderExecution(task) {
  const EXEC_STEPS = getExecSteps();
  qs('#exec-type-label').textContent = task.type;
  qs('#exec-client-label').textContent = task.clientName;
  qs('#exec-client-cnpj').textContent = task.cnpj;
  qs('#exec-meta-strip').innerHTML = olMetaStripHtml(task);
  qs('#exec-solicitante').textContent = task.senderName;
  const isAPx = task.origin === 'autopilot';
  const _lblEx = qs('#exec-solicitante-label'); if (_lblEx) _lblEx.textContent = isAPx ? 'Iniciado pelo' : 'Solicitado por';
  const scopes = task.senderScopes || [];
  qs('#exec-solicitante-tags').innerHTML = isAPx
    ? `<span class="contact-tag">robô</span>`
    : [`<span class="contact-tag contact-tag-client">cliente</span>`, ...scopes.map(s => `<span class="contact-tag">${s}</span>`)].join('');
  qs('#exec-timestamp').textContent = `Solicitado em ${solicitadoEmLabel(task)}`;
  qs('#exec-assignee').textContent = OPERATOR_NAME;

  if (!state._execProgress[task.id]) state._execProgress[task.id] = 0;
  if (!state._execStepExpanded) state._execStepExpanded = {};
  if (!state._execStepExpanded[task.id]) state._execStepExpanded[task.id] = {};
  if (!state._gdocsFiles[task.id]) state._gdocsFiles[task.id] = [];

  const progress = state._execProgress[task.id];
  const expandedMap = state._execStepExpanded[task.id];
  const gdocsFiles = state._gdocsFiles[task.id];

  renderTimelineHorizontal(qs('#exec-timeline'), EXEC_STEPS[progress] ? EXEC_STEPS[progress].timelineStep : 3, task);

  qs('#exec-steps').innerHTML = EXEC_STEPS.map((s, i) => {
    const done = i < progress;
    const active = i === progress;
    const pending = i > progress;
    const hasBodyExtra = s.type === 'upload' || s.type === 'final-message' || s.type === 'form-reference' || s.type === 'client-reply' || s.showTaskId;
    const expanded = !!expandedMap[i];
    const showBody = active || (done && expanded);
    let bodyExtra = '';
    let buttonsHtml = '';

    if (s.type === 'upload' && showBody) bodyExtra += renderUploadSection(i, gdocsFiles, active);
    if (s.type === 'final-message' && showBody) bodyExtra += renderFinalMessageSection(i, task, active);
    if (s.type === 'client-reply' && showBody) bodyExtra += renderClientReplySection(i, task, active);
    if (s.type === 'form-reference' && showBody) bodyExtra += renderFormReference(task, s.defaultOpen);
    if (s.showTaskId && showBody) bodyExtra += renderTaskIdPanel(task);

    if (done) {
      buttonsHtml = `<span class="badge badge-success"><i data-lucide="check" class="w-3 h-3"></i> Feito</span>`;
      if (s.editable) buttonsHtml += `<button class="step-edit-btn" onclick="event.stopPropagation(); editarPasso(${i})"><i data-lucide="pencil" class="w-3 h-3"></i> Editar</button>`;
      if (s.autoCompleteOnAction && s.action) {
        buttonsHtml += `<button class="step-edit-btn" onclick="event.stopPropagation(); ${s.action.onClick}"><i data-lucide="${s.action.icon}" class="w-3 h-3"></i> ${s.action.label}</button>`;
      }
    } else if (active) {
      let actionBtn = '';
      if (s.action) {
        /* A ação continua clicável depois do clique: baixar de novo, reabrir o Gestta.
           Quem diz que o passo acabou é o "Marcar como feito", não o botão. */
        actionBtn = `<button class="step-action" onclick="${s.action.onClick}"><i data-lucide="${s.action.icon}" class="w-3.5 h-3.5"></i> ${s.action.label}</button>`;
      }
      let skipBtn = '';
      if (s.type === 'upload' && gdocsFiles.length === 0) {
        skipBtn = `<button class="step-action" onclick="pularPassoGdocs(${i})" style="border-style: dashed;">Não há documentos a adicionar</button>`;
      }
      const markDisabled = s.requiresFiles && gdocsFiles.length === 0;
      let markBtn = '';
      if (s.type === 'client-reply') {
        markBtn = `<button class="step-mark-done" onclick="enviarRespostaEConcluir(${i})"><i data-lucide="send" class="w-3.5 h-3.5"></i> Concluir e enviar resposta ao cliente</button>`;
      } else if (!s.autoCompleteOnAction) {
        markBtn = markDisabled
          ? `<button class="step-mark-done" disabled style="opacity:0.5;cursor:not-allowed;" title="Adicione pelo menos um arquivo"><i data-lucide="check" class="w-3.5 h-3.5"></i> Marcar como feito</button>`
          : `<button class="step-mark-done" onclick="marcarPassoFeito(${i})"><i data-lucide="check" class="w-3.5 h-3.5"></i> Marcar como feito</button>`;
      }
      buttonsHtml = actionBtn + skipBtn + markBtn;
    } else {
      buttonsHtml = `<span style="font-size: 11px; color: var(--text-tertiary);">Aguardando</span>`;
    }

    const collapsible = done && hasBodyExtra;
    const headerCls = `exec-step-header${collapsible ? ' collapsible' : ''}`;
    const headerOnClick = collapsible ? `onclick="toggleStepExpanded(${i})"` : '';
    const chevronHtml = collapsible
      ? `<i data-lucide="chevron-down" class="exec-step-chevron${expanded ? ' open' : ''}"></i>`
      : '';
    const showButtonsTop = !bodyExtra || s.type === 'form-reference' || collapsible;

    return `
      <div class="exec-step ${done ? 'done' : ''} ${active ? 'active' : ''}" style="${pending ? 'opacity: 0.55;' : ''} flex-direction: ${bodyExtra ? 'column' : 'row'}; align-items: ${bodyExtra ? 'stretch' : 'flex-start'};">
        <div class="${headerCls}" ${headerOnClick}>
          <div class="step-num">${done ? '✓' : i + 1}</div>
          <div style="flex: 1; min-width: 0;"><div style="font-weight: 600; margin-bottom: 4px;">${s.title}</div><div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.55;">${s.desc}</div></div>
          ${showButtonsTop ? `<div class="step-buttons">${buttonsHtml}</div>` : ''}
          ${chevronHtml}
        </div>
        ${bodyExtra ? `<div style="margin-top: 14px; ${s.type === 'form-reference' ? '' : 'padding-left: 42px;'}">${bodyExtra}${!collapsible ? `<div class="step-buttons" style="margin-top: 14px;">${buttonsHtml}</div>` : ''}</div>` : ''}
      </div>
    `;
  }).join('');

  refreshIcons();
}

function renderUploadSection(stepIdx, files, active) {
  const filesHtml = files.length > 0 ? `<div class="uploaded-files-list">${files.map((f, idx) => renderFileItem(f, { removable: active, removeFn: `removeGdocsFile(${idx})` })).join('')}</div>` : '';
  if (!active) return filesHtml || '<div style="font-size: 12px; color: var(--text-tertiary); font-style: italic;">Nenhum arquivo adicionado.</div>';
  return `
    <div class="upload-area" id="upload-area-${stepIdx}" onclick="document.getElementById('gdocs-file-input').click()" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="handleFileDrop(event)">
      <div class="upload-area-icon"><i data-lucide="upload-cloud" style="width:20px;height:20px;"></i></div>
      <div class="upload-area-title">Arraste arquivos aqui</div>
      <div class="upload-area-hint">ou <strong>selecione do computador</strong></div>
    </div>
    <input type="file" id="gdocs-file-input" style="display:none;" multiple onchange="handleFileSelect(event)" />
    ${filesHtml}
  `;
}

function findFormCampo(formData, nome) {
  const abas = formData && formData.abas;
  if (!abas) return null;
  function recurse(obj) {
    if (!obj || typeof obj !== 'object') return null;
    for (const [k, v] of Object.entries(obj)) {
      if (k === nome) return v;
      if (v && typeof v === 'object') {
        const found = recurse(v);
        if (found != null) return found;
      }
    }
    return null;
  }
  return recurse(abas);
}

function buildGesttaTaskName(task) {
  const id = task.id;
  const colaborador = task.formData && task.formData.colaborador ? task.formData.colaborador.nome : null;
  const cliente = task.clientName;
  const dash = '—';

  switch (task.typeCode) {
    case 'admissao_clt':
    case 'admissao_estagiario': {
      const dataInicio = findFormCampo(task.formData, 'Data da admissão')
        || findFormCampo(task.formData, 'Data de Admissão')
        || findFormCampo(task.formData, 'Início do Contrato')
        || dash;
      return `Admissão — ${colaborador || cliente} - Início: ${dataInicio} (${id})`;
    }
    case 'ferias_aviso_previo': {
      const dataInicio = findFormCampo(task.formData, 'Data de início do gozo') || dash;
      return `Aviso Prévio de Férias — ${colaborador || cliente} - Início: ${dataInicio} (${id})`;
    }
    case 'solicitacao_geral':
      return `Solicitação Geral — ${cliente} (${id})`;
    default:
      return colaborador
        ? `${task.type} — ${colaborador} (${id})`
        : `${task.type} — ${cliente} (${id})`;
  }
}

function renderTaskIdPanel(task) {
  const suggestedName = buildGesttaTaskName(task);
  const encoded = encodeURIComponent(suggestedName);
  return `
    <div style="background: var(--info-soft); border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 16px; margin-top: 4px;">
      <div style="font-size: 12px; font-weight: 600; color: #1e40af; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
        <i data-lucide="tag" style="width:13px;height:13px;"></i> Instrução de registro no Gestta
      </div>
      <div style="font-size: 12.5px; color: #3b82f6; margin-bottom: 10px;">Crie a tarefa no Gestta com o seguinte nome:</div>
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; background: #fff; padding: 10px 14px; border-radius: 8px; border: 1px solid #93c5fd; flex: 1; min-width: 200px; word-break: break-all;">${suggestedName}</div>
        <button id="copy-task-id-btn" onclick="copyTaskId(decodeURIComponent('${encoded}'))"
          style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; white-space: nowrap;">
          <i data-lucide="copy" style="width:14px;height:14px;"></i> Copiar
        </button>
      </div>
    </div>
  `;
}

function copyTaskId(text) {
  navigator.clipboard.writeText(text).then(() => {
    flash('Nome copiado! Cole no campo de tarefa do Gestta.', 'success');
    const btn = qs('#copy-task-id-btn');
    if (btn) {
      btn.dataset.copied = '1';
      btn.innerHTML = '<i data-lucide="check" style="width:14px;height:14px;"></i> Copiado!';
      btn.style.background = '#16a34a';
      refreshIcons();
      setTimeout(() => {
        btn.innerHTML = '<i data-lucide="copy" style="width:14px;height:14px;"></i> Copiar';
        btn.style.background = '#2563eb';
        delete btn.dataset.copied;
        refreshIcons();
      }, 2000);
    }
  }).catch(() => flash('Selecione e copie o texto manualmente.', 'warning'));
}

function renderFinalMessageSection(stepIdx, task, active) {
  const manualFiles = state._gdocsFiles[task.id] || [];
  const filesHtml = manualFiles.length > 0
    ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;">${manualFiles.map((f, idx) => renderFileItem(f, { removable: active, removeFn: `removeGdocsFile(${idx})` })).join('')}</div>`
    : '';
  const fileInput = active ? `<input type="file" id="gdocs-file-input" style="display:none;" multiple onchange="handleFileSelect(event)" />` : '';
  const attachBtn = active
    ? `<div style="margin-top:14px;"><button onclick="document.getElementById('gdocs-file-input').click()" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;border:1px solid var(--border-strong);border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;color:var(--text-primary);"><i data-lucide="paperclip" style="width:14px;height:14px;"></i> Anexar documento manualmente (opcional)</button></div>`
    : '';
  return `
    <div style="background:var(--info-soft);border:1px solid #bfdbfe;border-radius:10px;padding:16px 18px;display:flex;gap:12px;align-items:flex-start;">
      <i data-lucide="info" style="width:18px;height:18px;color:var(--info);flex-shrink:0;margin-top:2px;"></i>
      <div style="flex:1;font-size:13px;line-height:1.55;color:#1e40af;">
        <div style="font-weight:600;margin-bottom:4px;">Sua parte nessa solicitação foi concluída.</div>
        <div>Quando o processamento for concluído, o que precisar ser gerado é enviado automaticamente ao cliente pelo HUB. Você pode marcar essa etapa como feita para fechar a solicitação.</div>
      </div>
    </div>
    ${attachBtn}
    ${filesHtml}
    ${fileInput}
  `;
}

function renderClientReplySection(stepIdx, task, active) {
  const sol = task.formData && task.formData.abas ? task.formData.abas.solicitacao : null;
  const assunto = sol && sol.campos ? sol.campos['Assunto'] : null;
  const pedido = sol && sol.descricao ? sol.descricao.texto : null;
  if (!state._clientReply) state._clientReply = {};
  const replyVal = state._clientReply[task.id] || '';
  const manualFiles = state._gdocsFiles[task.id] || [];

  const clientAttachments = task.attachments || [];
  const clientFilesHtml = clientAttachments.length ? `
      <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin:12px 0 8px;">Anexos do cliente<span class="badge badge-neutral" style="margin-left:6px;font-size:10px;">${clientAttachments.length}</span></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">${clientAttachments.map(f => renderFileItem(f)).join('')}</div>` : '';
  const pedidoHtml = (assunto || pedido || clientAttachments.length) ? `
    <div style="background:var(--surface-subtle);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:16px;">
      <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:6px;">O que o cliente pediu</div>
      ${assunto ? `<div style="font-weight:600;font-size:13px;margin-bottom:4px;">${esc(assunto)}</div>` : ''}
      ${pedido ? `<div style="font-size:13px;color:var(--text-secondary);line-height:1.55;">${esc(pedido)}</div>` : ''}
      ${clientFilesHtml}
    </div>` : '';

  const filesHtml = manualFiles.length > 0
    ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;">${manualFiles.map((f, idx) => renderFileItem(f, { removable: active, removeFn: `removeGdocsFile(${idx})` })).join('')}</div>`
    : '';
  const fileInput = `<input type="file" id="gdocs-file-input" style="display:none;" multiple onchange="handleFileSelect(event)" />`;
  const attachBtn = `<div style="margin-top:14px;"><button onclick="document.getElementById('gdocs-file-input').click()" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;border:1px solid var(--border-strong);border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;color:var(--text-primary);"><i data-lucide="paperclip" style="width:14px;height:14px;"></i> Anexar documento (opcional)</button></div>`;

  return `
    ${pedidoHtml}
    <div class="field-label mb-2">Sua resposta ao cliente <span style="color:var(--brand-pink);">*</span></div>
    <textarea id="client-reply-text" oninput="setClientReply(this.value)" placeholder="Descreva o que você fez nesta solicitação. Ex.: Declaração de vínculo emitida e anexada, com cargo, salário e data de admissão." style="width:100%;min-height:130px;padding:12px;border:1px solid var(--border-strong);border-radius:10px;font-family:inherit;font-size:13px;line-height:1.55;resize:vertical;outline:none;" onfocus="this.style.borderColor='var(--brand-pink)'" onblur="this.style.borderColor='var(--border-strong)'">${esc(replyVal)}</textarea>
    <div style="display:flex;gap:6px;align-items:center;font-size:12px;color:var(--text-secondary);margin-top:8px;">
      <i data-lucide="send" style="width:13px;height:13px;flex-shrink:0;"></i> Esta mensagem será enviada ao cliente quando você concluir.
    </div>
    ${attachBtn}
    ${filesHtml}
    ${fileInput}
  `;
}

function setClientReply(value) {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  if (!state._clientReply) state._clientReply = {};
  state._clientReply[task.id] = value;
}

function handleDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('dragover'); }
function handleDragLeave(e) { e.currentTarget.classList.remove('dragover'); }
function handleFileDrop(e) { e.preventDefault(); e.currentTarget.classList.remove('dragover'); addFilesToGdocs(Array.from(e.dataTransfer.files)); }
function handleFileSelect(e) { addFilesToGdocs(Array.from(e.target.files)); e.target.value = ''; }

function addFilesToGdocs(files) {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  if (!state._gdocsFiles[task.id]) state._gdocsFiles[task.id] = [];
  files.forEach(f => {
    const sizeKB = (f.size / 1024).toFixed(0);
    state._gdocsFiles[task.id].push({ name: f.name, size: sizeKB > 1024 ? (sizeKB/1024).toFixed(1) + ' MB' : sizeKB + ' KB' });
  });
  renderExecution(task);
}

function removeGdocsFile(idx) {
  const task = getTaskById(state.currentTaskId); if (!task) return;
  const lista = state._gdocsFiles[task.id] || [];
  const arq = lista[idx];
  if (!arq) return;
  confirmRemoveAttachment(arq.name, () => { lista.splice(idx, 1); renderExecution(task); });
}
function editarPasso(stepIdx) { const task = getTaskById(state.currentTaskId); if (!task) return; state._execProgress[task.id] = stepIdx; flash('Voltando ao passo para ajustar.', 'info'); renderExecution(task); }

function pularPassoGdocs(stepIdx) {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  const total = getExecSteps().length;
  if (stepIdx + 1 >= total) { openConfirmFinish(); return; }
  state._execProgress[task.id] = stepIdx + 1;
  renderExecution(task);
}

function injectCopyButtons(html) {
  return html.replace(
    /<div class="field-value(?! empty)[^"]*">([\s\S]*?)<\/div>/g,
    (match, val) => {
      const text = (val || '').trim();
      if (!text || text === '—') return match;
      const safe = text.replace(/"/g, '&quot;');
      return `<div class="field-value">${val}<button class="exec-ref-copy-btn" data-copy="${safe}" onclick="execCopyField(this)" title="Copiar" style="margin-left:4px;vertical-align:middle;"><i data-lucide="copy" style="width:11px;height:11px;"></i></button></div>`;
    }
  );
}

function execCopyField(btn) {
  const value = btn.getAttribute('data-copy');
  navigator.clipboard.writeText(value).then(() => {
    btn.innerHTML = '<i data-lucide="check" style="width:11px;height:11px;color:var(--success);"></i>';
    lucide.createIcons();
    setTimeout(() => {
      btn.innerHTML = '<i data-lucide="copy" style="width:11px;height:11px;"></i>';
      lucide.createIcons();
    }, 1500);
  });
}

function toggleExecRefItem(btn) {
  const content = btn.nextElementSibling;
  const isOpen = content.style.display !== 'none';
  content.style.display = isOpen ? 'none' : 'block';
  btn.classList.toggle('open', !isOpen);
  lucide.createIcons();
}

function renderFormReference(task, defaultOpen) {
  if (!task.formData) return '';
  const tabs = (FLOW_CONFIG.FORM_TABS_BY_TYPE || {})[task.typeCode] || [];
  if (!tabs.length) return '';

  const open = !!defaultOpen;
  const display = open ? 'block' : 'none';
  const triggerClass = open ? 'exec-ref-trigger open' : 'exec-ref-trigger';

  const savedEdit = state._editMode && state._editMode[task.id];
  if (state._editMode) state._editMode[task.id] = false;

  const items = tabs.map((tab, idx) => {
    const abaData = task.formData.abas && task.formData.abas[tab.id];
    const rawHtml = FLOW_CONFIG.renderFormTab(tab.id, abaData || {});
    const content = injectCopyButtons(rawHtml);
    return `<div class="exec-ref-item">
      <button class="${triggerClass}" onclick="toggleExecRefItem(this)">
        <span>${tab.label}</span>
        <i data-lucide="chevron-down" class="exec-ref-chevron" style="width:16px;height:16px;"></i>
      </button>
      <div class="exec-ref-content" style="display:${display};">${content}</div>
    </div>`;
  }).join('');

  if (state._editMode) state._editMode[task.id] = savedEdit;

  const anexos = task.attachments || [];
  const anexosBadge = anexos.length ? `<span class="exec-ref-badge">(${anexos.length})</span>` : '';
  const anexosBody = anexos.length
    ? anexos.map(a => `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);"><i data-lucide="paperclip" style="width:14px;height:14px;color:var(--text-secondary);flex-shrink:0;"></i><div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:500;">${a.name}</div><div style="font-size:11px;color:var(--text-secondary);">${a.size}</div></div></div>`).join('')
    : `<div style="font-size:13px;color:var(--text-secondary);">Nenhum anexo enviado.</div>`;

  const anexosItem = `<div class="exec-ref-item">
    <button class="${triggerClass}" onclick="toggleExecRefItem(this)">
      <span>Anexos${anexosBadge}</span>
      <i data-lucide="chevron-down" class="exec-ref-chevron" style="width:16px;height:16px;"></i>
    </button>
    <div class="exec-ref-content" style="display:${display};">${anexosBody}</div>
  </div>`;

  return `<div class="exec-ref-card">${items}${anexosItem}</div>`;
}

function handleStepAction(stepIdx) {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  const step = getExecSteps()[stepIdx];
  const progress = state._execProgress[task.id] || 0;
  const alreadyDone = stepIdx < progress;
  if (alreadyDone) {
    flash(`${step.action.label} — repetido.`, 'info');
    return;
  }
  if (step.autoCompleteOnAction) {
    flash(`${step.action.label} — concluído.`, 'success');
    const total = getExecSteps().length;
    if (stepIdx + 1 >= total) { openConfirmFinish(); return; }
    state._execProgress[task.id] = stepIdx + 1;
    renderExecution(task);
    return;
  }
  flash(`${step.action.label} — ação registrada. Marque como feito quando concluído.`, 'info');
  renderExecution(task);
}

function marcarPassoFeito(stepIdx) {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  const total = getExecSteps().length;
  if (stepIdx + 1 >= total) { openConfirmFinish(); return; }
  state._execProgress[task.id] = stepIdx + 1;
  renderExecution(task);
}

function enviarRespostaEConcluir(stepIdx) {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  const reply = ((state._clientReply && state._clientReply[task.id]) || '').trim();
  if (!reply) {
    showAlertModal({ title: 'Resposta obrigatória', message: 'Escreva a resposta que será enviada ao cliente antes de concluir a solicitação.' });
    return;
  }
  if (!state.messages[task.id]) state.messages[task.id] = [];
  state.messages[task.id].push({ from: 'operator', text: reply, timestamp: 'agora mesmo' });
  task._operatorReply = reply;
  openConfirmFinish();
}

function toggleStepExpanded(stepIdx) {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  if (!state._execStepExpanded) state._execStepExpanded = {};
  if (!state._execStepExpanded[task.id]) state._execStepExpanded[task.id] = {};
  state._execStepExpanded[task.id][stepIdx] = !state._execStepExpanded[task.id][stepIdx];
  renderExecution(task);
}

/* ============================================================
   MODAL: CONFIRM FINISH
   ============================================================ */
function openConfirmFinish() {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  qs('#confirm-finish-detail').innerHTML = `Você marcou todas as etapas de <strong>${task.type}</strong> de <strong>${task.clientName}</strong> como feitas.`;
  qs('#modal-confirm-finish').classList.remove('hidden');
  refreshIcons();
}

function closeConfirmFinish() { qs('#modal-confirm-finish').classList.add('hidden'); }

function confirmarFinalizacao() {
  const task = getTaskById(state.currentTaskId);
  if (!task) return;
  const completedTask = { ...task, completedAt: 'agora mesmo' };
  state.completed.push(completedTask);
  state.active = null;
  closeConfirmFinish();
  renderSuccess(completedTask);
  showScreen('success');
}

/* ============================================================
   RENDER: SUCCESS
   ============================================================ */
function renderSuccess(task) {
  const colaborador = task.formData && task.formData.colaborador ? task.formData.colaborador.nome : null;
  const rows = [['Empresa', task.clientName], ['CNPJ', task.cnpj], ['Tipo', task.type]];
  if (colaborador) rows.push(['Colaborador', colaborador]);
  rows.push(['Operador(a)', 'Daniele Ribeiro']);
  rows.push(['Concluída em', 'hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })]);
  rows.push(['Tarefa', '#' + task.id]);
  qs('#success-summary').innerHTML = rows.map(([label, value]) => `<div class="summary-row"><span class="summary-label">${label}</span><span class="summary-value">${value}</span></div>`).join('');
}

/* ============================================================
   DRAWERS
   ============================================================ */
function openDrawer(type) {
  if (type === 'estacionadas') {
    qs('#drawer-title').textContent = 'Tarefas em espera';
    qs('#drawer-subtitle').textContent = `${state.stationed.length} aguardando o cliente responder`;
    qs('#drawer-body').innerHTML = state.stationed.length === 0
      ? `<div style="padding: 24px; text-align: center; color: var(--text-tertiary);">Nenhuma tarefa em espera.</div>`
      : state.stationed.map(t => `<div class="task-item" style="margin-bottom: 8px;"><div style="flex: 1;"><div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase;">${t.type}</div><div style="font-weight: 600;">${t.clientName}</div></div>${t.clientResponded ? `<span class="badge badge-pink">Respondeu</span>` : `<span class="badge badge-warning">Aguardando</span>`}</div>`).join('');
  } else {
    qs('#drawer-title').textContent = 'Tarefas concluídas hoje';
    qs('#drawer-subtitle').textContent = `${state.completed.length} finalizadas`;
    qs('#drawer-body').innerHTML = state.completed.length === 0
      ? `<div style="padding: 24px; text-align: center; color: var(--text-tertiary);">Nenhuma tarefa concluída ainda hoje.</div>`
      : state.completed.map(t => `<div class="task-item" style="margin-bottom: 8px; cursor: default;"><div style="flex: 1;"><div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase;">${t.type}</div><div style="font-weight: 600;">${t.clientName}</div></div><span class="badge badge-success"><i data-lucide="check" class="w-3 h-3"></i> Concluída</span></div>`).join('');
  }
  qs('#modal-drawer').classList.remove('hidden');
  refreshIcons();
}

function closeDrawer() { qs('#modal-drawer').classList.add('hidden'); }

/* ============================================================
   NOTIFICAÇÕES
   ============================================================ */
function renderNotifications() {
  const list = qs('#notif-list');
  list.innerHTML = state.notifications.map(n => `
    <div class="notif-item">
      ${n.unread ? '<div class="dot"></div>' : '<div style="width: 8px; flex-shrink: 0;"></div>'}
      <div style="flex: 1;"><div style="font-size: 13px; color: var(--text-primary); line-height: 1.45;">${n.text}</div><div style="font-size: 11px; color: var(--text-tertiary); margin-top: 4px;">${n.time}</div></div>
    </div>
  `).join('');
  qs('#notif-dot').style.display = state.notifications.some(n => n.unread) ? 'block' : 'none';
}

/* ============================================================
   SIMULAÇÕES
   ============================================================ */
function simularRespostaCliente() {
  const aguardando = state.stationed.find(t => !t.clientResponded);
  if (!aguardando) { showAlertModal({ title: 'Sem tarefas em espera', message: 'Não há tarefas aguardando resposta do cliente. Coloque uma tarefa em espera primeiro.' }); return; }
  aguardando.clientResponded = true;
  aguardando.respondedAt = 'agora mesmo';
  if (!state.messages[aguardando.id]) state.messages[aguardando.id] = [];
  const cfg = window.FLOW_CONFIG;
  const simMsg = cfg.simulateClientResponseText
    ? cfg.simulateClientResponseText(aguardando)
    : 'Prontinho, segue o documento reenviado em melhor qualidade. Qualquer outra coisa me avisa!';
  const simAttachments = cfg.simulateClientResponseAttachments
    ? cfg.simulateClientResponseAttachments(aguardando)
    : [{ name: 'documento-reenviado.pdf', size: '480 KB' }];
  state.messages[aguardando.id].push({ from: 'client', text: simMsg, timestamp: 'agora mesmo', attachments: simAttachments });
  // Anexo do cliente também entra no bloco consolidado de anexos da tarefa (regra 04-comunicacao-cliente.md § Anexos em mensagens).
  if (!aguardando.attachments) aguardando.attachments = [];
  aguardando.attachments.push(...simAttachments);
  state.notifications.unshift({ id: Date.now(), text: `Cliente de ${aguardando.clientName} respondeu a tarefa em espera`, time: 'agora mesmo', unread: true });
  if (state.currentScreen === 'home') renderHome();
  renderNotifications();
  flash(`Cliente de ${aguardando.clientName} respondeu!`, 'info');
}

function resetDemo() {
  showConfirmModal({
    title: 'Resetar protótipo',
    message: 'Voltar ao estado inicial? Todas as alterações feitas na sessão serão perdidas.',
    confirmLabel: 'Resetar',
    danger: true,
    onConfirm: () => { _initState(); sortQueueBySLA(); renderNotifications(); goHome(); },
  });
}

/* ============================================================
   FLASH
   ============================================================ */
const FLASH_MS = 2600;

/** A pilha onde os avisos entram; nasce na primeira vez que alguém avisa algo. */
function flashStack() {
  let stack = document.getElementById('flash-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = 'flash-stack';
    stack.className = 'flash-stack';
    document.body.appendChild(stack);
  }
  return stack;
}

/* Monta o corpo de um aviso: o texto e a barra de tempo. Quem precisa de AÇÃO
   dentro do aviso (um "Desfazer") monta o próprio nó com estas classes — é o
   único motivo pra não usar flash() direto. `ms` é o tempo até sumir. */
function flashCorpo(el, msg, ms) {
  el.innerHTML = '<span class="flash-txt"></span><span class="flash-bar"></span>';
  el.querySelector('.flash-txt').textContent = msg;
  el.querySelector('.flash-bar').style.animationDuration = `${ms}ms`;
}

/** Fecha um aviso com o fade, e limpa a pilha quando esvazia. */
function flashFechar(el) {
  if (!el.isConnected) return;
  el.style.opacity = '0';
  setTimeout(() => {
    const stack = el.parentElement;
    el.remove();
    if (stack && stack.id === 'flash-stack' && !stack.children.length) stack.remove();
  }, 250);
}

function flash(msg, type) {
  const el = document.createElement('div');
  el.className = `flash-toast ${type || 'info'}`;
  flashCorpo(el, msg, FLASH_MS);
  flashStack().appendChild(el);
  setTimeout(() => flashFechar(el), FLASH_MS);
}

/* ============================================================
   INIT
   ============================================================ */
function _initCockpit() {
  _buildShell();
  window.CockpitSidebar.mount();
  _initState();
  // Wire up notification toggle after shell is in the DOM
  qs('#notif-toggle').addEventListener('click', () => { qs('#notif-panel').classList.toggle('hidden'); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#notif-toggle') && !e.target.closest('#notif-panel')) qs('#notif-panel').classList.add('hidden');
  });
  sortQueueBySLA();
  renderHome();
  renderNotifications();
  refreshIcons();

  // Deep-link: se o operador chegou clicando numa tarefa na lista
  // (lista-operador.html abre o fluxo com ?ref=lista), pula a home e abre
  // direto a tela da tarefa — replica o que vai acontecer de verdade pra ele.
  try {
    if (new URLSearchParams(window.location.search).get('ref') === 'lista') {
      _olOpenOnArrival();
    }
  } catch (e) { /* sem URL params, segue na home */ }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initCockpit);
} else {
  _initCockpit();
}

// Botão "Acompanhamento" no topbar (fonte única). Aparece SÓ quando a tela visível é
// uma FILA de tarefas do operador — a que tem o hero "Pegar próxima tarefa" (#ol-header).
// Isso cobre a fila dedicada (lista-operador) E a home de cada fluxo, e some nas telas de
// execução da tarefa (#screen-task/execution/success), onde o #ol-header fica oculto.
// _syncAcompanhamentoBtn() é chamado por showScreen() e olMount() a cada troca de tela.
function _syncAcompanhamentoBtn() {
  const btn = document.getElementById('btn-acompanhamento');
  if (!btn) return;
  const hero = document.getElementById('ol-header'); // hero da fila (Pegar próxima tarefa)
  const naFila = !!(hero && hero.offsetParent !== null); // existe E está visível na tela
  btn.style.display = naFila ? 'inline-flex' : 'none';
}
(function _injectAcompanhamentoBtn() {
  const page = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
  if (page === 'acompanhamento') return; // a própria tela de destino
  let tries = 0;
  (function place() {
    if (document.getElementById('btn-acompanhamento')) { _syncAcompanhamentoBtn(); return; }
    const right = document.querySelector('.topbar-right');
    if (!right) { if (tries++ < 40) setTimeout(place, 50); return; } // gerente (.mgr-topbar) não entra: sem fila
    const a = document.createElement('a');
    a.id = 'btn-acompanhamento';
    // Leva a origem (arquivo atual + hash) pra que o "Voltar pra fila" retorne pra cá.
    const origem = (location.pathname.split('/').pop() || 'lista-operador.html') + location.search + location.hash;
    a.href = 'acompanhamento.html?origem=' + encodeURIComponent(origem);
    a.title = 'Painel de acompanhamento (gestores e coordenadores)';
    // Começa oculto; _syncAcompanhamentoBtn decide a visibilidade pela tela atual.
    a.style.cssText = 'display:none;align-items:center;gap:7px;height:38px;padding:0 14px;border:1px solid var(--border);border-radius:10px;background:#fff;color:var(--text-primary);font-size:13px;font-weight:500;text-decoration:none;margin-right:12px;';
    a.innerHTML = '<i data-lucide="layout-dashboard" style="width:16px;height:16px;color:var(--brand-blue);"></i> Acompanhamento';
    right.insertBefore(a, right.firstChild);
    if (window.lucide) lucide.createIcons();
    _syncAcompanhamentoBtn();
  })();
})();
