"use client";

import { useActionState } from "react";
import type { MenuFormState } from "@/app/admin/(dashboard)/menu/actions";
import type { MenuCategoryRecord } from "@/lib/db/repositories/menu";
import type { AvailabilityStatus } from "@/types/menu";

const STATUS_OPTIONS: { value: AvailabilityStatus; label: string }[] = [
  { value: "available", label: "Tersedia" },
  { value: "unavailable", label: "Tidak tersedia" },
  { value: "coming-soon", label: "Segera hadir" },
];

export interface MenuItemFormValues {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  availabilityStatus: AvailabilityStatus;
  imageSource: string;
  imageLicense: string;
  sourceUrl: string;
  isPublished: boolean;
}

type FormAction = (
  state: MenuFormState,
  formData: FormData
) => Promise<MenuFormState>;

const INITIAL_STATE: MenuFormState = {};

const inputClass =
  "w-full rounded-md border border-stone bg-white px-3 py-2 text-sm text-obsidian placeholder:text-graphite/50 focus:border-olive-deep focus:outline-none";
const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.2em] text-graphite";
const errorClass = "mt-1 text-xs text-red-600";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={errorClass}>{message}</p>;
}

export default function MenuItemForm({
  action,
  categories,
  values,
  mode,
  submitLabel,
}: {
  action: FormAction;
  categories: MenuCategoryRecord[];
  values?: MenuItemFormValues;
  mode: "create" | "edit";
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.error ? (
        <p
          role="alert"
          className="rounded-md border border-olive-deep/40 bg-olive/10 px-4 py-3 text-sm text-obsidian"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="id" className={labelClass}>
            ID (slug)
          </label>
          <input
            id="id"
            name="id"
            defaultValue={values?.id ?? ""}
            readOnly={mode === "edit"}
            aria-readonly={mode === "edit"}
            className={`${inputClass} ${mode === "edit" ? "bg-stone/30" : ""}`}
            placeholder="mis. kopi-susu-aren"
          />
          <FieldError message={fieldErrors.id} />
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>
            Nama
          </label>
          <input
            id="name"
            name="name"
            defaultValue={values?.name ?? ""}
            className={inputClass}
            placeholder="Nama item"
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div>
          <label htmlFor="categoryId" className={labelClass}>
            Kategori
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={values?.categoryId ?? categories[0]?.id ?? ""}
            className={inputClass}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.categoryId} />
        </div>

        <div>
          <label htmlFor="price" className={labelClass}>
            Harga (Rupiah, kosongkan bila belum ada)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={1000}
            defaultValue={values?.price ?? ""}
            className={inputClass}
            placeholder="mis. 25000"
          />
          <FieldError message={fieldErrors.price} />
        </div>

        <div>
          <label htmlFor="availabilityStatus" className={labelClass}>
            Ketersediaan
          </label>
          <select
            id="availabilityStatus"
            name="availabilityStatus"
            defaultValue={values?.availabilityStatus ?? "available"}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.availabilityStatus} />
        </div>

        <div className="flex items-end gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-obsidian">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={values?.featured ?? false}
              className="h-4 w-4"
            />
            Tampilkan sebagai andalan
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-obsidian">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={values?.isPublished ?? true}
              className="h-4 w-4"
            />
            Publikasikan
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={values?.description ?? ""}
          className={inputClass}
          placeholder="Deskripsi singkat item"
        />
        <FieldError message={fieldErrors.description} />
      </div>

      <fieldset className="rounded-lg border border-stone p-4">
        <legend className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-graphite">
          Gambar & atribusi
        </legend>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="image" className={labelClass}>
              Path/URL gambar
            </label>
            <input
              id="image"
              name="image"
              defaultValue={values?.image ?? ""}
              className={inputClass}
              placeholder="/images/menu/..."
            />
            <FieldError message={fieldErrors.image} />
          </div>
          <div>
            <label htmlFor="imageAlt" className={labelClass}>
              Teks alternatif
            </label>
            <input
              id="imageAlt"
              name="imageAlt"
              defaultValue={values?.imageAlt ?? ""}
              className={inputClass}
            />
            <FieldError message={fieldErrors.imageAlt} />
          </div>
          <div>
            <label htmlFor="imageSource" className={labelClass}>
              Sumber foto
            </label>
            <input
              id="imageSource"
              name="imageSource"
              defaultValue={values?.imageSource ?? ""}
              className={inputClass}
              placeholder="mis. Unsplash"
            />
          </div>
          <div>
            <label htmlFor="imageLicense" className={labelClass}>
              Lisensi foto
            </label>
            <input
              id="imageLicense"
              name="imageLicense"
              defaultValue={values?.imageLicense ?? ""}
              className={inputClass}
              placeholder="mis. Unsplash License"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="sourceUrl" className={labelClass}>
              URL sumber (opsional)
            </label>
            <input
              id="sourceUrl"
              name="sourceUrl"
              defaultValue={values?.sourceUrl ?? ""}
              className={inputClass}
              placeholder="https://..."
            />
            <FieldError message={fieldErrors.sourceUrl} />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-obsidian px-6 text-xs font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-graphite disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
