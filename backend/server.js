import express from "express";
import outfitRouter from "./routes/outfit.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "weather-outfit-recommender"
  });
});

app.use("/api/outfit", outfitRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Weather outfit recommender is running on port ${port}`);
});
