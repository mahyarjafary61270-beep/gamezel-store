import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import GameForm from "@/components/admin/GameForm";
import { getDb } from "@/db";
import { categories, games, images } from "@/db/schema";

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const game = await db.select().from(games).where(eq(games.id, id)).get();
  if (!game) notFound();

  const cats = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(asc(categories.sortOrder));
  const imgs = await db
    .select({ id: images.id, alt: images.alt })
    .from(images)
    .where(and(eq(images.ownerType, "game"), eq(images.ownerId, id)))
    .orderBy(asc(images.sortOrder));

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black">ویرایش بازی «{game.title}»</h1>
      <GameForm categories={cats} game={game} images={imgs} />
    </div>
  );
}
