"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  imageIds: string[];
  alt: string;
  fallbackSrc?: string | null;
  fallbackPos?: string;
  fallbackTitle: string;
};

export default function ImageGallery({
  imageIds,
  alt,
  fallbackSrc,
  fallbackPos = "50% 50%",
  fallbackTitle,
}: Props) {
  const srcs = imageIds.map((id) => `/api/images/${id}`);
  const count = srcs.length;
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const next = useCallback(() => {
    if (count === 0) return;
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count === 0) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowLeft") next();
      else if (e.key === "ArrowRight") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, next, prev]);

  const current = count > 0 ? srcs[index] : null;

  return (
    <>
      <div className="card-glow glass overflow-hidden rounded-2xl">
        <div className="relative aspect-square bg-night-900">
          {current ? (
            <img
              src={current}
              alt={alt}
              className="h-full w-full cursor-zoom-in object-contain"
              onClick={() => setOpen(true)}
            />
          ) : fallbackSrc ? (
            <img
              src={fallbackSrc}
              alt={fallbackTitle}
              style={{ objectPosition: fallbackPos }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-emerald-600/30 to-teal-600/20">
              <span dir="ltr" className="text-5xl font-black tracking-tighter text-white/20">
                {fallbackTitle}
              </span>
            </div>
          )}

          {count > 0 && (
            <>
              <button
                type="button"
                aria-label="مشاهده تمام‌صفحه"
                onClick={() => setOpen(true)}
                className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-black/50 text-slate-200 backdrop-blur-sm transition-colors hover:border-emerald-400/50 hover:text-neon-mint"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>

              {count > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="تصویر قبلی"
                    onClick={prev}
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-emerald-400/50 hover:text-neon-mint"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="تصویر بعدی"
                    onClick={next}
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-emerald-400/50 hover:text-neon-mint"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    {index + 1} از {count}
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {count > 1 && (
          <div className="flex gap-2.5 overflow-x-auto p-3">
            {srcs.map((s, i) => (
              <button
                key={s}
                type="button"
                aria-label={`تصویر ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  i === index
                    ? "border-neon-mint shadow-[0_0_14px_rgba(52,211,153,0.35)]"
                    : "border-white/10 opacity-50 hover:opacity-90"
                }`}
              >
                <img src={s} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {open && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="نمایش تمام‌صفحه تصاویر"
          className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-night-950/95 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setOpen(false)}
            className="absolute left-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="تصویر قبلی"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="تصویر بعدی"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            </>
          )}

          <img
            key={index}
            src={current}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="animate-zoom-in max-h-[82vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
          />

          {count > 1 && (
            <div
              className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                {srcs.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    aria-label={`تصویر ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-6 bg-neon-mint" : "w-2.5 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
              <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {index + 1} / {count}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
