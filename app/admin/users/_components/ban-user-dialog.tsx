"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBanAdminUser } from "@/lib/api/rc-generated";

const banFormSchema = z.object({
  banReason: z.string().optional(),
  banDays: z.number().int().min(0).optional(),
});

type BanFormValues = z.infer<typeof banFormSchema>;

interface BanUserDialogProps {
  userId: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BanUserDialog({
  userId,
  open,
  onClose,
  onSuccess,
}: BanUserDialogProps) {
  const form = useForm<BanFormValues>({
    resolver: zodResolver(banFormSchema),
    defaultValues: {
      banReason: "",
      banDays: undefined,
    },
  });

  const { mutate: banUser, isPending } = useBanAdminUser();

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (values: BanFormValues) => {
    if (!userId) return;
    setError(null);

    banUser(
      {
        userId,
        data: {
          banReason: values.banReason || undefined,
          banExpiresIn: values.banDays
            ? values.banDays * 24 * 60 * 60
            : undefined,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
          onSuccess();
        },
        onError: () => {
          setError("Erro ao banir usuário. Tente novamente.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Banir Usuário</DialogTitle>
          <DialogDescription>
            O usuário será impedido de fazer login e todas as sessões ativas
            serão revogadas.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="banReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo do Ban (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Violação dos termos de uso"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração em dias (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Deixe vazio para ban permanente"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? "Banindo..." : "Confirmar Ban"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
