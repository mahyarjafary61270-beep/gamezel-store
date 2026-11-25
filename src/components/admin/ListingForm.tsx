"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveListingAction, type FormState } from "@/lib/admin-actions";
import ImagePicker from "./ImagePicker";

const initialState: FormState = { error: null, fieldErrors: {} };

export default function ListingForm({
  games,
  listing,
  images,
}: {
  games: { id: string; title: string }[];
  listing?: {
    id: string;
    gameId: string;
    title: string;
    description: string;
    specs: Record<string, string>;
    price: number;
    sortOrder: number;
    isActive: boolean;
  } | null;
  images?: { id: string; alt: string }[];
}) {
  const [state, formAction, pending] = useActionState(saveListingAction, initialState);
  const specsText = listing
    ? Object.entries(listing.specs)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    : "";

  return (
    <form action={formAction} className="admin-card space-y-4">
      {listing && <input type="hidden" name="id" value={listing.id} />}
      {state.error && (
        <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="field-label">بازی *</span>
          <select name="gameId" defaultValue={listing?.gameId ?? ""} className="input-dark">
            <option value="">انتخاب کنید...</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
          {state.fieldErrors.gameId && (
            <span className="mt-1 block text-xs text-rose-400">{state.fieldErrors.gameId}</span>
          )}
        </label>
        <label>
          <span className="field-label">عنوان اکانت *</span>
          <input
            name="title"
            defaultValue={listing?.title}
            className="input-dark"
            placeholder="مثلا: اکانت استیم ۵۰۰ بازی"
          />
          {state.fieldErrors.title && (
            <span className="mt-1 block text-xs text-rose-400">{state.fieldErrors.title}</span>
          )}
        </label>
        <label>
          <span className="field-label">قیمت (تومان) *</span>
          <input
            name="price"
            inputMode="numeric"
            defaultValue={listing?.price}
            className="input-dark"
            placeholder="مثلا: ۴۵۰۰۰۰"
            dir="ltr"
          />
          {state.fieldErrors.price && (
            <span className="mt-1 block text-xs text-rose-400">{state.fieldErrors.price}</span>
          )}
        </label>
        <label>
          <span className="field-label">ترتیب نمایش</span>
          <input name="sortOrder" type="number" defaultValue={listing?.sortOrder ?? 0} className="input-dark" dir="ltr" />
        </label>
      </div>
      <label className="block">
        <span className="field-label">توضیحات</span>
        <textarea name="description" rows={3} defaultValue={listing?.description} className="input-dark" />
      </label>
      <label className="block">
        <span className="field-label">مشخصات (هر خط: کلید: مقدار)</span>
        <textarea
          name="specs"
          rows={3}
          defaultValue={specsText}
          className="input-dark"
          placeholder={"پلتفرم: استیم\nریجن: گلوبال\nتحویل: فوری"}
        />
      </label>
      {!listing && (
        <label className="block">
          <span className="field-label">اکانت‌های موجود (هر خط: ایمیل:رمز) — بعدا هم می‌توانید اضافه کنید</span>
          <textarea
            name="credentials"
            rows={4}
            className="input-dark font-mono"
            dir="ltr"
            placeholder={"acc1@gmail.com:pass123\nacc2@yahoo.com:pass456"}
          />
        </label>
      )}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={listing ? listing.isActive : true}
          className="h-4 w-4 accent-emerald-500"
        />
        <span className="text-sm font-bold">فعال باشد</span>
      </label>
      <ImagePicker existing={images} />
      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
        <button className="glow-btn !px-6 !py-2.5" disabled={pending}>
          {pending ? "در حال ذخیره..." : listing ? "ذخیره تغییرات" : "ایجاد اکانت"}
        </button>
        <Link href="/admin/listings" className="ghost-btn !px-5 !py-2.5 text-sm">
          انصراف
        </Link>
      </div>
    </form>
  );
}
