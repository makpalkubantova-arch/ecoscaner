/* Шоқан Уәлиханов — сабақтың анимациялық гиді (тақтада) + қозғалмалы глобус + 6 спикердің ғалым-кеңесшілері.
   Сурет — түпнұсқа SVG (тарихи белгілер: әскери мундир, эполет, күнделік). Дауыс: құрылғыда қазақша дауыс болса, оқып береді. */
(() => {
  const MODE = new URLSearchParams(location.search).get("m") || "b"; if (MODE !== "b") return;
  const $ = s => document.querySelector(s);
  const LINES = {
    invite: "Сәлеметсіздер ме! Мен — Шоқан Уәлиханов, ғалым әрі саяхатшымын. Бүгін сендермен бірге табиғатты «сканерлейміз».",
    welcome: "Сәлеметсіздер ме! Бүгінгі көңіл-күйлерің қандай ауа райы? Менің аспаным — шуақты, өйткені алдымызда экспедиция!",
    hw: "Өткен сабақты еске түсірейік. «Ыстық орындыққа» кім отырады?",
    groups: "Экспедицияда әркімнің өз міндеті бар: спикер, хатшы, постер қорғаушы. Топтарың деңгейі бойынша тең!",
    goals: "Мақсатымыз — қоршаған орта сапасының көрсеткіштерін жіктеу.",
    assess: "Әр тапсырманың дескрипторы бар. Хатшы жауап кілтімен тексеріп, балл қояды.",
    video: "Бейнені мұқият қара: сандарды есте сақта — глобус сұрақтары осыдан болады!",
    globe: "Глобус әлемнен Қазақстанға айналады. Мен де саяхатта әр нүктені белгілеп жүргенмін. Атың шықса — тақтаға шық!",
    speak: "Бүгін ғалымдар сөйлейді! Спикерлер ғалымның рөліне кіріп, өз бөлімін қарапайым тілмен түсіндіреді.",
    t1: "8 көрсеткішке бір әріп жаз: А — ауа, С — су, Т — топырақ, Ж — табиғи жүйелер.",
    t2: "Норматив пен қауіп класын ажыратайық. Жұбыңмен ақылдас.",
    t3: "3 минут дайындық, сосын әр топ 2 минут қорғайды. Деректі дәлел ет!",
    t4: "Жұмыс парағында есепте: ЖИ де, оқулық та қателесуі мүмкін!",
    t5: "Мониторингтің 4 кезеңін ретімен қой. Ластануды көрсең — заңды жолмен әрекет ет.",
    t6: "Бекіту! Телефонды ал — жылдам квиз!",
    sum: "Міне, үздіктер! Жарайсыңдар, барлығың нағыз сарапшысыңдар!",
    feedback: "Не ұтымды, не қызықты болды? Ұсынысыңды жаз!",
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
  .shk{position:fixed;left:10px;bottom:84px;z-index:40;display:flex;align-items:flex-end;gap:6px;pointer-events:none;transition:transform .45s cubic-bezier(.2,.8,.2,1)}
  .shk.min{transform:translateX(-170px)}
  .shk svg.man{width:178px;height:206px;filter:drop-shadow(0 14px 22px rgba(0,30,50,.38));pointer-events:auto;cursor:pointer;animation:shkBob 3.6s ease-in-out infinite;--m:0}
  @keyframes shkBob{50%{transform:translateY(-5px)}}
  .shk .breath{animation:shkBr 3.6s ease-in-out infinite;transform-origin:100px 230px}@keyframes shkBr{50%{transform:scale(1.012,1.02)}}
  .shk .eye{animation:shkBlink 4.2s infinite;transform-origin:center;transform-box:fill-box}@keyframes shkBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
  .shk .head{animation:shkTilt 7s ease-in-out infinite;transform-origin:100px 142px}@keyframes shkTilt{25%{transform:rotate(-2.5deg)}60%{transform:rotate(2deg)}}
  .shk.talk .head{animation:shkNod 1.8s ease-in-out infinite}@keyframes shkNod{25%{transform:rotate(-1.5deg) translateY(1px)}75%{transform:rotate(1.5deg)}}
  .shk .jaw{transform:translateY(calc(var(--m) * 5px));transition:transform .06s}
  .shk .mouthO{transform:scaleY(calc(.15 + var(--m) * 1.4));transform-origin:100px 124px;transform-box:view-box;transition:transform .06s}
  .shk.talk .brow{animation:shkBrow 1.2s ease-in-out infinite}@keyframes shkBrow{50%{transform:translateY(-1.6px)}}
  .shk .ring{animation:shkSpin 40s linear infinite;transform-origin:100px 104px}@keyframes shkSpin{to{transform:rotate(360deg)}}
  .shk .mer{animation:shkMer 9s linear infinite}@keyframes shkMer{from{transform:translateX(-40px)}to{transform:translateX(40px)}}
  .shk .spark{animation:shkSp 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes shkSp{0%,100%{opacity:.2;transform:scale(.6)}50%{opacity:1;transform:scale(1.1)}}
  .shk .bub{pointer-events:auto;max-width:360px;transition:opacity .4s,transform .4s;background:linear-gradient(180deg,#fff,#F3FAFF);border:2px solid #FCD34D;border-radius:20px 20px 20px 4px;padding:11px 15px;margin-bottom:120px;box-shadow:0 14px 34px rgba(0,40,60,.25);font:600 15px/1.42 inherit;color:#0B3D3A;position:relative}
  .shk .bub b{display:block;font-size:11px;letter-spacing:.1em;color:#B45309;text-transform:uppercase}
  .shk .eq{display:inline-flex;gap:2px;margin-left:6px;vertical-align:middle}.shk .eq i{width:3px;height:10px;background:#F59E0B;border-radius:2px;transform:scaleY(.3);transition:transform .08s}
  .shk .ctl{display:flex;gap:6px;margin-top:7px}.shk .ctl button{border:0;border-radius:99px;padding:5px 11px;font-weight:800;font-size:12px;background:#E0F2FE;color:#0B3D3A;cursor:pointer}
  .shk .ctl button.on{background:#0EA5E9;color:#fff}
  .presenter{position:fixed;left:50%;top:84px;transform:translateX(-50%);z-index:45;display:flex;align-items:center;gap:16px;background:#fff;border-radius:22px;padding:12px 20px 12px 12px;box-shadow:0 20px 50px rgba(0,40,60,.3);border:4px solid var(--gc,#0EA5E9);animation:prIn .6s cubic-bezier(.2,1.5,.4,1)}
  @keyframes prIn{from{transform:translateX(-50%) translateY(-40px) scale(.7);opacity:0}}
  .presenter .av{width:64px;height:64px;border-radius:50%;background:var(--gc);display:grid;place-items:center;color:#fff;font:900 28px inherit;box-shadow:0 0 0 6px color-mix(in srgb,var(--gc) 25%,transparent);animation:prPulse 1.4s infinite}
  @keyframes prPulse{50%{box-shadow:0 0 0 14px color-mix(in srgb,var(--gc) 10%,transparent)}}
  .presenter .t small{display:block;font-weight:800;color:var(--gc);font-size:12px;letter-spacing:.06em;text-transform:uppercase}.presenter .t b{font-size:24px;color:#0B3D3A}.presenter .t span{display:block;font-weight:700;color:#475569;font-size:14px}
  .presenter .sci{border-left:2px dashed #e2e8f0;padding-left:14px;max-width:340px;font-size:13px;color:#334155}.presenter .sci b{font-size:15px;color:#0B3D3A}.presenter .x{border:0;background:#f1f5f9;border-radius:50%;width:28px;height:28px;cursor:pointer}
  .scirow{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.scic{background:rgba(255,255,255,.92);border-radius:99px;padding:4px 12px;display:flex;gap:6px;align-items:center;box-shadow:0 4px 12px rgba(0,40,60,.08);font-size:12px;line-height:1.3;border-top:4px solid #0EA5E9;animation:scIn .5s both}
  .scic .ic{font-size:16px}.scic b{font-size:13px;color:#0B3D3A}.scic div{display:none}.scic.on{outline:3px solid #F59E0B;transform:translateY(-3px)}@keyframes scIn{from{opacity:0;transform:translateY(10px)}}
  body.inviting .shk{bottom:16px}
  .shk .bub.hide{opacity:0;transform:translateY(10px) scale(.9);pointer-events:none}
  `;
  document.head.append(Object.assign(document.createElement("style"), { textContent: css }));
  const gold = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1B8"/><stop offset=".4" stop-color="#E9B949"/><stop offset=".75" stop-color="#B7861F"/><stop offset="1" stop-color="#7A5410"/></linearGradient>`;
  const MAN = `<svg class="man" viewBox="0 0 200 232" role="img" aria-label="Шоқан Уәлиханов — сабақ гиді">
    <defs>${gold("shG")}
      <radialGradient id="shSea" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#5EC8F2"/><stop offset=".55" stop-color="#0E6E9E"/><stop offset="1" stop-color="#06344F"/></radialGradient>
      <linearGradient id="shCoat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F3E6B"/><stop offset=".6" stop-color="#1B2647"/><stop offset="1" stop-color="#0F1630"/></linearGradient>
      <radialGradient id="shSkin" cx=".42" cy=".38" r=".75"><stop offset="0" stop-color="#F8E0C6"/><stop offset=".7" stop-color="#E5BC97"/><stop offset="1" stop-color="#C99772"/></radialGradient>
      <linearGradient id="shHair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3D302A"/><stop offset="1" stop-color="#120D0B"/></linearGradient>
      <radialGradient id="shGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE7A3" stop-opacity=".9"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient>
      <clipPath id="shClip"><circle cx="100" cy="104" r="88"/></clipPath>
    </defs>
    <circle cx="100" cy="104" r="98" fill="url(#shG)"/>
    <g class="ring">${Array.from({ length: 36 }, (_, k) => `<circle cx="${100 + 93 * Math.cos(k * Math.PI / 18)}" cy="${104 + 93 * Math.sin(k * Math.PI / 18)}" r="1.3" fill="#7A5410" opacity=".55"/>`).join("")}</g>
    <circle cx="100" cy="104" r="89" fill="url(#shSea)"/>
    <g clip-path="url(#shClip)">
      <g class="mer" opacity=".5" fill="none" stroke="#BFE9FF" stroke-width=".8">${[-60, -30, 0, 30, 60].map((x) => `<ellipse cx="${100 + x}" cy="104" rx="${Math.max(6, 60 - Math.abs(x) * .6)}" ry="88"/>`).join("")}</g>
      <g fill="none" stroke="#BFE9FF" stroke-width=".7" opacity=".4"><path d="M12 70 H188 M8 104 H192 M12 138 H188"/></g>
      <path d="M30 60 q14 -10 30 -4 q8 8 -2 14 q-12 6 -24 -2z M120 40 q22 -6 40 6 q6 10 -8 14 q-18 2 -26 -8z M140 82 q14 2 18 12 q-8 6 -16 0z" fill="#52C27A" opacity=".55"/>
      <circle cx="100" cy="60" r="40" fill="url(#shGlow)"/>
      <g class="breath">
        <path d="M14 232 Q18 170 66 152 L134 152 Q182 170 186 232Z" fill="url(#shCoat)"/>
        <path d="M66 152 Q84 160 100 182 Q116 160 134 152 L128 148 Q100 166 72 148Z" fill="#121A33"/>
        <path d="M84 146 L100 172 L116 146 L112 136 L88 136Z" fill="#152044"/>
        <path d="M86 138 L100 160 L114 138" fill="none" stroke="url(#shG)" stroke-width="3"/>
        <path d="M88 136 L100 150 L112 136" fill="#F7F3EA"/>
        <path d="M100 182 L100 232" stroke="#0B1124" stroke-width="2"/>
        ${[192, 208, 224].map((y) => `<circle cx="91" cy="${y}" r="3.6" fill="url(#shG)"/><circle cx="109" cy="${y}" r="3.6" fill="url(#shG)"/>`).join("")}
        <path d="M150 166 Q130 190 104 196" fill="none" stroke="url(#shG)" stroke-width="3.2" stroke-linecap="round"/><path d="M152 172 Q134 200 106 204" fill="none" stroke="url(#shG)" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>
        <circle cx="106" cy="204" r="3" fill="url(#shG)"/>
        <g><ellipse cx="44" cy="160" rx="31" ry="15" fill="url(#shG)" transform="rotate(-15 44 160)"/><ellipse cx="44" cy="160" rx="20" ry="8" fill="#2F3E6B" transform="rotate(-15 44 160)"/><circle cx="44" cy="160" r="3" fill="url(#shG)"/>
          ${Array.from({ length: 10 }, (_, k) => `<path d="M${19 + k * 5.6} ${168 + Math.abs(4.5 - k) * 1.2} q1 11 -1 18" stroke="#D9A830" stroke-width="2.8" fill="none" stroke-linecap="round"/>`).join("")}</g>
        <g><ellipse cx="156" cy="160" rx="31" ry="15" fill="url(#shG)" transform="rotate(15 156 160)"/><ellipse cx="156" cy="160" rx="20" ry="8" fill="#2F3E6B" transform="rotate(15 156 160)"/><circle cx="156" cy="160" r="3" fill="url(#shG)"/>
          ${Array.from({ length: 10 }, (_, k) => `<path d="M${131 + k * 5.6} ${168 + Math.abs(4.5 - k) * 1.2} q-1 11 1 18" stroke="#D9A830" stroke-width="2.8" fill="none" stroke-linecap="round"/>`).join("")}</g>
      </g>
      <g class="head">
        <path d="M88 118 L112 118 L113 142 Q100 148 87 142Z" fill="#D7A983"/>
        <path d="M65 76 Q64 128 100 138 Q136 128 135 76 Q134 50 100 48 Q66 50 65 76Z" fill="url(#shSkin)"/>
        <path d="M70 108 Q78 128 100 134 Q122 128 130 108 Q124 126 100 130 Q76 126 70 108Z" fill="#C99772" opacity=".35"/>
        <ellipse cx="65" cy="92" rx="5.5" ry="10" fill="#DDB08B"/><ellipse cx="135" cy="92" rx="5.5" ry="10" fill="#DDB08B"/>
        <path d="M61 88 Q56 38 102 34 Q146 36 141 86 Q138 66 126 58 Q108 50 92 50 Q78 54 72 64 Q64 74 61 88Z" fill="url(#shHair)"/>
        <path d="M61 84 Q60 100 64 108 L66 92Z M139 84 Q140 100 136 108 L134 92Z" fill="#1F1814"/>
        <path d="M90 50 Q106 56 128 58" stroke="#5E4A3E" stroke-width="1.6" fill="none" opacity=".7"/>
        <g class="brow"><path d="M75 82 Q83 77 92 81" stroke="#1E1714" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M108 81 Q117 77 125 82" stroke="#1E1714" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
        <g class="eye"><path d="M76 91 Q84 85.5 92 91 Q84 95 76 91Z" fill="#fff"/><circle cx="84" cy="90.6" r="3.1" fill="#2B1D16"/><circle cx="85.2" cy="89.5" r="1" fill="#fff"/></g>
        <g class="eye"><path d="M108 91 Q116 85.5 124 91 Q116 95 108 91Z" fill="#fff"/><circle cx="116" cy="90.6" r="3.1" fill="#2B1D16"/><circle cx="117.2" cy="89.5" r="1" fill="#fff"/></g>
        <path d="M100 93 L96.5 109 Q100 112 104.5 109" stroke="#B4815C" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="80" cy="106" rx="7" ry="4" fill="#F2A58E" opacity=".25"/><ellipse cx="120" cy="106" rx="7" ry="4" fill="#F2A58E" opacity=".25"/>
        <g class="jaw"><ellipse class="mouthO" cx="100" cy="124" rx="6.5" ry="3" fill="#7A3A2E"/></g>
        <path d="M100 115 Q90 111 79 115 Q71 121 64 115 Q71 126 84 121 Q94 119 100 119Z M100 115 Q110 111 121 115 Q129 121 136 115 Q129 126 116 121 Q106 119 100 119Z" fill="#1E1714"/>
      </g>
      <circle class="spark" cx="160" cy="44" r="3" fill="#FFF1B8"/><circle class="spark" cx="40" cy="58" r="2.4" fill="#FFF1B8" style="animation-delay:-1.1s"/>
    </g>
    <path d="M34 196 Q100 226 166 196" stroke="url(#shG)" stroke-width="18" fill="none" stroke-linecap="round"/>
    <text x="100" y="214" text-anchor="middle" font-size="10.5" font-weight="900" fill="#3A2600" letter-spacing="1.6">ШОҚАН · ГИД</text>
  </svg>`;
  const box = document.createElement("div"); box.className = "shk";
  box.innerHTML = MAN + `<div><div class="bub"><b>Шоқан Уәлиханов · гид <span class="eq"><i></i><i></i><i></i><i></i></span></b><span id="shkT"></span><div class="ctl"><button id="shkV" title="Дауыс">🔊 Дауыс</button><button id="shkR" title="Қайталау">↻ Қайта</button><button id="shkM" title="Жасыру">⇤ Жасыру</button></div></div></div>`;
  document.body.append(box);
  /* дауыс: алдын ала жазылған қазақша ер дауысы (media/shokan/*.mp3); болмаса — құрылғыдағы kk дауысы */
  let voiceOn = (() => { try { return localStorage.getItem("shkVoice") !== "0"; } catch { return true; } })();
  const man = box.querySelector(".man"), eq = [...box.querySelectorAll(".eq i")];
  const audio = new Audio(); audio.preload = "auto"; let AC = null, an = null, buf = null, raf = 0;
  const lip = () => { if (!an) return; an.getByteTimeDomainData(buf); let m = 0; for (let i = 0; i < buf.length; i += 4) m = Math.max(m, Math.abs(buf[i] - 128)); const v = Math.min(1, m / 52);
    man.style.setProperty("--m", v.toFixed(2)); eq.forEach((e, k) => e.style.transform = `scaleY(${Math.max(.2, Math.min(1, v * (1.3 - k * .15) + Math.random() * .15))})`); raf = requestAnimationFrame(lip); };
  const stopLip = () => { cancelAnimationFrame(raf); man.style.setProperty("--m", 0); eq.forEach((e) => e.style.transform = "scaleY(.3)"); box.classList.remove("talk"); };
  audio.onplay = () => { box.classList.add("talk"); try { if (!AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); const src = AC.createMediaElementSource(audio); an = AC.createAnalyser(); an.fftSize = 512; buf = new Uint8Array(an.fftSize); src.connect(an); an.connect(AC.destination); } if (AC.state === "suspended") AC.resume(); } catch {} cancelAnimationFrame(raf); lip(); };
  audio.onended = audio.onpause = stopLip;
  let kk = null; const pickVoice = () => { try { kk = speechSynthesis.getVoices().find(v => /^kk/i.test(v.lang)) || null; } catch { kk = null; } };
  try { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } catch {}
  const speakTTS = t => { try { speechSynthesis.cancel(); if (!kk) return; const u = new SpeechSynthesisUtterance(t); u.voice = kk; u.lang = kk.lang; u.rate = .95; u.onstart = () => box.classList.add("talk"); u.onend = () => box.classList.remove("talk"); speechSynthesis.speak(u); } catch {} };
  let tw = null, curKey = null;
  const say = (t, key) => { const el = $("#shkT"); clearInterval(tw); let i = 0; el.textContent = ""; curKey = key || null;
    const bub = box.querySelector(".bub"); bub.classList.remove("hide"); clearTimeout(say.h);
    try { audio.pause(); } catch {}
    if (voiceOn && key) { audio.src = "media/shokan/" + key + ".mp3"; audio.play().catch(() => speakTTS(t)); } else if (voiceOn) speakTTS(t);
    tw = setInterval(() => { el.textContent = t.slice(0, ++i); if (i >= t.length) { clearInterval(tw); say.h = setTimeout(() => { if (audio.paused) bub.classList.add("hide"); }, 9000); } }, 30); };
  const vBtn = () => { $("#shkV").textContent = voiceOn ? "🔊 Дауыс" : "🔇 Үнсіз"; $("#shkV").classList.toggle("on", voiceOn); };
  vBtn();
  $("#shkV").onclick = () => { voiceOn = !voiceOn; try { localStorage.setItem("shkVoice", voiceOn ? "1" : "0"); } catch {} vBtn(); if (!voiceOn) { audio.pause(); try { speechSynthesis.cancel(); } catch {} } else say($("#shkT").textContent, curKey); };
  $("#shkR").onclick = () => say($("#shkT").textContent, curKey);
  $("#shkM").onclick = () => { box.classList.toggle("min"); $("#shkM").textContent = box.classList.contains("min") ? "⇥" : "⇤ Жасыру"; };
  box.querySelector(".man").onclick = () => { if (box.classList.contains("min")) $("#shkM").click(); else say($("#shkT").textContent, curKey); };

  /* кезең ауысқанда — Шоқанның сөзі; «6 спикер» бетінде — ғалымдар қатары */
  let lastId = null;
  const roster = () => { try { return JSON.parse(localStorage.getItem("esroster") || "[]"); } catch { return []; } };
  const sciRow = () => { const nav = $("#main .hd"); if (!nav || $(".scirow")) return;
    nav.insertAdjacentHTML("beforeend", `<div class="scirow">${SCI.map((s, i) => `<div class="scic" data-sc="${i}" style="animation-delay:${i * .08}s"><span class="ic">${s.i}</span><b>${s.n}</b><small>${["1 · Ортасы","2 · Нормативтер","3 · Қауіп класы","4 · СИ/ЕЖҚ","5 · Су класы","6 · Мониторинг"][i]}</small><div>${s.f}</div></div>`).join("")}</div>`); };
  const onStage = () => { const id = (location.hash || "#invite").slice(1);
    if (id === "speak") sciRow();
    if (id === lastId) return; lastId = id; const p = $(".presenter"); if (p) p.remove();
    if (LINES[id]) say(LINES[id], id); };
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
    say(`Ортаға ${S.n} шығады! Оның рөлінде — ${name}, ${G.n}. Тақырыбы: ${DATA.learnTabs[i].t.replace(/^\d+ · /, "")}.`, "sp" + i);
  });
})();
