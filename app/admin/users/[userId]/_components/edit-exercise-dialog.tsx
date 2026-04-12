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
import {
  type GetAdminUserWorkoutPlans200ItemWorkoutDaysItemExercisesItem,
  getGetAdminUserWorkoutPlansQueryKey,
  useUpdateAdminWorkoutExercise,
} from "@/lib/api/rc-generated";

const editExerciseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sets: z.number().int().min(1, "Mínimo 1 série"),
  reps: z.number().int().min(1, "Mínimo 1 repetição"),
  restTimeInSeconds: z.number().int().min(1, "Mínimo 1 segundo"),
  weightInKg: z.number().min(0).nullable(),
});

type EditExerciseValues = z.infer<typeof editExerciseSchema>;

interface EditExerciseDialogProps {
  userId: string;
  exercise: GetAdminUserWorkoutPlans200ItemWorkoutDaysItemExercisesItem | null;
  open: boolean;
  onClose: () => void;
}

export function EditExerciseDialog({
  userId,
  exercise,
  open,
  onClose,
}: EditExerciseDialogProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EditExerciseValues>({
    resolver: zodResolver(editExerciseSchema),
    values: exercise
      ? {
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          restTimeInSeconds: exercise.restTimeInSeconds,
          weightInKg: exercise.weightInKg,
        }
      : undefined,
  });

  const { mutate: updateExercise, isPending } =
    useUpdateAdminWorkoutExercise();

  const handleSubmit = (values: EditExerciseValues) => {
    if (!exercise) return;
    setError(null);

    updateExercise(
      {
        userId,
        exerciseId: exercise.id,
        data: {
          name: values.name,
          sets: values.sets,
          reps: values.reps,
          restTimeInSeconds: values.restTimeInSeconds,
          weightInKg: values.weightInKg,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetAdminUserWorkoutPlansQueryKey(userId),
          });
          onClose();
        },
        onError: () => {
          setError("Erro ao atualizar exercício. Tente novamente.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Exercício</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
