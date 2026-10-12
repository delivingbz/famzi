// FAMZI FILE GUIDE: Protects every admin route by validating the signed admin session.
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";
import AdminShell from "@/components/AdminShell";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await hasAdminSession())) {
    redirect("/admin-login");
  }

  return <AdminShell>{children}</AdminShell>;
}
