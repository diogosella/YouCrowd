import type { Offer } from "./types";

export function offerToText(offer: Partial<Offer> = {}): string {
  return [
    "OFERTA EM TESTE",
    `Nome: ${offer.nome || "(sem nome)"}`,
    `Preço: ${offer.preco || "(não informado)"}`,
    `Garantia: ${offer.garantia || "(não informada)"}`,
    "Descrição/copy:",
    offer.copy || "(sem copy)",
  ].join("\n");
}
