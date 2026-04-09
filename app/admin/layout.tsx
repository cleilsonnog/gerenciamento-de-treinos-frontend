import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";

import { AdminShell } from "./_components/admin-shell";
import { QueryProvider } from "./_components/query-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const userRole = (session.data.user as { role?: string }).role;

  if (userRole !== "admin") {
    redirect("/");
  }

  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}
