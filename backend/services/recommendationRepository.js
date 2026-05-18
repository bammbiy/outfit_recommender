import { getDatabase, initDatabase } from "./databaseService.js";

export function recordRecommendationEvent({
  userId,
  city,
  style,
  occasion,
  weather,
  shoppingCount
}) {
  initDatabase();

  getDatabase().prepare(`
    INSERT INTO recommendation_events (
      user_id,
      city,
      style,
      occasion,
      weather_condition,
      temp,
      shopping_count
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId || null,
    city,
    style,
    occasion,
    weather.condition,
    weather.temp,
    shoppingCount
  );
}

export function listRecommendationEvents(userId, limit = 20) {
  initDatabase();

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const rows = userId
    ? getDatabase()
      .prepare(`
        SELECT * FROM recommendation_events
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `)
      .all(userId, safeLimit)
    : getDatabase()
      .prepare(`
        SELECT * FROM recommendation_events
        ORDER BY created_at DESC
        LIMIT ?
      `)
      .all(safeLimit);

  return rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    city: row.city,
    style: row.style,
    occasion: row.occasion,
    weatherCondition: row.weather_condition,
    temp: row.temp,
    shoppingCount: row.shopping_count,
    createdAt: row.created_at
  }));
}
