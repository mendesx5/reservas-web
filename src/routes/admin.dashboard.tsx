import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Sparkles,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  X,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { isAdminAuthed, logoutAdmin } from "@/lib/admin-auth";
import {
  atualizarAdicional,
  atualizarLocal,
  buscarResumoFinanceiro,
  cancelarReserva,
  confirmarPagamentoReserva,
  criarAdicional,
  criarLocal,
  desativarAdicional,
  desativarLocal,
  listarAdicionaisAdmin,
  listarLocaisAdmin,
  listarReservasAdmin,
  type AdicionalPayload,
  type LocalPayload,
} from "@/lib/api";
import {
  formatarReal,
  labelStatus,
  type Adicional,
  type Local,
  type ReservaStatus,
} from "@/lib/reservas";
import { Brand } from "@/components/site-chrome";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel — Buganville Garden" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type Aba = "visao" | "agenda" | "reservas" | "adicionais" | "locais";

function Dashboard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [aba, setAba] = useState<Aba>("visao");

  useEffect(() => {
    if (!isAdminAuthed()) {
      navigate({ to: "/admin" });
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Brand size="sm" />
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground">
              Ver site
            </Link>
            <button
              onClick={() => {
                logoutAdmin();
                navigate({ to: "/admin" });
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 px-4 py-2 font-medium transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <Tabs aba={aba} setAba={setAba} />
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {aba === "visao" && <TabWrap key="v"><VisaoGeral /></TabWrap>}
            {aba === "agenda" && <TabWrap key="ag"><Agenda /></TabWrap>}
            {aba === "reservas" && <TabWrap key="r"><Reservas /></TabWrap>}
            {aba === "adicionais" && <TabWrap key="a"><Adicionais /></TabWrap>}
            {aba === "locais" && <TabWrap key="l"><Locais /></TabWrap>}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

function TabWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

function Tabs({ aba, setAba }: { aba: Aba; setAba: (a: Aba) => void }) {
  const tabs: { id: Aba; label: string; icon: React.ElementType }[] = [
    { id: "visao", label: "Visão geral", icon: LayoutDashboard },
    { id: "agenda", label: "Agenda", icon: CalendarDays },
    { id: "reservas", label: "Reservas", icon: CalendarCheck },
    { id: "adicionais", label: "Adicionais", icon: Sparkles },
    { id: "locais", label: "Locais", icon: MapPin },
  ];

  return (
    <div className="inline-flex gap-1 rounded-full bg-card border border-border p-1 shadow-soft">
      {tabs.map((t) => {
        const active = aba === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setAba(t.id)}
            className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <t.icon className="relative h-4 w-4" />
            <span className="relative">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================== VISÃO GERAL ============================== */
function VisaoGeral() {
  const [periodo, setPeriodo] = useState<"diario" | "semanal" | "mensal">("mensal");
  const resumoQuery = useQuery({
    queryKey: ["admin-financeiro", periodo],
    queryFn: () => buscarResumoFinanceiro(periodo),
  });
  const r = resumoQuery.data;

  return (
    <section>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">Financeiro</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Visão geral</h2>
        </div>
        <div className="inline-flex gap-1 rounded-full bg-card border border-border p-1">
          {(["diario", "semanal", "mensal"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors capitalize ${
                periodo === p ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Recebido" value={formatarReal(r?.totalRecebido ?? 0)} accent />
        <StatCard label="Aguardando" value={formatarReal(r?.totalPendente ?? 0)} />
        <StatCard label="Confirmadas" value={String(r?.qtdConfirmadas ?? 0)} />
        <StatCard label="Expiradas" value={String(r?.qtdExpiradas ?? 0)} />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-display text-xl font-semibold">Faturamento por adicional</h3>
          <div className="mt-4 space-y-3">
            {(r?.faturamentoPorAdicional ?? []).map((i) => (
              <div key={i.chave} className="flex items-center justify-between text-sm">
                <span>{i.chave}</span>
                <span className="font-semibold">{formatarReal(i.valor)}</span>
              </div>
            ))}
            {(r?.faturamentoPorAdicional ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Sem vendas no período.</p>
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-display text-xl font-semibold">Método de pagamento</h3>
          <div className="mt-4 space-y-3">
            {(r?.faturamentoPorMetodoPagamento ?? []).map((i) => (
              <div key={i.chave} className="flex items-center justify-between text-sm">
                <span className="capitalize">{i.chave.toLowerCase()}</span>
                <span className="font-semibold">{formatarReal(i.valor)}</span>
              </div>
            ))}
            {(r?.faturamentoPorMetodoPagamento ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Sem pagamentos no período.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl p-6 border ${
        accent
          ? "gradient-garden text-primary-foreground border-transparent shadow-glow"
          : "bg-card border-border"
      }`}
    >
      <p
        className={`text-xs uppercase tracking-[0.2em] ${
          accent ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
    </motion.div>
  );
}

/* ============================== AGENDA ============================== */
function Agenda() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState<Date | null>(null);

  const reservasQuery = useQuery({
    queryKey: ["admin-reservas", "todas"],
    queryFn: () => listarReservasAdmin(),
  });

  const reservas = (reservasQuery.data ?? []).filter(
    (r) => r.status === "CONFIRMADA" || r.status === "AGUARDANDO_PAGAMENTO"
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay(); // 0 = Dom
  const daysInMonth = lastDay.getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  function reservasNoDia(d: Date) {
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return reservas.filter((r) => {
      const ri = new Date(r.dataInicio);
      const rf = new Date(r.dataFim);
      return ri <= end && rf >= start;
    });
  }

  const monthLabel = cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const selDia = selected ? reservasNoDia(selected) : [];

  return (
    <section>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">Agenda</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Dias livres e reservados</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique num dia para ver os detalhes das reservas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="h-9 w-9 rounded-full bg-card border border-border grid place-items-center hover:bg-secondary transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-display text-lg font-semibold capitalize min-w-[180px] text-center">
            {monthLabel}
          </span>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="h-9 w-9 rounded-full bg-card border border-border grid place-items-center hover:bg-secondary transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-leaf/50" /> Livre
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent" /> Confirmada
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-terracotta/70" /> Aguardando pagamento
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl bg-card border border-border p-4 md:p-6 shadow-soft">
          <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-[10px] md:text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 md:gap-2 mt-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} className="aspect-square" />;
              const items = reservasNoDia(d);
              const confirmada = items.some((r) => r.status === "CONFIRMADA");
              const aguardando = items.some((r) => r.status === "AGUARDANDO_PAGAMENTO");
              const isPast = d < hoje;
              const isSelected =
                selected && selected.toDateString() === d.toDateString();

              const base =
                "relative aspect-square rounded-xl md:rounded-2xl p-1.5 md:p-2 text-left text-xs md:text-sm transition-all flex flex-col";
              let tone = "bg-leaf/10 hover:bg-leaf/20 text-foreground";
              if (confirmada) tone = "bg-accent text-accent-foreground hover:brightness-110";
              else if (aguardando) tone = "bg-terracotta/60 text-primary-foreground hover:brightness-105";
              if (isPast && items.length === 0) tone = "bg-secondary/60 text-muted-foreground";
              if (isSelected) tone += " ring-2 ring-primary ring-offset-2 ring-offset-background";

              return (
                <motion.button
                  key={i}
                  layout
                  whileHover={{ y: -2 }}
                  onClick={() => setSelected(d)}
                  className={`${base} ${tone}`}
                >
                  <span className="font-display text-base md:text-lg font-semibold leading-none">
                    {d.getDate()}
                  </span>
                  {items.length > 0 && (
                    <span className="mt-auto text-[9px] md:text-[10px] font-semibold uppercase tracking-wider opacity-90">
                      {items.length} reserva{items.length > 1 ? "s" : ""}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl bg-card border border-border p-6 shadow-soft h-fit">
          {!selected && (
            <div className="text-sm text-muted-foreground">
              <CalendarDays className="h-8 w-8 text-primary/40 mb-3" />
              Selecione um dia para ver o que está agendado.
            </div>
          )}
          {selected && (
            <>
              <p className="text-xs uppercase tracking-widest text-accent">
                {selected.toLocaleDateString("pt-BR", { weekday: "long" })}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {selected.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
              </p>
              <div className="mt-5 space-y-3">
                {selDia.length === 0 && (
                  <div className="rounded-xl bg-leaf/10 text-leaf p-4 text-sm font-semibold">
                    Livre — nenhum evento marcado.
                  </div>
                )}
                {selDia.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{r.nomeCliente}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.telefoneCliente}</p>
                    <p className="mt-2 text-xs">
                      {new Date(r.dataInicio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      {" → "}
                      {new Date(r.dataFim).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold">{formatarReal(r.valorTotal)}</span>
                      {r.adicionais.length > 0 ? (
                        <span className="text-[10px] uppercase tracking-wider bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                          {r.adicionais.length} adicional{r.adicionais.length > 1 ? "is" : ""}
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          sem adicional
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

/* ============================== RESERVAS ============================== */

function Reservas() {
  const qc = useQueryClient();
  const [filtro, setFiltro] = useState<"todas" | ReservaStatus>("todas");
  const [adicionalFilter, setAdicionalFilter] = useState<"todos" | "com" | "sem">("todos");
  const reservasQuery = useQuery({
    queryKey: ["admin-reservas", filtro],
    queryFn: () => listarReservasAdmin(filtro === "todas" ? undefined : filtro),
  });

  const cancelMut = useMutation({
    mutationFn: cancelarReserva,
    onSuccess: () => {
      toast.success("Reserva cancelada.");
      qc.invalidateQueries({ queryKey: ["admin-reservas"] });
      qc.invalidateQueries({ queryKey: ["admin-financeiro"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const confirmMut = useMutation({
    mutationFn: confirmarPagamentoReserva,
    onSuccess: () => {
      toast.success("Pagamento confirmado.");
      qc.invalidateQueries({ queryKey: ["admin-reservas"] });
      qc.invalidateQueries({ queryKey: ["admin-financeiro"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reservas = (reservasQuery.data ?? []).filter((r) => {
    if (adicionalFilter === "com") return r.adicionais.length > 0;
    if (adicionalFilter === "sem") return r.adicionais.length === 0;
    return true;
  });


  return (
    <section>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">Reservas</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Fila e histórico</h2>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["todas", "AGUARDANDO_PAGAMENTO", "CONFIRMADA", "EXPIRADA", "CANCELADA", "CONCLUIDA"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filtro === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:bg-secondary"
                }`}
              >
                {f === "todas" ? "Todas" : labelStatus(f as ReservaStatus)}
              </button>
            )
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground uppercase tracking-widest">Adicionais:</span>
        {(["todos", "com", "sem"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setAdicionalFilter(f)}
            className={`rounded-full px-3 py-1 font-semibold transition-colors ${
              adicionalFilter === f
                ? "bg-accent text-accent-foreground"
                : "bg-card border border-border hover:bg-secondary"
            }`}
          >
            {f === "todos" ? "Todos" : f === "com" ? "Com adicional" : "Sem adicional"}
          </button>
        ))}
      </div>


      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Reserva</th>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Data</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Pagamento</th>
                <th className="text-left px-4 py-3">Adicionais</th>

                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservasQuery.isLoading && (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              )}
              {!reservasQuery.isLoading && reservas.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                    Nenhuma reserva encontrada.
                  </td>
                </tr>
              )}
              {reservas.map((r) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-border hover:bg-secondary/30"
                >
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs">#{r.id}</div>
                    <Link
                      to="/reserva/$codigoAcesso"
                      params={{ codigoAcesso: r.codigoAcesso }}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      link do cliente <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.nomeCliente}</div>
                    <div className="text-xs text-muted-foreground">{r.telefoneCliente}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {new Date(r.dataInicio).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatarReal(r.valorTotal)}
                  </td>
                  <td className="px-4 py-3 text-xs">{r.metodoPagamento ?? "—"}</td>
                  <td className="px-4 py-3">
                    {r.adicionais.length === 0 ? (
                      <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        nenhum
                      </span>
                    ) : (
                      <ul className="space-y-1 text-xs text-accent">
                        {r.adicionais.map((a, index) => (
                          <li key={`${a.nome}-${index}`}>
                            {a.quantidade}x {a.nome}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "AGUARDANDO_PAGAMENTO" && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Confirmar o pagamento da reserva #${r.id}?`)) confirmMut.mutate(r.id);
                          }}
                          className="rounded-full bg-leaf/10 text-leaf px-3 py-1 text-xs font-semibold hover:bg-leaf/20"
                        >
                          Confirmar pagamento
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Cancelar reserva #${r.id}?`)) cancelMut.mutate(r.id);
                          }}
                          className="rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs font-semibold hover:bg-destructive/20"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: ReservaStatus }) {
  const map: Record<ReservaStatus, string> = {
    AGUARDANDO_PAGAMENTO: "bg-accent/15 text-accent",
    CONFIRMADA: "bg-leaf/15 text-leaf",
    CANCELADA: "bg-destructive/10 text-destructive",
    EXPIRADA: "bg-muted text-muted-foreground",
    CONCLUIDA: "bg-primary/10 text-primary",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}>
      {labelStatus(status)}
    </span>
  );
}

/* ============================== ADICIONAIS ============================== */
function Adicionais() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-adicionais"], queryFn: listarAdicionaisAdmin });
  const [editando, setEditando] = useState<Adicional | null>(null);
  const [novo, setNovo] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-adicionais"] });
    qc.invalidateQueries({ queryKey: ["adicionais"] });
  };

  const createMut = useMutation({
    mutationFn: criarAdicional,
    onSuccess: () => {
      toast.success("Adicional criado.");
      invalidate();
      setNovo(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdicionalPayload }) =>
      atualizarAdicional(id, data),
    onSuccess: () => {
      toast.success("Adicional atualizado.");
      invalidate();
      setEditando(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const deleteMut = useMutation({
    mutationFn: desativarAdicional,
    onSuccess: () => {
      toast.success("Adicional desativado.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = q.data ?? [];

  return (
    <section>
      <Header
        titulo="Adicionais"
        sub="Itens opcionais que o cliente pode escolher ao reservar"
        onNovo={() => setNovo(true)}
      />

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {items.map((a) => (
          <motion.div
            key={a.id}
            layout
            className="rounded-2xl bg-card border border-border p-5 flex justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-lg font-semibold">{a.nome}</p>
                {!a.ativo && (
                  <span className="text-[10px] uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Inativo
                  </span>
                )}
              </div>
              {a.descricao && (
                <p className="text-sm text-muted-foreground mt-1">{a.descricao}</p>
              )}
              <p className="mt-2 text-sm font-semibold text-accent">{formatarReal(a.preco)}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setEditando(a)}
                className="h-8 w-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground grid place-items-center transition-colors"
                aria-label="Editar"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Desativar "${a.nome}"?`)) deleteMut.mutate(a.id);
                }}
                className="h-8 w-8 rounded-full bg-secondary hover:bg-destructive hover:text-destructive-foreground grid place-items-center transition-colors"
                aria-label="Desativar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
        {!q.isLoading && items.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-2">Nenhum adicional cadastrado.</p>
        )}
      </div>

      <AnimatePresence>
        {(novo || editando) && (
          <AdicionalModal
            atual={editando ?? undefined}
            onClose={() => {
              setNovo(false);
              setEditando(null);
            }}
            onSalvar={(data) => {
              if (editando) updateMut.mutate({ id: editando.id, data });
              else createMut.mutate(data);
            }}
            salvando={createMut.isPending || updateMut.isPending}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function AdicionalModal({
  atual,
  onClose,
  onSalvar,
  salvando,
}: {
  atual?: Adicional;
  onClose: () => void;
  onSalvar: (p: AdicionalPayload) => void;
  salvando: boolean;
}) {
  const [nome, setNome] = useState(atual?.nome ?? "");
  const [descricao, setDescricao] = useState(atual?.descricao ?? "");
  const [preco, setPreco] = useState(atual?.preco?.toString() ?? "");
  return (
    <ModalShell titulo={atual ? "Editar adicional" : "Novo adicional"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSalvar({ nome, descricao: descricao || undefined, preco: Number(preco) });
        }}
        className="space-y-4"
      >
        <ModalField label="Nome" value={nome} onChange={setNome} required />
        <ModalField label="Descrição" value={descricao} onChange={setDescricao} textarea />
        <ModalField label="Preço (R$)" value={preco} onChange={setPreco} type="number" required />
        <SaveButton salvando={salvando} />
      </form>
    </ModalShell>
  );
}

/* ============================== LOCAIS ============================== */
function Locais() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-locais"], queryFn: listarLocaisAdmin });
  const [editando, setEditando] = useState<Local | null>(null);
  const [novo, setNovo] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-locais"] });
    qc.invalidateQueries({ queryKey: ["locais"] });
  };

  const createMut = useMutation({
    mutationFn: criarLocal,
    onSuccess: () => {
      toast.success("Local criado.");
      invalidate();
      setNovo(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LocalPayload }) => atualizarLocal(id, data),
    onSuccess: () => {
      toast.success("Local atualizado.");
      invalidate();
      setEditando(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const deleteMut = useMutation({
    mutationFn: desativarLocal,
    onSuccess: () => {
      toast.success("Local desativado.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = q.data ?? [];

  return (
    <section>
      <Header
        titulo="Locais"
        sub="Os espaços disponíveis para reserva (ex: diária de 12h por R$ 350)"
        onNovo={() => setNovo(true)}
      />

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {items.map((l) => (
          <motion.div
            key={l.id}
            layout
            className="rounded-2xl bg-card border border-border p-5 flex justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-lg font-semibold">{l.nome}</p>
                {!l.ativo && (
                  <span className="text-[10px] uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Inativo
                  </span>
                )}
              </div>
              {l.descricao && <p className="text-sm text-muted-foreground mt-1">{l.descricao}</p>}
              <p className="mt-2 text-sm font-semibold text-accent">
                {formatarReal(l.precoBase)}
                {l.capacidadeMax ? ` · até ${l.capacidadeMax} pessoas` : ""}
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setEditando(l)}
                className="h-8 w-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground grid place-items-center transition-colors"
                aria-label="Editar"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Desativar "${l.nome}"?`)) deleteMut.mutate(l.id);
                }}
                className="h-8 w-8 rounded-full bg-secondary hover:bg-destructive hover:text-destructive-foreground grid place-items-center transition-colors"
                aria-label="Desativar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
        {!q.isLoading && items.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-2">Nenhum local cadastrado.</p>
        )}
      </div>

      <AnimatePresence>
        {(novo || editando) && (
          <LocalModal
            atual={editando ?? undefined}
            onClose={() => {
              setNovo(false);
              setEditando(null);
            }}
            onSalvar={(data) => {
              if (editando) updateMut.mutate({ id: editando.id, data });
              else createMut.mutate(data);
            }}
            salvando={createMut.isPending || updateMut.isPending}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function LocalModal({
  atual,
  onClose,
  onSalvar,
  salvando,
}: {
  atual?: Local;
  onClose: () => void;
  onSalvar: (p: LocalPayload) => void;
  salvando: boolean;
}) {
  const [nome, setNome] = useState(atual?.nome ?? "");
  const [descricao, setDescricao] = useState(atual?.descricao ?? "");
  const [preco, setPreco] = useState(atual?.precoBase?.toString() ?? "");
  const [cap, setCap] = useState(atual?.capacidadeMax?.toString() ?? "");
  return (
    <ModalShell titulo={atual ? "Editar local" : "Novo local"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSalvar({
            nome,
            descricao: descricao || undefined,
            precoBase: Number(preco),
            capacidadeMax: cap ? Number(cap) : undefined,
          });
        }}
        className="space-y-4"
      >
        <ModalField label="Nome" value={nome} onChange={setNome} required />
        <ModalField label="Descrição" value={descricao} onChange={setDescricao} textarea />
        <div className="grid grid-cols-2 gap-3">
          <ModalField label="Preço base (R$)" value={preco} onChange={setPreco} type="number" required />
          <ModalField label="Capacidade máx." value={cap} onChange={setCap} type="number" />
        </div>
        <SaveButton salvando={salvando} />
      </form>
    </ModalShell>
  );
}

/* ============================== UI HELPERS ============================== */
function Header({
  titulo,
  sub,
  onNovo,
}: {
  titulo: string;
  sub: string;
  onNovo: () => void;
}) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">Gestão</p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">{titulo}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      </div>
      <button
        onClick={onNovo}
        className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:shadow-glow transition-all"
      >
        <Plus className="h-4 w-4" /> Novo
      </button>
    </div>
  );
}

function ModalShell({
  titulo,
  onClose,
  children,
}: {
  titulo: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-primary/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-card border border-border p-8 shadow-glow"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-semibold">{titulo}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-secondary hover:bg-muted grid place-items-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function ModalField({
  label,
  value,
  onChange,
  type = "text",
  required,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <input
          type={type}
          step={type === "number" ? "0.01" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  );
}

function SaveButton({ salvando }: { salvando: boolean }) {
  return (
    <button
      type="submit"
      disabled={salvando}
      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold hover:shadow-glow disabled:opacity-60 transition-all"
    >
      {salvando ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
        </>
      ) : (
        "Salvar"
      )}
    </button>
  );
}
