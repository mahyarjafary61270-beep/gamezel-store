"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, count, total, removeItem, setQuantity } = useCart();

  return (
    <div className="container-x pb-24 pt-28">
      <h1 className="text-2xl font-black text-white sm:text-3xl">
        سبد <span className="neon-text">خرید</span>
      </h1>

      {items.length === 0 ? (
        <div className="glass mt-8 rounded-2xl p-10 text-center">
          <p className="text-lg font-bold text-slate-200">سبد خریدت خالیه!</p>
          <p className="mt-2 text-sm text-slate-400">
            برو یه نگاه به اکانت‌های آماده بنداز — تحویلشون فوریه.
          </p>
          <Link href="/#store" className="glow-btn mt-6 inline-block !px-6 !py-3 text-sm">
            مشاهده اکانت‌ها
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.listingId}
                className="glass flex flex-wrap items-center gap-4 rounded-2xl p-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatPrice(item.price)} × {item.quantity.toLocaleString("fa-IR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.listingId, item.quantity - 1)}
                    aria-label="کاهش تعداد"
                    className="glass grid h-9 w-9 place-items-center rounded-lg text-slate-200 transition-colors hover:text-neon-mint"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-white">
                    {item.quantity.toLocaleString("fa-IR")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.listingId, item.quantity + 1)}
                    aria-label="افزایش تعداد"
                    className="glass grid h-9 w-9 place-items-center rounded-lg text-slate-200 transition-colors hover:text-neon-mint"
                  >
                    +
                  </button>
                </div>
                <div className="w-32 text-left">
                  <span className="font-black text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.listingId)}
                  className="text-xs font-bold text-rose-400 transition-colors hover:text-rose-300"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>

          <aside className="glass h-fit rounded-2xl p-6">
            <h2 className="text-lg font-black text-white">خلاصه سفارش</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">تعداد کل</dt>
                <dd className="font-bold text-white">{count.toLocaleString("fa-IR")} عدد</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">مبلغ کل</dt>
                <dd className="text-lg font-black text-neon-mint">{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="glow-btn mt-6 block !py-3 text-center text-sm"
            >
              ادامه و پرداخت
            </Link>
            <Link
              href="/#store"
              className="ghost-btn mt-3 block !py-3 text-center text-sm"
            >
              ادامه خرید
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
