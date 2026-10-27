import { Suspense } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/options";
import { BrowseListings, BrowseListingsSkeleton } from "@/components/BrowseListings";

export default function Home(props: PageProps<"/">) {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-10 text-white sm:px-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Cumpara si vinde lucruri in campus</h1>
        <p className="mt-2 max-w-xl text-emerald-100">
          Textbooks, notes, electronics and dorm stuff: give your things a second life and save money.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/?category=${c.value}`}
              className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25"
            >
              {c.emoji} {c.label}
            </Link>
          ))}
          <Link
            href="/?maxPrice=0"
            className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25"
          >
            🎁 Free stuff
          </Link>
        </div>
      </section>

      {/* The listings depend on the URL, so they load at request time */}
       <Suspense fallback={<BrowseListingsSkeleton />}>
        <BrowseListings searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
