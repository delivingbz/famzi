// FAMZI FILE GUIDE: Confirmation page that consumes an admin email verification link.
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminVerifyEmailPage() {
  const [token, setToken] = useState("");
  const [state, setState] = useState<"waiting" | "verifying" | "success" | "error">("waiting");
  const [message, setMessage] = useState("Open this page from the verification email, then confirm your address.");
  useEffect(() => { setToken(new URLSearchParams(window.location.search).get("token") || ""); }, []);

  async function verifyEmail() {
    if (!token) { setState("error"); setMessage("This link is missing its token. Please create the admin account again or contact the site administrator."); return; }
    setState("verifying"); setMessage("");
    try {
      const response = await fetch("/api/admin-email-verification/confirm", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not verify this email.");
      setState("success"); setMessage("Your email is verified. You can now sign in to the admin dashboard.");
    } catch (error) {
      setState("error"); setMessage(error instanceof Error ? error.message : "Could not verify this email.");
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 py-12"><section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">FAMZI Admin</p>
    <h1 className="mt-3 text-3xl font-black">Verify your email</h1>
    <p role={state === "error" ? "alert" : "status"} className={`mt-4 text-sm ${state === "error" ? "text-red-600" : state === "success" ? "text-green-700" : "text-black/60"}`}>{state === "verifying" ? "Verifying your address…" : message}</p>
    {state !== "success" ? <button onClick={verifyEmail} disabled={state === "verifying"} className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{state === "verifying" ? "Verifying…" : "Verify email address"}</button> : null}
    <p className="mt-5 text-sm"><Link className="font-semibold text-orange-600" href="/admin-login">Go to sign in</Link></p>
  </section></main>;
}
