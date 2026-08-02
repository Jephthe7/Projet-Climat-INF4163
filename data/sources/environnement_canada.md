# Source — Environnement Canada / Climat.meteo.gc.ca

## Rôle de ce document

Documente la provenance, les choix et les limites des données de température et de précipitations utilisées pour TempératureDB et PrécipitationsDB. Sert de référence directe pour la section « Environnement » du rapport final (PGOP 11.1) — aucune reconstitution a posteriori ne devrait être nécessaire.

## Source

| Champ | Valeur |
|---|---|
| Fournisseur | Environnement et Changement climatique Canada (ECCC) |
| Portail | Données climatiques historiques — https://climat.meteo.gc.ca/historical_data/search_historic_data_f.html |
| Licence | Licence du gouvernement ouvert – Canada |
| Période couverte | 2023, 2024, 2025 |
| Date de collecte | 30–31 juillet 2026 |

## Méthode de sélection des stations

Le portail organise les données par station météorologique individuelle et non par province — contrairement à Statistique Canada, aucun tableau agrégé par province n'existe pour la température ou les précipitations. Une station représentative a donc été retenue pour chaque province et territoire, selon deux critères : l'aéroport principal de la capitale (couverture la plus longue et la plus fiable), et la confirmation que la station dispose de données actives couvrant 2023 à 2025.

Deux stations ont nécessité un ajustement par rapport au choix initial, le nom pressenti ne correspondant pas à la station encore active dans la base :

| Province | Station initialement envisagée | Station retenue | Raison du changement |
|---|---|---|---|
| MB | Winnipeg Richardson Intl A | Winnipeg Intl A | La station « Richardson » n'a plus de données après 2013 ; l'aéroport apparaît désormais sous un nom simplifié |
| ON | Toronto Lester B. Pearson Intl A | Toronto Intl A | Même situation — l'entrée « Lester B. Pearson » s'arrête en 2013 |

## Granularité retenue

Aucune des 13 stations ne propose d'agrégat mensuel couvrant 2023-2025 (l'option « Mensuel », quand elle existe, s'arrête généralement en 2016 — vérifié explicitement pour Québec Jean-Lesage). Les données ont donc été récupérées en **quotidien** pour l'ensemble des 13 stations, par souci d'uniformité. L'agrégation en moyennes mensuelles et annuelles sera effectuée lors du nettoyage (pandas, `groupby`), et non par le portail source.

## Stations retenues

| Province/Territoire | Station | ID climatologique | Code utilisé dans les noms de fichiers |
|---|---|---|---|
| NL | St. John's Intl A | 8403505 | `nl_st-johns-intl` |
| PE | Charlottetown A | 8300301 | `pe_charlottetown` |
| NS | Halifax Stanfield Int'l A | 8202249 | `ns_halifax-stanfield` |
| NB | Fredericton Intl A | — | `nb_fredericton` |
| QC | Québec Jean-Lesage Intl | 701S001 | `qc_jean-lesage` |
| ON | Toronto Intl A | 6158731 | `on_toronto-pearson` |
| MB | Winnipeg Intl A | — | `mb_winnipeg-intl` |
| SK | Regina Intl A | 4016566 | `sk_regina` |
| AB | Calgary Intl A | 3031092 | `ab_calgary` |
| BC | Vancouver Intl A | 1108395 | `bc_vancouver` |
| YT | Whitehorse A | — | `yt_whitehorse` |
| NT | Yellowknife A | — | `nt_yellowknife` |
| NU | Iqaluit A | — | `nu_iqaluit` |

*ID climatologique laissé vide lorsqu'il n'a pas été relevé au moment du téléchargement — à compléter si besoin pour le rapport (visible sur la page de la station).*

## Fichiers livrés

39 fichiers CSV (13 stations × 3 années), déposés dans `data/raw/`, au format `[code_station]_[année].csv` — par exemple `nl_st-johns-intl_2023.csv`. Données quotidiennes brutes, non modifiées.

## Colonnes utiles retenues

- Date/Heure
- Temp. moy. (°C)
- Précip. totale (mm)
- Nom de la station, Province (redondant mais conservé pour validation croisée lors du nettoyage)

## Limites connues

- Une seule station par province ne représente pas la variabilité climatique interne de provinces étendues (ex. QC, ON, BC) — hypothèse assumée pour rester dans le temps disponible, à mentionner explicitement dans le rapport (section Difficultés/Choix du DAT).
- Les valeurs manquantes ponctuelles (jours sans relevé, quelques cas par station) sont traitées au nettoyage — interpolation ou exclusion documentée selon le volume.
- **Précipitations non disponibles pour 5 stations (MB, NS, SK, YT, NU)** : les stations retenues pour le Manitoba, la Nouvelle-Écosse, la Saskatchewan, le Yukon et le Nunavut ne publient pas les précipitations totales sur le portail des Données climatiques historiques pour les années étudiées — colonne présente mais jamais renseignée, confirmant qu'il s'agit d'une limite de la station (opérée par NAVCAN, orientée aviation) et non d'une erreur de collecte. Une recherche de station de remplacement a été envisagée puis écartée (coût disproportionné par rapport au temps restant). Aucune estimation ni interpolation n'a été faite pour ces cas — voir `data/limitations.md` pour le détail complet.
