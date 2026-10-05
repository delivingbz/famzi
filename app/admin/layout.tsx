import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-auth";
import AdminShell from "@/components/AdminShell";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isAdminSessionValid(session)) {
    redirect("/admin-login");
  }

  return <AdminShell>{children}</AdminShell>;
}
