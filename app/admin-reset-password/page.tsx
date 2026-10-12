// FAMZI FILE GUIDE: Form that submits a reset token and the replacement admin password.
"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setToken(new URLSearchParams(window.location.search).get("token") || ""); }, []);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!token) { setError("This reset link is missing its token. Request a new one."); return; }
    if (password !== confirmPassword) { setError("The passwords do not match."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/admin-password-reset/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not reset the password.");
      router.replace("/admin-login?reset=1"); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "Could not reset the password."); setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 py-12"><form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm sm:p-10">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">FAMZI Admin</p><h1 className="mt-3 text-3xl font-black">Choose a new password</h1><p className="mt-2 text-sm text-black/50">Use at least 12 characters.</p>
    <label htmlFor="new-admin-password" className="mt-7 block text-sm font-bold">New password</label><input id="new-admin-password" type="password" minLength={12} autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500" />
    <label htmlFor="confirm-admin-password" className="mt-5 block text-sm font-bold">Confirm new password</label><input id="confirm-admin-password" type="password" minLength={12} autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500" />
    {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
    <button disabled={busy} className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{busy ? "Saving…" : "Save new password"}</button><p className="mt-5 text-center text-sm"><Link className="font-semibold text-orange-600" href="/admin-login">Back to sign in</Link></p>
  </form></main>;
}
