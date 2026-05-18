import { Router } from "express";
import { buildStyleProfileFromBody } from "../services/profileService.js";
import {
  getStyleProfile,
  saveStyleProfile
} from "../services/profileRepository.js";
import { listRecommendationEvents } from "../services/recommendationRepository.js";

const router = Router();

router.get("/:userId", (req, res, next) => {
  try {
    const profile = getStyleProfile(req.params.userId);

    if (!profile) {
      res.status(404).json({ message: "profile not found" });
      return;
    }

    res.json({ profile });
  } catch (err) {
    next(err);
  }
});

router.put("/:userId", (req, res, next) => {
  try {
    const profile = buildStyleProfileFromBody(req.body);
    const savedProfile = saveStyleProfile(req.params.userId, profile);

    res.json({ profile: savedProfile });
  } catch (err) {
    next(err);
  }
});

router.get("/:userId/history", (req, res, next) => {
  try {
    const history = listRecommendationEvents(req.params.userId, req.query.limit);

    res.json({ history });
  } catch (err) {
    next(err);
  }
});

export default router;
