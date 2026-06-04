import { NextResponse } from "next/server";
import { askLLM, extractJSON } from "@/lib/llm";
import { diagnoseSystem } from "@/lib/prompts";
import { PERSONAS } from "@/lib/personas";
import type { Reaction } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { reactions } = await req.json();
    if (!Array.isArray(reactions) || reactions.length === 0) {
      return NextResponse.json({ error: "Sem reações para diagnosticar." }, { status: 400 });
    }

    const resumo = (reactions as Reaction[])
      .map((r) => {
        const p = PERSONAS.find((x) => x.id === r.personaId);
        const nome = p ? p.nome : r.personaId;
        const postura = p ? p.postura : "?";
        return `${nome} (${postura}) -> ${r.veredito}: ${r.objecao}`;
      })
      .join("\n");

    const raw = await askLLM({
      system: diagnoseSystem(),
      user: `Reações do painel (${reactions.length} personas):\n${resumo}`,
      maxTokens: 3000,
    });

    return NextResponse.json(extractJSON(raw));
  } catch (e: any) {
    console.error(e);
    const status = e?.status === 429 ? 429 : 500;
    const error =
      status === 429
        ? "Limite de requisições da LMM atingido."
        : e?.message || "Falha no diagnóstico.";
    return NextResponse.json({ error }, { status });
  }
}
