"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getGetUserTrainDataQueryKey,
  type UpsertUserTrainDataBodyGender,
  useUpsertUserTrainData,
} from "@/lib/api/rc-generated";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Masculino" },
  { value: "FEMALE", label: "Feminino" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefiro não dizer" },
] as const;

const settingsSchema = z.object({
  weightInKg: z.number().positive("Peso deve ser maior que 0"),
  heightInCentimeters: z.number().int().positive("Altura deve ser maior que 0"),
  age: z.number().int().positive("Idade deve ser maior que 0"),
  bodyFatPercentage: z.number().int().min(0).max(100).nullable(),
  gender: z.enum(["MALE", "FEMALE", "PREFER_NOT_TO_SAY"]).nullable(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    weightInGrams: number;
    heightInCentimeters: number;
    age: number;
    bodyFatPercentage: number | null;
    gender: string | null;
  };
}

export function SettingsDialog({
  open,
  onClose,
  initialData,
}: SettingsDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    values: {
      weightInKg: initialData.weightInGrams / 1000,
      heightInCentimeters: initialData.heightInCentimeters,
      age: initialData.age,
      bodyFatPercentage: initialData.bodyFatPercentage,
      gender: (initialData.gender as SettingsValues["gender"]) ?? null,
    },
  });

  const { mutate: upsert, isPending } = useUpsertUserTrainData();

  const handleSubmit = (values: SettingsValues) => {
    setError(null);

    upsert(
      {
        data: {
          weightInGrams: Math.round(values.weightInKg * 1000),
          heightInCentimeters: values.heightInCentimeters,
          age: values.age,
          bodyFatPercentage: values.bodyFatPercentage,
          gender: values.gender as UpsertUserTrainDataBodyGender | undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetUserTrainDataQueryKey(),
          });
          router.refresh();
          onClose();
        },
        onError: () => {
          setError("Erro ao salvar. Tente novamente.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weightInKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heightInCentimeters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bodyFatPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gordura (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Opcional"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(val) =>
                      field.onChange(val === "" ? null : val)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
