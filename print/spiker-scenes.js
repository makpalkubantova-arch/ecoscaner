/* Спикер карточкаларының сыртқы бетіндегі тақырыптық суреттер (SVG, 400×400) */
window.SCENES = [
/* 1 · 4 көрсеткіш: Жер және айналасында ауа, су, топырақ, табиғи жүйе */
`<svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="92" fill="#2E86C1"/><path d="M150 140c25-10 45 5 40 25s-35 20-30 45 30 30 15 50c-30-5-60-40-55-80 3-20 15-35 30-40zM230 125c25 5 45 25 52 50-15 5-35-5-40 10s15 30 5 45-35 10-40-10 10-40 0-60 8-35 23-35z" fill="#5DBB63"/>
<g font-family="Golos Text" font-weight="800" font-size="20" text-anchor="middle" fill="#fff">
<circle cx="200" cy="52" r="44" fill="#fff" opacity=".18"/><text x="200" y="64" font-size="40">💨</text><text x="200" y="118">АУА</text>
<circle cx="348" cy="200" r="44" fill="#fff" opacity=".18"/><text x="348" y="212" font-size="40">💧</text><text x="348" y="270">СУ</text>
<circle cx="200" cy="348" r="44" fill="#fff" opacity=".18"/><text x="200" y="360" font-size="40">🌱</text><text x="200" y="300">ТОПЫРАҚ</text>
<circle cx="52" cy="200" r="44" fill="#fff" opacity=".18"/><text x="52" y="212" font-size="40">🐟</text><text x="52" y="270">ТІРШІЛІК</text></g>
<circle cx="200" cy="200" r="148" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 10" opacity=".7"/></svg>`,
/* 2 · Нормативтер: шек сызығы */
`<svg viewBox="0 0 400 400"><g font-family="Golos Text" font-weight="800"><rect x="40" y="70" width="320" height="270" rx="20" fill="#fff" opacity=".14"/>
<rect x="80" y="230" width="50" height="90" rx="8" fill="#5DBB63"/><rect x="150" y="190" width="50" height="130" rx="8" fill="#5DBB63"/><rect x="220" y="120" width="50" height="200" rx="8" fill="#E74C3C"/><rect x="290" y="210" width="50" height="110" rx="8" fill="#5DBB63"/>
<line x1="56" y1="170" x2="350" y2="170" stroke="#FFE38A" stroke-width="6" stroke-dasharray="14 8"/><text x="60" y="158" font-size="24" fill="#FFE38A">ШШК — шек</text>
<text x="245" y="110" font-size="34" text-anchor="middle" fill="#fff">⚠</text><text x="200" y="372" font-size="22" fill="#fff" text-anchor="middle">«Осыдан асуға болмайды»</text></g></svg>`,
/* 3 · Қауіп класы: 4 колба */
`<svg viewBox="0 0 400 400"><g font-family="Golos Text" font-weight="800" text-anchor="middle">
${[["I","#C0392B",60],["II","#E67E22",150],["III","#F1C40F",240],["IV","#27AE60",330]].map(([t,c,x],i)=>`<path d="M${x-18} 110h36v70l40 120a20 20 0 0 1-19 26h-78a20 20 0 0 1-19-26l40-120z" fill="#fff" opacity=".22"/><path d="M${x-50} ${240+i*0}h100l14 46a14 14 0 0 1-13 18h-102a14 14 0 0 1-13-18z" fill="${c}"/><rect x="${x-24}" y="96" width="48" height="16" rx="6" fill="#fff"/><text x="${x}" y="296" font-size="34" fill="#fff">${t}</text>`).join("")}
<text x="200" y="372" font-size="22" fill="#fff">Класс кіші — қауіп үлкен</text><text x="60" y="80" font-size="30">☠</text></g></svg>`,
/* 4 · СИ мен ЕЖҚ: өлшегіш */
`<svg viewBox="0 0 400 400"><g font-family="Golos Text" font-weight="800" text-anchor="middle">
<path d="M70 250a130 130 0 0 1 65-113" stroke="#27AE60" stroke-width="34" fill="none"/><path d="M140 134a130 130 0 0 1 120 0" stroke="#F1C40F" stroke-width="34" fill="none"/><path d="M265 137a130 130 0 0 1 45 45" stroke="#E67E22" stroke-width="34" fill="none"/><path d="M313 187a130 130 0 0 1 17 63" stroke="#C0392B" stroke-width="34" fill="none"/>
<line x1="200" y1="250" x2="318" y2="214" stroke="#fff" stroke-width="10" stroke-linecap="round"/><circle cx="200" cy="250" r="18" fill="#fff"/>
<text x="200" y="320" font-size="64" fill="#FFE38A">СИ 40,9</text><text x="200" y="360" font-size="22" fill="#fff">Қарағанды · өте жоғары</text>
<rect x="40" y="40" width="40" height="70" fill="#fff" opacity=".35"/><rect x="88" y="60" width="30" height="50" fill="#fff" opacity=".35"/><circle cx="58" cy="28" r="14" fill="#fff" opacity=".25"/><circle cx="80" cy="16" r="10" fill="#fff" opacity=".2"/></g></svg>`,
/* 5 · Су класы: 6 түсті өзен */
`<svg viewBox="0 0 400 400"><g font-family="Golos Text" font-weight="800" text-anchor="middle">
${["#0E7C5A","#27AE60","#D4AC0D","#E67E22","#C0392B","#7B241C"].map((c,i)=>`<path d="M${20+i*60} 60c20 40-20 80 0 120s-20 80 0 120" stroke="${c}" stroke-width="46" fill="none" stroke-linecap="round"/><text x="${20+i*60}" y="345" font-size="30" fill="#fff">${i+1}</text>`).join("")}
<text x="200" y="385" font-size="22" fill="#fff">1 — ең таза · 6 — аса лас</text><text x="200" y="40" font-size="30">💧</text></g></svg>`,
/* 6 · Мониторинг: бекет және 4 деңгей */
`<svg viewBox="0 0 400 400"><g font-family="Golos Text" font-weight="800" text-anchor="middle">
<circle cx="200" cy="230" r="150" fill="#fff" opacity=".08"/><circle cx="200" cy="230" r="112" fill="#fff" opacity=".1"/><circle cx="200" cy="230" r="76" fill="#fff" opacity=".14"/><circle cx="200" cy="230" r="42" fill="#fff" opacity=".2"/>
<path d="M190 230l10-110 10 110z" fill="#fff"/><circle cx="200" cy="112" r="12" fill="#FFE38A"/><path d="M170 92a40 40 0 0 1 60 0M156 76a62 62 0 0 1 88 0" stroke="#FFE38A" stroke-width="6" fill="none" stroke-linecap="round"/>
<text x="200" y="268" font-size="17" fill="#fff">ЖЕРГІЛІКТІ</text><text x="200" y="304" font-size="17" fill="#fff">АЙМАҚТЫҚ</text><text x="200" y="340" font-size="17" fill="#fff">ҰЛТТЫҚ</text><text x="200" y="376" font-size="17" fill="#fff">ЖАҺАНДЫҚ</text></g></svg>`
];
