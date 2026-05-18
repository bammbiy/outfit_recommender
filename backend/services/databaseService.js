import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DatabaseSync } from "node:sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDatabasePath = path.join(__dirname, "..", "data", "wearcast.sqlite");

let database;

export function initDatabase() {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS style_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      style TEXT NOT NULL,
      preferred_fit TEXT,
      preferred_colors TEXT NOT NULL DEFAULT '[]',
      budget TEXT,
      avoid_items TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recommendation_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      city TEXT NOT NULL,
      style TEXT NOT NULL,
      occasion TEXT NOT NULL,
      weather_condition TEXT NOT NULL,
      temp REAL NOT NULL,
      shopping_count INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

export function getDatabase() {
  if (!database) {
    const databasePath = process.env.DATABASE_PATH || defaultDatabasePath;

    if (databasePath !== ":memory:") {
      fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    }

    database = new DatabaseSync(databasePath);
  }

  return database;
}

export function closeDatabase() {
  if (database) {
    database.close();
    database = null;
  }
}
