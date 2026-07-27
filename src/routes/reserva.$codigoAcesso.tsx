import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CheckCircle2, Clock, XCircle, ExternalLink } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { buscarStatusReserva } from "@/lib/api";
import { formatarReal, labelStatus, type ReservaStatus } from "@/lib/reservas";

export const Route = createFileRoute("/reserva/$codigoAcesso")({
  head: () => ({
    meta: [
      { title: "Status da reserva — Buganville Garden" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StatusReservaPage,
});

function StatusReservaPage() {
  const { codigoAcesso } = Route.useParams();
  const query = useQuery({
    queryKey: ["reserva-status", codigoAcesso],
    queryFn: () => buscarStatusReserva(codigoAcesso),
    refetchInterval: (q) => (q.state.data?.status === "AGUARDANDO_PAGAMENTO" ? 5000 : false),
  });

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-16">
        {query.isLoading && (
          <p className="text-center text-muted-foreground">Carregando reserva...</p>
        )}

        {query.isError && (
          <div className="rounded-3xl bg-card border border-border p-10 text-center shadow-soft">
            <XCircle className="h-10 w-10 mx-auto text-destructive" />
            <h1 className="mt-4 font-display text-2xl font-semibold">Reserva não encontrada</h1>
            <p className="mt-3 text-muted-foreground text-sm">
              Verifique se o link está completo e correto.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:shadow-glow transition-all"
            >
              Voltar ao início
            </Link>
          </div>
        )}

        {query.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-card border border-border p-10 shadow-soft"
          >
            <p className="text-xs font-medium text-accent uppercase tracking-[0.3em]">
              Sua reserva
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold">{query.data.nomeLocal}</h1>

            <div className="mt-4">
              <StatusBadge status={query.data.status} />
            </div>

            <dl className="mt-8 space-y-2 text-sm">
              <Row k="Início" v={new Date(query.data.dataInicio).toLocaleString("pt-BR")} />
              <Row k="Fim" v={new Date(query.data.dataFim).toLocaleString("pt-BR")} />
              <Row k="Total" v={formatarReal(query.data.valorTotal)} bold />
            </dl>

            {query.data.adicionais.length > 0 && (
              <div className="mt-6 rounded-2xl bg-secondary/60 p-5">
                <h2 className="text-sm font-semibold">Adicionais</h2>
                <dl className="mt-2 space-y-1 text-sm">
                  {query.data.adicionais.map((a, i) => (
                    <Row
                      key={i}
                      k={`${a.nome} × ${a.quantidade}`}
                      v={formatarReal(a.precoCobrado * a.quantidade)}
                    />
                  ))}
                </dl>
              </div>
            )}

            {query.data.status === "AGUARDANDO_PAGAMENTO" && query.data.checkoutUrl && (
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={query.data.checkoutUrl}
                className="mt-8 flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground py-4 text-sm font-semibold shadow-glow"
              >
                Continuar pelo WhatsApp <ExternalLink className="h-4 w-4" />
              </motion.a>
            )}

            {query.data.status === "CONFIRMADA" && (
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-leaf/10 text-leaf p-5">
                <CheckCircle2 className="h-6 w-6" />
                <p className="text-sm font-medium">
                  Pagamento confirmado. Nos vemos em breve!
                </p>
              </div>
            )}

            {query.data.status === "EXPIRADA" && (
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-muted p-5 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <p className="text-sm">
                  O prazo desta reserva expirou. Faça uma nova reserva se ainda quiser esta data.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </main>
      <SiteFooter />
    </div>
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
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${map[status]}`}
    >
      {labelStatus(status)}
    </span>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={bold ? "font-semibold" : ""}>{v}</dd>
    </div>
  );
}
