/* =====================================================================
   SQL_PollutionDB_Procedures_v1.sql
   Base : PollutionDB
   Réf. : Blueprint_Projet_v1.docx, section 7.1 (procédures #4 à #7)

   4 procédures :
   4. sp_GetAnneePlusPolluee    — année (2022/2023/2024) avec le plus
      d'émissions totales (somme des 13 provinces)
   5. sp_GetAnneeMoinsPolluee   — idem, la moins polluée
   6. sp_GetProvincePlusPolluee — province avec la moyenne d'émissions
      la plus élevée sur les 3 années
   7. sp_GetProvinceMoinsPolluee — idem, la moins polluée

   Donnees completes pour les 13 provinces (contrairement a
   PrecipitationsDB) : pas de filtrage NULL necessaire ici.
   ===================================================================== */

-- ============================================================
-- Procédure 4/4... (1/4) : sp_GetAnneePlusPolluee
-- Annee avec le total d'emissions le plus eleve (somme des 13 provinces)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetAnneePlusPolluee
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        Annee,
        TotalEmissionsMtCO2e
    FROM (
        SELECT 2022 AS Annee, SUM(ValeurMoyenne) AS TotalEmissionsMtCO2e FROM Pollution2022
        UNION ALL
        SELECT 2023, SUM(ValeurMoyenne) FROM Pollution2023
        UNION ALL
        SELECT 2024, SUM(ValeurMoyenne) FROM Pollution2024
    ) AS TotauxParAnnee
    ORDER BY TotalEmissionsMtCO2e DESC;
END
GO

-- ============================================================
-- Procédure 2/4 : sp_GetAnneeMoinsPolluee
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetAnneeMoinsPolluee
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        Annee,
        TotalEmissionsMtCO2e
    FROM (
        SELECT 2022 AS Annee, SUM(ValeurMoyenne) AS TotalEmissionsMtCO2e FROM Pollution2022
        UNION ALL
        SELECT 2023, SUM(ValeurMoyenne) FROM Pollution2023
        UNION ALL
        SELECT 2024, SUM(ValeurMoyenne) FROM Pollution2024
    ) AS TotauxParAnnee
    ORDER BY TotalEmissionsMtCO2e ASC;
END
GO

-- ============================================================
-- Procédure 3/4 : sp_GetProvincePlusPolluee
-- Province avec la moyenne d'emissions la plus elevee sur 2022-2024
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetProvincePlusPolluee
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        CodeProvince,
        NomProvince,
        AVG(ValeurMoyenne) AS EmissionsMoyennesMtCO2e
    FROM (
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Pollution2022
        UNION ALL
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Pollution2023
        UNION ALL
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Pollution2024
    ) AS ToutesLesValeurs
    GROUP BY CodeProvince, NomProvince
    ORDER BY EmissionsMoyennesMtCO2e DESC;
END
GO

-- ============================================================
-- Procédure 4/4 : sp_GetProvinceMoinsPolluee
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetProvinceMoinsPolluee
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        CodeProvince,
        NomProvince,
        AVG(ValeurMoyenne) AS EmissionsMoyennesMtCO2e
    FROM (
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Pollution2022
        UNION ALL
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Pollution2023
        UNION ALL
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Pollution2024
    ) AS ToutesLesValeurs
    GROUP BY CodeProvince, NomProvince
    ORDER BY EmissionsMoyennesMtCO2e ASC;
END
GO
