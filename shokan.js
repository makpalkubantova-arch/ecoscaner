/* Шоқан Уәлиханов — сабақтың анимациялық гиді (тақтада) + қозғалмалы глобус + 6 спикердің ғалым-кеңесшілері.
   Сурет — түпнұсқа SVG (тарихи белгілер: әскери мундир, эполет, күнделік). Дауыс: құрылғыда қазақша дауыс болса, оқып береді. */
(() => {
  const MODE = new URLSearchParams(location.search).get("m") || "b"; if (MODE !== "b") return;
  const $ = s => document.querySelector(s);
  const LINES = {
    invite: "Сәлеметсіздер ме! Мен — Шоқан Уәлиханов, ғалым әрі саяхатшымын. Бүгін сендермен бірге табиғатты «сканерлейміз».",
    welcome: "1856 жылы Ыстықкөлге, 1858–1859 жылдары Қашғарияға барып, көргенімнің бәрін күнделікке жаздым. Бақылау — ғылымның бастауы!",
    hw: "Өткен сабақты еске түсірейік. «Ыстық орындыққа» кім отырады?",
    groups: "Экспедицияда әркімнің өз міндеті бар: спикер, хатшы, постер қорғаушы. Топтарың деңгейі бойынша тең!",
    goals: "Мақсатымыз — қоршаған орта сапасының көрсеткіштерін жіктеу.",
    assess: "Әр тапсырманың дескрипторы бар. Хатшы балды адал қояды.",
    video: "Бейнені мұқият қара: 4 сызбаны есте сақта.",
    speak: "Сөз — спикерлерге! Әр бөлімге бір ғалым кеңесші болады. Мұғалім спикерді шақырғанда, экранға шығады.",
    t1: "12 көрсеткішті ортасына жікте: ауа, су, топырақ, табиғи жүйелер.",
    t2: "Норматив пен қауіп класын ажыратайық. Жұбыңмен ақылдас.",
    t3: "Әр топ — бір қаланың сарапшысы. Деректі дәлел ет!",
    t4: "ЖИ де қателеседі. Оқулықпен тексер!",
    t5: "Ластануды көрсең — заңды жолмен әрекет ет. Бұл — адал азаматтың ісі.",
    t6: "Енді телефонды ал: «Жедел сканер» квизі!",
    sum: "Жарайсыңдар! Әркім өз балын көреді.",
    feedback: "Аспаның қандай? Ойыңды айт.",
    home: "Өз ауданыңның экосканерін жаса. Мен де күнделік жүргізгенмін!",
    bye: "Сау болыңыздар! Табиғатқа ұқыпты болайық."
  };
  /* 6 бөлім — 6 ғалым-кеңесші (DATA.learnTabs ретімен) */
  const SCI = [
    { n: "В. И. Вернадский", y: "1863–1945", i: "🌍", f: "«Биосфера» (1926): адамның әрекеті табиғатқа геологиялық күш сияқты әсер етеді." },
    { n: "Ф. Ф. Эрисман", y: "1842–1915", i: "🏥", f: "Гигиена ғылымының негізін қалаушылардың бірі: ауа, су, топырақ тазалығын адам денсаулығымен байланыстырды." },
    { n: "Парацельс", y: "1493–1541", i: "⚗️", f: "«Бәрі — у, бәрі — дәрі: уды мөлшері анықтайды». Қауіп класы — осы ойдың жалғасы." },
    { n: "Чарльз Килинг", y: "1928–2005", i: "📈", f: "1958 жылдан бастап ауадағы CO₂-ні үздіксіз өлшеді — «Килинг қисығы»." },
    { n: "Рейчел Карсон", y: "1907–1964", i: "💧", f: "«Үнсіз көктем» (1962): пестицидтер су мен тіршілікті уландыратынын көрсетті." },
    { n: "Ю. А. Израэль", y: "1930–2014", i: "📡", f: "«Мониторинг» — қоршаған ортаны бақылау, бағалау және болжау жүйесі ұғымын енгізді." }
  ];
  const css = `
  .shk{position:fixed;left:14px;bottom:70px;z-index:40;display:flex;align-items:flex-end;gap:8px;pointer-events:none;transition:transform .4s}
  .shk.min{transform:translateX(-150px)}
  .shk svg.man{width:104px;height:140px;filter:drop-shadow(0 10px 18px rgba(0,40,40,.3));pointer-events:auto;cursor:pointer;animation:shkBob 3.2s ease-in-out infinite}
  @keyframes shkBob{50%{transform:translateY(-4px)}}
  .shk .eye{animation:shkBlink 4s infinite;transform-origin:center;transform-box:fill-box}@keyframes shkBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
  .shk .pen{animation:shkPen 1.1s ease-in-out infinite;transform-origin:96px 150px}@keyframes shkPen{50%{transform:rotate(-8deg) translateX(3px)}}
  .shk .mouth{animation:none;transform-origin:center;transform-box:fill-box}.shk.talk .mouth{animation:shkTalk .25s infinite alternate}@keyframes shkTalk{to{transform:scaleY(2.4)}}
  .shk .bub{pointer-events:auto;max-width:330px;transition:opacity .4s,transform .4s;background:#fff;border-radius:18px 18px 18px 4px;padding:10px 14px;margin-bottom:84px;font-size:14px;box-shadow:0 12px 30px rgba(0,40,60,.22);font:600 15px/1.4 inherit;color:#0B3D3A;position:relative}
  .shk .bub b{display:block;font-size:11px;letter-spacing:.08em;color:#B8860B;text-transform:uppercase}
  .shk .ctl{display:flex;gap:6px;margin-top:6px}.shk .ctl button{border:0;border-radius:99px;padding:4px 10px;font-weight:800;font-size:12px;background:#E0F2FE;color:#0B3D3A;cursor:pointer}
  .shk .globe{width:70px;height:70px;margin-bottom:6px;pointer-events:none}
  .glb .mer{animation:glbM 6s linear infinite}@keyframes glbM{0%{rx:0}25%{rx:30}50%{rx:0}75%{rx:30}100%{rx:0}}
  .glb .mer2{animation:glbM 6s linear infinite -3s}.glb .land{animation:glbL 12s linear infinite}@keyframes glbL{from{transform:translateX(-60px)}to{transform:translateX(60px)}}
  .glb .pin{animation:glbP 1.6s ease-out infinite;transform-box:fill-box;transform-origin:center}@keyframes glbP{0%{transform:scale(.6);opacity:1}100%{transform:scale(2.4);opacity:0}}
  .glb .sat{animation:glbS 7s linear infinite;transform-origin:50px 50px}@keyframes glbS{to{transform:rotate(360deg)}}
  .presenter{position:fixed;left:50%;top:84px;transform:translateX(-50%);z-index:45;display:flex;align-items:center;gap:16px;background:#fff;border-radius:22px;padding:12px 20px 12px 12px;box-shadow:0 20px 50px rgba(0,40,60,.3);border:4px solid var(--gc,#0EA5E9);animation:prIn .6s cubic-bezier(.2,1.5,.4,1)}
  @keyframes prIn{from{transform:translateX(-50%) translateY(-40px) scale(.7);opacity:0}}
  .presenter .av{width:64px;height:64px;border-radius:50%;background:var(--gc);display:grid;place-items:center;color:#fff;font:900 28px inherit;box-shadow:0 0 0 6px color-mix(in srgb,var(--gc) 25%,transparent);animation:prPulse 1.4s infinite}
  @keyframes prPulse{50%{box-shadow:0 0 0 14px color-mix(in srgb,var(--gc) 10%,transparent)}}
  .presenter .t small{display:block;font-weight:800;color:var(--gc);font-size:12px;letter-spacing:.06em;text-transform:uppercase}.presenter .t b{font-size:24px;color:#0B3D3A}.presenter .t span{display:block;font-weight:700;color:#475569;font-size:14px}
  .presenter .sci{border-left:2px dashed #e2e8f0;padding-left:14px;max-width:340px;font-size:13px;color:#334155}.presenter .sci b{font-size:15px;color:#0B3D3A}.presenter .x{border:0;background:#f1f5f9;border-radius:50%;width:28px;height:28px;cursor:pointer}
  .scirow{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.scic{background:rgba(255,255,255,.92);border-radius:99px;padding:4px 12px;display:flex;gap:6px;align-items:center;box-shadow:0 4px 12px rgba(0,40,60,.08);font-size:12px;line-height:1.3;border-top:4px solid #0EA5E9;animation:scIn .5s both}
  .scic .ic{font-size:16px}.scic b{font-size:13px;color:#0B3D3A}.scic div{display:none}.scic.on{outline:3px solid #F59E0B;transform:translateY(-3px)}@keyframes scIn{from{opacity:0;transform:translateY(10px)}}
  body.inviting .shk{bottom:20px}
  .shk .bub.hide{opacity:0;transform:translateY(10px) scale(.9);pointer-events:none}
  .shk .globe{width:56px;height:56px}
  `;
  document.head.append(Object.assign(document.createElement("style"), { textContent: css }));
  const MAN = `<svg class="man" viewBox="0 0 150 200" role="img" aria-label="Шоқан Уәлиханов — сабақ гиді">
    <ellipse cx="75" cy="194" rx="46" ry="5" fill="rgba(0,0,0,.15)"/>
    <path d="M30 196 Q30 120 75 112 Q120 120 120 196Z" fill="#5E7F5A"/><path d="M75 112 L75 196" stroke="#3F5B3D" stroke-width="2"/>
    ${[128, 144, 160, 176].map(y => `<circle cx="66" cy="${y}" r="3.2" fill="#E8B83A"/><circle cx="84" cy="${y}" r="3.2" fill="#E8B83A"/>`).join("")}
    <ellipse cx="40" cy="122" rx="16" ry="9" fill="#C0392B"/><path d="M26 124 q14 10 30 0" stroke="#E8B83A" stroke-width="3" fill="none"/>
    <ellipse cx="110" cy="122" rx="16" ry="9" fill="#C0392B"/><path d="M96 124 q14 10 30 0" stroke="#E8B83A" stroke-width="3" fill="none"/>
    <rect x="64" y="100" width="22" height="16" rx="3" fill="#5E7F5A"/><rect x="66" y="96" width="18" height="10" fill="#E9C9A5"/>
    <ellipse cx="75" cy="72" rx="25" ry="29" fill="#E9C9A5"/>
    <path d="M49 66 Q48 38 74 38 Q102 38 101 64 Q96 50 80 50 Q62 52 54 58 Q51 62 49 66Z" fill="#1F1A17"/>
    <path d="M52 60 Q50 72 54 80" stroke="#1F1A17" stroke-width="5" fill="none"/><path d="M98 60 Q100 72 96 80" stroke="#1F1A17" stroke-width="5" fill="none"/>
    <ellipse class="eye" cx="65" cy="72" rx="3" ry="3.4" fill="#1F1A17"/><ellipse class="eye" cx="85" cy="72" rx="3" ry="3.4" fill="#1F1A17"/>
    <path d="M59 64 l11 -2 M80 62 l11 2" stroke="#1F1A17" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M75 76 l-3 8 h5" stroke="#C49A78" stroke-width="2" fill="none"/>
    <path d="M60 90 Q68 85 75 89 Q82 85 90 90 Q84 92 75 91 Q66 92 60 90Z" fill="#1F1A17"/>
    <ellipse class="mouth" cx="75" cy="94" rx="4" ry="1.2" fill="#8B3A2E"/>
    <g><rect x="78" y="140" width="40" height="30" rx="3" fill="#8B5A2B" transform="rotate(-12 98 155)"/><rect x="81" y="142" width="34" height="25" rx="2" fill="#F8F1E3" transform="rotate(-12 98 155)"/>
      <path d="M86 150 h20 M86 155 h16 M86 160 h22" stroke="#9CA3AF" stroke-width="1.4" transform="rotate(-12 98 155)"/></g>
    <g class="pen"><path d="M100 150 l16 -22" stroke="#5B3A1A" stroke-width="3.4" stroke-linecap="round"/><circle cx="100" cy="151" r="5.5" fill="#E9C9A5"/></g>
    <circle cx="58" cy="160" r="6" fill="#E9C9A5"/>
  </svg>`;
  const GLOBE = `<svg class="globe glb" viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="gG" cx=".35" cy=".3"><stop offset="0" stop-color="#7DD3FC"/><stop offset="1" stop-color="#0369A1"/></radialGradient><clipPath id="gC"><circle cx="50" cy="50" r="34"/></clipPath></defs>
    <circle cx="50" cy="50" r="34" fill="url(#gG)"/><g clip-path="url(#gC)"><g class="land" fill="#4ADE80" opacity=".9"><path d="M20 38 q12-8 22 0 q6 8-4 14 q-10 4-18-4z"/><path d="M52 30 q16-4 26 6 q4 10-8 12 q-14 0-18-8z"/><path d="M58 56 q10 2 12 12 q-8 8-16 0z"/><path d="M-40 38 q12-8 22 0 q6 8-4 14 q-10 4-18-4z"/><path d="M-8 30 q16-4 26 6 q4 10-8 12 q-14 0-18-8z"/></g>
      <ellipse class="mer" cx="50" cy="50" rx="10" ry="34" fill="none" stroke="#fff" stroke-opacity=".35"/><ellipse class="mer2" cx="50" cy="50" rx="10" ry="34" fill="none" stroke="#fff" stroke-opacity=".35"/>
      <path d="M16 50h68M20 34h60M20 66h60" stroke="#fff" stroke-opacity=".25"/></g>
    <circle class="pin" cx="66" cy="40" r="3" fill="#F43F5E"/><circle cx="66" cy="40" r="2" fill="#F43F5E"/>
    <g class="sat"><circle cx="50" cy="8" r="3.5" fill="#FACC15"/><path d="M44 8h12" stroke="#FACC15" stroke-width="2"/></g></svg>`;
  const box = document.createElement("div"); box.className = "shk";
  box.innerHTML = MAN + `<div><div class="bub"><b>Шоқан Уәлиханов · гид</b><span id="shkT"></span><div class="ctl"><button id="shkV" title="Дауыстап оқу">🔊 Дауыс</button><button id="shkM" title="Жасыру">⇤ Жасыру</button></div></div></div>` + GLOBE;
  document.body.append(box);
  /* дауыс: құрылғыда қазақша дауыс болса ғана */
  let voiceOn = false, kk = null;
  const pickVoice = () => { try { kk = speechSynthesis.getVoices().find(v => /^kk/i.test(v.lang)) || null; } catch { kk = null; } };
  try { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } catch {}
  const speak = t => { if (!voiceOn) return; try { speechSynthesis.cancel(); if (!kk) return; const u = new SpeechSynthesisUtterance(t); u.voice = kk; u.lang = kk.lang; u.rate = .95; u.onstart = () => box.classList.add("talk"); u.onend = () => box.classList.remove("talk"); speechSynthesis.speak(u); } catch {} };
  let tw = null;
  const say = t => { const el = $("#shkT"); clearInterval(tw); let i = 0; box.classList.add("talk"); el.textContent = "";
    const bub = box.querySelector(".bub"); bub.classList.remove("hide"); clearTimeout(say.h);
    tw = setInterval(() => { el.textContent = t.slice(0, ++i); if (i >= t.length) { clearInterval(tw); if (!(voiceOn && kk)) box.classList.remove("talk"); say.h = setTimeout(() => bub.classList.add("hide"), 7000); } }, 28); speak(t); };
  $("#shkV").onclick = () => { voiceOn = !voiceOn; pickVoice(); $("#shkV").textContent = voiceOn ? "🔇 Үнсіз" : "🔊 Дауыс";
    if (voiceOn && !kk) { say("Бұл құрылғыда қазақша дауыс орнатылмаған — мәтінді экраннан оқимыз."); voiceOn = false; $("#shkV").textContent = "🔊 Дауыс"; } else if (voiceOn) say($("#shkT").textContent); else try { speechSynthesis.cancel(); } catch {} };
  $("#shkM").onclick = () => { box.classList.toggle("min"); $("#shkM").textContent = box.classList.contains("min") ? "⇥" : "⇤ Жасыру"; };
  box.querySelector(".man").onclick = () => { if (box.classList.contains("min")) $("#shkM").click(); else say($("#shkT").textContent); };

  /* кезең ауысқанда — Шоқанның сөзі; «6 спикер» бетінде — ғалымдар қатары */
  let lastId = null;
  const roster = () => { try { return JSON.parse(localStorage.getItem("esroster") || "[]"); } catch { return []; } };
  const sciRow = () => { const nav = $("#main .hd"); if (!nav || $(".scirow")) return;
    nav.insertAdjacentHTML("beforeend", `<div class="scirow">${SCI.map((s, i) => `<div class="scic" data-sc="${i}" style="animation-delay:${i * .08}s"><span class="ic">${s.i}</span><b>${s.n}</b><small>${["1 · Ортасы","2 · Нормативтер","3 · Қауіп класы","4 · СИ/ЕЖҚ","5 · Су класы","6 · Мониторинг"][i]}</small><div>${s.f}</div></div>`).join("")}</div>`); };
  const onStage = () => { const id = (location.hash || "#invite").slice(1);
    if (id === "speak") sciRow();
    if (id === lastId) return; lastId = id; const p = $(".presenter"); if (p) p.remove();
    if (LINES[id]) say(LINES[id]); };
  new MutationObserver(onStage).observe(document.getElementById("main") || document.body, { childList: true });
  setTimeout(onStage, 600);

  /* спикер шақырылғанда — экранда кім, қай топ, қай ғалым */
  document.addEventListener("click", e => { const b = e.target.closest("[data-sp]"); if (!b) return; const i = +b.dataset.sp;
    const GK = Object.keys(DATA.groups), g = GK[Math.floor(i / 2)], G = DATA.groups[g], role = i % 2 ? "sp2" : "sp1";
    const r = roster().find(x => x.g === g && x.role === role), name = r ? r.name : (role === "sp1" ? "1-спикер" : "2-спикер"), S = SCI[i];
    const old = $(".presenter"); if (old) old.remove();
    const el = document.createElement("div"); el.className = "presenter"; el.style.setProperty("--gc", G.c);
    el.innerHTML = `<div class="av">${name.trim()[0] || "🎤"}</div><div class="t"><small>🎤 Қазір түсіндіріп жатыр · ${G.i} ${G.n}</small><b>${name}</b><span>${DATA.learnTabs[i].t}</span></div>
      <div class="sci"><b>${S.i} Ғалым-кеңесші: ${S.n}</b> (${S.y})<br>${S.f}</div><button class="x" title="Жабу">✕</button>`;
    document.body.append(el); el.querySelector(".x").onclick = () => el.remove();
    document.querySelectorAll(".scic").forEach((c, k) => c.classList.toggle("on", k === i));
    say(`Тыңдайық! ${name} — ${G.n}. Тақырыбы: ${DATA.learnTabs[i].t.replace(/^\d+ · /, "")}. Кеңесшісі — ${S.n}.`);
  });
})();
