# Projet Climat — INF4163-01 — Été 2026

## Baromètre Climat Canada — GREEN SOFT

Projet de sensibilisation au réchauffement climatique réalisé par l'équipe 5 :

- Fedjo Tejioleng Wilfried Jephthé;
- Aka Andjui Melchisedek Ange-E;
- Lohoues Martine Grâce Debora.

## Objectif

Le projet collecte, nettoie, stocke et visualise des données climatiques pour les 13 provinces et territoires du Canada :

- températures mensuelles : 2023–2025;
- émissions de gaz à effet de serre : 2022–2024, période confirmée par le professeur en raison de l'indisponibilité des données 2025;
- précipitations annuelles : 2023–2025.

Le système comprend trois bases Azure SQL, neuf tables annuelles principales, onze procédures stockées, douze déclencheurs, une API Node.js/Express, un frontend interactif et un rapport Power BI.

## Déploiement

| Composant | Hébergement | Adresse |
|---|---|---|
| 3 bases de données | Azure SQL Database | `climat-inf4163-sql.database.windows.net` |
| API | Render Web Service | https://projet-climat-inf4163.onrender.com |
| Frontend | Render Static Site | https://greensoft-climat-site.onrender.com |
| Power BI | Desktop / Service UQO | Voir `powerbi/README.md` |

L'API gratuite Render peut prendre quelques secondes à redémarrer après une période d'inactivité.

## Structure du dépôt

```text
api/                  API Node.js/Express
assets/               Logo et identité visuelle
data/
  raw/                Données brutes
  clean/              Données nettoyées
  sources/            Sources et méthode de collecte
  limitations.md      Valeurs absentes et écarts de période
docs/
  BluePrint/          Vision fonctionnelle
  Consignes/          Énoncé officiel
  DAT/                Architecture technique
  PGOP/               Gestion et organisation du projet
  preuves/            Captures Azure, SQL, Render, Power BI et GitHub
frontend/             Site web HTML/CSS/JavaScript
powerbi/              Rapport Power BI et instructions
presentation/         Présentation finale
rapport/              Rapport final Word et PDF
scripts/              Nettoyage et import reproductibles
sql/                  Scripts des trois bases
matrice_tracabilite.md État final des exigences
```

## Démarrage local

### API

```bash
cd api
npm install
```

Copier `.env.example` vers `.env`, compléter les paramètres de connexion, puis lancer :

```bash
npm start
```

Les secrets ne doivent jamais être ajoutés au dépôt.

### Frontend

Servir le dossier `frontend/` avec un serveur HTTP local, par exemple Live Server. Par défaut, `frontend/app.js` utilise l'API publique Render.

### SQL

Dans chaque dossier `sql/<base>/`, exécuter les scripts dans cet ordre :

1. création des tables;
2. import des données;
3. création des vues;
4. procédures stockées;
5. déclencheurs.

## Livrables principaux

- Rapport : `rapport/Rapport_final_GreenSoft.docx` et `rapport/Rapport_final_GreenSoft.pdf`;
- Présentation : fichiers dans `presentation/`;
- Power BI : `powerbi/ProjetClimat.pbix`;
- Traçabilité : `matrice_tracabilite.md`;
- Énoncé : `docs/Consignes/Project_UQO_INF4163.pdf`.

## Limites documentées

- PollutionDB couvre 2022–2024 plutôt que 2023–2025.
- Cinq provinces ou territoires n'ont pas de mesure de précipitations aux stations retenues; les valeurs restent `NULL`.
- Power BI utilise le mode Import avec actualisation, tandis que le frontend public est alimenté dynamiquement par l'API Azure SQL.
- La version livrée ne contient pas de clés étrangères entre les tables annuelles; cette limite et l'amélioration proposée sont expliquées dans le rapport.
