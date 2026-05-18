import fs from "fs";
import os from "os";
import path from "path";
import test from "node:test";
import assert from "node:assert/strict";

process.env.DATABASE_PATH = path.join(
  os.tmpdir(),
  `wearcast-history-${Date.now()}.sqlite`
);

const { closeDatabase } = await import("../backend/services/databaseService.js");
const {
  listRecommendationEvents,
  recordRecommendationEvent
} = await import("../backend/services/recommendationRepository.js");

test.after(() => {
  closeDatabase();
  fs.rmSync(process.env.DATABASE_PATH, { force: true });
});

test("recordRecommendationEvent stores recommendation history", () => {
  recordRecommendationEvent({
    userId: "demo-user",
    city: "Seoul",
    style: "minimal",
    occasion: "work",
    weather: {
      condition: "Rain",
      temp: 16
    },
    shoppingCount: 4
  });

  const history = listRecommendationEvents("demo-user");

  assert.equal(history.length, 1);
  assert.equal(history[0].city, "Seoul");
  assert.equal(history[0].weatherCondition, "Rain");
  assert.equal(history[0].shoppingCount, 4);
});
