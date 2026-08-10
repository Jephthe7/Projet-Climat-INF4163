"""
import_temperature.py — Importe data/clean/temperature_monthly_clean.csv
dans les 3 tables de TemperatureDB (une par annee).

Le CSV contient les 3 annees melangees (468 lignes) ; ce script les
repartit : lignes Annee=2023 -> table Temperature2023, etc.

Prerequis : les 3 bases + 9 tables + AuditLog doivent deja exister
(SQL_CreateDatabases_Local_v1.sql + les 3 scripts CREATE TABLE executes
dans SSMS — voir historique de la conversation).

Execution : python import_temperature.py
(a lancer depuis le dossier scripts/, avec pyodbc installe)

Comportement en cas de re-execution : le script vide d'abord chaque
table cible (TRUNCATE) avant de reinserer, pour rester idempotent —
sans ca, relancer le script deux fois dupliquerait toutes les lignes.
"""

import csv
from pathlib import Path
from common import get_connection_azure

CSV_PATH = Path(__file__).parent.parent / "data" / "clean" / "temperature_monthly_clean.csv"
DATABASE = "TemperatureDB"
ANNEES_ATTENDUES = [2023, 2024, 2025]


def lire_csv_par_annee():
    """Lit le CSV nettoye et regroupe les lignes par annee."""
    par_annee = {annee: [] for annee in ANNEES_ATTENDUES}
    with open(CSV_PATH, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for ligne in reader:
            annee = int(ligne["Annee"])
            if annee not in par_annee:
                raise ValueError(
                    f"Annee inattendue dans le CSV : {annee} "
                    f"(attendu : {ANNEES_ATTENDUES})"
                )
            par_annee[annee].append((
                ligne["CodeProvince"],
                ligne["NomProvince"],
                int(ligne["Mois"]),
                float(ligne["TemperatureMoyenne_C"]),
            ))
    return par_annee


def importer():
    par_annee = lire_csv_par_annee()

    for annee in ANNEES_ATTENDUES:
        lignes = par_annee[annee]
        if len(lignes) != 156:
            print(f"  /!\\ AVERTISSEMENT : {len(lignes)} lignes pour {annee} (156 attendues)")

    conn = get_connection_azure(DATABASE)
    cursor = conn.cursor()

    try:
        for annee in ANNEES_ATTENDUES:
            table = f"Temperature{annee}"
            lignes = par_annee[annee]

            cursor.execute(f"TRUNCATE TABLE {table}")

            cursor.executemany(
                f"INSERT INTO {table} (CodeProvince, NomProvince, Mois, TemperatureMoyenne) "
                f"VALUES (?, ?, ?, ?)",
                lignes,
            )
            conn.commit()
            print(f"{table} : {len(lignes)} lignes importees")

        print("\nImport TemperatureDB termine — 468 lignes au total sur les 3 tables.")

    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    importer()
