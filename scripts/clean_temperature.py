"""
clean_temperature.py — Calcule la moyenne annuelle de temperature par province.

Entree  : data/raw/[code]_[station]_[annee].csv (donnees quotidiennes, 13 stations x 3 ans)
Sortie  : data/clean/temperature_clean.csv

Traitement :
1. Lecture de chaque fichier quotidien brut
2. Conversion des virgules decimales en points (format source francais)
3. Calcul de la moyenne annuelle par province, sur les jours valides uniquement
4. Conservation du nombre de jours valides/total pour tracabilite

Execution : python clean_temperature.py
(a lancer depuis la racine du depot, ou ajuster RAW_DIR/CLEAN_DIR ci-dessous)
"""

import pandas as pd
import glob
import os
from common import extract_year_from_filename, extract_province_prefix, comma_to_float

RAW_DIR = os.path.join('data', 'raw')
CLEAN_DIR = os.path.join('data', 'clean')
TEMP_COLUMN = 'Temp moy.(°C)'


def clean_temperature(raw_dir=RAW_DIR, clean_dir=CLEAN_DIR):
    files = sorted(glob.glob(os.path.join(raw_dir, '*.csv')))
    files = [f for f in files if 'pollution' not in os.path.basename(f)
             and '_clean' not in os.path.basename(f)]

    rows = []
    skipped = []

    for filepath in files:
        filename = os.path.basename(filepath)
        province = extract_province_prefix(filename)
        annee = extract_year_from_filename(filename)

        if province is None or annee is None:
            skipped.append((filename, "prefixe province ou annee non reconnu"))
            continue

        code, nom = province
        df = pd.read_csv(filepath, encoding='utf-8-sig')

        if 'Date/Heure' not in df.columns:
            # Cas connu : donnees horaires au lieu de quotidiennes (ex. Iqaluit avant correction)
            skipped.append((filename, "format horaire detecte (colonne 'Date/Heure (HNL)') — attendu : donnees quotidiennes"))
            continue

        if TEMP_COLUMN not in df.columns:
            skipped.append((filename, f"colonne '{TEMP_COLUMN}' absente"))
            continue

        temp_values = comma_to_float(df[TEMP_COLUMN])
        n_valid = temp_values.notna().sum()
        n_total = len(temp_values)
        temp_mean = round(temp_values.mean(), 2) if n_valid > 0 else None

        rows.append({
            'CodeProvince': code,
            'NomProvince': nom,
            'Annee': annee,
            'TemperatureMoyenne_C': temp_mean,
            'JoursValides': n_valid,
            'JoursTotal': n_total,
        })

    result = pd.DataFrame(rows).sort_values(['CodeProvince', 'Annee']).reset_index(drop=True)

    os.makedirs(clean_dir, exist_ok=True)
    output_path = os.path.join(clean_dir, 'temperature_clean.csv')
    result.to_csv(output_path, index=False)

    return result, skipped, output_path


if __name__ == '__main__':
    result, skipped, output_path = clean_temperature()
    print(f"{len(result)} lignes ecrites dans {output_path}")
    if skipped:
        print(f"\n{len(skipped)} fichier(s) ignore(s) :")
        for filename, reason in skipped:
            print(f"  - {filename}: {reason}")
