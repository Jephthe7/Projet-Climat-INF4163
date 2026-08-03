/**
 * server.js — Point d'entree de l'API.
 *
 * Pourquoi cette API existe (DAT section 2) : le navigateur ne peut pas
 * interroger Azure SQL (ni SQL Server Express en local) directement —
 * il faut une couche intermediaire qui parle SQL d'un cote et HTTP/JSON
 * de l'autre.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const resultatsRouter = require('./routes/resultats');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Route de sante — permet de verifier rapidement que l'API tourne et
// que les variables d'environnement essentielles sont chargees, sans
// interroger les bases (utile pour un premier test rapide, et pour
// la demo si le prof demande "comment tu sais que l'API est en vie").
app.get('/', (req, res) => {
  res.json({
    statut: 'API Projet Climat INF4163 — en ligne',
    dbServerConfigure: Boolean(process.env.DB_SERVER),
  });
});

app.use('/resultats', resultatsRouter);

// 404 générique pour toute route non définie
app.use((req, res) => {
  res.status(404).json({ erreur: 'Route inconnue.' });
});

app.listen(PORT, () => {
  console.log(`API demarree sur http://localhost:${PORT}`);
  console.log(`Test rapide : http://localhost:${PORT}/resultats`);
});
