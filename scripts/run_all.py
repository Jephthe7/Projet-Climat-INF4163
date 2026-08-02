"""
run_all.py — Orchestre les 3 scripts de nettoyage et genere un rapport recapitulatif.

Execution : python run_all.py
(a lancer depuis la racine du depot)

Genere :
- data/clean/temperature_clean.csv
- data/clean/precipitations_clean.csv
- data/clean/pollution_clean.csv
- data/clean/cleaning_report.md   (recapitulatif cite dans le rapport final)
"""

from datetime import datetime
from clean_temperature import clean_temperature
from clean_precipitations import clean_precipitations
from clean_pollution import clean_pollution


def main():
    temp_result, temp_skipped, _ = clean_temperature()
    precip_result, precip_skipped, _, sans_precip = clean_precipitations()
    pollution_result, _, pollution_annees = clean_pollution()

    lignes_rapport = []
    lignes_rapport.append("# Rapport de nettoyage\n")
    lignes_rapport.append(f"Genere automatiquement le {datetime.now().strftime('%Y-%m-%d %H:%M')} par `scripts/run_all.py`.\n")

    lignes_rapport.append("## Température\n")
    lignes_rapport.append(f"- {len(temp_result)} lignes produites (attendu : 39, une par province × 3 années)")
    lignes_rapport.append(f"- {len(temp_skipped)} fichier(s) ignoré(s)")
    for f, reason in temp_skipped:
        lignes_rapport.append(f"  - `{f}` : {reason}")
    lignes_rapport.append("")

    lignes_rapport.append("## Précipitations\n")
    lignes_rapport.append(f"- {len(precip_result)} lignes produites (attendu : 39)")
    lignes_rapport.append(f"- {len(precip_skipped)} fichier(s) ignoré(s)")
    for f, reason in precip_skipped:
        lignes_rapport.append(f"  - `{f}` : {reason}")
    if sans_precip:
        lignes_rapport.append(f"- Provinces sans données de précipitation (valeurs NULL, voir `data/limitations.md`) : {sorted(sans_precip)}")
    lignes_rapport.append("")

    lignes_rapport.append("## Pollution\n")
    lignes_rapport.append(f"- {len(pollution_result)} lignes produites (attendu : 39)")
    lignes_rapport.append(f"- Années retenues (3 plus récentes disponibles à la source) : {pollution_annees}")
    lignes_rapport.append("")

    total_attendu = 39 * 3
    total_produit = len(temp_result) + len(precip_result) + len(pollution_result)
    lignes_rapport.append("## Résumé\n")
    lignes_rapport.append(f"- Total : {total_produit} / {total_attendu} lignes attendues sur les 3 fichiers nettoyés")
    if total_produit < total_attendu:
        lignes_rapport.append(f"- **Incomplet** — {total_attendu - total_produit} lignes manquantes, voir détail des fichiers ignorés ci-dessus")
    else:
        lignes_rapport.append("- **Complet**")

    with open('data/clean/cleaning_report.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lignes_rapport))

    print('\n'.join(lignes_rapport))
    print("\nRapport ecrit dans data/clean/cleaning_report.md")


if __name__ == '__main__':
    main()
