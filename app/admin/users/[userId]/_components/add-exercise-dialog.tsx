"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
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
import { Separator } from "@/components/ui/separator";
import {
  getGetAdminUserWorkoutPlansQueryKey,
  useAddAdminExercise,
} from "@/lib/api/rc-generated";
import { ExerciseSearch } from "./exercise-search";

const addExerciseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sets: z.number().int().min(1, "Mínimo 1 série"),
  reps: z.number().int().min(1, "Mínimo 1 repetição"),
  restTimeInSeconds: z.number().int().min(1, "Mínimo 1 segundo"),
  weightInKg: z.number().min(0).nullable(),
  gifUrl: z.string().nullable(),
});

type AddExerciseValues = z.infer<typeof addExerciseSchema>;

interface AddExerciseDialogProps {
  userId: string;
  workoutDayId: string | null;
  workoutDayName: string;
  open: boolean;
  onClose: () => void;
}

export function AddExerciseDialog({
  userId,
  workoutDayId,
  workoutDayName,
  open,
  onClose,
}: AddExerciseDialogProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AddExerciseValues>({
    resolver: zodResolver(addExerciseSchema),
    defaultValues: {
      name: "",
      sets: 3,
      reps: 12,
      restTimeInSeconds: 60,
      weightInKg: null,
      gifUrl: null,
    },
  });

  const { mutate: addExercise, isPending } = useAddAdminExercise();

  const handleSubmit = (values: AddExerciseValues) => {
    if (!workoutDayId) return;
    setError(null);

    addExercise(
      {
        userId,
        workoutDayId,
        data: {
          name: values.name,
          sets: values.sets,
          reps: values.reps,
          restTimeInSeconds: values.restTimeInSeconds,
          weightInKg: values.weightInKg,
          gifUrl: values.gifUrl,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetAdminUserWorkoutPlansQueryKey(userId),
          });
          form.reset();
          onClose();
        },
        onError: () => {
          setError("Erro ao adicionar exercício. Tente novamente.");
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const gifUrl = form.watch("gifUrl");

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Exercício — {workoutDayName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium">Buscar GIF (ExerciseDB)</p>
              <ExerciseSearch
                selectedGifUrl={gifUrl}
                onSelect={(result) => {
                  form.setValue("gifUrl", result.gifUrl);
                  if (!form.getValues("name")) {
                    form.setValue("name", result.name);
                  }
                }}
                onClear={() => form.setValue("gifUrl", null)}
              />
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Supino Reto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Séries</FormLabel>
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
                name="reps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repetições</FormLabel>
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
                name="restTimeInSeconds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descanso (segundos)</FormLabel>
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
                name="weightInKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carga (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="Sem carga"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adicionando..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
