"use client";

import { CreditCard, TrendingUp, UserPlus, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminStats } from "@/lib/api/rc-generated";

export function DashboardContent() {
  const { data: response, isLoading } = useGetAdminStats();

  if (isLoading || !response || response.status !== 200) {
    return <DashboardSkeleton />;
  }

  const stats = response.data;

  const cards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      title: "Assinaturas Ativas",
      value: stats.activeSubscriptions,
      icon: CreditCard,
    },
    {
      title: "Novos este Mês",
      value: stats.newUsersThisMonth,
      icon: UserPlus,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            Usuários por Plano
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.usersByPlan).map(([plan, count]) => {
              const percentage =
                stats.totalUsers > 0
                  ? Math.round((count / stats.totalUsers) * 100)
                  : 0;

              return (
                <div key={plan} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium">{plan}</span>
                  <div className="flex-1 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm text-muted-foreground">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
