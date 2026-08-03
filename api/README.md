# API — Projet Climat INF4163

API intermédiaire entre le frontend et les 3 bases SQL Server. Nécessaire
car le navigateur ne peut pas interroger SQL Server (local ou Azure)
directement — voir DAT section 2.

## Architecture

```
routes/resultats.js          → couche HTTP (GET /resultats)
services/resultatsService.js → formatage (libellés français, vérifie qu'on a bien 11 résultats)
repositories/resultatsRepository.js → assemble les 11 résultats des 3 bases
repositories/temperatureRepository.js, pollutionRepository.js, precipitationsRepository.js
                              → appels bruts aux 11 procédures stockées
config/db.js                 → gestion des connexions (1 pool par base)
```

Flux conforme à DAT section 10 : *"le repository assemble les 11
résultats, le service les formate, la route les renvoie en JSON"*.

## Installation (première fois)

```bash
cd api
npm install
cp .env.example .env
```

Puis ouvrir `.env` et remplir `DB_PASSWORD` avec le mot de passe du
login `api_climat` créé dans SQL Server (jamais commité — `.env` est
dans `.gitignore`).

## Lancer l'API en local

```bash
npm start
```

Doit afficher `API demarree sur http://localhost:3000`.

## Tester

- `http://localhost:3000/` → doit répondre `{"statut": "API Projet Climat INF4163 — en ligne", ...}` immédiatement, sans toucher aux bases (test que le serveur tourne).
- `http://localhost:3000/resultats` → doit répondre un tableau JSON de 11 objets (un par procédure stockée). Si erreur 500, vérifier `.env` (mot de passe, mode d'authentification SQL Server activé — voir historique du projet) et que SQL Server est démarré.

## Bascule vers Azure (plus tard, une seule fois)

Seul `.env` change — pas le code :
- `DB_SERVER` → nom `*.database.windows.net`
- `DB_ENCRYPT=true` (obligatoire sur Azure)
- `DB_TRUST_SERVER_CERTIFICATE=false`
- `DB_USER` / `DB_PASSWORD` → identifiants du login créé sur le serveur Azure SQL
