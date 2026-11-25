"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatPrice } from "@/lib/format";
import { CARD_GRADS, getGameCover } from "@/lib/game-covers";
import type { StoreListing } from "@/lib/store-data";
import Particles from "./Particles";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 1200, suffix: "+", label: "فروش موفق" },
  { value: 98, suffix: "٪", label: "رضایت مشتری" },
  { value: 24, suffix: "/۷", label: "پشتیبانی آنلاین" },
];

const GAME_CHIPS = [
  { slug: "dota-2", title: "دوتا ۲" },
  { slug: "gta-v", title: "GTA V" },
  { slug: "fc-27", title: "FC 27" },
  { slug: "valorant", title: "ولورانت" },
];

type Showcase = {
  href: string;
  name: string;
  en: string;
  desc: string;
  price: number;
  stock: number;
  imageId: string | null;
  slug: string;
  gradIndex: number;
  specs: [string, string][];
};

const FALLBACK_SHOWCASE: Showcase = {
  href: "/games/dota-2",
  name: "اکانت دوتا ۲",
  en: "DOTA 2",
  desc: "رنک ایمورتال تا دیواین",
  price: 490000,
  stock: 5,
  imageId: null,
  slug: "dota-2",
  gradIndex: 0,
  specs: [
    ["رنک", "ایمورتال"],
    ["امتیاز رفتار", "۱۰٬۰۰۰"],
  ],
};

function toShowcase(l: StoreListing): Showcase {
  return {
    href: `/account/${l.id}`,
    name: l.title,
    en: l.englishTitle,
    desc: l.gameTitle,
    price: l.price,
    stock: l.stock,
    imageId: l.imageId,
    slug: l.slug,
    gradIndex: l.gradIndex,
    specs: (Object.entries(l.specs).slice(0, 2) as [string, string][]),
  };
}

export default function Hero({
  featured,
  minPrice,
}: {
  featured: StoreListing | null;
  minPrice: number | null;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const showcase = featured ? toShowcase(featured) : FALLBACK_SHOWCASE;
  const cover = getGameCover(showcase.slug);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 24, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 }
      )
        .fromTo(
          ".hero-line",
          { opacity: 0, y: 56 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.16 },
          "-=0.35"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.5"
        )
        .fromTo(
          ".hero-chips",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.4"
        )
        .fromTo(
          ".hero-stat",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.35"
        )
        .fromTo(
          ".hero-showcase",
          { opacity: 0, x: -70, rotate: 10 },
          { opacity: 1, x: 0, rotate: 2, duration: 1 },
          "-=0.9"
        )
        .fromTo(
          ".hero-backcard",
          { opacity: 0, x: -40, rotate: -14 },
          { opacity: 1, x: 0, rotate: -6, duration: 1 },
          "-=0.75"
        )
        .fromTo(
          ".hero-float",
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15 },
          "-=0.5"
        )
        .add(() => {
          document.querySelectorAll<HTMLElement>(".hero-stat-value").forEach((el) => {
            const target = Number(el.dataset.value || 0);
            const suffix = el.dataset.suffix || "";
            const obj = { v: 0 };
            gsap.to(obj, {
              v: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(obj.v).toLocaleString("fa-IR") + suffix;
              },
            });
          });
        }, "-=0.2");

      gsap.to(".hero-parallax", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="animate-pulse-glow absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-emerald-600/25 blur-[130px]" />
      <div
        className="animate-pulse-glow absolute bottom-[-15%] left-[-8%] h-[420px] w-[420px] rounded-full bg-orange-500/15 blur-[130px]"
        style={{ animationDelay: "1.6s" }}
      />
      <Particles />

      <div className="container-x hero-parallax relative z-10 grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="hero-badge glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-neon-mint">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            فروشگاه تخصصی اکانت‌های گیمینگ
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.25] sm:text-5xl xl:text-6xl">
            <span className="hero-line block text-white">
              اکانت بازی بخر،
            </span>
            <span className="hero-line neon-text block pb-2">
              همین حالا بازی کن
            </span>
          </h1>

          <p className="hero-sub mt-5 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            دوتا ۲، GTA V، FC 27 و ده‌ها بازی دیگر — اکانت اورجینال با ضمانت،
            تحویل فوری بعد از تایید پرداخت و پشتیبانی واقعی ۲۴ ساعته.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/#store" className="hero-cta glow-btn">
              مشاهده اکانت‌ها
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/#features" className="hero-cta ghost-btn">
              چرا گیمزل؟
            </Link>
          </div>

          {minPrice != null && (
            <p className="hero-sub mt-5 flex items-center gap-2 text-sm text-slate-400">
              شروع قیمت‌ها از
              <span className="neon-text text-base font-black">
                {formatPrice(minPrice)}
              </span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {GAME_CHIPS.map((g) => {
              const gCover = getGameCover(g.slug);
              return (
                <Link
                  key={g.slug}
                  href={`/games/${g.slug}`}
                  className="hero-chips glass group flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 text-xs font-bold text-slate-200 transition-all duration-200 hover:border-emerald-400/40 hover:text-neon-mint"
                >
                  {gCover && (
                    <span className="h-7 w-7 overflow-hidden rounded-full border border-white/10">
                      <img
                        src={gCover.src}
                        alt={g.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        style={{ objectPosition: gCover.pos }}
                      />
                    </span>
                  )}
                  {g.title}
                </Link>
              );
            })}
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="hero-stat glass rounded-2xl px-3 py-4 text-center"
              >
                <div className="neon-text text-xl font-black sm:text-2xl">
                  <span
                    className="hero-stat-value"
                    data-value={s.value}
                    data-suffix={s.suffix}
                  >
                    ۰
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden h-[560px] lg:block">
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[100px]" />

          <div className="hero-backcard absolute left-10 top-24 h-[380px] w-[300px] rounded-3xl border border-white/10 bg-white/[0.03]" />

          <div className="hero-float animate-float-y absolute -top-2 right-0 z-20">
            <div className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 text-night-950">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </span>
              <div>
                <div className="text-xs font-black text-white">تحویل فوری</div>
                <div className="text-[10px] text-slate-400">بلافاصله بعد از پرداخت</div>
              </div>
            </div>
          </div>

          <div
            className="hero-float animate-float-y absolute bottom-20 left-0 z-20"
            style={{ animationDelay: "1.4s" }}
          >
            <div className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-night-950">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <div>
                <div className="text-xs font-black text-white">پرداخت امن</div>
                <div className="text-[10px] text-slate-400">کارت‌به‌کارت + ضمانت</div>
              </div>
            </div>
          </div>

          <Link
            href={showcase.href}
            className="hero-showcase group absolute left-1/2 top-1/2 z-10 w-[340px] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="card-glow glass overflow-hidden rounded-3xl transition-transform duration-300 hover:scale-[1.03]">
              <div
                className="relative h-44 overflow-hidden"
                style={{ background: CARD_GRADS[showcase.gradIndex % CARD_GRADS.length] }}
              >
                {showcase.imageId ? (
                  <img
                    src={`/api/images/${showcase.imageId}`}
                    alt={showcase.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : cover ? (
                  <img
                    src={cover.src}
                    alt={showcase.en}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ objectPosition: cover.pos }}
                  />
                ) : (
                  <span
                    dir="ltr"
                    className="absolute -bottom-3 left-3 text-6xl font-black tracking-tighter text-white/15"
                  >
                    {showcase.en}
                  </span>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-950/85 via-transparent to-transparent" />
                <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  {showcase.desc}
                </span>
                <span className="absolute left-3 top-3 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-extrabold text-neon-mint backdrop-blur-sm">
                  ضمانت اصالت
                </span>
              </div>

              <div className="p-5">
                <h3 className="line-clamp-1 text-lg font-black text-white">
                  {showcase.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500" dir="ltr">
                  {showcase.en}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {showcase.specs.map(([k, v]) => (
                    <span
                      key={k}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300"
                    >
                      {k}: <span className="text-neon-mint">{v}</span>
                    </span>
                  ))}
                  {showcase.stock > 0 && (
                    <span className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-neon-mint">
                      {showcase.stock.toLocaleString("fa-IR")} عدد موجود
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <div className="text-[10px] text-slate-500">قیمت</div>
                    <div className="neon-text text-2xl font-black">
                      {formatPrice(showcase.price)}
                    </div>
                  </div>
                  <span className="glow-btn !px-5 !py-2.5 text-sm">
                    مشاهده و خرید
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-neon-mint" />
        </div>
      </div>
    </section>
  );
}
