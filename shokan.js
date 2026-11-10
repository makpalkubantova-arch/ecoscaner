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
    assess: "Әр тапсырманың дескрипторы бар. Хатшы жауап кілтімен тексеріп, балл қояды.",
    video: "Бейнені мұқият қара: 4 сызбаны есте сақта.",
    speak: "Бүгін ғалымдар сөйлейді! Спикерлер ғалымның рөліне кіріп, өз бөлімін қарапайым тілмен түсіндіреді.",
    t1: "8 көрсеткішке бір әріп жаз: А — ауа, С — су, Т — топырақ, Ж — табиғи жүйелер.",
    t2: "Норматив пен қауіп класын ажыратайық. Жұбыңмен ақылдас.",
    t3: "Әр топ — бір қаланың сарапшысы. Деректі дәлел ет!",
    t4: "ЖИ де қателеседі. Оқулықпен тексер!",
    t5: "Мониторингтің 4 кезеңін ретімен қой. Ластануды көрсең — заңды жолмен әрекет ет.",
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
  .shk svg.man{width:150px;height:172px;filter:drop-shadow(0 10px 18px rgba(0,40,40,.3));pointer-events:auto;cursor:pointer;animation:shkBob 3.2s ease-in-out infinite}
  @keyframes shkBob{50%{transform:translateY(-4px)}}
  .shk .eye{animation:shkBlink 4s infinite;transform-origin:center;transform-box:fill-box}@keyframes shkBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
  .shk .head{animation:shkTilt 6s ease-in-out infinite;transform-origin:100px 140px}@keyframes shkTilt{30%{transform:rotate(-2deg)}70%{transform:rotate(2deg)}}.shk.talk .must{animation:shkMust .25s infinite alternate;transform-origin:100px 118px}@keyframes shkMust{to{transform:translateY(1.5px) scaleY(.92)}}
  .shk .mouth{animation:none;transform-origin:center;transform-box:fill-box}.shk.talk .mouth{animation:shkTalk .25s infinite alternate}@keyframes shkTalk{to{transform:scaleY(2.4)}}
  .shk .bub{pointer-events:auto;max-width:330px;transition:opacity .4s,transform .4s;background:#fff;border-radius:18px 18px 18px 4px;padding:10px 14px;margin-bottom:110px;font-size:14px;box-shadow:0 12px 30px rgba(0,40,60,.22);font:600 15px/1.4 inherit;color:#0B3D3A;position:relative}
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
  const MAN = `<svg class="man" viewBox="0 0 200 230" role="img" aria-label="Шоқан Уәлиханов — сабақ гиді">
    <defs>
      <radialGradient id="shBg" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="#FFF8E7"/><stop offset="1" stop-color="#E9DDBF"/></radialGradient>
      <linearGradient id="shGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE39A"/><stop offset=".45" stop-color="#D4A12A"/><stop offset="1" stop-color="#8A6212"/></linearGradient>
      <linearGradient id="shCoat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3557"/><stop offset="1" stop-color="#141B30"/></linearGradient>
      <radialGradient id="shSkin" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#F6DCC0"/><stop offset="1" stop-color="#D9AE88"/></radialGradient>
      <linearGradient id="shHair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2F2A"/><stop offset="1" stop-color="#14100E"/></linearGradient>
      <clipPath id="shClip"><circle cx="100" cy="104" r="88"/></clipPath>
    </defs>
    <circle cx="100" cy="104" r="96" fill="url(#shGold)"/><circle cx="100" cy="104" r="90" fill="#7A5410"/><circle cx="100" cy="104" r="88" fill="url(#shBg)"/>
    <g clip-path="url(#shClip)">
      <g class="body">
        <path d="M18 230 Q22 168 70 152 L130 152 Q178 168 182 230Z" fill="url(#shCoat)"/>
        <path d="M84 148 L100 176 L116 148 L112 140 L88 140Z" fill="#1B2440"/><path d="M90 140 L100 154 L110 140" fill="#F4F1EA"/>
        <path d="M100 176 L100 230" stroke="#0E1426" stroke-width="2"/>
        ${[186, 204, 222].map(y => `<circle cx="88" cy="${y}" r="4" fill="url(#shGold)"/><circle cx="112" cy="${y}" r="4" fill="url(#shGold)"/>`).join("")}
        <g class="epl"><ellipse cx="46" cy="162" rx="30" ry="15" fill="url(#shGold)" transform="rotate(-14 46 162)"/><ellipse cx="46" cy="162" rx="19" ry="8" fill="#2A3557" transform="rotate(-14 46 162)"/>
          ${Array.from({ length: 9 }, (_, k) => `<path d="M${22 + k * 6} ${170 + Math.abs(4 - k)} q1 10 -1 16" stroke="#C8941F" stroke-width="3.2" fill="none" stroke-linecap="round"/>`).join("")}</g>
        <g class="epl"><ellipse cx="154" cy="162" rx="30" ry="15" fill="url(#shGold)" transform="rotate(14 154 162)"/><ellipse cx="154" cy="162" rx="19" ry="8" fill="#2A3557" transform="rotate(14 154 162)"/>
          ${Array.from({ length: 9 }, (_, k) => `<path d="M${130 + k * 6} ${170 + Math.abs(4 - k)} q-1 10 1 16" stroke="#C8941F" stroke-width="3.2" fill="none" stroke-linecap="round"/>`).join("")}</g>
      </g>
      <g class="head">
        <rect x="88" y="118" width="24" height="26" rx="8" fill="#D9AE88"/>
        <path d="M66 74 Q66 132 100 138 Q134 132 134 74 Q134 52 100 50 Q66 52 66 74Z" fill="url(#shSkin)"/>
        <ellipse cx="66" cy="92" rx="5" ry="9" fill="#D9AE88"/><ellipse cx="134" cy="92" rx="5" ry="9" fill="#D9AE88"/>
        <path d="M62 86 Q58 40 102 36 Q144 38 140 84 Q136 66 124 60 Q108 54 96 52 L92 50 Q80 56 74 64 Q66 72 62 86Z" fill="url(#shHair)"/>
        <path d="M92 50 Q104 58 126 60" stroke="#55463D" stroke-width="1.6" fill="none" opacity=".7"/>
        <path d="M76 84 Q84 80 92 84" stroke="#1E1714" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M108 84 Q116 80 124 84" stroke="#1E1714" stroke-width="3" fill="none" stroke-linecap="round"/>
        <g class="eye"><path d="M77 92 Q84 87 91 92 Q84 95 77 92Z" fill="#fff"/><circle cx="84" cy="91.6" r="2.8" fill="#2B1D16"/></g>
        <g class="eye"><path d="M109 92 Q116 87 123 92 Q116 95 109 92Z" fill="#fff"/><circle cx="116" cy="91.6" r="2.8" fill="#2B1D16"/></g>
        <path d="M100 94 L97 110 Q100 113 104 110" stroke="#B88A66" stroke-width="2" fill="none" stroke-linecap="round"/>
        <g class="must"><path d="M100 116 Q90 112 80 116 Q72 122 66 116 Q72 126 84 122 Q94 120 100 120Z" fill="#1E1714"/><path d="M100 116 Q110 112 120 116 Q128 122 134 116 Q128 126 116 122 Q106 120 100 120Z" fill="#1E1714"/></g>
        <ellipse class="mouth" cx="100" cy="125" rx="6" ry="1.4" fill="#8A4A3A"/>
      </g>
    </g>
    <path d="M40 196 Q100 222 160 196" stroke="url(#shGold)" stroke-width="16" fill="none"/>
    <text x="100" y="212" text-anchor="middle" font-size="11" font-weight="900" fill="#3A2600" letter-spacing="1.5">ШОҚАН · ГИД</text>
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
    el.innerHTML = `<div class="av">${name.trim()[0] || "🎤"}</div><div class="t"><small>🎭 Ғалымның рөлінде · ${G.i} ${G.n}</small><b>${name} — ${S.n}</b><span>${DATA.learnTabs[i].t}</span></div>
      <div class="sci"><b>${S.i} Ғалым-кеңесші: ${S.n}</b> (${S.y})<br>${S.f}</div><button class="x" title="Жабу">✕</button>`;
    document.body.append(el); el.querySelector(".x").onclick = () => el.remove();
    document.querySelectorAll(".scic").forEach((c, k) => c.classList.toggle("on", k === i));
    say(`Ортаға ${S.n} шығады! Оның рөлінде — ${name}, ${G.n}. Тақырыбы: ${DATA.learnTabs[i].t.replace(/^\d+ · /, "")}.`);
  });
})();
