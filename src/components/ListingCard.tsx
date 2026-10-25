import Link from "next/link";
import type { Listing } from "@/lib/listings";
import { getConditionLabel } from "@/lib/options";
import { formatPrice, timeAgo } from "@/lib/format";
import { ListingImage } from "./ListingImage";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ListingImage
          imageUrl={listing.imageUrl}
          category={listing.category}
          alt={listing.title}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="space-y-1 p-4">
        <p className={`text-lg font-bold ${listing.price === 0 ? "text-emerald-600" : "text-slate-900"}`}>
          {formatPrice(listing.price)}
        </p>
        <h3 className="line-clamp-2 font-medium text-slate-800 group-hover:text-indigo-700">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-0.5">
            {getConditionLabel(listing.condition)}
          </span>
          <span>{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-slate-200" />
      <div className="space-y-2 p-4">
        <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
