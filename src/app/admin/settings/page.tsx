import SettingsForm from "@/components/admin/SettingsForm";
import { getDb } from "@/db";
import { settings } from "@/db/schema";

export default async function AdminSettingsPage() {
  const db = await getDb();
  const rows = await db.select().from(settings);
  const map = new Map(rows.map((r) => [r.key, r.value]));

  const values = {
    card_number: map.get("card_number") ?? "",
    card_holder: map.get("card_holder") ?? "",
    bank_name: map.get("bank_name") ?? "",
    telegram_id: map.get("telegram_id") ?? "",
    order_notice: map.get("order_notice") ?? "",
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black">تنظیمات فروشگاه</h1>
      <SettingsForm values={values} />
    </div>
  );
}
