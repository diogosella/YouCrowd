import { NextResponse } from "next/server";
import { askLLM, extractJSON } from "@/lib/llm";
import { simulateSystem } from "@/lib/prompts";
import { normalizeVeredito } from "@/lib/objections";
import { offerToText } from "@/lib/offer";
import { PERSONAS } from "@/lib/personas";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { offer, personaId } = await req.json();
    const persona = PERSONAS.find((p) => p.id === personaId);
    if (!persona) {
      return NextResponse.json({ error: "Persona inválida." }, { status: 400 });
    }

    const raw = await askLLM({
      system: simulateSystem(persona),
      user: offerToText(offer),
      maxTokens: 2000,
    });
    const r = extractJSON(raw);

    return NextResponse.json({
      personaId: persona.id,
      veredito: normalizeVeredito(r.veredito),
      objecao: r.objecao || "",
      o_que_pesou: r.o_que_pesou || "",
    });
  } catch (e: any) {
    console.error(e);
    const status = e?.status === 429 ? 429 : 500;
    const error =
      status === 429
        ? "Limite de requisições da LLM atingido, tente novamente mais tarde"
        : e?.message || "Falha na simulação.";
    return NextResponse.json({ error }, { status });
  }
}
