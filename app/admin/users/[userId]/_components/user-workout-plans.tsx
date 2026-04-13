"use client";

import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import Image from "next/image";
import { Dumbbell, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type GetAdminUserWorkoutPlans200ItemWorkoutDaysItemExercisesItem,
  getGetAdminUserWorkoutPlansQueryKey,
  useDeleteAdminExercise,
  useGetAdminUserWorkoutPlans,
} from "@/lib/api/rc-generated";
import { AddExerciseDialog } from "./add-exercise-dialog";
import { EditExerciseDialog } from "./edit-exercise-dialog";
import { ExerciseGifDialog } from "./exercise-gif-dialog";

const weekDayLabels: Record<string, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

interface UserWorkoutPlansProps {
  userId: string;
}

export function UserWorkoutPlans({ userId }: UserWorkoutPlansProps) {
  const queryClient = useQueryClient();
  const { data: response, isLoading } = useGetAdminUserWorkoutPlans(userId);

  const [editingExercise, setEditingExercise] =
    useState<GetAdminUserWorkoutPlans200ItemWorkoutDaysItemExercisesItem | null>(
      null
    );

  const [addingToDay, setAddingToDay] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [viewingGif, setViewingGif] = useState<{
    gifUrl: string;
    name: string;
  } | null>(null);

  const { mutate: deleteExercise, isPending: isDeleting } =
    useDeleteAdminExercise();

  const handleDelete = (exerciseId: string, exerciseName: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${exerciseName}"?`)) return;

    deleteExercise(
      { userId, exerciseId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetAdminUserWorkoutPlansQueryKey(userId),
          });
        },
        onError: () => {
          alert("Erro ao excluir exercício. Tente novamente.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!response || response.status !== 200) {
    return null;
  }

  const plans = response.data;

  if (plans.length === 0) {
    return (
      <>
        <Separator />
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Dumbbell className="mx-auto mb-2 h-8 w-8" />
            <p>Nenhum plano de treino encontrado.</p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Planos de Treino ({plans.length})
        </h3>

        <Accordion type="single" collapsible className="space-y-3">
          {plans.map((plan) => (
            <AccordionItem
              key={plan.id}
              value={plan.id}
              className="rounded-lg border bg-card"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{plan.name}</span>
                  {plan.isActive ? (
                    <Badge variant="default">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {dayjs(plan.createdAt).format("DD/MM/YYYY")}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  {plan.workoutDays.map((day) => (
                    <Card key={day.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <span>
                              {weekDayLabels[day.weekDay] ?? day.weekDay}
                            </span>
                            <span className="text-muted-foreground">—</span>
                            <span>{day.name}</span>
                            {day.isRest && (
                              <Badge variant="outline">Descanso</Badge>
                            )}
                          </CardTitle>
                          {!day.isRest && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setAddingToDay({ id: day.id, name: day.name })
                              }
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Exercício
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      {!day.isRest && day.exercises.length > 0 && (
                        <CardContent>
                          <div className="space-y-2">
                            {day.exercises.map((exercise) => (
                              <div
                                key={exercise.id}
                                className="flex items-center justify-between rounded-md border px-3 py-2"
                              >
                                <div className="flex items-center gap-3">
                                  {exercise.gifUrl && (
                                    <button
                                      type="button"
                                      className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted transition-opacity hover:opacity-80"
                                      onClick={() =>
                                        setViewingGif({
                                          gifUrl: exercise.gifUrl!,
                                          name: exercise.name,
                                        })
                                      }
                                    >
                                      <Image
                                        src={exercise.gifUrl}
                                        alt={exercise.name}
                                        fill
                                        sizes="40px"
                                        className="object-contain"
                                        unoptimized
                                      />
                                    </button>
                                  )}
                                  <div className="space-y-0.5">
                                    <p className="text-sm font-medium">
                                      {exercise.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {exercise.sets}x{exercise.reps}
                                      {exercise.weightInKg !== null &&
                                        ` • ${exercise.weightInKg}kg`}
                                      {` • ${exercise.restTimeInSeconds}s descanso`}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      setEditingExercise(exercise)
                                    }
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDeleting}
                                    onClick={() =>
                                      handleDelete(exercise.id, exercise.name)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <EditExerciseDialog
        userId={userId}
        exercise={editingExercise}
        open={editingExercise !== null}
        onClose={() => setEditingExercise(null)}
      />

      <AddExerciseDialog
        userId={userId}
        workoutDayId={addingToDay?.id ?? null}
        workoutDayName={addingToDay?.name ?? ""}
        open={addingToDay !== null}
        onClose={() => setAddingToDay(null)}
      />

      <ExerciseGifDialog
        gifUrl={viewingGif?.gifUrl ?? null}
        exerciseName={viewingGif?.name ?? ""}
        open={viewingGif !== null}
        onClose={() => setViewingGif(null)}
      />
    </>
  );
}
