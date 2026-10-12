// FAMZI FILE GUIDE: First-admin setup form, gated by the existing bootstrap password.
"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

export default function AdminSetupPage() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [bootstrapPassword, setBootstrapPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { fetch("/api/admin-accounts/setup").then((response) => response.json()).then((data) => setAvailable(Boolean(data.available))).catch(() => setAvailable(false)); }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (password !== confirmPassword) { setError("The passwords do not match."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/admin-accounts/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bootstrapPassword, email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create the account.");
      setSuccess(data.message || "Check your email for the verification link.");
      setAvailable(false);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not create the account."); setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 py-12"><section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm sm:p-10">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">FAMZI Admin</p><h1 className="mt-3 text-3xl font-black text-[#171717]">Create admin account</h1>
    {success ? <><p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-800">{success}</p><p className="mt-3 text-sm text-black/60">Open the link in that email to verify your address. You can sign in after verification.</p><Link className="mt-5 inline-block font-semibold text-orange-600" href="/admin-login">Go to sign in</Link></> : available === null ? <p className="mt-4 text-sm text-black/60">Checking account setup…</p> : !available ? <><p className="mt-4 text-sm text-black/60">Setup is closed. An admin account already exists or server setup is incomplete.</p><Link className="mt-5 inline-block font-semibold text-orange-600" href="/admin-login">Back to sign in</Link></> : <>
      <p className="mt-2 text-sm text-black/50">Use the current server admin password once to verify setup, then choose your email and new password. We’ll send a verification link to that address.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="bootstrap-password" className="mt-6 block text-sm font-bold">Current setup password</label><input id="bootstrap-password" type="password" required value={bootstrapPassword} onChange={(event) => setBootstrapPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500" />
        <label htmlFor="setup-email" className="mt-5 block text-sm font-bold">Admin email</label><input id="setup-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500" />
        <label htmlFor="setup-password" className="mt-5 block text-sm font-bold">New password</label><input id="setup-password" type="password" minLength={12} autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500" />
        <label htmlFor="setup-password-confirm" className="mt-5 block text-sm font-bold">Confirm new password</label><input id="setup-password-confirm" type="password" minLength={12} autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500" />
        {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
        <button disabled={busy} className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{busy ? "Creating account…" : "Create admin account"}</button>
      </form><p className="mt-5 text-center text-sm"><Link className="font-semibold text-orange-600" href="/admin-login">Back to sign in</Link></p>
    </>}
  </section></main>;
}
