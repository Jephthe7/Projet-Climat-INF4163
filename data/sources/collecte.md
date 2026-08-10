# Journal de collecte des données

## Rôle de ce document

Trace les décisions et incidents survenus pendant la collecte, dans le même esprit que le carnet de bord du PGOP (section 15) : la source de vérité sur ce qui a été récupéré reste le contenu réel de `data/raw/`, pas une case cochée ici. Ce journal ne consigne que ce qui mérite d'être expliqué — écarts, exceptions, décisions.

## Portée de la collecte

| Base | Source | Fichiers attendus |
|---|---|---|
| TempératureDB / PrécipitationsDB | Environnement Canada (voir `environnement_canada.md`) | 39 CSV (13 stations × 3 années) |
| PollutionDB | ECCC — Rapport d'inventaire national (voir `eccc_inventaire_ges.md`) | 1 CSV (toutes provinces/années) |

## Écarts par rapport au plan initial

| Date | Écart | Décision | Raison |
|---|---|---|---|
| 30/07 | Aucune station météo ne propose de granularité mensuelle couvrant 2023-2025 | Collecte en quotidien pour les 13 stations, agrégation faite au nettoyage | Uniformité entre stations, cohérence de traitement |
| 30/07 | Station Winnipeg Richardson Intl A inactive depuis 2013 | Remplacée par Winnipeg Intl A | Seule variante encore active jusqu'en 2026 |
| 30/07 | Station Toronto Lester B. Pearson Intl A inactive depuis 2013 | Remplacée par Toronto Intl A | Seule variante encore active jusqu'en 2026 |

## Incidents ou blocages

*(rien à signaler pour l'instant)*

## Prochaine étape après la collecte

Analyse de structure de chaque fichier (colonnes, types, valeurs manquantes) avant tout nettoyage, conformément à la charte qualité du PGOP (section 8.1) — un livrable n'est considéré prêt qu'une fois compris, pas seulement téléchargé.
