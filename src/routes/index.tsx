import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  Wifi,
  Flame,
  Utensils,
  Snowflake,
  ChefHat,
  Waves,
  Sun,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import heroPiscina from "@/assets/hero-piscina.jpg";
import churrasqueira from "@/assets/churrasqueira-piscina.jpg";
import piscinaDia from "@/assets/piscina-dia.jpg";
import piscinaNoite from "@/assets/piscina-noite.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Buganville Garden — Piscina para celebrar em Canguaretama/RN" },
      {
        name: "description",
        content:
          "Piscina, deck e buganvílias em Canguaretama/RN. 12h por R$ 350 com Wi-Fi, churrasqueira, freezer, fogão e mesas. Reserve online.",
      },
      { property: "og:image", content: heroPiscina },
      { property: "twitter:image", content: heroPiscina },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Espaco />
        <Incluso />
        <Galeria />
        <Preco />
        <FAQ />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ------------------------------- Hero ------------------------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="topo" ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <img
          src={heroPiscina}
          alt="Piscina turquesa ao entardecer com buganvílias e fios de luz"
          className="h-[110%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/45 via-primary/25 to-background" />
      </motion.div>

      <motion.div style={{ opacity }} className="mx-auto max-w-7xl px-6 pt-24 pb-40 md:pt-36 md:pb-56">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-background/85 backdrop-blur px-4 py-1.5 text-xs font-medium text-primary shadow-soft"
          >
            <MapPin className="h-3 w-3" /> Canguaretama · Rio Grande do Norte
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[0.98] text-primary-foreground text-balance"
            style={{ textShadow: "0 2px 40px rgba(0,0,0,0.35)" }}
          >
            Água azul, buganvíllea{" "}
            <span className="italic text-accent-foreground bg-accent/70 px-2 rounded-lg">
              e tempo pra celebrar.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-lg text-primary-foreground/90 max-w-lg text-balance"
          >
            Piscina, deck, churrasqueira e mesa de família. Doze horas com o
            espaço inteiro — do primeiro mergulho ao último brinde.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              to="/reservar"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-glow hover:scale-[1.02] active:scale-100 transition-transform"
            >
              Consultar disponibilidade
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#incluso"
              className="inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur px-7 py-4 text-sm font-semibold text-foreground hover:bg-background transition-colors"
            >
              Ver o que está incluso
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 1 }}
            className="mt-14 grid grid-cols-3 gap-4 md:gap-8 max-w-lg"
          >
            {[
              { k: "12h", v: "por diária", icon: Clock },
              { k: "R$ 350", v: "tudo incluso", icon: Sparkles },
              { k: "PIX", v: "ou cartão", icon: null },
            ].map((s) => (
              <div key={s.v} className="text-primary-foreground">
                <dt className="font-display text-3xl md:text-4xl font-semibold leading-none">
                  {s.k}
                </dt>
                <dd className="mt-1.5 text-xs md:text-sm text-primary-foreground/80 uppercase tracking-widest">
                  {s.v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  );
}

/* --------------------------- Marquee --------------------------- */
function Marquee() {
  const items = [
    "Piscina",
    "Wi-Fi grátis",
    "Churrasqueira",
    "Freezer",
    "Fogão",
    "5 mesas de plástico",
    "Mesa de madeira família",
    "Buganvíllea",
    "12h para você",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="border-y border-border/60 bg-primary/95 py-4 overflow-hidden">
      <div className="flex animate-marquee gap-10 whitespace-nowrap text-primary-foreground/90 font-display text-sm md:text-base">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ O espaço ------------------------------ */
function Espaco() {
  return (
    <section id="espaco" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid gap-14 md:grid-cols-2 items-center">
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-ring">
              <img
                src={piscinaDia}
                alt="Piscina com espreguiçadeiras sob ombrelone de palha"
                loading="lazy"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1200ms]"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-8 -right-4 md:-right-8 rounded-2xl bg-card border border-border p-5 shadow-soft max-w-[220px]"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Capacidade</p>
              <p className="mt-1 font-display text-3xl font-semibold">Até 40 pessoas</p>
              <p className="mt-1 text-xs text-muted-foreground">com deck e área coberta</p>
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">O espaço</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-balance">
            Um oásis de piscina para{" "}
            <span className="italic text-accent">celebrar sem pressa.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            No Buganville Garden você tem 12 horas do espaço inteirinho — a piscina
            para os mergulhos, o deck para o sol, a churrasqueira acesa e a mesa
            de família reunindo todo mundo. A gente cuida do lugar, você cuida
            da memória.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              { icon: Waves, t: "Piscina tratada, deck amplo com espreguiçadeiras" },
              { icon: Sun, t: "Diária de 12 horas — o dia e a noite do seu jeito" },
              { icon: Sparkles, t: "Fios de luz e buganvílias floridas para as fotos" },
            ].map((it) => (
              <li key={it.t} className="flex items-start gap-3 text-sm">
                <span className="h-9 w-9 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary">
                  <it.icon className="h-4 w-4" />
                </span>
                <span className="pt-2 text-foreground/90">{it.t}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------- O que está incluso --------------------------- */
function Incluso() {
  const inclusos = [
    { icon: Waves, t: "Piscina + deck", d: "O coração do espaço — tratada e pronta pro mergulho." },
    { icon: Wifi, t: "Wi-Fi grátis", d: "Internet estável para transmitir e postar na hora." },
    { icon: Utensils, t: "5 mesas de plástico", d: "Com cadeiras — perfeitas para dividir grupos." },
    { icon: ChefHat, t: "Mesa de madeira família", d: "A peça central para o brinde coletivo." },
    { icon: Snowflake, t: "Freezer + fogão", d: "Cozinha equipada para receber a turma." },
    { icon: Flame, t: "Churrasqueira", d: "Pronta pra carne — traga só a fome." },
  ];
  return (
    <section id="incluso" className="bg-primary text-primary-foreground py-24 md:py-32 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-leaf/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">Já vem incluso</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-balance max-w-2xl">
            Tudo que sua celebração precisa —{" "}
            <span className="italic">sem letras miúdas.</span>
          </h2>
        </Reveal>

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inclusos.map((it) => (
            <StaggerItem
              key={it.t}
              className="rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 p-6 backdrop-blur hover:bg-primary-foreground/10 transition-colors"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <it.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{it.t}</h3>
              <p className="mt-2 text-sm text-primary-foreground/75 leading-relaxed">{it.d}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2}>
          <div className="mt-14 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent">Adicionais opcionais</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">
                Carvão (5kg) por R$ 20 · Botijão de gás por R$ 50
              </h3>
              <p className="mt-2 text-sm text-primary-foreground/70 max-w-2xl">
                Se preferir, você pode trazer o seu — sem custo extra. Ao reservar,
                escolha se quer que a gente já deixe pronto para você.
              </p>
            </div>
            <Link
              to="/reservar"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-semibold hover:scale-[1.02] transition-transform"
            >
              Escolher adicionais <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Galeria ------------------------------ */
function Galeria() {
  return (
    <section id="galeria" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <Reveal>
          <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">Galeria</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
            De dia e de noite
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-sm text-muted-foreground max-w-sm">
            A água refletindo o azul do céu na tarde e virando turquesa quando as
            luzes da piscina acendem.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-6 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[240px]">
        {[
          { src: heroPiscina, alt: "Piscina ao entardecer", span: "col-span-6 md:col-span-4 row-span-2" },
          { src: piscinaDia, alt: "Piscina durante o dia", span: "col-span-3 md:col-span-2 row-span-2" },
          { src: churrasqueira, alt: "Churrasqueira ao lado da piscina", span: "col-span-3 md:col-span-3" },
          { src: piscinaNoite, alt: "Piscina iluminada à noite", span: "col-span-3 md:col-span-3" },
        ].map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`overflow-hidden rounded-2xl group ${img.span}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1400ms] ease-out"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- Preço ------------------------------- */
function Preco() {
  return (
    <section id="reservar" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">Investimento</p>
          <h2 className="mt-3 font-display text-4xl md:text-6xl font-semibold text-balance">
            Uma diária. <span className="italic text-accent">Tudo incluso.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Sem taxas escondidas, sem pacote confuso. Você reserva, paga online e vem celebrar.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="relative mt-14 rounded-[2rem] overflow-hidden gradient-garden text-primary-foreground p-10 md:p-16 shadow-glow">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl animate-float" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-leaf/30 blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent-foreground bg-accent/80 inline-block px-3 py-1 rounded-full">
                Diária única
              </p>
              <h3 className="mt-5 font-display text-3xl md:text-4xl font-semibold">
                12 horas no Buganville Garden
              </h3>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-7xl md:text-8xl font-semibold leading-none">
                  R$ 350
                </span>
              </div>
              <p className="mt-2 text-primary-foreground/80">
                pagamento à vista via PIX ou cartão
              </p>
            </div>

            <div>
              <ul className="space-y-3 text-sm">
                {[
                  "Piscina + deck com espreguiçadeiras",
                  "Wi-Fi grátis",
                  "5 mesas de plástico com cadeiras",
                  "1 mesa de madeira tamanho família",
                  "Freezer, fogão e churrasqueira",
                  "Confirmação instantânea após o pagamento",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-accent grid place-items-center text-accent-foreground text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-primary-foreground/90">{t}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/reservar"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground py-4 text-sm font-semibold hover:scale-[1.02] active:scale-100 transition-transform"
              >
                Reservar minha data <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------- FAQ ------------------------------- */
function FAQ() {
  const perguntas = [
    {
      p: "Como funciona a reserva?",
      r: "Você escolhe a data, os adicionais (se quiser) e é redirecionado para pagar via PIX ou cartão. Assim que o pagamento é confirmado, sua reserva fica garantida — você recebe um link privado para acompanhar tudo.",
    },
    {
      p: "Preciso pagar tudo na hora?",
      r: "Sim, a reserva é confirmada com o pagamento integral da diária de R$ 350. Isso garante que a sua data fique bloqueada para você.",
    },
    {
      p: "Posso trazer meu próprio carvão e gás?",
      r: "Claro! Os adicionais de carvão (R$ 20) e botijão de gás (R$ 50) são opcionais — só marque no formulário se quiser encontrar tudo pronto.",
    },
    {
      p: "A piscina está sempre pronta?",
      r: "Sim, a piscina fica tratada e limpa para cada reserva. Recomendamos trazer toalha e traje de banho — o resto é com a gente.",
    },
    {
      p: "Posso ir conhecer antes?",
      r: "Claro, marque uma visita pelo WhatsApp (+55 84 99400-0233) e a gente combina um horário.",
    },
  ];
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 md:py-32">
      <Reveal>
        <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">Ainda em dúvida?</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
          Perguntas frequentes
        </h2>
      </Reveal>
      <div className="mt-10 space-y-3">
        {perguntas.map((q, i) => (
          <Reveal key={q.p} delay={i * 0.05}>
            <details className="group rounded-2xl border border-border bg-card p-6 open:shadow-soft transition-shadow">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="font-display text-lg font-semibold">{q.p}</span>
                <span className="h-8 w-8 shrink-0 rounded-full bg-secondary grid place-items-center text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{q.r}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
