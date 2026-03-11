import fs from "fs";

const brands = JSON.parse(
  fs.readFileSync(new URL("../data/brands.json", import.meta.url))
);

export function getBrands(style) {

  return brands
    .filter(b => b.tags.includes(style) || b.tags.includes("versatile"))
    .slice(0, 4)
    .map(b => b.name);

}