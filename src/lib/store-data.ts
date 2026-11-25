import { and, asc, count, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { credentials, games, images, listings } from "@/db/schema";

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

export async function getStoreData(): Promise<{
  listings: StoreListing[];
  chips: StoreChip[];
}> {
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

  const listingsData: StoreListing[] = matched.map((l) => {
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
    .map((g) => ({
      id: g.id,
      title: g.title,
      slug: g.slug,
      count: listingsData.filter((d) => d.gameId === g.id).length,
    }))
    .filter((c) => c.count > 0);

  return { listings: listingsData, chips };
}
