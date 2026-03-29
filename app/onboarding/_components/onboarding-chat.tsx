"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/app/_components/chat/chat-message";
import { ChatInput } from "@/app/_components/chat/chat-input";

const INITIAL_MESSAGE = "Quero começar a melhorar minha saúde!";

export function OnboardingChat() {
  const initialMessageSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });

  const isStreaming = status === "streaming";

  useEffect(() => {
    if (!initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      sendMessage({ text: INITIAL_MESSAGE });
    }
  }, [sendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex size-[42px] items-center justify-center rounded-full bg-primary/8 border border-primary/8">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-foreground">
              Coach AI
            </span>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-online" />
              <span className="text-xs text-primary">Online</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">Acessar FIT.AI</Link>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={message.parts
                .filter((part) => part.type === "text")
                .map((part) => (part as { type: "text"; text: string }).text)
                .join("")}
              isStreaming={
                isStreaming &&
                message.role === "assistant" &&
                message === messages[messages.length - 1]
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSend={handleSend} isDisabled={isStreaming} />
    </div>
  );
}
