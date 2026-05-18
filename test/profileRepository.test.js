import fs from "fs";
import os from "os";
import path from "path";
import test from "node:test";
import assert from "node:assert/strict";

process.env.DATABASE_PATH = path.join(
  os.tmpdir(),
  `wearcast-profile-${Date.now()}.sqlite`
);

const { closeDatabase } = await import("../backend/services/databaseService.js");
const {
  getStyleProfile,
  mergeStyleProfiles,
  saveStyleProfile
} = await import("../backend/services/profileRepository.js");

test.after(() => {
  closeDatabase();
  fs.rmSync(process.env.DATABASE_PATH, { force: true });
});

test("saveStyleProfile stores and reads a user profile", () => {
  const saved = saveStyleProfile("demo-user", {
    style: "minimal",
    preferredFit: "regular",
    preferredColors: ["black", "gray"],
    budget: "mid",
    avoid: ["suede"]
  });

  const profile = getStyleProfile("demo-user");

  assert.equal(saved.userId, "demo-user");
  assert.equal(profile.style, "minimal");
  assert.deepEqual(profile.preferredColors, ["black", "gray"]);
  assert.deepEqual(profile.avoid, ["suede"]);
});

test("mergeStyleProfiles lets request preferences override saved profile", () => {
  const merged = mergeStyleProfiles(
    {
      style: "minimal",
      preferredFit: "regular",
      preferredColors: ["black"],
      budget: "mid",
      avoid: []
    },
    {
      style: "streetwear",
      preferredFit: null,
      preferredColors: ["blue"],
      budget: null,
      avoid: ["boots"]
    }
  );

  assert.equal(merged.style, "streetwear");
  assert.equal(merged.preferredFit, "regular");
  assert.deepEqual(merged.preferredColors, ["blue"]);
  assert.deepEqual(merged.avoid, ["boots"]);
});
