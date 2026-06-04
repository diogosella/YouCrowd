export type Veredito = "compraria" | "em dúvida" | "não compraria";

export type Status = "idle" | "running" | "done" | "error";

export interface Persona {
  id: string;
  nome: string;
  sigla: string;
  postura: string;
  perfil: string;
  ancora: string;
}

export interface ObjectionCategory {
  id: string;
  label: string;
}

export interface Offer {
  nome: string;
  preco: string;
  garantia: string;
  copy: string;
}

export interface Reaction {
  personaId?: string;
  state: "pending" | "done";
  veredito?: Veredito;
  objecao?: string;
  o_que_pesou?: string;
}

export interface SimulateResult {
  personaId: string;
  veredito: Veredito;
  objecao: string;
  o_que_pesou: string;
}

export interface ObjecaoTop {
  categoria: string;
  tema?: string;
  frequencia?: string;
  exemplo?: string;
}

export interface Diagnosis {
  objecoes_top?: ObjecaoTop[];
  recomendacoes?: string[];
}

export interface PipelineStep {
  key: string;
  label: string;
  sub?: string;
  active: boolean;
  done: boolean;
}
