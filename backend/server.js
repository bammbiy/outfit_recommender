import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import outfitRouter from "./routes/outfit.js";
import profileRouter from "./routes/profile.js";
import { initDatabase } from "./services/databaseService.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "..", "public");

initDatabase();

app.use(express.json());
app.use(express.static(publicPath));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "weather-outfit-recommender"
  });
});

app.use("/api/outfit", outfitRouter);
app.use("/api/profile", profileRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Weather outfit recommender is running on port ${port}`);
});
