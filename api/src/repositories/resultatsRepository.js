/**
 * resultatsRepository.js — Assemble les 11 resultats des 3 bases en un
 * seul appel (role decrit dans DAT_Projet_Climat_INF4163_v3.docx,
 * section 10 : "Le repository assemble les 11 resultats, le service
 * les formate, la route les renvoie en JSON").
 *
 * Les 11 appels sont lances en parallele (Promise.all), pas en
 * sequence — pas de raison d'attendre qu'une procedure finisse avant
 * de lancer la suivante, elles sont independantes.
 */

const temperatureRepo = require('./temperatureRepository');
const pollutionRepo = require('./pollutionRepository');
const precipitationsRepo = require('./precipitationsRepository');

// Definit les 11 resultats attendus : cle technique, base d'origine,
// et fonction a appeler. Sert aussi de reference pour verifier qu'on
// a bien 11 resultats (voir DAT : "GET /resultats renvoie 11 objets").
const DEFINITIONS = [
  { cle: 'anneeMoisPlusChaud', base: 'TemperatureDB', fn: temperatureRepo.getAnneeMoisPlusChaud },
  { cle: 'provincePlusChaude', base: 'TemperatureDB', fn: temperatureRepo.getProvincePlusChaude },
  { cle: 'provinceMoinsChaude', base: 'TemperatureDB', fn: temperatureRepo.getProvinceMoinsChaude },
  { cle: 'anneePlusPolluee', base: 'PollutionDB', fn: pollutionRepo.getAnneePlusPolluee },
  { cle: 'anneeMoinsPolluee', base: 'PollutionDB', fn: pollutionRepo.getAnneeMoinsPolluee },
  { cle: 'provincePlusPolluee', base: 'PollutionDB', fn: pollutionRepo.getProvincePlusPolluee },
  { cle: 'provinceMoinsPolluee', base: 'PollutionDB', fn: pollutionRepo.getProvinceMoinsPolluee },
  { cle: 'anneePlusPluvieuse', base: 'PrecipitationsDB', fn: precipitationsRepo.getAnneePlusPluvieuse },
  { cle: 'anneeMoinsPluvieuse', base: 'PrecipitationsDB', fn: precipitationsRepo.getAnneeMoinsPluvieuse },
  { cle: 'provincePlusPluvieuse', base: 'PrecipitationsDB', fn: precipitationsRepo.getProvincePlusPluvieuse },
  { cle: 'provinceMoinsPluvieuse', base: 'PrecipitationsDB', fn: precipitationsRepo.getProvinceMoinsPluvieuse },
];

async function assemblerLesOnzeResultats() {
  const resultats = await Promise.all(
    DEFINITIONS.map(async (def) => ({
      cle: def.cle,
      base: def.base,
      donnees: await def.fn(),
    }))
  );
  return resultats;
}

module.exports = { assemblerLesOnzeResultats, DEFINITIONS };
