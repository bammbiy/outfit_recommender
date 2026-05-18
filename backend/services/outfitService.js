import fs from "fs";
import { applyStyle } from "../utils/styleEngine.js";

const outfits = JSON.parse(
  fs.readFileSync(new URL("../data/outfits.json", import.meta.url))
);

const occasionAdjustments = {
  daily: {
    mood: "easy daily styling",
    extra: "comfortable silhouette"
  },
  work: {
    mood: "clean smart casual",
    extra: "structured outerwear"
  },
  date: {
    mood: "polished casual",
    extra: "one accent item"
  },
  travel: {
    mood: "practical layering",
    extra: "comfortable shoes"
  },
  school: {
    mood: "casual campus look",
    extra: "backpack friendly layers"
  }
};

export function buildOutfit(weather) {
  if (!weather || typeof weather.temp !== "number") {
    return outfits.warm;
  }

  if (weather.temp >= 28) return outfits.hot;
  if (weather.temp >= 20) return outfits.warm;
  if (weather.temp >= 10) return outfits.cool;

  return outfits.cold;
}

export function buildOutfitRecommendation({ weather, style, occasion, profile = {} }) {
  const userProfile = {
    preferredColors: [],
    ...profile
  };
  const baseOutfit = buildOutfit(weather);
  const styledOutfit = personalizeOutfit(applyStyle(baseOutfit, style), userProfile);
  const occasionConfig = occasionAdjustments[occasion] || occasionAdjustments.daily;
  const weatherNotes = buildWeatherNotes(weather);

  return {
    summary: buildSummary(weather, style, occasionConfig),
    items: {
      ...styledOutfit,
      detail: occasionConfig.extra
    },
    mood: occasionConfig.mood,
    reasons: weatherNotes,
    personalization: buildPersonalizationNotes(userProfile),
    matchingTips: buildMatchingTips(styledOutfit, weather)
  };
}

function buildSummary(weather, style, occasionConfig) {
  return `${weather.city} weather fits a ${style} look with ${occasionConfig.mood}.`;
}

function buildWeatherNotes(weather) {
  const notes = [];

  if (weather.temp >= 28) {
    notes.push("High temperature calls for breathable tops and lighter bottoms.");
  } else if (weather.temp >= 20) {
    notes.push("Mild weather works well with a light layer that can be removed.");
  } else if (weather.temp >= 10) {
    notes.push("Cool weather needs long sleeves and an outer layer.");
  } else {
    notes.push("Cold weather needs heavier layers and warmer shoes.");
  }

  if (weather.rain) {
    notes.push("Rain is expected, so water resistant outerwear is recommended.");
  }

  return notes;
}

function buildMatchingTips(outfit, weather) {
  const tips = [
    `Match ${outfit.top} with ${outfit.bottom} for a balanced silhouette.`,
    `Use ${outfit.palette.join(", ")} as the main color palette.`
  ];

  if (weather.rain) {
    tips.push("Avoid suede shoes and choose darker pants for wet streets.");
  }

  return tips;
}

function personalizeOutfit(outfit, profile) {
  return {
    ...outfit,
    fit: profile.preferredFit || outfit.fit,
    palette: profile.preferredColors.length > 0
      ? mergePalette(profile.preferredColors, outfit.palette)
      : outfit.palette
  };
}

function mergePalette(preferredColors, basePalette) {
  return [...new Set([...preferredColors, ...basePalette])].slice(0, 4);
}

function buildPersonalizationNotes(profile) {
  const notes = [];

  if (profile.preferredFit) {
    notes.push(`Adjusted the silhouette toward your preferred ${profile.preferredFit} fit.`);
  }

  if (profile.preferredColors.length > 0) {
    notes.push(`Prioritized your preferred colors: ${profile.preferredColors.join(", ")}.`);
  }

  if (profile.budget) {
    notes.push(`Shopping suggestions will lean toward your ${profile.budget} budget range.`);
  }

  return notes;
}
