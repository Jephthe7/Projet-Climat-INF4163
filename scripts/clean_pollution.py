"""
clean_pollution.py — Calcule les emissions totales de GES (Mt CO2e) par province.

Entree  : data/raw/pollution_eccc_raw.csv (export brut ECCC, Rapport
          d'inventaire national — GES Econ Can Prov Terr.csv,
          catalogue data-donnees.ec.gc.ca, dossier B-Secteurs-Economiques)
Sortie  : data/clean/pollution_clean.csv

Remplace l'ancienne version basee sur StatCan (tableau 38-10-0097-01,
periode 2021-2023) — le professeur a demande une autre source le 02/08
(voir PGOP Annexe B) car cette periode ne correspondait pas a l'exigence.
Confirmation ecrite du prof (capture Teams, 02/08, 19h26) pour la
nouvelle periode 2022-2024 avec cette source ECCC.

Traitement :
1. Lecture du fichier brut (encodage Windows-1252, structure hierarchique :
   chaque province/annee a plusieurs lignes de detail par secteur/sous-secteur,
   plus UNE ligne totale identifiee par Index == 0)
2. Filtrage sur Index == 0 (ligne totale, quel que soit son libelle exact —
   "Total", "Total provincial de l'inventaire" ou "Total territorial de
   l'inventaire" selon le type de region, verifie non uniforme dans la source)
3. Exclusion de la ligne "Canada" (total national, hors perimetre du projet)
4. Restriction aux 3 annees demandees : 2022, 2023, 2024 (la plus recente
   disponible a la source — 2025 n'existe nulle part au moment de la
   collecte, delai de publication ECCC ~16 mois, prochain rapport ~avril 2027)
5. Conversion kilotonnes -> megatonnes (/1000), coherent avec l'ancienne
   version (Mt CO2e, pas Mt CO2 pur — voir data/sources/eccc_inventaire_ges.md)

Execution : python clean_pollution.py
"""

import pandas as pd
import os
from common import NOM_VERS_CODE

RAW_DIR = os.path.join('data', 'raw')
CLEAN_DIR = os.path.join('data', 'clean')
RAW_FILE = os.path.join(RAW_DIR, 'pollution_eccc_raw.csv')
ANNEES_RETENUES = [2022, 2023, 2024]


def clean_pollution(raw_file=RAW_FILE, clean_dir=CLEAN_DIR):
    df = pd.read_csv(raw_file, encoding='windows-1252')

    # Ligne totale = Index 0, quel que soit le libelle exact de Source
    totaux = df[(df['Index'] == 0) & (df['Année'].isin(ANNEES_RETENUES))].copy()

    # Exclure le total national (garde uniquement les 13 provinces/territoires)
    totaux = totaux[totaux['Région'] != 'Canada']

    # La colonne totale est chargee en texte par pandas (des lignes de detail
    # sectoriel ailleurs dans le fichier contiennent 'x' = donnee supprimee
    # pour confidentialite par ECCC — aucune de nos 39 lignes cibles n'est
    # concernee, verifie, mais la colonne entiere heritait du type texte).
    totaux['Total (kt CO2eq)'] = pd.to_numeric(totaux['Total (kt CO2eq)'], errors='raise')

    rows = []
    provinces_non_reconnues = set()
    for _, ligne in totaux.iterrows():
        code = NOM_VERS_CODE.get(ligne['Région'])
        if code is None:
            provinces_non_reconnues.add(ligne['Région'])
            continue
        rows.append({
            'CodeProvince': code,
            'NomProvince': ligne['Région'],
            'Annee': int(ligne['Année']),
            'Emissions_MtCO2e': round(ligne['Total (kt CO2eq)'] / 1000, 3),
        })

    if provinces_non_reconnues:
        raise ValueError(f"Regions non reconnues dans NOM_VERS_CODE : {provinces_non_reconnues}")

    result = pd.DataFrame(rows).sort_values(['CodeProvince', 'Annee']).reset_index(drop=True)

    # Verification : 13 provinces x 3 annees = 39 lignes attendues
    if len(result) != 39:
        print(f"  /!\\ AVERTISSEMENT : {len(result)} lignes produites (39 attendues)")

    os.makedirs(clean_dir, exist_ok=True)
    output_path = os.path.join(clean_dir, 'pollution_clean.csv')
    result.to_csv(output_path, index=False)

    return result, output_path, ANNEES_RETENUES


if __name__ == '__main__':
    result, output_path, annees = clean_pollution()
    print(f"{len(result)} lignes ecrites dans {output_path}")
    print(f"Annees retenues : {annees}")
