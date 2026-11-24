import Link from "next/link";
import { and, asc, eq, inArray, min } from "drizzle-orm";
import Reveal from "@/components/anim/Reveal";
import { getDb } from "@/db";
import { games, images, listings } from "@/db/schema";
import { formatPrice } from "@/lib/format";

const GRADS = [
  "from-rose-500/70 via-violet-700/70 to-night-800",
  "from-emerald-500/70 via-cyan-700/70 to-night-800",
  "from-amber-500/70 via-pink-700/70 to-night-800",
  "from-sky-500/70 via-indigo-700/70 to-night-800",
  "from-fuchsia-500/70 via-purple-700/70 to-night-800",
  "from-teal-500/70 via-emerald-700/70 to-night-800",
  "from-orange-500/70 via-rose-700/70 to-night-800",
  "from-cyan-500/70 via-blue-700/70 to-night-800",
];

export default async function FeaturedGames() {
  const db = await getDb();

  const rows = await db
    .select()
    .from(games)
    .where(eq(games.isActive, true))
    .orderBy(asc(games.sortOrder))
    .limit(8);

  const ids = rows.map((g) => g.id);

  const priceRows =
    ids.length > 0
      ? await db
          .select({ gameId: listings.gameId, min: min(listings.price) })
          .from(listings)
          .where(and(eq(listings.isActive, true), inArray(listings.gameId, ids)))
          .groupBy(listings.gameId)
      : [];

  const imageRows =
    ids.length > 0
      ? await db
          .select()
          .from(images)
          .where(and(eq(images.ownerType, "game"), inArray(images.ownerId, ids)))
          .orderBy(asc(images.ownerId), asc(images.sortOrder))
      : [];

  const minByGame = new Map(priceRows.map((p) => [p.gameId, p.min]));
  const firstImage = new Map<string, string>();
  for (const img of imageRows) {
    if (!firstImage.has(img.ownerId)) firstImage.set(img.ownerId, img.id);
  }

  return (
    <section id="games" className="relative py-24">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[110px]" />
      <div className="container-x relative">
        <Reveal className="text-center">
          <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-bold text-neon-cyan">
            فروشگاه
          </span>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            بازی‌های <span className="neon-text">محبوب</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            پرفروش‌ترین اکانت‌های این هفته — برای دیدن همه اکانت‌ها روی هر بازی
            کلیک کن.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((g, i) => {
            const minPrice = minByGame.get(g.id);
            const imgId = firstImage.get(g.id);
            return (
              <Reveal key={g.id} delay={i * 0.12}>
                <Link
                  href={`/games/${g.slug}`}
                  className={`card-glow glass shine group relative block overflow-hidden rounded-2xl bg-gradient-to-br ${GRADS[i % GRADS.length]}`}
                >
                  <div className="relative h-44 overflow-hidden">
                    {imgId ? (
                      <img
                        src={`/api/images/${imgId}`}
                        alt={g.title}
                        className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span
                        dir="ltr"
                        className="absolute -bottom-3 left-3 text-6xl font-black tracking-tighter text-white/10 transition-all duration-500 group-hover:text-white/20"
                      >
                        {g.englishTitle}
                      </span>
                    )}
                    {imgId && (
                      <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                        {g.englishTitle}
                      </span>
                    )}
                  </div>
                  <div className="relative -mt-8 rounded-2xl border border-white/10 bg-night-900/80 p-5 backdrop-blur-xl">
                    <h3 className="text-lg font-black text-white">{g.title}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {minPrice != null ? `از ${formatPrice(minPrice)}` : "به‌زودی"}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-neon-cyan">
                        مشاهده
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
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
