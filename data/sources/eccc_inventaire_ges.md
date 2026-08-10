# Source — Environnement et Changement climatique Canada (ECCC)

## Rôle de ce document

Documente la provenance des données de pollution utilisées pour PollutionDB,
avec une traçabilité complète entre la source officielle et la valeur finale
importée en base — condition explicite de la charte qualité du PGOP
(section 8.1, critère « documenté »).

Remplace `statistique_canada.md` (archivé, voir note en bas de ce document) —
changement de source demandé par le professeur le 02/08 (voir PGOP, Annexe B).

## Source

| Champ | Valeur |
|---|---|
| Fournisseur | Environnement et Changement climatique Canada (ECCC) |
| Jeu de données | Inventaire officiel des gaz à effet de serre du Canada — Rapport d'inventaire national (RIN), secteurs économiques par province/territoire |
| Fichier | `GES Econ Can Prov Terr.csv` |
| Lien catalogue | https://ouvert.canada.ca/data/fr/dataset/779c7bcf-4982-47eb-af1b-a33618a05e5b |
| Lien dépôt de données | https://data-donnees.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/?lang=fr (dossier B-Secteurs-Economiques) |
| Licence | Licence du gouvernement ouvert – Canada |
| Fréquence de mise à jour | Annuelle |
| Date de publication de la version consultée | 2026-04-14 |
| Couverture temporelle de la source | 1990–2024 |
| Géographie couverte | Canada, provinces et territoires |

## Pourquoi ce changement de source

L'énoncé demande 2023-2025 pour les trois bases. La période initialement
retenue pour PollutionDB (StatCan, 2021-2023) a été refusée par le
professeur le 02/08/2026 (message Teams, capture conservée) :
*« Bien vouloir chercher une autre source. Il y en a plusieurs. »*

Recherche effectuée le 02/08 : le Rapport d'inventaire national d'ECCC
(source fédérale officielle, plus autoritaire que le tableau StatCan utilisé
précédemment) a été identifié comme alternative, publié le 14 avril 2026
et couvrant jusqu'à 2024 — soit une année plus récente que StatCan.

**Contrainte structurelle, indépendante du choix de source** : aucune
donnée d'émissions de GES par province pour l'année 2025 n'existe
actuellement nulle part au Canada. Le délai de publication standard
d'ECCC est d'environ 16 mois après la fin de l'année couverte ; les
données 2025 ne seront publiées qu'au printemps 2027, après l'échéance
du projet.

**Décision retenue, confirmée par écrit par le professeur (02/08/2026,
19h26, capture Teams conservée)** : PollutionDB utilise la période
**2022-2024** (au lieu de 2021-2023 précédemment, et de 2023-2025 comme
dans l'énoncé initial). TempératureDB et PrécipitationsDB conservent
2023-2025, sans changement.

## Unité et méthode de calcul — traçabilité complète

Le fichier source exprime les émissions en **kilotonnes de GES en
équivalent CO2 (kt CO2eq)** — cohérent avec l'ancienne source StatCan sur
ce point (Mt CO2e, pas Mt de CO2 pur, comme corrigé dans le DAT section 8.2).

Le fichier a une structure hiérarchique détaillée (une ligne par
combinaison province/année/secteur/sous-secteur/sous-sous-secteur), avec
une seule ligne « totale » par province et par année, identifiable par la
colonne `Index = 0` (le libellé de la colonne `Source` associée n'est pas
uniforme : `Total`, `Total provincial de l'inventaire` ou `Total
territorial de l'inventaire` selon le type de région — filtrer sur
`Index`, pas sur le texte de `Source`).

**Traitement appliqué, pour chaque province et chaque année (2022, 2023, 2024) :**

```
1. Filtrer Index == 0 (ligne totale)
2. Exclure la ligne "Canada" (total national, hors périmètre)
3. Emissions_MtCO2e = Total (kt CO2eq) / 1000
```

**Exemple vérifiable (Alberta, 2023)** :
```
Total (kt CO2eq) : 260 081.1398
÷ 1000            : 260.081 Mt CO2e
```

Point de vigilance identifié pendant le nettoyage : certaines lignes de
détail sectoriel du fichier source contiennent la valeur `x` (donnée
supprimée par ECCC pour raisons de confidentialité statistique). Aucune
des 39 lignes totales utilisées (13 provinces × 3 années) n'est concernée
— vérifié explicitement avant l'agrégation, pas supposé.

## Fichiers livrés

| Fichier | Contenu | Statut |
|---|---|---|
| `data/raw/pollution_eccc_raw.csv` | Export brut du dépôt ECCC, non modifié, tel que téléchargé | ✅ Fait |
| `data/clean/pollution_clean.csv` | Lignes totales agrégées, converties en Mt CO2e | ✅ Fait |

## Colonnes du fichier nettoyé

| Colonne | Description |
|---|---|
| `CodeProvince` | Code à 2 lettres (NL, PE, NS, NB, QC, ON, MB, SK, AB, BC, YT, NT, NU) |
| `NomProvince` | Nom complet |
| `Annee` | 2022, 2023 ou 2024 |
| `Emissions_MtCO2e` | Total (kt CO2eq) ÷ 1000 — valeur destinée à l'import dans PollutionDB |

## Citation

Environnement et Changement climatique Canada. Inventaire officiel des gaz
à effet de serre du Canada — Rapport d'inventaire national, secteurs
économiques par province/territoire. https://ouvert.canada.ca/data/fr/dataset/779c7bcf-4982-47eb-af1b-a33618a05e5b

## Note sur l'ancienne source (StatCan, archivée)

`statistique_canada.md` documentait la source précédente (tableau
38-10-0097-01, période 2021-2023), abandonnée suite au refus du
professeur. Conservé dans l'historique Git pour traçabilité complète des
décisions (exigence PGOP section 8.1), mais ne reflète plus l'état actuel
du projet — s'y référer serait une erreur.
