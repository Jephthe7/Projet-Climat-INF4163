# Matrice de traçabilité des exigences

Cette matrice relie chaque exigence de l'énoncé à sa réalisation dans le projet remis.

## Bases de données

| Exigence | Où elle est satisfaite | Statut |
|---|---|---|
| 3 bases SQL | `sql/temperaturedb/`, `sql/pollutiondb/`, `sql/precipitationsdb/` et `docs/preuves/azure/` | ✅ Fait — 3 bases hébergées sur Azure SQL |
| 9 tables annuelles | Scripts `SQL_*_CreateTable_*.sql` | ✅ Fait — 3 tables principales par base |
| 13 provinces et territoires | `data/clean/` et scripts d'import | ✅ Fait |
| Périodes couvertes | Température et précipitations : 2023–2025; pollution : 2022–2024, période confirmée par le professeur | ✅ Fait avec écart documenté |
| Données officielles et reproductibles | `data/sources/`, `data/raw/`, `data/clean/`, `scripts/` | ✅ Fait |
| Relations entre les tables | CodeProvince partagé par convention; aucune clé étrangère dans la version livrée | ⚠️ Écart documenté; amélioration : table Province et clés étrangères |

## Frontend et visualisation

| Exigence | Où elle est satisfaite | Statut |
|---|---|---|
| Site organisé par onglets | `frontend/index.html`, `frontend/app.js`, `frontend/style.css` | ✅ Fait |
| Graphiques climatiques | Onglets Température, Pollution et Précipitations; graphiques par province et évolution annuelle | ✅ Fait |
| Résultats analytiques dans un onglet spécifique | Onglet Analyses et endpoint `/resultats` | ✅ Fait — 11 résultats |
| Onglet Équipe avec photos et contributions | Onglet Équipe interactif | ✅ Fait |
| Logo et nom du groupe | `assets/logo/` et frontend | ✅ Fait |
| Hébergement gratuit | https://greensoft-climat-site.onrender.com | ✅ Fait — Render |
| Power BI connecté aux données | `powerbi/ProjetClimat.pbix`; Azure SQL en mode Import avec actualisation | ✅ Fait, avec limitation documentée |

## Backend analytique

| Exigence | Où elle est satisfaite | Statut |
|---|---|---|
| Questions analytiques plus/moins | `sql/*/SQL_*_Procedures_v1.sql` | ✅ Fait |
| Procédures stockées | 11 procédures dans les trois bases | ✅ Fait et testé |
| Déclencheurs | 12 déclencheurs de validation et d'audit | ✅ Fait et testé |
| API intermédiaire | `api/` | ✅ Fait et déployé sur Render |
| Affichage dynamique | `/resultats` et les trois endpoints `/api/*` | ✅ Fait |

## Bonus

| Bonus | Réalisation | Statut |
|---|---|---|
| Hébergement des 3 bases sur Azure | Azure SQL Database | ✅ Fait |
| Hébergement gratuit du frontend | Render Static Site | ✅ Fait |
| Visualisations dynamiques | Chart.js via l'API Azure SQL; rapport Power BI actualisable | ✅ Fait selon la portée documentée |

## Gouvernance et livrables

| Livrable | Emplacement | Statut |
|---|---|---|
| PGOP | `docs/PGOP/` | ✅ Fait |
| DAT | `docs/DAT/` | ✅ Fait |
| Pipeline reproductible | `scripts/` | ✅ Fait |
| Rapport final | `rapport/Rapport_final_GreenSoft.docx` et PDF | ✅ Fait |
| Présentation | `presentation/` | ✅ Fait |
| Captures et preuves | `docs/preuves/` | ✅ Fait |

## Limites assumées

- PollutionDB couvre 2022–2024, car les données officielles 2025 n'étaient pas disponibles.
- Cinq provinces ou territoires n'ont pas de mesure de précipitations; les valeurs `NULL` sont exclues des agrégations.
- Power BI utilise le mode Import avec actualisation; la publication publique est bloquée par le tenant UQO.
- La version livrée ne comporte pas de clés étrangères entre les tables annuelles; cette limite est documentée dans le rapport.
