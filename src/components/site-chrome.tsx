import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Waves, Instagram, MessageCircle } from "lucide-react";

export function Brand({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <motion.span
        whileHover={{ rotate: -12, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`${dim} rounded-full gradient-garden grid place-items-center text-primary-foreground shadow-soft`}
      >
        <Waves className="h-4 w-4" strokeWidth={2.2} />
      </motion.span>
      <span className="font-display text-lg font-semibold tracking-tight leading-none">
        Buganville
        <span className="italic text-accent"> Garden</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60"
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Brand />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#espaco" className="hover:text-foreground transition-colors">O espaço</a>
          <a href="/#incluso" className="hover:text-foreground transition-colors">O que inclui</a>
          <a href="/#galeria" className="hover:text-foreground transition-colors">Galeria</a>
          <a href="/#reservar" className="hover:text-foreground transition-colors">Reservar</a>
        </nav>
        <Link
          to="/reservar"
          className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-all"
        >
          Reservar data
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contato" className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Brand />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Piscina, deck e buganvílias — 12 horas do espaço inteiro para você
            celebrar em ritmo de férias.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-display text-base font-semibold mb-3">Fale com a gente</h4>
          <a
            href="https://wa.me/5584994000233"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> +55 84 99400-0233
          </a>
          <a
            href="https://instagram.com/buganville.garden"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Instagram className="h-4 w-4" /> @buganville.garden
          </a>
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-display text-base font-semibold mb-3">Onde estamos</h4>
          <p className="text-muted-foreground leading-relaxed">
            BR 101, antiga EMPARN,
            <br />
            depois do IFRN — Canguaretama/RN
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Buganville Garden — feito com cuidado no interior do RN.
      </div>
    </footer>
  );
}
