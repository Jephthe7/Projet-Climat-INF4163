/**
 * resultatsService.js — Formate les 11 resultats bruts pour le frontend
 * (libelles lisibles en francais, verification de completude).
 *
 * Separation des responsabilites : le repository sait comment aller
 * chercher la donnee (SQL), le service sait comment la presenter
 * (texte, structure), la route sait comment la livrer (HTTP/JSON).
 */

const { assemblerLesOnzeResultats } = require('../repositories/resultatsRepository');

// Question posee par le PGOP (section 4.3), en francais, associee a
// chaque cle technique — affichee telle quelle par le frontend.
const QUESTIONS = {
  anneeMoisPlusChaud: 'Année et mois les plus chauds (2023–2025)',
  provincePlusChaude: 'Province la plus chaude',
  provinceMoinsChaude: 'Province la moins chaude',
  anneePlusPolluee: 'Année la plus polluée',
  anneeMoinsPolluee: 'Année la moins polluée',
  provincePlusPolluee: 'Province la plus polluée',
  provinceMoinsPolluee: 'Province la moins polluée',
  anneePlusPluvieuse: 'Année la plus pluvieuse',
  anneeMoinsPluvieuse: 'Année la moins pluvieuse',
  provincePlusPluvieuse: 'Province la plus pluvieuse',
  provinceMoinsPluvieuse: 'Province la moins pluvieuse',
};

async function getResultatsFormates() {
  const bruts = await assemblerLesOnzeResultats();

  if (bruts.length !== 11) {
    // Ne devrait jamais arriver (DEFINITIONS a une longueur fixe de 11),
    // mais explicite plutot que silencieux si la liste change un jour
    // sans mise a jour de QUESTIONS.
    throw new Error(`Attendu 11 resultats, obtenu ${bruts.length}`);
  }

  return bruts.map((item) => ({
    cle: item.cle,
    question: QUESTIONS[item.cle] || item.cle,
    base: item.base,
    resultat: item.donnees,
  }));
}

module.exports = { getResultatsFormates };
