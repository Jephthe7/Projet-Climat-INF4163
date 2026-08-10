/**
 * routes/resultats.js — GET /resultats
 * Renvoie les 11 resultats formates en JSON (DAT section 9 : "Aucun
 * filtre — affiche les 11 resultats au chargement").
 */

const express = require('express');
const { getResultatsFormates } = require('../services/resultatsService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const resultats = await getResultatsFormates();
    res.json(resultats);
  } catch (err) {
    console.error('Erreur GET /resultats :', err);
    res.status(500).json({
      erreur: "Impossible de recuperer les resultats depuis les bases de donnees.",
    });
  }
});

module.exports = router;
