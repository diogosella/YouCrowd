import type { Persona } from "./types";

export const PERSONAS: Persona[] = [
  {
    id: "cetico_preco",
    nome: "Cético de preço",
    sigla: "CP",
    postura: "cético",
    perfil:
      "Avalia tudo por custo-benefício e desconfia de preço alto sem prova concreta de resultado.",
    ancora:
      "Reclamação recorrente em reviews: 'caro demais pelo que entrega' e 'cadê a prova de quem já teve resultado?'.",
  },
  {
    id: "iniciante_insegura",
    nome: "Iniciante insegura",
    sigla: "II",
    postura: "insegura",
    perfil:
      "Está começando do absoluto zero e tem medo de comprar algo avançado demais para o nível dela.",
    ancora:
      "Dúvida comum em comentários de anúncio: 'isso serve pra quem nunca fez nada disso antes?'.",
  },
  {
    id: "comparador",
    nome: "Comparador",
    sigla: "CO",
    postura: "analítico",
    perfil:
      "Pesquisa concorrentes antes de decidir e quer saber o que esta oferta tem que as outras não têm.",
    ancora:
      "Comportamento documentado: compara preço e escopo com alternativas antes de fechar a compra.",
  },
  {
    id: "ja_queimado",
    nome: "Já fui queimado",
    sigla: "JQ",
    postura: "desconfiado",
    perfil:
      "Já comprou um infoproduto parecido que não entregou o prometido e hoje desconfia de toda promessa.",
    ancora:
      "Padrão em fóruns e Reclame Aqui: 'comprei algo assim antes e não cumpriu o que prometia'.",
  },
  {
    id: "impulsivo_arrependido",
    nome: "Impulsivo arrependido",
    sigla: "IA",
    postura: "impulsivo",
    perfil:
      "Compra com facilidade no impulso, mas verbaliza a dúvida que depois costuma virar pedido de reembolso.",
    ancora:
      "Padrão de compra por impulso seguida de arrependimento e estorno/chargeback.",
  },
];
