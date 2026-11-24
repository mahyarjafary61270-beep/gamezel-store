import GameForm from "@/components/admin/GameForm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";

export default async function NewGamePage() {
  const db = await getDb();
  const cats = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(categories.sortOrder);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black">افزودن بازی جدید</h1>
      <GameForm categories={cats} />
    </div>
  );
}
