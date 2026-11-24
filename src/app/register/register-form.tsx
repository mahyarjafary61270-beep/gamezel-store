"use client";

import { useActionState } from "react";
import { registerAction, type AuthState } from "@/lib/auth-actions";

const initialState: AuthState = { error: null, fieldErrors: {} };

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
          نام و نام خانوادگی
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="مثلا: علی رضایی"
          className="input-dark"
        />
        {state.fieldErrors.name && <p className="mt-1.5 text-xs text-rose-400">{state.fieldErrors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
          ایمیل
        </label>
        <input
          id="email"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="input-dark"
        />
        {state.fieldErrors.email && <p className="mt-1.5 text-xs text-rose-400">{state.fieldErrors.email}</p>}
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
          رمز عبور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          required
          placeholder="حداقل ۸ کاراکتر"
          className="input-dark"
        />
        {state.fieldErrors.password && (
          <p className="mt-1.5 text-xs text-rose-400">{state.fieldErrors.password}</p>
        )}
      </div>
      <div>
        <label htmlFor="confirm" className="mb-2 block text-sm font-medium text-slate-300">
          تکرار رمز عبور
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className="input-dark"
        />
        {state.fieldErrors.confirm && (
          <p className="mt-1.5 text-xs text-rose-400">{state.fieldErrors.confirm}</p>
        )}
      </div>
      <button type="submit" disabled={pending} className="glow-btn w-full py-3 text-base disabled:opacity-60">
        {pending ? "در حال ساخت حساب..." : "ساخت حساب"}
      </button>
    </form>
  );
}
