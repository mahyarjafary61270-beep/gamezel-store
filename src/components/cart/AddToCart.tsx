"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function AddToCart({
  listingId,
  title,
  price,
  stock,
}: {
  listingId: string;
  title: string;
  price: number;
  stock: number;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <span className="badge badge-danger !px-5 !py-2.5 text-sm">ناموجود</span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {stock > 1 && (
        <select
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          aria-label="تعداد"
          className="input-dark !w-20 !px-3 !py-2.5 text-center text-sm"
        >
          {Array.from({ length: Math.min(stock, 10) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n.toLocaleString("fa-IR")}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={() => {
          addItem({ listingId, title, price, stock }, qty);
          setAdded(true);
        }}
        className="glow-btn !px-8 !py-3 text-sm font-bold"
      >
        افزودن به سبد خرید
      </button>
      {added && (
        <Link href="/cart" className="text-sm font-bold text-neon-cyan hover:underline">
          اضافه شد — مشاهده سبد
        </Link>
      )}
    </div>
  );
}
