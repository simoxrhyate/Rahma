/* ============================================================
RAHMA APP — app.js  v3
Router · Quran · Listen · Prayers · Tasbih · AI · Guide
============================================================ */

‘use strict’;

/* ─────────────────────────────────────────────────────
ROUTER
───────────────────────────────────────────────────── */
const PAGE_LABELS = {
quran:   ‘Corano’,
listen:  ‘Ascolta’,
prayers: ‘Preghiere’,
tasbih:  ‘Tasbih’,
ai:      ‘AI Halal’,
new:     ‘Guida’
};

let activePage = ‘quran’;

async function showPage(id) {
document.querySelectorAll(’.page’).forEach(p => p.classList.remove(‘active’));
document.querySelectorAll(’.nav-btn’).forEach(b => b.classList.remove(‘active’));

const page = document.getElementById(`page-${id}`);
const btn  = document.querySelector(`.nav-btn[data-page="${id}"]`);
if (page) page.classList.add(‘active’);
if (btn)  btn.classList.add(‘active’);

document.getElementById(‘headerTitle’).textContent = PAGE_LABELS[id] || ‘’;
activePage = id;

if (id === ‘quran’  && !quranReady)  initQuran();
if (id === ‘listen’ && !listenReady) initListen();
if (id === ‘prayers’) await renderPrayers();
if (id === ‘new’    && !journeyReady) initJourney();
}

document.querySelectorAll(’.nav-btn’).forEach(btn => {
btn.addEventListener(‘click’, async () => await showPage(btn.dataset.page));
});

/* ─────────────────────────────────────────────────────
HIJRI DATE
───────────────────────────────────────────────────── */
function setHijri() {
try {
const fmt = new Intl.DateTimeFormat(‘ar-SA-u-ca-islamic’, {
day: ‘numeric’, month: ‘short’, year: ‘numeric’
});
document.getElementById(‘hijriPill’).textContent = fmt.format(new Date());
} catch {
document.getElementById(‘hijriPill’).textContent = ‘’;
}
}
setHijri();

/* ─────────────────────────────────────────────────────
QURAN
───────────────────────────────────────────────────── */
let quranReady = false;

function initQuran() {
quranReady = true;
buildSurahList(’’);
document.getElementById(‘surahSearch’).addEventListener(‘input’, e => buildSurahList(e.target.value.toLowerCase()));
document.getElementById(‘backBtn’).addEventListener(‘click’, backToList);
}

function buildSurahList(filter) {
const list = document.getElementById(‘surahList’);
list.innerHTML = ‘’;
SURAH_AR.forEach((ar, i) => {
const n  = i + 1;
const it = SURAH_IT[i] || `Sura ${n}`;
const m  = SURAH_META[i] || { v: ‘?’, c: ‘’ };
if (filter && !it.toLowerCase().includes(filter) && !ar.includes(filter) && !String(n).includes(filter)) return;

```
const row = document.createElement('div');
row.className = 'surah-row';
row.setAttribute('tabindex', '0');
row.setAttribute('role', 'button');
row.setAttribute('aria-label', `Sura ${n}: ${it}`);
row.innerHTML = `
  <div class="s-num">${n}</div>
  <div class="s-info">
    <div class="s-it">${it}</div>
    <div class="s-ar">${ar}</div>
  </div>
  <div class="s-meta">
    <div class="s-meta-v">${m.v}v</div>
    <div class="s-meta-c">${m.c}</div>
  </div>
`;
row.addEventListener('click', () => openSurah(n, ar, it, m));
row.addEventListener('keydown', e => { if (e.key === 'Enter') openSurah(n, ar, it, m); });
list.appendChild(row);
```

});
}

async function openSurah(num, ar, it, m) {
document.getElementById(‘surahListWrap’).classList.add(‘hidden’);
const detail = document.getElementById(‘surahDetail’);
detail.classList.remove(‘hidden’);

document.getElementById(‘detailTitleIt’).textContent = it;
document.getElementById(‘detailTitleAr’).textContent = ar;
document.getElementById(‘detailMeta’).textContent = `${num} · ${m.v}v · ${m.c}`;

const bism = document.getElementById(‘bismillahHero’);
bism.style.display = (num === 1 || num === 9) ? ‘none’ : ‘block’;

const feed = document.getElementById(‘verseFeed’);
feed.innerHTML = `<div class="loader"><div class="spin"></div><span>Caricamento versetti...</span></div>`;
document.getElementById(‘pagesContainer’).scrollTop = 0;

const IT_EDITIONS = [‘it.piccardo’, ‘it.muhammadali’];
let arV = [], itV = [];

try {
const arRes = await fetch(`https://api.alquran.cloud/v1/surah/${num}/quran-uthmani`);
if (!arRes.ok) throw new Error(‘Errore API arabo’);
arV = (await arRes.json()).data.ayahs;

```
for (const edition of IT_EDITIONS) {
  try {
    const itRes = await fetch(`https://api.alquran.cloud/v1/surah/${num}/${edition}`);
    if (itRes.ok) { itV = (await itRes.json()).data.ayahs; break; }
  } catch { /* try next */ }
}

feed.innerHTML = '';
arV.forEach((v, i) => {
  const el = document.createElement('div');
  el.className = 'verse-item';
  const itText = (itV[i] && itV[i].text) ? itV[i].text : '';
  el.innerHTML = `
    <div class="verse-ar">${v.text}</div>
    <div class="verse-bottom">
      <div class="verse-n">${v.numberInSurah}</div>
      <div class="verse-tr">${itText || '<em style="color:var(--text3)">Traduzione non disponibile</em>'}</div>
    </div>
  `;
  feed.appendChild(el);
});
```

} catch {
feed.innerHTML = `<div class="loader"><span style="font-size:36px">😕</span><span>Errore connessione. Riprova.</span></div>`;
}
}

function backToList() {
document.getElementById(‘surahDetail’).classList.add(‘hidden’);
document.getElementById(‘surahListWrap’).classList.remove(‘hidden’);
}

document.body.insertAdjacentHTML(‘afterbegin’, ` <svg class="svg-defs" aria-hidden="true"> <defs> <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#a78bfa"/> </linearGradient> </defs> </svg>`);

/* ─────────────────────────────────────────────────────
LISTEN — AUDIO QURAN
───────────────────────────────────────────────────── */
let listenReady = false;
let currentReciterIdx = 0;
let currentAudioSurah = null;
let isPlaying = false;

const RECITERS = [
{ name: ‘Mishary Al-Afasy’,  style: ‘Murattal’, emoji: ‘🎙’, id: ‘ar.alafasy’ },
{ name: ‘Abdul Basit’,       style: ‘Murattal’, emoji: ‘🎤’, id: ‘ar.abdulbasitmurattal’ },
{ name: ‘Maher Al-Muaiqly’,  style: ‘Murattal’, emoji: ‘🎵’, id: ‘ar.maharalmuaiqly’ },
{ name: ‘Saad Al-Ghamdi’,    style: ‘Murattal’, emoji: ‘🎶’, id: ‘ar.saadalghamdi’ },
];

function initListen() {
listenReady = true;
buildReciterGrid();
buildAudioSurahList();
initPlayer();
}

function buildReciterGrid() {
const grid = document.getElementById(‘reciterGrid’);
grid.innerHTML = ‘’;
RECITERS.forEach((r, i) => {
const card = document.createElement(‘div’);
card.className = ‘reciter-card’ + (i === 0 ? ’ active’ : ‘’);
card.dataset.i = i;
card.innerHTML = `<div class="reciter-avatar">${r.emoji}</div> <div class="reciter-info"> <div class="reciter-name">${r.name}</div> <div class="reciter-style">${r.style}</div> </div>`;
card.addEventListener(‘click’, () => selectReciter(i));
grid.appendChild(card);
});
}

function selectReciter(idx) {
currentReciterIdx = idx;
document.querySelectorAll(’.reciter-card’).forEach((c, i) =>
c.classList.toggle(‘active’, i === idx));
document.getElementById(‘playerReciterName’).textContent = RECITERS[idx].name;
if (currentAudioSurah !== null) loadAudio(currentAudioSurah, false);
}

function buildAudioSurahList() {
const list = document.getElementById(‘audioSurahList’);
list.innerHTML = ‘’;
SURAH_IT.forEach((it, i) => {
const n  = i + 1;
const ar = SURAH_AR[i];
const row = document.createElement(‘div’);
row.className = ‘audio-surah-row’;
row.id = `asr-${n}`;
row.innerHTML = `<div class="as-num">${n}</div> <div class="as-info"> <div class="as-it">${it}</div> <div class="as-ar">${ar}</div> </div> <div class="as-play-icon">▶</div>`;
row.addEventListener(‘click’, () => {
if (currentAudioSurah === n && isPlaying) togglePlayPause();
else loadAudio(n, true);
});
list.appendChild(row);
});
}

function initPlayer() {
const audio   = document.getElementById(‘audioPlayer’);
const slider  = document.getElementById(‘playerSlider’);
const playBtn = document.getElementById(‘playBtn’);

document.getElementById(‘playBtn’).addEventListener(‘click’, togglePlayPause);
document.getElementById(‘prevSurahBtn’).addEventListener(‘click’, () => {
if (currentAudioSurah > 1) loadAudio(currentAudioSurah - 1, true);
});
document.getElementById(‘nextSurahBtn’).addEventListener(‘click’, () => {
if (currentAudioSurah < 114) loadAudio(currentAudioSurah + 1, true);
else loadAudio(1, true);
});

audio.addEventListener(‘timeupdate’, () => {
if (!audio.duration) return;
const pct = (audio.currentTime / audio.duration) * 100;
slider.value = pct;
document.getElementById(‘playerTimeEl’).textContent = formatTime(audio.currentTime);
slider.style.background = `linear-gradient(to right, #818cf8 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
});

audio.addEventListener(‘loadedmetadata’, () => {
document.getElementById(‘playerDurEl’).textContent = formatTime(audio.duration);
});

audio.addEventListener(‘ended’, () => {
isPlaying = false;
playBtn.textContent = ‘▶’;
playBtn.classList.remove(‘playing’);
if (currentAudioSurah < 114) loadAudio(currentAudioSurah + 1, true);
});

audio.addEventListener(‘play’, () => {
isPlaying = true;
playBtn.textContent = ‘⏸’;
playBtn.classList.add(‘playing’);
});

audio.addEventListener(‘pause’, () => {
isPlaying = false;
playBtn.textContent = ‘▶’;
playBtn.classList.remove(‘playing’);
});

slider.addEventListener(‘input’, () => {
if (audio.duration) audio.currentTime = (slider.value / 100) * audio.duration;
});
}

function loadAudio(surahNum, autoplay) {
const reciter = RECITERS[currentReciterIdx];
const url = `https://cdn.islamic.network/quran/audio-surah/128/${reciter.id}/${surahNum}.mp3`;

currentAudioSurah = surahNum;

document.getElementById(‘playerSurahAr’).textContent = SURAH_AR[surahNum - 1] || ‘—’;
document.getElementById(‘playerSurahIt’).textContent = SURAH_IT[surahNum - 1] || `Sura ${surahNum}`;
document.getElementById(‘playerReciterName’).textContent = reciter.name;
document.getElementById(‘playerTimeEl’).textContent = ‘0:00’;
document.getElementById(‘playerDurEl’).textContent = ‘0:00’;
document.getElementById(‘playerSlider’).value = 0;
document.getElementById(‘playerSlider’).style.background = ‘rgba(255,255,255,0.1)’;

document.querySelectorAll(’.audio-surah-row’).forEach(r => r.classList.remove(‘playing’));
const activeRow = document.getElementById(`asr-${surahNum}`);
if (activeRow) {
activeRow.classList.add(‘playing’);
activeRow.scrollIntoView({ block: ‘nearest’, behavior: ‘smooth’ });
}

const audio = document.getElementById(‘audioPlayer’);
audio.src = url;
audio.load();

audio.onerror = () => {
document.getElementById(‘playerSurahIt’).textContent = “⚠️ Errore caricamento”;
document.getElementById(‘playerReciterName’).textContent = “Prova un altro lettore”;
};

if (autoplay) audio.play().catch(() => {});
}

function togglePlayPause() {
const audio = document.getElementById(‘audioPlayer’);
if (!currentAudioSurah) { loadAudio(1, true); return; }
if (audio.paused) audio.play().catch(() => {});
else audio.pause();
}

function formatTime(secs) {
if (!secs || isNaN(secs)) return ‘0:00’;
const m = Math.floor(secs / 60);
const s = Math.floor(secs % 60);
return `${m}:${s.toString().padStart(2, '0')}`;
}

/* ─────────────────────────────────────────────────────
PRAYERS
───────────────────────────────────────────────────── */
const PRAYERS_DEF = [
{ id: ‘fajr’,    ar: ‘الفجر’,  it: ‘Fajr’,    time: ‘Alba’,        emoji: ‘🌅’ },
{ id: ‘dhuhr’,   ar: ‘الظهر’,  it: ‘Dhuhr’,   time: ‘Mezzogiorno’, emoji: ‘☀️’ },
{ id: ‘asr’,     ar: ‘العصر’,  it: ‘Asr’,     time: ‘Pomeriggio’,  emoji: ‘🌤’ },
{ id: ‘maghrib’, ar: ‘المغرب’, it: ‘Maghrib’,  time: ‘Tramonto’,    emoji: ‘🌆’ },
{ id: ‘isha’,    ar: ‘العشاء’, it: ‘Isha’,     time: ‘Notte’,       emoji: ‘🌙’ },
];

const RING_MSGS = [
‘🌅 Inizia la tua giornata con bismillah’,
‘🌿 Prima preghiera completata — bravissimo!’,
‘💫 Due fatte, tre rimangono. Vai avanti!’,
‘⭐ Sei a metà strada, continua così!’,
‘🤲 Solo una rimane, quasi finito!’,
‘✨ MashaAllah! Tutte e 5 completate oggi!’,
];

function todayKey() {
const d = new Date();
return `rahma_p_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

async function renderPrayers() {
const data = await window.RahmaDB.getPrayers(todayKey());
const done = PRAYERS_DEF.filter(p => data[p.id]).length;
const cachedTimes = await window.RahmaDB.getCache(`times_${todayKey()}`);

document.getElementById(‘prayerDate’).textContent = new Date().toLocaleDateString(‘it-IT’, {
weekday: ‘long’, day: ‘numeric’, month: ‘long’
});

const circ = 2 * Math.PI * 66;
document.getElementById(‘prayerRing’).style.strokeDashoffset = circ * (1 - done / 5);
document.getElementById(‘ringNumber’).textContent = done;
document.getElementById(‘ringMessage’).textContent = RING_MSGS[done] || RING_MSGS[0];

const stack = document.getElementById(‘prayersStack’);
stack.innerHTML = ‘’;
PRAYERS_DEF.forEach(p => {
const isDone = !!data[p.id];
const card = document.createElement(‘div’);
card.className = ‘prayer-card’ + (isDone ? ’ done’ : ‘’);
card.setAttribute(‘role’, ‘checkbox’);
card.setAttribute(‘aria-checked’, String(isDone));
card.setAttribute(‘aria-label’, `${p.it} — ${isDone ? 'eseguita' : 'non eseguita'}`);
card.setAttribute(‘tabindex’, ‘0’);

```
const displayTime = cachedTimes && cachedTimes[p.id] ? cachedTimes[p.id] : p.time;

card.innerHTML = `
  <div class="p-emoji">${p.emoji}</div>
  <div class="p-info">
    <div class="p-it-title">${p.it}</div>
    <div class="p-time-desc">${displayTime}</div>
  </div>
  <div class="p-check">${isDone ? '✓' : ''}</div>
`;
card.addEventListener('click', async () => {
  data[p.id] = !data[p.id];
  await window.RahmaDB.savePrayers(todayKey(), data);
  await renderPrayers();
});
card.addEventListener('keydown', async e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    data[p.id] = !data[p.id];
    await window.RahmaDB.savePrayers(todayKey(), data);
    await renderPrayers();
  }
});
stack.appendChild(card);
```

});

await renderWeek();
await renderStats();
}

document.getElementById(‘resetDayBtn’).addEventListener(‘click’, async () => {
await window.RahmaDB.savePrayers(todayKey(), {});
await renderPrayers();
});

const locBtn = document.getElementById(‘getLocationBtn’);
locBtn.addEventListener(‘click’, () => {
locBtn.innerHTML = ‘<span class="loader-spinner"></span>’;
if (“geolocation” in navigator) {
navigator.geolocation.getCurrentPosition(async position => {
const lat = position.coords.latitude;
const lng = position.coords.longitude;
const t = Math.floor(Date.now() / 1000);
try {
const res = await fetch(`https://api.aladhan.com/v1/timings/${t}?latitude=${lat}&longitude=${lng}&method=2`);
const json = await res.json();
if (json.code === 200) {
const tnx = json.data.timings;
const mapped = { fajr: tnx.Fajr, dhuhr: tnx.Dhuhr, asr: tnx.Asr, maghrib: tnx.Maghrib, isha: tnx.Isha };
await window.RahmaDB.saveCache(`times_${todayKey()}`, mapped);
locBtn.innerHTML = ‘📍 Aggiornato’;
setTimeout(() => locBtn.innerHTML = ‘📍 Orari Locali’, 3000);
await renderPrayers();
}
} catch (e) {
locBtn.innerHTML = ‘⚠️ Errore Rete’;
}
}, () => { locBtn.innerHTML = ‘⚠️ Posizione Negata’; });
} else {
locBtn.innerHTML = ‘⚠️ Non supportato’;
}
});

async function renderWeek() {
const strip = document.getElementById(‘weekStrip’);
strip.innerHTML = ‘’;
const now = new Date();
const names = [‘Do’, ‘Lu’, ‘Ma’, ‘Me’, ‘Gi’, ‘Ve’, ‘Sa’];
const allData = await window.RahmaDB.getAllPrayers();

for (let i = 6; i >= 0; i–) {
const d = new Date(now);
d.setDate(now.getDate() - i);
const key = `rahma_p_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
const pd = allData[key] || {};
const cnt = PRAYERS_DEF.filter(p => pd[p.id]).length;
const pct = (cnt / 5) * 100;

```
const col = document.createElement('div');
col.className = 'wd-col' + (i === 0 ? ' today' : '');
col.innerHTML = `
  <div class="wd-name">${names[d.getDay()]}</div>
  <div class="wd-bar-wrap"><div class="wd-bar-fill" style="height:${pct}%"></div></div>
  <div class="wd-count">${cnt}</div>
`;
strip.appendChild(col);
```

}
}

async function renderStats() {
const now = new Date();
const today = now.getDate();
let total = 0, perfect = 0;
const allData = await window.RahmaDB.getAllPrayers();

for (let d = 1; d <= today; d++) {
const key = `rahma_p_${now.getFullYear()}_${now.getMonth()}_${d}`;
const pd = allData[key] || {};
const cnt = PRAYERS_DEF.filter(p => pd[p.id]).length;
total += cnt;
if (cnt === 5) perfect++;
}
const pct = today > 0 ? Math.round((total / (today * 5)) * 100) : 0;
document.getElementById(‘statsRow’).innerHTML = `<div class="stat-pill"><div class="sp-val">${pct}%</div><div class="sp-lbl">Completamento</div></div> <div class="stat-pill"><div class="sp-val">${perfect}</div><div class="sp-lbl">Giorni perfetti</div></div> <div class="stat-pill"><div class="sp-val">${total}</div><div class="sp-lbl">Preghiere totali</div></div> <div class="stat-pill"><div class="sp-val">${today}</div><div class="sp-lbl">Giorni tracciati</div></div>`;
}

/* ─────────────────────────────────────────────────────
TASBIH
───────────────────────────────────────────────────── */
let dkIdx = 0, dkCount = 0, dkSession = 0, dkHistory = [];
const CIRC_T = 2 * Math.PI * 115;

function initTasbih() {
const selector = document.getElementById(‘dhikrSelector’);
DHIKR.forEach((d, i) => {
const chip = document.createElement(‘button’);
chip.className = ‘dk-chip’ + (i === 0 ? ’ active’ : ‘’);
chip.dataset.i = i;
chip.innerHTML = `<span>${d.translit}</span>`;
chip.setAttribute(‘aria-label’, d.translit);
selector.appendChild(chip);
});

selector.addEventListener(‘click’, async e => {
const chip = e.target.closest(’.dk-chip’);
if (!chip) return;
const idx = parseInt(chip.dataset.i, 10);
if (idx === dkIdx) return;
await window.RahmaDB.saveTasbihData(dkIdx, dkCount, dkSession, dkHistory);
dkIdx = idx;
const saved = await window.RahmaDB.getTasbihData(dkIdx);
dkCount = saved.count;
dkSession = saved.session;
dkHistory = saved.history;
document.querySelectorAll(’.dk-chip’).forEach(c => c.classList.remove(‘active’));
chip.classList.add(‘active’);
updateTasbihDisplay();
});

document.getElementById(‘tasbihBtn’).addEventListener(‘click’, incrementDk);
document.getElementById(‘tasbihUndo’).addEventListener(‘click’, undoDk);
document.getElementById(‘tasbihReset’).addEventListener(‘click’, resetDk);
document.getElementById(‘tasbihClear’).addEventListener(‘click’, clearDk);

window.RahmaDB.getTasbihData(dkIdx).then(saved => {
dkCount = saved.count;
dkSession = saved.session;
dkHistory = saved.history;
updateTasbihDisplay();
});
}

function updateTasbihDisplay() {
const d = DHIKR[dkIdx];
document.getElementById(‘tasbihAr’).textContent = d.ar;
document.getElementById(‘tasbihTranslit’).textContent = d.translit;
document.getElementById(‘tasbihMeaning’).textContent = d.meaning;
document.getElementById(‘tasbihCount’).textContent = dkCount;
document.getElementById(‘tasbihSession’).textContent = dkSession;
document.getElementById(‘tasbihTargetLabel’).textContent = `Obiettivo: ${d.target} volte`;
document.getElementById(‘tasbihFg’).style.stroke = d.color;
document.getElementById(‘tasbihFg’).style.filter = `drop-shadow(0 0 5px ${d.color})`;
document.getElementById(‘tasbihFg’).style.strokeDashoffset = CIRC_T * (1 - dkCount / d.target);
}

async function incrementDk() {
const d = DHIKR[dkIdx];
dkHistory.push(dkCount);
if (dkCount < d.target) { dkCount++; dkSession++; }
updateTasbihDisplay();
if (navigator.vibrate) navigator.vibrate(8);
if (dkCount === d.target) showFlash();
await window.RahmaDB.saveTasbihData(dkIdx, dkCount, dkSession, dkHistory);
}

async function undoDk() {
if (dkHistory.length) {
const prev = dkHistory.pop();
if (dkCount > prev) dkSession = Math.max(0, dkSession - 1);
dkCount = prev;
updateTasbihDisplay();
await window.RahmaDB.saveTasbihData(dkIdx, dkCount, dkSession, dkHistory);
}
}

async function resetDk() { dkHistory = []; dkCount = 0; updateTasbihDisplay(); await window.RahmaDB.saveTasbihData(dkIdx, dkCount, dkSession, dkHistory); }
async function clearDk()  { dkHistory = []; dkCount = 0; dkSession = 0; updateTasbihDisplay(); await window.RahmaDB.saveTasbihData(dkIdx, dkCount, dkSession, dkHistory); }

function showFlash() {
const flash = document.getElementById(‘cycleFlash’);
document.getElementById(‘flashCount’).textContent = `${DHIKR[dkIdx].translit} — ${DHIKR[dkIdx].target}×`;
flash.classList.remove(‘hidden’);
setTimeout(() => { flash.classList.add(‘hidden’); resetDk(); }, 2000);
}

initTasbih();

/* ─────────────────────────────────────────────────────
AI HALAL
───────────────────────────────────────────────────── */
let aiKey = localStorage.getItem(‘rahma_ai_key’) || ‘’;
if (aiKey) document.getElementById(‘aiKeyInput’).value = ‘••••••••••••••’;

document.getElementById(‘aiKeySave’).addEventListener(‘click’, () => {
const v = document.getElementById(‘aiKeyInput’).value.trim();
if (v && !v.includes(’•’)) {
aiKey = v;
localStorage.setItem(‘rahma_ai_key’, v);
document.getElementById(‘aiKeyInput’).value = ‘••••••••••••••’;
addMsg(‘bot’, ‘<p>🔑 Chiave API salvata! Ora rispondo con intelligenza artificiale Gemini.</p>’);
}
});

function addMsg(role, html) {
const feed = document.getElementById(‘chatFeed’);
const div  = document.createElement(‘div’);
div.className = `chat-msg ${role}`;
const avatar = role === ‘bot’
? `<div class="msg-avatar bot-av">R</div>`
: `<div class="msg-avatar user-av">👤</div>`;
div.innerHTML = `${avatar}<div class="msg-bubble">${html}</div>`;
feed.appendChild(div);
feed.scrollTop = feed.scrollHeight;
return div;
}

function addThinking() {
const feed = document.getElementById(‘chatFeed’);
const div  = document.createElement(‘div’);
div.className = ‘chat-msg bot’;
div.id = ‘rahma-thinking’;
div.innerHTML = `<div class="msg-avatar bot-av">R</div><div class="msg-bubble"><div class="thinking"><span></span><span></span><span></span></div></div>`;
feed.appendChild(div);
feed.scrollTop = feed.scrollHeight;
return div;
}

function formatAnswer(text) {
return text
.replace(/**(.*?)**/g, ‘<strong>$1</strong>’)
.replace(/\n\n/g, ‘</p><p>’)
.replace(/\n\u2022/g, ‘<br>•’)
.replace(/\n/g, ‘<br>’);
}

function simulateAnswer(q) {
const ql = q.toLowerCase();
for (const [k, v] of Object.entries(AI_KB)) {
if (ql.includes(k)) return `<p>${formatAnswer(v)}</p>`;
}
return `<p>Ottima domanda su <em>"${q}"</em>.</p> <p>Per una risposta AI personalizzata inserisci la tua <strong>Gemini API Key</strong> nella barra sopra.</p> <p>Principi generali islamici:<br> • <strong>Dubbio:</strong> applica la precauzione (ihtiyat) — meglio evitare<br> • <strong>Necessità:</strong> la darura può rendere permesso ciò che è normalmente vietato<br> • <strong>Importante:</strong> consulta uno studioso qualificato</p>`;
}

async function sendChat(q) {
if (!q.trim()) return;
document.getElementById(‘quickQs’).style.display = ‘none’;
addMsg(‘user’, `<p>${q}</p>`);
const thinking = addThinking();

try {
let html;
if (aiKey) {
const sys = `Sei Rahma, un assistente AI islamico in italiano. Rispondi su halal/haram, fiqh, vita quotidiana islamica, finanza islamica. Usa Corano e Hadith autentici. Max 250 parole. Usa • per elenchi. Alla fine: "Consulta uno studioso per questioni importanti."`;
const res = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${aiKey}`,
{
method: ‘POST’,
headers: { ‘Content-Type’: ‘application/json’ },
body: JSON.stringify({
contents: [{ parts: [{ text: `${sys}\n\nDomanda: ${q}` }] }],
generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
})
}
);
if (!res.ok) throw new Error(’HTTP ’ + res.status);
const data = await res.json();
html = `<p>${formatAnswer(data.candidates?.[0]?.content?.parts?.[0]?.text || '')}</p>`;
} else {
await new Promise(r => setTimeout(r, 900 + Math.random() * 700));
html = simulateAnswer(q);
}
thinking.remove();
addMsg(‘bot’, html);
} catch (err) {
thinking.remove();
addMsg(‘bot’, `<p>⚠️ Errore: ${err.message}. Controlla la API Key o la connessione.</p>`);
}
}

function quickAsk(btn) { sendChat(btn.textContent); }

const chatInput = document.getElementById(‘chatInput’);
document.getElementById(‘chatSend’).addEventListener(‘click’, () => {
const v = chatInput.value; chatInput.value = ‘’; chatInput.style.height = ‘auto’; sendChat(v);
});
chatInput.addEventListener(‘keydown’, e => {
if (e.key === ‘Enter’ && !e.shiftKey) { e.preventDefault(); const v = chatInput.value; chatInput.value = ‘’; chatInput.style.height = ‘auto’; sendChat(v); }
});
chatInput.addEventListener(‘input’, () => {
chatInput.style.height = ‘auto’;
chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + ‘px’;
});

/* ─────────────────────────────────────────────────────
NEW MUSLIMS — JOURNEY
───────────────────────────────────────────────────── */
let journeyReady = false;

function initJourney() {
if (typeof JOURNEY === ‘undefined’ || typeof GLOSSARY === ‘undefined’) {
const nav = document.getElementById(‘journeyNav’);
if (nav) nav.innerHTML = ‘<div style="padding:20px;color:var(--text3);font-size:13px;">⚠️ Errore caricamento contenuti. Ricarica la pagina.</div>’;
return;
}

journeyReady = true;
const nav     = document.getElementById(‘journeyNav’);
const content = document.getElementById(‘journeyContent’);
nav.innerHTML = ‘’;
content.innerHTML = ‘’;

JOURNEY.forEach((j, i) => {
const tab = document.createElement(‘div’);
tab.className = ‘jn-tab’ + (i === 0 ? ’ active’ : ‘’);
tab.dataset.i = i;
tab.innerHTML = `<div class="jn-emo">${j.emoji}</div><div class="jn-lbl">${j.label}</div>`;
nav.appendChild(tab);
});

JOURNEY.forEach((j, i) => {
const panel = document.createElement(‘div’);
panel.className = ‘jc-panel’ + (i === 0 ? ’ active’ : ‘’);
panel.id = `jp-${i}`;
panel.innerHTML = j.html;
content.appendChild(panel);
});

nav.addEventListener(‘click’, e => {
const tab = e.target.closest(’.jn-tab’);
if (!tab) return;
const idx = parseInt(tab.dataset.i, 10);
document.querySelectorAll(’.jn-tab’).forEach(t => t.classList.remove(‘active’));
document.querySelectorAll(’.jc-panel’).forEach(p => p.classList.remove(‘active’));
tab.classList.add(‘active’);
document.getElementById(`jp-${idx}`).classList.add(‘active’);
});

const gc = document.getElementById(‘glossaryChips’);
gc.innerHTML = ‘’;
GLOSSARY.forEach(({ t, d }) => {
const chip = document.createElement(‘div’);
chip.className = ‘glo-chip’;
chip.innerHTML = `<div class="glo-term">${t}</div><div class="glo-def">${d}</div>`;
gc.appendChild(chip);
});
}

/* ─────────────────────────────────────────────────────
PRIVACY MODAL
───────────────────────────────────────────────────── */
const privacyModal    = document.getElementById(‘privacyModal’);
const openPrivacyBtn  = document.getElementById(‘openPrivacyBtn’);
const closePrivacyBtn = document.getElementById(‘closePrivacyBtn’);

if (openPrivacyBtn && closePrivacyBtn && privacyModal) {
openPrivacyBtn.addEventListener(‘click’, () => {
privacyModal.classList.remove(‘hidden’);
privacyModal.setAttribute(‘aria-hidden’, ‘false’);
});
const closeModal = () => {
privacyModal.classList.add(‘hidden’);
privacyModal.setAttribute(‘aria-hidden’, ‘true’);
};
closePrivacyBtn.addEventListener(‘click’, closeModal);
privacyModal.addEventListener(‘click’, e => { if (e.target === privacyModal) closeModal(); });
}

/* ─────────────────────────────────────────────────────
BOOT
───────────────────────────────────────────────────── */
showPage(‘quran’);
