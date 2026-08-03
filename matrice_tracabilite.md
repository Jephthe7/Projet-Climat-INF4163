# Matrice de traçabilité des exigences

Relie chaque exigence de l'énoncé (`docs/Consignes/Project_UQO_INF4163.pdf`) à l'endroit exact où elle est satisfaite dans le projet — permet de vérifier rapidement, à tout moment, qu'aucune exigence n'est oubliée.

## Bases de données

| Exigence | Où c'est satisfait | Statut |
|---|---|---|
| 3 bases Azure SQL (TempératureDB, PollutionDB, PrécipitationsDB) | `docs/DAT/` §8, `sql/temperaturedb\|pollutiondb\|precipitationsdb/` | 🟡 Conçu, SQL à écrire |
| 9 tables (3 par base) | `docs/DAT/` §8, `docs/PGOP/` Annexe B (24/07) | ✅ Confirmé par le prof |
| 13 provinces/territoires, 2023-2025 | `data/clean/*.csv` | 🟢 2023-2025 pour Température/Précipitations ; 2022-2024 pour Pollution, confirmé par écrit par le professeur le 02/08 (voir `data/sources/eccc_inventaire_ges.md`) |
| Données sourcées et documentées | `data/sources/`, `data/limitations.md` | ✅ |

## Frontend

| Exigence | Où c'est satisfait | Statut |
|---|---|---|
| Graphiques des 9 tables par onglets | `docs/BluePrint/` §8, `frontend/` | ⬜ À développer |
| Connexion live (Power BI/Tableau, pas d'export statique) | `docs/BluePrint/` §9 | ⬜ À développer |
| Onglet Équipe (photo + contribution) | `docs/BluePrint/` §8 | ⬜ À développer |
| Logo et nom d'équipe | `assets/logo/` | ⬜ En attente (PGOP Annexe A) |
| Hébergement gratuit | `docs/DAT/` §15 (Azure Static Web Apps / GitHub Pages) | ⬜ À déployer |

## Backend analytique

| Exigence | Où c'est satisfait | Statut |
|---|---|---|
| 6 questions analytiques (paires plus/moins) | `docs/BluePrint/` §7.1 (11 procédures nommées) | ⬜ SQL à écrire |
| Procédures stockées | `sql/*/`, `docs/DAT/` §8 | ⬜ À écrire |
| Déclencheurs (validation + audit) | `docs/BluePrint/` §7.2 | ⬜ À écrire |
| Résultats affichés dans le frontend | `docs/BluePrint/` §8 (onglet Résultats analytiques) | ⬜ À développer |

## Bonus (+15%)

| Exigence | Où c'est satisfait | Statut |
|---|---|---|
| Hébergement des 3 DB sur Azure (+5%) | `docs/DAT/` §7, §15 | ⬜ |
| Hébergement gratuit du frontend (+5%) | `docs/DAT/` §15 | ⬜ |
| Power BI/Tableau dynamique (+5%) | `docs/DAT/` §7, `powerbi/` | ⬜ |

## Gouvernance et livrables

| Exigence | Où c'est satisfait | Statut |
|---|---|---|
| Organisation d'équipe, rôles, calendrier | `docs/PGOP/` | ✅ |
| Architecture technique détaillée | `docs/DAT/` | ✅ (à resynchroniser avec la décision mensuel/annuel — voir Annexe B) |
| Vision produit / parcours utilisateur | `docs/BluePrint/` | ✅ |
| Gestion GitHub (branches, commits, PR) | `docs/PGOP/` §10, `README.md` | ✅ |
| Pipeline de données reproductible | `scripts/`, `scripts/README.md` | ✅ |
| Rapport final | `rapport/` | 🟡 Squelette seulement |
| Présentation (10 min + démo + 5 min questions) | `presentation/` | ⬜ |
| Dépôt Moodle avant le 10 août 8h00 | — | ⬜ |

## Légende

✅ Fait — 🟡 En cours / partiel — ⬜ Pas commencé

## Comment maintenir ce document

À mettre à jour à chaque changement de statut significatif (fin de phase, décision du prof, livrable terminé) — pas après chaque petit commit. Sert de point de contrôle rapide avant la remise finale : si une ligne reste ⬜ à J-2, c'est un signal d'alerte prioritaire.
