/**
 * pollutionRepository.js — Appels directs aux 4 procedures stockees
 * de PollutionDB (Blueprint section 7.1, procedures #4 a #7).
 */

const { getPool } = require('../config/db');

const DATABASE = 'PollutionDB';

async function getAnneePlusPolluee() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetAnneePlusPolluee');
  return result.recordset[0];
}

async function getAnneeMoinsPolluee() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetAnneeMoinsPolluee');
  return result.recordset[0];
}

async function getProvincePlusPolluee() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetProvincePlusPolluee');
  return result.recordset[0];
}

async function getProvinceMoinsPolluee() {
  const pool = await getPool(DATABASE);
  const result = await pool.request().execute('sp_GetProvinceMoinsPolluee');
  return result.recordset[0];
}

module.exports = {
  getAnneePlusPolluee,
  getAnneeMoinsPolluee,
  getProvincePlusPolluee,
  getProvinceMoinsPolluee,
};
