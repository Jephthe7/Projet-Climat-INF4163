/* =====================================================================
   SQL_PrecipitationsDB_CreateTable_v1.sql
   Base : PrécipitationsDB (Azure SQL Database)
   Réf. : DAT_Projet_Climat_INF4163_v1.docx, section 8.2

   3 tables, une par année (2023, 2024, 2025).
   Granularité : annuelle. 13 provinces = 13 lignes/table, 39 au total.

   Écart volontaire par rapport au DAT §8.2 (NOT NULL) : ValeurMoyenne
   est ici NULL-able. Le DAT décrit un schéma "identique" pour
   PollutionDB et PrécipitationsDB avec ValeurMoyenne NOT NULL, mais
   data/limitations.md documente une décision assumée : 5 provinces
   (MB, NS, NU, SK, YT) n'ont aucune donnée de précipitation disponible
   à la source (stations NAVCAN orientées aviation) et sont laissées à
   NULL plutôt qu'estimées. Appliquer NOT NULL ferait échouer l'import
   sur 15 lignes (5 provinces x 3 ans). À reporter dans le DAT §8.2 pour
   que le document distingue explicitement les deux bases sur ce point.
   ===================================================================== */

-- ============================
-- Table 1/3 : Precipitations2023
-- ============================
CREATE TABLE Precipitations2023 (
    TendanceID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince      CHAR(2)          NOT NULL,
    NomProvince       VARCHAR(50)      NOT NULL,
    ValeurMoyenne     DECIMAL(6,2)     NULL,   -- mm ; NULL si aucune donnée à la source (voir data/limitations.md)

    CONSTRAINT PK_Precipitations2023          PRIMARY KEY (TendanceID),
    CONSTRAINT UQ_Precipitations2023_Province UNIQUE (CodeProvince)
);
GO

-- ============================
-- Table 2/3 : Precipitations2024
-- ============================
CREATE TABLE Precipitations2024 (
    TendanceID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince      CHAR(2)          NOT NULL,
    NomProvince       VARCHAR(50)      NOT NULL,
    ValeurMoyenne     DECIMAL(6,2)     NULL,

    CONSTRAINT PK_Precipitations2024          PRIMARY KEY (TendanceID),
    CONSTRAINT UQ_Precipitations2024_Province UNIQUE (CodeProvince)
);
GO

-- ============================
-- Table 3/3 : Precipitations2025
-- ============================
CREATE TABLE Precipitations2025 (
    TendanceID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince      CHAR(2)          NOT NULL,
    NomProvince       VARCHAR(50)      NOT NULL,
    ValeurMoyenne     DECIMAL(6,2)     NULL,

    CONSTRAINT PK_Precipitations2025          PRIMARY KEY (TendanceID),
    CONSTRAINT UQ_Precipitations2025_Province UNIQUE (CodeProvince)
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

    CONSTRAINT PK_AuditLog_PrecipitationsDB PRIMARY KEY (AuditID)
);
GO
