/**
 * temperatureRepository.js — Appels directs aux 3 procedures stockees
 * de TemperatureDB. Aucune logique metier ici, juste l'acces aux donnees
 * (voir Blueprint section 7.1, procedures #1 a #3).
 */

const { getPool } = require('../config/db');

const DATABASE = 'TemperatureDB';

async function getAnneeMoisPlusChaud() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetAnneeMoisPlusChaud');
  return result.recordset[0];
}

async function getProvincePlusChaude() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetProvincePlusChaude');
  return result.recordset[0];
}

async function getProvinceMoinsChaude() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetProvinceMoinsChaude');
  return result.recordset[0];
}

module.exports = {
  getAnneeMoisPlusChaud,
  getProvincePlusChaude,
  getProvinceMoinsChaude,
};
