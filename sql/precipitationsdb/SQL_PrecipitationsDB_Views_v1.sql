/* =====================================================================
   SQL_PrecipitationsDB_Views_v1.sql
   Base : PrecipitationsDB
   Meme principe que vwTemperature — voir SQL_TemperatureDB_Views_v1.sql
   ValeurMoyenne reste NULL pour les 5 provinces sans donnee (voir
   data/limitations.md), la vue ne fait que combiner, aucun filtrage.
   ===================================================================== */

CREATE OR ALTER VIEW vwPrecipitations AS
SELECT TendanceID, CodeProvince, NomProvince, ValeurMoyenne, 2023 AS Annee FROM Precipitations2023
UNION ALL
SELECT TendanceID, CodeProvince, NomProvince, ValeurMoyenne, 2024 FROM Precipitations2024
UNION ALL
SELECT TendanceID, CodeProvince, NomProvince, ValeurMoyenne, 2025 FROM Precipitations2025;
GO
