"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./settings-dialog";

const queryClient = new QueryClient();

interface SettingsButtonProps {
  trainData: {
    weightInGrams: number;
    heightInCentimeters: number;
    age: number;
    bodyFatPercentage: number | null;
    gender: string | null;
  };
}

export function SettingsButton({ trainData }: SettingsButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-11"
        onClick={() => setOpen(true)}
      >
        <Settings size={20} className="text-foreground" />
      </Button>
      {open && (
        <QueryClientProvider client={queryClient}>
          <SettingsDialog
            open={open}
            onClose={() => setOpen(false)}
            initialData={trainData}
          />
        </QueryClientProvider>
      )}
    </>
  );
}
