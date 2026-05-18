import test from "node:test";
import assert from "node:assert/strict";
import {
  buildShoppingRecommendations,
  getWeatherTriggers
} from "../backend/services/shoppingService.js";

test("getWeatherTriggers detects rainy weather needs", () => {
  const triggers = getWeatherTriggers({
    temp: 18,
    humidity: 60,
    windSpeed: 2,
    rain: true
  });

  assert.ok(triggers.includes("rain"));
});

test("buildShoppingRecommendations creates marketplace search links", () => {
  const shopping = buildShoppingRecommendations({
    weather: {
      temp: 18,
      humidity: 60,
      windSpeed: 2,
      rain: true
    },
    style: "minimal",
    profile: {
      preferredColors: ["black"],
      avoid: []
    }
  });

  assert.ok(shopping.length > 0);
  assert.equal(shopping[0].links[0].marketplace, "Coupang");
  assert.match(shopping[0].links[0].url, /coupang\.com/);
});
