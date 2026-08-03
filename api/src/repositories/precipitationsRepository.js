/**
 * precipitationsRepository.js — Appels directs aux 4 procedures stockees
 * de PrecipitationsDB (Blueprint section 7.1, procedures #8 a #11).
 */

const { getPool } = require('../config/db');

const DATABASE = 'PrecipitationsDB';

async function getAnneePlusPluvieuse() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetAnneePlusPluvieuse');
  return result.recordset[0];
}

async function getAnneeMoinsPluvieuse() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetAnneeMoinsPluvieuse');
  return result.recordset[0];
}

async function getProvincePlusPluvieuse() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetProvincePlusPluvieuse');
  return result.recordset[0];
}

async function getProvinceMoinsPluvieuse() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetProvinceMoinsPluvieuse');
  return result.recordset[0];
}

module.exports = {
  getAnneePlusPluvieuse,
  getAnneeMoinsPluvieuse,
  getProvincePlusPluvieuse,
  getProvinceMoinsPluvieuse,
};
