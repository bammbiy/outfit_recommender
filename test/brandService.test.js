import test from "node:test";
import assert from "node:assert/strict";
import { getBrands } from "../backend/services/brandService.js";

test("getBrands returns style matched and versatile brands", () => {
  const brands = getBrands("minimal");

  assert.ok(brands.includes("Andersson Bell"));
  assert.ok(brands.includes("Covernat"));
  assert.ok(brands.includes("MUSINSA Standard"));
});

test("getBrands limits recommendations for a concise result", () => {
  const brands = getBrands("streetwear");

  assert.ok(brands.length <= 4);
});
