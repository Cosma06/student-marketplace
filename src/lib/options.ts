// Shared lists used by both server code and browser components (no database imports here)

export const CATEGORIES = [
  { value: "books", label: "Books & Notes", emoji: "📚" },
  { value: "electronics", label: "Electronics", emoji: "💻" },
  { value: "furniture", label: "Furniture & Dorm", emoji: "🪑" },
  { value: "clothing", label: "Clothing", emoji: "👕" },
  { value: "sports", label: "Sports & Bikes", emoji: "🚲" },
  { value: "other", label: "Other", emoji: "📦" },
] as const;

export const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export function getCategory(value: string) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function getConditionLabel(value: string) {
  return CONDITIONS.find((c) => c.value === value)?.label ?? value;
}
