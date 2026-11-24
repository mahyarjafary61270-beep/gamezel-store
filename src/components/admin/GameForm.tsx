"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveGameAction, type FormState } from "@/lib/admin-actions";
import ImagePicker from "./ImagePicker";

const initialState: FormState = { error: null, fieldErrors: {} };

export default function GameForm({
  categories,
  game,
  images,
}: {
  categories: { id: string; name: string }[];
  game?: {
    id: string;
    title: string;
    englishTitle: string;
    slug: string;
    categoryId: string | null;
    description: string;
    features: string[];
    sortOrder: number;
    isActive: boolean;
  } | null;
  images?: { id: string; alt: string }[];
}) {
  const [state, formAction, pending] = useActionState(saveGameAction, initialState);

  return (
    <form action={formAction} className="admin-card space-y-4">
      {game && <input type="hidden" name="id" value={game.id} />}
      {state.error && (
        <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="field-label">عنوان فارسی *</span>
          <input name="title" defaultValue={game?.title} className="input-dark" placeholder="مثلا: دوتا ۲" />
          {state.fieldErrors.title && (
            <span className="mt-1 block text-xs text-rose-400">{state.fieldErrors.title}</span>
          )}
        </label>
        <label>
          <span className="field-label">عنوان انگلیسی *</span>
          <input
            name="englishTitle"
            defaultValue={game?.englishTitle}
            className="input-dark"
            placeholder="مثلا: Dota 2"
            dir="ltr"
          />
          {state.fieldErrors.englishTitle && (
            <span className="mt-1 block text-xs text-rose-400">{state.fieldErrors.englishTitle}</span>
          )}
        </label>
        <label>
          <span className="field-label">اسلاگ (خالی = خودکار ساخته می‌شود)</span>
          <input name="slug" defaultValue={game?.slug} className="input-dark" dir="ltr" />
        </label>
        <label>
          <span className="field-label">دسته‌بندی</span>
          <select name="categoryId" defaultValue={game?.categoryId ?? ""} className="input-dark">
            <option value="">بدون دسته</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="field-label">توضیحات</span>
        <textarea name="description" rows={4} defaultValue={game?.description} className="input-dark" />
      </label>
      <label className="block">
        <span className="field-label">ویژگی‌ها (هر خط یک مورد)</span>
        <textarea
          name="features"
          rows={4}
          defaultValue={game?.features.join("\n")}
          className="input-dark"
          placeholder={"تحویل فوری\nضمانت اصالت\nپشتیبانی ۲۴/۷"}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="field-label">ترتیب نمایش</span>
          <input name="sortOrder" type="number" defaultValue={game?.sortOrder ?? 0} className="input-dark" dir="ltr" />
        </label>
        <label className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={game ? game.isActive : true}
            className="h-4 w-4 accent-violet-500"
          />
          <span className="text-sm font-bold">فعال باشد</span>
        </label>
      </div>
      <ImagePicker existing={images} />
      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
        <button className="glow-btn !px-6 !py-2.5" disabled={pending}>
          {pending ? "در حال ذخیره..." : game ? "ذخیره تغییرات" : "ایجاد بازی"}
        </button>
        <Link href="/admin/games" className="ghost-btn !px-5 !py-2.5 text-sm">
          انصراف
        </Link>
      </div>
    </form>
  );
}
