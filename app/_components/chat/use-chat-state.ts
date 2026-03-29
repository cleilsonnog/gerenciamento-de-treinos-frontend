"use client";

import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

export function useChatState() {
  const [chatOpen, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false)
  );
  const [chatInitialMessage, setChatInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault("")
  );

  const openChat = (initialMessage?: string) => {
    if (initialMessage) {
      setChatInitialMessage(initialMessage);
    }
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
    setChatInitialMessage(null);
  };

  return {
    chatOpen,
    chatInitialMessage,
    openChat,
    closeChat,
  };
}
