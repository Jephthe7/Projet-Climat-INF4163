/* =====================================================================
   SQL_PollutionDB_CreateTable_v3.sql
   Base : PollutionDB (instance locale SQL Server Express, puis Azure)
   Réf. : DAT_Projet_Climat_INF4163_v2.docx, section 8.2

   Remplace v2 : le professeur a refusé la période 2021-2023 (message
   Teams du 02/08) et validé 2022-2024 avec une nouvelle source (ECCC,
   Rapport d'inventaire national, au lieu de StatCan). v2 avait donc
   les mauvais noms de table (Pollution2021/2022/2023) — v3 les
   renomme pour correspondre au contenu réel : Pollution2022/2023/2024.

   Ce script commence par SUPPRIMER les 3 anciennes tables (2021/2022/
   2023) si elles existent déjà — nécessaire si tu avais déjà exécuté
   v2 dans SSMS avant ce changement. AuditLog n'est PAS touchée (elle
   ne dépend pas de l'année, inutile de la recréer).

   3 tables, une par année réelle (2022, 2023, 2024).
   Granularité : annuelle. 13 provinces = 13 lignes/table, 39 au total.

   Données complètes pour les 13 provinces (contrairement à
   PrécipitationsDB) : ValeurMoyenne reste NOT NULL, conforme au DAT §8.2.
   ===================================================================== */

-- ============================================================
-- Nettoyage des anciennes tables (v2, période 2021-2023 abandonnée)
-- ============================================================
DROP TABLE IF EXISTS Pollution2021;
DROP TABLE IF EXISTS Pollution2022;
DROP TABLE IF EXISTS Pollution2023;
GO

-- ============================
-- Table 1/3 : Pollution2022
-- ============================
CREATE TABLE Pollution2022 (
    TendanceID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince      CHAR(2)          NOT NULL,
    NomProvince       VARCHAR(50)      NOT NULL,
    ValeurMoyenne     DECIMAL(6,2)     NOT NULL,   -- Mt CO2e (source ECCC, voir data/sources/eccc_inventaire_ges.md)

    CONSTRAINT PK_Pollution2022          PRIMARY KEY (TendanceID),
    CONSTRAINT UQ_Pollution2022_Province UNIQUE (CodeProvince)
);
GO

-- ============================
-- Table 2/3 : Pollution2023
-- ============================
CREATE TABLE Pollution2023 (
    TendanceID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince      CHAR(2)          NOT NULL,
    NomProvince       VARCHAR(50)      NOT NULL,
    ValeurMoyenne     DECIMAL(6,2)     NOT NULL,

    CONSTRAINT PK_Pollution2023          PRIMARY KEY (TendanceID),
    CONSTRAINT UQ_Pollution2023_Province UNIQUE (CodeProvince)
);
GO

-- ============================
-- Table 3/3 : Pollution2024
-- ============================
CREATE TABLE Pollution2024 (
    TendanceID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince      CHAR(2)          NOT NULL,
    NomProvince       VARCHAR(50)      NOT NULL,
    ValeurMoyenne     DECIMAL(6,2)     NOT NULL,

    CONSTRAINT PK_Pollution2024          PRIMARY KEY (TendanceID),
    CONSTRAINT UQ_Pollution2024_Province UNIQUE (CodeProvince)
);
GO

-- ============================================================
-- Table d'audit : deja creee par v2, on ne la recree pas.
-- Ne rien faire ici si elle existe deja (verification seulement).
-- ============================================================
IF OBJECT_ID('AuditLog', 'U') IS NULL
BEGIN
    CREATE TABLE AuditLog (
        AuditID              INT IDENTITY(1,1) NOT NULL,
        NomTable             VARCHAR(50)       NOT NULL,
        AncienneValeur       DECIMAL(6,2)      NULL,
        NouvelleValeur       DECIMAL(6,2)      NULL,
        DateModification     DATETIME2         NOT NULL DEFAULT SYSDATETIME(),

        CONSTRAINT PK_AuditLog_PollutionDB PRIMARY KEY (AuditID)
    );
END
GO
