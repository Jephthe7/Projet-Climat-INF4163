# Journal de collecte des données

Statut des 13 stations retenues et de leurs téléchargements. Mettre à jour au fur et à mesure — ne rien télécharger avant que la colonne "Station confirmée" soit cochée pour toutes les lignes.

## Température & Précipitations (Environnement Canada)

| Province/Territoire | Station proposée | Station confirmée | 2023 | 2024 | 2025 | Vérifié |
|---|---|---|---|---|---|---|
| NL | St. John's Intl A | ☐ | ☐ | ☐ | ☐ | ☐ |
| PE | Charlottetown A | ☐ | ☐ | ☐ | ☐ | ☐ |
| NS | Halifax Stanfield Intl A | ☐ | ☐ | ☐ | ☐ | ☐ |
| NB | Fredericton A | ☐ | ☐ | ☐ | ☐ | ☐ |
| QC | Québec Jean-Lesage Intl A | ☐ | ☐ | ☐ | ☐ | ☐ |
| ON | Toronto Pearson Intl A | ☐ | ☐ | ☐ | ☐ | ☐ |
| MB | Winnipeg Richardson Intl A | ☐ | ☐ | ☐ | ☐ | ☐ |
| SK | Regina A | ☐ | ☐ | ☐ | ☐ | ☐ |
| AB | Calgary Intl A | ☐ | ☐ | ☐ | ☐ | ☐ |
| BC | Vancouver Intl A | ☐ | ☐ | ☐ | ☐ | ☐ |
| YT | Whitehorse A | ☐ | ☐ | ☐ | ☐ | ☐ |
| NT | Yellowknife A | ☐ | ☐ | ☐ | ☐ | ☐ |
| NU | Iqaluit A | ☐ | ☐ | ☐ | ☐ | ☐ |

**Légende** :
- Station confirmée = données mensuelles disponibles pour 2023-2025 vérifiées sur le site
- 2023/2024/2025 = fichier CSV téléchargé et déposé dans `data/raw/`
- Vérifié = ouvert une fois pour confirmer que le fichier n'est pas vide/corrompu

## Pollution / GES (Statistique Canada)

| Élément | Statut |
|---|---|
| Table 38-10-0097-01 exportée (toutes provinces, 2023-2025) | ☐ |
| Disponibilité 2025 confirmée | ☐ |
| Unité vérifiée (Mt éq. CO2) | ☐ |
| Fichier déposé dans `data/raw/statcan_3810009701.csv` | ☐ |

## Convention de nommage des fichiers bruts

```
data/raw/
├── statcan_3810009701.csv
├── [code_province]_[nom_station]_2023.csv
├── [code_province]_[nom_station]_2024.csv
├── [code_province]_[nom_station]_2025.csv
...
```

Exemple : `qc_jean-lesage_2023.csv`
