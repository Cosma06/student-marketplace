"use server";

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { insertListing } from "@/lib/listings";
import { CATEGORIES, CONDITIONS } from "@/lib/options";

export type SellFormState = {
  attempt: number;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// TODO: once login exists, take the seller from the session instead of the form
export async function createListing(
  previous: SellFormState,
  formData: FormData,
): Promise<SellFormState> {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const values = {
    title: text("title"),
    description: text("description"),
    price: text("price"),
    category: text("category"),
    condition: text("condition"),
    sellerName: text("sellerName"),
    sellerContact: text("sellerContact"),
  };
  const photo = formData.get("photo");
  const price = Number(values.price);

  // Never trust the browser: check everything again on the server
  const errors: Record<string, string> = {};
  if (values.title.length < 3) errors.title = "Write a title of at least 3 characters.";
  if (values.title.length > 100) errors.title = "Keep the title under 100 characters.";
  if (values.description.length < 10) errors.description = "Describe the item in at least 10 characters.";
  if (values.price === "" || !Number.isFinite(price) || price < 0) {
    errors.price = "Enter a price of 0 or more (0 means free).";
  }
  if (!CATEGORIES.some((c) => c.value === values.category)) errors.category = "Choose a category.";
  if (!CONDITIONS.some((c) => c.value === values.condition)) errors.condition = "Choose the condition.";
  if (values.sellerName.length < 2) errors.sellerName = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.sellerContact)) {
    errors.sellerContact = "Enter a valid email address.";
  }

  const hasPhoto = photo instanceof File && photo.size > 0;
  if (hasPhoto) {
    if (!PHOTO_TYPES[photo.type]) errors.photo = "Use a JPG, PNG or WebP image.";
    else if (photo.size > MAX_PHOTO_SIZE) errors.photo = "The photo must be smaller than 5 MB.";
  }

  if (Object.keys(errors).length > 0) {
    return { attempt: previous.attempt + 1, errors, values };
  }

  // Save the photo in public/uploads with a random name so files never clash
  let imageUrl: string | null = null;
  if (hasPhoto) {
    const fileName = crypto.randomUUID() + PHOTO_TYPES[photo.type];
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(await photo.arrayBuffer()));
    imageUrl = `/uploads/${fileName}`;
  }

  const id = insertListing({
    title: values.title,
    description: values.description,
    price: Math.round(price * 100) / 100,
    category: values.category,
    condition: values.condition,
    imageUrl,
    sellerName: values.sellerName,
    sellerContact: values.sellerContact,
  });

  redirect(`/listings/${id}`);
}
