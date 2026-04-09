"use client";

import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Usuários",
  "/admin/stripe-logs": "Logs Stripe",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];

  if (pathname.startsWith("/admin/users/")) return "Detalhes do Usuário";

  return "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
    </header>
  );
}
