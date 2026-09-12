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

const COORD_SCALE = 100;

let weapons = [];

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
    name: (raw.names && (raw.names.de || raw.names.en)) || raw.id,
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

function formatWeaponLabel(weapon) {
  return `${weapon.name} (${weapon.id.toUpperCase()})`;
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

  const direct = normalized.match(/-?\d+(?:[.,]\d+)?/g)?.map((value) => Number(value.replace(',', '.'))) ?? [];
  if (direct.length >= 2) {
    return { x: direct[0], y: direct[1] };
  }

  return null;
}

function applyDefaultValues() {
  gunXInput.value = '98.43';
  gunYInput.value = '110.38';
  targetXInput.value = '108.90';
  targetYInput.value = '112.50';
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
      setResult('Zwischenablage enthält kein Spiel-Format: x98.43, y110.38', true);
      return;
    }

    setPointFromParsed(parsed, forTarget);
    calculate();
    setResult('Koordinaten aus Zwischenablage übernommen.');
  } catch (error) {
    setResult('Zwischenablage konnte nicht gelesen werden. Bitte manuell einfügen.', true);
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
      setResult('Koordinaten aus eingefügtem Text übernommen.');
    });
  });
}

function populateWeapons() {
  weaponSelect.innerHTML = '';
  weapons.forEach((weapon) => {
    const option = document.createElement('option');
    option.value = weapon.id;
    option.textContent = formatWeaponLabel(weapon);
    weaponSelect.appendChild(option);
  });

  const preferred = weapons.find((w) => w.id === 'mortar');
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
    setResult('Bitte gültige Werte für eigene und Gegnerposition eingeben.');
    distanceKmEl.textContent = '—';
    azimuthEl.textContent = '—';
    elevationEl.textContent = '—';
    return;
  }

  if (!weapon || !weapon.ballistics) {
    setResult('Waffe konnte nicht geladen werden oder besitzt keine Ballistik-Tabelle.', true);
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

  distanceKmEl.textContent = `${distanceKm.toFixed(2)} km`;
  azimuthEl.textContent = `${normAzimuth.toFixed(1)}°`;

  const solutions = getWeaponElevationSolutions(weapon, distanceM);
  const minText = `${weapon.minRange.toFixed(3)} km`;
  const maxText = `${weapon.maxRange.toFixed(3)} km`;

  if (!solutions.inRange) {
    elevationEl.textContent = '—';
    setResult(
      `Entfernung ${distanceKm.toFixed(2)} km liegt außerhalb der Reichweite ${minText} - ${maxText}.`,
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
      `Keine passende Ballistik-Lösung in der Tabelle für ${distanceKm.toFixed(2)} km gefunden.`,
      true
    );
    elevationEl.textContent = elevationText;
    return;
  }

  elevationEl.textContent = elevationText;
  setResult(`Reichweite ok (${weapon.name}), ${distanceKm.toFixed(2)} km · Azimut ${normAzimuth.toFixed(1)}°.`);
}

function wireEvents() {
  const autoRecalculateTargets = [gunXInput, gunYInput, targetXInput, targetYInput, weaponSelect];

  autoRecalculateTargets.forEach((el) => {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
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
    setResult('Felder geleert. Neue Koordinaten einfügen oder manuell eingeben.');
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
    weapons = Array.isArray(data?.weapons)
      ? data.weapons.map(normalizeWeapon).filter(Boolean)
      : [];

    if (!weapons.length) {
      throw new Error('Keine Waffen im JSON gefunden');
    }

    populateWeapons();
    wireEvents();
    applyDefaultValues();
    calculate();
  } catch (error) {
    setResult(`Fehler beim Laden der Waffendaten: ${error.message}`, true);
  }
}

init();
