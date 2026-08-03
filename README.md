# Projet Climat — INF4163-01 (Été 2026)
### Sensibilisation au réchauffement climatique — Bases de données, SQL, visualisation

**Équipe 5**
- Fedjo Tejioleng Wilfried Jephthé (chef de groupe)
- Aka Andjui Melchisedek Ange-E
- Lohoues Martine Grâce Debora

**Échéance** : lundi 10 août 2026, 8h00

---

## Objectif du projet

Concevoir et héberger trois bases de données climatiques (température, pollution,
précipitations) pour les 13 provinces et territoires du Canada sur 2023-2025, les
exposer via des procédures stockées et déclencheurs analytiques, et les présenter
dans un site web avec des visualisations dynamiques (Power BI ou Tableau).

## Structure du dépôt

```
sql/                  Scripts SQL, un sous-dossier par base
  temperaturedb/       CREATE TABLE, procédures, déclencheurs — TempératureDB
  pollutiondb/          idem — PollutionDB
  precipitationsdb/     idem — PrécipitationsDB
data/
  raw/                 Fichiers sources bruts, jamais modifiés
  clean/               Fichiers nettoyés, prêts pour l'import SQL (+ cleaning_report.md)
  sources/             Documentation de chaque source (lien, licence, méthode)
  limitations.md       Limites connues des données (valeurs manquantes, écarts de période)
scripts/              Pipeline de nettoyage reproductible (Python) — voir scripts/README.md
frontend/             Code du site web
powerbi/              Fichiers .pbix ou classeurs Tableau
rapport/              Versions du rapport, figures, captures
presentation/         PowerPoint, script de démo
docs/
  PGOP/                Plan de Gestion et d'Organisation du Projet (document de pilotage)
  BluePrint/           Vision globale du système
  DAT/                 Dossier d'Architecture Technique (décisions techniques détaillées)
  Consignes/           Énoncé officiel du professeur
assets/
  logo/                Logo et identité visuelle de l'équipe
matrice_tracabilite.md  Suivi rapide : chaque exigence de l'énoncé → où elle est satisfaite
```

## Document de référence

Toute l'organisation du projet (rôles, calendrier, méthodologie, normes) est décrite
dans `docs/PGOP/`. En cas de doute sur "qui fait quoi" ou "dans quel ordre", c'est la
première chose à consulter.

### Accès rapide

| Document | Version à lire vite (PDF, s'ouvre dans le navigateur) | Version à modifier (Word) |
|---|---|---|
| Plan de Gestion et d'Organisation du Projet (PGOP) — comment l'équipe s'organise | [PGOP.pdf](docs/PGOP/PGOP_v5.pdf) | [PGOP.docx](docs/PGOP/PGOP_v5.docx) |
| Blueprint du projet — ce que nous construisons | [Blueprint.pdf](docs/BluePrint/Blueprint_Projet_v1.pdf) | [Blueprint.docx](docs/BluePrint/Blueprint_Projet_v1.docx) |
| Dossier d'Architecture Technique (DAT) — toutes les décisions techniques détaillées | [DAT.pdf](docs/DAT/DAT_Projet_Climat_INF4163_v3.pdf) | [DAT.docx](docs/DAT/DAT_Projet_Climat_INF4163_v3.docx) |
| Squelette du rapport final — comment le projet a été réalisé | [Rapport_Squelette.pdf](rapport/Rapport_Squelette_v0.1.pdf) | [Rapport_Squelette.docx](rapport/Rapport_Squelette_v0.1.docx) |
| Matrice de traçabilité — chaque exigence de l'énoncé → où elle est satisfaite | [matrice_tracabilite.md](matrice_tracabilite.md) | — |
| Énoncé officiel du professeur | [Project_UQO_INF4163.pdf](docs/Consignes/Project_UQO_INF4163.pdf) | — |
| Ordre du jour — réunion de lancement | [Ordre_du_jour.md](docs/Ordre_du_jour_reunion_lancement.md) | — |
| Matrice des tâches (à remplir en réunion) | [matrice_taches.md](docs/matrice_taches.md) | — |

> Astuce : GitHub affiche les PDF directement dans le navigateur (clique et lis), mais
> pas les fichiers Word (il faut les télécharger). Pour une lecture rapide avant la
> réunion, utilise toujours la colonne PDF ; pour éditer, ouvre le .docx dans Word et
> repousse une nouvelle version + son PDF à jour après modification.

## État d'avancement

Voir le carnet de bord (section 15 du PGOP) pour l'état de chaque phase.

## Installation / exécution

*(À compléter dès que les choix techniques du frontend et de l'hébergement seront
faits — Phase 2 du PGOP.)*
