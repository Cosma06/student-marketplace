"use client";

import { useActionState, useState } from "react";
import { createListing, type SellFormState } from "@/app/actions";
import { CATEGORIES, CONDITIONS } from "@/lib/options";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-600">{message}</p>;
}

function PhotoInput({ error }: { error?: string }) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <label className="block space-y-1">
      <span className="font-medium">Photo</span>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-3xl">
          {preview ? (
            // A local preview of the chosen file, so a plain <img> is fine here
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview of the chosen photo" className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden>📷</span>
          )}
        </div>
        <div className="space-y-1">
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
            className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="text-sm text-slate-500">Optional. JPG, PNG or WebP, maxim 5 MB.</p>
        </div>
      </div>
      <FieldError message={error} />
    </label>
  );
}
function TitleInput({ defaultValue, error }: { defaultValue?: string; error?: string }) {
  const [length, setLength] = useState(defaultValue?.length ?? 0);

  return (
    <label className="block space-y-1">
      <span className="font-medium">Title</span>
      <input
        name="title"
        defaultValue={defaultValue}
        placeholder="e.g. Calculus textbook, 2nd edition"
        maxLength={100}
        className={inputClass}
        onChange={(e) => setLength(e.target.value.length)}
      />
      <p className="text-right text-sm text-slate-500">{length} / 100</p>
      <FieldError message={error} />
    </label>
  );
}
export function SellForm() {
  const [state, formAction, pending] = useActionState(createListing, { attempt: 0 } as SellFormState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    // React clears a form after each submit; the key rebuilds it with the values the server sent back
    <form
      key={state.attempt}
      action={formAction}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <PhotoInput error={errors.photo} />

            <TitleInput defaultValue={values.title} error={errors.title} />
      <label className="block space-y-1">
        <span className="font-medium">Description</span>
        <textarea
          name="description"
          defaultValue={values.description}
          rows={5}
          placeholder="Condition, what's included, where to pick it up..."
          className={inputClass}
        />
        <FieldError message={errors.description} />
      </label>

      <div className="grid gap-6 sm:grid-cols-3">
        <label className="block space-y-1">
          <span className="font-medium">Price (lei)</span>
          <input
            type="number"
            name="price"
            min={0}
            step="0.01"
            defaultValue={values.price}
            placeholder="0 = free"
            className={inputClass}
          />
          <FieldError message={errors.price} />
        </label>

        <label className="block space-y-1">
          <span className="font-medium">Category</span>
          <select name="category" defaultValue={values.category ?? ""} className={inputClass}>
            <option value="" disabled>
              Choose...
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.category} />
        </label>

        <label className="block space-y-1">
          <span className="font-medium">Condition</span>
          <select name="condition" defaultValue={values.condition ?? ""} className={inputClass}>
            <option value="" disabled>
              Choose...
            </option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.condition} />
        </label>
      </div>

      <div className="grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="font-medium">Your name</span>
          <input name="sellerName" defaultValue={values.sellerName} placeholder="e.g. Andrei P." className={inputClass} />
          <FieldError message={errors.sellerName} />
        </label>

        <label className="block space-y-1">
          <span className="font-medium">Your email</span>
          <input
            type="email"
            name="sellerContact"
            defaultValue={values.sellerContact}
            placeholder="you@mail.com"
            className={inputClass}
          />
          <FieldError message={errors.sellerContact} />
        </label>
      </div>

      {Object.keys(errors).length > 0 && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Please fix the fields marked in red. If you chose a photo, select it again.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Publishing..." : "Publish listing"}
      </button>
    </form>
  );
}
