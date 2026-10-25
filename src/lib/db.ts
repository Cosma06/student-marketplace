import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { seedListings } from "./seed";

// The database is a single file: data/marketplace.db
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "marketplace.db");

function openDatabase() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      title          TEXT    NOT NULL,
      description    TEXT    NOT NULL,
      price          REAL    NOT NULL,
      category       TEXT    NOT NULL,
      condition      TEXT    NOT NULL,
      image_url      TEXT,
      seller_name    TEXT    NOT NULL,
      seller_contact TEXT    NOT NULL,
      status         TEXT    NOT NULL DEFAULT 'active',
      created_at     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Fill an empty database with example listings so the site isn't blank
  const { count } = db
    .prepare("SELECT COUNT(*) AS count FROM listings")
    .get() as { count: number };
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO listings
        (title, description, price, category, condition, seller_name, seller_contact, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
    `);
    for (const item of seedListings) {
      insert.run(
        item.title,
        item.description,
        item.price,
        item.category,
        item.condition,
        item.sellerName,
        item.sellerContact,
        `-${item.hoursAgo} hours`,
      );
    }
  }

  return db;
}

// Reuse one connection, even when the dev server hot-reloads this file
const globalForDb = globalThis as unknown as { db?: DatabaseSync };
export const db = globalForDb.db ?? openDatabase();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;
