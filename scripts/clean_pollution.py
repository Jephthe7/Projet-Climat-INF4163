"""
clean_pollution.py — Calcule les emissions totales de GES (Mt CO2e) par province.

Entree  : data/raw/pollution_statcan_raw.csv (export brut StatCan, tableau 38-10-0097-01)
Sortie  : data/clean/pollution_clean.csv

Traitement :
1. Lecture du fichier brut (format StatCan : en-tete metadonnees sur 8 lignes,
   separateur ';', valeurs en kilotonnes avec espace comme separateur de milliers)
2. La ligne "Geographie" n'est renseignee que sur la premiere sous-ligne
   (Total, industries) ; propagation vers la sous-ligne suivante (Total, menages)
3. Exclusion de la ligne "Canada" (total national, hors perimetre du projet)
4. Somme Industries + Menages par province et par annee = emission totale
5. Conversion kilotonnes -> megatonnes (/1000)
6. Restriction aux 3 dernieres annees disponibles dans le fichier (2021-2023
   au moment de la collecte — voir data/sources/statistique_canada.md pour la
   justification de cet ecart avec les 2 autres bases, qui utilisent 2023-2025)

Execution : python clean_pollution.py
"""

import pandas as pd
import os
from common import NOM_VERS_CODE, space_thousands_to_float

RAW_DIR = os.path.join('data', 'raw')
CLEAN_DIR = os.path.join('data', 'clean')
RAW_FILE = os.path.join(RAW_DIR, 'pollution_statcan_raw.csv')
N_ANNEES_RETENUES = 3  # les N dernieres annees disponibles dans le fichier source


def clean_pollution(raw_file=RAW_FILE, clean_dir=CLEAN_DIR):
    # Ligne 9 (index 8) = en-tete reel : "Geographie";"Secteur";"2019";...;"2023"
    df = pd.read_csv(raw_file, sep=';', skiprows=8, encoding='utf-8-sig')
    df.columns = [c.strip('"') for c in df.columns]

    # La colonne Geographie n'est remplie que sur la 1ere sous-ligne (industries)
    df['Géographie'] = df['Géographie'].ffill()

    # Retire la ligne d'entete d'unite ("Canada" / "Kilotonnes") et le total Canada
    df = df[df['Géographie'] != 'Canada'].reset_index(drop=True)
    df = df[df['Secteur'].isin(['Total, industries', 'Total, ménages'])].reset_index(drop=True)

    year_cols = [c for c in df.columns if c.isdigit()]
    annees_retenues = sorted(year_cols)[-N_ANNEES_RETENUES:]

    for col in annees_retenues:
        df[col] = space_thousands_to_float(df[col])

    rows = []
    for geo, group in df.groupby('Géographie', sort=False):
        code = NOM_VERS_CODE.get(geo)
        if code is None:
            continue  # geographie non reconnue (ne devrait pas arriver)
        for annee in annees_retenues:
            total_kt = group[annee].sum()
            rows.append({
                'CodeProvince': code,
                'NomProvince': geo,
                'Annee': int(annee),
                'Emissions_MtCO2e': round(total_kt / 1000, 3),
            })

    result = pd.DataFrame(rows).sort_values(['CodeProvince', 'Annee']).reset_index(drop=True)

    os.makedirs(clean_dir, exist_ok=True)
    output_path = os.path.join(clean_dir, 'pollution_clean.csv')
    result.to_csv(output_path, index=False)

    return result, output_path, annees_retenues


if __name__ == '__main__':
    result, output_path, annees = clean_pollution()
    print(f"{len(result)} lignes ecrites dans {output_path}")
    print(f"Annees retenues (3 plus recentes disponibles dans la source) : {annees}")
