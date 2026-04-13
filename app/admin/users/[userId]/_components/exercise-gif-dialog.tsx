"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExerciseGifDialogProps {
  gifUrl: string | null;
  exerciseName: string;
  open: boolean;
  onClose: () => void;
}

export function ExerciseGifDialog({
  gifUrl,
  exerciseName,
  open,
  onClose,
}: ExerciseGifDialogProps) {
  if (!gifUrl) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{exerciseName}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={gifUrl}
            alt={exerciseName}
            fill
            sizes="(max-width: 448px) 100vw, 448px"
            className="object-contain"
            unoptimized
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
