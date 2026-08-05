# Power BI — Projet Climat INF4163

## Structure

```
powerbi/
├── ProjetClimat.pbix
└── README.md
```

## Fichier

`ProjetClimat.pbix` — rapport Power BI Desktop, 3 pages (Température, Pollution, Précipitations),
connecté en **DirectQuery** (connexion live, pas un export statique — voir PGOP section 4.2 :
*« un export statique ne satisferait pas l'exigence 'affichage en direct' »*, et bonus +5%,
PGOP section 4.4).

## Pourquoi 3 vues SQL plutôt que 9 tables directement

Chaque base contient 3 tables annuelles (ex. `Temperature2023`, `Temperature2024`,
`Temperature2025`). Pour permettre un seul filtre "Année" au lieu de jongler avec 3 tables
séparées, une vue SQL combine les 3 avec `UNION ALL` :

- `vwTemperature` (TemperatureDB)
- `vwPollution` (PollutionDB)
- `vwPrecipitations` (PrecipitationsDB)

Voir `sql/*/SQL_*_Views_v1.sql` pour le code exact.

**Pourquoi des vues SQL et pas une fusion dans Power Query** (Append Queries) : en mode
DirectQuery, Power BI doit traduire chaque transformation en requête SQL équivalente
(« query folding »). Ajouter une colonne calculée puis fusionner plusieurs tables DirectQuery
via Power Query est le genre d'opération qui échoue ou dégrade la performance. Une vue SQL
évite complètement ce problème : c'est un objet natif de la base, nativement compatible
DirectQuery, sans transformation côté Power BI.

## Connexion

- **Serveur** : `localhost` (SQL Server Express, local pour l'instant — voir note Azure ci-dessous)
- **Authentification** : SQL Server, compte dédié en lecture seule (le même que celui utilisé
  par l'API — accès limité à `db_datareader` + `EXECUTE`, jamais les identifiants du compte
  personnel)
- **Mode** : DirectQuery (jamais Import — vérifiable en bas de l'écran Power BI : « Storage Mode:
  DirectQuery »)

## Contenu des 3 pages

| Page | Source | Visuels | Filtres |
|---|---|---|---|
| Température | `vwTemperature` | Graphique à barres (moyenne par province) | Slicer Année, Slicer Province |
| Pollution | `vwPollution` | Graphique à barres (moyenne par province, Mt CO2e) | Slicer Année, Slicer Province |
| Précipitations | `vwPrecipitations` | Graphique à barres (moyenne par province, mm) + note sur les données manquantes | Slicer Année, Slicer Province |

## Point d'attention — précipitations manquantes

5 provinces/territoires (Manitoba, Nouvelle-Écosse, Nunavut, Saskatchewan, Yukon) n'ont aucune
donnée de précipitation à la source (valeur `NULL` en base, jamais estimée — voir
`data/limitations.md`). La page Précipitations inclut une note textuelle visible pour éviter
qu'un lecteur interprète leur absence du graphique comme « 0 mm de pluie ».

## Pourquoi ce n'est pas encore publié/intégré au site (normal, pas un oubli)

Le DAT prévoit une intégration du rapport Power BI dans le frontend via iframe (Power BI
Service, en ligne). Ça nécessite soit une passerelle de données (Gateway) pour interroger une
base locale depuis Power BI Service — lourd à maintenir en continu — soit une base déjà sur
Azure SQL. Décision assumée : attendre la migration Azure (prévue une seule fois, une fois tout
validé en local) avant de publier et d'intégrer, plutôt que de mettre en place une passerelle
temporaire qui sera de toute façon jetée après la migration.

Séquence prévue : Power BI Desktop (fait) → migration Azure SQL → reconnexion Power BI vers
Azure → publication Power BI Service → intégration iframe dans le frontend.

## Pour répondre aux questions du professeur

- « Pourquoi DirectQuery et pas Import ? » → Exigence explicite de l'énoncé (affichage en
  direct) + bonus. Import aurait figé les données au moment du chargement.
- « Pourquoi des vues plutôt que les tables brutes ? » → Compatibilité DirectQuery (voir
  section ci-dessus), logique de préparation centralisée dans SQL Server plutôt que dupliquée
  dans l'outil de visualisation.
- « Pourquoi le Manitoba n'a pas de barre sur le graphique Précipitations ? » → Donnée
  manquante à la source, documentée, jamais estimée — voir la note sur la page et
  `data/limitations.md`.
