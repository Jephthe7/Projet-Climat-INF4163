"""
clean_precipitations.py — Calcule le total annuel de precipitations par province.

Entree  : data/raw/[code]_[station]_[annee].csv (donnees quotidiennes, 13 stations x 3 ans)
Sortie  : data/clean/precipitations_clean.csv

Traitement :
1. Lecture de chaque fichier quotidien brut
2. Conversion des virgules decimales en points
3. Somme des precipitations quotidiennes -> total annuel par province
4. Cas particulier documente (voir data/limitations.md) : les stations MB, NS,
   NU, SK et YT ne publient aucune donnee de precipitation (colonne presente mais
   toujours vide). Le total est alors laisse a NULL, jamais estime.

Execution : python clean_precipitations.py
"""

import pandas as pd
import glob
import os
from common import extract_year_from_filename, extract_province_prefix, comma_to_float

RAW_DIR = os.path.join('data', 'raw')
CLEAN_DIR = os.path.join('data', 'clean')
PRECIP_COLUMN = 'Précip. tot. (mm)'


def clean_precipitations(raw_dir=RAW_DIR, clean_dir=CLEAN_DIR):
    files = sorted(glob.glob(os.path.join(raw_dir, '*.csv')))
    files = [f for f in files if 'pollution' not in os.path.basename(f)
             and '_clean' not in os.path.basename(f)]

    rows = []
    skipped = []
    stations_sans_donnees = set()

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
            skipped.append((filename, "format horaire detecte — attendu : donnees quotidiennes"))
            continue

        if PRECIP_COLUMN not in df.columns:
            skipped.append((filename, f"colonne '{PRECIP_COLUMN}' absente"))
            continue

        precip_values = comma_to_float(df[PRECIP_COLUMN])
        n_valid = precip_values.notna().sum()
        n_total = len(precip_values)

        if n_valid == 0:
            # Limite connue et documentee (data/limitations.md) — jamais d'estimation
            precip_total = None
            stations_sans_donnees.add(code)
        else:
            precip_total = round(precip_values.sum(), 2)

        rows.append({
            'CodeProvince': code,
            'NomProvince': nom,
            'Annee': annee,
            'PrecipitationTotale_mm': precip_total,
            'JoursValides': n_valid,
            'JoursTotal': n_total,
        })

    result = pd.DataFrame(rows).sort_values(['CodeProvince', 'Annee']).reset_index(drop=True)

    os.makedirs(clean_dir, exist_ok=True)
    output_path = os.path.join(clean_dir, 'precipitations_clean.csv')
    result.to_csv(output_path, index=False)

    return result, skipped, output_path, stations_sans_donnees


if __name__ == '__main__':
    result, skipped, output_path, sans_donnees = clean_precipitations()
    print(f"{len(result)} lignes ecrites dans {output_path}")
    if sans_donnees:
        print(f"\nProvinces sans donnees de precipitation (voir data/limitations.md) : {sorted(sans_donnees)}")
    if skipped:
        print(f"\n{len(skipped)} fichier(s) ignore(s) :")
        for filename, reason in skipped:
            print(f"  - {filename}: {reason}")
