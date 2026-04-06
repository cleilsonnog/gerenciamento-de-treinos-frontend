import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 px-5 py-12 overflow-hidden">
      
      {/* 🔥 Glow de fundo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 sm:flex-row sm:justify-between">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="text-lg font-bold tracking-tight text-foreground">
            Treino.IA
          </span>
          <span className="text-sm text-muted-foreground">
            Seu treino inteligente.
          </span>
        </div>

        {/* Navegação */}
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="#sobre"
            className="text-sm text-muted-foreground transition-all hover:text-foreground hover:-translate-y-0.5"
          >
            Sobre
          </a>
          <a
            href="#planos"
            className="text-sm text-muted-foreground transition-all hover:text-foreground hover:-translate-y-0.5"
          >
            Planos
          </a>
          <a
            href="#contato"
            className="text-sm text-muted-foreground transition-all hover:text-foreground hover:-translate-y-0.5"
          >
            Contato
          </a>
          <Link
            href="/auth"
            className="text-sm font-medium text-foreground hover:opacity-80 transition"
          >
            Entrar
          </Link>
        </nav>

        {/* Copyright */}
        <span className="text-xs text-muted-foreground text-center sm:text-right">
          © {new Date().getFullYear()} Treino.IA. Todos os direitos reservados.
        </span>
      </div>
    </footer>
  );
}