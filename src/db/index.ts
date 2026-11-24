import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export { schema };

export async function getDb() {
  const { env } = await getCloudflareContext();
  if (!env.DB) throw new Error("D1 binding DB is not configured");
  return drizzle(env.DB, { schema });
}
