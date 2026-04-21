"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "pwa-install-dismissed-at";
const DISMISS_DAYS = 7;

function isDismissed(): boolean {
  const dismissedAt = localStorage.getItem(STORAGE_KEY);
  if (!dismissedAt) return false;
  const diff = Date.now() - Number(dismissedAt);
  return diff < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as { standalone: boolean }).standalone === true)
  );
}

function detectPlatform(): "android" | "ios" | "desktop" {
  if (isIOS()) return "ios";
  if (/Android/i.test(navigator.userAgent)) return "android";
  return "desktop";
}

let installPromptEvent: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function subscribeToInstallPrompt(callback: () => void) {
  listeners.add(callback);

  if (listeners.size === 1) {
    window.addEventListener("beforeinstallprompt", handlePrompt);
  }

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
    }
  };
}

function handlePrompt(e: Event) {
  e.preventDefault();
  installPromptEvent = e as BeforeInstallPromptEvent;
  listeners.forEach((cb) => cb());
}

function getInstallPromptSnapshot() {
  return installPromptEvent;
}

export function useInstallPrompt() {
  const deferredPrompt = useSyncExternalStore(
    subscribeToInstallPrompt,
    getInstallPromptSnapshot,
    () => null
  );

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    return isDismissed() || isStandalone();
  });

  const platform = typeof window === "undefined" ? "desktop" : detectPlatform();
  const canInstallNatively = !!deferredPrompt;
  const showPrompt = !dismissed && (canInstallNatively || platform === "ios");

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDismissed(true);
    }
    installPromptEvent = null;
    listeners.forEach((cb) => cb());
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setDismissed(true);
  }, []);

  return {
    showPrompt,
    platform,
    install,
    dismiss,
    canInstallNatively,
  };
}
