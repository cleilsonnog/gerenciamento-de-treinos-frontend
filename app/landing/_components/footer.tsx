import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-5 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="text-lg font-bold text-foreground">Treino.IA</span>
          <span className="text-sm text-muted-foreground">
            Seu treino inteligente.
          </span>
        </div>
        <nav className="flex gap-6">
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
          <Link
            href="/auth"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Entrar
          </Link>
        </nav>
        <span className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Treino.IA. Todos os direitos
          reservados.
        </span>
      </div>
    </footer>
  );
}
