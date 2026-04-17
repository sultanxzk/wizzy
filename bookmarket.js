// ============================================================
//  QUIZ HELPER — Bookmarklet (sem servidor proxy)
//  A API key é armazenada no localStorage do usuário.
//  Nunca é embutida no código — cada usuário usa a própria key.
// ============================================================

(function () {
  if (window.__quizHelper) return window.__quizHelper.toggle();
  window.__quizHelper = true;

  const API_URL = "https://api.anthropic.com/v1/messages";
  const LS_KEY  = "qh_anthropic_key";

  // ── Estilos ─────────────────────────────────────────────────
  const css = `
    #qh{position:fixed;bottom:24px;right:24px;width:348px;max-height:560px;
      background:#fff;border:1px solid #e4e4e7;border-radius:18px;
      box-shadow:0 12px 40px rgba(0,0,0,.13);font-family:-apple-system,
      BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;z-index:2147483647;
      display:flex;flex-direction:column;overflow:hidden;transition:opacity .2s,transform .2s}
    #qh.hidden{opacity:0;transform:translateY(10px);pointer-events:none}
    #qh-head{padding:13px 16px;border-bottom:1px solid #f0f0f0;display:flex;
      align-items:center;gap:10px;background:#fafafa;border-radius:18px 18px 0 0;cursor:move;
      user-select:none}
    #qh-logo{width:30px;height:30px;background:#18181b;border-radius:9px;
      display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;
      flex-shrink:0;letter-spacing:-.5px;font-weight:700}
    #qh-info{flex:1}
    #qh-name{font-weight:600;font-size:13px;color:#18181b}
    #qh-host{font-size:11px;color:#a1a1aa;margin-top:1px}
    #qh-x{width:24px;height:24px;border-radius:7px;border:none;background:#f4f4f5;
      cursor:pointer;font-size:15px;color:#71717a;display:flex;align-items:center;
      justify-content:center;line-height:1}
    #qh-x:hover{background:#e4e4e7}
    #qh-body{flex:1;overflow-y:auto;padding:14px;scroll-behavior:smooth}
    #qh-body::-webkit-scrollbar{width:4px}
    #qh-body::-webkit-scrollbar-track{background:transparent}
    #qh-body::-webkit-scrollbar-thumb{background:#e4e4e7;border-radius:4px}
    #qh-foot{padding:11px 14px;border-top:1px solid #f0f0f0;background:#fafafa;
      border-radius:0 0 18px 18px;display:flex;flex-direction:column;gap:6px}
    #qh-btn{width:100%;padding:10px;background:#18181b;color:#fff;border:none;
      border-radius:11px;font-size:13px;font-weight:600;cursor:pointer;
      transition:background .15s,transform .1s;letter-spacing:.01em}
    #qh-btn:hover{background:#27272a}
    #qh-btn:active{transform:scale(.98)}
    #qh-btn:disabled{background:#d4d4d8;cursor:not-allowed;transform:none}
    #qh-key-link{text-align:center;font-size:11px;color:#a1a1aa;cursor:pointer;
      text-decoration:underline;background:none;border:none;width:100%;padding:0}
    #qh-key-link:hover{color:#71717a}
    .qh-q{background:#f8f8f8;border-left:3px solid #18181b;border-radius:0 10px 10px 0;
      padding:11px 13px;margin-bottom:13px;font-size:12px;color:#52525b;line-height:1.6}
    .qh-q b{display:block;color:#18181b;font-size:12px;margin-bottom:4px;text-transform:uppercase;
      letter-spacing:.05em}
    .qh-opt{display:flex;align-items:flex-start;gap:9px;padding:9px 11px;border-radius:9px;
      border:1px solid #e4e4e7;margin-bottom:6px;font-size:12.5px;color:#3f3f46;
      transition:all .18s}
    .qh-opt.ok{background:#f0fdf4;border-color:#86efac;color:#15803d}
    .qh-opt.no{background:#fef2f2;border-color:#fca5a5;color:#b91c1c;opacity:.75}
    .qh-lt{width:21px;height:21px;border-radius:6px;background:#e4e4e7;
      display:flex;align-items:center;justify-content:center;font-size:10px;
      font-weight:700;flex-shrink:0;margin-top:1px;color:#71717a}
    .qh-opt.ok .qh-lt{background:#22c55e;color:#fff;border-color:transparent}
    .qh-opt.no .qh-lt{background:#fca5a5;color:#fff}
    .qh-exp{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;
      padding:11px 13px;margin-top:11px;font-size:12px;color:#166534;line-height:1.65}
    .qh-exp b{display:block;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;
      margin-bottom:4px;color:#16a34a}
    .qh-spin-wrap{text-align:center;padding:28px 0;color:#a1a1aa;font-size:12px}
    .qh-spin{width:26px;height:26px;border:2px solid #e4e4e7;border-top-color:#18181b;
      border-radius:50%;animation:qs .65s linear infinite;margin:0 auto 10px}
    @keyframes qs{to{transform:rotate(360deg)}}
    .qh-empty{text-align:center;padding:28px 16px;color:#a1a1aa;font-size:12.5px;
      line-height:1.7}
    .qh-empty span{font-size:22px;display:block;margin-bottom:8px}
    .qh-warn{background:#fffbeb;border:1px solid #fde68a;border-radius:10px;
      padding:11px 13px;font-size:12px;color:#92400e;line-height:1.6}
    .qh-warn b{display:block;margin-bottom:3px}
    .qh-ans{display:flex;align-items:center;gap:8px;padding:10px 12px;
      background:#f0fdf4;border:1px solid #86efac;border-radius:9px;margin-bottom:6px}
    .qh-ans-check{width:21px;height:21px;border-radius:6px;background:#22c55e;
      color:#fff;display:flex;align-items:center;justify-content:center;
      font-size:13px;flex-shrink:0}
    .qh-ans-text{font-size:12.5px;color:#15803d;font-weight:500}
    .qh-setup{padding:6px 0}
    .qh-setup p{font-size:12px;color:#52525b;line-height:1.6;margin:0 0 10px}
    .qh-setup input{width:100%;padding:9px 11px;border:1px solid #e4e4e7;border-radius:9px;
      font-size:12px;box-sizing:border-box;outline:none;color:#18181b}
    .qh-setup input:focus{border-color:#a1a1aa}
    .qh-setup a{color:#18181b;font-size:11px}
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ── Painel HTML ─────────────────────────────────────────────
  const panel = document.createElement("div");
  panel.id = "qh";
  panel.innerHTML = `
    <div id="qh-head">
      <div id="qh-logo">✦</div>
      <div id="qh-info">
        <div id="qh-name">Quiz Helper</div>
        <div id="qh-host">${location.hostname}</div>
      </div>
      <button id="qh-x" title="Fechar">×</button>
    </div>
    <div id="qh-body">
      <div class="qh-empty">
        <span>🔍</span>
        Navegue até uma questão e clique em <strong>Analisar questão</strong>.
      </div>
    </div>
    <div id="qh-foot">
      <button id="qh-btn">✦ Analisar questão</button>
      <button id="qh-key-link">⚙ Configurar API key</button>
    </div>
  `;
  document.body.appendChild(panel);

  window.__quizHelper = { toggle: () => panel.classList.toggle("hidden") };

  document.getElementById("qh-x").onclick = () => panel.classList.add("hidden");

  // ── Drag ────────────────────────────────────────────────────
  let drag = false, ox, oy;
  const head = document.getElementById("qh-head");
  head.addEventListener("mousedown", (e) => {
    drag = true;
    const r = panel.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    panel.style.transition = "none";
  });
  document.addEventListener("mousemove", (e) => {
    if (!drag) return;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.left = Math.max(0, Math.min(e.clientX - ox, window.innerWidth - 348)) + "px";
    panel.style.top  = Math.max(0, Math.min(e.clientY - oy, window.innerHeight - 80)) + "px";
  });
  document.addEventListener("mouseup", () => { drag = false; panel.style.transition = ""; });

  // ── Gerenciamento da API key ─────────────────────────────────
  function getKey() { return localStorage.getItem(LS_KEY) || ""; }
  function saveKey(k) { localStorage.setItem(LS_KEY, k.trim()); }

  function showKeySetup(onSave) {
    const body = document.getElementById("qh-body");
    body.innerHTML = `
      <div class="qh-setup">
        <p>Informe sua <strong>Anthropic API key</strong>.<br>
        Ela fica salva <em>só no seu navegador</em> e nunca é enviada a ninguém além da Anthropic.</p>
        <input id="qh-key-input" type="password" placeholder="sk-ant-api03-…" value="${getKey()}">
        <p style="margin-top:8px">
          <a href="https://console.anthropic.com/settings/keys" target="_blank">
            Obter uma key gratuita →
          </a>
        </p>
      </div>
    `;
    const btn = document.getElementById("qh-btn");
    btn.textContent = "💾 Salvar key";
    btn.disabled = false;
    btn.onclick = function () {
      const val = document.getElementById("qh-key-input").value.trim();
      if (!val.startsWith("sk-")) {
        document.getElementById("qh-key-input").style.borderColor = "#fca5a5";
        return;
      }
      saveKey(val);
      resetBtn();
      body.innerHTML = `<div class="qh-empty"><span>✅</span>Key salva! Agora clique em <strong>Analisar questão</strong>.</div>`;
      if (onSave) onSave();
    };
  }

  function resetBtn() {
    const btn = document.getElementById("qh-btn");
    btn.textContent = "✦ Analisar questão";
    btn.disabled = false;
    btn.onclick = analyzeClick;
  }

  document.getElementById("qh-key-link").onclick = () => showKeySetup(resetBtn);

  // ── Extração de questão ──────────────────────────────────────
  function extractQuestion() {
    const qSelectors = [
      ".question-text","[class*='questionText']","[class*='question-text']",
      "[data-testid='question-text']",".perseus-renderer",
      ".freebirdFormviewerViewItemsItemItemTitle",
      '[data-functional-selector="question-title"]',
      ".question",".stem",".prompt","[class*='Question']",
      "[class*='question']","[class*='problem']",
    ];
    let question = "";
    for (const sel of qSelectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText && el.innerText.trim().length > 15) {
        question = el.innerText.trim().slice(0, 900);
        break;
      }
    }
    if (!question) {
      const all = [...document.querySelectorAll("p,h1,h2,h3,div,span")];
      for (const el of all) {
        const t = el.innerText ? el.innerText.trim() : "";
        if (t.length > 20 && t.length < 700 && el.children.length < 4 &&
          (t.includes("?") ||
           /^(qual|what|who|how|why|when|where|which|calcul|find|determine|explain|solve)/i.test(t))) {
          question = t; break;
        }
      }
    }
    const optSelectors = [
      "[class*='option']","[class*='Option']","[class*='choice']","[class*='Choice']",
      "[class*='answer']","[class*='alternative']","[role='radio']","[role='checkbox']",
      ".freebirdFormviewerViewItemsRadioChoice","[data-functional-selector*='answer']",
    ];
    let options = [];
    for (const sel of optSelectors) {
      const els = [...document.querySelectorAll(sel)];
      if (els.length >= 2 && els.length <= 8) {
        const texts = els.map(e => e.innerText.trim()).filter(t => t && t.length < 300);
        if (texts.length >= 2) { options = texts.slice(0, 6); break; }
      }
    }
    return { question, options };
  }

  // ── Chamada direta à API Anthropic ───────────────────────────
  async function askClaude(question, options) {
    const key = getKey();
    if (!key) throw new Error("NO_KEY");

    const optionsText = options && options.length
      ? "\n\nAlternativas:\n" + options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join("\n")
      : "";

    const prompt = `Você é um assistente educacional preciso. Analise a questão abaixo e forneça a resposta correta com uma explicação clara e didática em português.

Questão: ${question}${optionsText}

Responda SOMENTE com um objeto JSON válido, sem markdown, sem texto extra:
${options && options.length
  ? `{"correct_letter":"A","correct_text":"texto da alternativa correta","explanation":"explicação curta e clara","options":[{"letter":"A","text":"...","correct":true}]}`
  : `{"correct_text":"resposta correta","explanation":"explicação curta e clara","options":[]}`}`;

    const resp = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (resp.status === 401) throw new Error("KEY_INVALID");
    if (!resp.ok) throw new Error(`API error ${resp.status}`);

    const data = await resp.json();
    const text = data.content && data.content[0] && data.content[0].text;
    if (!text) throw new Error("Resposta vazia da API");
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  }

  // ── Botão principal ──────────────────────────────────────────
  async function analyzeClick() {
    const body = document.getElementById("qh-body");
    const btn  = document.getElementById("qh-btn");

    // Sem key → tela de configuração
    if (!getKey()) { showKeySetup(resetBtn); return; }

    btn.disabled = true;
    btn.textContent = "Analisando...";
    body.innerHTML = '<div class="qh-spin-wrap"><div class="qh-spin"></div>Detectando questão...</div>';

    const { question, options } = extractQuestion();

    if (!question) {
      body.innerHTML = `<div class="qh-warn"><b>Questão não detectada</b>
        Navegue até a questão ou selecione o texto da pergunta e tente novamente.</div>`;
      resetBtn(); return;
    }

    body.innerHTML = '<div class="qh-spin-wrap"><div class="qh-spin"></div>Consultando IA...</div>';

    try {
      const result = await askClaude(question, options);

      let html = `<div class="qh-q"><b>Questão detectada</b>${question.slice(0, 220)}${question.length > 220 ? "…" : ""}</div>`;

      if (result.options && result.options.length) {
        for (const o of result.options) {
          html += `<div class="qh-opt ${o.correct ? "ok" : "no"}">
            <div class="qh-lt">${o.letter}</div>
            <div>${o.text}</div>
          </div>`;
        }
      } else if (result.correct_text) {
        html += `<div class="qh-ans">
          <div class="qh-ans-check">✓</div>
          <div class="qh-ans-text">${result.correct_text}</div>
        </div>`;
      }

      if (result.explanation) {
        html += `<div class="qh-exp"><b>💡 Explicação</b>${result.explanation}</div>`;
      }

      body.innerHTML = html;
    } catch (err) {
      if (err.message === "NO_KEY" || err.message === "KEY_INVALID") {
        if (err.message === "KEY_INVALID") localStorage.removeItem(LS_KEY);
        showKeySetup(resetBtn);
        document.getElementById("qh-body").innerHTML = `
          <div class="qh-warn" style="margin-bottom:12px"><b>${err.message === "KEY_INVALID" ? "❌ API key inválida" : "🔑 API key necessária"}</b>
          ${err.message === "KEY_INVALID" ? "Verifique e informe uma key válida." : "Configure sua key para continuar."}</div>
          ${document.getElementById("qh-body").innerHTML}`;
        return;
      }
      body.innerHTML = `<div class="qh-warn"><b>Erro</b>
        <code style="font-size:11px;color:#92400e">${err.message}</code></div>`;
    }

    resetBtn();
  }

  document.getElementById("qh-btn").onclick = analyzeClick;
})();
