import { notFound } from "next/navigation";
import { and, asc, desc, eq } from "drizzle-orm";
import CredentialsManager from "@/components/admin/CredentialsManager";
import ListingForm from "@/components/admin/ListingForm";
import { getDb } from "@/db";
import { credentials, games, images, listings } from "@/db/schema";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const listing = await db.select().from(listings).where(eq(listings.id, id)).get();
  if (!listing) notFound();

  const gameRows = await db
    .select({ id: games.id, title: games.title })
    .from(games)
    .orderBy(asc(games.sortOrder));
  const imgs = await db
    .select({ id: images.id, alt: images.alt })
    .from(images)
    .where(and(eq(images.ownerType, "listing"), eq(images.ownerId, id)))
    .orderBy(asc(images.sortOrder));
  const creds = await db
    .select({
      id: credentials.id,
      username: credentials.username,
      password: credentials.password,
      orderItemId: credentials.orderItemId,
    })
    .from(credentials)
    .where(eq(credentials.listingId, id))
    .orderBy(desc(credentials.createdAt));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">ویرایش اکانت «{listing.title}»</h1>
      <ListingForm games={gameRows} listing={listing} images={imgs} />
      <CredentialsManager
        listingId={id}
        credentials={creds.map((c) => ({
          id: c.id,
          username: c.username,
          password: c.password,
          sold: c.orderItemId !== null,
        }))}
      />
    </div>
  );
}
