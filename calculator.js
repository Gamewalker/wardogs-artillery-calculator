const languageSelect = document.getElementById('languageSelect');
const languageLabel = document.getElementById('languageLabel');
const weaponSelect = document.getElementById('weaponSelect');
const gunXInput = document.getElementById('gunX');
const gunYInput = document.getElementById('gunY');
const targetXInput = document.getElementById('targetX');
const targetYInput = document.getElementById('targetY');
const distanceKmEl = document.getElementById('distanceKm');
const azimuthEl = document.getElementById('azimuth');
const elevationEl = document.getElementById('elevation');
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
let weapons = [];
let defaultWeaponId = 'mortar';

const I18N = {
  en: {
    languageLabel: 'Language',
    eyebrow: 'Wardogs artillery calculator',
    appTitle: 'Artillery Range Calculator',
    metaDescription:
      'Static distance, azimuth and elevation calculator for L81 mortar and SPH-2 in WARDOGS.',
    heroDescription:
      'Based on the YouTube guide "How to ALWAYS Land Mortars or Artillery": calculate distance and azimuth first, then read elevation from weapon table.',
    sectionPoints: '1) Points',
    sectionResult: '2) Result',
    sectionNotes: '3) Notes',
    copyHint:
      'In-game copy-paste format: <code>x98.43, y110.38</code> or <code>x: 98.43, y: 110.38</code>',
    labelWeapon: 'Weapon',
    ownPositionLabel: 'Own position',
    enemyPositionLabel: 'Enemy position',
    pasteOwnBtn: 'Paste own position',
    pasteEnemyBtn: 'Paste enemy position',
    resetBtn: 'Clear all fields',
    resultDistance: 'Distance',
    resultAzimuth: 'Azimut',
    resultElevation: 'Elevation',
    statusReady: 'Enter values and result is calculated automatically.',
    noteMethod:
      'Distance is the base in this method: geometry (dx/dy/distance/azimuth) first, then use <strong>mil</strong> from the ballistic table.',
    noteWeaponData:
      'The same community ballistic tables are used for L81 Mortar and SPH-2, including low/high for SPH-2.',
    noteUseInGame: 'Always verify in-game with at least one correction shot.',
    noteRepoLink: 'GitHub repository',
    noteVideoLink: 'Reference video source',
    inputPlaceholderOwnX: '98.43',
    inputPlaceholderOwnY: '110.38',
    inputPlaceholderTargetX: '108.90',
    inputPlaceholderTargetY: '112.50',
    statusMessages: {
      missingInputs: 'Enter valid values for own position and enemy position.',
      missingWeapon:
        'Weapon data is missing or has no ballistic table.',
      clipboardInvalid:
        'Clipboard does not match game format. Expected: x98.53, y109.03',
      clipboardApplied: 'Coordinates pasted from clipboard.',
      clipboardFromPaste: 'Coordinates copied into input.',
      clipboardError:
        'Clipboard could not be read. Please paste manually.',
      cleared:
        'Fields cleared. Paste or enter new coordinates.',
      outOfRange:
        'Distance {distance} km is outside range {minRange} - {maxRange}.',
      noSolution:
        'No ballistic solution found in table for {distance} km.',
      inRange:
        'Range ok ({weapon}), {distance} km · Azimuth {azimuth}°.',
      loadDataError: 'Error loading weapon data: {error}',
    },
    units: {
      km: 'km',
      azimuth: '°',
    },
    aria: {
      weaponSelect: 'Select weapon',
      ownX: 'Own position x',
      ownY: 'Own position y',
      enemyX: 'Enemy position x',
      enemyY: 'Enemy position y',
      weaponLabel: 'Weapon',
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
    appTitle: 'Artillerie-Weite Rechner',
    metaDescription:
      'Statische Rechnung für Distanz, Azimut und Elevation für L81-Mörser sowie SPH-2 in WARDOGS.',
    heroDescription:
      'Basierend auf dem YouTube-Guide „How to ALWAYS Land Mortars or Artillery“: Zuerst Distanz und Azimut rechnen, danach Elevation aus der Waffentabelle.',
    sectionPoints: '1) Punkte',
    sectionResult: '2) Ergebnis',
    sectionNotes: '3) Hinweise',
    copyHint:
      'Copy-Paste-Format aus dem Spiel: <code>x98.43, y110.38</code> oder <code>x: 98.43 y: 110.38</code>',
    labelWeapon: 'Waffe',
    ownPositionLabel: 'eigene Position',
    enemyPositionLabel: 'Gegnerposition',
    pasteOwnBtn: 'eigene Position einfügen',
    pasteEnemyBtn: 'Gegnerposition einfügen',
    resetBtn: 'Alle Felder leeren',
    resultDistance: 'Entfernung',
    resultAzimuth: 'Azimut',
    resultElevation: 'Elevation',
    statusReady:
      'Setze Werte ein, dann wird automatisch gerechnet.',
    noteMethod:
      'Im Video wird als Basis die Geometrie verwendet: zuerst Distanz/Azimut, danach Mil aus der Ballistik-Tabelle.',
    noteWeaponData:
      'Es werden dieselben Community-Tabellenwerte für L81-Mörser und SPH-2 genutzt, inklusive Low/High-Bahnen (SPH-2).',
    noteUseInGame:
      'Teste die Empfehlung im Spiel mindestens mit einem Korrektur-Schuss.',
    noteRepoLink: 'GitHub-Repository',
    noteVideoLink: 'Video-Hintergrund / Referenz',
    inputPlaceholderOwnX: '98.43',
    inputPlaceholderOwnY: '110.38',
    inputPlaceholderTargetX: '108.90',
    inputPlaceholderTargetY: '112.50',
    statusMessages: {
      missingInputs: 'Bitte gültige Werte für eigene und Gegnerposition eingeben.',
      missingWeapon:
        'Waffe konnte nicht geladen werden oder besitzt keine Ballistik-Tabelle.',
      clipboardInvalid:
        'Zwischenablage enthält kein gültiges Spielformat. Erwartet: x98.53, y109.03',
      clipboardApplied: 'Koordinaten aus Zwischenablage übernommen.',
      clipboardFromPaste: 'Koordinaten aus eingefügtem Text übernommen.',
      clipboardError:
        'Zwischenablage konnte nicht gelesen werden. Bitte manuell einfügen.',
      cleared:
        'Felder geleert. Neue Koordinaten einfügen oder manuell eingeben.',
      outOfRange:
        'Entfernung {distance} km liegt außerhalb der Reichweite {minRange} - {maxRange}.',
      noSolution:
        'Keine passende Ballistik-Lösung in der Tabelle für {distance} km gefunden.',
      inRange:
        'Reichweite ok ({weapon}), {distance} km · Azimut {azimuth}°.',
      loadDataError: 'Fehler beim Laden der Waffendaten: {error}',
    },
    units: {
      km: 'km',
      azimuth: '°',
    },
    aria: {
      weaponSelect: 'Waffe wählen',
      ownX: 'eigene Position x',
      ownY: 'eigene Position y',
      enemyX: 'Gegnerposition x',
      enemyY: 'Gegnerposition y',
      weaponLabel: 'Waffe',
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

function toIntRange(rangeKm) {
  return rangeKm * 1000;
}

function normalizeBallisticTable(table) {
  if (!Array.isArray(table)) {
    return [];
  }

  return table
    .map((entry) => {
      if (!Array.isArray(entry) || entry.length < 2) {
        return null;
      }

      const distance = Number(entry[0]);
      const mil = Number(entry[1]);
      return Number.isFinite(distance) && Number.isFinite(mil)
        ? [distance, mil]
        : null;
    })
    .filter(Boolean);
}

function normalizeBallistics(ballistics) {
  if (!ballistics || typeof ballistics !== 'object') {
    return null;
  }

  return {
    single: normalizeBallisticTable(ballistics.single),
    low: normalizeBallisticTable(ballistics.low),
    high: normalizeBallisticTable(ballistics.high),
  };
}

function normalizeWeapon(raw) {
  if (!raw || typeof raw.id !== 'string' || !raw.id.trim()) {
    return null;
  }

  const maxRangeKm = Number(raw.maxRangeKm ?? raw.rangeKm ?? raw.range);
  const minRangeKm = Number(raw.minRangeKm ?? 0);

  if (
    !Number.isFinite(maxRangeKm) ||
    maxRangeKm <= 0 ||
    !Number.isFinite(minRangeKm) ||
    minRangeKm < 0 ||
    minRangeKm > maxRangeKm
  ) {
    return null;
  }

  return {
    id: raw.id.trim(),
    names: raw.names && typeof raw.names === 'object' ? { ...raw.names } : {},
    minRange: minRangeKm,
    maxRange: maxRangeKm,
    minElevationMil: Number.isFinite(Number(raw.minElevationMil))
      ? Number(raw.minElevationMil)
      : null,
    maxElevationMil: Number.isFinite(Number(raw.maxElevationMil))
      ? Number(raw.maxElevationMil)
      : null,
    ballistics: normalizeBallistics(raw.ballistics),
  };
}

function getWeaponName(weapon) {
  return (
    (weapon.names && (weapon.names[currentLanguage] || weapon.names.en || weapon.names.de))
    || weapon.id
  );
}

function getWeaponLabel(weapon) {
  return `${getWeaponName(weapon)} (${weapon.id.toUpperCase()})`;
}

function weaponSignature(weapon) {
  return JSON.stringify({
    minRange: weapon.minRange,
    maxRange: weapon.maxRange,
    minElevationMil: weapon.minElevationMil,
    maxElevationMil: weapon.maxElevationMil,
    ballistics: weapon.ballistics,
  });
}

function dedupeWeapons(list) {
  const dedupedByProfile = new Map();
  list.forEach((weapon) => {
    if (!weapon) return;
    const signature = weaponSignature(weapon);
    const existing = dedupedByProfile.get(signature);

    if (!existing) {
      dedupedByProfile.set(signature, { ...weapon, altIds: [weapon.id] });
      return;
    }

    existing.altIds = Array.from(new Set([...(existing.altIds || []), weapon.id]));
    if (!existing.id) {
      existing.id = weapon.id;
    }
    existing.names = { ...existing.names, ...weapon.names };
  });

  return Array.from(dedupedByProfile.values());
}

function groupBallisticTable(table) {
  const grouped = [];
  [...table]
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .forEach(([distance, mil]) => {
      const previous = grouped[grouped.length - 1];
      if (previous && previous.distance === distance) {
        previous.mils.push(mil);
        return;
      }
      grouped.push({ distance, mils: [mil] });
    });
  return grouped;
}

function closestMil(values, target) {
  return values.reduce((best, value) =>
    Math.abs(value - target) < Math.abs(best - target) ? value : best
  , values[0]);
}

function interpolateBallisticTable(table, distanceMeters) {
  if (!Array.isArray(table) || !table.length || !Number.isFinite(distanceMeters)) {
    return null;
  }

  const groups = groupBallisticTable(table);
  const epsilon = 1e-6;
  const exact = groups.find((group) => Math.abs(group.distance - distanceMeters) <= epsilon);

  if (exact) {
    const minMil = Math.min(...exact.mils);
    const maxMil = Math.max(...exact.mils);
    return {
      mil: exact.mils.length === 1 ? exact.mils[0] : null,
      minMil,
      maxMil,
    };
  }

  let left = null;
  let right = null;

  for (let i = 0; i < groups.length - 1; i++) {
    if (distanceMeters > groups[i].distance && distanceMeters < groups[i + 1].distance) {
      left = groups[i];
      right = groups[i + 1];
      break;
    }
  }

  if (!left || !right) {
    return null;
  }

  const rightAverage = right.mils.reduce((sum, value) => sum + value, 0) / right.mils.length;
  const leftMil = closestMil(left.mils, rightAverage);
  const rightMil = closestMil(right.mils, leftMil);
  const factor = (distanceMeters - left.distance) / (right.distance - left.distance);
  const mil = leftMil + factor * (rightMil - leftMil);

  return { mil, minMil: mil, maxMil: mil };
}

function getWeaponElevationSolutions(weapon, distanceMeters) {
  if (!weapon || !Number.isFinite(distanceMeters)) {
    return { inRange: false, single: null, low: null, high: null };
  }

  const minMeters = toIntRange(weapon.minRange);
  const maxMeters = toIntRange(weapon.maxRange);
  const inRange =
    distanceMeters + 1e-6 >= minMeters && distanceMeters <= maxMeters + 1e-6;

  if (!inRange || !weapon.ballistics) {
    return { inRange, single: null, low: null, high: null };
  }

  return {
    inRange,
    single: interpolateBallisticTable(weapon.ballistics.single, distanceMeters),
    low: interpolateBallisticTable(weapon.ballistics.low, distanceMeters),
    high: interpolateBallisticTable(weapon.ballistics.high, distanceMeters),
  };
}

function formatMilValue(mil) {
  return Math.round(mil).toString();
}

function formatSolution(solution) {
  if (!solution) return '—';
  const minMil = Math.round(solution.minMil);
  const maxMil = Math.round(solution.maxMil);
  if (minMil === maxMil) {
    return formatMilValue(solution.mil ?? minMil);
  }
  return `${formatMilValue(minMil)}–${formatMilValue(maxMil)}`;
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
  } catch (error) {
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
    const key = title.dataset.i18nTitle;
    title.textContent = t(key);
  }

  const description = document.querySelector('meta[data-i18n-content]');
  if (description) {
    const key = description.dataset.i18nContent;
    description.setAttribute('content', t(key));
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

  if (heroDescriptionEl) {
    heroDescriptionEl.textContent = t('heroDescription');
  }

  if (languageLabel) {
    languageLabel.textContent = t('languageLabel');
  }

  if (rangeMessageEl) {
    rangeMessageEl.textContent = t('statusReady');
  }

  if (repoLink) {
    repoLink.textContent = t('noteRepoLink');
  }

  if (videoLink) {
    videoLink.textContent = t('noteVideoLink');
  }

  if (weaponSelect) {
    weaponSelect.setAttribute('aria-label', t('aria.weaponSelect'));
    weaponSelect.previousElementSibling?.setAttribute('for', 'weaponSelect');
    weaponSelect.previousElementSibling?.setAttribute('aria-label', t('aria.weaponLabel'));
  }

  gunXInput.setAttribute('aria-label', t('aria.ownX'));
  gunYInput.setAttribute('aria-label', t('aria.ownY'));
  targetXInput.setAttribute('aria-label', t('aria.enemyX'));
  targetYInput.setAttribute('aria-label', t('aria.enemyY'));
  pasteGunBtn.setAttribute('aria-label', t('aria.pasteOwnBtn'));
  pasteTargetBtn.setAttribute('aria-label', t('aria.pasteEnemyBtn'));
  resetBtn.setAttribute('aria-label', t('aria.clearBtn'));
  languageSelect.setAttribute('aria-label', t('aria.languageSelect'));
}

function populateWeapons() {
  const previousWeaponId = weaponSelect.value;
  weaponSelect.innerHTML = '';

  weapons.forEach((weapon) => {
    const option = document.createElement('option');
    option.value = weapon.id;
    option.textContent = getWeaponLabel(weapon);
    weaponSelect.appendChild(option);
  });

  if (previousWeaponId && weapons.some((w) => w.id === previousWeaponId)) {
    weaponSelect.value = previousWeaponId;
    return;
  }

  const preferred = weapons.find((w) => w.id === defaultWeaponId) || weapons[0];
  if (preferred) {
    weaponSelect.value = preferred.id;
  }
}

function calculate() {
  const gunX = normNum(gunXInput.value);
  const gunY = normNum(gunYInput.value);
  const targetX = normNum(targetXInput.value);
  const targetY = normNum(targetYInput.value);
  const weaponId = weaponSelect.value;
  const weapon = weapons.find((item) => item.id === weaponId);

  if ([gunX, gunY, targetX, targetY].some((value) => value === null)) {
    setResult(t('statusMessages.missingInputs'), false);
    distanceKmEl.textContent = '—';
    azimuthEl.textContent = '—';
    elevationEl.textContent = '—';
    return;
  }

  if (!weapon || !weapon.ballistics) {
    setResult(t('statusMessages.missingWeapon'), true);
    distanceKmEl.textContent = '—';
    azimuthEl.textContent = '—';
    elevationEl.textContent = '—';
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

  const solutions = getWeaponElevationSolutions(weapon, distanceM);
  const minText = `${weapon.minRange.toFixed(3)} ${t('units.km')}`;
  const maxText = `${weapon.maxRange.toFixed(3)} ${t('units.km')}`;

  if (!solutions.inRange) {
    elevationEl.textContent = '—';
    setResult(
      t('statusMessages.outOfRange', {
        distance: distanceKm.toFixed(2),
        minRange: minText,
        maxRange: maxText,
      }),
      true
    );
    return;
  }

  let elevationText = '—';
  if (solutions.single) {
    elevationText = `${formatSolution(solutions.single)} Mil`;
  } else if (solutions.low && solutions.high) {
    elevationText = `${formatSolution(solutions.low)} / ${formatSolution(solutions.high)} Mil (low / high)`;
  } else if (solutions.low) {
    elevationText = `${formatSolution(solutions.low)} Mil (low)`;
  } else if (solutions.high) {
    elevationText = `${formatSolution(solutions.high)} Mil (high)`;
  } else {
    setResult(
      t('statusMessages.noSolution', { distance: distanceKm.toFixed(2) }),
      true
    );
    elevationEl.textContent = elevationText;
    return;
  }

  elevationEl.textContent = elevationText;
  setResult(
    t('statusMessages.inRange', {
      weapon: getWeaponName(weapon),
      distance: distanceKm.toFixed(2),
      azimuth: normAzimuth.toFixed(1),
    })
  );
}

function setLanguage(newLanguage, shouldSave = true) {
  const normalizedLanguage = newLanguage && I18N[newLanguage] ? newLanguage : DEFAULT_LANGUAGE;
  currentLanguage = normalizedLanguage;
  if (shouldSave) {
    localStorage.setItem('wardogs_language', currentLanguage);
  }
  applyTranslations();
  populateWeapons();
  calculate();
}

function wireEvents() {
  const autoRecalculateTargets = [gunXInput, gunYInput, targetXInput, targetYInput, weaponSelect];

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
    elevationEl.textContent = '—';
    setResult(t('statusMessages.cleared'));
  });

  attachPasteToInputPair(gunXInput, gunYInput);
  attachPasteToInputPair(targetXInput, targetYInput);
}

async function init() {
  try {
    const response = await fetch('./data/weapons.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const initialLanguage = localStorage.getItem('wardogs_language') || DEFAULT_LANGUAGE;
    currentLanguage = I18N[initialLanguage] ? initialLanguage : DEFAULT_LANGUAGE;
    if (languageSelect) {
      languageSelect.value = currentLanguage;
    }

    defaultWeaponId = data?.default || defaultWeaponId;
    const normalizedWeapons = Array.isArray(data?.weapons)
      ? data.weapons.map(normalizeWeapon).filter(Boolean)
      : [];

    weapons = dedupeWeapons(normalizedWeapons);

    if (!weapons.length) {
      throw new Error('No weapons found in JSON');
    }

    applyTranslations();
    populateWeapons();
    wireEvents();
    applyDefaultValues();
    setResult(t('statusReady'));
    calculate();
    languageSelect.value = currentLanguage;
  } catch (error) {
    setResult(
      t('statusMessages.loadDataError', { error: error?.message || String(error) }),
      true
    );
  }
}

init();
