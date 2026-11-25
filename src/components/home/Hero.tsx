"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Particles from "./Particles";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "۱٬۲۰۰+", label: "فروش موفق" },
  { value: "۹۸٪", label: "رضایت مشتری" },
  { value: "۲۴/۷", label: "پشتیبانی آنلاین" },
];

const FLOAT_CARDS = [
  {
    name: "دوتا ۲",
    en: "DOTA 2",
    desc: "رنک ایمورتال تا دیواین",
    price: "از ۴۹۰ هزار تومان",
    img: "/images/games/dota-2.jpg",
    pos: "50% 50%",
    grad: "from-emerald-600 to-lime-500",
    delay: "0s",
  },
  {
    name: "جی‌تی‌ای V",
    en: "GTA V",
    desc: "پول مود شده + پرایم",
    price: "از ۸۹۰ هزار تومان",
    img: "/images/games/gta-v.jpg",
    pos: "50% 50%",
    grad: "from-lime-500 to-emerald-600",
    delay: "1.2s",
  },
  {
    name: "فیفا ۲۷",
    en: "FC 27",
    desc: "آلتیمیت تیم قوی",
    price: "از ۱٬۲۹۰ هزار تومان",
    img: "/images/games/fc-27.jpg",
    pos: "50% 36%",
    grad: "from-teal-500 to-emerald-500",
    delay: "2.4s",
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
          ".hero-stat",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.35"
        )
        .fromTo(
          ".hero-card",
          { opacity: 0, x: -70, rotate: 6 },
          { opacity: 1, x: 0, rotate: 0, duration: 1, stagger: 0.18 },
          "-=0.9"
        );

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

      <div
        ref={contentRef}
        className="container-x hero-parallax relative z-10 grid items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr]"
      >
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

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="hero-stat glass rounded-2xl px-3 py-4 text-center"
              >
                <div className="neon-text text-xl font-black sm:text-2xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden h-[520px] lg:block">
          {FLOAT_CARDS.map((c, i) => (
            <div
              key={c.en}
              className={`hero-card glass absolute w-72 rounded-2xl p-5 ${[
                "right-6 top-24",
                "left-0 top-1/2 -translate-y-1/2",
                "right-16 bottom-10",
              ][i]}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${c.grad} p-0.5 shadow-lg`}
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    className="h-full w-full rounded-[10px] object-cover"
                    style={{ objectPosition: c.pos }}
                  />
                </span>
                <div>
                  <div className="text-sm font-black text-white">{c.name}</div>
                  <div className="text-[11px] text-slate-500" dir="ltr">
                    {c.en}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">{c.desc}</p>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[11px] text-slate-400">{c.price}</span>
                <span className="neon-text text-xs font-bold">موجود ✓</span>
              </div>
            </div>
          ))}
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
