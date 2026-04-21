"use client";

import { Download, Share, PlusSquare, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInstallPrompt } from "@/app/_hooks/use-install-prompt";

export function InstallPromptDialog() {
  const { showPrompt, platform, install, dismiss, canInstallNatively } =
    useInstallPrompt();

  return (
    <Dialog open={showPrompt} onOpenChange={(open) => !open && dismiss()}>
      <DialogContent showCloseButton={false} className="max-w-sm">
        <DialogHeader className="items-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Smartphone className="size-6 text-primary" />
          </div>
          <DialogTitle>Instale o TreinoIA</DialogTitle>
          <DialogDescription className="text-center">
            Adicione o TreinoIA à sua tela inicial para acesso rápido, como um
            app nativo!
          </DialogDescription>
        </DialogHeader>

        {platform === "ios" && <IOSInstructions />}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {canInstallNatively && (
            <Button onClick={install} className="w-full gap-2">
              <Download className="size-4" />
              Instalar agora
            </Button>
          )}
          <Button variant="outline" onClick={dismiss} className="w-full">
            Agora não
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function IOSInstructions() {
  return (
    <div className="space-y-3 rounded-md border border-border bg-muted/50 p-4">
      <p className="text-sm font-medium text-foreground">
        Como instalar no iPhone/iPad:
      </p>
      <ol className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <Share className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            Toque no botão <strong className="text-foreground">Compartilhar</strong> na
            barra do navegador
          </span>
        </li>
        <li className="flex items-start gap-2">
          <PlusSquare className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            Selecione{" "}
            <strong className="text-foreground">Adicionar à Tela Inicial</strong>
          </span>
        </li>
      </ol>
    </div>
  );
}
