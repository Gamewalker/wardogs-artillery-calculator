# Wardogs Artillerie-Weite Rechner

Ein statischer GitHub-Pages Rechner für Distanz, Azimut und Elevation basierend auf
den Community-Ballistiktabellen (L81-Mörser + SPH-2).

## Features

- Eingabe von Geschütz- und Zielkoordinaten
- Waffenauswahl aus JSON-Daten
- Umrechnung der Entfernung in Meter/Kilometer
- Azimut-Berechnung im Spiel-Format (`atan2(dx, dy)`)
- Interpolierte Schusswinkel-Berechnung aus der Tabelle
- Unterstützung von Low-/High-Arc für SPH-2
- Schnellster Workflow: 2 Punkte einfügen (Koordinate 1 + Koordinate 2) und sofort Ergebnis.
- Schnelles Einfügen per **Zwischenablage** mit den Buttons:
  - `eigene Position einfügen`
  - `Gegnerposition einfügen`
  - Unterstützte Formate: `x98.43, y110.38` oder `x: 98.43 y: 110.38`
- Eingaben werden bei jeder Änderung automatisch berechnet (kein extra „Berechnen“-Button).
- Zusätzlicher Reset: `Alle Felder leeren`.

## Voraussetzungen

- Git + GitHub-Account
- (Optional) `gh` CLI zum automatischen Erstellen des GitHub-Repos

## Datenmodell

- `data/weapons.json` enthält die Schussentfernungen zu Mil-Tabellen.
- Die App ist rein clientseitig (kein Backend).

## Lokal starten

```bash
python -m http.server 8080
# Danach: http://localhost:8080
```

## Repository aufsetzen und nach GitHub Pages deployen

Die folgenden Befehle erstellen das Repo `wardogs-artillery-calculator`, committen den
Code und aktivieren GitHub Pages.

```bash
git init -b main
git add .
git commit -m "feat: add static artillery range calculator"
git branch -M main

# Repo für deinen User erstellen (oder auf eigenen Namen anpassen)
gh repo create wardogs-artillery-calculator --source=. --public --remote=origin

git push -u origin main
```

GitHub Pages aktivieren:

1. Öffne das Repo auf GitHub.
2. **Settings → Pages**
3. Als Source: **GitHub Actions**
4. Der Workflow läuft automatisch bei jedem Push auf `main`.

## Hinweis

Diese Seite nutzt reine Tabellenwerte und ersetzt nicht die Simulation im Spiel.
Starte mit einem Korrekturschuss und passe die Werte im Spielverlauf an.

## License

MIT

Deploy status: aktive GitHub-Pages-Veröffentlichung automatisch auf push.
