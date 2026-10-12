// FAMZI FILE GUIDE: Form for requesting a replacement admin email verification link.
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function AdminResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      const response = await fetch("/api/admin-email-verification/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not resend the link.");
      setMessage(data.message); setEmail("");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not resend the link."); }
    finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 py-12"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm sm:p-10">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">FAMZI Admin</p><h1 className="mt-3 text-3xl font-black">Resend verification</h1><p className="mt-2 text-sm text-black/50">Enter the email used to create the admin account.</p>
    <label htmlFor="verify-email" className="mt-7 block text-sm font-bold">Email</label><input id="verify-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500" />
    {message && <p role="status" className="mt-4 text-sm font-semibold text-green-700">{message}</p>}{error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
    <button disabled={busy} className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{busy ? "Sending…" : "Send new link"}</button><p className="mt-5 text-center text-sm"><Link className="font-semibold text-orange-600" href="/admin-login">Back to sign in</Link></p>
  </form></main>;
}
