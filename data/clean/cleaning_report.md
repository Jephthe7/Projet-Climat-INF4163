# Rapport de nettoyage

Genere automatiquement le 2026-08-02 06:00 par `scripts/run_all.py`.

## Température (mensuel)

- 468 lignes produites (attendu : 468 = 13 provinces × 3 années × 12 mois)
- 0 fichier(s) ignoré(s)

## Précipitations

- 39 lignes produites (attendu : 39)
- 0 fichier(s) ignoré(s)
- Provinces sans données de précipitation (valeurs NULL, voir `data/limitations.md`) : ['MB', 'NS', 'NU', 'SK', 'YT']

## Pollution

- 39 lignes produites (attendu : 39)
- Années retenues (3 plus récentes disponibles à la source) : ['2021', '2022', '2023']

## Résumé

- Total : 546 / 546 lignes attendues sur les 3 fichiers nettoyés
- **Complet**