# Projet Climat — INF4163-01 (Été 2026)
### Sensibilisation au réchauffement climatique — Bases de données, SQL, visualisation

**Équipe 5**
- Fedjo Tejioleng Wilfried Jephthé (chef de groupe, intérim)
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
data/                 Fichiers sources nettoyés (Excel/CSV), avec source citée
frontend/             Code du site web
powerbi/              Fichiers .pbix ou classeurs Tableau
rapport/              Versions du rapport, figures, captures
presentation/         PowerPoint, script de démo
docs/
  PGOP/                Plan de Gestion et d'Organisation du Projet (document de pilotage)
  Consignes/           Énoncé officiel du professeur
assets/
  logo/                Logo et identité visuelle de l'équipe
```

## Document de référence

Toute l'organisation du projet (rôles, calendrier, méthodologie, normes) est décrite
dans `docs/PGOP/`. En cas de doute sur "qui fait quoi" ou "dans quel ordre", c'est la
première chose à consulter.

## État d'avancement

Voir le carnet de bord (section 15 du PGOP) pour l'état de chaque phase.

## Installation / exécution

*(À compléter dès que les choix techniques du frontend et de l'hébergement seront
faits — Phase 2 du PGOP.)*
