/* =====================================================
   BAROMETRE CLIMAT CANADA — GREEN SOFT
===================================================== */

// En local (API lancée avec `npm start` dans /api) : http://localhost:3000
// Pendant les tests avec Aka (tunnel ngrok) : remplacer par l'URL ngrok actuelle,
// ex. "https://abc123.ngrok-free.app" (change à chaque redémarrage du tunnel).
// Une fois l'API déployée en ligne (Azure), remplacer par son URL publique définitive.
const API_BASE = "https://coach-chief-appealing.ngrok-free.dev";

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

const themeToggle = document.getElementById("themeToggle");
const rootEl = document.documentElement;

function applyTheme(theme) {
  rootEl.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.innerHTML = theme === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }
}

applyTheme(localStorage.getItem("theme") || "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}

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
  if (resultat.Annee) parts.push(`${resultat.Annee}`);
  if (resultat.Mois) parts.push(`(mois ${resultat.Mois})`);
  if (resultat.NomProvince) parts.push(resultat.NomProvince);
  if (resultat.TemperatureMoyenne !== undefined) parts.push(`${resultat.TemperatureMoyenne} °C`);
  if (resultat.TemperatureMoyenneGlobale !== undefined) parts.push(`${resultat.TemperatureMoyenneGlobale} °C`);
  if (resultat.EmissionsMoyennesMtCO2e !== undefined) parts.push(`${resultat.EmissionsMoyennesMtCO2e} Mt CO2e`);
  if (resultat.TotalEmissionsMtCO2e !== undefined) parts.push(`${resultat.TotalEmissionsMtCO2e} Mt CO2e`);
  if (resultat.TotalPrecipitationMm !== undefined) parts.push(`${resultat.TotalPrecipitationMm} mm`);
  if (resultat.PrecipitationMoyenneMm !== undefined) parts.push(`${resultat.PrecipitationMoyenneMm} mm`);
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
  fillHighlight("hl-temp-province", byKey.provincePlusChaude);
  fillHighlight("hl-pollution-province", byKey.provincePlusPolluee);
  fillHighlight("hl-pluie-province", byKey.provincePlusPluvieuse);
}

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
    const results = await response.json();

    if (fullTable) fullTable.innerHTML = rowsHtml(results, true);

    const isTemp = b => /temp/i.test(b || "");
    const isCo2 = b => /pollu/i.test(b || "");
    const isPrecip = b => /precip/i.test(b || "");

    if (tempTable) tempTable.innerHTML = rowsHtml(results.filter(r => isTemp(r.base)), false);
    if (co2Table) co2Table.innerHTML = rowsHtml(results.filter(r => isCo2(r.base)), false);
    if (precipTable) precipTable.innerHTML = rowsHtml(results.filter(r => isPrecip(r.base)), false);

    fillHighlights(results, true);

  } catch (error) {
    console.log("Chargement API impossible :", error);
    const msg = `<tr><td colspan="3">Connexion à l'API analytique en attente (vérifie qu'elle tourne sur ${API_BASE}).</td></tr>`;
    if (fullTable) fullTable.innerHTML = msg;
    if (tempTable) tempTable.innerHTML = msg.replace('colspan="3"', 'colspan="2"');
    if (co2Table) co2Table.innerHTML = msg.replace('colspan="3"', 'colspan="2"');
    if (precipTable) precipTable.innerHTML = msg.replace('colspan="3"', 'colspan="2"');

    fillHighlights(null, false);
  }
}

loadResults();

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

    } catch (error) {
      sqlOutput.textContent =
        `> ${label}\n` +
        `✗ Connexion à l'API impossible (${API_BASE}).\n` +
        `Vérifie qu'elle tourne, puis réessaie.`;
    }
  });
}

/* ================= FOOTER DYNAMIQUE ================= */

const footerText = document.querySelector("footer p");
if (footerText) {
  footerText.innerHTML = `© ${new Date().getFullYear()} GREEN SOFT — Baromètre Climat Canada`;
}

/* ================= EFFET PARALLAX HERO ================= */

const hero = document.querySelector(".hero");
window.addEventListener("scroll", () => {
  if (hero) hero.style.backgroundPositionY = window.scrollY * 0.4 + "px";
});