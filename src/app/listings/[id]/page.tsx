import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing } from "@/lib/listings";
import { getCategory, getConditionLabel } from "@/lib/options";
import { formatPrice, timeAgo } from "@/lib/format";
import { ListingImage } from "@/components/ListingImage";

export default function ListingPage(props: PageProps<"/listings/[id]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
        ← Back to all listings
      </Link>
      <Suspense fallback={<div className="mt-4 h-96 animate-pulse rounded-2xl bg-slate-200" />}>
        <ListingDetails params={props.params} />
      </Suspense>
    </div>
  );
}

async function ListingDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(Number(id));
  if (!listing) notFound();

  const category = getCategory(listing.category);

  return (
    <div className="mt-4 grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <ListingImage
          imageUrl={listing.imageUrl}
          category={listing.category}
          alt={listing.title}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <Link
              href={`/?category=${category.value}`}
              className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 hover:bg-indigo-100"
            >
              {category.emoji} {category.label}
            </Link>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              {getConditionLabel(listing.condition)}
            </span>
          </div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className={`text-3xl font-bold ${listing.price === 0 ? "text-emerald-600" : "text-indigo-600"}`}>
            {formatPrice(listing.price)}
          </p>
          <p className="text-sm text-slate-500">Posted {timeAgo(listing.createdAt)}</p>
        </div>

        <div>
          <h2 className="mb-1 font-semibold">Description</h2>
          <p className="whitespace-pre-line text-slate-700">{listing.description}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {listing.sellerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{listing.sellerName}</p>
              <p className="text-sm text-slate-500">Seller</p>
            </div>
          </div>
          <a
            href={`mailto:${listing.sellerContact}?subject=${encodeURIComponent(`CampusSwap: ${listing.title}`)}`}
            className="mt-4 block rounded-lg bg-indigo-600 py-3 text-center font-semibold text-white hover:bg-indigo-700"
          >
            Contact seller
          </a>
        </div>
      </div>
    </div>
  );
}
