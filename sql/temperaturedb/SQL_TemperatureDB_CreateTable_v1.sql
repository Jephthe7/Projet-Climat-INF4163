/* =====================================================================
   SQL_TemperatureDB_CreateTable_v1.sql
   Base : TempératureDB (Azure SQL Database)
   Réf. : DAT_Projet_Climat_INF4163_v1.docx, section 8.1
          PGOP_v3.docx, section 14.1 (conventions de nommage)

   3 tables, une par année (2023, 2024, 2025) — jamais une table unique
   avec colonne Annee (décision confirmée par le professeur, PGOP
   Annexe B, 24/07 — à documenter par écrit, voir remarque de l'équipe).

   Granularité : mensuelle. 13 provinces x 12 mois = 156 lignes/table,
   468 lignes au total sur les 3 tables.

   Écarts volontaires par rapport au DAT §8.1, à reporter dans le DAT :
   - Ajout d'une contrainte UNIQUE (CodeProvince, Mois) par table, pour
     empêcher un doublon d'import silencieux (non demandé explicitement
     par le DAT, mais cohérent avec l'exigence "1 valeur par province et
     par mois").
   ===================================================================== */

-- ============================
-- Table 1/3 : Temperature2023
-- ============================
CREATE TABLE Temperature2023 (
    TemperatureID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince         CHAR(2)          NOT NULL,   -- ex. QC, ON
    NomProvince          VARCHAR(50)      NOT NULL,
    Mois                 TINYINT          NOT NULL,
    TemperatureMoyenne   DECIMAL(5,2)     NOT NULL,   -- vérifiée aussi par trg_Temperature_ValidateRange

    CONSTRAINT PK_Temperature2023             PRIMARY KEY (TemperatureID),
    CONSTRAINT CK_Temperature2023_Mois        CHECK (Mois BETWEEN 1 AND 12),
    CONSTRAINT UQ_Temperature2023_ProvMois    UNIQUE (CodeProvince, Mois)
);
GO

-- ============================
-- Table 2/3 : Temperature2024
-- ============================
CREATE TABLE Temperature2024 (
    TemperatureID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince         CHAR(2)          NOT NULL,
    NomProvince          VARCHAR(50)      NOT NULL,
    Mois                 TINYINT          NOT NULL,
    TemperatureMoyenne   DECIMAL(5,2)     NOT NULL,

    CONSTRAINT PK_Temperature2024             PRIMARY KEY (TemperatureID),
    CONSTRAINT CK_Temperature2024_Mois        CHECK (Mois BETWEEN 1 AND 12),
    CONSTRAINT UQ_Temperature2024_ProvMois    UNIQUE (CodeProvince, Mois)
);
GO

-- ============================
-- Table 3/3 : Temperature2025
-- ============================
CREATE TABLE Temperature2025 (
    TemperatureID       INT IDENTITY(1,1) NOT NULL,
    CodeProvince         CHAR(2)          NOT NULL,
    NomProvince          VARCHAR(50)      NOT NULL,
    Mois                 TINYINT          NOT NULL,
    TemperatureMoyenne   DECIMAL(5,2)     NOT NULL,

    CONSTRAINT PK_Temperature2025             PRIMARY KEY (TemperatureID),
    CONSTRAINT CK_Temperature2025_Mois        CHECK (Mois BETWEEN 1 AND 12),
    CONSTRAINT UQ_Temperature2025_ProvMois    UNIQUE (CodeProvince, Mois)
);
GO

-- ============================================================
-- Table d'audit (réplique dans chaque base — DAT §8.3, voir
-- remarque de l'équipe : "partagée" = structure identique,
-- pas une table physique unique inter-bases)
-- ============================================================
CREATE TABLE AuditLog (
    AuditID              INT IDENTITY(1,1) NOT NULL,
    NomTable             VARCHAR(50)       NOT NULL,
    AncienneValeur       DECIMAL(6,2)      NULL,
    NouvelleValeur       DECIMAL(6,2)      NULL,
    DateModification     DATETIME2         NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT PK_AuditLog_TemperatureDB PRIMARY KEY (AuditID)
);
GO
