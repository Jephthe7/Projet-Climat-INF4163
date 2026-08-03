/**
 * db.js — Gestion des connexions SQL Server.
 *
 * Une base = une connexion (TemperatureDB, PollutionDB, PrecipitationsDB
 * sont 3 bases separees, pas 3 schemas d'une meme base — voir DAT
 * section 4, "aucune cle etrangere entre les trois bases"). Chaque pool
 * est cree une seule fois puis reutilise (mis en cache dans `pools`).
 *
 * IMPORTANT — bascule vers Azure (a faire une seule fois, plus tard) :
 * seules les variables d'environnement changent (.env), pas ce fichier.
 * Sur Azure SQL : DB_ENCRYPT=true obligatoire, DB_TRUST_SERVER_CERTIFICATE=false,
 * DB_SERVER devient un nom en *.database.windows.net.
 * En local (SQL Server Express, pas de certificat SSL valide) : l'inverse.
 */

const sql = require('mssql');

function buildConfig(database) {
  return {
    server: process.env.DB_SERVER,
    database,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    // Sans ces timeouts, une tentative de connexion vers un serveur
    // injoignable (Azure temporairement indisponible, mauvaise IP,
    // pare-feu) peut bloquer la requete HTTP tres longtemps au lieu
    // d'echouer proprement.
    connectionTimeout: 10000,
    requestTimeout: 10000,
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    },
  };
}

const pools = {};

/**
 * Retourne un pool de connexion connecte pour la base demandee.
 * Cree le pool au premier appel, le reutilise ensuite.
 */
function getPool(database) {
  if (!pools[database]) {
    const config = buildConfig(database);
    pools[database] = new sql.ConnectionPool(config)
      .connect()
      .catch((err) => {
        // En cas d'echec, on retire le pool du cache pour permettre une
        // nouvelle tentative au prochain appel (sinon l'erreur reste figee)
        delete pools[database];
        throw err;
      });
  }
  return pools[database];
}

module.exports = { getPool, sql };
