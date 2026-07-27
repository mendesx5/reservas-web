import type {
  Adicional,
  Local,
  ReservaAdmin,
  ReservaCriada,
  ReservaStatus,
  ReservaStatusPublica,
  ResumoFinanceiro,
} from "@/lib/reservas";
import { getAdminToken, logoutAdmin } from "@/lib/admin-auth";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getAdminToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (response.status === 401 && auth) {
    logoutAdmin();
  }

  if (!response.ok) {
    let mensagem = "Não foi possível completar a operação. Tente novamente.";
    try {
      const corpo = await response.json();
      if (corpo?.mensagem) mensagem = corpo.mensagem;
      else if (corpo?.message) mensagem = corpo.message;
    } catch {
      /* sem corpo */
    }
    throw new ApiError(response.status, mensagem);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

/* --------- Público --------- */
export const listarLocais = () => request<Local[]>("/api/public/locais");
export const listarAdicionais = () => request<Adicional[]>("/api/public/adicionais");

export interface CriarReservaPayload {
  localId: number;
  dataInicio: string;
  dataFim: string;
  nomeCliente: string;
  telefoneCliente: string;
  emailCliente?: string;
  adicionais: { adicionalId: number; quantidade: number }[];
}

export const criarReserva = (payload: CriarReservaPayload) =>
  request<ReservaCriada>("/api/public/reservas", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const buscarStatusReserva = (codigoAcesso: string) =>
  request<ReservaStatusPublica>(`/api/public/reservas/${codigoAcesso}`);

/* --------- Auth --------- */
export const login = (email: string, senha: string) =>
  request<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

/* --------- Admin: Reservas --------- */
export const listarReservasAdmin = (status?: ReservaStatus) =>
  request<ReservaAdmin[]>(`/api/admin/reservas${status ? `?status=${status}` : ""}`, {
    auth: true,
  });

export const cancelarReserva = (id: number) =>
  request<void>(`/api/admin/reservas/${id}/cancelar`, { method: "POST", auth: true });

export const confirmarPagamentoReserva = (id: number) =>
  request<void>(`/api/admin/reservas/${id}/confirmar-pagamento`, {
    method: "POST",
    auth: true,
  });

/* --------- Admin: Financeiro --------- */
export const buscarResumoFinanceiro = (periodo: "diario" | "semanal" | "mensal") =>
  request<ResumoFinanceiro>(`/api/admin/financeiro/resumo?periodo=${periodo}`, {
    auth: true,
  });

/* --------- Admin: Locais --------- */
export interface LocalPayload {
  nome: string;
  descricao?: string;
  capacidadeMax?: number;
  precoBase: number;
}

export const listarLocaisAdmin = () => request<Local[]>("/api/admin/locais", { auth: true });
export const criarLocal = (payload: LocalPayload) =>
  request<Local>("/api/admin/locais", { method: "POST", auth: true, body: JSON.stringify(payload) });
export const atualizarLocal = (id: number, payload: LocalPayload) =>
  request<Local>(`/api/admin/locais/${id}`, { method: "PUT", auth: true, body: JSON.stringify(payload) });
export const desativarLocal = (id: number) =>
  request<void>(`/api/admin/locais/${id}`, { method: "DELETE", auth: true });

/* --------- Admin: Adicionais --------- */
export interface AdicionalPayload {
  nome: string;
  descricao?: string;
  preco: number;
}

export const listarAdicionaisAdmin = () =>
  request<Adicional[]>("/api/admin/adicionais", { auth: true });
export const criarAdicional = (payload: AdicionalPayload) =>
  request<Adicional>("/api/admin/adicionais", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
export const atualizarAdicional = (id: number, payload: AdicionalPayload) =>
  request<Adicional>(`/api/admin/adicionais/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
export const desativarAdicional = (id: number) =>
  request<void>(`/api/admin/adicionais/${id}`, { method: "DELETE", auth: true });
