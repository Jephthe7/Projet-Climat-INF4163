/* =====================================================================
   SQL_PrecipitationsDB_Triggers_v1.sql
   Base : PrecipitationsDB
   Réf. : Blueprint_Projet_v1.docx, section 7.2

   trg_AuditLog sur les 3 tables, meme logique que les 2 autres bases,
   MAIS avec une difference importante : ValeurMoyenne peut etre NULL
   ici (5 provinces sans donnee, voir data/limitations.md), contrairement
   a TemperatureDB et PollutionDB.

   Piege evite : `d.ValeurMoyenne <> i.ValeurMoyenne` renvoie UNKNOWN
   (pas TRUE) des qu'une des deux valeurs est NULL — un WHERE base
   uniquement sur <> ignorerait donc silencieusement le jour ou
   quelqu'un comble une valeur manquante (NULL -> valeur reelle), qui
   est justement le genre de modification qu'on veut absolument tracer
   dans l'audit. La condition ci-dessous traite explicitement les 3 cas
   (NULL -> valeur, valeur -> NULL, valeur -> valeur differente).
   ===================================================================== */

CREATE OR ALTER TRIGGER trg_Precipitations2023_AuditLog
ON Precipitations2023
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (NomTable, AncienneValeur, NouvelleValeur, DateModification)
    SELECT 'Precipitations2023', d.ValeurMoyenne, i.ValeurMoyenne, SYSDATETIME()
    FROM deleted d
    JOIN inserted i ON d.TendanceID = i.TendanceID
    WHERE (d.ValeurMoyenne IS NULL AND i.ValeurMoyenne IS NOT NULL)
       OR (d.ValeurMoyenne IS NOT NULL AND i.ValeurMoyenne IS NULL)
       OR (d.ValeurMoyenne IS NOT NULL AND i.ValeurMoyenne IS NOT NULL AND d.ValeurMoyenne <> i.ValeurMoyenne);
END
GO

CREATE OR ALTER TRIGGER trg_Precipitations2024_AuditLog
ON Precipitations2024
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (NomTable, AncienneValeur, NouvelleValeur, DateModification)
    SELECT 'Precipitations2024', d.ValeurMoyenne, i.ValeurMoyenne, SYSDATETIME()
    FROM deleted d
    JOIN inserted i ON d.TendanceID = i.TendanceID
    WHERE (d.ValeurMoyenne IS NULL AND i.ValeurMoyenne IS NOT NULL)
       OR (d.ValeurMoyenne IS NOT NULL AND i.ValeurMoyenne IS NULL)
       OR (d.ValeurMoyenne IS NOT NULL AND i.ValeurMoyenne IS NOT NULL AND d.ValeurMoyenne <> i.ValeurMoyenne);
END
GO

CREATE OR ALTER TRIGGER trg_Precipitations2025_AuditLog
ON Precipitations2025
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (NomTable, AncienneValeur, NouvelleValeur, DateModification)
    SELECT 'Precipitations2025', d.ValeurMoyenne, i.ValeurMoyenne, SYSDATETIME()
    FROM deleted d
    JOIN inserted i ON d.TendanceID = i.TendanceID
    WHERE (d.ValeurMoyenne IS NULL AND i.ValeurMoyenne IS NOT NULL)
       OR (d.ValeurMoyenne IS NOT NULL AND i.ValeurMoyenne IS NULL)
       OR (d.ValeurMoyenne IS NOT NULL AND i.ValeurMoyenne IS NOT NULL AND d.ValeurMoyenne <> i.ValeurMoyenne);
END
GO
