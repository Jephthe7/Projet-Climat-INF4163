/* =====================================================================
   SQL_PollutionDB_Views_v1.sql
   Base : PollutionDB
   Meme principe que vwTemperature — voir SQL_TemperatureDB_Views_v1.sql
   ===================================================================== */

CREATE OR ALTER VIEW vwPollution AS
SELECT TendanceID, CodeProvince, NomProvince, ValeurMoyenne, 2022 AS Annee FROM Pollution2022
UNION ALL
SELECT TendanceID, CodeProvince, NomProvince, ValeurMoyenne, 2023 FROM Pollution2023
UNION ALL
SELECT TendanceID, CodeProvince, NomProvince, ValeurMoyenne, 2024 FROM Pollution2024;
GO
