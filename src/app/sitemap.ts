import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { games, listings, settings } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDb();
  const row = await db.query.settings.findFirst({
    where: eq(settings.key, "site_url"),
  });
  const base = row?.value?.trim().replace(/\/+$/, "");
  if (!base) return [];

  const [gameRows, listingRows] = await Promise.all([
    db
      .select({ slug: games.slug })
      .from(games)
      .where(eq(games.isActive, true)),
    db
      .select({ id: listings.id })
      .from(listings)
      .where(eq(listings.isActive, true)),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
  for (const g of gameRows) {
    entries.push({
      url: `${base}/games/${g.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const l of listingRows) {
    entries.push({
      url: `${base}/account/${l.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  return entries;
}
