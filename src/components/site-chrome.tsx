import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Waves, Instagram, MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";

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

const NAV_LINKS = [
  { href: "/#espaco", label: "O espaço" },
  { href: "/#incluso", label: "O que inclui" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#reservar", label: "Reservar" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Brand />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/reservar"
            className="group hidden sm:inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-all"
          >
            Reservar data
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            to="/reservar"
            className="inline-flex sm:hidden items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold shadow-soft active:scale-95 transition-transform"
          >
            Reservar
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="md:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground active:scale-95 transition-transform"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md"
          >
            <div className="flex flex-col px-4 sm:px-6 py-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3.5 text-base font-medium text-foreground border-b border-border/40 last:border-b-0 active:text-primary transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contato" className="mt-16 md:mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-14 grid gap-8 md:gap-10 md:grid-cols-3">
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
