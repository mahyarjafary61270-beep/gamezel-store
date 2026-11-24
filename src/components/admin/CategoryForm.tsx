"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveCategoryAction, type FormState } from "@/lib/admin-actions";

const initialState: FormState = { error: null, fieldErrors: {} };

export default function CategoryForm({
  category,
}: {
  category?: { id: string; name: string; slug: string; sortOrder: number } | null;
}) {
  const [state, formAction, pending] = useActionState(saveCategoryAction, initialState);

  return (
    <form action={formAction} className="admin-card space-y-3">
      {category && <input type="hidden" name="id" value={category.id} />}
      <h2 className="font-black">{category ? `ویرایش دسته «${category.name}»` : "افزودن دسته جدید"}</h2>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_130px_auto] md:items-start">
        <label>
          <span className="field-label">نام دسته</span>
          <input name="name" defaultValue={category?.name} className="input-dark" placeholder="مثلا: استیم" />
          {state.fieldErrors.name && (
            <span className="mt-1 block text-xs text-rose-400">{state.fieldErrors.name}</span>
          )}
        </label>
        <label>
          <span className="field-label">اسلاگ (انگلیسی)</span>
          <input name="slug" defaultValue={category?.slug} className="input-dark" dir="ltr" placeholder="steam" />
          {state.fieldErrors.slug && (
            <span className="mt-1 block text-xs text-rose-400">{state.fieldErrors.slug}</span>
          )}
        </label>
        <label>
          <span className="field-label">ترتیب</span>
          <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className="input-dark" dir="ltr" />
        </label>
        <div className="flex gap-2 pt-6">
          <button className="glow-btn !px-5 !py-2.5" disabled={pending}>
            {pending ? "..." : category ? "ذخیره" : "افزودن"}
          </button>
          {category && (
            <Link href="/admin/categories" className="ghost-btn !px-4 !py-2.5 text-sm">
              انصراف
            </Link>
          )}
        </div>
      </div>
      {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
    </form>
  );
}
