"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import type { StoreChip, StoreListing } from "./StoreSection";

const GRADS = [
  "linear-gradient(135deg,#064e3b,#052e16 60%,#0a0a0a)",
  "linear-gradient(135deg,#14532d,#166534 60%,#0a0a0a)",
  "linear-gradient(135deg,#134e4a,#0f766e 60%,#0a0a0a)",
  "linear-gradient(135deg,#052e16,#15803d 60%,#0a0a0a)",
  "linear-gradient(135deg,#1a2e05,#3f6212 60%,#0a0a0a)",
  "linear-gradient(135deg,#042f2e,#115e59 60%,#0a0a0a)",
];

function chipClass(active: boolean): string {
  return active
    ? "rounded-full border border-transparent bg-gradient-to-l from-neon-emerald to-neon-lime px-5 py-2 text-[13px] font-extrabold text-night-950 shadow-[0_0_22px_rgba(16,185,129,0.4)]"
    : "rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[13px] font-bold text-slate-300 transition-all duration-200 hover:border-emerald-400/40 hover:text-neon-mint";
}

export default function StoreGrid({
  listings,
  chips,
}: {
  listings: StoreListing[];
  chips: StoreChip[];
}) {
  const [active, setActive] = useState<string>("all");
  const filtered = active === "all" ? listings : listings.filter((l) => l.gameId === active);

  return (
    <>
      {chips.length > 0 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5" role="group" aria-label="فیلتر بازی">
          <button
            type="button"
            onClick={() => setActive("all")}
            aria-pressed={active === "all"}
            className={chipClass(active === "all")}
          >
            همه ({listings.length.toLocaleString("fa-IR")})
          </button>
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              aria-pressed={active === c.id}
              className={chipClass(active === c.id)}
            >
              {c.title} ({c.count.toLocaleString("fa-IR")})
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="glass mt-12 rounded-2xl p-10 text-center text-slate-400">
          فعلا اکانتی برای این بازی ثبت نشده — به‌زودی موجود می‌شه.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((l) => (
            <Link
              key={l.id}
              href={`/account/${l.id}`}
              className="card-glow glass shine group block overflow-hidden rounded-2xl"
            >
              <div
                className="relative h-40 overflow-hidden"
                style={{ background: GRADS[l.gradIndex % GRADS.length] }}
              >
                {l.imageId ? (
                  <img
                    src={`/api/images/${l.imageId}`}
                    alt={l.title}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span
                    dir="ltr"
                    className="absolute -bottom-3 left-3 text-5xl font-black tracking-tighter text-white/15 transition-all duration-500 group-hover:text-white/25"
                  >
                    {l.englishTitle}
                  </span>
                )}
                <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  {l.gameTitle}
                </span>
                <span className="absolute left-3 top-3 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-extrabold text-neon-mint">
                  ضمانت اصالت
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-[15px] font-black text-white">{l.title}</h3>
                {l.description && (
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-400">
                    {l.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/5 pt-4">
                  <span className="text-base font-black text-neon-green">
                    {formatPrice(l.price)}
                  </span>
                  {l.stock > 0 ? (
                    <span className="badge badge-success shrink-0">
                      {l.stock.toLocaleString("fa-IR")} عدد
                    </span>
                  ) : (
                    <span className="badge badge-danger shrink-0">ناموجود</span>
                  )}
                </div>
                <span className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-neon-emerald to-neon-lime py-2.5 text-sm font-extrabold text-night-950 shadow-[0_0_18px_rgba(16,185,129,0.35)] transition-all duration-300 group-hover:shadow-[0_0_32px_rgba(16,185,129,0.55)]">
                  {l.stock > 0 ? "مشاهده و خرید" : "مشاهده جزئیات"}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
