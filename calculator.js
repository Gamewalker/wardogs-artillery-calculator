const weaponSelect = document.getElementById('weaponSelect');
const gunXInput = document.getElementById('gunX');
const gunYInput = document.getElementById('gunY');
const targetXInput = document.getElementById('targetX');
const targetYInput = document.getElementById('targetY');
const distanceKmEl = document.getElementById('distanceKm');
const azimuthEl = document.getElementById('azimuth');
const elevationEl = document.getElementById('elevation');
const rangeMessageEl = document.getElementById('rangeMessage');
const calculateBtn = document.getElementById('calculateBtn');
const pasteBtn = document.getElementById('pasteBtn');

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
    .map(entry => {
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
    high: normalizeBallisticTable(ballistics.high)
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
    minRangeKm,
    maxRangeKm,
    minRange: minRangeKm,
    maxRange: maxRangeKm,
    rangeKm: maxRangeKm,
    minElevationMil: Number.isFinite(Number(raw.minElevationMil))
      ? Number(raw.minElevationMil)
      : null,
    maxElevationMil: Number.isFinite(Number(raw.maxElevationMil))
      ? Number(raw.maxElevationMil)
      : null,
    ballistics: normalizeBallistics(raw.ballistics)
  };
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

  const exact = groups.find(group => Math.abs(group.distance - distanceMeters) <= epsilon);
  if (exact) {
    const minMil = Math.min(...exact.mils);
    const maxMil = Math.max(...exact.mils);
    return {
      mil: exact.mils.length === 1 ? exact.mils[0] : null,
      minMil,
      maxMil
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

  const rightAverage =
    right.mils.reduce((sum, value) => sum + value, 0) / right.mils.length;
  const leftMil = closestMil(left.mils, rightAverage);
  const rightMil = closestMil(right.mils, leftMil);
  const factor =
    (distanceMeters - left.distance) / (right.distance - left.distance);

  const mil = leftMil + factor * (rightMil - leftMil);

  return {
    mil,
    minMil: mil,
    maxMil: mil
  };
}

function getWeaponElevationSolutions(weapon, distanceMeters) {
  if (!weapon || !Number.isFinite(distanceMeters)) {
    return { inRange: false, single: null, low: null, high: null };
  }

  const minMeters = toIntRange(weapon.minRange);
  const maxMeters = toIntRange(weapon.maxRange);
  const inRange = distanceMeters + 1e-6 >= minMeters && distanceMeters <= maxMeters + 1e-6;

  if (!inRange || !weapon.ballistics) {
    return { inRange, single: null, low: null, high: null };
  }

  return {
    inRange,
    single: interpolateBallisticTable(weapon.ballistics.single, distanceMeters),
    low: interpolateBallisticTable(weapon.ballistics.low, distanceMeters),
    high: interpolateBallisticTable(weapon.ballistics.high, distanceMeters)
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

function formatWeaponLabel(weapon) {
  return `${weapon.name} (${weapon.id.toUpperCase()})`;
}

function parseCoordinatePairsFromText(text) {
  const pairs = [];
  const normalized = String(text ?? '');

  const labelRegex = /\b([xy](?:\d+)?)\s*[:=]?\s*(-?\d+(?:[.,]\d+)?)/gi;
  const directRegex = /-?\d+(?:[.,]\d+)?/g;

  const matches = [...normalized.matchAll(labelRegex)];

  if (matches.length >= 4) {
    let temp = { x: null, y: null };

    for (const match of matches) {
      const axis = match[1][0].toLowerCase();
      const raw = match[2].replace(',', '.');
      const value = Number(raw);

      if (!Number.isFinite(value)) {
        continue;
      }

      if (axis === 'x') {
        if (temp.x !== null && temp.y !== null) {
          pairs.push({ ...temp });
          temp = { x: null, y: null };
        }

        temp.x = value;
        continue;
      }

      temp.y = value;

      if (temp.x !== null) {
        pairs.push({ ...temp });
        temp = { x: null, y: null };
      }
    }

    if (temp.x !== null && temp.y !== null) {
      pairs.push(temp);
    }
  }

  if (!pairs.length) {
    const numeric = normalized
      .match(directRegex)
      ?.map((value) => Number(value.replace(',', '.')))
      .filter(Number.isFinite) ?? [];

    if (numeric.length >= 4) {
      for (let index = 0; index < numeric.length - 1; index += 2) {
        if (pairs.length >= 2) {
          break;
        }

        pairs.push({ x: numeric[index], y: numeric[index + 1] });
      }
    }
  }

  if (!pairs.length) {
    return null;
  }

  if (pairs.length < 2) {
    return null;
  }

  return {
    gun: pairs[0],
    target: pairs[1] ?? pairs[0]
  };
}

function setCoordinatesFromClipboardText(text) {
  const parsed = parseCoordinatePairsFromText(text);

  if (!parsed || !parsed.gun || !parsed.target) {
    setResult('Zwischenablage enthält nicht 4 Zahlen / 2 Punkte (x/y bzw. X/Y).');
    return;
  }

  gunXInput.value = String(parsed.gun.x);
  gunYInput.value = String(parsed.gun.y);
  targetXInput.value = String(parsed.target.x);
  targetYInput.value = String(parsed.target.y);
  calculate();

  setResult('Koordinaten aus Zwischenablage übernommen.');
}

async function pasteCoordinates() {
  try {
    const clipboardText = await navigator.clipboard.readText();
    setCoordinatesFromClipboardText(clipboardText);
  } catch (error) {
    setResult('Zwischenablage konnte nicht gelesen werden. Bitte Werte manuell einfügen.');
  }
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

function setResult({ message, className = '' }) {
  rangeMessageEl.textContent = message;
  rangeMessageEl.className = className ? `note ${className}` : 'note';
}

function calculate() {
  const gunX = normNum(gunXInput.value);
  const gunY = normNum(gunYInput.value);
  const targetX = normNum(targetXInput.value);
  const targetY = normNum(targetYInput.value);
  const weaponId = weaponSelect.value;
  const weapon = weapons.find((item) => item.id === weaponId);

  if ([gunX, gunY, targetX, targetY].some((value) => value === null)) {
    setResult('Bitte vier gültige Koordinaten eingeben.');
    return;
  }

  if (!weapon || !weapon.ballistics) {
    setResult('Waffe konnte nicht geladen werden oder besitzt keine Ballistik-Tabelle.');
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
      `Entfernung ${distanceKm.toFixed(2)} km liegt außerhalb der Reichweite ${minText} - ${maxText}.`
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
      `Keine passende Ballistik-Lösung in den Tabellen für ${distanceKm.toFixed(2)} km gefunden.`
    );
    elevationEl.textContent = elevationText;
    return;
  }

  elevationEl.textContent = elevationText;

  setResult(
    `Reichweite ok (${weapon.name}), ${distanceKm.toFixed(2)} km · Azimut ${normAzimuth.toFixed(1)}°.`
  );
}

function wireEvents() {
  calculateBtn.addEventListener('click', calculate);
  pasteBtn.addEventListener('click', pasteCoordinates);

  [gunXInput, gunYInput, targetXInput, targetYInput, weaponSelect].forEach((el) => {
    el.addEventListener('change', calculate);
    el.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') calculate();
    });
  });

  [gunXInput, gunYInput, targetXInput, targetYInput].forEach((input) => {
    input.addEventListener('paste', (event) => {
      const pastedText = event.clipboardData?.getData('text');
      if (!pastedText) {
        return;
      }

      const parsed = parseCoordinatePairsFromText(pastedText);
      if (!parsed || !parsed.gun || !parsed.target) {
        return;
      }

      event.preventDefault();
      setCoordinatesFromClipboardText(pastedText);
    });
  });
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

    if (gunXInput && gunYInput && targetXInput && targetYInput) {
      gunXInput.value = '8200';
      gunYInput.value = '7000';
      targetXInput.value = '8350';
      targetYInput.value = '6900';
    }

    calculate();
  } catch (error) {
    setResult(`Fehler beim Laden der Waffendaten: ${error.message}`);
  }
}

init();
