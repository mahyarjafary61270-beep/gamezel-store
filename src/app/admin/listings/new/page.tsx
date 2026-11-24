import ListingForm from "@/components/admin/ListingForm";
import { getDb } from "@/db";
import { games } from "@/db/schema";

export default async function NewListingPage() {
  const db = await getDb();
  const gameRows = await db
    .select({ id: games.id, title: games.title })
    .from(games)
    .orderBy(games.sortOrder);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black">افزودن اکانت جدید</h1>
      <ListingForm games={gameRows} />
    </div>
  );
}
