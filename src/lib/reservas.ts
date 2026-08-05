export type ReservaStatus =
  | "AGUARDANDO_PAGAMENTO"
  | "CONFIRMADA"
  | "CANCELADA"
  | "EXPIRADA"
  | "CONCLUIDA";

export interface Local {
  id: number;
  nome: string;
  descricao: string | null;
  capacidadeMax: number | null;
  precoBase: number;
  ativo: boolean;
}

export interface Adicional {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  ativo: boolean;
}

export interface AdicionalItem {
  nome: string;
  precoCobrado: number;
  quantidade: number;
}

export interface ReservaCriada {
  codigoAcesso: string;
  checkoutUrl: string;
  valorTotal: number;
  expiraEm: string;
}

export interface ReservaStatusPublica {
  codigoAcesso: string;
  status: ReservaStatus;
  nomeLocal: string;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  checkoutUrl: string | null;
  adicionais: AdicionalItem[];
}

export interface ReservaAdmin {
  id: number;
  codigoAcesso: string;
  status: ReservaStatus;
  nomeLocal: string;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  nomeCliente: string;
  telefoneCliente: string;
  emailCliente: string | null;
  statusPagamento: string | null;
  metodoPagamento: string | null;
  adicionais: AdicionalItem[];
}

export interface FaturamentoItem {
  chave: string;
  valor: number;
}

export interface ResumoFinanceiro {
  totalRecebido: number;
  totalPendente: number;
  qtdConfirmadas: number;
  qtdExpiradas: number;
  faturamentoPorAdicional: FaturamentoItem[];
  faturamentoPorMetodoPagamento: FaturamentoItem[];
}

/**
 * Formata um Date como string local "ingênua" (sem conversão de fuso),
 * no formato que o backend espera para LocalDateTime: YYYY-MM-DDTHH:mm:ss.
 * Evita usar Date.toISOString(), que converte para UTC e desloca o horário
 * em relação ao que o usuário realmente selecionou (ex: 08:00 vira 11:00).
 */
export function paraLocalDateTimeIso(data: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const ano = data.getFullYear();
  const mes = pad(data.getMonth() + 1);
  const dia = pad(data.getDate());
  const hora = pad(data.getHours());
  const min = pad(data.getMinutes());
  const seg = pad(data.getSeconds());
  return `${ano}-${mes}-${dia}T${hora}:${min}:${seg}`;
}

export function formatarReal(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function labelStatus(s: ReservaStatus): string {
  return {
    AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
    CONFIRMADA: "Confirmada",
    CANCELADA: "Cancelada",
    EXPIRADA: "Expirada",
    CONCLUIDA: "Concluída",
  }[s];
}
