"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/app/_lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      return;
    }

    router.push("/auth");
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="h-8 rounded-full border border-destructive/20 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <span className="text-base font-semibold">Sair da conta</span>
      <LogOut size={16} />
    </Button>
  );
}
