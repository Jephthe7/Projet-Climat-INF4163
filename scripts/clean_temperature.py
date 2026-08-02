"""
clean_temperature.py — Calcule la moyenne mensuelle de temperature par province.

Entree  : data/raw/[code]_[station]_[annee].csv (donnees quotidiennes, 13 stations x 3 ans)
Sortie  : data/clean/temperature_monthly_clean.csv (13 provinces x 3 ans x 12 mois = 468 lignes)

Traitement :
1. Lecture de chaque fichier quotidien brut
2. Conversion des virgules decimales en points (format source francais)
3. Calcul de la moyenne mensuelle par province (groupby Province+Annee+Mois),
   sur les jours valides uniquement
4. Conservation du nombre de jours valides/total par mois pour tracabilite

Pourquoi le mensuel plutot que l'annuel directement :
le mensuel est le niveau de detail le plus fin necessaire pour repondre a la
question "mois le plus chaud" (Blueprint 7.1, DAT 8.1). L'annuel peut toujours
etre recalcule a partir du mensuel (GROUP BY CodeProvince, Annee), l'inverse
est impossible sans redescendre au quotidien. Voir PGOP Annexe B (31/07).

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
            skipped.append((filename, "format horaire detecte (colonne 'Date/Heure (HNL)') — attendu : donnees quotidiennes"))
            continue

        if TEMP_COLUMN not in df.columns or 'Mois' not in df.columns:
            skipped.append((filename, f"colonne '{TEMP_COLUMN}' ou 'Mois' absente"))
            continue

        df = df.copy()
        df['TempValue'] = comma_to_float(df[TEMP_COLUMN])
        df['MoisInt'] = pd.to_numeric(df['Mois'], errors='coerce')

        grouped = df.groupby('MoisInt')['TempValue'].agg(['mean', 'count', 'size'])

        for mois in range(1, 13):
            if mois in grouped.index:
                mean_val = round(grouped.loc[mois, 'mean'], 2)
                n_valid = int(grouped.loc[mois, 'count'])
                n_total = int(grouped.loc[mois, 'size'])
            else:
                mean_val = None
                n_valid = 0
                n_total = 0

            rows.append({
                'CodeProvince': code,
                'NomProvince': nom,
                'Annee': annee,
                'Mois': mois,
                'TemperatureMoyenne_C': mean_val,
                'JoursValides': n_valid,
                'JoursTotal': n_total,
            })

    result = pd.DataFrame(rows).sort_values(['CodeProvince', 'Annee', 'Mois']).reset_index(drop=True)

    os.makedirs(clean_dir, exist_ok=True)
    output_path = os.path.join(clean_dir, 'temperature_monthly_clean.csv')
    result.to_csv(output_path, index=False)

    return result, skipped, output_path


if __name__ == '__main__':
    result, skipped, output_path = clean_temperature()
    print(f"{len(result)} lignes ecrites dans {output_path}")
    if skipped:
        print(f"\n{len(skipped)} fichier(s) ignore(s) :")
        for filename, reason in skipped:
            print(f"  - {filename}: {reason}")
