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
