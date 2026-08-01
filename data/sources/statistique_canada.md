# Source — Statistique Canada

## Rôle de ce document

Documente la provenance des données de pollution (émissions de gaz à effet de serre) utilisées pour PollutionDB. Sert de référence directe pour la section « Environnement » du rapport final (PGOP 11.1).

## Source

| Champ | Valeur |
|---|---|
| Fournisseur | Statistique Canada |
| Tableau | 38-10-0097-01 — Compte des flux physiques des émissions de gaz à effet de serre |
| Lien | https://www150.statcan.gc.ca/t1/tbl1/fr/tv.action?pid=3810009701 |
| Licence | Licence du gouvernement ouvert – Canada |
| Fréquence de mise à jour | Annuelle |
| Géographie couverte | Canada, provinces et territoires |
| Période demandée | 2023, 2024, 2025 |

## Points vérifiés avant téléchargement

- Disponibilité effective de 2025 dans le tableau (les données les plus récentes de StatCan accusent parfois un délai de publication d'un à deux ans — à confirmer au moment du téléchargement plutôt que supposée)
- Unité exacte utilisée (Mt éq. CO2 vs Mt CO2 seul) — à reporter ci-dessous une fois le fichier ouvert
- Présence des 13 provinces et territoires sans exception

## Fichier livré

Un seul fichier CSV attendu, `data/raw/statcan_3810009701.csv`, couvrant l'ensemble des provinces/territoires et années en un seul export — contrairement à Environnement Canada, aucun découpage par station n'est nécessaire ici.

## Colonnes utiles retenues

- Année de référence
- Province ou territoire
- Émissions (Mt éq. CO2)

## Statut

*(à compléter une fois le fichier téléchargé : unité confirmée, années réellement disponibles, éventuelles provinces manquantes)*
