import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getDb } from "@/db";
import { settings } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDb();
  const rows = await db.select().from(settings);
  const map = new Map(rows.map((r) => [r.key, r.value]));

  const values = {
    card_number: map.get("card_number") ?? "",
    card_holder: map.get("card_holder") ?? "",
    bank_name: map.get("bank_name") ?? "",
    order_notice: map.get("order_notice") ?? "",
  };

  return (
    <div className="container-x pb-24 pt-28">
      <h1 className="text-2xl font-black text-white sm:text-3xl">
        تسویه <span className="neon-text">حساب</span>
      </h1>
      <p className="mt-3 max-w-lg text-sm text-slate-400">
        مبلغ سفارش را کارت به کارت کن، بعد عکس رسید را همین‌جا آپلود کن تا سفارشت
        ثبت شود و توسط ادمین بررسی شود.
      </p>
      <CheckoutForm values={values} />
    </div>
  );
}
