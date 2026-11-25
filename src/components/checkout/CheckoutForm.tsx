"use client";

import { useRef, useState, useActionState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { compressToDataUrl } from "@/lib/client-image";
import { formatPrice } from "@/lib/format";
import { createOrderAction, type CreateOrderState } from "@/lib/order-create";

const initialState: CreateOrderState = { error: null };
const MAX_RECEIPTS = 3;

export default function CheckoutForm({
  values,
}: {
  values: { card_number: string; card_holder: string; bank_name: string; order_notice: string };
}) {
  const { items, count, total } = useCart();
  const [state, formAction, pending] = useActionState(createOrderAction, initialState);
  const [receipts, setReceipts] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (items.length === 0) {
    return (
      <div className="glass mt-8 rounded-2xl p-10 text-center">
        <p className="text-lg font-bold text-slate-200">سبد خریدت خالیه!</p>
        <p className="mt-2 text-sm text-slate-400">اول یه اکانت به سبد اضافه کن.</p>
        <Link href="/#store" className="glow-btn mt-6 inline-block !px-6 !py-3 text-sm">
          مشاهده اکانت‌ها
        </Link>
      </div>
    );
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const picked = Array.from(files).slice(0, MAX_RECEIPTS - receipts.length);
      const compressed: string[] = [];
      for (const file of picked) {
        compressed.push(await compressToDataUrl(file));
      }
      setReceipts((prev) => [...prev, ...compressed].slice(0, MAX_RECEIPTS));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <form action={formAction} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="glass rounded-2xl p-6">
          <h2 className="text-lg font-black text-white">۱. مشخصات کارت</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">شماره کارت</p>
              <p dir="ltr" className="mt-1 text-right font-black tracking-wider text-neon-mint">
                {values.card_number || "—"}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">به نام</p>
              <p className="mt-1 font-bold text-white">{values.card_holder || "—"}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">بانک</p>
              <p className="mt-1 font-bold text-white">{values.bank_name || "—"}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">مبلغ قابل پرداخت</p>
              <p className="mt-1 font-black text-emerald-300">{formatPrice(total)}</p>
            </div>
          </div>
          {values.order_notice && (
            <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm leading-7 text-amber-200">
              {values.order_notice}
            </p>
          )}
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-lg font-black text-white">۲. رسید پرداخت</h2>
          <p className="mt-2 text-sm text-slate-400">
            بعد از واریز، از رسید بانکی اسکرین‌شات یا عکس بگیر و آپلود کن (حداکثر {MAX_RECEIPTS.toLocaleString("fa-IR")} تصویر).
          </p>
          <label
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 bg-black/20 px-6 py-10 text-center transition-colors hover:border-neon-mint/50 ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4m0 0L7 9m5-5 5 5" />
              <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
            <span className="text-sm font-bold text-slate-300">
              {uploading ? "در حال پردازش تصویر..." : "انتخاب تصویر رسید"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>

          {receipts.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {receipts.map((url, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`رسید ${i + 1}`} className="h-24 w-full rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => setReceipts((prev) => prev.filter((_, j) => j !== i))}
                    aria-label="حذف تصویر"
                    className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-xs font-bold text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {state.error && (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {state.error}
            </p>
          )}
        </section>
      </div>

      <aside className="glass h-fit rounded-2xl p-6">
        <h2 className="text-lg font-black text-white">خلاصه سفارش</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.listingId} className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-slate-300">
                {item.title}{" "}
                <span className="text-slate-500">× {item.quantity.toLocaleString("fa-IR")}</span>
              </span>
              <span className="shrink-0 font-bold text-white">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-3 border-t border-white/10 pt-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">تعداد کل</dt>
            <dd className="font-bold text-white">{count.toLocaleString("fa-IR")} عدد</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">مبلغ کل</dt>
            <dd className="text-lg font-black text-neon-mint">{formatPrice(total)}</dd>
          </div>
        </dl>

        <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({ listingId: i.listingId, quantity: i.quantity })))} />
        {receipts.map((url, i) => (
          <input key={i} type="hidden" name="receipts" value={url} />
        ))}

        <button className="glow-btn mt-6 block w-full !py-3 text-sm" disabled={pending || uploading}>
          {pending ? "در حال ثبت سفارش..." : "ثبت سفارش و ارسال رسید"}
        </button>
        <Link href="/cart" className="ghost-btn mt-3 block !py-3 text-center text-sm">
          بازگشت به سبد
        </Link>
        <p className="mt-4 text-center text-xs leading-6 text-slate-500">
          بعد از تایید رسید توسط ادمین، اطلاعات اکانت در پنل کاربری‌ات قرار می‌گیرد.
        </p>
      </aside>
    </form>
  );
}
