import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { receipts } from "@/db/schema";
import { toBytes } from "@/lib/image-utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const row = await db
    .select({ mime: receipts.mime, data: receipts.data })
    .from(receipts)
    .where(eq(receipts.id, id))
    .get();
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(toBytes(row.data) as unknown as BodyInit, {
    headers: {
      "content-type": row.mime,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
