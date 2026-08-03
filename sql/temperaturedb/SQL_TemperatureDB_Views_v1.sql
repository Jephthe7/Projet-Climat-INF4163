/* =====================================================================
   SQL_TemperatureDB_Views_v1.sql
   Base : TemperatureDB

   vwTemperature — combine les 3 tables annuelles (UNION ALL) avec une
   colonne Annee, pour permettre a Power BI (mode DirectQuery) un filtre
   par annee sur une seule source, sans passer par une transformation
   Power Query (Append Queries + colonne calculee echoue ou degrade la
   performance en DirectQuery — "query folding" impossible sur ce type
   d'operation). La logique de preparation reste centralisee dans SQL
   Server, reutilisable par l'API si besoin plus tard.
   ===================================================================== */

CREATE OR ALTER VIEW vwTemperature AS
SELECT TemperatureID, CodeProvince, NomProvince, Mois, TemperatureMoyenne, 2023 AS Annee FROM Temperature2023
UNION ALL
SELECT TemperatureID, CodeProvince, NomProvince, Mois, TemperatureMoyenne, 2024 FROM Temperature2024
UNION ALL
SELECT TemperatureID, CodeProvince, NomProvince, Mois, TemperatureMoyenne, 2025 FROM Temperature2025;
GO
