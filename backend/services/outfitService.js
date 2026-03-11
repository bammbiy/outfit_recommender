import fs from "fs";

const outfits = JSON.parse(
  fs.readFileSync(new URL("../data/outfits.json", import.meta.url))
);

export function buildOutfit(weather) {

  const temp = weather.temp;

  if (temp >= 28) return outfits.hot;

  if (temp >= 20) return outfits.warm;

  if (temp >= 10) return outfits.cool;

  return outfits.cold;

}

if (!weather || weather.temp === undefined) {
  return outfits.warm
}