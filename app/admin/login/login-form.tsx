"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <form action={action} className="mt-6 space-y-5">
      <label className="block font-semibold">
        Email
        <input name="email" type="email" autoComplete="username" required maxLength={254} className="mt-2 block w-full border border-slate-400 p-3" />
      </label>
      <label className="block font-semibold">
        Password
        <input name="password" type="password" autoComplete="current-password" required maxLength={1024} className="mt-2 block w-full border border-slate-400 p-3" />
      </label>
      {state.error && <p role="alert" className="text-red-800">{state.error}</p>}
      <button disabled={pending} className="bg-blue-900 px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
