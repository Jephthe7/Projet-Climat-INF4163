# Source — Environnement Canada / Climat.meteo.gc.ca

## Température

| Champ | Valeur |
|---|---|
| Source | Environnement et Changement climatique Canada — Données climatiques historiques |
| Lien | https://climat.meteo.gc.ca/historical_data/search_historic_data_f.html |
| Licence | Licence du gouvernement ouvert – Canada |
| Date de téléchargement | *(à remplir)* |
| Années disponibles | 2023, 2024, 2025 |
| Granularité | Mensuelle par station (13 stations, une par province/territoire) |
| Colonnes utiles | Année, Mois, Temp. moy. (°C), Nom de la station, Province |
| Remarques | Une station représentative choisie par province/territoire (ex. aéroport de la capitale) |

### Stations retenues (à compléter au fur et à mesure)

| Province/Territoire | Station choisie | Téléchargé ? |
|---|---|---|
| NL | | ☐ |
| PE | | ☐ |
| NS | | ☐ |
| NB | | ☐ |
| QC | | ☐ |
| ON | | ☐ |
| MB | | ☐ |
| SK | | ☐ |
| AB | | ☐ |
| BC | | ☐ |
| YT | | ☐ |
| NT | | ☐ |
| NU | | ☐ |

---

## Précipitations

| Champ | Valeur |
|---|---|
| Source | Environnement et Changement climatique Canada — Données climatiques historiques |
| Lien | https://climat.meteo.gc.ca/historical_data/search_historic_data_f.html |
| Licence | Licence du gouvernement ouvert – Canada |
| Date de téléchargement | *(à remplir)* |
| Années disponibles | 2023, 2024, 2025 |
| Granularité | Annuelle (moyenne par province) |
| Colonnes utiles | Année, Précipitation totale (mm), Nom de la station, Province |
| Remarques | Mêmes stations que pour la température si possible, pour cohérence |

## Notes générales

- Format de téléchargement : CSV (bouton "Télécharger les données" au-dessus du tableau)
- Fichiers bruts à déposer dans `data/raw/temperature_raw.csv` et `data/raw/precipitation_raw.csv`
- Ne pas modifier les fichiers bruts — le nettoyage se fait dans `data/clean/`
