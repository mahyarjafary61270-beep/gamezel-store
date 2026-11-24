"use client";

import { useActionState } from "react";
import { saveSettingsAction, type SettingsState } from "@/lib/settings-actions";

const initialState: SettingsState = { error: null, message: null };

export default function SettingsForm({ values }: { values: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(saveSettingsAction, initialState);

  return (
    <form action={formAction} className="admin-card space-y-4">
      {state.message && (
        <p className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {state.message}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="field-label">نام بانک</span>
          <input name="bank_name" defaultValue={values.bank_name} className="input-dark" placeholder="مثلا: ملت" />
        </label>
        <label>
          <span className="field-label">نام صاحب کارت</span>
          <input
            name="card_holder"
            defaultValue={values.card_holder}
            className="input-dark"
            placeholder="نام و نام خانوادگی"
          />
        </label>
        <label>
          <span className="field-label">شماره کارت</span>
          <input
            name="card_number"
            defaultValue={values.card_number}
            className="input-dark"
            dir="ltr"
            placeholder="6037-0000-0000-0000"
          />
        </label>
        <label>
          <span className="field-label">آیدی تلگرام پشتیبانی</span>
          <input
            name="telegram_id"
            defaultValue={values.telegram_id}
            className="input-dark"
            dir="ltr"
            placeholder="@gamezel"
          />
        </label>
      </div>
      <label className="block">
        <span className="field-label">راهنمای پرداخت (در صفحه پرداخت نمایش داده می‌شود)</span>
        <textarea
          name="order_notice"
          rows={4}
          defaultValue={values.order_notice}
          className="input-dark"
          placeholder="مبلغ را به شماره کارت واریز کنید، سپس تصویر رسید را بارگذاری کنید..."
        />
      </label>
      <button className="glow-btn !px-6 !py-2.5" disabled={pending}>
        {pending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </form>
  );
}
