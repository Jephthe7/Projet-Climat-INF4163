# Power BI — Baromètre Climat Canada

Le fichier `ProjetClimat.pbix` contient trois pages : Température, Pollution et Précipitations.

## Sources

- `TemperatureDB.dbo.vwTemperature`;
- `PollutionDB.dbo.vwPollution`;
- `PrecipitationsDB.dbo.vwPrecipitations`.

Ces vues réunissent les tables annuelles de chaque base et fournissent la colonne `Annee` utilisée dans Power BI.

## Mode de connexion final

Le modèle final utilise le mode **Import**, avec actualisation depuis Azure SQL. Le développement initial avait été réalisé en DirectQuery, mais l'intégration publique était incompatible avec les restrictions du tenant Microsoft 365 de l'UQO.

Le site public utilise donc Chart.js, alimenté dynamiquement par l'API connectée aux mêmes bases Azure SQL. Power BI demeure un tableau de bord complémentaire dans Desktop ou Power BI Service.

## Ouvrir et actualiser

1. Ouvrir `ProjetClimat.pbix` dans Power BI Desktop.
2. Cliquer sur **Actualiser**.
3. Si nécessaire, sélectionner Azure SQL Database et utiliser les identifiants fournis séparément.

Aucun mot de passe n'est stocké dans GitHub.

## Périodes

- Température : 2023–2025;
- Pollution : 2022–2024;
- Précipitations : 2023–2025.

## Limites

- Cinq provinces ou territoires ne disposent pas de mesures de précipitations aux stations retenues; les valeurs restent `NULL`.
- « Publier sur le web » est désactivé par le tenant UQO.
- Le partage Power BI Service peut nécessiter une authentification UQO.

Les preuves se trouvent dans `docs/preuves/powerbi/`.
