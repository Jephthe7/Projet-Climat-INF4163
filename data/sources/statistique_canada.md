# Source — Statistique Canada

## Pollution (CO2 / GES)

| Champ | Valeur |
|---|---|
| Source | Statistique Canada — Tableau 38-10-0097-01, Compte des flux physiques des émissions de gaz à effet de serre |
| Lien | https://www150.statcan.gc.ca/t1/tbl1/fr/tv.action?pid=3810009701 |
| Licence | Licence du gouvernement ouvert – Canada |
| Date de téléchargement | *(à remplir)* |
| Fréquence de mise à jour | Annuelle |
| Années disponibles | 2023, 2024, 2025 *(à vérifier — la disponibilité 2024/2025 dépend de la date de publication la plus récente)* |
| Géographie couverte | Canada, provinces et territoires |
| Colonnes utiles | Année, Province/territoire, Émissions (Mt éq. CO2) |
| Remarques | Un seul fichier peut couvrir toutes les provinces/années — filtrer avant export si besoin |

## Notes générales

- Format de téléchargement : CSV (bouton "Télécharger" en haut du tableau, après avoir filtré Province/territoire = tous, années = 2023-2025)
- Fichier brut à déposer dans `data/raw/pollution_raw.csv`
- Vérifier l'unité exacte (Mt éq. CO2 vs Mt CO2 seul) et la noter ici une fois le fichier ouvert
- Ne pas modifier le fichier brut — le nettoyage se fait dans `data/clean/`
