# Limitations connues

Documente les limites méthodologiques assumées du projet — aucune donnée n'a été estimée ou interpolée pour combler ces absences.

| Jeu de données | Province/Territoire | Années | Problème | Décision |
|---|---|---|---|---|
| Précipitations | MB (Winnipeg Intl A) | 2023–2025 | Colonne « Précip. tot. (mm) » présente dans les données mais jamais renseignée par la station | Valeurs laissées absentes (NULL) |
| Précipitations | NS (Halifax Stanfield Int'l A) | 2023–2025 | Idem | Valeurs laissées absentes (NULL) |
| Précipitations | SK (Regina Intl A) | 2023–2025 | Idem | Valeurs laissées absentes (NULL) |
| Précipitations | YT (Whitehorse A) | 2023–2025 | Idem | Valeurs laissées absentes (NULL) |
| Précipitations | NU (Iqaluit A) | 2023–2025 | Idem | Valeurs laissées absentes (NULL) |

## Explication

Les stations retenues pour le Manitoba, la Nouvelle-Écosse, la Saskatchewan, le Yukon et le Nunavut ne publient pas les précipitations totales sur le portail des Données climatiques historiques pour les années étudiées. Ce sont des stations aéroportuaires opérées par NAVCAN (contrôle aérien), orientées vers les paramètres utiles à l'aviation (température, vent, visibilité), et non vers l'ensemble des mesures climatiques classiques.

Après vérification que la colonne existe mais n'est jamais renseignée (confirmant qu'il ne s'agit pas d'une erreur de téléchargement), ces valeurs ont été laissées absentes afin de préserver l'intégrité des données. Aucune estimation ni interpolation n'a été réalisée. Une recherche de station de remplacement a été envisagée mais écartée : elle aurait nécessité un travail de recherche comparable à celui déjà investi pour les 13 stations initiales, pour un gain limité à 4 provinces sur 13, jugé disproportionné compte tenu du temps restant.

## Impact sur PrécipitationsDB

Ces 4 provinces auront des valeurs `NULL` pour les précipitations dans PrécipitationsDB — les autres 9 provinces/territoires sont complètes. À mentionner explicitement dans le rapport (section Difficultés/Choix).
