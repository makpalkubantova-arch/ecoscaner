/* ЭКОСКАНЕР · тақта (әдепкі), оқушы (?m=s), қонақ (?m=g) */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const P = "es";
const store = { get(k, d) { try { const v = localStorage.getItem(P + k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch {} }, del(k) { try { localStorage.removeItem(P + k); } catch {} } };
const MODE = new URLSearchParams(location.search).get("m") || "b";
const ST = DATA.stages, L = DATA.lesson, PTS = DATA.points, MAXP = Object.values(PTS).reduce((a, b) => a + b, 0), TASKS = Object.keys(PTS);
const PHONE = ["t6"]; /* телефон тек бекіту квизіне; қалғаны тақтада және парақта, балды хатшы қояды */
const nrm = n => String(n || "").toLowerCase().trim().replace(/\s+/g, " ").replace(/[әғқңөұүһі]/g, c => ({ "ә": "а", "ғ": "г", "қ": "к", "ң": "н", "ө": "о", "ұ": "у", "ү": "у", "һ": "х", "і": "и" })[c]);
const GK = Object.keys(DATA.groups), ROLE = { sp1: "🎤 1-спикер", sp2: "🎤 2-спикер", hs: "📒 хатшы", po: "🖼️ постер қорғаушы" };
/* LIVE.read: хатшы енгізген балдар мен оқушының квизін есім бойынша бір адамға біріктіру */
{ const _r = LIVE.read.bind(LIVE); LIVE.read = async () => { const d = await _r(); const by = {};
  Object.entries(d.students || {}).forEach(([id, v]) => { if (!v || !v.name) return; const k = nrm(v.name), o = by[k] || (by[k] = { ...v, sc: {}, at: {} });
    if (v.src === "hatshy") { o.name = v.name; if (v.g) o.g = v.g; } else { o.sky = v.sky ?? o.sky; o.pair = v.pair || o.pair; if (!o.g) o.g = v.g; }
    Object.entries(v.sc || {}).forEach(([kk, x]) => { o.sc[kk] = Math.max(o.sc[kk] || 0, +x || 0); }); Object.assign(o.at, v.at || {}); });
  d.students = Object.fromEntries(Object.entries(by).map(([k, o]) => [k, o])); return d; }; }
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmt = (v, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toString().replace(".", ",");
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const hm = ts => new Date(ts).toLocaleTimeString("kk-KZ", { hour: "2-digit", minute: "2-digit" });
let toastT; const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2600); };

/* ---------- 3D иконкалар ---------- */
const EP = /\p{Extended_Pictographic}️?(?:‍\p{Extended_Pictographic}️?)*/gu, EP1 = /\p{Extended_Pictographic}/u;
function decoText(n) {
  const p = n.parentElement; if (!p || p.closest("svg,textarea,input,script,style,option,title,.e3")) return;
  const t = n.data; if (!EP1.test(t)) return; let last = 0, hit = false; const fr = document.createDocumentFragment();
  for (const m of t.matchAll(EP)) { const f = typeof EMO !== "undefined" && EMO[m[0].replace(/️/g, "")]; if (!f) continue; hit = true;
    if (m.index > last) fr.append(t.slice(last, m.index)); const im = document.createElement("img"); im.className = "e3"; im.alt = m[0]; im.src = "media/3d/" + f + ".webp"; im.draggable = false; fr.append(im); last = m.index + m[0].length; }
  if (!hit) return; if (last < t.length) fr.append(t.slice(last)); n.replaceWith(fr);
}
function deco(root) { if (root.nodeType === 3) return decoText(root); if (root.nodeType !== 1) return; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), A = []; while (w.nextNode()) A.push(w.currentNode); A.forEach(decoText); }
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(deco))).observe(document.body, { childList: true, subtree: true });
deco(document.body);

/* ---------- оқушы, ұпай ---------- */
const me = () => store.get("me", null);
const scores = () => store.get("sc", {});
const doneAt = () => store.get("at", {});
const total = (sc = scores()) => TASKS.reduce((t, k) => t + (sc[k] || 0), 0);
const mark = t => { const p = Math.round(t / MAXP * 100); const g = DATA.grades.find(g => p >= g.min); return { p, m: Math.max(1, Math.round(p / 10)), lv: g.name, c: g.c }; };
function setScore(k, v, done) { const s = scores(); s[k] = Math.max(0, Math.min(PTS[k], v)); store.set("sc", s); if (done) { const a = doneAt(); a[k] = a[k] || Date.now(); store.set("at", a); } push(); paintMe(); }
function push() { const m = me(); if (!m || !LIVE.on()) return; LIVE.pushStudent(m.id, { name: m.name, g: m.g, sc: scores(), at: doneAt(), pair: store.get("pair", ""), total: total(), sky: store.get("mySky", null), ts: m.ts || Date.now() }); }
function paintMe() { const e = $("#phSc"); if (e) e.textContent = `${total()} / ${MAXP}`; }
const RESULT_KEYS = ["me", "sc", "at", "pair", "mySky", "q_t1", "t1ord", "t1chk", "q_t2", "q_t3", "q_t4", "q_t5", "q_t6", "t5o", "t3sent", "notes", "bonus"];
const wipe = () => { RESULT_KEYS.forEach(k => store.del(k)); LIVE.drop(); };

/* ---------- QR ---------- */
let qn = 0;
function qrSvg(text) {
  const id = "qg" + (++qn), q = qrcode(0, "M"); q.addData(text); q.make();
  const n = q.getModuleCount(), m = 2, S = n + 2 * m, fin = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  let d = ""; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c) && !fin(r, c)) d += `<rect x="${c + m + .08}" y="${r + m + .08}" width=".84" height=".84" rx=".28"/>`;
  const eye = (x, y) => `<rect x="${x + m + .5}" y="${y + m + .5}" width="6" height="6" rx="1.6" fill="none" stroke="#0B3D3A" stroke-width="1"/><rect x="${x + m + 2}" y="${y + m + 2}" width="3" height="3" rx=".8" fill="#0EA5E9"/>`;
  return `<svg viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00799A"/><stop offset="1" stop-color="#0EA5E9"/></linearGradient></defs><rect width="${S}" height="${S}" fill="#fff"/><g fill="url(#${id})">${d}</g>${eye(0, 0)}${eye(n - 7, 0)}${eye(0, n - 7)}</svg>`;
}
const link = (m, h) => { const u = new URL(location.href); u.hash = ""; u.searchParams.delete("m"); u.searchParams.set("m", m); if (LIVE.on()) u.searchParams.set("db", LIVE.url); return u.toString() + (h ? "#" + h : ""); };

/* ---------- графиктер ---------- */
function chartTrend(W = 560, H = 230, data = DATA.karaganda) {
  const p = { l: 40, r: 12, t: 26, b: 30 }, cw = (W - p.l - p.r) / data.length, mx = 44, y = v => H - p.b - v / mx * (H - p.t - p.b);
  let s = `<svg viewBox="0 0 ${W} ${H}"><defs><linearGradient id="kk${++qn}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F87171"/><stop offset="1" stop-color="#991B1B"/></linearGradient><linearGradient id="tt${qn}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDBA74"/><stop offset="1" stop-color="#C2410C"/></linearGradient></defs>`;
  s += `<rect x="${p.l}" y="${y(mx)}" width="${W - p.l - p.r}" height="${y(10) - y(mx)}" fill="#FDECEC"/><line x1="${p.l}" x2="${W - p.r}" y1="${y(10)}" y2="${y(10)}" stroke="#F59E0B" stroke-dasharray="5 4"/><text x="${W - p.r}" y="${y(10) - 5}" text-anchor="end" class="bnd">СИ = 10</text>`;
  [0, 20, 40].forEach(v => s += `<text x="${p.l - 6}" y="${y(v) + 4}" text-anchor="end" class="ax">${v}</text>`);
  data.forEach(([yr, k, t], i) => { const cx = p.l + cw * i + cw / 2;
    s += `<rect class="ch-bar" style="transform-origin:${cx - 13}px ${y(0)}px;animation-delay:${i * .12}s" x="${cx - 30}" y="${y(k)}" width="28" height="${y(0) - y(k)}" rx="5" fill="url(#kk${qn})"/><text x="${cx - 16}" y="${y(k) - 5}" text-anchor="middle" class="val">${fmt(k)}</text>`;
    s += `<rect class="ch-bar" style="transform-origin:${cx + 15}px ${y(0)}px;animation-delay:${i * .12 + .06}s" x="${cx + 2}" y="${y(t)}" width="28" height="${y(0) - y(t)}" rx="5" fill="url(#tt${qn})"/><text x="${cx + 16}" y="${y(t) - 5}" text-anchor="middle" class="val sm2">${fmt(t)}</text>`;
    s += `<text x="${cx}" y="${H - 9}" text-anchor="middle" class="ax">${yr}</text>`; });
  return s + `</svg>`;
}
function hbars(rows, max, unit = "ШЖШ") {
  return `<div class="hb">${rows.map(([n, v], i) => `<div><span>${esc(n)}</span><i><u style="width:${Math.min(100, v / max * 100)}%;animation-delay:${i * .1}s;background:${v >= 10 ? "#DC2626" : v >= 5 ? "#EA580C" : v >= 1 ? "#CA8A04" : "#16A34A"}"></u></i><b>${fmt(v)} <small>${unit}</small></b></div>`).join("")}</div>`;
}
function gauge(si, ez) {
  const lv = si > 10 || ez >= 50 ? 3 : si >= 5 || ez >= 20 ? 2 : si >= 2 || ez >= 1 ? 1 : 0, cols = ["#16A34A", "#CA8A04", "#EA580C", "#B91C1C"];
  const ang = -90 + (lv + .5) * 45;
  return `<svg viewBox="0 0 200 120" class="gauge">${cols.map((c, i) => { const a0 = Math.PI * (1 - i / 4), a1 = Math.PI * (1 - (i + 1) / 4); return `<path d="M${100 + 80 * Math.cos(a0)} ${100 - 80 * Math.sin(a0)} A80 80 0 0 1 ${100 + 80 * Math.cos(a1)} ${100 - 80 * Math.sin(a1)}" stroke="${c}" stroke-width="18" fill="none"/>`; }).join("")}
  <g style="transform:rotate(${ang}deg);transform-origin:100px 100px" class="needle"><line x1="100" y1="100" x2="100" y2="34" stroke="#0B1F2A" stroke-width="5" stroke-linecap="round"/></g><circle cx="100" cy="100" r="9" fill="#0B1F2A"/></svg>`;
}

/* ================= ТАПСЫРМАЛАР (тақтада да, телефонда да) ================= */
const TASK = {
  t1(root) {
    const C = DATA.t1, st = store.get("q_t1", {}), order = store.get("t1ord", null) || shuffle(C.cards.map((_, i) => i)); store.set("t1ord", order);
    let checked = store.get("t1chk", false);
    const draw = () => {
      root.innerHTML = `<div class="t1leg">${C.cats.map(([k, n]) => `<span class="c-${k}">${n}</span>`).join("")}</div><div class="t1l">${order.map(i => { const [t, a] = C.cards[i], v = st[i];
        return `<div class="t1r ${checked ? (v === a ? "ok" : "no") : v ? "set" : ""}"><span>${esc(t)}</span><div>${C.cats.map(([k, n]) => `<button class="cb c-${k} ${v === k ? "on" : ""} ${checked && a === k ? "right" : ""}" data-i="${i}" data-c="${k}" title="${n}">${n.split(" ")[0]} ${{air:"А",water:"С",soil:"Т",eco:"Ж"}[k]}</button>`).join("")}</div></div>`; }).join("")}</div>
        <div class="trow"><button class="btn" data-a="check">✓ Тексеру</button><span class="score" data-a="score">${checked ? `${C.cards.filter((c, i) => st[i] === c[1]).length}/${C.cards.length} дұрыс · ${scores().t1 ?? 0}/${PTS.t1} ұпай` : `${Object.keys(st).length}/${C.cards.length} таңдалды`}</span></div>`;
    };
    draw();
    root.onclick = e => {
      const b = e.target.closest(".cb"); if (b && !checked) { st[b.dataset.i] = b.dataset.c; store.set("q_t1", st); draw(); return; }
      if (e.target.closest("[data-a=check]") && !checked) { const n = Object.keys(st).length; if (n < C.cards.length) { toast(`Барлық ${C.cards.length} көрсеткішті жікте (қалды: ${C.cards.length - n})`); return; }
        const ok = C.cards.filter((c, i) => st[i] === c[1]).length; checked = true; store.set("t1chk", true); setScore("t1", ok >= 7 ? 2 : ok >= 4 ? 1 : 0, true); draw(); toast(ok === C.cards.length ? "Сканер дәл жіктеді! 🎯" : "Қызыл жолдарды қара: жасыл жиек — дұрыс жауап"); }
    };
  },
  mcq(root, Q, key, pts, opts = {}) {
    const st = store.get("q_" + key, {});
    const draw = () => {
      let lastK = null;
      root.innerHTML = `<div class="qs">${Q.map((q, i) => { const head = q.k && q.k !== lastK ? `<h5 class="qk">${esc(q.k)}</h5>` : ""; lastK = q.k;
        return `${head}<div class="q"><p>${i + 1}. ${esc(q.q)}</p><div class="opts">${q.o.map((o, k) => { const done = st[i] != null; const cls = done ? (k === q.a ? "ok" : k === st[i] ? "no" : "dim") : ""; return `<button class="opt ${cls}" data-q="${i}" data-k="${k}">${esc(o)}</button>`; }).join("")}</div>${st[i] != null && q.e ? `<div class="exp">${st[i] === q.a ? "✓ " : "✗ "}${esc(q.e)}</div>` : ""}</div>`; }).join("")}</div>
      <div class="trow"><span class="score">${Object.keys(st).length ? `${Q.filter((q, i) => st[i] === q.a).length} / ${Q.length} дұрыс` : ""}</span>${opts.noReset ? "" : `<button class="btn lt" data-a="r">Қайта</button>`}</div>`;
    };
    draw();
    root.onclick = e => {
      if (e.target.closest("[data-a=r]")) { Object.keys(st).forEach(k => delete st[k]); store.set("q_" + key, st); draw(); return; }
      const b = e.target.closest(".opt"); if (!b) return; const i = +b.dataset.q; if (st[i] != null) return;
      st[i] = +b.dataset.k; store.set("q_" + key, st); const ok = Q.filter((q, j) => st[j] === q.a).length, all = Object.keys(st).length === Q.length;
      if (opts.onAnswer) opts.onAnswer(st, ok, all); else if (pts) setScore(key, Math.round(ok / Q.length * PTS[key]), all);
      if (all && ok === Q.length) toast(opts.perfect || "Тамаша! Барлығы дұрыс 🎉");
      draw();
    };
  },
  t2(root) {
    const pair = store.get("pair", "");
    root.innerHTML = `<div class="pairbox">👥 Жұбым: <input class="inp" id="pairIn" maxlength="30" placeholder="жұбыңның аты" value="${esc(pair)}"></div><div data-q></div>`;
    $("#pairIn", root).onchange = e => { store.set("pair", e.target.value.trim()); push(); };
    TASK.mcq($("[data-q]", root), DATA.t2, "t2", true, { perfect: "Жұбыңмен бірге 6/6! 🤝", onAnswer: (st) => { const ok = r => DATA.t2.filter((q, j) => q.k === r).every((q) => st[DATA.t2.indexOf(q)] === q.a); setScore("t2", (ok("Норматив") ? 1 : 0) + (ok("Қауіп класы") ? 1 : 0), Object.keys(st).length === DATA.t2.length); } });
  },
  t3(root, gFix) {
    const g = gFix || me()?.g || "g1", D = DATA.t3[g], G = DATA.groups[g];
    const sent = store.get("t3sent", null);
    root.innerHTML = `<div class="dos mini" style="--gc:${G.c}"><div class="dos-h">${G.i} <b>${esc(G.n)}</b><span>${esc(D.period)}</span></div>
      <div class="dos-k"><div><small>СИ</small><b>${fmt(D.si)}</b></div><div><small>ЕЖҚ</small><b>${fmt(D.ez)}%</b></div></div>${hbars(D.air, Math.max(...D.air.map(a => a[1])) * 1.1)}
      <ul class="dos-f">${D.facts.map(f => `<li>${esc(f)}</li>`).join("")}</ul></div><div data-q></div>
      <textarea id="idea" maxlength="200" placeholder="💡 Топтың ұсынысы: қаланың ауасын/суын қалай жақсартуға болады? (1 сөйлем)">${esc(sent?.idea || "")}</textarea>
      <div class="trow"><button class="btn" id="t3send">${sent ? "Қайта жіберу" : "🚀 Тақтаға жіберу"}</button><span class="score" id="t3sc"></span></div>`;
    const Q = DATA.t3.qs.map((q, i) => ({ ...q, a: D.a[i] }));
    TASK.mcq($("[data-q]", root), Q, "t3", false, { noReset: true, onAnswer: (st, ok) => { $("#t3sc", root).textContent = `${ok}/3`; } });
    $("#t3send", root).onclick = async () => {
      const st = store.get("q_t3", {}); if (Object.keys(st).length < 3) { toast("3 сұраққа да жауап бер"); return; }
      const ok = Q.filter((q, i) => st[i] === q.a).length, rec = { ans: Q.map((q, i) => q.o[st[i]]), ok, idea: $("#idea", root).value.trim(), by: me()?.name || "", ts: Date.now() };
      store.set("t3sent", rec); setScore("t3", ok, true);
      if (LIVE.on() && gFix == null) { try { await LIVE.pushGroup(g + "/sub", rec); } catch {} }
      toast("Топтың жауабы тақтаға жіберілді! 📡");
    };
  },
  t4(root) {
    const E = DATA.t4, s = { a: E.a.c, b: E.b.c };
    root.innerHTML = `<div class="exp" style="margin-bottom:10px">🤖 Тақтада ЖИ-ге сұрақ қойылды. Оның жауабын және оқулықтағы шешімді осы есептегішпен тексер — шешімді өзің қабылда.</div><div class="labg"><div class="labc">
        ${["a", "b"].map(k => `<div class="lab-r"><div class="h"><b>${E[k].n}</b><span>ШШК = ${fmt(E[k].pdk, 2)} мг/м³</span></div><input type="range" data-k="${k}" min="0" max="${E[k].pdk * 2}" step="${E[k].pdk / 200}" value="${E[k].c}"><div class="v"><span data-v="${k}"></span> мг/м³</div></div>`).join("")}
        <div class="lab-f" data-f></div><div class="meter"><i data-m></i><div class="one">1,0 — шек</div></div><div class="verd" data-vd></div>
        <button class="btn am" data-a="book">📖 Оқулықтағы мәндер (93-б.)</button></div><div data-qs></div></div>`;
    const calc = () => { const ra = s.a / E.a.pdk, rb = s.b / E.b.pdk, sum = ra + rb, ok = sum < 1;
      $("[data-v=a]", root).textContent = fmt(s.a, 3); $("[data-v=b]", root).textContent = fmt(s.b, 4);
      $("[data-f]", root).innerHTML = `${fmt(ra, 3)} + ${fmt(rb, 3)} = <span class="${ok ? "ok" : "bad"}">${fmt(sum, 3)}</span>`;
      const m = $("[data-m]", root); m.style.width = Math.min(100, sum * 50) + "%"; m.style.background = ok ? "linear-gradient(90deg,#10B981,#00799A)" : "linear-gradient(90deg,#F59E0B,#DC2626)";
      const v = $("[data-vd]", root); v.className = "verd " + (ok ? "ok" : "bad"); v.textContent = ok ? "Қосынды < 1 — нормаға сай" : "Қосынды ≥ 1 — нормадан асады!"; };
    $$("input", root).forEach(i => i.oninput = () => { s[i.dataset.k] = +i.value; calc(); });
    $("[data-a=book]", root).onclick = () => { s.a = E.a.c; s.b = E.b.c; $$("input", root).forEach(i => i.value = s[i.dataset.k]); calc(); toast("Оқулықта 0,996 деп жазылған. Тексеріп көр!"); };
    calc(); TASK.mcq($("[data-qs]", root), E.q, "t4", true, { perfect: "Оқулықтағы қатені дәлелдедің! 🔍" });
  },
  t5(root) {
    const T = DATA.t5; let ord = store.get("t5o", []);
    const mix = store.get("t5mix", null) || shuffle(T.order.map((_, i) => i)); store.set("t5mix", mix);
    const draw = () => {
      const done = ord.length === T.order.length, ok = done && ord.every((v, i) => v === i);
      root.innerHTML = `<h5 class="qk">А. 27-сызба: 4 кезеңді ретімен бас (1 → 4)</h5><div class="ordr">${mix.map(i => { const pos = ord.indexOf(i); return `<button class="ob ${pos >= 0 ? (done ? (ord[pos] === pos ? "ok" : "no") : "on") : ""}" data-o="${i}">${pos >= 0 ? `<i>${pos + 1}</i>` : ""}${esc(T.order[i])}</button>`; }).join("")}</div>
        ${done ? `<div class="exp">${ok ? "✓ Реті дұрыс!" : "✗ Дұрыс реті: " + T.order.join(" → ")}</div>` : `<button class="btn lt" data-a="clr" style="margin-top:8px">Тазалау</button>`}
        <div data-q></div>`;
      const calc = (st) => { const m = T.match.filter((q, i) => st[i] === q.a).length; setScore("t5", (ok ? 1 : 0) + (m === T.match.length ? 1 : 0), done && Object.keys(st).length === T.match.length); };
      TASK.mcq($("[data-q]", root), T.match, "t5", false, { noReset: true, onAnswer: st => calc(st) });
      root.onclick = e => { if (e.target.closest("[data-q]")) return;
        const b = e.target.closest("[data-o]"); if (b && !done) { const i = +b.dataset.o; if (!ord.includes(i)) { ord.push(i); store.set("t5o", ord); if (ord.length === T.order.length) calc(store.get("q_t5", {})); draw(); } }
        if (e.target.closest("[data-a=clr]")) { ord = []; store.set("t5o", ord); draw(); } };
    };
    draw();
  },
  t6(root) { TASK.mcq(root, DATA.t6, "t6", true, { noReset: true, perfect: "Жедел сканер: 8/8! ⚡" }); }
};

/* ================= ТЕЛЕФОН ================= */
if (MODE === "h") { document.body.classList.add("ph"); $("#phone").hidden = false; secretary(); return; }
if (MODE !== "b") {
  document.body.classList.add("ph"); $("#phone").hidden = false;
  const ph = $("#phone"); let open = null, follow = null;
  const top = () => `<div class="ph-top"><span class="case-no sm">ЭКО<br>СКАН</span><span class="me">${me() ? esc(me().name) + " · " + DATA.groups[me().g].i : "Сарапшы"}</span><span class="sc" id="phSc">${total()} / ${MAXP}</span><span class="net" id="phNet"></span></div>`;
  function guest() {
    let stars = 0;
    ph.innerHTML = `<div class="ph-top"><span class="case-no sm">ЭКО<br>СКАН</span><span class="me">Құрметті қонақ</span></div>
    <div class="ph-h"><small>Кері байланыс</small><h2>Сабақ туралы пікіріңіз</h2></div>
    <div class="card fcol"><div class="gpick" id="role"><button class="on" data-r="Мұғалім">👩‍🏫 Мұғалім</button><button data-r="Әріптес">🤝 Әріптес</button><button data-r="Қонақ">🎩 Қонақ</button></div>
    <input class="inp" id="nm" placeholder="Аты-жөніңіз (міндетті емес)" maxlength="40"><div class="stars" id="stars">${[1, 2, 3, 4, 5].map(i => `<button data-s="${i}">⭐</button>`).join("")}</div>
    <textarea id="us" maxlength="300" placeholder="✅ Ұтымды болғаны"></textarea><textarea id="lk" maxlength="300" placeholder="✨ Қызықты болғаны"></textarea><textarea id="wi" maxlength="300" placeholder="💡 Ұсыныс"></textarea><button class="btn" id="send">Жіберу 🚀</button></div>`;
    ph.onclick = e => { const r = e.target.closest("[data-r]"); if (r) $$("#role button").forEach(b => b.classList.toggle("on", b === r)); const s = e.target.closest("[data-s]"); if (s) { stars = +s.dataset.s; $$("#stars button").forEach((b, i) => b.classList.toggle("on", i < stars)); } };
    $("#send").onclick = async () => { const rec = { role: $("#role .on").dataset.r, name: $("#nm").value.trim(), stars, use: $("#us").value.trim(), like: $("#lk").value.trim(), wish: $("#wi").value.trim(), ts: Date.now() };
      if (!rec.use && !rec.like && !rec.wish) { toast("Пікір жазыңыз"); return; } try { if (LIVE.on()) await LIVE.pushNote(rec); else store.set("notes", [...store.get("notes", []), rec]); ph.innerHTML = `<div class="ph-h done"><small>Рахмет!</small><h2>Пікіріңіз тақтаға жіберілді ✅</h2></div>`; } catch { toast("Жіберілмеді, қайта байқап көріңіз"); } };
  }
  function join() {
    let g = null;
    ph.innerHTML = `${top()}<div class="ph-h"><small>Экосканер</small><h2>Сарапшылар тобына қосыл</h2></div>
      <div class="card fcol"><input class="inp" id="nm" placeholder="Аты-жөнің" maxlength="40">
      <div class="gpick col">${Object.entries(DATA.groups).map(([k, v]) => `<button data-g="${k}">${v.i} ${v.n}</button>`).join("")}</div><button class="btn" id="ok">Кіру →</button></div>`;
    ph.onclick = e => { const b = e.target.closest("[data-g]"); if (b) { g = b.dataset.g; $$(".gpick button").forEach(x => x.classList.toggle("on", x === b)); } };
    let ros = store.get("roster", []); if (LIVE.on()) LIVE.getRoster().then(r => { if (Array.isArray(r)) { ros = r; store.set("roster", r); } }).catch(() => {});
    $("#nm").oninput = () => { const r = ros.find(x => nrm(x.name) === nrm($("#nm").value)); if (r) { g = r.g; $$(".gpick button").forEach(x => x.classList.toggle("on", x.dataset.g === g)); } };
    $("#ok").onclick = () => { const n = $("#nm").value.trim(); { const r = ros.find(x => nrm(x.name) === nrm(n)); if (r) g = r.g; } if (n.length < 2 || !g) { toast("Атыңды жаз және тобыңды таңда"); return; } store.set("me", { id: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: n, g, ts: Date.now() }); push(); hub(); };
  }
  function hub() {
    open = null; const sc = scores(), at = doneAt();
    ph.innerHTML = `${top()}<div class="ph-h"><small>Менің сканерім</small><h2>Тапсырмалар</h2></div><p class="follow">${LIVE.on() ? "📡 Тақтамен байланыс бар — тапсырма өздігінен ашылады" : "Тапсырманы таңда"}</p>
      <div class="ph-list">${PHONE.map(id => { const s = ST.find(x => x.id === id); return `<button data-o="${id}" class="${follow === id ? "now" : ""} ${at[id] ? "done" : ""}"><span><small>${esc(s.mode)} · ${esc(s.crit)}</small>${esc(s.title)}</span><b>${at[id] ? "✓ " : ""}${sc[id] ?? "—"} / ${PTS[id]}</b></button>`; }).join("")}
      <button data-o="self"><span><small>Рефлексия</small>«Менің аспаным»</span><b>→</b></button></div>
      <div class="card mine"><b>Менің нәтижем:</b> ${total()} / ${MAXP} ұпай · ${mark(total()).m} балл · ${mark(total()).lv}</div>`;
    ph.onclick = e => { const b = e.target.closest("[data-o]"); if (b && (PHONE.includes(b.dataset.o) || b.dataset.o === "self")) openTask(b.dataset.o); };
  }
  function openTask(id) {
    open = id;
    if (id === "self") {
      ph.innerHTML = `${top()}<div class="ph-h"><small>Рефлексия</small><h2>Менің аспаным қандай?</h2></div><div class="card"><div class="sky">${DATA.selfCheck.map(([i, t], k) => `<button data-sk="${k}" class="${store.get("mySky", null) === k ? "on" : ""}"><i>${i}</i>${t}</button>`).join("")}</div>
      <textarea id="su" maxlength="200" placeholder="✅ Ұтымды болғаны" style="margin-top:10px"></textarea><textarea id="sn" maxlength="200" placeholder="✨ Қызықты болғаны" style="margin-top:8px"></textarea><textarea id="sw" maxlength="200" placeholder="💡 Ұсынысым" style="margin-top:8px"></textarea><button class="btn" id="sv" style="margin-top:10px">Тақтаға жіберу 🚀</button></div><button class="btn lt" id="bk">← Тапсырмалар</button>`;
      ph.onclick = e => { const b = e.target.closest("[data-sk]"); if (b) { store.set("mySky", +b.dataset.sk); push(); $$(".sky button").forEach(x => x.classList.toggle("on", x === b)); } if (e.target.id === "bk") hub(); };
      $("#sv").onclick = async () => { const t = $("#sn").value.trim(), u = $("#su").value.trim(), w = $("#sw").value.trim(); if (!t && !u && !w) { toast("Бір жолын жаз"); return; } const rec = { role: "Оқушы", name: me()?.name || "", like: t, use: u, wish: w, sky: store.get("mySky", null), ts: Date.now() }; try { if (LIVE.on()) await LIVE.pushNote(rec); else store.set("notes", [...store.get("notes", []), rec]); toast("Жіберілді! ✅"); $("#sn").value = ""; $("#su").value = ""; $("#sw").value = ""; } catch { toast("Жіберілмеді"); } };
      return;
    }
    const s = ST.find(x => x.id === id);
    ph.innerHTML = `${top()}<div class="ph-h"><small>${esc(s.kicker)}</small><h2>${esc(s.title)}</h2></div><div class="howp">${DATA.how[id].map((h, i) => `<span><i>${i + 1}</i>${esc(h)}</span>`).join("")}</div><div class="card task-ph" id="tk"></div><button class="btn lt" id="bk">← Тапсырмалар</button>`;
    TASK[id]($("#tk")); $("#bk").onclick = hub;
  }
  if (MODE === "g") guest(); else if (!me()) join(); else hub();
  const net = () => { const e = $("#phNet"); if (!e) return; const bad = !navigator.onLine || LIVE.unsent(); e.className = "net" + (bad ? " bad" : ""); e.title = bad ? "Нәтиже телефонда сақталды, интернет қосылғанда өзі жіберіледі" : "Нәтиже тақтаға жіберілді"; e.textContent = bad ? "⏳" : "✓"; };
  if (MODE === "s") setInterval(net, 2000);
  if (MODE === "s") setInterval(async () => { if (!LIVE.on()) return;
    try { const ss = await LIVE.getSession(), loc = store.get("sess", null);
      if (ss && ss.id !== loc) { const m = me(); store.set("sess", ss.id); if (loc || (m && (m.ts || 0) < ss.ts)) { wipe(); store.del("t5mix"); toast("🔔 Жаңа сабақ басталды — атыңды қайта жаз"); join(); return; } } } catch {}
    if (!me()) return;
    try { const st = await LIVE.getStage(); const id = st && st.stage; if (id && id !== follow) { follow = id; if (PHONE.includes(id) && open !== id) openTask(id); else if (id === "feedback" && open !== "self") openTask("self"); else if (!open) hub(); } } catch {} }, 3000);
  return;
}

/* ================= ТАҚТА ================= */
function fit() { const s = Math.min(innerWidth / 1600, innerHeight / 900); $("#canvas").style.transform = `translate(-50%,-50%) scale(${s})`; }
addEventListener("resize", fit); fit();
let cur = Math.max(0, ST.findIndex(s => s.id === location.hash.slice(1)));
const left = store.get("left", {}); let run = false, tick = null, autoT = null;
let clkStart = store.get("clk", null);
const secOf = i => left[ST[i].id] ?? ST[i].min * 60;

function road() {
  $("#road").innerHTML = [0, 1, 2, 3, 4].map(p => { const items = ST.map((s, i) => [s, i]).filter(([s]) => s.part === p), on = ST[cur].part === p;
    return `<div class="pt ${on ? "on" : ""} ${p === 0 ? "p0" : ""}"><b>${DATA.parts[p]}</b><div class="dots">${items.map(([s, i]) => `<button title="${esc(s.title)}" data-go="${i}" class="${i === cur ? "on" : i < cur ? "done" : ""}"></button>`).join("")}</div></div>`; }).join("");
}
let lastL = null;
function paintTimer() {
  const tot = Math.max(1, ST[cur].min * 60), l = secOf(cur), f = $("#ringF");
  if (run && ST[cur].min && lastL !== null && l !== lastL) { if (l === 60 && tot > 90) { beep(880, .4); setTimeout(() => beep(1175, .5), 220); toast("⏳ 1 минут қалды!"); } if (l <= 10 && l > 0) beep(l <= 3 ? 1320 : 988, .1); if (l === 0) { [523, 659, 784, 1047].forEach((q, k) => setTimeout(() => beep(q, .5), k * 160)); } }
  lastL = run ? l : null;
  $("#ringT").textContent = ST[cur].min ? `${String(Math.floor(l / 60)).padStart(2, "0")}:${String(l % 60).padStart(2, "0")}` : "—";
  f.style.strokeDashoffset = 176 * (1 - l / tot); $("#ring").className = "ring" + (l <= 0 && ST[cur].min ? " end" : l <= 30 && ST[cur].min ? " warn" : "");
  $("#play").textContent = run ? "❚❚" : "▶"; $("#play").classList.toggle("on", run);
}
function clkDraw() {
  if (!clkStart) { $("#clk").textContent = "45:00"; $("#clkS").textContent = "▶ бастау"; $("#clock").classList.remove("on"); return; }
  const r = Math.max(0, 2700 - Math.floor((Date.now() - clkStart) / 1000));
  $("#clk").textContent = `${String(Math.floor(r / 60)).padStart(2, "0")}:${String(r % 60).padStart(2, "0")}`; $("#clkS").textContent = r ? "сабақ ↺" : "аяқталды"; $("#clock").classList.add("on");
}
setInterval(clkDraw, 1000); clkDraw();
async function newSession() { store.del("gl"); store.del("mood"); store.del("bonus");
  ["left", "bonus", "notes", "skyB"].forEach(k => store.del(k)); Object.keys(left).forEach(k => delete left[k]);
  let n = 0;
  if (LIVE.on()) { try { n = await LIVE.count(); await LIVE.clear(); await LIVE.setSession("s" + Date.now().toString(36)); } catch { toast("⚠️ Firebase-ті тазалау мүмкін болмады"); } }
  return n;
}
async function startLesson() {
  clkStart = Date.now(); store.set("clk", clkStart); clkDraw();
  const n = await newSession(); toast(n ? `⏱ Сабақ басталды! Дайындықтағы ${n} оқушы тазаланды` : "⏱ Сабақ басталды! Сәттілік!");
  if (ST[cur].id === "invite") go(1, true); else { render(); paintTimer(); }
}
$("#clock").onclick = () => { if (clkStart) { if (!confirm("Сабақ сағатын тоқтатамыз ба? Келесі ▶ басылғанда барлық нәтиже тазаланады.")) return; clkStart = null; store.set("clk", null); clkDraw(); return; } startLesson(); };
function setRun(v) { run = v; clearInterval(tick); if (run && ST[cur].min) tick = setInterval(() => { const id = ST[cur].id; left[id] = Math.max(0, secOf(cur) - 1); store.set("left", left); paintTimer(); if (left[id] === 0) timeUp(); }, 1000); else run = false; paintTimer(); }
function timeUp() {
  setRun(false); if (cur >= ST.length - 1) { toast("Сабақ аяқталды. Рахмет!"); return; }
  let n = 5; const o = $("#over"); o.hidden = false; const res = $("#resList")?.innerHTML || "";
  const draw = () => o.innerHTML = `<div class="ob"><div class="lbl">Уақыт бітті</div><b>${n}</b>${res ? `<div class="ob-res">${res}</div>` : ""}<p>Келесі: <strong>${esc(ST[cur + 1].title)}</strong></p><div class="trow c"><button class="btn lt" id="stay">Қалу (+1 мин)</button><button class="btn" id="goNow">Қазір өту →</button></div></div>`;
  draw(); clearInterval(autoT);
  autoT = setInterval(() => { n--; if (n <= 0) { clearInterval(autoT); o.hidden = true; go(cur + 1, true); } else draw(); }, 1000);
  o.onclick = e => { if (e.target.id === "stay") { clearInterval(autoT); o.hidden = true; left[ST[cur].id] = 60; setRun(true); } if (e.target.id === "goNow") { clearInterval(autoT); o.hidden = true; go(cur + 1, true); } };
}
function go(i, autoRun) {
  cur = Math.max(0, Math.min(ST.length - 1, i)); const s = ST[cur];
  history.replaceState(null, "", location.search + "#" + s.id);
  $("#partLbl").textContent = DATA.parts[s.part] + ` · ${cur + 1}/${ST.length}`; $("#stLbl").textContent = s.title;
  document.body.classList.toggle("inviting", s.id === "invite");
  road(); render(); setRun(!!autoRun && !!s.min); paintTimer();
  if (LIVE.on() && s.id !== "invite") LIVE.setStage(s.id).catch(() => {});
}
$("#prev").onclick = () => go(cur - 1); $("#next").onclick = () => go(cur + 1, run);
$("#road").onclick = e => { const b = e.target.closest("[data-go]"); if (b) go(+b.dataset.go); };
$("#play").onclick = () => setRun(!run);
$("#fs").onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
addEventListener("keydown", e => { if (e.target.closest("input,textarea")) return; if (e.key === "ArrowRight" || e.key === "PageDown") $("#next").click(); if (e.key === "ArrowLeft" || e.key === "PageUp") $("#prev").click(); if (e.key === " ") { e.preventDefault(); setRun(!run); } });
$$("[data-close]").forEach(b => b.onclick = () => b.closest(".modal").hidden = true);
$("#qrBtn").onclick = () => { const s = ST[cur], g = s.id === "feedback" || s.id === "invite"; const u = link(g ? "g" : "s", TASKS.includes(s.id) ? s.id : ""); $("#qrT").textContent = g ? "Қонақтар мен мұғалімдерге: кері байланыс" : "Оқушыларға: экосканерге қосылу"; $("#qrBig").innerHTML = qrSvg(u); $("#qrUrl").textContent = u; $("#qrModal").hidden = false; };

/* ---------- кезеңдер ---------- */
/* Кезеңнің басы: көк жолақ (мұғалім дауыстап оқиды) → ұсақ: әдіс · түрі · балл · оқулық → іс-әрекет → үлкен мазмұн */
const HD = (s, p, tag) => `<div class="hd hd2"><h2><span class="ph2">${esc(DATA.parts[s.part] || s.kicker)}:</span> ${esc(s.title)}</h2><div class="meta">${s.method ? `<span>🧭 Әдіс: <b>${esc(s.method)}</b></span>` : ""}${s.type ? `<span>👥 Түрі: <b>${esc(s.type)}</b></span>` : ""}${PTS[s.id] ? `<span>📒 ${esc(s.crit || "")} ${PTS[s.id]} ұпай</span>` : ""}${s.book ? `<span>📖 ${esc(s.book)}</span>` : ""}${s.min ? `<span>⏱ ${s.min} мин</span>` : ""}</div>${p ? `<p>${p}</p>` : ""}</div>`;
const modeBadge = s => `<span class="mode m-${s.mode === "Жеке" ? "i" : s.mode === "Жұппен" ? "p" : "g"}">${s.mode === "Жеке" ? "👤" : s.mode === "Жұппен" ? "👥" : "👨‍👩‍👧"} ${s.mode}</span> <span class="mode m-c">${s.crit} · ${PTS[s.id]} ұпай</span>`;
/* «Сен не істейсің?» — оқушыға әр кезеңде 1-2-3 қадам (scenariy-data.js) */
const stuBar = id => { const c = (window.SCEN && SCEN.stages[id]) || null; if (!c || id === "invite") return "";
  return `<div class="stu"><div class="stu-l"><b>🧑‍🎓 Сен не істейсің?</b><span>${c.tools.map(t => `<em class="${t}">${esc(SCEN.tools[t])}</em>`).join("")}</span></div><div class="stu-s">${c.stu.map((h, i) => `<div style="animation-delay:${i * .12}s"><i>${i + 1}</i>${esc(h)}</div>`).join(`<span>→</span>`)}</div>${c.tip ? `<div class="stu-t">💡 ${esc(c.tip)}</div>` : ""}</div>`; };
const howStrip = id => stuBar(id);
const SCIN = ["Вернадский", "Эрисман", "Парацельс", "Килинг", "Карсон", "Израэль"];
const descPanel = id => `<aside class="side"><div class="card"><div class="lbl">📒 Дескриптор · ${PTS[id]} балл</div><div class="dsc">${DATA.desc[id].map(([d, p]) => `<div><span>${esc(d)}</span><b>${p}</b></div>`).join("")}</div><p class="muted sm" style="margin-top:10px">Тапсырма тақтада және жұмыс парағында орындалады. Балды топ <b>хатшысы</b> телефонға енгізеді — нәтиже «Қорытынды баға» бетінде.</p></div></aside>`;
const resPanel = id => `<aside class="side"><div class="card res-c"><div class="res-h"><div class="qrmini">${qrSvg(link("s", id))}</div><div><div class="lbl">Нәтижелер · тірі</div><div class="res-n" id="resN">—</div></div></div><div class="res-list" id="resList"><p class="muted sm">Оқушылар орындаған сайын осында шығады</p></div></div></aside>`;
let lt = 0;
const R = {
  invite: () => `<div class="st"><div class="body inv"><div class="inv-card"><div class="inv-ph" style="background-image:url(media/p1.jpg)"></div>
      <div class="inv-in"><div class="lbl gold">Құрметті әріптестер, қонақтар!</div><h1>Сіздерді <span>ашық сабаққа</span> шақырамыз</h1>
      <div class="inv-topic">«${esc(L.topic)}»</div><p class="inv-sub">Экосканер: нақты деректерді сарапшыдай жіктейміз</p>
      <div class="inv-grid"><div><i>📅</i><b>${L.date}</b><small>${L.day}</small></div><div><i>⏱️</i><b>${L.time}</b><small>45 минут</small></div><div><i>🏫</i><b>${L.room}</b><small>${L.cls}</small></div><div><i>📖</i><b>География</b><small>${esc(L.para)}</small></div></div>
      <p class="inv-t">Пән мұғалімі: <b>${esc(L.teacher)}</b><br>${esc(L.school)}</p></div></div>
      <div class="inv-side"><div class="card fcol c"><div class="lbl">Қонақтарға · кері байланыс</div><div class="qrbox">${qrSvg(link("g"))}</div><p class="muted sm">Сабақ соңында пікіріңізді осы QR арқылы қалдырыңыз</p></div>
      <button class="btn big go" id="startBtn">▶ Сабақты бастау</button><p class="muted sm c">Басқанда 45 минуттық сағат іске қосылады, дайындық нәтижелері тазаланады</p></div></div></div>`,
  welcome: s => { const ros = store.get("roster", []); const MOOD = [["☀️", "Шуақты"], ["🌤️", "Ашық"], ["⛅", "Бұлтты"], ["🌧️", "Жаңбырлы"]], mc = store.get("mood", [0, 0, 0, 0]);
    return `<div class="st">${HD(s, "Құрметті қонақтар, жас сарапшылар! Бүгін біз қоршаған ортаның «анализін» оқимыз. Алдымен — сыныптың «ауа райы».")}<div class="body wel3">
      <div class="card mood"><h3>🌦️ Бүгінгі көңіл-күйің — қандай ауа райы?</h3><p class="muted">Әр оқушы бір сөзбен айтады, мұғалім басып санайды. Соңында: «Сабақ соңында бәріміздің аспанымыз ашық болсын!»</p><div class="moodb">${MOOD.map(([i, t], k) => `<button data-md="${k}"><i>${i}</i><span>${t}</span><b>${mc[k] || 0}</b></button>`).join("")}</div></div>
      <div class="card"><h3>👥 Топтар мен рөлдер</h3><div class="wgr">${GK.map(g => { const G = DATA.groups[g], m = ros.filter(r => r.g === g); return `<div style="--gc:${G.c}"><b>${G.i} ${esc(G.n)}</b>${m.length ? `<ol>${m.map(r => `<li>${esc(r.name)}${r.role ? ` <em>${ROLE[r.role]}</em>` : ""}</li>`).join("")}</ol>` : `<p class="muted sm">⚙ → «Топтарды теңдестіру»</p>`}</div>`; }).join("")}</div><div class="wqr"><div class="qrbox s">${qrSvg(link("h"))}</div><small>📒 Хатшыларға: сканерлеп, тобыңды таңда</small></div></div></div></div>`; },
  goals: s => `<div class="st">${HD(s, `Оқу мақсаты: <b>${esc(L.goal)}</b>`)}<div class="body cols2"><div class="card"><h3>🎯 Бағалау критерийлері</h3><div class="crit">${DATA.criteria.map(([k, d, t]) => `<div><b>${k}</b><span>${esc(d)}<small> · ${t}</small></span></div>`).join("")}</div></div>
    <div class="card"><h3>📈 Күтілетін нәтиже</h3><div class="tiers">${DATA.tiers.map(([a, b], i) => `<div style="animation-delay:${.3 + i * .15}s"><b>${a}:</b> ${esc(b)}</div>`).join("")}</div><p class="muted sm" style="margin-top:14px">Оқулық (89–94-б.) + Қазгидромет 2026 бюллетендерінің нақты деректері. Феноменге негізделген оқыту: жергілікті (Астана, Қарағанды обл.) деректер арқылы жалпы заңдылықты түсінеміз.</p></div></div></div>`,
  rules: s => `<div class="st">${HD(s, "Сарапшылар кодексі")}<div class="body rules">${DATA.rules.map(([i, t, d], k) => `<div class="card rule" data-n="${k + 1}" style="animation-delay:${k * .1}s"><div class="ic">${i}</div><h4>${esc(t)}</h4><p>${esc(d)}</p></div>`).join("")}</div></div>`,
  assess: s => `<div class="st">${HD(s, `${TASKS.length} тапсырма · барлығы <b>${MAXP} ұпай</b> → <b>10 балл</b>: 8–10 — жоғары · 4–7 — орта · 1–3 — төмен. Жұмыс парағының балын топ хатшысы енгізеді, квизді жүйе есептейді.`)}<div class="body"><div class="card"><table class="ctab"><tr><th>Тапсырма</th><th>Жұмыс түрі</th><th>Критерий</th><th>Дескриптор</th><th>Балл</th></tr>${TASKS.map(k => { const t = ST.find(x => x.id === k); return `<tr><td><b>${esc(t.title)}</b></td><td>${esc(t.mode || (k === "hw" ? "Жеке" : "—"))}</td><td>${esc(t.crit || "—")}</td><td>${DATA.desc[k].map(([d, p]) => esc(d) + " — " + p).join("<br>")}</td><td class="pt">${PTS[k]}</td></tr>`; }).join("")}<tr><td colspan="4"><b>Барлығы</b></td><td class="pt">${MAXP}</td></tr></table></div></div></div>`,
  hw: s => `<div class="st">${HD(s, "Өткен сабақты еске түсіреміз: «ыстық орындыққа» отырған оқушыға әр топ бір сұрақ қояды. Хатшы балл қояды.")}<div class="body cols2"><div class="card"><h3>🔥 Сұрақтар</h3><ol class="hwq">${DATA.hwQ.map(q => `<li>${esc(q)}</li>`).join("")}</ol></div>${descPanel("hw").replace('<aside class="side">', '<div>').replace("</aside>", "</div>")}</div></div>`,
  groups: s => { const ros = store.get("roster", []); return `<div class="st">${HD(s, "Топтар деңгейі бойынша тең: озат, екпінді, қанағат оқушылар әр топта бар. Әр топта рөлдер: 2 спикер, хатшы, постер қорғаушы.")}<div class="body grp3">${GK.map(g => { const G = DATA.groups[g], m = ros.filter(r => r.g === g);
    return `<div class="card gcard" style="--gc:${G.c}"><h3>${G.i} ${esc(G.n)}</h3>${m.length ? `<ol>${m.map(r => `<li>${esc(r.name)}${r.role ? ` <b>${ROLE[r.role]}</b>` : ""}</li>`).join("")}</ol>` : `<p class="muted">⚙ → «Топтарды теңдестіру» батырмасымен тізім енгізіңіз.</p>`}</div>`; }).join("")}<div class="card fcol c"><div class="lbl">📒 Хатшы телефоны</div><div class="qrbox">${qrSvg(link("h"))}</div><p class="muted sm">Әр топтың хатшысы сканерлеп, тобын таңдайды да, жұмыс парағына қарап балл қояды.</p></div></div></div>`; },
  speak: s => { const ros = store.get("roster", []); const nm = (g, r) => (ros.find(x => x.g === g && x.role === r) || {}).name || (r === "sp1" ? "1-спикер" : "2-спикер");
    const SP = DATA.learnTabs.map((t, i) => ({ i, g: GK[Math.floor(i / 2)], r: i % 2 ? "sp2" : "sp1" }));
    return `<div class="st">${HD(s, "Спикер ғалымның рөліне кіреді: «Мен — …мын. Бүгін мен … түсіндіремін». Экрандағы инфографикаға сүйеніп, қарапайым тілмен 1 минут сөйлейді. Қалғандары №1 кестені толтырады.", "ЖАҢА САБАҚ")}<div class="body learn"><div class="lnav" id="lnav">${SP.map(x => { const G = DATA.groups[x.g]; return `<button data-sp="${x.i}" style="border-bottom:5px solid ${G.c}">${esc(DATA.learnTabs[x.i].t)}<small style="display:block;font-weight:700">🎭 ${esc(nm(x.g, x.r))} — ${esc(SCIN[x.i])} · ${G.i}</small></button>`; }).join("")}<span class="sptim" id="sptim"></span></div><div id="lbox"></div></div></div>`; },
  video: s => `<div class="st">${HD(s, "Бейнені мұқият көр: жауаптары глобус сұрақтарында керек болады! Соңында тақырып пен мақсат ашылады.")}<div class="body vid2"><div class="card" style="padding:10px"><video id="vd" controls preload="metadata" poster="media/ekoskaner-sayahat.jpg" playsinline><source src="media/ekoskaner-sayahat.mp4" type="video/mp4"></video></div>
    <div class="card goalc" id="goalc"><button class="btn" id="goalBtn">🎯 Тақырып пен мақсатты ашу</button><div class="goalin" hidden><div class="lbl">Тақырып</div><h3>${esc(L.topic)} <small>(${esc(L.para)})</small></h3><div class="lbl">Оқу мақсаты</div><p>${esc(L.goal)}</p><div class="lbl">Бүгін сен</div>${DATA.tiers.map(([a, b]) => `<p class="tier"><b>${esc(a)}:</b> ${esc(b)}</p>`).join("")}<div class="lbl">Бағалау</div><p class="sm">${TASKS.map(k => `${esc((ST.find(x => x.id === k) || {}).title || k)} — ${PTS[k]}`).join(" · ")} · барлығы ${MAXP} ұпай → 10 балл</p></div></div></div></div>`,
  globe: s => `<div class="st">${HD(s, "Глобус әлемнен Қазақстанға айналады. Оқушы кездейсоқ таңдалады → тақтаға шығып жауапты басады → бірден дұрыс/қате және балл.")}<div class="body glb" id="glwrap"><div class="card glc"><canvas id="glcv"></canvas><div class="gltop"><span id="glLv">🌍 → 🇰🇿</span><span id="glN"></span><button id="glReset" title="Басынан">↺</button></div></div><div class="glside"><div class="card" id="glQ"></div><div class="card glg"><div class="lbl">Топтардың дұрыс жауабы</div><div id="glG"></div></div></div></div></div>`,
  learn: s => `<div class="st">${HD(s, "Оқулықтағы 25–28-сызбалар · әр қадамда нақты мысал және жедел сұрақ", "ЖАҢА САБАҚ")}<div class="body learn"><div class="lnav" id="lnav">${DATA.learnTabs.map((t, i) => `<button data-l="${i}">${esc(t.t)}</button>`).join("")}</div><div id="lbox" class="lbox"></div></div></div>`,
  t1: s => `<div class="st">${HD(s, "8 көрсеткішті 4 ортаға жікте: А — ауа, С — су, Т — топырақ, Ж — табиғи жүйелер. <b>Үлгі:</b> «PM2.5 · Қарағанды» → <b>А</b>.", modeBadge(s))}<div class="body task">${howStrip("t1")}<div class="card tk" id="tk"></div>${descPanel("t1")}</div></div>`,
  t2: s => `<div class="st">${HD(s, "Жұбыңмен №3 парақта: 3 нормативтің түрін және 3 заттың қауіп класын белгіле. <b>Үлгі:</b> «Озон» → <b>I класс</b> (өте қауіпті).", modeBadge(s))}<div class="body task">${howStrip("t2")}<div class="card tk" id="tk"></div>${descPanel("t2")}</div></div>`,
  t3: s => `<div class="st">${HD(s, "Топ өз қаласының досьесін оқиды → ватманға жазады: <b>«Біздің қала — … деңгей, себебі СИ = …; басты ластаушы — …; ұсынысымыз — …»</b> → 1 минут қорғайды.", modeBadge(s))}<div class="body t3b">${howStrip("t3")}<div class="ptim"><button data-pt="180" data-l="Постерге дайындық">⏱ 3 мин дайындық</button>${GK.map(g => `<button data-pt="120" data-l="${esc(DATA.groups[g].n)} қорғайды" style="--gc:${DATA.groups[g].c}">🎤 ${DATA.groups[g].i} ${esc(DATA.groups[g].city)} · 2 мин</button>`).join("")}<span class="sptim" id="sptim"></span></div><div class="dos3">${Object.keys(DATA.groups).map(g => { const D = DATA.t3[g], G = DATA.groups[g];
      return `<div class="dos" style="--gc:${G.c}"><div class="dos-h">${G.i} <b>${esc(G.n)}</b><span>${esc(D.period)}</span></div><div class="dos-g">${gauge(D.si, D.ez)}<div class="dos-k"><div><small>СИ</small><b>${fmt(D.si)}</b></div><div><small>ЕЖҚ</small><b>${fmt(D.ez)}%</b></div></div></div>${hbars(D.air.slice(0, 4), Math.max(...D.air.map(a => a[1])) * 1.1)}<ul class="dos-f">${D.facts.slice(0, 2).map(f => `<li>${esc(f)}</li>`).join("")}</ul>
      <div class="dos-r" id="gr-${g}"><p class="muted sm">Топтың жауабы күтілуде… 📡</p></div><div class="bon">Қорғау: <button data-bonus="${g}" data-v="1">+1</button><button data-bonus="${g}" data-v="2">+2</button><b id="bo-${g}"></b></div></div>`; }).join("")}</div>
      </div></div>`,
  t4: s => `<div class="st">${HD(s, "Оқулық пен ЖИ: «0,996 &lt; 1 — нормада». Тексер: 0,345 : 0,35 = <b>0,986</b> (берілген) → 0,009 : 0,01 = ? → қосынды = ? → нормада ма?", modeBadge(s))}<div class="body task">${howStrip("t4")}<div class="card tk" id="tk"></div>${descPanel("t4")}</div></div>`,
  t5: s => `<div class="st">${HD(s, "А. 27-сызба: мониторингтің 4 кезеңін ретімен нөмірле. Б. Жағдаят: ластануды көрсең, заңды әрекетті таңда.", modeBadge(s))}<div class="body task">${howStrip("t5")}<div class="card tk" id="tk"></div>${descPanel("t5")}</div></div>`,
  t6: s => `<div class="st">${HD(s, "Телефонды ал → QR → атың → 6 сұрақ. Жүйе бірден тексереді.", modeBadge(s))}<div class="body task">${howStrip("t6")}<div class="card tk" id="tk"></div>${resPanel("t6")}</div></div>`,
  sum: s => `<div class="st">${HD(s, `Хатшылардың балы + глобус + квиз → ${MAXP} ұпай → 10 балл. 8–10 жоғары · 4–7 орта · 1–3 төмен.`)}<div class="body sum3">
    <div class="card"><h3>🏅 Үздіктер</h3><div class="meds" id="meds"><p class="muted">Нәтижелер Firebase арқылы шығады.</p></div><h3 style="margin-top:12px">👥 Топтар</h3><div class="gbars" id="gbars"></div></div>
    <div class="card"><h3>📋 Барлық оқушының рейтингі</h3><div class="allr" id="allr"><p class="muted">Әзірге нәтиже жоқ.</p></div></div></div></div>`,
  feedback: s => `<div class="st">${HD(s, "Оқушылар мен мұғалімдер телефоннан жазады: ✅ Ұтымды · ✨ Қызықты · 💡 Ұсыныс")}<div class="body fb"><div class="card fcol"><h3>☀️ Сыныптың аспаны</h3><div class="sky" id="sky">${DATA.selfCheck.map(([i, t], k) => `<button data-sk="${k}"><i>${i}</i>${t}<b>0</b></button>`).join("")}</div>
    <div class="fbqr"><div><div class="qrbox s">${qrSvg(link("s", "feedback"))}</div><small>Оқушыларға</small></div><div><div class="qrbox s">${qrSvg(link("g"))}</div><small>Қонақтарға</small></div></div><p class="muted sm" id="starAvg">⭐ Қонақтардың бағасы осында шығады</p></div>
    <div class="card fcol wallc"><div class="tabs" id="wtabs"><button class="on" data-w="all">Барлығы</button><button data-w="s">🎓 Оқушылар</button><button data-w="g">🎩 Мұғалімдер мен қонақтар</button><span class="wn" id="wn"></span></div><div class="wall" id="wall"></div></div></div></div>`,
  home: s => `<div class="st">${HD(s, "Сканер жұмысын жалғастырамыз — енді өз ауданыңда!")}<div class="body hw">${DATA.homework.map((h, i) => `<div class="card hwc" style="animation-delay:${i * .15}s"><div class="big3">${h.i}</div><span class="pill lv">${esc(h.lv)}</span><p>${esc(h.t)}</p></div>`).join("")}</div></div>`,
  bye: s => `<div class="st"><div class="body bye2" style="background-image:url(media/p1.jpg)"><div class="bye-in"><div class="lbl gold">Экосканер · сабақ аяқталды</div><h1>Рахмет!</h1><p class="wish">${esc(DATA.wish)}</p><p class="by">Құрметті қонақтар, сабағымызға келгендеріңізге рахмет! · ${esc(L.teacher)}</p></div></div></div>`
};

/* ---------- жаңа сабақ: 6 бөлім ---------- */
const LEARN = [
  () => `<div class="l1"><div class="diag2">${DATA.indicators.map(([i, t, c, ex], k) => `<div class="tile" style="background:linear-gradient(150deg,${c},#0B3D3A);animation-delay:${k * .15}s"><i>${i}</i><b>${t}</b><small>${esc(ex)}</small></div>`).join("")}<div class="dc">Адамның өмір сүру ортасының сапасының көрсеткіштері<small>25-сызбанұсқа</small></div></div></div>`,
  () => `<div class="l2"><div class="norms4">${DATA.norms.map(([i, t, d], k) => `<div class="card" style="animation-delay:${k * .12}s"><div class="ic2">${i}</div><b>${t}</b><p>${esc(d)}</p></div>`).join("")}</div><div class="eff"><span class="lbl">Зиянды заттың әсер ету сатылары (90-б.)</span><div>${DATA.effects.map((e, i) => `${i ? "<em>→</em>" : ""}<b style="animation-delay:${.6 + i * .2}s;background:${["#065F46", "#92400E", "#9A3412", "#991B1B"][i]}">${e}</b>`).join("")}</div></div><p class="def"><b>ШШК (ШЖШ)</b> — адамның жұмыс қабілетін төмендетпейтін, оған және келешек ұрпаққа зиян тигізбейтін ластаушы заттың ең жоғары мөлшері.</p></div>`,
  () => `<div class="hz4">${DATA.hazard.map(([k, t, c, items], i) => `<div style="background:linear-gradient(160deg,${c},#1f2937);animation-delay:${i * .12}s"><b>${k}</b><span>${t}</span>${items.map(x => `<em>${esc(x)}</em>`).join("")}</div>`).join("")}</div><p class="def c">Класс неғұрлым <b>кіші</b> болса, зат соғұрлым <b>қауіпті</b>.</p>`,
  () => `<div class="l4"><div class="lv4">${DATA.grad.map(([n, si, ez, c], i) => `<div class="lvc"><div class="h" style="background:${c}">${n}<span>СИ ${si} · ЕЖҚ ${ez}</span></div>${DATA.cities.filter(x => x.lv === i).map((x, j) => `<div class="city" style="animation-delay:${.5 + i * .35}s"><b>${x.n}</b><div class="v">СИ <span>${fmt(x.si)}</span> · ЕЖҚ <span>${fmt(x.ez)}%</span></div><small>${esc(x.note)}</small></div>`).join("")}${i === 2 ? `<div class="city" style="animation-delay:1.4s"><b>Астана</b><div class="v">СИ <span>8,7</span> · ЕЖҚ <span>12%</span></div><small>2026 ж. 2-тоқсан</small></div>` : ""}</div>`).join("")}</div>
    <div class="card chart l4c"><div class="lbl">Қарағанды 🟥 мен Теміртау 🟧 · СИ, 2022–2026 (1-жартыжылдық)</div>${chartTrend(560, 250)}<p class="rule2">Ереже: СИ мен ЕЖҚ-ның <b>қайсысы жоғары</b> болса, деңгей соған қарай анықталады.</p></div></div>`,
  () => `<div class="l5"><div class="wcl">${DATA.water.map(([n, t, c, ex], i) => `<div style="background:${c};animation-delay:${i * .1}s"><b>${n}</b><span>${t}</span><small>${esc(ex)}</small></div>`).join("")}</div><div class="fcol"><div class="card wx"><div class="ic2">🌊</div><div><b>Есіл (Астана)</b><p>2025 ж. — 3-класс → 2026 ж. — <b class="red">5-класс</b>. Қалқыма заттар — 14,13 мг/дм³</p></div></div><div class="card wx"><div class="ic2">🧪</div><div><b>Соқыр өзені — 6-класс</b><p>Аммоний 8,62, фосфаттар 3,976 мг/дм³</p></div></div><div class="card wx"><div class="ic2">✅</div><div><b>Сәтбаев каналы: 4 → 3</b><p>Жақсару мысалы</p></div></div><p class="def c">Класы неғұрлым <b>үлкен</b> болса, су соғұрлым <b>лас</b>.</p></div></div>`,
  () => `<div class="l6"><div class="flow">${DATA.monitor.map(([i, t], k) => `${k ? `<div class="ar">→</div>` : ""}<div style="animation-delay:${k * .15}s"><em>${i}</em><b>${k + 1}</b><span>${t}</span></div>`).join("")}</div><div class="l6b"><div class="card"><div class="lbl">Бағалау әдістері (28-сызба)</div>${DATA.methods.map(([i, a, b]) => `<p class="mth">${i} <b>${a}</b> — ${b}</p>`).join("")}</div><div class="card"><div class="lbl">Мониторинг деңгейлері</div><div class="lvls">${DATA.levels.map(([i, t]) => `<span>${i} ${t}</span>`).join("<em>→</em>")}</div><p class="mth">Астанада: <b>10 бекет</b> (4 қолмен, 6 автомат) · <b>24 көрсеткіш</b> · 11 нүктеде жылжымалы зертхана</p></div></div></div>`
];
let spT = null, actx = null;
function beep(f, d) { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = f; g.gain.value = .15; o.connect(g).connect(actx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d); o.stop(actx.currentTime + d + .05); } catch {} }
function spkTimer(sec, label) { clearInterval(spT); let l = sec; const draw = () => { const e = $("#sptim"); if (!e) { clearInterval(spT); return; } e.textContent = `⏱ ${label} · 0${Math.floor(l / 60)}:${String(l % 60).padStart(2, "0")}`; e.style.color = l <= 10 ? "#B91C1C" : ""; };
  draw(); spT = setInterval(() => { l--; if (l <= 10 && l > 0) beep(988, .08); if (l <= 0) { clearInterval(spT); beep(659, .4); setTimeout(() => beep(988, .6), 250); toast("⏰ Спикердің уақыты бітті"); } draw(); }, 1000); }
function spkNow(i, b) { const lb = $("#lbox"); if (!lb) return; const t = b.querySelector("small").textContent.replace("🎭 ", ""); lb.insertAdjacentHTML("afterbegin", `<div class="spknow">🎭 <b>${esc(t.split(" · ")[0])}</b><span>${esc(DATA.learnTabs[i].t)}</span></div>`); }
function learn(i) {
  lt = i; const T = DATA.learnTabs[i];
  $("#lbox").innerHTML = `<div class="lpane">${LEARN[i]()}</div><div class="lfoot"><div class="ask">❓ <b>Жедел сұрақ:</b> ${esc(T.ask)}</div><div class="src2">📚 ${esc(T.src)}</div></div>`;
  $$("#lnav button").forEach((b, k) => b.classList.toggle("on", k === i));
}

/* Экранға сыйдыру: мазмұн тақтадан асып кетсе, кезеңді біркелкі кішірейтеміз (мин. 72%) */
function fitStage() { const m = $("#main"), st = $("#main .st"); if (!m || !st) return; st.style.zoom = 1;
  const top = st.getBoundingClientRect().top, H = st.getBoundingClientRect().height; let need = 0;
  st.querySelectorAll("*").forEach(e => { if (e.closest(".lpane,.labg,.qs,.allr,.glside") && !e.matches(".lpane,.labg,.qs,.allr,.glside")) return; const r = e.getBoundingClientRect(); if (r.height) need = Math.max(need, r.bottom - top); });
  st.querySelectorAll(".lpane,.labg,.qs").forEach(e => { const r = e.getBoundingClientRect(); need = Math.max(need, r.top - top + e.scrollHeight * (r.height / e.offsetHeight || 1)); });
  if (need > H + 2) st.style.zoom = Math.max(.72, H / need).toFixed(3); }
addEventListener("resize", () => setTimeout(fitStage, 50));
let fitT = 0; if (MODE === "b") new MutationObserver(() => { clearTimeout(fitT); fitT = setTimeout(fitStage, 120); }).observe(document.getElementById("main"), { childList: true, subtree: true });
function render() {
  const s = ST[cur]; document.body.dataset.part = s.part; $("#main").innerHTML = R[s.id](s); seen.clear(); setTimeout(fitStage, 60); setTimeout(fitStage, 700);
  if (!$("#main .stu") && s.id !== "invite") { const hd = $("#main .hd"), sb = stuBar(s.id); if (sb) { if (hd) hd.insertAdjacentHTML("afterend", sb); else $("#main").insertAdjacentHTML("afterbegin", sb); } }
  if (s.id === "invite") $("#startBtn").onclick = () => clkStart ? go(1, true) : startLesson();
  if (s.id === "speak") { $("#lnav").onclick = e => { const b = e.target.closest("[data-sp]"); if (!b) return; const i = +b.dataset.sp; learn(i); spkNow(i, b); spkTimer(60, b.querySelector("small").textContent); $$("#lnav [data-sp]").forEach(x => x.classList.toggle("on", x === b)); }; learn(0); }
  if (s.id === "learn") { learn(lt); $("#lnav").onclick = e => { const b = e.target.closest("[data-l]"); if (b) learn(+b.dataset.l); }; }
  if (TASK[s.id] && $("#tk")) TASK[s.id]($("#tk"));
  if (s.id === "t3") $$("[data-pt]").forEach(b => b.onclick = () => spkTimer(+b.dataset.pt, b.dataset.l));
  if (s.id === "globe") globeInit();
  if (s.id === "video") { const rv = () => { $("#goalBtn").hidden = true; $(".goalin").hidden = false; }; $("#goalBtn").onclick = rv; const v = $("#vd"); if (v) v.onended = rv; }
  if (s.id === "welcome") $$("[data-md]").forEach(b => b.onclick = () => { const m = store.get("mood", [0, 0, 0, 0]); m[+b.dataset.md]++; store.set("mood", m); $("b", b).textContent = m[+b.dataset.md]; beep(700, .08); });
  if (s.id === "t3") $$("[data-bonus]").forEach(b => b.onclick = async () => { const g = b.dataset.bonus, bo = store.get("bonus", {}); bo[g] = +b.dataset.v; store.set("bonus", bo); if (LIVE.on()) try { await LIVE.pushGroup(g + "/bonus", bo[g]); } catch {} toast(`${DATA.groups[g].n}: қорғау +${bo[g]}`); liveTick(); });
  if (s.id === "feedback") { $("#wtabs").onclick = e => { const b = e.target.closest("[data-w]"); if (b) { wtab = b.dataset.w; $$("#wtabs button").forEach(x => x.classList.toggle("on", x === b)); liveTick(); } }; }
  liveTick();
}

/* ---------- 3D глобус: әлемнен Қазақстанға, кездейсоқ оқушы, бірден дұрыс/қате ---------- */
const sidOf = n => "r_" + Array.from(nrm(n)).map(c => c.charCodeAt(0).toString(36)).join("").slice(0, 60);
let GW = null, glAnim = 0, glRot = [-20, -20], glScale = 1;
async function globeInit() {
  const cv = $("#glcv"); if (!cv) return;
  if (!GW) { try { const w = await (await fetch("vendor/countries-110m.json")).json(); GW = { land: topojson.feature(w, w.objects.countries), kz: topojson.feature(w, w.objects.countries).features.find(f => f.id === "398") }; } catch { GW = { land: null }; } }
  const Q = DATA.globeQ, st = () => store.get("gl", { qi: -1, done: {}, pts: {}, grp: {}, picked: [] }), save = v => store.set("gl", v);
  /* 3D глобус (three.js, NASA Blue Marble); WebGL жоқ болса — бұрынғы 2D глобус */
  let G3 = null, fly, idle = true;
  try { const M = await import("./globe.js"); const host = document.createElement("div"); host.id = "gl3"; host.style.cssText = "position:absolute;inset:0"; cv.replaceWith(host); host.appendChild(cv); cv.style.display = "none";
    G3 = await M.createGlobe(host, { spin: 6, shift: 0 }); }
  catch (e) { console.warn("3D глобус ашылмады", e); G3 = null; }
  const mk3 = () => { if (!G3) return; const s = st(); G3.clearMarkers(); Q.forEach((q, i) => { const act = i === s.qi, dn = s.done[i] != null;
    G3.marker({ id: "q" + i, lat: q.lat, lon: q.lon, label: act ? `${i + 1}. ${esc(q.p)}` : (dn ? (s.done[i] ? "✓" : "✗") : String(i + 1)), fs: act ? 22 : 14, size: act ? 1.3 : .8, color: dn ? (s.done[i] ? "#16A34A" : "#DC2626") : act ? "#F97316" : "#0EA5E9" }); }); };
  let size = () => {};
  if (G3) { fly = (lon, lat, sc) => { idle = false; G3.setSpin(0); G3.flyTo(lat, lon, sc > 2 ? 17 : sc > 1.3 ? 26 : 32, 2000); }; G3.pose(30, 40, 34); }
  else {
  const ctx = cv.getContext("2d"), DPR = Math.min(2, window.devicePixelRatio || 1);
  size = () => { const r = cv.getBoundingClientRect(); cv.width = r.width * DPR; cv.height = r.height * DPR; };
  size();
  const proj = d3.geoOrthographic().clipAngle(90), path = d3.geoPath(proj, ctx), grat = d3.geoGraticule10();
  const draw = (t) => {
    const W = cv.width, H = cv.height, R = Math.min(W, H) * .44 * glScale;
    proj.translate([W / 2, H / 2]).scale(R).rotate(glRot);
    ctx.clearRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W / 2 - R * .35, H / 2 - R * .4, R * .1, W / 2, H / 2, R * 1.05);
    g.addColorStop(0, "#7DD3FC"); g.addColorStop(.55, "#0EA5E9"); g.addColorStop(1, "#075985");
    ctx.beginPath(); ctx.arc(W / 2, H / 2, R * 1.04, 0, 7); ctx.fillStyle = "rgba(14,165,233,.18)"; ctx.fill();
    ctx.beginPath(); path({ type: "Sphere" }); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); path(grat); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = DPR; ctx.stroke();
    if (GW.land) { ctx.beginPath(); path(GW.land); ctx.fillStyle = "#86EFAC"; ctx.fill(); ctx.strokeStyle = "rgba(6,78,59,.45)"; ctx.lineWidth = .7 * DPR; ctx.stroke();
      ctx.beginPath(); path(GW.kz); ctx.fillStyle = "#FBBF24"; ctx.fill(); ctx.strokeStyle = "#92400E"; ctx.lineWidth = 1.4 * DPR; ctx.stroke(); }
    const s = st(); Q.forEach((q, i) => { const c = [q.lon, q.lat], d = d3.geoDistance(c, [-glRot[0], -glRot[1]]); if (d > 1.5) return; const [x, y] = proj(c);
      const act = i === s.qi, dn = s.done[i] != null, r = (act ? 11 : 7) * DPR;
      if (act) { ctx.beginPath(); ctx.arc(x, y, r + (6 + 5 * Math.sin(t / 220)) * DPR, 0, 7); ctx.fillStyle = "rgba(220,38,38,.25)"; ctx.fill(); }
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = dn ? (s.done[i] ? "#16A34A" : "#DC2626") : act ? "#DC2626" : "#fff"; ctx.fill(); ctx.lineWidth = 2 * DPR; ctx.strokeStyle = "#0B2545"; ctx.stroke();
      ctx.fillStyle = dn || act ? "#fff" : "#0B2545"; ctx.font = `800 ${(act ? 12 : 9) * DPR}px Golos Text, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), x, y + .5);
      if (act || glScale > 2) { ctx.font = `700 ${12 * DPR}px Golos Text, sans-serif`; ctx.fillStyle = "#0B2545"; ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 4 * DPR; ctx.strokeText(q.p, x, y - r - 9 * DPR); ctx.fillText(q.p, x, y - r - 9 * DPR); } });
  };
  let target = null, from = null, t0 = 0;
  const loop = t => { if (!$("#glcv")) { cancelAnimationFrame(glAnim); return; }
    if (target) { const k = Math.min(1, (t - t0) / 1600), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; const ip = d3.geoInterpolate(from.c, target.c)(e); glRot = [-ip[0], -ip[1]]; glScale = from.s + (target.s - from.s) * e; if (k >= 1) target = null; }
    else if (idle) glRot = [glRot[0] + .08, glRot[1]];
    draw(t); glAnim = requestAnimationFrame(loop); };
  cancelAnimationFrame(glAnim); glAnim = requestAnimationFrame(loop);
  fly = (lon, lat, sc) => { from = { c: [-glRot[0], -glRot[1]], s: glScale }; target = { c: [lon, lat], s: sc }; t0 = performance.now(); idle = false; };
  }
  window.onresize = size;
  const ros = () => store.get("roster", []);
  const paint = () => { mk3(); const s = st(), q = Q[s.qi];
    $("#glN").textContent = s.qi < 0 ? `${Q.length} сұрақ` : `${s.qi + 1} / ${Q.length}`;
    $("#glLv").textContent = q ? (q.lv === "Әлем" ? "🌍 Әлем" : "🇰🇿 Қазақстан") : "🌍 → 🇰🇿";
    $("#glG").innerHTML = GK.map(g => { const G = DATA.groups[g]; return `<div style="--gc:${G.c}"><span>${G.i} ${esc(G.city)}</span><b>${s.grp[g] || 0}</b></div>`; }).join("");
    const box = $("#glQ");
    if (!q) { box.innerHTML = `<div class="glstart"><h3>Глобус-эстафета</h3><p>Глобус әлемнен Қазақстанға қарай айналады. Әр нүктеде — бейне мен спикерлер айтқан сұрақ. Оқушы кездейсоқ таңдалады, тақтаға шығып жауапты басады.</p><button class="btn" id="glNext">▶ Бастау</button></div>`; return; }
    const pk = s.cur, ord = s.ord || [0, 1, 2, 3], ans = s.done[s.qi];
    box.innerHTML = `<div class="glq"><div class="glp">📍 ${esc(q.p)} <small>${esc(q.src)}</small></div><h3>${esc(q.q)}</h3>
      <div class="glwho">${pk ? `<span style="--gc:${DATA.groups[pk.g]?.c || "#00799A"}">🎯 ${esc(pk.name)} <small>${DATA.groups[pk.g]?.i || ""} ${esc(DATA.groups[pk.g]?.city || "")}</small></span>` : `<button class="btn" id="glPick">🎲 Оқушыны таңда</button>`}</div>
      <div class="glo">${ord.map(j => `<button data-ga="${j}" ${!pk || ans != null ? "disabled" : ""} class="${ans != null ? (j === q.a ? "ok" : (s.sel === j ? "no" : "")) : ""}">${esc(q.o[j])}</button>`).join("")}</div>
      ${ans != null ? `<div class="glres ${ans ? "ok" : "no"}">${ans ? `✅ Дұрыс! +1 балл — ${esc(pk?.name || "")}` : `❌ Қате. Дұрыс жауап: <b>${esc(q.o[q.a])}</b>`} <small>${esc(q.src)}</small></div><button class="btn" id="glNext">${s.qi + 1 < Q.length ? "➡ Келесі нүкте" : "🏁 Аяқтау"}</button>` : ""}</div>`;
  };
  const next = () => { const s = st(); s.qi = Math.min(Q.length, s.qi + 1); s.cur = null; s.sel = null; s.ord = shuffle([0, 1, 2, 3]); save(s);
    const q = Q[s.qi]; if (q) fly(q.lon, q.lat, q.lv === "Әлем" ? 1.15 : 2.6); else { fly(68, 48, 1.6); }
    if (!q) { $("#glQ").innerHTML = `<div class="glstart"><h3>🏁 Глобус аяқталды!</h3><p>Барлығы ${Q.length} нүкте. Дұрыс жауаптар: ${Object.values(s.done).filter(Boolean).length}.</p></div>`; $("#glN").textContent = "✓"; return; }
    paint(); };
  const pick = () => { const s = st(), R = ros(); let pool = R.filter(r => !s.picked.includes(nrm(r.name)));
    if (R.length && !pool.length) { s.picked = []; pool = R; }
    const box = $(".glwho"); let n = 0;
    const final = R.length ? pool[Math.floor(Math.random() * pool.length)] : { name: "", g: GK[Math.floor(Math.random() * GK.length)] };
    const spin = setInterval(() => { const r = R.length ? R[n++ % R.length] : { name: "", g: GK[n++ % GK.length] }; box.innerHTML = `<span class="spin" style="--gc:${DATA.groups[r.g]?.c}">🎲 ${esc(r.name || DATA.groups[r.g].n)}</span>`; beep(500 + (n % 5) * 80, .05); }, 90);
    setTimeout(() => { clearInterval(spin); const s2 = st(); s2.cur = { name: final.name || `${DATA.groups[final.g].n}: кез келген оқушы`, g: final.g, real: !!final.name }; if (final.name) s2.picked.push(nrm(final.name)); save(s2); beep(880, .25); paint(); }, 1600); };
  const answer = j => { const s = st(), q = Q[s.qi]; if (s.done[s.qi] != null || !s.cur) return; const ok = j === q.a; s.done[s.qi] = ok; s.sel = j;
    if (ok) { s.grp[s.cur.g] = (s.grp[s.cur.g] || 0) + 1; if (s.cur.real) { const k = nrm(s.cur.name); s.pts[k] = (s.pts[k] || 0) + 1;
      if (LIVE.on()) LIVE.putStudent(sidOf(s.cur.name) + "gl", { name: s.cur.name, g: s.cur.g, sc: { globe: Math.min(PTS.globe, s.pts[k]) }, at: { globe: Date.now() }, src: "hatshy", ts: Date.now() }).catch(() => {}); } beep(660, .12); setTimeout(() => beep(990, .2), 130); }
    else { beep(220, .35); }
    save(s); paint(); };
  $("#glwrap").onclick = e => { if (e.target.closest("#glNext")) next(); else if (e.target.closest("#glPick")) pick(); else { const b = e.target.closest("[data-ga]"); if (b) answer(+b.dataset.ga); } };
  $("#glReset").onclick = () => { if (confirm("Глобусты басынан бастаймыз ба?")) { store.del("gl"); fly(30, 20, 1); paint(); } };
  const s = st(); if (Q[s.qi]) { const q = Q[s.qi]; if (G3) G3.pose(q.lat, q.lon, q.lv === "Әлем" ? 32 : 17); else { glRot = [-q.lon, -q.lat]; glScale = q.lv === "Әлем" ? 1.15 : 2.6; idle = false; } }
  paint();
}

/* ---------- тірі деректер ---------- */
let liveT = null, wtab = "all"; const seen = new Set();
async function liveTick() {
  clearTimeout(liveT); const id = ST[cur].id;
  let d = {}, fbOk = false; if (LIVE.on()) { try { d = await LIVE.read(); fbOk = true; } catch {} }
  { const c = $("#fbChip"); if (c) { c.className = "fb-chip " + (fbOk ? "ok" : "bad"); $("#fbS").textContent = !LIVE.on() ? "өшірулі" : fbOk ? "қосулы" : "байланыс жоқ"; c.title = fbOk ? "Firebase қосулы: оқушылардың жауаптары тақтаға тірі түседі · бөлме " + LIVE.room : "Firebase-ке қосыла алмады: интернетті тексеріңіз (нәтижелер телефондарда сақталады)"; } }
  const studs = Object.entries(d.students || {}).map(([k, v]) => ({ id: k, ...v })), grp = d.groups || {};
  const notes = [...Object.values(d.notes || {}), ...store.get("notes", [])].sort((a, b) => b.ts - a.ts);
  const bonus = { ...store.get("bonus", {}) }; Object.entries(grp).forEach(([g, v]) => { if (v && v.bonus != null) bonus[g] = v.bonus; });
  const totOf = x => TASKS.reduce((t, k) => t + (x.sc?.[k] || 0), 0);
  // есептегіш
  $$(".join-n").forEach(b => b.textContent = LIVE.on() ? studs.length : "—"); $("#joinChip").classList.toggle("off", !LIVE.on());
  $$("[data-gc]").forEach(b => b.textContent = studs.filter(x => x.g === b.dataset.gc).length);
  // тапсырма нәтижелері
  const rl = $("#resList");
  if (rl && TASKS.includes(id)) {
    if (!LIVE.on()) rl.innerHTML = `<p class="muted sm">Firebase қосылғанда оқушылардың нәтижесі осында тірі шығады (⚙)</p>`;
    else { const done = studs.filter(x => x.at && x.at[id]).sort((a, b) => (b.sc[id] || 0) - (a.sc[id] || 0) || a.at[id] - b.at[id]), mx = PTS[id];
      $("#resN").innerHTML = `<b>${done.length}</b>/${studs.length} орындады${done.length ? ` · орташа <b>${fmt(done.reduce((t, x) => t + (x.sc[id] || 0), 0) / done.length)}</b>/${mx}` : ""}`;
      rl.innerHTML = done.length ? done.map((x, i) => { const v = x.sc[id] || 0, c = v >= mx ? "full" : v >= mx / 2 ? "mid" : "low", nw = !seen.has(x.id + id); seen.add(x.id + id);
        return `<div class="rr ${c} ${nw ? "new" : ""}"><i>${["🥇", "🥈", "🥉"][i] || i + 1}</i><b>${esc(x.name)}${id === "t2" && x.pair ? ` <small>+ ${esc(x.pair)}</small>` : ""}</b><span>${DATA.groups[x.g]?.i || ""}</span><em>${v}/${mx}</em><time>${hm(x.at[id])}</time></div>`; }).join("") : `<p class="muted sm">Әзірге ешкім аяқтамады…</p>`; }
  }
  if (id === "t3") Object.keys(DATA.groups).forEach(g => { const box = $("#gr-" + g); if (!box) return; const sub = grp[g]?.sub; $("#bo-" + g).textContent = bonus[g] ? `+${bonus[g]} ✓` : "";
    if (sub) box.innerHTML = `<div class="sub"><div class="ans">${sub.ans.map((a, i) => `<span class="${a === DATA.t3.qs[i].o[DATA.t3[g].a[i]] ? "ok" : "no"}">${i + 1}) ${esc(a)}</span>`).join("")}</div>${sub.idea ? `<p class="idea">💡 ${esc(sub.idea)}</p>` : ""}<div class="gsc">${sub.ok}/3 ${bonus[g] ? `+ ${bonus[g]}` : ""} · ${esc(sub.by)}</div></div>`; });
  if (id === "sum") {
    const rows = studs.map(x => ({ ...x, T: totOf(x) })).sort((a, b) => b.T - a.T);
    const gs = GK.map(k => { const g = DATA.groups[k], m = rows.filter(x => x.g === k), avg = m.length ? m.reduce((t, x) => t + x.T, 0) / m.length : 0; return [g, avg]; }).sort((a, b) => b[1] - a[1]), mx = Math.max(1, ...gs.map(x => x[1]));
    $("#gbars").innerHTML = gs.map(([g, v], i) => `<div class="gb"><span>${["🥇", "🥈", "🥉"][i]} ${g.i} ${esc(g.city)}</span><div class="tr"><i style="width:${v / mx * 100}%;background:${g.c}"></i></div><b>${fmt(v)}</b></div>`).join("");
    if (rows.length) {
      const best = (k, f) => rows.filter(x => (x.sc?.[k] || 0) > 0).sort(f || ((a, b) => (b.sc[k] || 0) - (a.sc[k] || 0) || (a.at?.[k] || 9e15) - (b.at?.[k] || 9e15)))[0];
      const M = [["🥇", "1-орын", rows[0]], ["🥈", "2-орын", rows[1]], ["🥉", "3-орын", rows[2]], ["🌍", "Глобус шебері", best("globe")], ["⚡", "Квиз жылдамы", best("t6")], ["🖼️", "Үздік постер", best("t3")]].filter(m => m[2]);
      $("#meds").innerHTML = M.map(([i, t, x], k) => `<div class="med" style="animation-delay:${k * .15}s"><i>${i}</i><div><small>${t}</small><b>${esc(x.name)}</b><span>${DATA.groups[x.g]?.i || ""} ${x.T ?? totOf(x)}/${MAXP} · ${mark(x.T ?? totOf(x)).m} балл</span></div></div>`).join("");
      $("#allr").innerHTML = `<table><tr><th>#</th><th>Оқушы</th><th>Топ</th><th>Ұпай</th><th>Балл</th></tr>${rows.map((x, i) => { const m = mark(x.T); return `<tr><td>${i + 1}</td><td>${esc(x.name)}</td><td>${DATA.groups[x.g]?.i || ""}</td><td>${x.T}/${MAXP}</td><td><b style="color:${m.c}">${m.m}</b></td></tr>`; }).join("")}</table>`;
    }
  }
  if (id === "feedback") {
    const list = notes.filter(n => wtab === "all" || (wtab === "s" ? n.role === "Оқушы" : n.role !== "Оқушы"));
    $("#wn").textContent = `${notes.length} пікір`;
    $("#wall").innerHTML = list.slice(0, 24).map((n, i) => `<div class="note ${n.role === "Оқушы" ? "ns" : "ng"}" style="--r:${(i % 3 - 1) * 1.2}deg"><div class="who">${n.role === "Оқушы" ? "🎓" : n.role === "Мұғалім" ? "👩‍🏫" : n.role === "Әріптес" ? "🤝" : "🎩"} ${esc(n.role)}${n.name ? " · " + esc(n.name) : ""}${n.stars ? ` <span class="stx">${"★".repeat(n.stars)}</span>` : ""}${n.sky != null ? ` ${DATA.selfCheck[n.sky][0]}` : ""}</div>${n.use ? `<p>✅ ${esc(n.use)}</p>` : ""}${n.like ? `<p>✨ ${esc(n.like)}</p>` : ""}${n.wish ? `<p class="idea">💡 ${esc(n.wish)}</p>` : ""}</div>`).join("") || `<p class="muted">Пікірлер QR арқылы жіберілген сайын осында пайда болады…</p>`;
    const st = notes.filter(n => n.stars); if (st.length) $("#starAvg").textContent = `⭐ Қонақтардың орташа бағасы: ${fmt(st.reduce((t, n) => t + n.stars, 0) / st.length)} / 5 · ${st.length} баға`;
    const sky = [0, 0, 0, 0]; studs.forEach(x => { if (x.sky != null) sky[x.sky]++; }); $$("#sky button").forEach((b, k) => $("b", b).textContent = sky[k]);
  }
  liveT = setTimeout(liveTick, LIVE.on() ? 3500 : 15000);
}

/* ---------- мұғалім панелі ---------- */
async function excel() {
  let d = {}; if (LIVE.on()) { try { d = await LIVE.read(); } catch {} }
  const studs = Object.values(d.students || {}), grp = d.groups || {}; if (!studs.length) { toast("Әзірге нәтиже жоқ"); return; }
  const bonus = {}; Object.entries(grp).forEach(([g, v]) => bonus[g] = v?.bonus || 0);
  const q = v => { v = String(v ?? ""); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const head = ["№", "Оқушы", "Топ", "Жұбы", ...TASKS.map(k => `${ST.find(x => x.id === k).title.split(" · ")[1] || ST.find(x => x.id === k).title} (${PTS[k]})`), `Барлығы (${MAXP})`, "%", "Балл (1–10)", "Деңгей"];
  const rows = studs.map(x => { const vals = TASKS.map(k => x.sc?.[k] ?? ""); const T = vals.reduce((a, b) => a + (+b || 0), 0); return [x.name, DATA.groups[x.g]?.n || "", x.pair || "", ...vals, T]; })
    .sort((a, b) => b[b.length - 1] - a[a.length - 1]).map((r, i) => { const T = r[r.length - 1], m = mark(T); return [i + 1, ...r, m.p, m.m, m.lv]; });
  const info = [[`География · 11-сынып · «${L.topic}» · ${L.teacher}`], [`Күні: ${new Date().toLocaleDateString("kk-KZ")} · Оқушылар: ${studs.length}`], []];
  const csv = "﻿" + [...info, head, ...rows].map(r => r.map(q).join(";")).join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); a.download = `Ekoskaner_natizheler_${new Date().toISOString().slice(0, 10)}.csv`; document.body.append(a); a.click(); a.remove(); toast("📥 Excel файлы жүктелді");
}
$("#gear").onclick = () => {
  $("#gearBody").innerHTML = `<p class="muted">Бұл панель оқушыларға көрінбейді. Пернетақта: ← → — кезең, бос орын — таймер.</p>
  <div class="gear-grid"><button id="gXls"><b>📥 Excel-ге жүктеу</b><small>Барлық оқушының ұпайы</small></button><button id="gKmj"><b>📋 Сабақ жоспары</b><small>Кезеңдер мен уақыт</small></button><button id="gReset"><b>⏱ Таймерлерді қайта бастау</b><small>Кезең таймерлері</small></button>
  <button id="gRos"><b>👥 Топтарды теңдестіру</b><small>озат · екпінді · қанағат · рөлдер · хатшы QR</small></button><button id="gClear"><b>🧹 Нәтижелерді тазалау</b><small>Firebase + осы құрылғы</small></button><button id="gSrc"><b>📚 Дереккөздер</b><small>Оқулық, Қазгидромет, ДСМ-70</small></button></div>
  <h4 style="margin-top:18px">Firebase (тірі нәтижелер) ${LIVE.on() ? "✅ қосулы" : "— өшірулі"}</h4><div class="trow"><input class="inp" id="fbUrl" placeholder="https://ЖОБА-default-rtdb.firebaseio.com" value="${esc(LIVE.url || "")}"><button class="btn" id="fbSave">Сақтау</button></div><p class="sm" id="fbMsg"></p><div id="gOut" style="margin-top:14px"></div>`;
  $("#gearModal").hidden = false;
  $("#gXls").onclick = excel; $("#gRos").onclick = rosterPanel;
  $("#fbSave").onclick = async () => { LIVE.setUrl($("#fbUrl").value); try { await LIVE.test(); $("#fbMsg").textContent = "✓ Қосылды"; render(); } catch { $("#fbMsg").textContent = "✗ Қосылмады: мекенжай мен ережелерді (Rules) тексеріңіз"; } };
  $("#gReset").onclick = () => { Object.keys(left).forEach(k => delete left[k]); store.set("left", {}); setRun(false); toast("Таймерлер қайта басталды"); };
  $("#gClear").onclick = async () => { if (!confirm("Барлық нәтиже өшіріледі. Жалғастырамыз ба?")) return; await newSession(); toast("Тазаланды"); render(); };
  $("#gKmj").onclick = () => { let t = 0; $("#gOut").innerHTML = `<div class="kmj"><table><tr><th>Кезең</th><th>Уақыт</th><th>Әрекет</th></tr>${ST.filter(s => s.min).map(s => { const a = t; t += s.min; return `<tr><td>${esc(DATA.parts[s.part])}</td><td>${a}–${t} мин</td><td><b>${esc(s.title)}</b>${s.mode ? `<br><span class="muted">${s.mode} · ${s.crit} · ${PTS[s.id]} ұпай</span>` : ""}</td></tr>`; }).join("")}</table></div>`; };
  $("#gSrc").onclick = () => { $("#gOut").innerHTML = `<ul>${DATA.sources.map(s => `<li style="margin:6px 0">${esc(s)}</li>`).join("")}</ul>`; };
};

if (cur < 0) cur = 0;
go(cur);

/* ================= 📒 ХАТШЫ (?m=h): бір топқа бір телефон ================= */
/* хатшыға жауап кілті: парақты тез тексеру үшін */
function KEYOF(k, g) { const LT = { air: "А", water: "С", soil: "Т", eco: "Ж" };
  if (k === "t1") return DATA.t1.cards.map((c, i) => `${i + 1}–${LT[c[1]]}`).join(", ") + " · 7–8 дұрыс = 2, 4–6 = 1";
  if (k === "t2") return DATA.t2.map((q, i) => `${i + 1}) ${q.o[q.a]}`).join(" · ") + " · 1–3 дұрыс = 1, 4–6 дұрыс = 1";
  if (k === "t3") { const D = DATA.t3[g || "g1"]; return `${D.city}: ` + DATA.t3.qs.map((q, i) => `${i + 1}) ${q.o[D.a[i]]}`).join(" · ") + ` · СИ ${fmt(D.si)}, ЕЖҚ ${fmt(D.ez)}%`; }
  if (k === "t4") return "0,009 : 0,01 = 0,9 → 0,986 + 0,9 = 1,886 > 1 → нормадан АСАДЫ (оқулықтағы 0,996 — қате)";
  if (k === "t5") return DATA.t5.order.map((o, i) => `${i + 1}. ${o}`).join(" → ") + " · Жағдаят: «" + DATA.t5.match.map(q => q.o[q.a]).join("; ") + "»";
  if (k === "hw") return "Сұраққа дәлел (мысал, сан) келтіріп жауап берсе — 1";
  if (k === "speak") return "Спикер: «Мен — … ғалыммын», сан + мысал, 1 мин — 2 · Тыңдаушы: №1 кестенің 3–5 жолы — 1, 6 жолы — 2";
  return ""; }
function secretary() {
  const ph = $("#phone"), KEYS = TASKS.filter(k => !PHONE.includes(k) && k !== "globe");
  let ros = store.get("roster", []), g = store.get("secG", null), tab = KEYS[0], msg = "", sc = store.get("secSc", {});
  const extra = () => store.get("secExtra", []);
  const sid = n => "r_" + Array.from(nrm(n)).map(c => c.charCodeAt(0).toString(36)).join("").slice(0, 60);
  const mem = () => { const m = ros.filter(r => r.g === g).map(r => ({ name: r.name, role: r.role })); extra().filter(x => x.g === g).forEach(x => { if (!m.find(y => nrm(y.name) === nrm(x.name))) m.push({ name: x.name }); }); return m; };
  const save = name => { const v = sc[nrm(name)] || {}; const rec = { name, g, sc: v, total: KEYS.reduce((t, k) => t + (v[k] || 0), 0), src: "hatshy", ts: Date.now() };
    if (!LIVE.on()) { msg = "📴 Firebase қосылмаған — балл тек осы телефонда"; draw(); return; }
    LIVE.putStudent(sid(name), rec).then(() => { msg = "✅ " + name + " — тақтаға жіберілді"; draw(); }).catch(() => { msg = "⚠️ Жіберілмеді, интернетті тексер"; draw(); }); };
  function draw() {
    const st = ST.find(x => x.id === tab), D = DATA.desc[tab], mx = PTS[tab];
    let h = `<div class="ph-top"><span class="case-no sm">ЭКО<br>СКАН</span><span class="me">📒 Хатшы</span></div><div class="ph-h"><small>Парақты кілтпен тексер → балл бас</small><h2>${g ? DATA.groups[g].i + " " + esc(DATA.groups[g].n) : "Тобыңды таңда"}</h2></div>
      <div class="gpick sec-g">${GK.map(k => `<button data-g="${k}" class="${g === k ? "on" : ""}">${DATA.groups[k].i} ${esc(DATA.groups[k].city)}</button>`).join("")}</div>`;
    if (g) { h += `<div class="sec-tabs">${KEYS.map(k => `<button data-k="${k}" class="${k === tab ? "on" : ""}">${esc((ST.find(x => x.id === k).title.split(" · ")[1] || ST.find(x => x.id === k).title).replace(/[«»]/g, ""))} · ${PTS[k]}</button>`).join("")}</div>
      <div class="card sm" style="margin-top:8px"><b>${esc(st.title)}</b> · ${mx} балл<br>${D.map(([d, p]) => `• ${esc(d)} — ${p}`).join("<br>")}</div><div class="card sm keyc">🔑 <b>Жауап кілті:</b> ${esc(KEYOF(tab, g))}</div>`;
      const M = mem(); if (st.mode === "Топпен" && M.length) h += `<div class="sec-all">Бүкіл топқа: ${Array.from({ length: mx + 1 }, (_, v) => `<button data-all="${v}">${v}</button>`).join("")}</div>`;
      if (!M.length) h += `<div class="card sm">Тізім жоқ: мұғалім ⚙ → «Топтарды теңдестіру» бетін толтырсын, немесе төменнен оқушыны қос.</div>`;
      M.forEach((p, i) => { const v = sc[nrm(p.name)] || {}, tot = KEYS.reduce((t, k) => t + (v[k] || 0), 0);
        h += `<div class="card sec-m"><div class="sec-h"><span>${p.role ? ROLE[p.role].split(" ")[0] + " " : ""}${esc(p.name)}</span><span>${tot}/${KEYS.reduce((t, k) => t + PTS[k], 0)}</span></div><div class="sec-ch">${Array.from({ length: mx + 1 }, (_, x) => `<button data-i="${i}" data-v="${x}" class="${v[tab] === x ? "on" : ""}">${x}</button>`).join("")}</div></div>`; });
      h += `<div class="trow"><input class="inp" id="nn" placeholder="Оқушы қосу (аты)"><button class="btn" id="nb">+</button></div>${msg ? `<p class="follow">${esc(msg)}</p>` : ""}`; }
    ph.innerHTML = h;
    ph.onclick = e => { const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.g) { g = b.dataset.g; store.set("secG", g); draw(); }
      else if (b.dataset.k) { tab = b.dataset.k; draw(); }
      else if (b.dataset.all != null) { mem().forEach(p => { const k = nrm(p.name); sc[k] = { ...sc[k], [tab]: +b.dataset.all }; save(p.name); }); store.set("secSc", sc); draw(); }
      else if (b.dataset.i != null) { const p = mem()[+b.dataset.i]; const k = nrm(p.name); sc[k] = { ...sc[k], [tab]: +b.dataset.v }; store.set("secSc", sc); save(p.name); draw(); }
      else if (b.id === "nb") { const n = $("#nn").value.trim(); if (n.length < 2) return; store.set("secExtra", [...extra(), { name: n, g }]); draw(); } };
  }
  draw();
  if (LIVE.on()) LIVE.getRoster().then(r => { if (Array.isArray(r)) { ros = r; store.set("roster", r); draw(); } }).catch(() => {});
}

/* ================= 👥 Топтарды деңгеймен теңдестіру (⚙ панелінде) ================= */
function rosterPanel() {
  const LN = { A: "озат", B: "екпінді", C: "қанағат" };
  const lvlOf = w => { w = nrm(w).replace(/[.,;]/g, ""); if (/^(a|а|озат|жогары)$/.test(w)) return "A"; if (/^(b|в|б|екпинди|орта)$/.test(w)) return "B"; if (/^(c|с|канагат|канагаттанарлык|томен)$/.test(w)) return "C"; return null; };
  const balance = list => { const W = { A: 3, B: 2, C: 1 }, gs = GK.map(g => ({ g, n: 0, w: 0 }));
    ["A", "B", "C"].forEach(L => shuffle(list.filter(x => x.lvl === L)).forEach(x => { const mn = Math.min(...gs.map(q => q.n)); let c = shuffle(gs.filter(q => q.n === mn)); const t = L === "C" ? Math.max(...c.map(q => q.w)) : Math.min(...c.map(q => q.w)); const q = c.find(q => q.w === t); x.g = q.g; q.n++; q.w += W[L]; }));
    GK.forEach(g => { const m = list.filter(x => x.g === g); m.forEach(x => x.role = ""); const pick = (pr, r) => { const c = m.find(x => !x.role && pr(x)) || m.find(x => !x.role); if (c) c.role = r; };
      pick(x => x.lvl === "A", "sp1"); pick(x => x.lvl === "B", "sp2"); pick(x => x.lvl === "B", "hs"); pick(x => x.lvl !== "A", "po"); });
    return list; };
  let ros = store.get("roster", []);
  const out = () => `<div class="grp3">${GK.map(g => { const G = DATA.groups[g], m = ros.filter(r => r.g === g); return `<div class="card gcard" style="--gc:${G.c}"><h4>${G.i} ${esc(G.n)} · ${m.length}</h4>${m.map(r => `<div class="rr2" data-n="${esc(r.name)}"><span>${esc(r.name)} ${r.role ? `<b>${ROLE[r.role]}</b>` : ""}</span><em class="lv-${r.lvl}">${LN[r.lvl]}</em></div>`).join("")}</div>`; }).join("")}</div>`;
  const draw = () => { $("#gearBody").innerHTML = `<p class="muted">Әр жолға: «Аты деңгейі» (озат / екпінді / қанағат). Озаттар топтарға бөлек таратылады, топтардың жалпы деңгейі тең болады. Рөлдер өзі беріледі; оқушының атын басса, рөлі ауысады.</p>
      <textarea class="inp" id="rosIn" style="min-height:150px;width:100%">${esc(ros.map(r => r.name + " " + LN[r.lvl]).join("\n"))}</textarea>
      <div class="trow"><button class="btn" id="rosGo">🎲 Теңдестіріп бөлу</button><span class="muted sm" id="rosMsg"></span></div>${out()}
      <div class="trow" style="align-items:center;gap:16px;margin-top:10px"><div class="qrbox" style="width:150px">${qrSvg(link("h"))}</div><p class="muted sm"><b>📒 Хатшы телефоны</b> — әр топқа біреу. Сканерлеп, тобын таңдайды да, жұмыс парағына қарап балл қояды.</p></div>`;
    $("#rosGo").onclick = () => { ros = balance($("#rosIn").value.split("\n").map(l => l.trim()).filter(Boolean).map(l => { const t = l.split(/[\s,;\t]+/).filter(Boolean); const i = t.findIndex((w, j) => j > 0 && lvlOf(w)); return { name: (i > 0 ? t.slice(0, i) : t).join(" "), lvl: i > 0 ? lvlOf(t[i]) : "B" }; }).filter(x => x.name)); send(); draw(); };
    $$("#gearBody .rr2").forEach(el => el.onclick = () => { const r = ros.find(x => x.name === el.dataset.n); const o = ["", "sp1", "sp2", "hs", "po"]; r.role = o[(o.indexOf(r.role || "") + 1) % 5]; send(); draw(); }); };
  const send = () => { store.set("roster", ros); if (LIVE.on()) LIVE.setRoster(ros).then(() => { const m = $("#rosMsg"); if (m) m.textContent = "✅ Тізім хатшылар мен телефондарға жіберілді"; }).catch(() => {}); };
  draw(); $("#gearModal").hidden = false;
}

})();
