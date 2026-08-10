/**
 * graphiquesRepository.js — Requêtes brutes (pas de procédure stockée)
 * sur les 3 vues SQL (vwTemperature, vwPollution, vwPrecipitations),
 * pour alimenter les graphiques dynamiques du frontend (Chart.js).
 *
 * Contrairement à resultatsRepository.js (11 résultats déjà agrégés
 * via les procédures stockées), ici on renvoie toutes les lignes
 * brutes des vues — c'est le frontend qui fait l'agrégation visuelle
 * (moyenne par province, tri, etc.), pas SQL. Les vues existent déjà
 * pour Power BI (voir sql, dossier par base, fichiers SQL_..._Views_v1.sql) ;
 * on les réutilise
 * telles quelles plutôt que de dupliquer la logique UNION ALL ici.
 */

const { getPool } = require('../config/db');

async function getTemperatureComplete() {
  const pool = await getPool('TemperatureDB');
  const result = await pool
    .request()
    .query('SELECT CodeProvince, NomProvince, Mois, TemperatureMoyenne, Annee FROM vwTemperature');
  return result.recordset;
}

async function getPollutionComplete() {
  const pool = await getPool('PollutionDB');
  const result = await pool
    .request()
    .query('SELECT CodeProvince, NomProvince, ValeurMoyenne, Annee FROM vwPollution');
  return result.recordset;
}

async function getPrecipitationsComplete() {
  const pool = await getPool('PrecipitationsDB');
  const result = await pool
    .request()
    .query('SELECT CodeProvince, NomProvince, ValeurMoyenne, Annee FROM vwPrecipitations');
  return result.recordset;
}

module.exports = {
  getTemperatureComplete,
  getPollutionComplete,
  getPrecipitationsComplete,
};