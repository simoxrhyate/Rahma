/* ============================================================
   RAHMA APP — content.js
   All static data: Dhikr, New Muslims topics, Glossary
   ============================================================ */

const SURAH_AR = ['الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه','الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم','لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر','فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق','الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة','الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج','نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس','التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد','الشمس','الليل','الضحى','الشرح','العلق','القدر','البينة','الزلزلة','العاديات','القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر','المسد','الإخلاص','الفلق','الناس'];

const SURAH_IT = ["L'Aprente","La Vacca","La Famiglia di Imran","Le Donne","La Tavola Imbandita","Il Bestiame","Il Luogo Elevato","Il Bottino","La Penitenza","Giona","Hud","Giuseppe","Il Tuono","Ibrahim","Al-Hijr","Le Api","Il Viaggio Notturno","La Caverna","Maria","Ta-Ha","I Profeti","Il Pellegrinaggio","I Credenti","La Luce","Il Criterio","I Poeti","Le Formiche","Il Racconto","Il Ragno","I Romani","Luqman","La Prostrazione","I Coalizzati","Saba","Il Creatore","Ya-Sin","Le File","Sad","Le Folle","Il Perdono","Fussilat","La Consultazione","L'Ornamento","Il Fumo","La Prostrante","Al-Ahqaf","Muhammad","La Vittoria","Le Stanze Private","Qaf","I Venti","Il Monte","La Stella","La Luna","Il Misericordioso","L'Evento","Il Ferro","La Discussione","L'Esodo","La Messa in Fila","Il Venerdì","Gli Ipocriti","La Lesione Reciproca","Il Divorzio","Il Divieto","Il Dominio","La Penna","Il Grande Evento","I Luoghi Elevati","Nuh","Al-Jinn","Il Mantello","Il Vestito","La Resurrezione","L'Uomo","Gli Inviati","La Notizia","Coloro Che Strappano","Si Acciglió","Il Ravvolgimento","La Rottura","I Frodatori","L'Apertura","Il Cielo delle Costellazioni","Il Visitatore Notturno","Il Più Alto","L'Avvolgente","L'Aurora","Quella Città","Il Sole","La Notte","Le Ore Mattutine","La Quiete","Il Clot","Il Destino","La Chiara Prova","Il Terremoto","Le Cavalcate","Il Colpo Fragoroso","La Competizione","Il Pomeriggio","Il Calunniatore","L'Elefante","I Quraysh","Le Cose Utili","L'Abbondanza","I Miscredenti","L'Aiuto Divino","Le Fibre","Il Culto Puro","L'Alba","Gli Uomini"];

const SURAH_META = [{v:7,c:'Mecca'},{v:286,c:'Medina'},{v:200,c:'Medina'},{v:176,c:'Medina'},{v:120,c:'Medina'},{v:165,c:'Mecca'},{v:206,c:'Mecca'},{v:75,c:'Medina'},{v:129,c:'Medina'},{v:109,c:'Mecca'},{v:123,c:'Mecca'},{v:111,c:'Mecca'},{v:43,c:'Medina'},{v:52,c:'Mecca'},{v:99,c:'Mecca'},{v:128,c:'Mecca'},{v:111,c:'Mecca'},{v:110,c:'Mecca'},{v:98,c:'Mecca'},{v:135,c:'Mecca'},{v:112,c:'Mecca'},{v:78,c:'Medina'},{v:118,c:'Mecca'},{v:64,c:'Medina'},{v:77,c:'Mecca'},{v:227,c:'Mecca'},{v:93,c:'Mecca'},{v:88,c:'Mecca'},{v:69,c:'Mecca'},{v:60,c:'Medina'},{v:34,c:'Mecca'},{v:30,c:'Medina'},{v:73,c:'Medina'},{v:54,c:'Mecca'},{v:45,c:'Mecca'},{v:83,c:'Mecca'},{v:182,c:'Medina'},{v:88,c:'Mecca'},{v:75,c:'Mecca'},{v:85,c:'Mecca'},{v:54,c:'Mecca'},{v:53,c:'Mecca'},{v:89,c:'Mecca'},{v:59,c:'Mecca'},{v:37,c:'Mecca'},{v:35,c:'Mecca'},{v:38,c:'Medina'},{v:29,c:'Medina'},{v:18,c:'Medina'},{v:45,c:'Mecca'},{v:30,c:'Mecca'},{v:49,c:'Mecca'},{v:62,c:'Mecca'},{v:55,c:'Mecca'},{v:78,c:'Medina'},{v:96,c:'Medina'},{v:29,c:'Medina'},{v:22,c:'Medina'},{v:24,c:'Medina'},{v:13,c:'Medina'},{v:11,c:'Medina'},{v:18,c:'Medina'},{v:12,c:'Medina'},{v:12,c:'Medina'},{v:30,c:'Mecca'},{v:52,c:'Mecca'},{v:30,c:'Mecca'},{v:44,c:'Mecca'},{v:28,c:'Mecca'},{v:28,c:'Mecca'},{v:20,c:'Mecca'},{v:20,c:'Mecca'},{v:40,c:'Mecca'},{v:31,c:'Medina'},{v:50,c:'Mecca'},{v:46,c:'Mecca'},{v:29,c:'Mecca'},{v:25,c:'Mecca'},{v:17,c:'Mecca'},{v:11,c:'Mecca'},{v:29,c:'Mecca'},{v:36,c:'Mecca'},{v:17,c:'Mecca'},{v:19,c:'Mecca'},{v:26,c:'Mecca'},{v:30,c:'Mecca'},{v:20,c:'Mecca'},{v:15,c:'Mecca'},{v:8,c:'Mecca'},{v:11,c:'Mecca'},{v:5,c:'Mecca'},{v:4,c:'Mecca'},{v:19,c:'Medina'},{v:5,c:'Mecca'},{v:8,c:'Mecca'},{v:8,c:'Mecca'},{v:11,c:'Mecca'},{v:3,c:'Medina'},{v:5,c:'Mecca'},{v:4,c:'Mecca'},{v:6,c:'Mecca'},{v:3,c:'Medina'},{v:5,c:'Mecca'},{v:4,c:'Mecca'},{v:6,c:'Mecca'},{v:6,c:'Mecca'},{v:6,c:'Mecca'}];

/* ─── Dhikr list ─── */
const DHIKR = [
  {
    ar: 'سُبْحَانَ اللَّهِ',
    translit: 'Subhana Allah',
    meaning: 'Gloria a Dio nella Sua perfezione',
    target: 33,
    color: '#818cf8'
  },
  {
    ar: 'الْحَمْدُ لِلَّهِ',
    translit: 'Alhamdulillah',
    meaning: 'Tutta la lode appartiene ad Allah',
    target: 33,
    color: '#f59e0b'
  },
  {
    ar: 'اللَّهُ أَكْبَرُ',
    translit: 'Allahu Akbar',
    meaning: 'Allah è il più Grande',
    target: 34,
    color: '#a78bfa'
  },
  {
    ar: 'لَا إِلَهَ إِلَّا اللَّهُ',
    translit: 'La ilaha illa Allah',
    meaning: 'Non c\'è divinità tranne Allah',
    target: 100,
    color: '#34d399'
  },
  {
    ar: 'أَسْتَغْفِرُ اللَّهَ',
    translit: 'Astaghfirullah',
    meaning: 'Chiedo perdono ad Allah',
    target: 100,
    color: '#f472b6'
  }
];

/* ─── New Muslims journey topics ─── */
const JOURNEY = [
  {
    id: 'shahada',
    emoji: '☪',
    label: 'Shahada',
    html: `
      <div class="jc-arabic">أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ</div>
      <div class="jc-translit">Ashhadu an la ilaha illa Allah wa anna Muhammadan rasulullah</div>
      <p class="jc-text"><strong style="color:#f8fafc">"Testimonio che non c'è divinità tranne Allah, e che Muhammad è il Suo messaggero."</strong></p>
      <p class="jc-text">La Shahada è il primo pilastro dell'Islam e la porta d'ingresso alla fede. Pronunciarla con sincerità di cuore — davanti a testimoni se possibile — è sufficiente per abbracciare l'Islam.</p>
      <div class="steps-list">
        <div class="step-item"><span class="step-n">1</span><span class="step-text">Comprendi il significato profondo di ogni parola</span></div>
        <div class="step-item"><span class="step-n">2</span><span class="step-text">Esprimi l'intenzione nel tuo cuore (niyyah)</span></div>
        <div class="step-item"><span class="step-n">3</span><span class="step-text">Recitala preferibilmente di fronte a dei testimoni musulmani</span></div>
        <div class="step-item"><span class="step-n">4</span><span class="step-text">Fai il ghusl (bagno di purificazione rituale)</span></div>
        <div class="step-item"><span class="step-n">5</span><span class="step-text">Inizia a imparare le preghiere quotidiane</span></div>
      </div>
    `
  },
  {
    id: 'pillars',
    emoji: '🕌',
    label: '5 Pilastri',
    html: `
      <p class="jc-text">I cinque pilastri dell'Islam (Arkan al-Islam) sono le fondamenta della vita islamica.</p>
      <div class="pillar-block"><span class="pillar-n">1</span><div><div class="pillar-title">Shahada — الشهادة</div><div class="pillar-desc">La testimonianza dell'unicità di Allah e del messaggio di Muhammad ﷺ</div></div></div>
      <div class="pillar-block"><span class="pillar-n">2</span><div><div class="pillar-title">Salah — الصلاة</div><div class="pillar-desc">Le 5 preghiere quotidiane: Fajr, Dhuhr, Asr, Maghrib, Isha</div></div></div>
      <div class="pillar-block"><span class="pillar-n">3</span><div><div class="pillar-title">Zakat — الزكاة</div><div class="pillar-desc">L'elemosina obbligatoria: 2,5% del patrimonio annuale ai bisognosi</div></div></div>
      <div class="pillar-block"><span class="pillar-n">4</span><div><div class="pillar-title">Sawm — الصوم</div><div class="pillar-desc">Il digiuno nel mese di Ramadan, dall'alba al tramonto</div></div></div>
      <div class="pillar-block"><span class="pillar-n">5</span><div><div class="pillar-title">Hajj — الحج</div><div class="pillar-desc">Il pellegrinaggio alla Mecca, obbligatorio almeno once nella vita per chi può</div></div></div>
    `
  },
  {
    id: 'wudu',
    emoji: '💧',
    label: 'Wudu',
    html: `
      <p class="jc-text">Il <strong style="color:#f8fafc">Wudu (وضوء)</strong> è la purificazione rituale obbligatoria prima della preghiera, eseguita con acqua pulita.</p>
      <div class="steps-list">
        <div class="step-item"><span class="step-n">1</span><span class="step-text">Esprimi l'intenzione nel cuore (niyyah) e di' "Bismillah"</span></div>
        <div class="step-item"><span class="step-n">2</span><span class="step-text">Lavati le mani 3 volte fino ai polsi</span></div>
        <div class="step-item"><span class="step-n">3</span><span class="step-text">Risciacqua la bocca 3 volte</span></div>
        <div class="step-item"><span class="step-n">4</span><span class="step-text">Aspira acqua nelle narici e soffla 3 volte</span></div>
        <div class="step-item"><span class="step-n">5</span><span class="step-text">Lavati il viso 3 volte (dalla fronte al mento, da orecchio a orecchio)</span></div>
        <div class="step-item"><span class="step-n">6</span><span class="step-text">Lavati il braccio destro fino al gomito 3×, poi il sinistro</span></div>
        <div class="step-item"><span class="step-n">7</span><span class="step-text">Bagna le mani e passale sulla testa una volta</span></div>
        <div class="step-item"><span class="step-n">8</span><span class="step-text">Pulisci le orecchie con pollice e indice</span></div>
        <div class="step-item"><span class="step-n">9</span><span class="step-text">Lavati il piede destro fino alla caviglia 3×, poi il sinistro</span></div>
      </div>
      <div class="info-callout">⚠️ Il wudu si annulla con: andare in bagno, flatulenza, sonno profondo, perdita di coscienza, rapporti coniugali.</div>
    `
  },
  {
    id: 'prayer',
    emoji: '🙏',
    label: 'Preghiera',
    html: `
      <p class="jc-text">La Salah è il secondo pilastro. Si esegue 5 volte al giorno rivolti verso la Mecca (Qibla).</p>
      <div class="steps-list">
        <div class="step-item"><span class="step-n">1</span><span class="step-text"><strong>Niyyah</strong> — Esprimi l'intenzione nella mente</span></div>
        <div class="step-item"><span class="step-n">2</span><span class="step-text"><strong>Takbir al-Ihram</strong> — Alza le mani, di' "Allahu Akbar"</span></div>
        <div class="step-item"><span class="step-n">3</span><span class="step-text"><strong>Qiyam</strong> — In piedi: recita Al-Fatiha + sura</span></div>
        <div class="step-item"><span class="step-n">4</span><span class="step-text"><strong>Ruku</strong> — Inchino con schiena orizzontale (3× "Subhana Rabbiya al-Azim")</span></div>
        <div class="step-item"><span class="step-n">5</span><span class="step-text"><strong>I'tidal</strong> — Rialzati dicendo "Sami' Allahu liman hamidah"</span></div>
        <div class="step-item"><span class="step-n">6</span><span class="step-text"><strong>Sujud</strong> — Prostrazioni con fronte a terra (3× "Subhana Rabbiya al-A'la")</span></div>
        <div class="step-item"><span class="step-n">7</span><span class="step-text"><strong>Tashahhud</strong> — Testimonianza seduto nell'ultimo rak'at</span></div>
        <div class="step-item"><span class="step-n">8</span><span class="step-text"><strong>Taslim</strong> — "As-Salamu Alaikum" a destra e sinistra</span></div>
      </div>
      <div class="ракат-table">
        <div class="ракат-row head"><span>Preghiera</span><span>Rak'at</span><span>Orario</span></div>
        <div class="ракат-row"><span>Fajr</span><span>2</span><span>Alba</span></div>
        <div class="ракат-row"><span>Dhuhr</span><span>4</span><span>Mezzogiorno</span></div>
        <div class="ракат-row"><span>Asr</span><span>4</span><span>Pomeriggio</span></div>
        <div class="ракат-row"><span>Maghrib</span><span>3</span><span>Tramonto</span></div>
        <div class="ракат-row"><span>Isha</span><span>4</span><span>Notte</span></div>
      </div>
    `
  },
  {
    id: 'iman',
    emoji: '✨',
    label: '6 Pilastri Fede',
    html: `
      <p class="jc-text">I sei pilastri della fede (Arkan al-Iman) sono ciò in cui ogni musulmano deve credere nel cuore.</p>
      <div class="pillar-block"><span class="pillar-n">1</span><div><div class="pillar-title">Fede in Allah</div><div class="pillar-desc">Tawhid: un solo Dio, senza soci né figli</div></div></div>
      <div class="pillar-block"><span class="pillar-n">2</span><div><div class="pillar-title">Fede negli Angeli</div><div class="pillar-desc">Creature di luce create per adorare Allah ed eseguire i Suoi ordini</div></div></div>
      <div class="pillar-block"><span class="pillar-n">3</span><div><div class="pillar-title">Fede nei Libri Sacri</div><div class="pillar-desc">Torah, Salmi, Vangelo e il Corano (definitivo e preservato)</div></div></div>
      <div class="pillar-block"><span class="pillar-n">4</span><div><div class="pillar-title">Fede nei Profeti</div><div class="pillar-desc">Da Adamo a Muhammad ﷺ, il sigillo dei profeti</div></div></div>
      <div class="pillar-block"><span class="pillar-n">5</span><div><div class="pillar-title">Fede nel Giorno del Giudizio</div><div class="pillar-desc">Yawm al-Qiyama: ogni persona sarà giudicata per le sue azioni</div></div></div>
      <div class="pillar-block"><span class="pillar-n">6</span><div><div class="pillar-title">Fede nel Destino (Qadar)</div><div class="pillar-desc">Tutto avviene nella conoscenza di Allah; l'uomo ha libertà di scelta</div></div></div>
    `
  },
  {
    id: 'halalharam',
    emoji: '⚖️',
    label: 'Halal & Haram',
    html: `
      <p class="jc-text">Conoscere il lecito (halal) e il proibito (haram) è fondamentale nella vita quotidiana del musulmano.</p>
      <div class="hh-split">
        <div class="hh-col hh-halal">
          <h4>✅ HALAL</h4>
          <ul>
            <li>Carne bovina, ovina, pollame — halal-macellata</li>
            <li>Pesce e frutti di mare</li>
            <li>Frutta, verdura, cereali</li>
            <li>Latte, uova, miele</li>
            <li>Carne kosher (per molti studiosi)</li>
          </ul>
        </div>
        <div class="hh-col hh-haram">
          <h4>❌ HARAM</h4>
          <ul>
            <li>Maiale e derivati</li>
            <li>Alcol e sostanze inebrianti</li>
            <li>Carne morta (mayta)</li>
            <li>Sangue e suoi derivati</li>
            <li>Animali senza rito islamico</li>
          </ul>
        </div>
      </div>
      <div class="info-callout">💡 <strong>Additivi da verificare:</strong> E120 (cocciniglia), E441 (gelatina), E471 (mono/digliceridi) potrebbero essere di origine animale. Cerca sempre la certificazione halal.</div>
    `
  }
];

const GLOSSARY = [
  {t:'Allah', d:'Il nome proprio di Dio in arabo'},
  {t:'Islam', d:'Sottomissione a Dio; pace'},
  {t:'Muslim', d:'Chi si sottomette ad Allah'},
  {t:'Quran', d:'La parola rivelata di Allah'},
  {t:'Hadith', d:'Detti e azioni del Profeta ﷺ'},
  {t:'Sunnah', d:'Stile di vita del Profeta ﷺ'},
  {t:'Halal', d:'Ciò che è lecito islamicamente'},
  {t:'Haram', d:'Ciò che è proibito islamicamente'},
  {t:'Makruh', d:'Scoraggiato ma non proibito'},
  {t:'Niyyah', d:'Intenzione prima di un atto'},
  {t:'Rak\'at', d:'Unità di preghiera'},
  {t:'Masjid', d:'Moschea, luogo di preghiera'},
  {t:'Imam', d:'Guida spirituale o della preghiera'},
  {t:'Du\'a', d:'Supplica personale ad Allah'},
  {t:'Dhikr', d:'Formule di ricordo di Allah'},
  {t:'Ummah', d:'La comunità globale islamica'},
  {t:'Jannah', d:'Il Paradiso eterno'},
  {t:'Tawbah', d:'Il pentimento verso Allah'},
  {t:'Ramadan', d:'Mese del digiuno islamico'},
  {t:'Eid', d:'Festività islamiche'},
  {t:'Qibla', d:'Direzione della Mecca'},
  {t:'Fiqh', d:'Giurisprudenza islamica'},
  {t:'Tawhid', d:'Unicità assoluta di Allah'},
  {t:'Wudu', d:'Purificazione rituale pre-preghiera'},
];

/* ─── AI Halal knowledge base ─── */
const AI_KB = {
  'gelatina': `La **gelatina** è spesso di origine suina (maiale) → di norma **Haram** ❌\n\nAlternative halal:\n• **Agar-agar** — da alghe, 100% halal ✅\n• **Pectina** — da frutta, halal ✅\n• **Gelatina bovina halal** — cerca la certificazione 🟢\n\nControlla sempre l'etichetta: "gelatina (suina/bovina)".`,
  'kosher': `La carne **kosher** ebraica:\n\n• **Maggioranza degli studiosi:** Permessa, gli ebrei sono Ahl al-Kitab (Corano 5:5) ✅\n• **Minoranza:** Non permessa perché manca la menzione esplicita del nome di Allah\n\nConsulta uno studioso per la tua decisione personale.`,
  'e471': `**E471 — Mono e digliceridi degli acidi grassi**\n\nPuò essere:\n• **Vegetale** (soia, palma) → Halal ✅\n• **Animale suino** → Haram ❌\n• **Animale bovino non-halal** → Haram ❌\n\nL'etichetta spesso non specifica. Se non certificato halal, preferisci evitarlo o contatta il produttore.`,
  'mutuo': `Il mutuo bancario tradizionale contiene **riba** (usura/interesse) → **Haram** ❌ (Corano 2:275)\n\nAlternative islamiche:\n• **Murabaha** — la banca compra e rivende a prezzo fisso maggiorato\n• **Ijara** — affitto con piano di riacquisto\n• **Musharaka** — comproprietà decrescente\n\nIn Italia esistono istituti che offrono prodotti finanziari islamici.`,
  'alcol': `L'alcol è **Haram** ❌ in modo categorico nel Corano (5:90):\n• Birra, vino, superalcolici\n• Prodotti con alcol visibile (>0,5%)\n\nNota: l'alcol usato come solvente in aromi alimentari è dibattuto; per precauzione è meglio evitarlo.`,
  'maiale': `Il maiale è **Haram** ❌ categoricamente (Corano 2:173, 5:3, 6:145, 16:115):\n• Carne, pancetta, prosciutto, salame, würstel\n• Strutto e lardo\n• Gelatina suina (E441)\n• Grassi suini (alcuni E471)\n\nIn Italia: controlla sempre ingredienti di insaccati e prodotti trasformati.`,
};
