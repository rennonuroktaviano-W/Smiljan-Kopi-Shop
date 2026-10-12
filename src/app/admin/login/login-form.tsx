"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.error ? (
        <p
          role="alert"
          className="rounded-md border border-olive-deep/40 bg-olive/10 px-4 py-3 text-sm text-obsidian"
        >
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-[0.2em] text-fog"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-3 text-sm text-ivory placeholder:text-fog/60 focus:border-olive focus:outline-none"
          placeholder="nama@contoh.com"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-[0.2em] text-fog"
        >
          Kata sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-3 text-sm text-ivory placeholder:text-fog/60 focus:border-olive focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ivory px-6 text-xs font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors hover:bg-stone disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
