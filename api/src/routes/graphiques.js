/**
 * routes/graphiques.js — GET /api/temperature, /api/pollution,
 * /api/precipitations. Renvoie les lignes brutes des 3 vues SQL,
 * consommées par les graphiques Chart.js du frontend (voir
 * frontend/app.js, section "GRAPHIQUES DYNAMIQUES").
 *
 * Distinct de /resultats (11 résultats déjà agrégés par les
 * procédures stockées) : ici c'est la donnée brute, granularité
 * province x année (x mois pour la température).
 */

const express = require('express');
const {
  getTemperatureComplete,
  getPollutionComplete,
  getPrecipitationsComplete,
} = require('../repositories/graphiquesRepository');

const router = express.Router();

router.get('/temperature', async (req, res) => {
  try {
    const donnees = await getTemperatureComplete();
    res.json(donnees);
  } catch (err) {
    console.error('Erreur GET /api/temperature :', err);
    res.status(500).json({
      erreur: 'Impossible de récupérer les données de température depuis Azure SQL.',
    });
  }
});

router.get('/pollution', async (req, res) => {
  try {
    const donnees = await getPollutionComplete();
    res.json(donnees);
  } catch (err) {
    console.error('Erreur GET /api/pollution :', err);
    res.status(500).json({
      erreur: 'Impossible de récupérer les données de pollution depuis Azure SQL.',
    });
  }
});

router.get('/precipitations', async (req, res) => {
  try {
    const donnees = await getPrecipitationsComplete();
    res.json(donnees);
  } catch (err) {
    console.error('Erreur GET /api/precipitations :', err);
    res.status(500).json({
      erreur: 'Impossible de récupérer les données de précipitations depuis Azure SQL.',
    });
  }
});

module.exports = router;
