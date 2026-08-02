"""
common.py — Fonctions partagées par les scripts de nettoyage du projet.

Utilisé par : clean_temperature.py, clean_precipitations.py, clean_pollution.py

Convention respectée dans tout le pipeline :
- Entrée  : data/raw/   (fichiers bruts, jamais modifiés)
- Sortie  : data/clean/ (fichiers prets pour l'import SQL)
"""

import re

# Correspondance prefixe de fichier -> (CodeProvince, NomProvince)
# Utilise pour les fichiers meteo (data/raw/[prefixe]_[annee].csv)
CODE_PROVINCE = {
    'nl': ('NL', 'Terre-Neuve-et-Labrador'),
    'pe': ('PE', 'Île-du-Prince-Édouard'),
    'ns': ('NS', 'Nouvelle-Écosse'),
    'nb': ('NB', 'Nouveau-Brunswick'),
    'qc': ('QC', 'Québec'),
    'on': ('ON', 'Ontario'),
    'mb': ('MB', 'Manitoba'),
    'sk': ('SK', 'Saskatchewan'),
    'ab': ('AB', 'Alberta'),
    'bc': ('BC', 'Colombie-Britannique'),
    'yt': ('YT', 'Yukon'),
    'nt': ('NT', 'Territoires du Nord-Ouest'),
    'nu': ('NU', 'Nunavut'),
}

# Correspondance nom complet StatCan -> CodeProvince
# Utilise pour le fichier pollution (noms en toutes lettres dans la source)
NOM_VERS_CODE = {
    'Terre-Neuve-et-Labrador': 'NL',
    'Île-du-Prince-Édouard': 'PE',
    'Nouvelle-Écosse': 'NS',
    'Nouveau-Brunswick': 'NB',
    'Québec': 'QC',
    'Ontario': 'ON',
    'Manitoba': 'MB',
    'Saskatchewan': 'SK',
    'Alberta': 'AB',
    'Colombie-Britannique': 'BC',
    'Yukon': 'YT',
    'Territoires du Nord-Ouest': 'NT',
    'Nunavut': 'NU',
}


def extract_year_from_filename(filename):
    """Extrait l'annee (4 chiffres) a la fin d'un nom de fichier meteo."""
    m = re.search(r'_(\d{4})\.csv$', filename)
    return int(m.group(1)) if m else None


def extract_province_prefix(filename):
    """Extrait le prefixe de province (2 lettres) au debut du nom de fichier."""
    prefix = filename.split('_')[0]
    return CODE_PROVINCE.get(prefix)


def comma_to_float(series):
    """
    Convertit une colonne de nombres au format français (virgule decimale,
    ex. '51,12') en valeurs numeriques exploitables (51.12).
    Les valeurs non convertibles (texte, vide) deviennent NaN.
    """
    import pandas as pd
    return pd.to_numeric(series.astype(str).str.replace(',', '.', regex=False), errors='coerce')


def space_thousands_to_float(series):
    """
    Convertit une colonne de nombres StatCan (espace comme separateur de
    milliers, ex. '118 464') en valeurs numeriques.
    """
    import pandas as pd
    return pd.to_numeric(
        series.astype(str).str.replace('\xa0', '', regex=False).str.replace(' ', '', regex=False),
        errors='coerce'
    )
