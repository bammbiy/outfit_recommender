import test from "node:test";
import assert from "node:assert/strict";
import { getWeather } from "../backend/services/weatherService.js";

test("getWeather supports mock weather for local demos", async () => {
  const weather = await getWeather("Seoul", { mock: true });

  assert.equal(weather.city, "Seoul");
  assert.equal(weather.condition, "Clouds");
  assert.equal(weather.rain, false);
});

test("getWeather supports rainy mock weather scenarios", async () => {
  const weather = await getWeather("Seoul", {
    mock: true,
    mockWeather: "rain"
  });

  assert.equal(weather.condition, "Rain");
  assert.equal(weather.rain, true);
});
