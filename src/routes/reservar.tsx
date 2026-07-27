import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Calendar,
  Loader2,
  Plus,
  Minus,
  User,
  Phone,
  Mail,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ApiError, criarReserva, listarAdicionais, listarLocais } from "@/lib/api";
import { formatarReal } from "@/lib/reservas";
import { Reveal } from "@/components/motion-primitives";

export const Route = createFileRoute("/reservar")({
  head: () => ({
    meta: [
      { title: "Reservar sua data — Buganville Garden" },
      {
        name: "description",
        content:
          "Escolha o dia, personalize com adicionais e garanta sua reserva de 12h por R$ 350.",
      },
    ],
  }),
  component: ReservarPage,
});

interface AdicionalSelecionado {
  id: number;
  quantidade: number;
}

function ReservarPage() {
  const [redirecionando, setRedirecionando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const locaisQuery = useQuery({ queryKey: ["locais"], queryFn: listarLocais });
  const adicionaisQuery = useQuery({ queryKey: ["adicionais"], queryFn: listarAdicionais });

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [localId, setLocalId] = useState<number | null>(null);
  const [dataReserva, setDataReserva] = useState("");
  const [horaInicio, setHoraInicio] = useState("10:00");
  const [adicionais, setAdicionais] = useState<AdicionalSelecionado[]>([]);

  const locais = locaisQuery.data ?? [];
  const listaAdicionais = adicionaisQuery.data ?? [];
  const localEscolhido = locais.find((l) => l.id === localId);

  // seleciona o primeiro local automaticamente
  useEffect(() => {
    if (localId == null && locais.length > 0) setLocalId(locais[0].id);
  }, [locais, localId]);

  const total = useMemo(() => {
    const base = localEscolhido?.precoBase ?? 0;
    const extras = adicionais.reduce((s, sel) => {
      const item = listaAdicionais.find((a) => a.id === sel.id);
      return s + (item?.preco ?? 0) * sel.quantidade;
    }, 0);
    return base + extras;
  }, [localEscolhido, adicionais, listaAdicionais]);

  function ajustarAdicional(id: number, delta: number) {
    setAdicionais((prev) => {
      const existente = prev.find((p) => p.id === id);
      if (!existente && delta > 0) return [...prev, { id, quantidade: 1 }];
      if (!existente) return prev;
      const nova = existente.quantidade + delta;
      if (nova <= 0) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantidade: nova } : p));
    });
  }
  const qtd = (id: number) => adicionais.find((a) => a.id === id)?.quantidade ?? 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim() || !telefone.trim() || !localId || !dataReserva) {
      toast.error("Preencha nome, telefone, data e local.");
      return;
    }

    // Diária de 12h: início na hora escolhida, fim 12h depois
    const inicio = new Date(`${dataReserva}T${horaInicio}:00`);
    const fim = new Date(inicio.getTime() + 12 * 60 * 60 * 1000);
    if (Number.isNaN(inicio.getTime())) {
      toast.error("Data inválida.");
      return;
    }

    setEnviando(true);
    try {
      const resposta = await criarReserva({
        localId,
        dataInicio: inicio.toISOString(),
        dataFim: fim.toISOString(),
        nomeCliente: nome.trim(),
        telefoneCliente: telefone.trim(),
        emailCliente: email.trim() || undefined,
        adicionais: adicionais.map((a) => ({ adicionalId: a.id, quantidade: a.quantidade })),
      });
      setRedirecionando(true);
      toast.success("Reserva criada! Abrindo o WhatsApp para combinar o pagamento...");
      setTimeout(() => {
        window.location.href = resposta.checkoutUrl;
      }, 900);
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Não foi possível conectar ao servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
        <Reveal>
          <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">Nova reserva</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold text-balance">
            {redirecionando ? "Abrindo o WhatsApp..." : "Escolha o dia perfeito"}
          </h1>
          {!redirecionando && (
            <p className="mt-3 text-muted-foreground max-w-xl">
              Preencha os dados abaixo. A diária tem 12 horas — você escolhe o horário de início.
            </p>
          )}
        </Reveal>

        <AnimatePresence mode="wait">
          {redirecionando ? (
            <motion.div
              key="redirect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 rounded-3xl bg-card border border-border p-12 text-center shadow-soft"
            >
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-5 text-muted-foreground">
                Estamos abrindo o WhatsApp para você combinar o pagamento com o responsável. Aguarde alguns instantes.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="mt-10 grid gap-6 lg:grid-cols-3"
            >
              <div className="lg:col-span-2 space-y-6">
                <Card title="Seus dados" icon={<User className="h-4 w-4" />}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Nome completo"
                      value={nome}
                      onChange={setNome}
                      required
                      icon={<User className="h-4 w-4" />}
                    />
                    <Field
                      label="WhatsApp"
                      value={telefone}
                      onChange={setTelefone}
                      required
                      placeholder="(84) 9 9999-9999"
                      icon={<Phone className="h-4 w-4" />}
                    />
                    <Field
                      label="Email (opcional)"
                      value={email}
                      onChange={setEmail}
                      type="email"
                      className="sm:col-span-2"
                      icon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                </Card>

                <Card title="Data e horário" icon={<Calendar className="h-4 w-4" />}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Data"
                      value={dataReserva}
                      onChange={setDataReserva}
                      type="date"
                      required
                    />
                    <div>
                      <label className="text-sm font-medium">Horário de início</label>
                      <select
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      >
                        {["08:00", "09:00", "10:00", "12:00", "14:00", "16:00", "18:00"].map(
                          (h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          )
                        )}
                      </select>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Reserva termina 12h depois — até{" "}
                        <strong>
                          {(() => {
                            const [h] = horaInicio.split(":");
                            return `${(Number(h) + 12) % 24}:${horaInicio.split(":")[1]}`;
                          })()}
                        </strong>
                        .
                      </p>
                    </div>
                  </div>

                  {locaisQuery.isLoading ? (
                    <p className="mt-4 text-sm text-muted-foreground">Carregando locais...</p>
                  ) : locais.length > 1 ? (
                    <div className="mt-6 grid gap-2">
                      {locais.map((l) => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => setLocalId(l.id)}
                          className={`rounded-xl border p-4 text-left transition-all ${
                            localId === l.id
                              ? "border-primary bg-primary/5 shadow-soft"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <p className="font-display text-lg font-semibold">{l.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatarReal(l.precoBase)} · 12h
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </Card>

                <Card title="Adicionais opcionais" icon={<Sparkles className="h-4 w-4" />}>
                  {adicionaisQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  )}
                  <div className="grid gap-3">
                    {listaAdicionais.map((a) => {
                      const q = qtd(a.id);
                      const ativo = q > 0;
                      return (
                        <motion.div
                          key={a.id}
                          layout
                          className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
                            ativo ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold">{a.nome}</p>
                            {a.descricao && (
                              <p className="text-xs text-muted-foreground mt-0.5">{a.descricao}</p>
                            )}
                            <p className="text-xs mt-1 text-accent font-medium">
                              +{formatarReal(a.preco)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => ajustarAdicional(a.id, -1)}
                              disabled={q === 0}
                              className="h-9 w-9 rounded-full bg-secondary grid place-items-center disabled:opacity-40 hover:bg-primary hover:text-primary-foreground transition-colors"
                              aria-label="Diminuir"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-6 text-center font-semibold tabular-nums">{q}</span>
                            <button
                              type="button"
                              onClick={() => ajustarAdicional(a.id, 1)}
                              className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center hover:shadow-glow transition-shadow"
                              aria-label="Aumentar"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                    {!adicionaisQuery.isLoading && listaAdicionais.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Nenhum adicional cadastrado no momento.
                      </p>
                    )}
                  </div>
                </Card>
              </div>

              <aside className="lg:col-span-1">
                <motion.div
                  layout
                  className="sticky top-24 rounded-3xl bg-card border border-border p-6 shadow-soft"
                >
                  <h3 className="font-display text-xl font-semibold">Resumo</h3>
                  <dl className="mt-4 space-y-2 text-sm">
                    <Row k={localEscolhido?.nome ?? "Diária"} v={formatarReal(localEscolhido?.precoBase ?? 0)} />
                    <AnimatePresence>
                      {adicionais.map((sel) => {
                        const a = listaAdicionais.find((x) => x.id === sel.id);
                        if (!a) return null;
                        return (
                          <motion.div
                            key={sel.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Row
                              k={`${a.nome} × ${sel.quantidade}`}
                              v={formatarReal(a.preco * sel.quantidade)}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </dl>
                  <div className="mt-4 border-t border-border pt-4">
                    <Row k="Total" v={formatarReal(total)} bold />
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    className="group mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground py-4 text-sm font-semibold hover:scale-[1.02] active:scale-100 disabled:opacity-60 transition-transform"
                  >
                    {enviando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                      </>
                    ) : (
                      <>
                        Continuar para o pagamento
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-xs text-muted-foreground text-center leading-relaxed">
                    Você será direcionado ao WhatsApp para combinar o pagamento.
                    Sua reserva só é confirmada após a confirmação do responsável.
                  </p>
                </motion.div>
              </aside>
            </motion.form>
          )}
        </AnimatePresence>
      </main>

      <SiteFooter />
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-card border border-border p-6 md:p-8">
      <div className="flex items-center gap-2 mb-5">
        {icon && (
          <span className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center">
            {icon}
          </span>
        )}
        <h2 className="font-display text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1.5">
        {icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-input bg-background py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={bold ? "font-semibold" : "text-muted-foreground"}>{k}</dt>
      <dd className={bold ? "font-display text-lg font-semibold" : ""}>{v}</dd>
    </div>
  );
}
