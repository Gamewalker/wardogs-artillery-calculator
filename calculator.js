const languageSelect = document.getElementById('languageSelect');
const languageLabel = document.getElementById('languageLabel');

const gunXInput = document.getElementById('gunX');
const gunYInput = document.getElementById('gunY');
const targetXInput = document.getElementById('targetX');
const targetYInput = document.getElementById('targetY');

const distanceKmEl = document.getElementById('distanceKm');
const rangeMessageEl = document.getElementById('rangeMessage');

const pasteGunBtn = document.getElementById('pasteGunBtn');
const pasteTargetBtn = document.getElementById('pasteTargetBtn');
const resetBtn = document.getElementById('resetBtn');

const heroDescriptionEl = document.getElementById('heroDescription');
const repoLink = document.getElementById('repoLink');
const videoLink = document.getElementById('videoLink');

const DEFAULT_LANGUAGE = 'en';

let currentLanguage = DEFAULT_LANGUAGE;

const I18N = {
  en: {
    languageLabel: 'Language',
    eyebrow: 'Wardogs artillery calculator',
    appTitle: 'Artillery Distance Calculator',
    metaDescription:
      'Static distance calculator for WARDOGS coordinates.',
    heroDescription:
      'Copy two game positions and get distance instantly. The game itself uses distance for fire calculation.',
    sectionPoints: '1) Points',
    sectionResult: '2) Result',
    sectionNotes: '3) Notes',
    copyHint:
      'In-game copy-paste format: <code>x98.43, y110.38</code>&nbsp;or&nbsp;<code>x: 98.43, y: 110.38</code>',
    ownPositionLabel: 'Own position',
    enemyPositionLabel: 'Enemy position',
    pasteOwnBtn: 'Paste own position',
    pasteEnemyBtn: 'Paste enemy position',
    resetBtn: 'Clear all fields',
    resultDistance: 'Distance',
    statusReady: 'Enter values and result is calculated automatically.',
    statusResult: 'Distance {distance} m.',
    noteMethod:
      'The game only needs distance for fire solution. Elevation tables are intentionally not used.',
    noteUseInGame: 'Always verify with at least one correction shot in-game.',
    noteRepoLink: 'GitHub repository',
    noteVideoLink: 'Reference video source',
    inputPlaceholderOwnX: '98.43',
    inputPlaceholderOwnY: '110.38',
    inputPlaceholderTargetX: '108.90',
    inputPlaceholderTargetY: '112.50',
    statusMessages: {
      missingInputs: 'Enter valid values for own position and enemy position.',
      clipboardInvalid:
        'Clipboard does not match game format. Expected: x98.53, y109.03',
      clipboardApplied: 'Coordinates pasted from clipboard.',
      clipboardFromPaste: 'Coordinates copied into input.',
      clipboardError:
        'Clipboard could not be read. Please paste manually.',
      cleared: 'Fields cleared. Paste or enter new coordinates.',
    },
    units: {
      meters: 'm',
    },
    aria: {
      ownX: 'Own position x',
      ownY: 'Own position y',
      enemyX: 'Enemy position x',
      enemyY: 'Enemy position y',
      ownPositionLabel: 'Own position',
      enemyPositionLabel: 'Enemy position',
      languageSelect: 'Language',
      pasteOwnBtn: 'Paste own position',
      pasteEnemyBtn: 'Paste enemy position',
      clearBtn: 'Clear all fields',
    },
  },
  de: {
    languageLabel: 'Sprache',
    eyebrow: 'Wardogs Artillerie-Rechner',
    appTitle: 'Wardogs Distanz-Rechner',
    metaDescription:
      'Statische Distanzberechnung für WARDOGS Koordinaten.',
    heroDescription:
      'Kopiere zwei Spielpositionen und erhalte sofort die Distanz. Das Spiel nutzt für die Berechnung nur die Distanz.',
    sectionPoints: '1) Punkte',
    sectionResult: '2) Ergebnis',
    sectionNotes: '3) Hinweise',
    copyHint:
      'Copy-Paste-Format aus dem Spiel: <code>x98.43, y110.38</code>&nbsp;oder&nbsp;<code>x: 98.43, y: 110.38</code>',
    ownPositionLabel: 'eigene Position',
    enemyPositionLabel: 'Gegnerposition',
    pasteOwnBtn: 'eigene Position einfügen',
    pasteEnemyBtn: 'Gegnerposition einfügen',
    resetBtn: 'Alle Felder leeren',
    resultDistance: 'Entfernung',
    statusReady: 'Setze Werte ein, dann wird automatisch gerechnet.',
    statusResult: 'Entfernung {distance} m.',
    noteMethod:
      'Das Spiel braucht für den Schuss nur die Distanz. Tabellen/Elevation werden hier bewusst nicht verwendet.',
    noteUseInGame: 'Teste die Empfehlung im Spiel mindestens mit einem Korrektur-Schuss.',
    noteRepoLink: 'GitHub-Repository',
    noteVideoLink: 'Video-Hintergrund / Referenz',
    inputPlaceholderOwnX: '98.43',
    inputPlaceholderOwnY: '110.38',
    inputPlaceholderTargetX: '108.90',
    inputPlaceholderTargetY: '112.50',
    statusMessages: {
      missingInputs: 'Bitte gültige Werte für eigene und Gegnerposition eingeben.',
      clipboardInvalid:
        'Zwischenablage enthält kein Spielformat. Erwartet: x98.53, y109.03',
      clipboardApplied: 'Koordinaten aus Zwischenablage übernommen.',
      clipboardFromPaste: 'Koordinaten aus eingefügtem Text übernommen.',
      clipboardError:
        'Zwischenablage konnte nicht gelesen werden. Bitte manuell einfügen.',
      cleared:
        'Felder geleert. Neue Koordinaten einfügen oder manuell eingeben.',
    },
    units: {
      meters: 'm',
    },
    aria: {
      ownX: 'eigene Position x',
      ownY: 'eigene Position y',
      enemyX: 'Gegnerposition x',
      enemyY: 'Gegnerposition y',
      ownPositionLabel: 'eigene Position',
      enemyPositionLabel: 'Gegnerposition',
      languageSelect: 'Sprache',
      pasteOwnBtn: 'eigene Position einfügen',
      pasteEnemyBtn: 'Gegnerposition einfügen',
      clearBtn: 'Alle Felder leeren',
    },
  },
  fr: {
    languageLabel: 'Langue',
    eyebrow: 'Calculateur d’artillerie Wardogs',
    appTitle: 'Calculateur de distance d’artillerie',
    metaDescription:
      'Calcul de distance statique pour les coordonnées WARDOGS.',
    heroDescription:
      'Copiez deux positions de jeu et obtenez la distance immédiatement. Le jeu utilise seulement la distance pour le calcul.',
    sectionPoints: '1) Points',
    sectionResult: '2) Résultat',
    sectionNotes: '3) Notes',
    copyHint:
      'Format de copie du jeu : <code>x98.43, y110.38</code>&nbsp;ou&nbsp;<code>x: 98.43, y: 110.38</code>',
    ownPositionLabel: 'position propre',
    enemyPositionLabel: 'position ennemi',
    pasteOwnBtn: 'coller ma position',
    pasteEnemyBtn: 'coller position ennemie',
    resetBtn: 'Vider tous les champs',
    resultDistance: 'Distance',
    statusReady:
      'Saisissez les valeurs et le résultat est calculé automatiquement.',
    statusResult: 'Distance {distance} m.',
    noteMethod:
      'Le jeu n’a besoin que de la distance pour le calcul du tir. Les tables de hauteur ne sont pas utilisées.',
    noteUseInGame: 'Vérifiez toujours avec au moins un tir de correction dans le jeu.',
    noteRepoLink: 'Dépôt GitHub',
    noteVideoLink: 'Vidéo de référence',
    inputPlaceholderOwnX: '98.43',
    inputPlaceholderOwnY: '110.38',
    inputPlaceholderTargetX: '108.90',
    inputPlaceholderTargetY: '112.50',
    statusMessages: {
      missingInputs: 'Veuillez entrer des valeurs valides pour votre position et la position ennemie.',
      clipboardInvalid:
        'Le presse-papiers ne contient pas le format du jeu. Format attendu : x98.53, y109.03',
      clipboardApplied: 'Coordonnées collées depuis le presse-papiers.',
      clipboardFromPaste: 'Coordonnées copiées dans les champs.',
      clipboardError:
        'Le presse-papiers n’a pas pu être lu. Veuillez coller manuellement.',
      cleared:
        'Champs vides. Collez ou saisissez de nouvelles coordonnées.',
    },
    units: {
      meters: 'm',
    },
    aria: {
      ownX: 'position propre x',
      ownY: 'position propre y',
      enemyX: 'position ennemie x',
      enemyY: 'position ennemie y',
      ownPositionLabel: 'position propre',
      enemyPositionLabel: 'position ennemie',
      languageSelect: 'Langue',
      pasteOwnBtn: 'coller ma position',
      pasteEnemyBtn: 'coller position ennemie',
      clearBtn: 'Vider tous les champs',
    },
  },
  es: {
    languageLabel: 'Idioma',
    eyebrow: 'Calculadora de artillería Wardogs',
    appTitle: 'Calculadora de distancia de artillería',
    metaDescription:
      'Calculadora de distancia estática para coordenadas de WARDOGS.',
    heroDescription:
      'Copia dos posiciones del juego y obtén la distancia al instante. El juego usa solo la distancia para calcular el disparo.',
    sectionPoints: '1) Puntos',
    sectionResult: '2) Resultado',
    sectionNotes: '3) Notas',
    copyHint:
      'Formato de pegado del juego: <code>x98.43, y110.38</code>&nbsp;o&nbsp;<code>x: 98.43, y: 110.38</code>',
    ownPositionLabel: 'posición propia',
    enemyPositionLabel: 'posición enemiga',
    pasteOwnBtn: 'pegar posición propia',
    pasteEnemyBtn: 'pegar posición enemiga',
    resetBtn: 'Borrar todos los campos',
    resultDistance: 'Distancia',
    statusReady:
      'Introduce valores y el resultado se calcula automáticamente.',
    statusResult: 'Distancia {distance} m.',
    noteMethod:
      'El juego solo usa la distancia para la solución de tiro. Las tablas de elevación no se usan aquí.',
    noteUseInGame: 'Comprueba siempre con al menos un tiro de corrección en el juego.',
    noteRepoLink: 'Repositorio GitHub',
    noteVideoLink: 'Video de referencia',
    inputPlaceholderOwnX: '98.43',
    inputPlaceholderOwnY: '110.38',
    inputPlaceholderTargetX: '108.90',
    inputPlaceholderTargetY: '112.50',
    statusMessages: {
      missingInputs: 'Introduce valores válidos para tu posición y la enemiga.',
      clipboardInvalid:
        'El portapapeles no coincide con el formato del juego. Formato esperado: x98.53, y109.03',
      clipboardApplied: 'Coordenadas pegadas desde el portapapeles.',
      clipboardFromPaste: 'Coordenadas copiadas a los campos.',
      clipboardError:
        'No se pudo leer el portapapeles. Introduce manualmente.',
      cleared: 'Campos vaciados. Pega o escribe nuevas coordenadas.',
    },
    units: {
      meters: 'm',
    },
    aria: {
      ownX: 'posición propia x',
      ownY: 'posición propia y',
      enemyX: 'posición enemiga x',
      enemyY: 'posición enemiga y',
      ownPositionLabel: 'posición propia',
      enemyPositionLabel: 'posición enemiga',
      languageSelect: 'Idioma',
      pasteOwnBtn: 'pegar posición propia',
      pasteEnemyBtn: 'pegar posición enemiga',
      clearBtn: 'Borrar todos los campos',
    },
  },
  tr: {
    languageLabel: 'Dil',
    eyebrow: 'Wardogs topçu hesaplayıcı',
    appTitle: 'Topçu Mesafe Hesaplayıcı',
    metaDescription: 'WARDOGS koordinatları için mesafe hesaplayıcı.',
    heroDescription:
      'Oyundan iki konumu kopyalayıp anında mesafeyi hesapla. Oyun, atış hesabında yalnızca mesafeyi kullanır.',
    sectionPoints: '1) Noktalar',
    sectionResult: '2) Sonuç',
    sectionNotes: '3) Notlar',
    copyHint:
      'Oyundaki kopyala-yapıştır formatı: <code>x98.43, y110.38</code>&nbsp;veya&nbsp;<code>x: 98.43, y: 110.38</code>',
    ownPositionLabel: 'kendi konumun',
    enemyPositionLabel: 'düşman konumu',
    pasteOwnBtn: 'kendi konumunu yapıştır',
    pasteEnemyBtn: 'düşman konumunu yapıştır',
    resetBtn: 'Tüm alanları temizle',
    resultDistance: 'Mesafe',
    statusReady: 'Değerleri gir, sonuç otomatik hesaplanır.',
    statusResult: 'Mesafe {distance} m.',
    noteMethod:
      'Oyun atış çözümü için yalnızca mesafeyi kullanır. Yükseklik tabloları burada kullanılmaz.',
    noteUseInGame:
      'Oyunda en az bir düzeltme atışıyla sonucu doğrula.',
    noteRepoLink: 'GitHub deposu',
    noteVideoLink: 'Referans video',
    inputPlaceholderOwnX: '98.43',
    inputPlaceholderOwnY: '110.38',
    inputPlaceholderTargetX: '108.90',
    inputPlaceholderTargetY: '112.50',
    statusMessages: {
      missingInputs: 'Lütfen kendi ve düşman konumu için geçerli değerler girin.',
      clipboardInvalid:
        'Pano formatı oyunun formatıyla eşleşmiyor. Beklenen: x98.53, y109.03',
      clipboardApplied: 'Koordinatlar panodan alındı.',
      clipboardFromPaste: 'Koordinatlar ilgili alana yapıştırıldı.',
      clipboardError: 'Pano okunamadı. Lütfen manuel yapıştırın.',
      cleared: 'Alanlar temizlendi. Yeni koordinatlar girin veya yapıştırın.',
    },
    units: {
      meters: 'm',
    },
    aria: {
      ownX: 'kendi konum x',
      ownY: 'kendi konum y',
      enemyX: 'düşman x',
      enemyY: 'düşman y',
      ownPositionLabel: 'kendi konumun',
      enemyPositionLabel: 'düşman konumu',
      languageSelect: 'Dil',
      pasteOwnBtn: 'kendi konumunu yapıştır',
      pasteEnemyBtn: 'düşman konumunu yapıştır',
      clearBtn: 'Tüm alanları temizle',
    },
  },
};

function t(key, vars = {}) {
  const entry = I18N[currentLanguage] || I18N[DEFAULT_LANGUAGE];
  const value = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), entry);

  if (typeof value !== 'string') {
    return key;
  }

  return value.replace(/\{(\w+)\}/g, (_, token) =>
    Object.prototype.hasOwnProperty.call(vars, token) ? String(vars[token]) : ''
  );
}

function parseToCentimeterUnits(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const n = Number(value);
  if (!Number.isFinite(n)) {
    return null;
  }

  return Math.round(n * 100);
}

function setResult(message, isError = false) {
  rangeMessageEl.textContent = message;
  rangeMessageEl.className = `note ${isError ? 'error' : ''}`.trim();
}

function parseCoordinatePairFromText(text) {
  const normalized = String(text ?? '').replace(/\r?\n/g, ' ');
  const labeledRegex = /([xXyY])\s*[:=]?\s*(-?\d+(?:[.,]\d+)?)/g;
  const matches = [...normalized.matchAll(labeledRegex)];

  if (matches.length) {
    let x;
    let y;

    for (const match of matches) {
      const axis = match[1].toLowerCase();
      const value = Number(match[2].replace(',', '.'));
      if (!Number.isFinite(value)) {
        continue;
      }

      if (axis === 'x' && x === undefined) {
        x = value;
      } else if (axis === 'y' && y === undefined) {
        y = value;
      }

      if (x !== undefined && y !== undefined) {
        return { x, y };
      }
    }
  }

  const direct = normalized
    .match(/-?\d+(?:[.,]\d+)?/g)
    ?.map((value) => Number(value.replace(',', '.')))
    .filter(Number.isFinite) ?? [];

  if (direct.length >= 2) {
    return { x: direct[0], y: direct[1] };
  }

  return null;
}

function safeGetStoredLanguage() {
  try {
    return localStorage.getItem('wardogs_language');
  } catch (_error) {
    return null;
  }
}

function safeSetStoredLanguage(value) {
  try {
    localStorage.setItem('wardogs_language', value);
  } catch (_error) {
    // localStorage can be unavailable in some privacy contexts.
  }
}

function setPointFromParsed(parsed, forTarget) {
  if (forTarget) {
    targetXInput.value = String(parsed.x);
    targetYInput.value = String(parsed.y);
  } else {
    gunXInput.value = String(parsed.x);
    gunYInput.value = String(parsed.y);
  }
}

async function pasteCoordinates(forTarget) {
  try {
    const text = await navigator.clipboard.readText();
    const parsed = parseCoordinatePairFromText(text);

    if (!parsed) {
      setResult(t('statusMessages.clipboardInvalid'), true);
      return;
    }

    setPointFromParsed(parsed, forTarget);
    calculate();
    setResult(t('statusMessages.clipboardApplied'));
  } catch (_error) {
    setResult(t('statusMessages.clipboardError'), true);
  }
}

function attachPasteToInputPair(xInput, yInput) {
  [xInput, yInput].forEach((input) => {
    input.addEventListener('paste', (event) => {
      const text = event.clipboardData?.getData('text');
      if (!text) {
        return;
      }

      const parsed = parseCoordinatePairFromText(text);
      if (!parsed) {
        return;
      }

      event.preventDefault();
      xInput.value = String(parsed.x);
      yInput.value = String(parsed.y);
      calculate();
      setResult(t('statusMessages.clipboardFromPaste'));
    });
  });
}

function applyDefaultValues() {
  gunXInput.value = '98.43';
  gunYInput.value = '110.38';
  targetXInput.value = '108.90';
  targetYInput.value = '112.50';
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;

  const title = document.querySelector('title[data-i18n-title]');
  if (title) {
    title.textContent = t(title.dataset.i18nTitle);
  }

  const description = document.querySelector('meta[data-i18n-content]');
  if (description) {
    description.setAttribute('content', t(description.dataset.i18nContent));
  }

  const dynamicTextNodes = document.querySelectorAll('[data-i18n]');
  dynamicTextNodes.forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  const htmlNodes = document.querySelectorAll('[data-i18n-html]');
  htmlNodes.forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });

  const placeholderNodes = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderNodes.forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });

  if (heroDescriptionEl) heroDescriptionEl.textContent = t('heroDescription');
  if (languageLabel) languageLabel.textContent = t('languageLabel');
  if (rangeMessageEl) rangeMessageEl.textContent = t('statusReady');
  if (repoLink) repoLink.textContent = t('noteRepoLink');
  if (videoLink) videoLink.textContent = t('noteVideoLink');

  gunXInput.setAttribute('aria-label', t('aria.ownX'));
  gunYInput.setAttribute('aria-label', t('aria.ownY'));
  targetXInput.setAttribute('aria-label', t('aria.enemyX'));
  targetYInput.setAttribute('aria-label', t('aria.enemyY'));
  pasteGunBtn.setAttribute('aria-label', t('aria.pasteOwnBtn'));
  pasteTargetBtn.setAttribute('aria-label', t('aria.pasteEnemyBtn'));
  resetBtn.setAttribute('aria-label', t('aria.clearBtn'));
  languageSelect.setAttribute('aria-label', t('aria.languageSelect'));
}

function calculate() {
  const gunXcm = parseToCentimeterUnits(gunXInput.value);
  const gunYcm = parseToCentimeterUnits(gunYInput.value);
  const targetXcm = parseToCentimeterUnits(targetXInput.value);
  const targetYcm = parseToCentimeterUnits(targetYInput.value);

  if (
    [gunXcm, gunYcm, targetXcm, targetYcm].some((value) => value === null)
  ) {
    setResult(t('statusMessages.missingInputs'), false);
    distanceKmEl.textContent = '—';
    return;
  }

  const dx = targetXcm - gunXcm;
  const dy = targetYcm - gunYcm;
  const distanceM = Math.hypot(dx, dy);
  const distanceMExact = Math.round(distanceM / 100);

  distanceKmEl.textContent = `${distanceMExact} ${t('units.meters')}`;
  setResult(
    t('statusResult', {
      distance: distanceMExact.toString(),
    })
  );
}

function setLanguage(newLanguage, shouldSave = true) {
  const normalizedLanguage = newLanguage && I18N[newLanguage] ? newLanguage : DEFAULT_LANGUAGE;
  currentLanguage = normalizedLanguage;

  if (shouldSave) {
    safeSetStoredLanguage(currentLanguage);
  }

  applyTranslations();
  calculate();
}

function wireEvents() {
  const autoRecalculateTargets = [gunXInput, gunYInput, targetXInput, targetYInput];

  autoRecalculateTargets.forEach((el) => {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });

  languageSelect.addEventListener('change', () => {
    setLanguage(languageSelect.value);
  });

  pasteGunBtn.addEventListener('click', () => pasteCoordinates(false));
  pasteTargetBtn.addEventListener('click', () => pasteCoordinates(true));
  resetBtn.addEventListener('click', () => {
    gunXInput.value = '';
    gunYInput.value = '';
    targetXInput.value = '';
    targetYInput.value = '';
    distanceKmEl.textContent = '—';
    setResult(t('statusMessages.cleared'));
  });

  attachPasteToInputPair(gunXInput, gunYInput);
  attachPasteToInputPair(targetXInput, targetYInput);
}

function init() {
  const storedLanguage = safeGetStoredLanguage();
  currentLanguage = I18N[storedLanguage] ? storedLanguage : DEFAULT_LANGUAGE;
  languageSelect.value = currentLanguage;

  applyTranslations();
  wireEvents();
  applyDefaultValues();
  setResult(t('statusReady'));
  calculate();
}

init();
