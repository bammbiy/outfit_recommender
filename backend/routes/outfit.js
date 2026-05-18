import { Router } from "express";
import { getWeather } from "../services/weatherService.js";
import { buildOutfitRecommendation } from "../services/outfitService.js";
import { getBrands } from "../services/brandService.js";
import { buildStyleProfile } from "../services/profileService.js";
import { buildShoppingRecommendations } from "../services/shoppingService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const city = req.query.city?.toString().trim();
    const style = req.query.style?.toString().trim() || "casual";
    const occasion = req.query.occasion?.toString().trim() || "daily";
    const mock = req.query.mock === "true";
    const mockWeather = req.query.mockWeather?.toString().trim();
    const profile = buildStyleProfile({
      style,
      fit: req.query.fit,
      colors: req.query.colors,
      budget: req.query.budget,
      avoid: req.query.avoid
    });

    const weather = await getWeather(city, { mock, mockWeather });
    const outfit = buildOutfitRecommendation({ weather, style, occasion, profile });
    const brands = getBrands(style);
    const shopping = buildShoppingRecommendations({ weather, style, profile });

    res.json({
      weather,
      recommendation: outfit,
      shopping,
      brands,
      meta: {
        style,
        occasion,
        profile,
        disclosure: "Shopping links are search links for discovery and are not paid affiliate links yet.",
        nextFeatures: [
          "wardrobe based matching",
          "trend weighted brand ranking",
          "affiliate conversion tracking"
        ]
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
