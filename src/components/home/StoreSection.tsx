import Reveal from "@/components/anim/Reveal";
import { getStoreData } from "@/lib/store-data";
import StoreGrid from "./StoreGrid";

export default async function StoreSection() {
  const { listings, chips } = await getStoreData();
  const totalStock = listings.reduce((s, l) => s + l.stock, 0);

  const stats = [
    {
      label: `${totalStock.toLocaleString("fa-IR")} اکانت آماده`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-neon-mint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z" />
          <path d="M3.3 7 12 12l8.7-5M12 22V12" />
        </svg>
      ),
    },
    {
      label: `${chips.length.toLocaleString("fa-IR")} بازی فعال`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-neon-mint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
          <rect x="2" y="6" width="20" height="12" rx="6" />
        </svg>
      ),
    },
    {
      label: "تحویل فوری",
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-neon-mint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      ),
    },
    {
      label: "ضمانت اصالت",
      icon: (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-neon-mint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <section id="store" className="relative py-24">
      <div className="absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-600/10 blur-[120px]" />
      <div className="absolute bottom-10 right-[8%] h-64 w-64 rounded-full bg-orange-500/10 blur-[110px]" />
      <div className="container-x relative">
        <Reveal className="text-center">
          <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-bold text-neon-mint">
            فروشگاه
          </span>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            اکانت‌های <span className="neon-text">آماده</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            همه اکانت‌ها همین‌جا — بازی مورد نظرت رو فیلتر کن، قیمت‌ها رو مرتب کن و مستقیم خرید کن.
          </p>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
            {stats.map((s) => (
              <span
                key={s.label}
                className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-slate-200"
              >
                {s.icon}
                {s.label}
              </span>
            ))}
          </div>
        </Reveal>

        <StoreGrid listings={listings} chips={chips} />
      </div>
    </section>
  );
}
