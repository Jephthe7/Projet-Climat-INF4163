/* =====================================================================
   SQL_TemperatureDB_Procedures_v1.sql
   Base : TemperatureDB
   Réf. : Blueprint_Projet_v1.docx, section 7.1 (procédures #1 à #3)
          PGOP_v5.docx, section 4.3 (questions analytiques)

   3 procédures :
   1. sp_GetAnneeMoisPlusChaud    — année ET mois les plus chauds (1990
      requête combinée, pas 2 — voir la correction documentée dans le
      Blueprint : l'ancien item #12 séparé était redondant)
   2. sp_GetProvincePlusChaude    — province la plus chaude, moyenne sur
      les 3 années x 12 mois (36 valeurs par province)
   3. sp_GetProvinceMoinsChaude   — idem, la moins chaude

   Aucune donnee NULL possible dans TemperatureDB (contrairement a
   PrecipitationsDB) : pas de filtrage NULL necessaire ici.
   ===================================================================== */

-- ============================================================
-- Procédure 1/3 : sp_GetAnneeMoisPlusChaud
-- Le mois le plus chaud, tous province/année confondues (1 seule ligne)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetAnneeMoisPlusChaud
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        Annee,
        Mois,
        CodeProvince,
        NomProvince,
        TemperatureMoyenne
    FROM (
        SELECT 2023 AS Annee, Mois, CodeProvince, NomProvince, TemperatureMoyenne FROM Temperature2023
        UNION ALL
        SELECT 2024, Mois, CodeProvince, NomProvince, TemperatureMoyenne FROM Temperature2024
        UNION ALL
        SELECT 2025, Mois, CodeProvince, NomProvince, TemperatureMoyenne FROM Temperature2025
    ) AS ToutesLesMesures
    ORDER BY TemperatureMoyenne DESC;
END
GO

-- ============================================================
-- Procédure 2/3 : sp_GetProvincePlusChaude
-- Province avec la temperature moyenne la plus elevee (toutes annees/mois confondus)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetProvincePlusChaude
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        CodeProvince,
        NomProvince,
        AVG(TemperatureMoyenne) AS TemperatureMoyenneGlobale
    FROM (
        SELECT CodeProvince, NomProvince, TemperatureMoyenne FROM Temperature2023
        UNION ALL
        SELECT CodeProvince, NomProvince, TemperatureMoyenne FROM Temperature2024
        UNION ALL
        SELECT CodeProvince, NomProvince, TemperatureMoyenne FROM Temperature2025
    ) AS ToutesLesMesures
    GROUP BY CodeProvince, NomProvince
    ORDER BY TemperatureMoyenneGlobale DESC;
END
GO

-- ============================================================
-- Procédure 3/3 : sp_GetProvinceMoinsChaude
-- Idem, la province la plus froide en moyenne
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetProvinceMoinsChaude
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        CodeProvince,
        NomProvince,
        AVG(TemperatureMoyenne) AS TemperatureMoyenneGlobale
    FROM (
        SELECT CodeProvince, NomProvince, TemperatureMoyenne FROM Temperature2023
        UNION ALL
        SELECT CodeProvince, NomProvince, TemperatureMoyenne FROM Temperature2024
        UNION ALL
        SELECT CodeProvince, NomProvince, TemperatureMoyenne FROM Temperature2025
    ) AS ToutesLesMesures
    GROUP BY CodeProvince, NomProvince
    ORDER BY TemperatureMoyenneGlobale ASC;
END
GO
