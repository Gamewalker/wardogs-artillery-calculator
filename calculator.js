const languageSelect = document.getElementById('languageSelect');
const languageLabel = document.getElementById('languageLabel');

const gunXInput = document.getElementById('gunX');
const gunYInput = document.getElementById('gunY');
const targetXInput = document.getElementById('targetX');
const targetYInput = document.getElementById('targetY');

const distanceKmEl = document.getElementById('distanceKm');
const azimuthEl = document.getElementById('azimuth');
const rangeMessageEl = document.getElementById('rangeMessage');

const pasteGunBtn = document.getElementById('pasteGunBtn');
const pasteTargetBtn = document.getElementById('pasteTargetBtn');
const resetBtn = document.getElementById('resetBtn');

const heroDescriptionEl = document.getElementById('heroDescription');
const repoLink = document.getElementById('repoLink');
const videoLink = document.getElementById('videoLink');

const COORD_SCALE = 100;
const DEFAULT_LANGUAGE = 'en';

let currentLanguage = DEFAULT_LANGUAGE;

const I18N = {
  en: {
    languageLabel: 'Language',
    eyebrow: 'Wardogs artillery calculator',
    appTitle: 'Artillery Distance Calculator',
    metaDescription:
      'Static distance and azimuth calculator for WARDOGS coordinates.',
    heroDescription:
      'Copy two game positions and get distance + azimuth instantly. The game itself uses distance for fire calculation.',
    sectionPoints: '1) Points',
    sectionResult: '2) Result',
    sectionNotes: '3) Notes',
    copyHint:
      'In-game copy-paste format: <code>x98.43, y110.38</code> or <code>x: 98.43, y: 110.38</code>',
    ownPositionLabel: 'Own position',
    enemyPositionLabel: 'Enemy position',
    pasteOwnBtn: 'Paste own position',
    pasteEnemyBtn: 'Paste enemy position',
    resetBtn: 'Clear all fields',
    resultDistance: 'Distance',
    resultAzimuth: 'Azimuth',
    statusReady: 'Enter values and result is calculated automatically.',
    statusResult: 'Distance {distance} km · Azimuth {azimuth}°.',
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
      km: 'km',
      azimuth: '°',
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
      'Statische Berechnung von Distanz und Azimut für WARDOGS Koordinaten.',
    heroDescription:
      'Kopiere zwei Spielpositionen und erhalte sofort Distanz + Azimut. Das Spiel nutzt für die Berechnung nur die Distanz.',
    sectionPoints: '1) Punkte',
    sectionResult: '2) Ergebnis',
    sectionNotes: '3) Hinweise',
    copyHint:
      'Copy-Paste-Format aus dem Spiel: <code>x98.43, y110.38</code> oder <code>x: 98.43 y: 110.38</code>',
    ownPositionLabel: 'eigene Position',
    enemyPositionLabel: 'Gegnerposition',
    pasteOwnBtn: 'eigene Position einfügen',
    pasteEnemyBtn: 'Gegnerposition einfügen',
    resetBtn: 'Alle Felder leeren',
    resultDistance: 'Entfernung',
    resultAzimuth: 'Azimut',
    statusReady: 'Setze Werte ein, dann wird automatisch gerechnet.',
    statusResult: 'Distanz {distance} km · Azimut {azimuth}°.',
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
      km: 'km',
      azimuth: '°',
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

function normNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
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
  const gunX = normNum(gunXInput.value);
  const gunY = normNum(gunYInput.value);
  const targetX = normNum(targetXInput.value);
  const targetY = normNum(targetYInput.value);

  if ([gunX, gunY, targetX, targetY].some((value) => value === null)) {
    setResult(t('statusMessages.missingInputs'), false);
    distanceKmEl.textContent = '—';
    azimuthEl.textContent = '—';
    return;
  }

  const dx = (targetX - gunX) * COORD_SCALE;
  const dy = (targetY - gunY) * COORD_SCALE;
  const distanceM = Math.hypot(dx, dy);
  const distanceKm = distanceM / 1000;
  const azimuth = (Math.atan2(dx, dy) * 180) / Math.PI;
  const normAzimuth = azimuth < 0 ? azimuth + 360 : azimuth;

  distanceKmEl.textContent = `${distanceKm.toFixed(2)} ${t('units.km')}`;
  azimuthEl.textContent = `${normAzimuth.toFixed(1)}${t('units.azimuth')}`;
  setResult(
    t('statusResult', {
      distance: distanceKm.toFixed(2),
      azimuth: normAzimuth.toFixed(1),
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
    azimuthEl.textContent = '—';
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
