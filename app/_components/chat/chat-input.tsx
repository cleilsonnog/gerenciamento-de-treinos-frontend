"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatInputProps = {
  onSend: (message: string) => void;
  isDisabled?: boolean;
};

export function ChatInput({ onSend, isDisabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isDisabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="flex items-center gap-2 border-t border-border bg-background px-4 py-4">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder="Digite sua mensagem"
        disabled={isDisabled}
        className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
      <Button
        type="button"
        size="icon"
        onClick={handleSubmit}
        disabled={isDisabled || !value.trim()}
        className="h-[42px] w-[42px] shrink-0 rounded-full"
      >
        <ArrowUp size={20} />
      </Button>
    </div>
  );
}
