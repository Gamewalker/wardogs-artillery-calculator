# Wardogs Artillerie Distanz-Rechner

Ein statischer GitHub-Pages Rechner für die Distanz zwischen zwei Spielkoordinaten.

## Live-Demo

- GitHub Pages: [https://gamewalker.github.io/wardogs-artillery-calculator/](https://gamewalker.github.io/wardogs-artillery-calculator/)

## Features

- Eingabe von Geschütz- und Zielkoordinaten
- Sprachumschaltung (`en`, `de`), Standard ist Englisch.
- Euklidische Distanz-Berechnung direkt aus den Koordinaten im Spiel-Format.
- Schnellster Workflow: 2 Punkte einfügen (eigene Position + Gegnerposition) und sofort Ergebnis.
- Schnelles Einfügen per **Zwischenablage** mit den Buttons:
  - `eigene Position einfügen`
  - `Gegnerposition einfügen`
  - Unterstützte Formate: `x98.43, y110.38` oder `x: 98.43, y: 110.38`
- Eingaben werden bei jeder Änderung automatisch berechnet (kein extra „Berechnen“-Button).
- Ergebnis wird in **Metern** berechnet und auf den nächsten Meter gerundet.
- Zusätzlicher Reset: `Alle Felder leeren`.
- Referenzquelle:  
  https://youtu.be/9X8U-eHCMgI?is=m-4F3UgNOu2_LIki

## Voraussetzungen

- Git + GitHub-Account
- (Optional) `gh` CLI zum automatischen Erstellen des GitHub-Repos

## Datenmodell

Die App ist rein clientseitig (kein Backend).

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

Diese Seite berechnet ausschließlich die Distanz; sie ersetzt nicht die komplette Simulation im Spiel.
Starte mit einem Korrekturschuss und passe die Werte im Spielverlauf an.

## License

MIT

Deploy status: aktive GitHub-Pages-Veröffentlichung automatisch auf push.
