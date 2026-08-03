/* =====================================================================
   SQL_PollutionDB_Triggers_v1.sql
   Base : PollutionDB
   Réf. : Blueprint_Projet_v1.docx, section 7.2

   trg_AuditLog uniquement (pas de ValidateRange ici — la plage
   realiste -60/55 est specifique a la temperature). AFTER UPDATE sur
   les 3 tables, meme logique que TemperatureDB.
   ===================================================================== */

CREATE OR ALTER TRIGGER trg_Pollution2022_AuditLog
ON Pollution2022
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (NomTable, AncienneValeur, NouvelleValeur, DateModification)
    SELECT 'Pollution2022', d.ValeurMoyenne, i.ValeurMoyenne, SYSDATETIME()
    FROM deleted d
    JOIN inserted i ON d.TendanceID = i.TendanceID
    WHERE d.ValeurMoyenne <> i.ValeurMoyenne;
END
GO

CREATE OR ALTER TRIGGER trg_Pollution2023_AuditLog
ON Pollution2023
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (NomTable, AncienneValeur, NouvelleValeur, DateModification)
    SELECT 'Pollution2023', d.ValeurMoyenne, i.ValeurMoyenne, SYSDATETIME()
    FROM deleted d
    JOIN inserted i ON d.TendanceID = i.TendanceID
    WHERE d.ValeurMoyenne <> i.ValeurMoyenne;
END
GO

CREATE OR ALTER TRIGGER trg_Pollution2024_AuditLog
ON Pollution2024
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (NomTable, AncienneValeur, NouvelleValeur, DateModification)
    SELECT 'Pollution2024', d.ValeurMoyenne, i.ValeurMoyenne, SYSDATETIME()
    FROM deleted d
    JOIN inserted i ON d.TendanceID = i.TendanceID
    WHERE d.ValeurMoyenne <> i.ValeurMoyenne;
END
GO
