"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRoleAction, type UserActionState } from "@/lib/user-actions";

const initialState: UserActionState = { error: null };

export default function RoleSelect({
  userId,
  currentRole,
  self,
}: {
  userId: string;
  currentRole: string;
  self?: boolean;
}) {
  const [state, formAction, pending] = useActionState(updateUserRoleAction, initialState);
  const [value, setValue] = useState(currentRole);
  const didSubmit = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!didSubmit.current) return;
    if (pending) return;
    didSubmit.current = false;
    if (state.error) {
      setValue(currentRole);
    } else {
      router.refresh();
    }
  }, [pending, state, currentRole, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        value={value}
        disabled={self || pending}
        onChange={(e) => {
          didSubmit.current = true;
          setValue(e.target.value);
          e.currentTarget.form?.requestSubmit();
        }}
        className="input-dark !w-auto !px-3 !py-1.5 text-xs"
      >
        <option value="user">کاربر</option>
        <option value="admin">ادمین</option>
      </select>
      {state.error && <p className="mt-1 text-[11px] text-rose-400">{state.error}</p>}
    </form>
  );
}
