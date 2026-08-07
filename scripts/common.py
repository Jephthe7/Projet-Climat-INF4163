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


# =====================================================================
# Connexion SQL Server — utilise par les scripts import_*.py
# =====================================================================
#
# IMPORTANT : ceci cible l'instance LOCALE (SQL Server Express via SSMS),
# pas Azure. Sur Azure, la chaine de connexion change (authentification
# SQL, pas Windows ; port 1433 ; nom de serveur *.database.windows.net).
# Ne pas reutiliser cette fonction telle quelle pour Azure — Bloc 3,
# plus tard.
#
# Ajuste SERVER_LOCAL si ton instance SQL Server Express a un nom
# different (visible dans SSMS, Explorateur d'objets, tout en haut).

SERVER_LOCAL = r"LAPTOP-G7JDT0PL\SQLEXPRESS"


def get_connection(database):
    """
    Ouvre une connexion pyodbc vers une base locale, en authentification
    Windows (Trusted_Connection) — la meme methode que celle utilisee
    par SSMS quand tu t'y connectais sans mot de passe.

    Necessite : pip install pyodbc --break-system-packages
    Necessite aussi le pilote ODBC "ODBC Driver 17 for SQL Server"
    (ou 18) installe sur la machine — generalement deja present si
    SSMS est installe.
    """
    import pyodbc
    conn_str = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={SERVER_LOCAL};"
        f"DATABASE={database};"
        f"Trusted_Connection=yes;"
    )
    return pyodbc.connect(conn_str)


# ============================================================
# Connexion Azure SQL (migration cloud — voir docs/DAT section Azure)
# ============================================================

import os

SERVER_AZURE = "climat-inf4163-sql.database.windows.net"


def get_connection_azure(database):
    """
    Ouvre une connexion pyodbc vers Azure SQL Database, en authentification
    SQL (login/mot de passe), seule methode supportee par Azure SQL —
    contrairement a get_connection() ci-dessus qui utilise l'authentification
    Windows pour le serveur local.

    Le login et le mot de passe sont lus depuis les variables d'environnement
    AZURE_SQL_USER et AZURE_SQL_PASSWORD, jamais codes en dur ici, pour ne
    jamais risquer de les committer dans Git (meme logique que api/.env).

    A definir avant l'execution, dans le meme terminal PowerShell :
        $env:AZURE_SQL_USER="adminclimat"
        $env:AZURE_SQL_PASSWORD="ton_mot_de_passe"

    Necessite : pip install pyodbc --break-system-packages
    Pilote recommande pour Azure : "ODBC Driver 18 for SQL Server"
    (telechargeable depuis le site Microsoft si pas deja installe).
    """
    import pyodbc

    try:
        user = os.environ["AZURE_SQL_USER"]
        password = os.environ["AZURE_SQL_PASSWORD"]
    except KeyError as e:
        raise RuntimeError(
            f"Variable d'environnement manquante : {e}. "
            f"Definis AZURE_SQL_USER et AZURE_SQL_PASSWORD dans ce terminal "
            f"avant de relancer le script (voir docstring de get_connection_azure)."
        ) from e

    conn_str = (
        f"DRIVER={{ODBC Driver 18 for SQL Server}};"
        f"SERVER={SERVER_AZURE};"
        f"DATABASE={database};"
        f"UID={user};PWD={password};"
        f"Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
    )
    return pyodbc.connect(conn_str)
