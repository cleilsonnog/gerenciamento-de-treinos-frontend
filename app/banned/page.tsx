"use client";

import { useSearchParams } from "next/navigation";
import { ShieldBan } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Suspense } from "react";

dayjs.locale("pt-br");

const BannedContent = () => {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const expires = searchParams.get("expires");

  const formattedExpires = expires
    ? dayjs(expires).format("DD [de] MMMM [de] YYYY [às] HH:mm")
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldBan className="h-10 w-10 text-destructive" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            Conta Suspensa
          </h1>
          <p className="text-sm text-muted-foreground">
            Sua conta foi suspensa e você não pode acessar a plataforma no
            momento.
          </p>
        </div>

        {reason && (
          <div className="w-full rounded-lg border border-border bg-muted/50 p-4">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Motivo
            </p>
            <p className="text-sm text-foreground">{reason}</p>
          </div>
        )}

        {formattedExpires ? (
          <div className="w-full rounded-lg border border-border bg-muted/50 p-4">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Suspensão expira em
            </p>
            <p className="text-sm font-medium text-foreground">
              {formattedExpires}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Esta suspensão não tem data de expiração definida.
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Se acredita que isso é um erro, entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
};

const BannedPage = () => {
  return (
    <Suspense>
      <BannedContent />
    </Suspense>
  );
};

export default BannedPage;
