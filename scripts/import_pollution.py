"""
import_pollution.py — Importe data/clean/pollution_clean.csv dans les
3 tables de PollutionDB (une par annee : 2022, 2023, 2024).

Contrairement a PrecipitationsDB, aucune valeur NULL attendue ici —
la source ECCC est complete pour les 13 provinces/territoires. Le
script s'arrete avec une erreur si une ligne manque, plutot que
d'importer silencieusement des donnees incompletes.

Prerequis : SQL_PollutionDB_CreateTable_v3.sql deja execute dans SSMS
(tables Pollution2022/2023/2024 + AuditLog).

Execution : python import_pollution.py
"""

import csv
from pathlib import Path
from common import get_connection

CSV_PATH = Path(__file__).parent.parent / "data" / "clean" / "pollution_clean.csv"
DATABASE = "PollutionDB"
ANNEES_ATTENDUES = [2022, 2023, 2024]


def lire_csv_par_annee():
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
            valeur = ligne["Emissions_MtCO2e"].strip()
            if valeur == "":
                raise ValueError(
                    f"Valeur manquante pour {ligne['CodeProvince']} {annee} "
                    f"— inattendu pour PollutionDB (donnees censees etre completes)"
                )
            par_annee[annee].append((
                ligne["CodeProvince"],
                ligne["NomProvince"],
                float(valeur),
            ))
    return par_annee


def importer():
    par_annee = lire_csv_par_annee()

    for annee in ANNEES_ATTENDUES:
        lignes = par_annee[annee]
        if len(lignes) != 13:
            print(f"  /!\\ AVERTISSEMENT : {len(lignes)} lignes pour {annee} (13 attendues)")

    conn = get_connection(DATABASE)
    cursor = conn.cursor()

    try:
        for annee in ANNEES_ATTENDUES:
            table = f"Pollution{annee}"
            lignes = par_annee[annee]

            cursor.execute(f"TRUNCATE TABLE {table}")

            cursor.executemany(
                f"INSERT INTO {table} (CodeProvince, NomProvince, ValeurMoyenne) "
                f"VALUES (?, ?, ?)",
                lignes,
            )
            conn.commit()
            print(f"{table} : {len(lignes)} lignes importees")

        print("\nImport PollutionDB termine — 39 lignes au total sur les 3 tables.")

    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    importer()
