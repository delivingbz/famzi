// FAMZI FILE GUIDE: Admin sign-in form that creates a session after email and password verification.
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign-in failed.");
      router.replace("/admin"); router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign-in failed."); setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">FAMZI Admin</p>
        <h1 className="mt-3 text-3xl font-black text-[#171717]">Staff sign in</h1>
        <p className="mt-2 text-sm text-black/50">Sign in with your admin email and password.</p>
        <label htmlFor="admin-email" className="mt-7 block text-sm font-bold text-[#171717]">Email</label>
        <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500" />
        <label htmlFor="admin-password" className="mt-5 block text-sm font-bold text-[#171717]">Password</label>
        <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500" />
        {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Signing in..." : "Sign in"}</button>
        <p className="mt-5 text-center text-sm"><Link className="font-semibold text-orange-600 hover:underline" href="/admin-forgot-password">Forgot password?</Link></p>
        <p className="mt-3 text-center text-sm"><Link className="font-semibold text-orange-600 hover:underline" href="/admin-resend-verification">Resend email verification</Link></p>
        <p className="mt-3 text-center text-sm text-black/50">First time here? <Link className="font-semibold text-orange-600 hover:underline" href="/admin-setup">Create the admin account</Link></p>
      </form>
    </main>
  );
}
