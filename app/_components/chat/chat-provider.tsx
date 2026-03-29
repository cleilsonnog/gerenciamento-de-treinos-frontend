"use client";

import { Suspense } from "react";
import { ChatOverlay } from "./chat-overlay";

export function ChatProvider() {
  return (
    <Suspense>
      <ChatOverlay />
    </Suspense>
  );
}
