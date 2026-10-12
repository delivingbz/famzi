// FAMZI FILE GUIDE: Clears the admin session and returns staff to the login page.
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    await fetch("/api/admin-session", { method: "DELETE" });
    router.replace("/admin-login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isLoggingOut}
      className="rounded-lg px-3 py-2 text-xs font-bold text-black/50 transition hover:bg-black/5 hover:text-black disabled:opacity-50"
    >
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
