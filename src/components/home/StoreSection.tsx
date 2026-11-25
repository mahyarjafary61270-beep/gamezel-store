import { and, asc, count, eq, inArray, isNull } from "drizzle-orm";
import Reveal from "@/components/anim/Reveal";
import { getDb } from "@/db";
import { credentials, games, images, listings } from "@/db/schema";
import StoreGrid from "./StoreGrid";

export type StoreListing = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  gameId: string;
  gameTitle: string;
  englishTitle: string;
  slug: string;
  stock: number;
  imageId: string | null;
  gradIndex: number;
  specs: Record<string, string>;
  createdAt: number;
};

export type StoreChip = { id: string; title: string; slug: string; count: number };

export default async function StoreSection() {
  const db = await getDb();

  const [gameRows, listingRows] = await Promise.all([
    db
      .select({
        id: games.id,
        title: games.title,
        englishTitle: games.englishTitle,
        slug: games.slug,
        sortOrder: games.sortOrder,
      })
      .from(games)
      .where(eq(games.isActive, true))
      .orderBy(asc(games.sortOrder)),
    db
      .select({
        id: listings.id,
        title: listings.title,
        description: listings.description,
        price: listings.price,
        gameId: listings.gameId,
        specs: listings.specs,
        createdAt: listings.createdAt,
        sortOrder: listings.sortOrder,
      })
      .from(listings)
      .where(eq(listings.isActive, true))
      .orderBy(asc(listings.sortOrder)),
  ]);

  const gameById = new Map(gameRows.map((g) => [g.id, g]));
  const gradIndexByGame = new Map(gameRows.map((g, i) => [g.id, i]));
  const matched = listingRows.filter((l) => gameById.has(l.gameId));

  const stockByListing = new Map<string, number>();
  const imageByListing = new Map<string, string>();
  const ids = matched.map((l) => l.id);
  if (ids.length > 0) {
    const [stockRows, imageRows] = await Promise.all([
      db
        .select({ listingId: credentials.listingId, count: count() })
        .from(credentials)
        .where(and(isNull(credentials.orderItemId), inArray(credentials.listingId, ids)))
        .groupBy(credentials.listingId),
      db
        .select({ ownerId: images.ownerId, id: images.id })
        .from(images)
        .where(and(eq(images.ownerType, "listing"), inArray(images.ownerId, ids)))
        .orderBy(asc(images.ownerId), asc(images.sortOrder)),
    ]);
    for (const s of stockRows) stockByListing.set(s.listingId, s.count);
    for (const i of imageRows) {
      if (!imageByListing.has(i.ownerId)) imageByListing.set(i.ownerId, i.id);
    }
  }

  const data: StoreListing[] = matched.map((l) => {
    const g = gameById.get(l.gameId)!;
    return {
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.price,
      gameId: l.gameId,
      gameTitle: g.title,
      englishTitle: g.englishTitle,
      slug: g.slug,
      stock: stockByListing.get(l.id) ?? 0,
      imageId: imageByListing.get(l.id) ?? null,
      gradIndex: gradIndexByGame.get(l.gameId) ?? 0,
      specs: l.specs ?? {},
      createdAt: l.createdAt.getTime(),
    };
  });

  const chips: StoreChip[] = gameRows
    .map((g) => ({ id: g.id, title: g.title, slug: g.slug, count: data.filter((d) => d.gameId === g.id).length }))
    .filter((c) => c.count > 0);

  const totalStock = data.reduce((s, l) => s + l.stock, 0);

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

        <StoreGrid listings={data} chips={chips} />
      </div>
    </section>
  );
}
