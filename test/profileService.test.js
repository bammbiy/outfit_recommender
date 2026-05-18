import test from "node:test";
import assert from "node:assert/strict";
import { buildStyleProfile } from "../backend/services/profileService.js";

test("buildStyleProfile normalizes comma separated preferences", () => {
  const profile = buildStyleProfile({
    style: "Streetwear",
    fit: "Oversized",
    colors: "Black, Gray",
    budget: "Mid",
    avoid: "suede,boots"
  });

  assert.equal(profile.style, "streetwear");
  assert.equal(profile.preferredFit, "oversized");
  assert.deepEqual(profile.preferredColors, ["black", "gray"]);
  assert.deepEqual(profile.avoid, ["suede", "boots"]);
});
