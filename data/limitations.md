# Limitations connues

Aucune donnée n'a été estimée ou interpolée pour combler les absences.

| Jeu de données | Province ou territoire | Années | Problème | Décision |
|---|---|---|---|---|
| Précipitations | MB — Manitoba | 2023–2025 | Colonne de précipitations présente mais non renseignée à la station retenue | Valeurs `NULL` |
| Précipitations | NS — Nouvelle-Écosse | 2023–2025 | Même situation | Valeurs `NULL` |
| Précipitations | SK — Saskatchewan | 2023–2025 | Même situation | Valeurs `NULL` |
| Précipitations | YT — Yukon | 2023–2025 | Même situation | Valeurs `NULL` |
| Précipitations | NU — Nunavut | 2023–2025 | Même situation | Valeurs `NULL` |

## Explication

Les stations retenues pour ces cinq provinces ou territoires ne publient pas de précipitations totales pour la période étudiée. Après vérification que les colonnes existaient mais n'étaient jamais renseignées, les valeurs ont été conservées à `NULL` afin de préserver l'intégrité des données.

Une recherche de stations de remplacement aurait exigé une nouvelle collecte et une nouvelle validation pour cinq provinces ou territoires sur treize. Cette opération a été écartée compte tenu du délai, sans inventer ni interpoler de valeurs.

## Impact sur PrecipitationsDB

Ces cinq provinces ou territoires ont des valeurs `NULL`. Les huit autres disposent de mesures. Les valeurs absentes sont exclues des agrégations et ne sont jamais assimilées à zéro, notamment dans les procédures recherchant la province la moins pluvieuse.
