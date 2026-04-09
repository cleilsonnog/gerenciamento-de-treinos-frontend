"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Ban, Eye, Search, ShieldOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getListAdminUsersQueryKey,
  useListAdminUsers,
  useUnbanAdminUser,
} from "@/lib/api/rc-generated";

import { BanUserDialog } from "./ban-user-dialog";

export function UsersContent() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [banUserId, setBanUserId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const params = {
    search: search || undefined,
    plan: planFilter !== "all" ? planFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page,
    limit: 20,
  };

  const { data: response, isLoading } = useListAdminUsers(params);
  const data = response?.status === 200 ? response.data : undefined;

  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanAdminUser();

  const handleUnban = (userId: string) => {
    unbanUser(
      { userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListAdminUsersQueryKey(params),
          });
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={planFilter}
          onValueChange={(value) => {
            setPlanFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="FREE">Free</SelectItem>
            <SelectItem value="MONTHLY">Mensal</SelectItem>
            <SelectItem value="QUARTERLY">Trimestral</SelectItem>
            <SelectItem value="YEARLY">Anual</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="banned">Banido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              data?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <PlanBadge plan={user.plan} />
                  </TableCell>
                  <TableCell>
                    {user.banned ? (
                      <Badge variant="destructive">Banido</Badge>
                    ) : (
                      <Badge variant="secondary">Ativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/users/${user.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {user.banned ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUnban(user.id)}
                          disabled={isUnbanning}
                        >
                          <ShieldOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setBanUserId(user.id)}
                        >
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {data.page} de {data.totalPages} ({data.total} usuários)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <BanUserDialog
        userId={banUserId}
        open={!!banUserId}
        onClose={() => setBanUserId(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: getListAdminUsersQueryKey(params),
          });
        }}
      />
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const labels: Record<string, string> = {
    FREE: "Free",
    MONTHLY: "Mensal",
    QUARTERLY: "Trimestral",
    YEARLY: "Anual",
  };

  return (
    <Badge variant={plan === "FREE" ? "outline" : "default"}>
      {labels[plan] ?? plan}
    </Badge>
  );
}
