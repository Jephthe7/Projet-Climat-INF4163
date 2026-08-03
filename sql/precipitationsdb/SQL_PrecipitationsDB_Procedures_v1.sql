/* =====================================================================
   SQL_PrecipitationsDB_Procedures_v1.sql
   Base : PrecipitationsDB
   Réf. : Blueprint_Projet_v1.docx, section 7.1 (procédures #8 à #11)

   4 procédures :
   8.  sp_GetAnneePlusPluvieuse    — annee avec le total le plus eleve
   9.  sp_GetAnneeMoinsPluvieuse   — idem, la moins pluvieuse
   10. sp_GetProvincePlusPluvieuse  — province la plus pluvieuse en moyenne
   11. sp_GetProvinceMoinsPluvieuse — idem, la moins pluvieuse

   ATTENTION NULL (voir data/limitations.md) : 5 provinces (MB, NS, NU,
   SK, YT) n'ont aucune donnee de precipitation, valeur NULL dans les
   3 tables. Deux consequences traitees explicitement ci-dessous :

   - sp_GetAnnee* (SUM par annee) : SUM ignore les NULL automatiquement,
     aucun traitement special necessaire — la comparaison reste juste
     car ce sont les 5 MEMES provinces qui manquent chaque annee (pas
     de biais d'une annee a l'autre).

   - sp_GetProvince* (AVG par province, TOP 1 trie) : ATTENTION, un
     piege reel ici. En T-SQL, ORDER BY ... ASC place les valeurs NULL
     EN PREMIER. Sans precaution, sp_GetProvinceMoinsPluvieuse
     designerait a tort une des 5 provinces sans donnee comme "la
     moins pluvieuse" (elles n'ont pas 0 mm de pluie, elles n'ont
     simplement pas de mesure). Les deux procedures province excluent
     donc explicitement les provinces sans aucune donnee valide
     (WHERE ValeurMoyenne IS NOT NULL avant le GROUP BY).
   ===================================================================== */

-- ============================================================
-- Procédure 1/4 : sp_GetAnneePlusPluvieuse
-- Annee avec le total de precipitations le plus eleve (SUM ignore les NULL)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetAnneePlusPluvieuse
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        Annee,
        TotalPrecipitationMm
    FROM (
        SELECT 2023 AS Annee, SUM(ValeurMoyenne) AS TotalPrecipitationMm FROM Precipitations2023
        UNION ALL
        SELECT 2024, SUM(ValeurMoyenne) FROM Precipitations2024
        UNION ALL
        SELECT 2025, SUM(ValeurMoyenne) FROM Precipitations2025
    ) AS TotauxParAnnee
    ORDER BY TotalPrecipitationMm DESC;
END
GO

-- ============================================================
-- Procédure 2/4 : sp_GetAnneeMoinsPluvieuse
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetAnneeMoinsPluvieuse
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        Annee,
        TotalPrecipitationMm
    FROM (
        SELECT 2023 AS Annee, SUM(ValeurMoyenne) AS TotalPrecipitationMm FROM Precipitations2023
        UNION ALL
        SELECT 2024, SUM(ValeurMoyenne) FROM Precipitations2024
        UNION ALL
        SELECT 2025, SUM(ValeurMoyenne) FROM Precipitations2025
    ) AS TotauxParAnnee
    ORDER BY TotalPrecipitationMm ASC;
END
GO

-- ============================================================
-- Procédure 3/4 : sp_GetProvincePlusPluvieuse
-- Province avec la moyenne de precipitations la plus elevee.
-- WHERE exclut les provinces sans aucune donnee (voir note en tete
-- de fichier) — necessaire ici par coherence/lisibilite, meme si DESC
-- seul suffirait deja a ecarter les NULL (ils trient en dernier en DESC).
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetProvincePlusPluvieuse
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        CodeProvince,
        NomProvince,
        AVG(ValeurMoyenne) AS PrecipitationMoyenneMm
    FROM (
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Precipitations2023
        UNION ALL
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Precipitations2024
        UNION ALL
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Precipitations2025
    ) AS ToutesLesValeurs
    WHERE ValeurMoyenne IS NOT NULL
    GROUP BY CodeProvince, NomProvince
    ORDER BY PrecipitationMoyenneMm DESC;
END
GO

-- ============================================================
-- Procédure 4/4 : sp_GetProvinceMoinsPluvieuse
-- INDISPENSABLE ici : sans le WHERE, ASC remonterait une province
-- NULL en premier (voir explication en tete de fichier).
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetProvinceMoinsPluvieuse
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        CodeProvince,
        NomProvince,
        AVG(ValeurMoyenne) AS PrecipitationMoyenneMm
    FROM (
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Precipitations2023
        UNION ALL
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Precipitations2024
        UNION ALL
        SELECT CodeProvince, NomProvince, ValeurMoyenne FROM Precipitations2025
    ) AS ToutesLesValeurs
    WHERE ValeurMoyenne IS NOT NULL
    GROUP BY CodeProvince, NomProvince
    ORDER BY PrecipitationMoyenneMm ASC;
END
GO
