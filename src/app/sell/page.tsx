import type { Metadata } from "next";
import { SellForm } from "@/components/SellForm";

export const metadata: Metadata = {
  title: "Sell an item · CampusSwap",
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold">Sell an item</h1>
        <p className="mt-1 text-slate-500">
          Good photos and an honest description help your item sell faster.
        </p>
      </div>
      <SellForm />
    </div>
  );
}
