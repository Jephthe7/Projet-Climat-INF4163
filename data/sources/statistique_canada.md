# Source — Statistique Canada

## Rôle de ce document

Documente la provenance des données de pollution utilisées pour PollutionDB, avec une traçabilité complète entre la source officielle et la valeur finale importée en base — condition explicite de la charte qualité du PGOP (section 8.1, critère « documenté »).

## Source

| Champ | Valeur |
|---|---|
| Fournisseur | Statistique Canada |
| Tableau | 38-10-0097-01 (anciennement CANSIM 153-0114) — Compte des flux physiques des émissions de gaz à effet de serre |
| Lien | https://www150.statcan.gc.ca/t1/tbl1/fr/tv.action?pid=3810009701 |
| DOI | https://doi.org/10.25318/3810009701-fra |
| Licence | Licence du gouvernement ouvert – Canada |
| Fréquence de mise à jour | Annuelle |
| Date de diffusion de la version consultée | 2025-12-11 |
| Géographie couverte | Canada, provinces et territoires |

## Écart de période — documenté, pas improvisé

L'énoncé demande 2023-2025 pour les trois bases. Au moment de la collecte (31 juillet 2026), le tableau StatCan ne publie des données que jusqu'en 2023 — 2024 et 2025 ne sont pas encore diffusées. Aucune valeur n'a été inventée pour combler cet écart.

**Décision retenue** : PollutionDB utilise la période **2021-2023** (les trois années les plus récentes réellement disponibles), à la place de 2023-2025. TempératureDB et PrécipitationsDB conservent 2023-2025, sans changement.

Le professeur a été contacté le 31/07 pour valider cette adaptation (voir PGOP, Annexe B, à mettre à jour avec sa réponse).

## Unité et méthode de calcul — traçabilité complète

Le tableau source exprime les émissions en **kilotonnes de GES en équivalent CO2 (kt CO2e)**, et non en mégatonnes de CO2 comme initialement supposé dans le DAT (section 8.2, « Mt de CO2 ou mm selon la base ») — à corriger dans le DAT en conséquence.

Le tableau ne fournit pas de ligne « Total » unique par province : il se décompose en deux sous-catégories, **Total, industries** et **Total, ménages**, qu'il faut additionner soi-même pour obtenir l'émission totale par province et par année.

**Formule appliquée, pour chaque province et chaque année :**

```
Emissions_MtCO2e = (Total_industries_kt + Total_menages_kt) / 1000
```

**Exemple vérifiable (Ontario, 2023)** :
```
Industries : 118 464 kt
Ménages    :  42 208 kt
Total      : 160 672 kt
÷ 1000     : 160.672 Mt CO2e
```

Cette même méthode a été appliquée aux 13 provinces/territoires × 3 années (2021, 2022, 2023) = 39 lignes.

## Fichiers livrés

| Fichier | Contenu | Statut |
|---|---|---|
| `data/raw/pollution_statcan_raw.csv` | Export brut du tableau 38-10-0097-01, non modifié, tel que téléchargé depuis le site | *(à déposer — export direct depuis « Options de téléchargement » sur la page du tableau)* |
| `data/clean/pollution_clean.csv` | Données agrégées (industries + ménages), converties en Mt CO2e, avec colonnes intermédiaires pour vérification | ✅ Généré, prêt à déposer |

## Colonnes du fichier nettoyé

| Colonne | Description |
|---|---|
| `CodeProvince` | Code à 2 lettres (NL, PE, NS, NB, QC, ON, MB, SK, AB, BC, YT, NT, NU) |
| `NomProvince` | Nom complet |
| `Annee` | 2021, 2022 ou 2023 |
| `Industries_kt` | Valeur brute « Total, industries », en kilotonnes |
| `Menages_kt` | Valeur brute « Total, ménages », en kilotonnes |
| `Total_kt` | Somme des deux, en kilotonnes |
| `Emissions_MtCO2e` | Total_kt ÷ 1000 — valeur destinée à l'import dans PollutionDB |

Les colonnes intermédiaires (`Industries_kt`, `Menages_kt`, `Total_kt`) sont conservées dans le fichier nettoyé pour permettre une vérification directe sans avoir à rouvrir la source — au-delà du strict nécessaire pour l'import, mais utile pour la double vérification exigée en Phase 4 du PGOP.

## Citation

Statistique Canada. Tableau 38-10-0097-01, Compte des flux physiques des émissions de gaz à effet de serre. https://doi.org/10.25318/3810009701-fra
