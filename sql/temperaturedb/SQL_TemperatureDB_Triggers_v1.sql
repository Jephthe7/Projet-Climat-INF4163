/* =====================================================================
   SQL_TemperatureDB_Triggers_v1.sql
   Base : TemperatureDB
   Réf. : Blueprint_Projet_v1.docx, section 7.2

   2 TYPES de déclencheurs, chacun répété sur les 3 tables de la base
   pour un comportement uniforme (retour d'expérience ami — comportement
   incohérent si seulement certaines tables étaient couvertes) :

   1. trg_Temperature<Annee>_ValidateRange (x3)
      AFTER INSERT, UPDATE — rejette toute température hors de la plage
      réaliste [-60°C, 55°C] en annulant la transaction (ROLLBACK).

   2. trg_Temperature<Annee>_AuditLog (x3)
      AFTER UPDATE uniquement (pas INSERT — une "modification" implique
      une ancienne valeur à comparer, qui n'existe pas pour un premier
      insert). Compare deleted/inserted, n'écrit dans AuditLog que si
      la valeur a réellement changé.
   ===================================================================== */

-- ============================================================
-- trg_Temperature2023_ValidateRange
-- ============================================================
CREATE OR ALTER TRIGGER trg_Temperature2023_ValidateRange
ON Temperature2023
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE TemperatureMoyenne < -60 OR TemperatureMoyenne > 55)
    BEGIN
        RAISERROR('Temperature hors plage realiste (-60C a 55C) refusee.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO

CREATE OR ALTER TRIGGER trg_Temperature2024_ValidateRange
ON Temperature2024
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE TemperatureMoyenne < -60 OR TemperatureMoyenne > 55)
    BEGIN
        RAISERROR('Temperature hors plage realiste (-60C a 55C) refusee.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO

CREATE OR ALTER TRIGGER trg_Temperature2025_ValidateRange
ON Temperature2025
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE TemperatureMoyenne < -60 OR TemperatureMoyenne > 55)
    BEGIN
        RAISERROR('Temperature hors plage realiste (-60C a 55C) refusee.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO

-- ============================================================
-- trg_Temperature2023_AuditLog
-- ============================================================
CREATE OR ALTER TRIGGER trg_Temperature2023_AuditLog
ON Temperature2023
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (NomTable, AncienneValeur, NouvelleValeur, DateModification)
    SELECT 'Temperature2023', d.TemperatureMoyenne, i.TemperatureMoyenne, SYSDATETIME()
    FROM deleted d
    JOIN inserted i ON d.TemperatureID = i.TemperatureID
    WHERE d.TemperatureMoyenne <> i.TemperatureMoyenne;
END
GO

CREATE OR ALTER TRIGGER trg_Temperature2024_AuditLog
ON Temperature2024
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (NomTable, AncienneValeur, NouvelleValeur, DateModification)
    SELECT 'Temperature2024', d.TemperatureMoyenne, i.TemperatureMoyenne, SYSDATETIME()
    FROM deleted d
    JOIN inserted i ON d.TemperatureID = i.TemperatureID
    WHERE d.TemperatureMoyenne <> i.TemperatureMoyenne;
END
GO

CREATE OR ALTER TRIGGER trg_Temperature2025_AuditLog
ON Temperature2025
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (NomTable, AncienneValeur, NouvelleValeur, DateModification)
    SELECT 'Temperature2025', d.TemperatureMoyenne, i.TemperatureMoyenne, SYSDATETIME()
    FROM deleted d
    JOIN inserted i ON d.TemperatureID = i.TemperatureID
    WHERE d.TemperatureMoyenne <> i.TemperatureMoyenne;
END
GO
