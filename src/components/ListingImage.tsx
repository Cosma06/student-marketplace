import Image from "next/image";
import { getCategory } from "@/lib/options";

// Shows the listing photo, or a colored placeholder with the category icon
export function ListingImage({
  imageUrl,
  category,
  alt,
  sizes,
}: {
  imageUrl: string | null;
  category: string;
  alt: string;
  sizes: string;
}) {
  if (imageUrl) {
    return <Image src={imageUrl} alt={alt} fill sizes={sizes} className="object-cover" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 text-6xl">
      <span aria-hidden>{getCategory(category).emoji}</span>
    </div>
  );
}
