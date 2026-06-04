import type { ObjectionCategory, Veredito } from "./types";

export const OBJECTION_CATEGORIES: ObjectionCategory[] = [
  { id: "preco", label: "Preço / custo-benefício" },
  { id: "prova", label: "Falta de prova (resultado / credibilidade)" },
  { id: "relevancia", label: 'Relevância ("não é pra mim")' },
  { id: "desconfianca", label: "Promessa exagerada / desconfiança" },
  { id: "clareza", label: "Clareza da oferta (não entendi o que recebo)" },
  { id: "risco", label: "Risco / garantia fraca" },
];

export const VEREDITOS: Veredito[] = ["compraria", "em dúvida", "não compraria"];

export function normalizeVeredito(v?: string): Veredito {
  const k = (v || "").toLowerCase().trim();
  if (k.includes("não") || k.includes("nao")) return "não compraria";
  if (k.includes("dúvida") || k.includes("duvida") || k.includes("talvez")) return "em dúvida";
  if (k.includes("compraria") || k.includes("sim")) return "compraria";
  return "em dúvida";
}
