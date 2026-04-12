"use client";

import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowLeft, Ban, ShieldOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getGetAdminUserDetailQueryKey,
  useGetAdminUserDetail,
  useUnbanAdminUser,
} from "@/lib/api/rc-generated";
import { BanUserDialog } from "../../_components/ban-user-dialog";

interface UserDetailContentProps {
  userId: string;
}

export function UserDetailContent({ userId }: UserDetailContentProps) {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useGetAdminUserDetail(userId);

  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanAdminUser();

  const handleUnban = () => {
    unbanUser(
      { userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetAdminUserDetailQueryKey(userId),
          });
        },
        onError: () => {
          alert("Erro ao desbanir usuário. Tente novamente.");
        },
      }
    );
  };

  if (isLoading || !response || response.status !== 200) {
    return <UserDetailSkeleton />;
  }

  const user = response.data;

  const planLabels: Record<string, string> = {
    FREE: "Free",
    MONTHLY: "Mensal",
    QUARTERLY: "Trimestral",
    YEARLY: "Anual",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {user.name}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="ml-auto">
          {user.banned ? (
            <Button
              variant="outline"
              onClick={handleUnban}
              disabled={isUnbanning}
            >
              <ShieldOff className="mr-2 h-4 w-4" />
              Desbanir
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => setShowBanDialog(true)}
            >
              <Ban className="mr-2 h-4 w-4" />
              Banir
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {user.banned ? (
                <Badge variant="destructive">Banido</Badge>
              ) : (
                <Badge variant="secondary">Ativo</Badge>
              )}
              <Badge variant={user.plan === "FREE" ? "outline" : "default"}>
                {planLabels[user.plan] ?? user.plan}
              </Badge>
            </div>
            {user.subscriptionStatus && (
              <p className="text-sm text-muted-foreground">
                Assinatura: {user.subscriptionStatus}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Atividade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Planos de treino: </span>
              <span className="font-medium">{user.workoutPlansCount}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Sessões: </span>
              <span className="font-medium">{user.sessionsCount}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Criado em: </span>
              <span className="font-medium">
                {dayjs(user.createdAt).format("DD/MM/YYYY")}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Role: </span>
              <span className="font-medium">{user.role}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {user.banned && (user.banReason || user.banExpires) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive">
              Informações do Ban
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {user.banReason && (
              <p className="text-sm">
                <span className="text-muted-foreground">Motivo: </span>
                {user.banReason}
              </p>
            )}
            {user.banExpires && (
              <p className="text-sm">
                <span className="text-muted-foreground">Expira em: </span>
                {dayjs(user.banExpires).format("DD/MM/YYYY HH:mm")}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {(user.weightInGrams || user.heightInCentimeters || user.age) && (
        <>
          <Separator />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Dados Físicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {user.weightInGrams && (
                  <div>
                    <p className="text-sm text-muted-foreground">Peso</p>
                    <p className="text-lg font-medium">
                      {(user.weightInGrams / 1000).toFixed(1)} kg
                    </p>
                  </div>
                )}
                {user.heightInCentimeters && (
                  <div>
                    <p className="text-sm text-muted-foreground">Altura</p>
                    <p className="text-lg font-medium">
                      {user.heightInCentimeters} cm
                    </p>
                  </div>
                )}
                {user.age && (
                  <div>
                    <p className="text-sm text-muted-foreground">Idade</p>
                    <p className="text-lg font-medium">{user.age} anos</p>
                  </div>
                )}
                {user.bodyFatPercentage !== null &&
                  user.bodyFatPercentage !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Gordura Corporal
                      </p>
                      <p className="text-lg font-medium">
                        {user.bodyFatPercentage}%
                      </p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <BanUserDialog
        userId={showBanDialog ? userId : null}
        open={showBanDialog}
        onClose={() => setShowBanDialog(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: getGetAdminUserDetailQueryKey(userId),
          });
        }}
      />
    </div>
  );
}

function UserDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
