"use client";

import { useActionState } from "react";
import { addCredentialsAction, deleteCredentialAction, type FormState } from "@/lib/admin-actions";

const initialState: FormState = { error: null, fieldErrors: {} };

export default function CredentialsManager({
  listingId,
  credentials,
}: {
  listingId: string;
  credentials: { id: string; username: string; password: string; sold: boolean }[];
}) {
  const [state, formAction, pending] = useActionState(addCredentialsAction, initialState);
  const availableCount = credentials.filter((c) => !c.sold).length;

  return (
    <div className="admin-card space-y-4">
      <h2 className="text-lg font-black">
        اکانت‌های موجود <span className="text-sm font-bold text-slate-400">({availableCount} عدد)</span>
      </h2>
      {credentials.length === 0 ? (
        <p className="text-sm text-slate-400">هنوز اکانتی اضافه نشده است.</p>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto pl-1.5">
          {credentials.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-cyan-200" dir="ltr">
                  {c.username}
                </p>
                <p className="truncate font-mono text-xs text-slate-400" dir="ltr">
                  {c.password}
                </p>
              </div>
              {c.sold ? (
                <span className="badge badge-success shrink-0">فروخته شده</span>
              ) : (
                <form action={deleteCredentialAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="btn-danger">
                    حذف
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
      <form action={formAction} className="space-y-2 border-t border-white/10 pt-4">
        <input type="hidden" name="listingId" value={listingId} />
        <span className="field-label">افزودن اکانت جدید — هر خط به شکل ایمیل:رمز</span>
        <textarea
          name="credentials"
          rows={4}
          className="input-dark font-mono"
          dir="ltr"
          placeholder={"acc1@gmail.com:pass123\nacc2@yahoo.com:pass456"}
        />
        {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
        {state.message && <p className="text-sm text-emerald-400">{state.message}</p>}
        <button className="glow-btn !px-5 !py-2 text-sm" disabled={pending}>
          {pending ? "در حال افزودن..." : "افزودن"}
        </button>
      </form>
    </div>
  );
}
