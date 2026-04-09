"use client";

import dayjs from "dayjs";
import { Search } from "lucide-react";
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
import { useGetAdminStripeLogs } from "@/lib/api/rc-generated";

const eventTypes = [
  { value: "all", label: "Todos os tipos" },
  { value: "checkout.session.completed", label: "Checkout Completo" },
  { value: "invoice.payment_succeeded", label: "Pagamento Aprovado" },
  { value: "invoice.payment_failed", label: "Pagamento Falhou" },
  { value: "customer.subscription.created", label: "Assinatura Criada" },
  { value: "customer.subscription.updated", label: "Assinatura Atualizada" },
  { value: "customer.subscription.deleted", label: "Assinatura Cancelada" },
];

export function StripeLogsContent() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params = {
    type: typeFilter !== "all" ? typeFilter : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    limit: 50,
  };

  const { data: response, isLoading } = useGetAdminStripeLogs(params);
  const data = response?.status === 200 ? response.data : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Tipo de evento" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-44"
          placeholder="Data início"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-44"
          placeholder="Data fim"
        />
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8" />
                    <p>Nenhum evento encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <EventBadge type={event.type} />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {event.type}
                  </TableCell>
                  <TableCell className="text-sm">
                    {dayjs.unix(event.created).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {event.id}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data?.hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" disabled>
            Carregar mais (em breve)
          </Button>
        </div>
      )}
    </div>
  );
}

function EventBadge({ type }: { type: string }) {
  const isSuccess =
    type.includes("succeeded") || type.includes("completed") || type.includes("created");
  const isFailure = type.includes("failed") || type.includes("deleted");

  const label = type.split(".").pop()?.replace(/_/g, " ") ?? type;

  if (isFailure) {
    return <Badge variant="destructive">{label}</Badge>;
  }
  if (isSuccess) {
    return <Badge variant="default">{label}</Badge>;
  }
  return <Badge variant="secondary">{label}</Badge>;
}
