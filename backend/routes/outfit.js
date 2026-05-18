import { Router } from "express";
import { getWeather } from "../services/weatherService.js";
import { buildOutfitRecommendation } from "../services/outfitService.js";
import { getBrands } from "../services/brandService.js";
import { buildStyleProfile } from "../services/profileService.js";
import { buildShoppingRecommendations } from "../services/shoppingService.js";
import {
  getStyleProfile,
  mergeStyleProfiles
} from "../services/profileRepository.js";
import { recordRecommendationEvent } from "../services/recommendationRepository.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const city = req.query.city?.toString().trim();
    const style = req.query.style?.toString().trim() || "casual";
    const occasion = req.query.occasion?.toString().trim() || "daily";
    const mock = req.query.mock === "true";
    const mockWeather = req.query.mockWeather?.toString().trim();
    const userId = req.query.userId?.toString().trim();
    const queryProfile = buildStyleProfile({
      style: req.query.style,
      fit: req.query.fit,
      colors: req.query.colors,
      budget: req.query.budget,
      avoid: req.query.avoid
    }, {
      applyDefaults: !userId
    });
    const savedProfile = userId ? getStyleProfile(userId) : null;
    const profile = mergeStyleProfiles(savedProfile, queryProfile);
    const selectedStyle = profile.style || style;

    const weather = await getWeather(city, { mock, mockWeather });
    const outfit = buildOutfitRecommendation({
      weather,
      style: selectedStyle,
      occasion,
      profile
    });
    const brands = getBrands(selectedStyle);
    const shopping = buildShoppingRecommendations({
      weather,
      style: selectedStyle,
      profile
    });

    recordRecommendationEvent({
      userId,
      city: weather.city,
      style: selectedStyle,
      occasion,
      weather,
      shoppingCount: shopping.length
    });

    res.json({
      weather,
      recommendation: outfit,
      shopping,
      brands,
      meta: {
        userId,
        style: selectedStyle,
        occasion,
        profile,
        profileSource: savedProfile ? "saved" : "request",
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
