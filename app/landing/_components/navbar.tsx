import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/landing" className="text-lg font-bold text-foreground">
          Fit.ai
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          <a
            href="#sobre"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sobre
          </a>
          <a
            href="#planos"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Planos
          </a>
          <a
            href="#contato"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contato
          </a>
        </nav>
        <Button asChild size="sm">
          <Link href="/auth">Entrar</Link>
        </Button>
      </div>
    </header>
  );
}
