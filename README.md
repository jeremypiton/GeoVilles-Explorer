# GeoVilles Explorer — Comparateur de Villes Françaises

## Description

**GeoVilles Explorer** est une interface web interactive réalisée avec **D3.js v4** permettant de sélectionner et comparer **deux villes françaises de plus de 20 000 habitants** sur différents aspects :

- **Données générales** : population, comparaison visuelle, top 15 régional
- **Emploi** : taux de chômage, répartition sectorielle, nombre d'emplois, revenu médian
- **Logement** : nombre de logements, type (maisons/appartements), statut d'occupation, prix au m²
- **Météo** : prévisions 7 jours (API Open-Meteo) et climat annuel

## Prérequis

- Un **navigateur web moderne** (Chrome, Firefox, Edge, Safari)
- Un **serveur web local** (nécessaire pour le chargement du fichier CSV via `d3.text()`)

## Installation et lancement

### Option 1 — Python (recommandé)

```bash
# Se placer dans le dossier du projet
cd chemin/vers/D3.js

# Python 3
python -m http.server 8000

# OU Python 2
python -m SimpleHTTPServer 8000
```

Ouvrir **http://localhost:8000** dans le navigateur.

### Option 2 — Node.js

```bash
npx http-server -p 8000
```

Ouvrir **http://localhost:8000** dans le navigateur.

### Option 3 — Extension Live Server (VS Code)

1. Installer l'extension **Live Server** dans VS Code
2. Clic droit sur `index.html` → **Open with Live Server**

### Option 4 — Lanceur Windows (.bat)

Double-cliquer sur `lancer-geovilles.bat` pour :

- démarrer automatiquement le serveur local Python
- ouvrir automatiquement l'application dans le navigateur

Par défaut, le port utilisé est **8000**.

Pour choisir un autre port, lancer dans un terminal :

```bash
lancer-geovilles.bat 8010
```

Puis ouvrir **http://localhost:8010** si le navigateur ne s'ouvre pas tout seul.

## Structure du projet

```
D3.js/
├── index.html              # Page HTML principale (navigation par onglets)
├── style.css               # Feuille de styles (dark mode, glassmorphism)
├── script.js               # Script D3.js v4 (logique, visualisations, API)
├── lancer-geovilles.bat    # Lanceur Windows (serveur + ouverture navigateur)
├── donnees_communes.csv    # Données INSEE — Recensement de la population
└── README.md               # Notice d'installation (ce fichier)
```

## Sources de données

| Donnée | Source | Type |
|--------|--------|------|
| Population des communes | INSEE — Recensement de la population | Fichier CSV local |
| Contours départementaux | [france-geojson](https://github.com/gregoiredavid/france-geojson) | GeoJSON (GitHub) |
| Coordonnées communes | [API Géo](https://geo.api.gouv.fr/) | API REST |
| Météo & prévisions | [Open-Meteo](https://open-meteo.com/) | API REST (gratuite, sans clé) |
| Emploi & Logement | Données simulées basées sur les statistiques régionales INSEE | Génération déterministe |

## Technologies

- **D3.js v4.1.1** via CDN Cloudflare
- **HTML5 / CSS3** (variables CSS, flexbox, grid, animations)
- **JavaScript ES5** (compatibilité navigateurs)

## Fonctionnalités

1. **Carte interactive** des villes françaises ≥ 20 000 habitants avec cercles proportionnels
2. **Barre de recherche** avec autocomplétion pour trouver une ville rapidement
3. **5 onglets** : Carte, Données Générales, Emploi, Logement, Météo
4. **Comparaison visuelle** de deux villes avec cercles proportionnels
5. **Top 15 régional** en diagramme en barres filtrable par région
6. **Diagrammes en donut** pour la répartition sectorielle et les types de logement
7. **Prévisions météo 7 jours** via l'API Open-Meteo (données réelles)
8. **Climat annuel** avec graphique en lignes des températures mensuelles
9. **Tooltips interactifs** au survol de tous les éléments visuels
10. **Design responsive** adapté aux écrans mobiles et tablettes

## Auteurs

Projet réalisé dans le cadre du BUT Science des Données — Semestre 4.
