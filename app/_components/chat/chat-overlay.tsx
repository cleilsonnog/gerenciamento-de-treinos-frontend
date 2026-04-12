"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatState } from "./use-chat-state";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";

const SUGGESTED_MESSAGES = ["Monte meu plano de treino", "Adicionar um exercicio, me fale o nome do treino e qual exercicio você quer adicionar"];

export function ChatOverlay() {
  const { chatOpen, chatInitialMessage, closeChat } = useChatState();
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
    if (chatOpen && chatInitialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      sendMessage({ text: chatInitialMessage });
    }
  }, [chatOpen, chatInitialMessage, sendMessage]);

  useEffect(() => {
    if (!chatOpen) {
      initialMessageSentRef.current = false;
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chatOpen) return null;

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
          <Sparkles size={20} className="text-primary-foreground" />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-base font-semibold">Coach AI</span>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-online" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={closeChat}>
          <X size={24} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-end gap-3 pb-4">
            {SUGGESTED_MESSAGES.map((msg) => (
              <button
                key={msg}
                type="button"
                onClick={() => handleSuggestion(msg)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {msg}
              </button>
            ))}
          </div>
        ) : (
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
        )}
      </div>

      <ChatInput onSend={handleSend} isDisabled={isStreaming} />
    </div>
  );
}
