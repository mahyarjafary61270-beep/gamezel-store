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
  stock: number;
  imageId: string | null;
  gradIndex: number;
};

export type StoreChip = { id: string; title: string; count: number };

export default async function StoreSection() {
  const db = await getDb();

  const [gameRows, listingRows] = await Promise.all([
    db
      .select({
        id: games.id,
        title: games.title,
        englishTitle: games.englishTitle,
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
      stock: stockByListing.get(l.id) ?? 0,
      imageId: imageByListing.get(l.id) ?? null,
      gradIndex: gradIndexByGame.get(l.gameId) ?? 0,
    };
  });

  const chips: StoreChip[] = gameRows
    .map((g) => ({ id: g.id, title: g.title, count: data.filter((d) => d.gameId === g.id).length }))
    .filter((c) => c.count > 0);

  return (
    <section id="store" className="relative py-24">
      <div className="absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-600/10 blur-[120px]" />
      <div className="container-x relative">
        <Reveal className="text-center">
          <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-bold text-neon-mint">
            فروشگاه
          </span>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            اکانت‌های <span className="neon-text">آماده</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            همه اکانت‌ها همین‌جا — بازی مورد نظرت رو فیلتر کن و مستقیم خرید کن.
          </p>
        </Reveal>

        <StoreGrid listings={data} chips={chips} />
      </div>
    </section>
  );
}
