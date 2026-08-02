# Scripts de nettoyage des données

Pipeline qui transforme les données brutes collectées (`data/raw/`) en fichiers prêts pour l'import dans les 3 bases Azure SQL (`data/clean/`).

## Fichiers

| Fichier | Rôle |
|---|---|
| `common.py` | Fonctions partagées (correspondance province/code, conversion de nombres) — importé par les 3 scripts ci-dessous |
| `clean_temperature.py` | Calcule la moyenne annuelle de température par province |
| `clean_precipitations.py` | Calcule le total annuel de précipitations par province |
| `clean_pollution.py` | Calcule les émissions annuelles de GES (Mt CO2e) par province |
| `run_all.py` | Exécute les 3 scripts ci-dessus et génère `data/clean/cleaning_report.md` |

## Entrées / Sorties

```
Entrée
------
data/raw/*.csv           (39 fichiers météo + 1 fichier pollution, non modifiés)

Sortie
------
data/clean/temperature_clean.csv
data/clean/precipitations_clean.csv
data/clean/pollution_clean.csv
data/clean/cleaning_report.md   (résumé du traitement, généré automatiquement)
```

## Exécution

Depuis la racine du dépôt (là où se trouve le dossier `data/`) :

```bash
pip install pandas
python scripts/run_all.py
```

Ou individuellement :
```bash
python scripts/clean_temperature.py
python scripts/clean_precipitations.py
python scripts/clean_pollution.py
```

## Limitations connues gérées automatiquement

- Fichiers au format horaire au lieu de quotidien → détectés et ignorés proprement (signalés dans le rapport, jamais de plantage)
- Stations sans données de précipitation (MB, NS, SK, YT) → valeur laissée à `NULL`, jamais estimée — voir `data/limitations.md`
- Décalage de période pour PollutionDB (2021-2023 au lieu de 2023-2025) → le script prend automatiquement les 3 années les plus récentes disponibles dans la source, quelle qu'elles soient — voir `data/sources/statistique_canada.md`
