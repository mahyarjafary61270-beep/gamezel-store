"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { CARD_GRADS, getGameCover } from "@/lib/game-covers";
import type { StoreChip, StoreListing } from "@/lib/store-data";

const SORTS = [
  { id: "newest", label: "جدیدترین" },
  { id: "cheap", label: "ارزان‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

function chipClass(active: boolean): string {
  return active
    ? "flex shrink-0 items-center gap-2 rounded-full border border-transparent bg-gradient-to-l from-neon-emerald to-neon-lime px-4 py-2 text-[13px] font-extrabold text-night-950 shadow-[0_0_22px_rgba(16,185,129,0.4)]"
    : "flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-bold text-slate-300 transition-all duration-200 hover:border-emerald-400/40 hover:text-neon-mint";
}

function MediaArea({ l, big }: { l: StoreListing; big?: boolean }) {
  const cover = getGameCover(l.slug);
  return (
    <div
      className={`relative overflow-hidden ${big ? "h-48 sm:h-full sm:min-h-[280px]" : "h-44"}`}
      style={{ background: CARD_GRADS[l.gradIndex % CARD_GRADS.length] }}
    >
      {l.imageId ? (
        <img
          src={`/api/images/${l.imageId}`}
          alt={l.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : cover ? (
        <img
          src={cover.src}
          alt={l.gameTitle}
          loading="lazy"
          style={{ objectPosition: cover.pos }}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <span
          dir="ltr"
          className="absolute -bottom-3 left-3 text-5xl font-black tracking-tighter text-white/15 transition-all duration-500 group-hover:text-white/25"
        >
          {l.englishTitle}
        </span>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-950/85 via-transparent to-transparent" />
      <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
        {l.gameTitle}
      </span>
      <span className="absolute left-3 top-3 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-extrabold text-neon-mint backdrop-blur-sm">
        ضمانت اصالت
      </span>
      {l.stock > 0 ? (
        <span className="absolute bottom-3 right-3 rounded-full border border-emerald-400/30 bg-night-950/70 px-2.5 py-1 text-[10px] font-extrabold text-neon-mint backdrop-blur-sm">
          موجود {l.stock.toLocaleString("fa-IR")} عدد
        </span>
      ) : (
        <span className="absolute bottom-3 right-3 rounded-full border border-rose-400/30 bg-night-950/70 px-2.5 py-1 text-[10px] font-extrabold text-rose-300 backdrop-blur-sm">
          ناموجود
        </span>
      )}
    </div>
  );
}

function SpecChips({ l, limit = 3 }: { l: StoreListing; limit?: number }) {
  const entries = Object.entries(l.specs ?? {});
  if (entries.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {entries.slice(0, limit).map(([k, v]) => (
        <span
          key={k}
          title={`${k}: ${v}`}
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-300"
        >
          {k}: <span className="text-slate-100">{v}</span>
        </span>
      ))}
      {entries.length > limit && (
        <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-500">
          +{entries.length - limit}
        </span>
      )}
    </div>
  );
}

function BuyButton({ l }: { l: StoreListing }) {
  return (
    <span className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-neon-orange to-amber-400 py-2.5 text-sm font-extrabold text-night-950 shadow-[0_0_18px_rgba(234,88,12,0.35)] transition-all duration-300 group-hover:shadow-[0_0_32px_rgba(234,88,12,0.55)]">
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
  );
}

export default function StoreGrid({
  listings,
  chips,
}: {
  listings: StoreListing[];
  chips: StoreChip[];
}) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("newest");

  const filtered = useMemo(() => {
    let rows = active === "all" ? listings : listings.filter((l) => l.gameId === active);
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter((l) =>
        [l.title, l.description ?? "", l.gameTitle, l.englishTitle].some((t) =>
          t.toLowerCase().includes(q)
        )
      );
    }
    const sorted = [...rows];
    if (sort === "cheap") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "expensive") sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => b.createdAt - a.createdAt);
    return sorted;
  }, [listings, active, query, sort]);

  const featured = filtered.length >= 3;

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          <span className="font-black text-neon-mint">{filtered.length.toLocaleString("fa-IR")}</span>{" "}
          اکانت آماده تحویل
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو بین اکانت‌ها..."
              aria-label="جستجو بین اکانت‌ها"
              className="w-52 rounded-xl border border-white/10 bg-night-800/60 py-2 pl-3 pr-9 text-xs text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-emerald-400/60 sm:w-60"
            />
            <svg
              viewBox="0 0 24 24"
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            aria-label="مرتب‌سازی"
            className="rounded-xl border border-white/10 bg-night-800/60 px-3 py-2 text-xs font-bold text-slate-200 outline-none transition-colors focus:border-emerald-400/60"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id} className="bg-night-800">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <div
          className="mt-5 flex items-center gap-2.5 overflow-x-auto pb-2"
          role="group"
          aria-label="فیلتر بازی"
        >
          <button
            type="button"
            onClick={() => setActive("all")}
            aria-pressed={active === "all"}
            className={chipClass(active === "all")}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            همه ({listings.length.toLocaleString("fa-IR")})
          </button>
          {chips.map((c) => {
            const cover = getGameCover(c.slug);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(c.id)}
                aria-pressed={active === c.id}
                className={chipClass(active === c.id)}
              >
                {cover && (
                  <img src={cover.src} alt="" className="h-6 w-6 rounded-md object-cover" />
                )}
                {c.title} ({c.count.toLocaleString("fa-IR")})
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="glass mt-8 rounded-3xl p-14 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-slate-400">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3M8 11h6" />
            </svg>
          </div>
          <p className="mt-4 font-black text-white">چیزی پیدا نشد!</p>
          <p className="mt-2 text-sm text-slate-400">
            فیلتر بازی یا عبارت جستجو رو عوض کن — به‌زودی اکانت‌های جدید اضافه می‌شه.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l, i) =>
            featured && i === 0 ? (
              <Link
                key={l.id}
                href={`/account/${l.id}`}
                className="card-glow glass shine group relative flex flex-col overflow-hidden rounded-2xl sm:col-span-2 sm:grid sm:grid-cols-2"
              >
                <MediaArea l={l} big />
                <div className="flex flex-col p-6">
                  <h3 className="text-lg font-black text-white sm:text-xl">{l.title}</h3>
                  {l.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-400">
                      {l.description}
                    </p>
                  )}
                  <SpecChips l={l} limit={5} />
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-5">
                    <span className="text-2xl font-black text-neon-green">
                      {formatPrice(l.price)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      اکانت اورجینال + تحویل فوری
                    </span>
                  </div>
                  <div className="mt-4">
                    <BuyButton l={l} />
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                key={l.id}
                href={`/account/${l.id}`}
                className="card-glow glass shine group block overflow-hidden rounded-2xl"
              >
                <MediaArea l={l} />
                <div className="flex flex-col p-5">
                  <h3 className="text-[15px] font-black text-white">{l.title}</h3>
                  {l.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-400">
                      {l.description}
                    </p>
                  )}
                  <SpecChips l={l} />
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/5 pt-4">
                    <span className="text-lg font-black text-neon-green">
                      {formatPrice(l.price)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">تحویل فوری</span>
                  </div>
                  <div className="mt-4">
                    <BuyButton l={l} />
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
