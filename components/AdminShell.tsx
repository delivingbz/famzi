"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/AdminLogoutButton";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/orders", label: "Orders", icon: "🛒" },
  { href: "/admin/menu", label: "Menu", icon: "🍽️" },
  { href: "/admin/meal-requests", label: "Meal Requests", icon: "FM" },
  { href: "/admin/reports", label: "Reports", icon: "RP" },
];

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={mobile ? "flex gap-2 overflow-x-auto" : "space-y-2"}>
      {navigation.map(({ href, label, icon }) => {
        const isActive =
          href === "/admin"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`${
              mobile
                ? "whitespace-nowrap rounded-xl px-4 py-2.5"
                : "flex items-center gap-3 rounded-xl px-4 py-3"
            } text-sm font-bold transition ${
              isActive
                ? "bg-orange-50 text-orange-600"
                : "text-black/60 hover:bg-black/5 hover:text-black"
            }`}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#171717]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-white px-4 sm:px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-lg font-black text-white">
            F
          </span>
          <span className="text-xl font-black tracking-tight">FAMZI</span>
          <span className="hidden text-sm font-semibold text-black/40 sm:inline">
            Admin
          </span>
        </Link>
        <AdminLogoutButton />
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-black/5 bg-white p-4 md:block">
          <NavigationLinks />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="border-b border-black/5 bg-white px-4 py-3 md:hidden">
            <NavigationLinks mobile />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
