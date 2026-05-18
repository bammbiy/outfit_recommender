import { getDatabase, initDatabase } from "./databaseService.js";

export function saveStyleProfile(userId, profile) {
  assertUserId(userId);
  initDatabase();

  const db = getDatabase();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO style_profiles (
      user_id,
      style,
      preferred_fit,
      preferred_colors,
      budget,
      avoid_items,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      style = excluded.style,
      preferred_fit = excluded.preferred_fit,
      preferred_colors = excluded.preferred_colors,
      budget = excluded.budget,
      avoid_items = excluded.avoid_items,
      updated_at = excluded.updated_at
  `).run(
    userId,
    profile.style,
    profile.preferredFit,
    JSON.stringify(profile.preferredColors),
    profile.budget,
    JSON.stringify(profile.avoid),
    now,
    now
  );

  return getStyleProfile(userId);
}

export function getStyleProfile(userId) {
  assertUserId(userId);
  initDatabase();

  const row = getDatabase()
    .prepare("SELECT * FROM style_profiles WHERE user_id = ?")
    .get(userId);

  if (!row) return null;

  return mapProfileRow(row);
}

export function mergeStyleProfiles(savedProfile, queryProfile) {
  return {
    style: queryProfile.style || savedProfile?.style || "casual",
    preferredFit: queryProfile.preferredFit || savedProfile?.preferredFit || null,
    preferredColors: queryProfile.preferredColors.length > 0
      ? queryProfile.preferredColors
      : savedProfile?.preferredColors || [],
    budget: queryProfile.budget || savedProfile?.budget || null,
    avoid: queryProfile.avoid.length > 0
      ? queryProfile.avoid
      : savedProfile?.avoid || []
  };
}

function mapProfileRow(row) {
  return {
    userId: row.user_id,
    style: row.style,
    preferredFit: row.preferred_fit,
    preferredColors: JSON.parse(row.preferred_colors),
    budget: row.budget,
    avoid: JSON.parse(row.avoid_items),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function assertUserId(userId) {
  if (!userId || typeof userId !== "string") {
    const err = new Error("userId is required");
    err.status = 400;
    throw err;
  }
}
