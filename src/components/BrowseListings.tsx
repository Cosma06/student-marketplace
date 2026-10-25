import Form from "next/form";
import Link from "next/link";
import { getListings, type ListingFilters } from "@/lib/listings";
import { CATEGORIES, CONDITIONS, SORT_OPTIONS } from "@/lib/options";
import { ListingCard, ListingCardSkeleton } from "./ListingCard";

type SearchParams = { [key: string]: string | string[] | undefined };

function readString(value: string | string[] | undefined) {
  const text = Array.isArray(value) ? value[0] : value;
  return text?.trim() || undefined;
}

function readNumber(value: string | string[] | undefined) {
  const text = readString(value);
  if (text === undefined) return undefined;
  const number = Number(text);
  return Number.isFinite(number) ? number : undefined;
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export async function BrowseListings({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filters: ListingFilters = {
    q: readString(params.q),
    category: readString(params.category),
    condition: readString(params.condition),
    minPrice: readNumber(params.minPrice),
    maxPrice: readNumber(params.maxPrice),
    sort: readString(params.sort),
  };
  const listings = await getListings(filters);
  const hasFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    // One form for the search bar and the filters, so they all end up in the URL together
    // The key resets the inputs when the URL changes (for example after "Clear all")
    <Form key={JSON.stringify(filters)} action="/" className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit space-y-4 rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-20">
        <h2 className="font-semibold">Filters</h2>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select name="category" defaultValue={filters.category ?? ""} className={inputClass}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Condition</span>
          <select name="condition" defaultValue={filters.condition ?? ""} className={inputClass}>
            <option value="">Any condition</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Price (lei)</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              min={0}
              placeholder="Min"
              aria-label="Minimum price"
              defaultValue={filters.minPrice}
              className={inputClass}
            />
            <span className="text-slate-400">–</span>
            <input
              type="number"
              name="maxPrice"
              min={0}
              placeholder="Max"
              aria-label="Maximum price"
              defaultValue={filters.maxPrice}
              className={inputClass}
            />
          </div>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Sort by</span>
          <select name="sort" defaultValue={filters.sort ?? "newest"} className={inputClass}>
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Apply filters
        </button>
        {hasFilters && (
          <Link href="/" className="block text-center text-sm text-slate-500 hover:text-slate-800">
            Clear all
          </Link>
        )}
      </aside>

      <section className="space-y-4">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Search for books, calculators, bikes..."
            aria-label="Search listings"
            className={`${inputClass} py-3 text-base`}
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Search
          </button>
        </div>

        <p className="text-sm text-slate-500">
          {listings.length} {listings.length === 1 ? "item" : "items"}
          {filters.q && <> for &ldquo;{filters.q}&rdquo;</>}
        </p>

        {listings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-2 font-medium">Nothing found</p>
            <p className="text-sm text-slate-500">Try other words or remove some filters.</p>
          </div>
        )}
      </section>
    </Form>
  );
}

export function BrowseListingsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
      <div className="space-y-4">
        <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
