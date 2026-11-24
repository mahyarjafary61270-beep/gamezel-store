"use client";

import { useActionState } from "react";
import { approveOrderAction, rejectOrderAction, type OrderActionState } from "@/lib/order-actions";

const initialState: OrderActionState = { error: null };

export default function OrderActions({ orderId }: { orderId: string }) {
  const [approveState, approveAction, approvePending] = useActionState(approveOrderAction, initialState);
  const [rejectState, rejectAction, rejectPending] = useActionState(rejectOrderAction, initialState);

  return (
    <div className="space-y-3">
      {(approveState.error || rejectState.error) && (
        <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {approveState.error ?? rejectState.error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <form
          action={approveAction}
          onSubmit={(e) => {
            if (
              !window.confirm(
                "تایید سفارش؟ اکانت‌ها به مشتری تحویل داده می‌شوند و از موجودی کم می‌شوند."
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="orderId" value={orderId} />
          <button className="glow-btn !px-6 !py-2.5" disabled={approvePending}>
            {approvePending ? "در حال پردازش..." : "تایید و تحویل اکانت"}
          </button>
        </form>
        <form
          action={rejectAction}
          onSubmit={(e) => {
            if (!window.confirm("سفارش رد شود؟")) e.preventDefault();
          }}
        >
          <input type="hidden" name="orderId" value={orderId} />
          <button className="btn-danger !px-6 !py-2.5 !text-sm" disabled={rejectPending}>
            {rejectPending ? "در حال پردازش..." : "رد سفارش"}
          </button>
        </form>
      </div>
    </div>
  );
}
