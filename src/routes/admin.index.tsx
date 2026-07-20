import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Loader2, Lock, Mail, Waves } from "lucide-react";
import { login, ApiError } from "@/lib/api";
import { setAdminToken } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Buganville Garden" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      const { token } = await login(email, senha);
      setAdminToken(token);
      toast.success("Bem-vindo(a) de volta.");
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-cream">
      {/* Painel decorativo */}
      <div className="hidden md:block relative overflow-hidden gradient-garden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/30 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-terracotta/25 blur-3xl" />
        <div className="relative h-full flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground">
            <span className="h-9 w-9 rounded-full bg-accent grid place-items-center">
              <Waves className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">Buganville Garden</span>
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Área restrita</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold leading-tight text-balance">
              A piscina inteira,
              <br />
              na palma da sua mão.
            </h1>
            <p className="mt-4 text-primary-foreground/80 max-w-sm">
              Agenda, reservas, financeiro, adicionais e locais — tudo no mesmo painel.
            </p>

          </div>
          <p className="text-xs text-primary-foreground/60">
            Este acesso é exclusivo para administração do espaço.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Voltar ao site
          </Link>
          <h2 className="mt-6 font-display text-3xl font-semibold">Entrar no painel</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use o e-mail e senha configurados no servidor.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium">E-mail</label>
              <div className="relative mt-1.5">
                <Mail className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="admin@buganville.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Senha</label>
              <div className="relative mt-1.5">
                <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={carregando}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-semibold hover:shadow-glow disabled:opacity-60 transition-all"
            >
              {carregando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
