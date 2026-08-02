/* =====================================================================
   SQL_PollutionDB_CreateTable_v2.sql
   Base : PollutionDB (Azure SQL Database)
   Réf. : DAT_Projet_Climat_INF4163_v1.docx, section 8.2

   Remplace SQL_PollutionDB_CreateTable_v1.sql : v1 nommait les tables
   Pollution2023/2024/2025 par souci de cohérence avec les autres bases,
   alors qu'elles contiennent en réalité les données 2021/2022/2023
   (écart de période documenté dans data/sources/statistique_canada.md).
   Nommer une table "2023" avec du contenu "2021" est trompeur — risque
   concret le jour de la démo si le professeur inspecte la base. v2
   nomme les tables d'après leur contenu réel : Pollution2021/2022/2023.

   3 tables, une par année réelle (2021, 2022, 2023).
   Granularité : annuelle. 13 provinces = 13 lignes/table, 39 au total.

   Données complètes pour les 13 provinces (contrairement à
   PrécipitationsDB) : ValeurMoyenne reste NOT NULL, conforme au DAT §8.2.
   ===================================================================== */

-- ============================
-- Table 1/3 : Pollution2021
-- ============================
CREATE TABLE Pollution2021 (
    TendanceID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince      CHAR(2)          NOT NULL,
    NomProvince       VARCHAR(50)      NOT NULL,
    ValeurMoyenne     DECIMAL(6,2)     NOT NULL,   -- Mt CO2e (équivalent CO2, voir data/sources/statistique_canada.md)

    CONSTRAINT PK_Pollution2021          PRIMARY KEY (TendanceID),
    CONSTRAINT UQ_Pollution2021_Province UNIQUE (CodeProvince)
);
GO

-- ============================
-- Table 2/3 : Pollution2022
-- ============================
CREATE TABLE Pollution2022 (
    TendanceID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince      CHAR(2)          NOT NULL,
    NomProvince       VARCHAR(50)      NOT NULL,
    ValeurMoyenne     DECIMAL(6,2)     NOT NULL,

    CONSTRAINT PK_Pollution2022          PRIMARY KEY (TendanceID),
    CONSTRAINT UQ_Pollution2022_Province UNIQUE (CodeProvince)
);
GO

-- ============================
-- Table 3/3 : Pollution2023
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

-- ============================================================
-- Table d'audit (réplique dans chaque base — voir remarque dans
-- SQL_TemperatureDB_CreateTable_v1.sql)
-- ============================================================
CREATE TABLE AuditLog (
    AuditID              INT IDENTITY(1,1) NOT NULL,
    NomTable             VARCHAR(50)       NOT NULL,
    AncienneValeur       DECIMAL(6,2)      NULL,
    NouvelleValeur       DECIMAL(6,2)      NULL,
    DateModification     DATETIME2         NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT PK_AuditLog_PollutionDB PRIMARY KEY (AuditID)
);
GO
