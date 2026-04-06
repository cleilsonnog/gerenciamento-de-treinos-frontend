import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-2xl">
      
      {/* Glow mais visível */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 via-transparent to-destructive/20 blur-3xl opacity-70" />

      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        
        {/* Logo com leve destaque */}
        <Link
          href="/landing"
          className="text-lg font-bold tracking-tight text-foreground relative"
        >
          Treino.IA
          <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-primary to-destructive opacity-70 blur-[1px]" />
        </Link>

        {/* Menu com animação mais perceptível */}
        <nav className="hidden items-center gap-6 sm:flex">
          {["Sobre", "Planos", "Contato"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
            >
              {item}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-primary to-destructive transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA com mais presença */}
        <Button
          asChild
          size="sm"
          className="bg-gradient-to-r from-primary to-destructive text-white shadow-md hover:opacity-90"
        >
          <Link href="/auth">Entrar</Link>
        </Button>
      </div>
    </header>
  );
}
