import test from "node:test";
import assert from "node:assert/strict";
import { buildOutfit, buildOutfitRecommendation } from "../backend/services/outfitService.js";

test("buildOutfit maps hot weather to summer items", () => {
  const outfit = buildOutfit({ temp: 31 });

  assert.equal(outfit.top, "oversized t-shirt");
  assert.equal(outfit.bottom, "shorts");
});

test("buildOutfit falls back to warm weather items when weather is missing", () => {
  const outfit = buildOutfit();

  assert.equal(outfit.top, "t-shirt");
});

test("buildOutfitRecommendation includes style, occasion, and matching tips", () => {
  const recommendation = buildOutfitRecommendation({
    weather: {
      city: "Seoul",
      temp: 18,
      rain: false
    },
    style: "streetwear",
    occasion: "date"
  });

  assert.equal(recommendation.items.fit, "oversized");
  assert.equal(recommendation.mood, "polished casual");
  assert.ok(recommendation.matchingTips.length > 0);
});

test("buildOutfitRecommendation applies user style profile preferences", () => {
  const recommendation = buildOutfitRecommendation({
    weather: {
      city: "Seoul",
      temp: 18,
      rain: false
    },
    style: "minimal",
    occasion: "work",
    profile: {
      preferredFit: "wide",
      preferredColors: ["black"],
      budget: "mid"
    }
  });

  assert.equal(recommendation.items.fit, "wide");
  assert.equal(recommendation.items.palette[0], "black");
  assert.ok(recommendation.personalization.length > 0);
});
