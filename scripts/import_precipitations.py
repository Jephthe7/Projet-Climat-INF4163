"""
import_precipitations.py — Importe data/clean/precipitations_clean.csv
dans les 3 tables de PrecipitationsDB (une par annee).

Particularite par rapport a import_temperature.py : 5 provinces
(MB, NS, NU, SK, YT) ont une valeur manquante (chaine vide dans le CSV)
plutot qu'une estimation — voir data/limitations.md. Ce script convertit
la chaine vide en NULL SQL, conformement au schema (ValeurMoyenne est
NULL-able dans PrecipitationsDB, contrairement a PollutionDB — voir
DAT section 8.2, note du 02/08).

Prerequis / execution : identique a import_temperature.py.
"""

import csv
from pathlib import Path
from common import get_connection_azure

CSV_PATH = Path(__file__).parent.parent / "data" / "clean" / "precipitations_clean.csv"
DATABASE = "PrecipitationsDB"
ANNEES_ATTENDUES = [2023, 2024, 2025]
PROVINCES_SANS_DONNEES = {"MB", "NS", "NU", "SK", "YT"}  # voir data/limitations.md


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

            valeur_brute = ligne["PrecipitationTotale_mm"].strip()
            code_province = ligne["CodeProvince"]

            if valeur_brute == "":
                if code_province not in PROVINCES_SANS_DONNEES:
                    raise ValueError(
                        f"Valeur manquante inattendue pour {code_province} {annee} "
                        f"— cette province ne figure pas dans PROVINCES_SANS_DONNEES"
                    )
                valeur = None
            else:
                valeur = float(valeur_brute)

            par_annee[annee].append((
                code_province,
                ligne["NomProvince"],
                valeur,
            ))
    return par_annee


def importer():
    par_annee = lire_csv_par_annee()

    for annee in ANNEES_ATTENDUES:
        lignes = par_annee[annee]
        if len(lignes) != 13:
            print(f"  /!\\ AVERTISSEMENT : {len(lignes)} lignes pour {annee} (13 attendues)")
        n_null = sum(1 for l in lignes if l[2] is None)
        if n_null != len(PROVINCES_SANS_DONNEES):
            print(f"  /!\\ AVERTISSEMENT : {n_null} valeurs NULL pour {annee} "
                  f"({len(PROVINCES_SANS_DONNEES)} attendues)")

    conn = get_connection_azure(DATABASE)
    cursor = conn.cursor()

    try:
        for annee in ANNEES_ATTENDUES:
            table = f"Precipitations{annee}"
            lignes = par_annee[annee]

            cursor.execute(f"TRUNCATE TABLE {table}")

            cursor.executemany(
                f"INSERT INTO {table} (CodeProvince, NomProvince, ValeurMoyenne) "
                f"VALUES (?, ?, ?)",
                lignes,
            )
            conn.commit()
            print(f"{table} : {len(lignes)} lignes importees "
                  f"({sum(1 for l in lignes if l[2] is None)} NULL)")

        print("\nImport PrecipitationsDB termine — 39 lignes au total sur les 3 tables.")

    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    importer()
