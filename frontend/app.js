/* =====================================================
   BAROMETRE CLIMAT CANADA — GREEN SOFT
===================================================== */

// En local (API lancée avec `npm start` dans /api) : http://localhost:3000
// Pendant les tests avec Aka (tunnel ngrok) : remplacer par l'URL ngrok actuelle,
// ex. "https://abc123.ngrok-free.app" (change à chaque redémarrage du tunnel).
// Une fois l'API déployée en ligne (Azure), remplacer par son URL publique définitive.
const API_BASE = "https://projet-climat-inf4163.onrender.com";

// L'API reste prioritaire. Ces valeurs maintiennent la démonstration lisible
// lorsque le service Render se réveille ou qu'Internet est indisponible.
const FALLBACK_RESULTS = [
  { cle: "provincePlusChaude", base: "TemperatureDB", question: "Province ayant la température moyenne la plus élevée (2023-2025)", resultat: { CodeProvince: "ON", NomProvince: "Ontario", TemperatureMoyenneGlobale: 23.9 } },
  { cle: "provinceMoinsChaude", base: "TemperatureDB", question: "Province ayant la température moyenne la moins élevée (2023-2025)", resultat: { CodeProvince: "NU", NomProvince: "Nunavut", TemperatureMoyenneGlobale: -6.874444 } },
  { cle: "provincePlusPolluee", base: "PollutionDB", question: "Province ayant les émissions moyennes les plus élevées", resultat: { CodeProvince: "AB", NomProvince: "Alberta", EmissionsMoyennesMtCO2e: 260.8 } },
  { cle: "provinceMoinsPolluee", base: "PollutionDB", question: "Province ayant les émissions moyennes les moins élevées", resultat: { CodeProvince: "YT", NomProvince: "Yukon", EmissionsMoyennesMtCO2e: 0.683333 } },
  { cle: "anneePlusPolluee", base: "PollutionDB", question: "Année ayant les émissions totales les plus élevées", resultat: { Annee: 2022, TotalEmissionsMtCO2e: 695.85 } },
  { cle: "anneeMoinsPolluee", base: "PollutionDB", question: "Année ayant les émissions totales les moins élevées", resultat: { Annee: 2024, TotalEmissionsMtCO2e: 684.7 } },
  { cle: "provincePlusPluvieuse", base: "PrecipitationsDB", question: "Province ayant les précipitations moyennes les plus élevées", resultat: { CodeProvince: "NL", NomProvince: "Terre-Neuve-et-Labrador", PrecipitationMoyenneMm: 1451.1 } },
  { cle: "provinceMoinsPluvieuse", base: "PrecipitationsDB", question: "Province ayant les précipitations moyennes les moins élevées", resultat: { CodeProvince: "NT", NomProvince: "Territoires du Nord-Ouest", PrecipitationMoyenneMm: 156.933333 } },
  { cle: "anneePlusPluvieuse", base: "PrecipitationsDB", question: "Année ayant le total de précipitations le plus élevé", resultat: { Annee: 2024, TotalPrecipitationMm: 7848.2 } },
  { cle: "anneeMoinsPluvieuse", base: "PrecipitationsDB", question: "Année ayant le total de précipitations le moins élevé", resultat: { Annee: 2025, TotalPrecipitationMm: 6645.3 } },
  { cle: "anneeMoisPlusChaud", base: "TemperatureDB", question: "Mois le plus chaud observé, toutes provinces confondues", resultat: { Annee: 2024, Mois: 7, TemperatureMoyenne: 23.9 } },
];

const FALLBACK_SERIES = {
  temperature: [["ON","Ontario",23.9],["QC","Québec",22.7],["MB","Manitoba",21.8],["AB","Alberta",20.9],["SK","Saskatchewan",20.5],["BC","Colombie-Britannique",19.8],["NB","Nouveau-Brunswick",19.1],["NS","Nouvelle-Écosse",18.7],["NL","Terre-Neuve-et-Labrador",16.2]].map(([CodeProvince,NomProvince,TemperatureMoyenne]) => ({CodeProvince,NomProvince,TemperatureMoyenne})),
  pollution: [["AB","Alberta",260.8],["ON","Ontario",150.3],["QC","Québec",82.6],["SK","Saskatchewan",74.9],["BC","Colombie-Britannique",62.4],["MB","Manitoba",25.7],["NB","Nouveau-Brunswick",12.8],["NS","Nouvelle-Écosse",11.5],["NL","Terre-Neuve-et-Labrador",10.9]].map(([CodeProvince,NomProvince,ValeurMoyenne]) => ({CodeProvince,NomProvince,ValeurMoyenne})),
  precipitations: [["NL","Terre-Neuve-et-Labrador",1451.1],["BC","Colombie-Britannique",1218.4],["NS","Nouvelle-Écosse",1186.2],["NB","Nouveau-Brunswick",1094.8],["QC","Québec",1012.5],["ON","Ontario",914.6],["MB","Manitoba",620.3],["AB","Alberta",548.7],["SK","Saskatchewan",465.2]].map(([CodeProvince,NomProvince,ValeurMoyenne]) => ({CodeProvince,NomProvince,ValeurMoyenne})),
};

const FALLBACK_ANNUAL = {
  temperature: [[2023, 5.7], [2024, 6.1], [2025, 6.4]],
  pollution: [[2022, 55.4], [2023, 54.9], [2024, 54.1]],
  precipitations: [[2023, 884.6], [2024, 901.2], [2025, 872.9]],
};

/* ================= SYSTEME D'ONGLETS ================= */

const panels = document.querySelectorAll(".tab-panel");
const navLinks = document.querySelectorAll(".nav-links a");

function switchTab(tabId) {
  panels.forEach(p => p.classList.remove("active"));
  const target = document.getElementById(tabId);
  if (target) target.classList.add("active");

  navLinks.forEach(link => {
    link.classList.toggle("active", link.dataset.tab === tabId);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  // relance l'apparition au scroll pour les cartes du panneau qui vient de s'afficher
  if (target) {
    target.querySelectorAll(".kpi-card, .data-card, .dashboard-box, .member-card")
      .forEach(el => el.classList.add("visible"));
  }
}

// Tout lien avec un data-tab (nav, boutons "Voir le dashboard", bouton héro)
// ouvre l'onglet correspondant au lieu de faire défiler la page.
document.querySelectorAll("a[data-tab]").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab(link.dataset.tab);
  });
});

/* ================= MODE SOMBRE ================= */

const rootEl = document.documentElement;
rootEl.removeAttribute("data-theme");
localStorage.removeItem("theme");

/* ================= MENU MOBILE ================= */

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

/* ================= APPARITION AU SCROLL ================= */

const animatedElements = document.querySelectorAll(
  ".kpi-card, .data-card, .dashboard-box, .member-card"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);

animatedElements.forEach(el => observer.observe(el));

const animationStyle = document.createElement("style");
animationStyle.innerHTML = `
.kpi-card, .data-card, .dashboard-box, .member-card {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity .7s ease, transform .7s ease;
}
.visible { opacity: 1; transform: translateY(0); }
.nav-links.open {
  display: flex;
  position: absolute;
  top: 82px;
  left: 0;
  width: 100%;
  flex-direction: column;
  padding: 30px;
  background: white;
  box-shadow: 0 20px 40px rgba(15,23,42,.15);
}
`;
document.head.appendChild(animationStyle);

/* ================= COMPTEURS KPI ================= */

document.querySelectorAll(".kpi-card strong").forEach(counter => {
  const value = counter.textContent;
  if (!isNaN(parseFloat(value))) {
    let number = parseFloat(value);
    let current = 0;
    const step = number / 60;
    function animate() {
      current += step;
      if (current < number) {
        counter.textContent = current.toFixed(1);
        requestAnimationFrame(animate);
      } else {
        counter.textContent = value;
      }
    }
    animate();
  }
});

/* ================= CHARGEMENT RESULTATS SQL ================= */

// Met en forme l'objet "resultat" (qui varie selon la question) en texte lisible.
//
// CORRECTION (voir conversation) : les 11 resultats de l'API n'utilisent pas tous
// les memes noms de champs. Les questions "annee" utilisent TemperatureMoyenne /
// TotalPrecipitationMm, mais les questions "province" utilisent des noms differents
// (TemperatureMoyenneGlobale, PrecipitationMoyenneMm) — sans ces 2 lignes en plus,
// 4 des 11 lignes du tableau s'affichaient sans aucun chiffre.
function formatResultat(resultat) {
  if (!resultat) return "—";
  const parts = [];
  const number = (value) => new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 1 }).format(Number(value));
  if (resultat.Annee) parts.push(`${resultat.Annee}`);
  if (resultat.Mois) parts.push(`(mois ${resultat.Mois})`);
  if (resultat.NomProvince) parts.push(resultat.NomProvince);
  if (resultat.TemperatureMoyenne !== undefined) parts.push(`${number(resultat.TemperatureMoyenne)} °C`);
  if (resultat.TemperatureMoyenneGlobale !== undefined) parts.push(`${number(resultat.TemperatureMoyenneGlobale)} °C`);
  if (resultat.EmissionsMoyennesMtCO2e !== undefined) parts.push(`${number(resultat.EmissionsMoyennesMtCO2e)} Mt CO2e`);
  if (resultat.TotalEmissionsMtCO2e !== undefined) parts.push(`${number(resultat.TotalEmissionsMtCO2e)} Mt CO2e`);
  if (resultat.TotalPrecipitationMm !== undefined) parts.push(`${number(resultat.TotalPrecipitationMm)} mm`);
  if (resultat.PrecipitationMoyenneMm !== undefined) parts.push(`${number(resultat.PrecipitationMoyenneMm)} mm`);
  return parts.length ? parts.join(" — ") : JSON.stringify(resultat);
}

function rowsHtml(list, withBase) {
  return list.map(item => `
    <tr>
      <td>${item.question ?? ""}</td>
      ${withBase ? `<td>${item.base ?? ""}</td>` : ""}
      <td>${formatResultat(item.resultat)}</td>
    </tr>
  `).join("");
}

function mergeAnalyticResults(apiResults = []) {
  const merged = new Map(FALLBACK_RESULTS.map((item) => [item.cle, { ...item, live: false }]));
  apiResults.forEach((item) => merged.set(item.cle, { ...item, live: true }));
  return Array.from(merged.values());
}

let activeAnalysisFilter = "all";
let latestAnalyticResults = [];

function analysisCategory(base = "") {
  if (/temp/i.test(base)) return "temperature";
  if (/pollu/i.test(base)) return "pollution";
  return "precipitations";
}

function renderAnalysisCards(results) {
  const grid = document.getElementById("analysis-result-grid");
  if (!grid) return;
  const visible = results.filter((item) => activeAnalysisFilter === "all" || analysisCategory(item.base) === activeAnalysisFilter);
  const meta = {
    temperature: { label: "Température", icon: "fa-temperature-half", period: "2023–2025" },
    pollution: { label: "Pollution", icon: "fa-smog", period: "2022–2024" },
    precipitations: { label: "Précipitations", icon: "fa-cloud-showers-heavy", period: "2023–2025" },
  };

  grid.innerHTML = visible.map((item) => {
    const category = analysisCategory(item.base);
    const info = meta[category];
    return `<article class="analysis-result-card ${category}">
      <div class="analysis-result-top">
        <span class="analysis-result-icon"><i class="fa-solid ${info.icon}"></i></span>
        <span class="analysis-result-period">${info.period}</span>
      </div>
      <span class="analysis-result-base">${info.label}</span>
      <h3>${item.question}</h3>
      <strong>${formatResultat(item.resultat)}</strong>
      <small class="${item.live ? "is-live" : ""}"><i></i>${item.live ? "Résultat API" : "Résultat de référence"}</small>
    </article>`;
  }).join("");
}

document.querySelectorAll("[data-analysis-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeAnalysisFilter = button.dataset.analysisFilter;
    document.querySelectorAll("[data-analysis-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderAnalysisCards(latestAnalyticResults);
  });
});

// Remplit une carte "Aperçu des Résultats Clés" (section .highlights) à partir
// d'un item { cle, question, base, resultat } renvoyé par /resultats.
function fillHighlight(id, item) {
  const card = document.getElementById(id);
  if (!card) return;

  const valueEl = card.querySelector(".hl-value");
  const metricEl = card.querySelector(".hl-metric");
  const captionEl = card.querySelector(".hl-caption");

  if (!item || !item.resultat) {
    if (valueEl) valueEl.textContent = "—";
    if (metricEl) metricEl.textContent = "Indisponible";
    if (captionEl) captionEl.textContent = "En attente des données de l'API.";
    return;
  }

  const r = item.resultat;

  // En-tête court : nom de province si présent, sinon année (+ mois si présent).
  let headline = "—";
  if (r.NomProvince) {
    headline = r.NomProvince;
  } else if (r.Annee) {
    headline = r.Mois ? `${r.Annee} (mois ${r.Mois})` : `${r.Annee}`;
  }

  // Métrique courte : une seule valeur + unité, jamais le détail complet.
  const round = (n) => (Math.round(n * 10) / 10).toString();
  let metric = "—";
  if (r.TemperatureMoyenneGlobale !== undefined) metric = `${round(r.TemperatureMoyenneGlobale)} °C`;
  else if (r.TemperatureMoyenne !== undefined) metric = `${round(r.TemperatureMoyenne)} °C`;
  else if (r.TotalEmissionsMtCO2e !== undefined) metric = `${round(r.TotalEmissionsMtCO2e)} Mt CO2e`;
  else if (r.EmissionsMoyennesMtCO2e !== undefined) metric = `${round(r.EmissionsMoyennesMtCO2e)} Mt CO2e`;
  else if (r.TotalPrecipitationMm !== undefined) metric = `${round(r.TotalPrecipitationMm)} mm`;
  else if (r.PrecipitationMoyenneMm !== undefined) metric = `${round(r.PrecipitationMoyenneMm)} mm`;

  if (valueEl) valueEl.textContent = headline;
  if (metricEl) metricEl.textContent = metric;
  if (captionEl) captionEl.textContent = item.question;
}

function fillHighlights(results, ok) {
  const byKey = ok ? Object.fromEntries(results.map(r => [r.cle, r])) : {};
  fillHighlight("hl-temp-annee", byKey.anneeMoisPlusChaud);
  updateHomepageIndicators(byKey);
}

// Correspondance CodeProvince (SQL) -> id du tracé SVG dans la carte du hero.
const PROVINCE_TO_MAP_ID = {
  YT: "p-yukon", BC: "p-cb", AB: "p-alberta", SK: "p-saskatchewan",
  MB: "p-manitoba", ON: "p-ontario", QC: "p-quebec", NB: "p-nb",
  NS: "p-ns", PE: "p-pei", NL: "p-tnl", NT: "p-tno", NU: "p-nunavut",
};

const PROVINCE_NAME_TO_MAP_ID = {
  "yukon": "p-yukon", "colombie-britannique": "p-cb", "alberta": "p-alberta",
  "saskatchewan": "p-saskatchewan", "manitoba": "p-manitoba", "ontario": "p-ontario",
  "quebec": "p-quebec", "québec": "p-quebec", "nouveau-brunswick": "p-nb",
  "nouvelle-ecosse": "p-ns", "nouvelle-écosse": "p-ns", "ile-du-prince-edouard": "p-pei",
  "île-du-prince-édouard": "p-pei", "terre-neuve-et-labrador": "p-tnl",
  "territoires du nord-ouest": "p-tno", "nunavut": "p-nunavut",
};

const MAP_ID_TO_PROVINCE_NAME = {
  "p-yukon": "Yukon", "p-cb": "Colombie-Britannique", "p-alberta": "Alberta",
  "p-saskatchewan": "Saskatchewan", "p-manitoba": "Manitoba", "p-ontario": "Ontario",
  "p-quebec": "Québec", "p-nb": "Nouveau-Brunswick", "p-ns": "Nouvelle-Écosse",
  "p-pei": "Île-du-Prince-Édouard", "p-tnl": "Terre-Neuve-et-Labrador",
  "p-tno": "Territoires du Nord-Ouest", "p-nunavut": "Nunavut",
};

function mapIdForResult(resultat) {
  if (resultat.CodeProvince && PROVINCE_TO_MAP_ID[resultat.CodeProvince]) {
    return PROVINCE_TO_MAP_ID[resultat.CodeProvince];
  }
  return PROVINCE_NAME_TO_MAP_ID[(resultat.NomProvince || "").trim().toLowerCase()];
}

function updateProvinceMapMetrics(endpoint, donnees) {
  const config = {
    temperature: { key: "temperature", label: "Température", unit: "°C" },
    pollution: { key: "pollution", label: "Émissions", unit: "Mt CO₂e" },
    precipitations: { key: "precipitations", label: "Précipitations", unit: "mm" },
  }[endpoint];
  if (!config) return;

  donnees.forEach(({ code, nom, moyenne }) => {
    const mapId = PROVINCE_TO_MAP_ID[code] || PROVINCE_NAME_TO_MAP_ID[(nom || "").trim().toLowerCase()];
    const province = mapId ? document.getElementById(mapId) : null;
    if (!province || moyenne === null || moyenne === undefined) return;
    province.dataset.province = nom || MAP_ID_TO_PROVINCE_NAME[mapId];
    province.dataset[config.key] = `${Math.round(moyenne * 10) / 10} ${config.unit}`;
  });
}

// Alimente les 3 badges "Indicateurs clés" du hero, les 3 cartes KPI, et
// surligne sur la carte les 3 provinces concernées — a partir des memes
// resultats /resultats deja recuperes (aucun appel API supplementaire).
function updateHomepageIndicators(byKey) {
  const round = (n) => (Math.round(n * 10) / 10).toString();

  const specs = [
    {
      item: byKey.provincePlusChaude,
      indicatorId: "indicator-temp",
      kpiId: "kpi-temp",
      metric: (r) => `${round(r.TemperatureMoyenneGlobale)} °C`,
      warm: true,
    },
    {
      item: byKey.provincePlusPolluee,
      indicatorId: "indicator-pollution",
      kpiId: "kpi-pollution",
      metric: (r) => `${round(r.EmissionsMoyennesMtCO2e)} Mt CO2e`,
      warm: true,
    },
    {
      item: byKey.provincePlusPluvieuse,
      indicatorId: "indicator-precip",
      kpiId: "kpi-precip",
      metric: (r) => `${round(r.PrecipitationMoyenneMm)} mm`,
      warm: false,
    },
  ];

  const warmProvinces = [];
  const coolProvinces = [];

  specs.forEach(({ item, indicatorId, kpiId, metric, warm }) => {
    const indicatorEl = document.querySelector(`#${indicatorId} .indicator-value`);
    const kpiValueEl = document.querySelector(`#${kpiId} .kpi-value`);

    if (!item || !item.resultat) {
      if (indicatorEl) indicatorEl.textContent = "Indisponible";
      if (kpiValueEl) kpiValueEl.textContent = "—";
      return;
    }

    const r = item.resultat;
    if (indicatorEl) {
      indicatorEl.innerHTML = `<span>${r.NomProvince || "—"}</span><small>${metric(r)}</small>`;
    }
    if (kpiValueEl) kpiValueEl.textContent = metric(r);

    const mapId = mapIdForResult(r);
    if (mapId) {
      (warm ? warmProvinces : coolProvinces).push(mapId);
      const provinceShape = document.getElementById(mapId);
      if (provinceShape) {
        provinceShape.dataset.province = r.NomProvince || MAP_ID_TO_PROVINCE_NAME[mapId];
        provinceShape.dataset.metric = metric(r);
      }
    }
  });

  // Surligne uniquement les provinces réellement concernées (degrade chaud pour
  // temperature/pollution, froid pour precipitations), retire des autres.
  document.querySelectorAll(".hero-map-province").forEach((el) => {
    el.classList.toggle("highlighted-warm", warmProvinces.includes(el.id));
    el.classList.toggle("highlighted-cool", coolProvinces.includes(el.id));
  });
}

/* Survol naturel de la carte : aucun texte d'instruction nécessaire. */
function initMapHover() {
  const map = document.querySelector(".hero-map");
  if (!map) return;

  const tooltip = document.createElement("div");
  tooltip.className = "map-tooltip";
  tooltip.setAttribute("role", "status");
  map.appendChild(tooltip);

  document.querySelectorAll(".hero-map-province").forEach((province) => {
    province.setAttribute("tabindex", "0");
    province.setAttribute("aria-label", MAP_ID_TO_PROVINCE_NAME[province.id] || "Province canadienne");

    const show = (event) => {
      const name = province.dataset.province || MAP_ID_TO_PROVINCE_NAME[province.id] || "Province";
      const rows = [
        ["Température", province.dataset.temperature],
        ["Émissions", province.dataset.pollution],
        ["Précipitations", province.dataset.precipitations],
      ].filter(([, value]) => value);
      const details = rows.map(([label, value]) => `<small><em>${label}</em><strong>${value}</strong></small>`).join("");
      tooltip.innerHTML = `<span>${name}</span>${details}`;
      tooltip.classList.add("visible");
      if (event.clientX) {
        const rect = map.getBoundingClientRect();
        tooltip.style.left = `${event.clientX - rect.left + 12}px`;
        tooltip.style.top = `${event.clientY - rect.top - 46}px`;
      }
    };

    province.addEventListener("mouseenter", show);
    province.addEventListener("mousemove", show);
    province.addEventListener("focus", show);
    province.addEventListener("mouseleave", () => tooltip.classList.remove("visible"));
    province.addEventListener("blur", () => tooltip.classList.remove("visible"));
  });
}

initMapHover();

async function loadResults() {
  const fullTable = document.getElementById("resultats-body");
  const tempTable = document.getElementById("temp-resultats-body");
  const co2Table = document.getElementById("co2-resultats-body");
  const precipTable = document.getElementById("precip-resultats-body");

  try {
    const response = await fetch(`${API_BASE}/resultats`, {
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});
    if (!response.ok) throw new Error("API inaccessible");
    const apiResults = await response.json();
    const results = mergeAnalyticResults(apiResults);
    latestAnalyticResults = results;

    if (fullTable) fullTable.innerHTML = rowsHtml(results, true);

    const isTemp = b => /temp/i.test(b || "");
    const isCo2 = b => /pollu/i.test(b || "");
    const isPrecip = b => /precip/i.test(b || "");

    if (tempTable) tempTable.innerHTML = rowsHtml(results.filter(r => isTemp(r.base)), false);
    if (co2Table) co2Table.innerHTML = rowsHtml(results.filter(r => isCo2(r.base)), false);
    if (precipTable) precipTable.innerHTML = rowsHtml(results.filter(r => isPrecip(r.base)), false);

    fillHighlights(results, true);
    renderAnalysisCards(results);
    updateSyncStatus(true, apiResults.length);
    return results;

  } catch (error) {
    console.log("Chargement API impossible :", error);
    const results = mergeAnalyticResults();
    latestAnalyticResults = results;
    if (fullTable) fullTable.innerHTML = rowsHtml(results, true);
    if (tempTable) tempTable.innerHTML = rowsHtml(results.filter(r => /temp/i.test(r.base)), false);
    if (co2Table) co2Table.innerHTML = rowsHtml(results.filter(r => /pollu/i.test(r.base)), false);
    if (precipTable) precipTable.innerHTML = rowsHtml(results.filter(r => /precip/i.test(r.base)), false);
    fillHighlights(results, true);
    renderAnalysisCards(results);
    updateSyncStatus(false, 0);
    return results;
  }
}

function updateSyncStatus(connected, liveCount) {
  const status = document.getElementById("analysis-sync-status");
  if (!status) return;
  const time = new Intl.DateTimeFormat("fr-CA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
  status.classList.toggle("offline", !connected);
  status.innerHTML = `<i></i>${connected ? `${liveCount} résultats API · actualisé ${time}` : `Référence locale · ${time}`}`;
}

loadResults();

/* ================= GRAPHIQUES DYNAMIQUES (Chart.js, connectes a Azure SQL via l'API) ================= */

// Palette du site — memes couleurs que le CSS (--secondary teal, --accent
// orange, bleu), pour que les graphiques restent visuellement coherents
// avec le reste du frontend plutot que d'utiliser les couleurs par defaut
// de Chart.js.
const PALETTE = {
  teal: "#0D9488",
  orange: "#F97316",
  bleu: "#0284C7",
  navy: "#0F172A",
  grille: "rgba(15, 23, 42, 0.08)",
};

// Regroupe une liste de lignes { CodeProvince, NomProvince, valeur }
// par province, calcule la moyenne (en ignorant les NULL, utile pour
// PrecipitationsDB ou 5 provinces n'ont aucune donnee — voir
// data/limitations.md), puis trie du plus grand au plus petit.
function moyenneParProvince(lignes, champValeur) {
  const parProvince = new Map();

  lignes.forEach((ligne) => {
    const valeur = Number(ligne[champValeur]);
    if (!Number.isFinite(valeur)) return; // ignore les NULL et valeurs invalides

    const cle = ligne.CodeProvince;
    if (!parProvince.has(cle)) {
      parProvince.set(cle, { nom: ligne.NomProvince, total: 0, count: 0 });
    }
    const entree = parProvince.get(cle);
    entree.total += valeur;
    entree.count += 1;
  });

  const resultat = Array.from(parProvince.entries()).map(([code, { nom, total, count }]) => ({
    code,
    nom,
    moyenne: total / count,
  }));

  resultat.sort((a, b) => b.moyenne - a.moyenne);
  return resultat;
}

// Calcule une moyenne nationale pour chaque année à partir des mêmes lignes
// que le graphique provincial. Aucun second appel à l'API n'est nécessaire.
function moyenneParAnnee(lignes, champValeur) {
  const parAnnee = new Map();

  lignes.forEach((ligne) => {
    const annee = Number(ligne.Annee);
    const valeur = Number(ligne[champValeur]);
    if (!Number.isFinite(annee) || !Number.isFinite(valeur)) return;

    if (!parAnnee.has(annee)) parAnnee.set(annee, { total: 0, count: 0 });
    const entree = parAnnee.get(annee);
    entree.total += valeur;
    entree.count += 1;
  });

  return Array.from(parAnnee.entries())
    .map(([annee, { total, count }]) => ({ annee, moyenne: total / count }))
    .sort((a, b) => a.annee - b.annee);
}

// Cree un degrade vertical (couleur pleine en haut, plus transparente en
// bas) pour une barre — plus soigne qu'un aplat de couleur unique.
function dégradéBarre(ctx, chartArea, couleurHex) {
  if (!chartArea) return couleurHex;
  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, couleurHex);
  gradient.addColorStop(1, couleurHex + "55"); // transparence en bas
  return gradient;
}

// Cree un graphique a barres "moyenne par province" dans le canvas
// identifie par canvasId. Retourne l'instance Chart.js (pas utilise
// pour l'instant, mais garde la porte ouverte pour un futur filtre
// annee qui appellerait chart.update()).
function creerGraphiqueBarres(canvasId, donnees, { couleur, unite, titre }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  Chart.getChart(canvas)?.destroy();

  return new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: donnees.map((d) => d.code),
      datasets: [
        {
          label: titre,
          data: donnees.map((d) => Math.round(d.moyenne * 100) / 100),
          backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;
            return dégradéBarre(ctx, chartArea, couleur);
          },
          borderRadius: 6,
          maxBarThickness: 42,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: PALETTE.navy,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            title: (items) => donnees[items[0].dataIndex].nom,
            label: (item) => `${item.formattedValue} ${unite}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: PALETTE.navy, font: { weight: "600" } },
        },
        y: {
          grid: { color: PALETTE.grille },
          ticks: { color: PALETTE.navy },
        },
      },
    },
  });
}

function creerGraphiqueLigne(canvasId, donnees, { couleur, unite, titre }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !donnees.length) return null;
  Chart.getChart(canvas)?.destroy();

  return new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: donnees.map((d) => String(d.annee)),
      datasets: [{
        label: titre,
        data: donnees.map((d) => Math.round(d.moyenne * 100) / 100),
        borderColor: couleur,
        backgroundColor: couleur + "22",
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: couleur,
        pointBorderWidth: 3,
        tension: 0.3,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: "easeOutQuart" },
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: PALETTE.navy,
          padding: 11,
          cornerRadius: 8,
          callbacks: { label: (item) => `${item.formattedValue} ${unite}` },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: PALETTE.navy, font: { weight: "700" } },
        },
        y: {
          grid: { color: PALETTE.grille },
          ticks: { color: PALETTE.navy },
        },
      },
    },
  });
}

function afficherGraphiqueIndisponible(canvasId) {
  const canvas = document.getElementById(canvasId);
  const container = canvas?.closest(".chart-container");
  if (!container) return;
  container.innerHTML = '<p class="chart-unavailable">Graphique indisponible</p>';
}

async function chargerGraphique(endpoint, canvasId, champValeur, options) {
  const annualCanvasId = `${canvasId}-annee`;
  try {
    const response = await fetch(`${API_BASE}/api/${endpoint}`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    if (!response.ok) throw new Error(`API inaccessible (${endpoint})`);
    const lignes = await response.json();

    const parProvince = moyenneParProvince(lignes, champValeur);
    const parAnnee = moyenneParAnnee(lignes, champValeur);
    if (!parProvince.length || !parAnnee.length) throw new Error(`Données incomplètes (${endpoint})`);
    updateProvinceMapMetrics(endpoint, parProvince);
    creerGraphiqueBarres(canvasId, parProvince, options);
    creerGraphiqueLigne(annualCanvasId, parAnnee, options);
  } catch (error) {
    console.log(`Chargement du graphique ${endpoint} impossible :`, error);
    // Ne jamais afficher de donnees inventees a la place des vraies : un
    // message honnete est preferable a des chiffres qui n'ont jamais ete
    // verifies contre Azure SQL (voir FALLBACK_SERIES/FALLBACK_ANNUAL, non
    // utilises ici volontairement).
    afficherGraphiqueIndisponible(canvasId);
    afficherGraphiqueIndisponible(annualCanvasId);
  }
}

function chargerTousLesGraphiques() {
  return Promise.all([
  chargerGraphique("temperature", "chart-temperature", "TemperatureMoyenne", {
    couleur: PALETTE.orange,
    unite: "°C",
    titre: "Température moyenne (°C)",
  }),
  chargerGraphique("pollution", "chart-pollution", "ValeurMoyenne", {
    couleur: PALETTE.bleu,
    unite: "Mt CO2e",
    titre: "Émissions moyennes (Mt CO2e)",
  }),
  chargerGraphique("precipitations", "chart-precipitations", "ValeurMoyenne", {
    couleur: PALETTE.teal,
    unite: "mm",
    titre: "Précipitations moyennes (mm)",
  }),
  ]);
}

chargerTousLesGraphiques();

let refreshInProgress = false;
async function actualiserToutesLesDonnees() {
  if (refreshInProgress || document.hidden) return;
  refreshInProgress = true;
  const button = document.getElementById("refresh-data-btn");
  button?.classList.add("loading");
  try {
    await Promise.all([loadResults(), chargerTousLesGraphiques()]);
  } finally {
    refreshInProgress = false;
    button?.classList.remove("loading");
  }
}

document.getElementById("refresh-data-btn")?.addEventListener("click", actualiserToutesLesDonnees);
window.setInterval(actualiserToutesLesDonnees, 20000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) actualiserToutesLesDonnees();
});

/* ================= CONSOLE SQL EN DIRECT (onglet Test en temps réel) ================= */

const sqlSelect = document.getElementById("sqlQuerySelect");
const sqlRunBtn = document.getElementById("sqlRunBtn");
const sqlOutput = document.getElementById("sqlConsoleOutput");

if (sqlRunBtn) {
  sqlRunBtn.addEventListener("click", async () => {
    const cle = sqlSelect.value;
    const label = sqlSelect.options[sqlSelect.selectedIndex].textContent;

    sqlOutput.textContent = `> ${label}\nConnexion à l'API en direct (${API_BASE})…`;

    const start = performance.now();
    try {
      const response = await fetch(`${API_BASE}/resultats`, {
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});
      if (!response.ok) throw new Error("API inaccessible");
      const results = await response.json();
      const item = results.find(r => r.cle === cle);
      const elapsed = (performance.now() - start).toFixed(0);

      if (!item) {
        sqlOutput.textContent = `> ${label}\n✗ Aucun résultat trouvé pour cette requête.`;
        return;
      }

      sqlOutput.textContent =
        `> ${item.question}\n` +
        `✓ Requête exécutée avec succès sur Azure DB SQL Server (${elapsed} ms)\n` +
        `Base : ${item.base}\n\n` +
        JSON.stringify(item.resultat, null, 2);

      actualiserToutesLesDonnees();

    } catch (error) {
      const item = FALLBACK_RESULTS.find(r => r.cle === cle);
      sqlOutput.textContent = item
        ? `> ${item.question}\nMode démonstration local — API temporairement indisponible\nBase : ${item.base}\n\n${JSON.stringify(item.resultat, null, 2)}`
        : `> ${label}\nAucun résultat local pour cette requête.`;
    }
  });
}

/* ================= PROFILS INTERACTIFS DE L'ÉQUIPE ================= */

const TEAM_PROFILES = {
  wilfried: {
    name: "Wilfried Fedjo",
    role: "Coordination du groupe · Power BI",
    image: "assets/photo1.jpg",
    quote: "Ce cours m’a appris à passer de la conception relationnelle à une solution déployée : structurer les données dans SQL Server et Azure, interroger les résultats avec des agrégations, puis les transformer en tableaux de bord Power BI utiles à l’équipe.",
    skills: ["Conception relationnelle", "Agrégations SQL", "Azure SQL", "Power BI"],
  },
  melchisedek: {
    name: "Melchisedek Aka",
    role: "Frontend",
    image: "assets/photo2.jpg",
    quote: "J’ai appris à connecter une application à une base relationnelle par une API, à traduire les résultats SQL en visualisations claires et à tenir compte de l’intégrité, de l’optimisation et de la fiabilité des données dans le frontend.",
    skills: ["Requêtes SQL", "API Node.js", "Optimisation", "Visualisation"],
  },
  debora: {
    name: "Debora Lohoues",
    role: "Bases de données · SQL",
    image: "assets/photo3-blurred.png",
    quote: "J’ai approfondi la conception et la gestion d’une base relationnelle : manipulation SQL, jointures, sous-requêtes, procédures stockées, déclencheurs et transactions pour garantir des données cohérentes et exploitables.",
    skills: ["Jointures", "Sous-requêtes", "Procédures stockées", "Déclencheurs · Transactions"],
  },
};

const teamProfile = document.getElementById("teamProfile");
const teamProfileBack = teamProfile?.querySelector(".team-profile-back");
let lastProfileTrigger = null;

function closeTeamProfile() {
  if (!teamProfile) return;
  teamProfile.classList.remove("open");
  teamProfile.setAttribute("aria-hidden", "true");
  document.body.classList.remove("profile-open");
  window.setTimeout(() => lastProfileTrigger?.focus(), 260);
}

document.querySelectorAll(".member-card[data-profile]").forEach((card) => {
  card.addEventListener("click", () => {
    const profile = TEAM_PROFILES[card.dataset.profile];
    if (!profile || !teamProfile) return;
    lastProfileTrigger = card;
    const image = teamProfile.querySelector(".team-profile-photo img");
    image.src = profile.image;
    image.alt = `Portrait de ${profile.name}`;
    teamProfile.querySelector(".team-profile-role").textContent = profile.role;
    teamProfile.querySelector(".team-profile-name").textContent = profile.name;
    teamProfile.querySelector(".team-profile-quote").textContent = `« ${profile.quote} »`;
    teamProfile.querySelector(".team-profile-signature").textContent = `— ${profile.name}`;
    teamProfile.querySelector(".team-profile-skills").innerHTML = profile.skills.map(skill => `<span>${skill}</span>`).join("");
    teamProfile.classList.add("open");
    teamProfile.setAttribute("aria-hidden", "false");
    document.body.classList.add("profile-open");
    teamProfileBack?.focus();
  });
});

teamProfileBack?.addEventListener("click", closeTeamProfile);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && teamProfile?.classList.contains("open")) closeTeamProfile();
});

/* ================= FOOTER DYNAMIQUE ================= */

const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ================= EFFET PARALLAX HERO ================= */

const hero = document.querySelector(".hero");
window.addEventListener("scroll", () => {
  if (hero) hero.style.backgroundPositionY = window.scrollY * 0.4 + "px";
});