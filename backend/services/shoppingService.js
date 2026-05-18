import fs from "fs";

const essentials = JSON.parse(
  fs.readFileSync(new URL("../data/essentials.json", import.meta.url))
);

const marketplaces = [
  {
    name: "Coupang",
    buildUrl: query => `https://www.coupang.com/np/search?q=${encodeURIComponent(query)}`
  },
  {
    name: "Naver Shopping",
    buildUrl: query => `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(query)}`
  },
  {
    name: "MUSINSA",
    buildUrl: query => `https://www.musinsa.com/search/musinsa/integration?q=${encodeURIComponent(query)}`
  }
];

export function buildShoppingRecommendations({ weather, style, profile, limit = 5 }) {
  const triggers = getWeatherTriggers(weather);
  const avoided = new Set(profile.avoid || []);

  return essentials
    .filter(item => triggers.includes(item.trigger))
    .filter(item => !avoided.has(item.category) && !avoided.has(item.name))
    .slice(0, limit)
    .map(item => {
      const searchQuery = buildSearchQuery(item, style, profile);

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        reason: item.reason,
        searchQuery,
        links: marketplaces.map(marketplace => ({
          marketplace: marketplace.name,
          url: marketplace.buildUrl(searchQuery)
        }))
      };
    });
}

export function getWeatherTriggers(weather) {
  const triggers = [];

  if (weather.rain) triggers.push("rain");
  if (weather.windSpeed >= 6) triggers.push("wind");
  if (weather.temp >= 28) triggers.push("hot");
  if (weather.temp < 8) triggers.push("cold");
  if (weather.humidity >= 75 && weather.temp >= 20) triggers.push("humid");

  if (triggers.length === 0) {
    if (weather.temp >= 20) triggers.push("hot");
    if (weather.temp < 15) triggers.push("cold");
  }

  return [...new Set(triggers)];
}

function buildSearchQuery(item, style, profile) {
  const styleTerm = item.styleTerms[style] || item.searchTerm;
  const color = profile.preferredColors.find(
    preferredColor => !styleTerm.toLowerCase().includes(preferredColor)
  );
  const budget = buildBudgetTerm(profile.budget);

  return [color, styleTerm, budget].filter(Boolean).join(" ");
}

function buildBudgetTerm(budget) {
  const budgetTerms = {
    low: "affordable",
    mid: "mid price",
    high: "premium"
  };

  return budgetTerms[budget] || null;
}
