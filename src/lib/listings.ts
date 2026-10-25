import { connection } from "next/server";
import type { SQLInputValue } from "node:sqlite";
import { db } from "./db";

export type Listing = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  imageUrl: string | null;
  sellerName: string;
  sellerContact: string;
  status: string;
  createdAt: Date;
};

// How a row looks in the database (snake_case columns)
type ListingRow = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  image_url: string | null;
  seller_name: string;
  seller_contact: string;
  status: string;
  created_at: string;
};

function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    category: row.category,
    condition: row.condition,
    imageUrl: row.image_url,
    sellerName: row.seller_name,
    sellerContact: row.seller_contact,
    status: row.status,
    // SQLite stores UTC time as "YYYY-MM-DD HH:MM:SS"
    createdAt: new Date(row.created_at.replace(" ", "T") + "Z"),
  };
}

export type ListingFilters = {
  q?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
};

export async function getListings(filters: ListingFilters): Promise<Listing[]> {
  // Read fresh data on every request instead of at build time
  await connection();

  const where = ["status = 'active'"];
  const params: SQLInputValue[] = [];

  if (filters.q) {
    where.push("(title LIKE ? OR description LIKE ?)");
    params.push(`%${filters.q}%`, `%${filters.q}%`);
  }
  if (filters.category) {
    where.push("category = ?");
    params.push(filters.category);
  }
  if (filters.condition) {
    where.push("condition = ?");
    params.push(filters.condition);
  }
  if (filters.minPrice !== undefined) {
    where.push("price >= ?");
    params.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    where.push("price <= ?");
    params.push(filters.maxPrice);
  }

  const orderBy =
    filters.sort === "price-asc"
      ? "price ASC"
      : filters.sort === "price-desc"
        ? "price DESC"
        : "created_at DESC, id DESC";

  const rows = db
    .prepare(`SELECT * FROM listings WHERE ${where.join(" AND ")} ORDER BY ${orderBy}`)
    .all(...params) as ListingRow[];
  return rows.map(toListing);
}

export async function getListing(id: number): Promise<Listing | null> {
  await connection();
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(id) as
    | ListingRow
    | undefined;
  return row ? toListing(row) : null;
}

export type NewListing = Omit<Listing, "id" | "status" | "createdAt">;

export function insertListing(listing: NewListing): number {
  const result = db
    .prepare(
      `INSERT INTO listings
        (title, description, price, category, condition, image_url, seller_name, seller_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      listing.title,
      listing.description,
      listing.price,
      listing.category,
      listing.condition,
      listing.imageUrl,
      listing.sellerName,
      listing.sellerContact,
    );
  return Number(result.lastInsertRowid);
}
