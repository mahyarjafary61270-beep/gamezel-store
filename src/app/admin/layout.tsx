import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { getCurrentUser } from "@/lib/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="container-x pb-16 pt-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <AdminNav userName={user.name} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
